package com.mobeye.geolocation;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class LocationConfiguration {
    public LocationConfiguration(){}

    public LevelAccuracy getDesiredAccuracy() {
        return desiredAccuracy;
    }

    public int getDistanceFilter() {
        return distanceFilter;
    }

    public int getUpdateInterval() {
        return updateInterval;
    }

    public int getBufferSize() {
        return bufferSize;
    }

    @SerializedName("desiredAccuracy")
    @Expose
    private LevelAccuracy desiredAccuracy;
    @SerializedName("distanceFilter")
    @Expose
    private int distanceFilter;
    @SerializedName("updateInterval")
    @Expose
    private int updateInterval;
    @SerializedName("bufferSize")
    @Expose
    private int bufferSize;
}
