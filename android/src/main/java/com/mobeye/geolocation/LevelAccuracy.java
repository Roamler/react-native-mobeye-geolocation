package com.mobeye.geolocation;

import com.google.android.gms.location.Priority;
import com.google.gson.annotations.SerializedName;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public enum LevelAccuracy {
    @SerializedName("PowerSaving") POWER_SAVING,
    @SerializedName("BalancedPower") BALANCED_POWER,
    @SerializedName("BestAccuracy") BEST_ACCURACY,
    @SerializedName("NavigationAccuracy") NAVIGATION_ACCURACY;

    static final Map<LevelAccuracy, Integer> PRIORITY_MAP;
    static {
        Map<LevelAccuracy, Integer> tmpMap = new HashMap<>();
        tmpMap.put(LevelAccuracy.POWER_SAVING, Priority.PRIORITY_LOW_POWER);
        tmpMap.put(LevelAccuracy.BALANCED_POWER, Priority.PRIORITY_BALANCED_POWER_ACCURACY);
        tmpMap.put(LevelAccuracy.BEST_ACCURACY, Priority.PRIORITY_HIGH_ACCURACY);
        tmpMap.put(LevelAccuracy.NAVIGATION_ACCURACY, Priority.PRIORITY_HIGH_ACCURACY);
        PRIORITY_MAP = Collections.unmodifiableMap(tmpMap);
    }
}