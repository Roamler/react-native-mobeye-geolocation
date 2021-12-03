package com.mobeye.geolocation;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 *
 */
public class MobeyeLocationCheck extends BroadcastReceiver {
    private ReactApplicationContext mReactContext;
    public static final String LOCATION_CHECK_EVENT = "Location_check";

    public MobeyeLocationCheck(ReactApplicationContext reactContext){
        this.mReactContext = reactContext;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        boolean isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        boolean isNetworkLocationEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        sendLocationStatusEvent(isGPSEnabled, isNetworkLocationEnabled, mReactContext);
    }

    public  void sendLocationStatusEvent(boolean isGPSEnabled, boolean isNetworkLocationEnabled, ReactContext reactContext) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("isGPSLocationEnabled", isGPSEnabled);
        params.putBoolean("isNetworkLocationEnabled", isNetworkLocationEnabled);
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(LOCATION_CHECK_EVENT, params);
    }
}
