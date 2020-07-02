package com.mobeye.geolocation.utils;

public enum BusinessError {
    LOCATION(5, "Location failed"),
    USER_REJECT_LOCATION(50, "User reject to activate his geolocation"),
    NO_LOCATION_AVAILABLE(51, "No location in buffer");

    private final int code;
    private final String description;

    BusinessError(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public int getCode() {
        return code;
    }

    public static BusinessError getByCode(int errorCode) {
        for (BusinessError e : values()) {
            if (e.code == errorCode) return e;
        }
        throw new RuntimeException();
    }

    @Override
    public String toString() {
        return code + ": " + description;
    }
}
