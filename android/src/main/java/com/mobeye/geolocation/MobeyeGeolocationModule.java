package com.mobeye.geolocation;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import static androidx.core.content.ContextCompat.checkSelfPermission;


/**
 * Location module using FusedLocationProviderClient.
 */
public class MobeyeGeolocationModule extends ReactContextBaseJavaModule implements LifecycleEventListener,
        ActivityEventListener {
    private static final List<String> NULL_STORE_ARRAY = Arrays.asList("null", "", "[]");
    private static final Type DEQUE_TYPE = new TypeToken<Deque<MyLocation>>() {
    }.getType();
    private static final Gson GSON = new Gson();
    private static String LOCATION_UPDATED = "LOCATION_UPDATED";

    private ReactContext mReactContext;
    private SharedPreferences mPreferences;
    /* FIXME use a RingBuffer instead of Deque */
    private Deque<MyLocation> mBufferedLocations;
    private LocationConfiguration mInitialConfiguration;
    private LocationConfiguration mCurrentConfiguration;
    private FusedLocationProviderClient mLocationProvider;
    private LocationRequest mLocationRequest = new LocationRequest();
    private SettingsClient mSettingsClient;
    private LocationSettingsRequest mLocationSettingsRequest;
    private MyLocation mLastUsedLocation;
    private Boolean mInBackground;

    public MobeyeGeolocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mReactContext.addLifecycleEventListener(this);
        mReactContext.addActivityEventListener(this);
        mPreferences = reactContext.getSharedPreferences("com.mobeye.geolocation.sharedpref", Context.MODE_PRIVATE);
        mInBackground = false;
    }

    /**
     * Gets the name of the module.
     * @return Name of the module
     */
    @NonNull
    @Override
    public String getName() {
        return "MobeyeGeolocation";
    }

    /**
     * Initiate the location provider.
     * @param promise a promise that returns the result to the JS code
     */
    @ReactMethod
    public void configure(ReadableMap configuration, Promise promise) {
        JsonElement jsonElement = GSON.toJsonTree(configuration.toHashMap());
        try {
            mInitialConfiguration = GSON.fromJson(jsonElement, LocationConfiguration.class);
        } catch (JsonParseException e) {
            GeolocationError err = GeolocationError.INVALID_CONFIGURATION;
            promise.reject(String.valueOf(err.getCode()), err.getDescription());
            return;
        }
        mCurrentConfiguration = mInitialConfiguration;
        mBufferedLocations = new ArrayDeque<>(mInitialConfiguration.getBufferSize());
        /* create provider and get settings client */
        mLocationProvider = LocationServices.getFusedLocationProviderClient(
                getReactApplicationContext());
        /* get stored data */
        getStoredData();
        /* define options */
        setLocationOptions();
    }

    @ReactMethod
    public void start() {
        /* check options is coherent with authorisation and start location service */
        checkLocationSettings();
        startUpdatingLocation();
    }

    /**
     * Get last locations computed by the provider.
     * @param number `number` last computed locations.
     * @param promise a promise that returns a list of locations to the JS code.
     */
    @ReactMethod
    public void getLastLocations(Integer number, Promise promise) {
        if (mBufferedLocations == null) {
            GeolocationError err = GeolocationError.NO_LOCATION_AVAILABLE;
            promise.reject(String.valueOf(err.getCode()), err.getDescription());
            return;
        }
        Iterator<MyLocation> iterator = mBufferedLocations.descendingIterator();
        List<MyLocation> locationList = new ArrayList<>();
        int i = 0;

        while (iterator.hasNext() && i < number) {
            locationList.add(iterator.next());
            i++;
        }
        String json = GSON.toJson(locationList);
        promise.resolve(json);
    }

    @ReactMethod
    public void setTemporaryConfiguration(ReadableMap configuration, Promise promise) {
        JsonElement jsonElement = GSON.toJsonTree(configuration.toHashMap());
        try {
            mCurrentConfiguration = GSON.fromJson(jsonElement, LocationConfiguration.class);
        } catch (JsonParseException e) {
            GeolocationError err = GeolocationError.INVALID_CONFIGURATION;
            promise.reject(String.valueOf(err.getCode()), err.getDescription());
            return;
        }
        resetLocationProvider();
        promise.resolve(true);
    }

    @ReactMethod
    public void revertTemporaryConfiguration() {
        mCurrentConfiguration = mInitialConfiguration;
        resetLocationProvider();
    }

    /**
     * Check accuracy authorizaiton.
     */
    @ReactMethod
    public void checkAccuracyAuthorization(Promise promise){
        if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            promise.resolve(AccuracyAuthorization.FULL_ACCURACY);
        } else {
            promise.resolve(AccuracyAuthorization.REDUCED_ACCURACY);
        }
    }

    /**
     * Update the used location by React to provide the mission list.
     * This variable is used to know if the user location has significantly changed.
     */
    private void updateLastUsedLocation() {
        try {
            mLastUsedLocation = mBufferedLocations.getLast();
        }
        catch (NoSuchElementException e) {
            return;
        }
        String json = GSON.toJson(mLastUsedLocation);
        SharedPreferences.Editor editor = mPreferences.edit();
        editor.putString(StoreKeys.LAST_USED_LOCATION.name(), json);
        editor.apply();
    }

    private void resetLocationProvider() {
        stopUpdatingLocation();
        setLocationOptions();
        checkLocationSettings();
        startUpdatingLocation();
    }

    /**
     * Method executed when the app start or go to foreground
     */
    @Override
    public void onHostResume() {
        if (mLocationProvider != null) {
            mInBackground = false;
            resetLocationProvider();

        }
    }

    /**
     * Method executed when the app is in background.
     */
    @Override
    public void onHostPause() {
        /* the pop-up to accept authorization trigger the pause and save an empty buffer */
        if (!mBufferedLocations.isEmpty()) {
            /* save the bufferedLocations in sharedPref */
            writeBufferInStore();
        }

        /* change options */
        mInBackground = true;
        resetLocationProvider();
    }

    /**
     * Method executed when the app is destroyed.
     */
    @Override
    public void onHostDestroy() {}

    /**
     * Method executed when `resolvable.startResolutionForResult` is executed.
     * @param activity Activity
     * @param requestCode Code of the resolution request
     * @param resultCode Result code of the user answer
     * @param data Intent
     */
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {}

    @Override
    public void onNewIntent(Intent intent) {}

    /**
     * Set provider options if the app is in background or foreground.
     * Option in background use less battery.
     */
    private void setLocationOptions() {
        if (mInBackground) {
            mLocationRequest.setPriority(LocationRequest.PRIORITY_LOW_POWER);
            mLocationRequest.setInterval(60 * 1000);
            mLocationRequest.setSmallestDisplacement(500);
        } else {
            mLocationRequest.setPriority(
                    LevelAccuracy.PRIORITY_MAP.get(mCurrentConfiguration.getDesiredAccuracy()));
            mLocationRequest.setInterval(mCurrentConfiguration.getUpdateInterval());
            mLocationRequest.setSmallestDisplacement(mCurrentConfiguration.getDistanceFilter());
        }
    }

    /**
     * Check if location settings are coherent with user options.
     * @param promise a promise that returns the result to the JS code
     */
    private void checkLocationSettings(final Promise promise) {
        checkLocationSettings();

        Task<LocationSettingsResponse> task = mSettingsClient.checkLocationSettings(
                mLocationSettingsRequest);

        /* On success, start the provider to update the location */
        task.addOnSuccessListener(new OnSuccessListener<LocationSettingsResponse>() {
            @Override
            public void onSuccess(LocationSettingsResponse locationSettingsResponse) {
                /* All location settings are satisfied. The client can initialize
                 * location requests here.
                 */
                startUpdatingLocation();
                promise.resolve(null);
            }
        });

        /* On failure, reject the promise to ask authorisation */
        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                GeolocationError err = GeolocationError.LOCATION_FAILED;
                promise.reject(String.valueOf(err.getCode()), err.getDescription());
            }
        });
    }

    private void checkLocationSettings() {
        mSettingsClient = LocationServices.getSettingsClient(getReactApplicationContext());
        mLocationSettingsRequest = new LocationSettingsRequest.Builder()
                .addLocationRequest(mLocationRequest)
                .build();
    }

    /**
     * Initiate buffer and lastUpdatedLocation with stored data.
     */
    private void getStoredData(){
        /* Get information from disk */
        String locationListString = mPreferences.getString(StoreKeys.LOCATIONS.name(), "");
        if (!NULL_STORE_ARRAY.contains(locationListString)) {
            mBufferedLocations = GSON.fromJson(
                    locationListString,
                    DEQUE_TYPE);
        }
        /* Get last used location */
        String lastUsedLocation = mPreferences.getString(StoreKeys.LAST_USED_LOCATION.name(), "");
        if (!NULL_STORE_ARRAY.contains(lastUsedLocation)) {
            mLastUsedLocation = GSON.fromJson(lastUsedLocation, MyLocation.class);
            MyLocation newLocation = mBufferedLocations.getLast();
            if (mLastUsedLocation.distanceTo(newLocation.getLatitude(), newLocation.getLongitude()) > 100) {
                updateLastUsedLocation();

                WritableMap body = Arguments.createMap();
                body.putBoolean("success", true);
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(LOCATION_UPDATED, body);
            }
        }
    }

    /**
     * Start the location capture if application has permissions.
     */
    private void startUpdatingLocation() {
        /* first run the provider may be null */
        if (mLocationProvider == null) {
            return;
        }
        int finePermission = checkSelfPermission(mReactContext,
                Manifest.permission.ACCESS_FINE_LOCATION);
        int coarsePermission = checkSelfPermission(mReactContext,
                Manifest.permission.ACCESS_COARSE_LOCATION);
        if (finePermission != PackageManager.PERMISSION_GRANTED
                && coarsePermission != PackageManager.PERMISSION_GRANTED) {
            /* TODO: Consider calling
             *    Activity#requestPermissions
             * here to request the missing permissions, and then overriding
             *   public void onRequestPermissionsResult(int requestCode, String[] permissions,
             *                                          int[] grantResults)
             * to handle the case where the user grants the permission. See the documentation
             * for Activity#requestPermissions for more details.
             */
            return;
        }
        mLocationProvider.requestLocationUpdates(mLocationRequest, locationCallback, null);
    }

    /**
     * Stop the location capture.
     */
    private void stopUpdatingLocation() {
        /* first run the provider may be null */
        if (mLocationProvider == null) {
            return;
        }
        mLocationProvider.removeLocationUpdates(locationCallback);
    }

    /**
     * Write the buffer in the store.
     */
    private void writeBufferInStore() {
        String locationListString = GSON.toJson(mBufferedLocations, DEQUE_TYPE);
        SharedPreferences.Editor editor = mPreferences.edit();
        editor.putString(StoreKeys.LOCATIONS.name(), locationListString);
        editor.apply();
    }

    /**
     * Add a new location in the buffer and return if the location has changed.
     * @param location MyLocation object
     * @return boolean that indicates if the user location has significantly change.
     */
    private void addBufferedLocation(MyLocation location) {
        int bufferSize = mInitialConfiguration.getBufferSize();
        /* while loop to avoid memory leak */
        while (mBufferedLocations.size() >= bufferSize) {
            mBufferedLocations.remove();
        }
        mBufferedLocations.add(location);
    }

    /**
     * Callback that transforms detected locations objects as String array and stores it
     * in the buffer.
     * Emits an event if the user location changes significantly.
     */
    private LocationCallback locationCallback = new LocationCallback() {
        @Override
        public void onLocationResult(LocationResult locationResult) {
            if (locationResult == null) {
                return;
            }

            MyLocation lastLocation = null;
            /* for now, setMaxWaitTime is not set so locationResult must have only one location */
            for (Location location : locationResult.getLocations()) {
                lastLocation = new MyLocation(location);
                addBufferedLocation(lastLocation);
            }

            /* In background the callback is every 500 meters
             * All background new location must be saved */
            if (mInBackground) {
                writeBufferInStore();
            }

            /* update last used location */
            updateLastUsedLocation();
            /* Emits event with lastLocation */
            WritableMap body = Arguments.createMap();
            body.putBoolean("success", true);
            body.putMap("payload", lastLocation.toMap());
            mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(LOCATION_UPDATED, body);
        }
    };
}
