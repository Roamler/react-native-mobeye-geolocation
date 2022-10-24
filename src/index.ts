/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import MobeyeGeolocation from './nativeModule';
import DEFAULT_CONFIGURATION from './defaultConfiguration';
import {
    AccuracyAuthorization,
    Location,
    LocationConfiguration,
    LocationEvent,
    LocationProvidersStatus,
} from './types';
import { NativeEventEmitter, PermissionsAndroid, PermissionStatus, Platform } from 'react-native';
import { useEffect, useState } from 'react';

/* init default configuration */
const _configuration: LocationConfiguration = DEFAULT_CONFIGURATION;

export function configure(configuration?: Partial<LocationConfiguration>): Promise<void> {
    return MobeyeGeolocation.configure({
        ..._configuration,
        ...configuration,
    });
}

export function start(): void {
    MobeyeGeolocation.start();
}

export function setTemporaryConfiguration(configuration?: Partial<LocationConfiguration>): Promise<void> {
    return MobeyeGeolocation.setTemporaryConfiguration({
        ..._configuration,
        ...configuration,
    });
}

export function revertTemporaryConfiguration(): void {
    MobeyeGeolocation.revertTemporaryConfiguration();
}

/**
 * Get last `n` last locations computed by the service.
 * @param n last computed locations
 */
export function getLastLocations(n: number): Promise<[Location]> {
    return MobeyeGeolocation.getLastLocations(n).then((result) => {
        const locations: [Location] = JSON.parse(result);

        if (Platform.OS === 'ios') {
            locations.forEach((location) => {
                location.mock = false;
            });
        }

        return locations;
    });
}

/**
 * Check location accuracy authorization.
 */
export function checkAccuracyAuthorization(): Promise<AccuracyAuthorization> {
    if (Platform.OS === 'ios') {
        return MobeyeGeolocation.checkAccuracyAuthorization();
    } else {
        /* Checking fine location permission will give us the information on whether the user has activated precise
        location or not */
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((isAuthorized) => {
            return isAuthorized ? 'FullAccuracy' : 'ReducedAccuracy';
        });
    }
}

/**
 * Check location authorization.
 */
export function checkAuthorization(): Promise<boolean> {
    if (Platform.OS === 'ios') {
        return MobeyeGeolocation.checkPermission();
    } else {
        // Checking only the coarse location permission is enough to know whether we have access to user location or not
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }
}

/**
 * Request location authorization.
 */
export function requestAuthorization(): Promise<PermissionStatus> {
    if (Platform.OS === 'ios') {
        return MobeyeGeolocation.askForPermission();
    } else {
        /* For location permissions request, and starting from android 12+, we need to request
         * both permissions, FINE and COARSE, in order to have access to user precise location */
        return PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]).then((statusArray) => {
            /* In order to check the location permission, it is enough to check the coarse permission status */
            return statusArray[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
        });
    }
}

/* Get the location status for the GPS provider and the Network provider on Android */
export function getAndroidLocationProvidersStatus(): Promise<LocationProvidersStatus> {
    return MobeyeGeolocation.getLocationProvidersStatus();
}

/* Check if location settings are coherent with user options and propose a resolution popup if it's possible on Android.
 * it returns a GeolocationError which is CHECK_SETTINGS_FAILURE when either the resolution is not feasible or when
 * it encounter a problem with the pendingIntent */
export function checkAndroidLocationSettings(): Promise<void> {
    return MobeyeGeolocation.checkLocationSettings();
}

/* Native event emitter to catch geolocations event */
export const locationEmitter = new NativeEventEmitter(MobeyeGeolocation);

/**
 * A React Hook which updates when the location significantly changes.
 */
export function useLocation(): Location {
    const [location, setLocation] = useState<Location>({
        latitude: -1,
        longitude: -1,
        accuracy: Number.MAX_SAFE_INTEGER,
        time: 0,
        mock: false,
    });

    useEffect(() => {
        /* get last known use position */
        getLastLocations(1)
            .then((res) => {
                res[0] && setLocation(res[0]);
            })
            .catch(console.log);

        /* subscribe to the listener */
        const subscription = locationEmitter.addListener('LOCATION_UPDATED', (result: LocationEvent) => {
            if (result.success) {
                setLocation(result.payload);
            } else {
                console.log(result.payload);
            }
        });
        return () => subscription.remove();
    }, []);

    if (Platform.OS === 'ios') {
        location.mock = false;
    }

    return location;
}

export * from './types';
export default {
    configure,
    start,
    setTemporaryConfiguration,
    revertTemporaryConfiguration,
    locationEmitter,
    useLocation,
    getLastLocations,
    checkAuthorization,
    requestAuthorization,
    checkAccuracyAuthorization,
    getAndroidLocationProvidersStatus,
    checkAndroidLocationSettings,
};
