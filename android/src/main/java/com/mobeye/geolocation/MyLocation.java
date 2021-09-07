package com.mobeye.geolocation;

import android.location.Location;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class MyLocation {

    public MyLocation() {}

    public MyLocation(Location l) {
        this.provider = l.getProvider();
        this.latitude = l.getLatitude();
        this.longitude = l.getLongitude();
        this.accuracy = l.getAccuracy();
        this.time = l.getTime();
        this.mock = l.isFromMockProvider();
    }

    /**
     * Compute the distance between two points in meters.
     * @param latitude Double
     * @param longitude Double
     * @return Distance between this location and the one specified by latitude and longitude
     */
    public Float distanceTo(Double latitude, Double longitude) {
        float[] results = new float[1];
        Location.distanceBetween(this.latitude, this.longitude, latitude, longitude, results);
        return results[0];
    }

    public String getProvider() {
        return provider;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Float getAccuracy() {
        return accuracy;
    }

    public Long getTime() {
        return time;
    }

    public Boolean isFromMockProvider() {
        return mock;
    }

    @SerializedName("provider")
    @Expose
    private String provider;
    @SerializedName("longitude")
    @Expose
    private double longitude;
    @SerializedName("latitude")
    @Expose
    private double latitude;
    @SerializedName("accuracy")
    @Expose
    private float accuracy;
    @SerializedName("time")
    @Expose
    private long time;
    @SerializedName("mock")
    @Expose
    private boolean mock;

    public String toString(){
        return this.getProvider() + ": " + this.getLatitude() + ", " + this.getLongitude()
                + " acc: " + this.getAccuracy() + " time: " + this.getTime() + " mock: " + this.isFromMockProvider();
    }

    public WritableMap toMap(){
        WritableMap locationMap = Arguments.createMap();
        locationMap.putDouble("longitude", this.getLongitude());
        locationMap.putDouble("latitude", this.getLatitude());
        locationMap.putDouble("accuracy", this.getAccuracy());
        locationMap.putDouble("time", this.getTime());
        locationMap.putBoolean("mock", this.isFromMockProvider());
        return locationMap;
    }
}
