package com.mobeye.geolocation;

public enum GeolocationError {
    LOCATION_FAILED(1, "Location service failed."),
    NO_LOCATION_AVAILABLE(2, "No location in buffer"),
    LOCATION_NOT_CONFIGURED(3, "Location service is not configured"),
    INVALID_CONFIGURATION(4, "Configuration is invalid"),
    UNKNOWN_AUTHORIZATION_STATUT(5, "Unknow authorization status");

    private final int code;
    private final String description;

    GeolocationError(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public int getCode() {
        return code;
    }

    public static GeolocationError getByCode(int errorCode) {
        for (GeolocationError e : values()) {
            if (e.code == errorCode) return e;
        }
        throw new RuntimeException();
    }

    @Override
    public String toString() {
        return code + ": " + description;
    }
}
