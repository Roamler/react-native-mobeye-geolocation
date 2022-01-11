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
import { NativeEventEmitter, PermissionStatus, Platform } from 'react-native';
import { useEffect, useState } from 'react';

/* get native module */
const { start, revertTemporaryConfiguration } = MobeyeGeolocation;

/* init default configuration */
const _configuration: LocationConfiguration = DEFAULT_CONFIGURATION;

export function configure(configuration?: Partial<LocationConfiguration>): void {
    MobeyeGeolocation.configure({
        ..._configuration,
        ...configuration
    });
}

export function setTemporaryConfiguration(configuration?: Partial<LocationConfiguration>): void {
    MobeyeGeolocation.setTemporaryConfiguration({
        ..._configuration,
        ...configuration
    });
}

/**
 * Get last `n` last locations computed by the service.
 * @param n last computed locations
 */
export function getLastLocations(n: number): Promise<[Location]> {
    return MobeyeGeolocation.getLastLocations(n).then((result) => {
        const locations: [Location] = JSON.parse(result);

        if (Platform.OS === 'ios') {
            locations.forEach(location => {
                location.mock = false
            })

        }

        return locations;
    });
}

/**
 * Check location accuracy authorization for ios.
 */
export function checkAccuracyAuthorization(): Promise<AccuracyAuthorization> {
    return MobeyeGeolocation.checkAccuracyAuthorization();
}

/**
 * Check location authorization for iOS.
 * To check for android just use AndroidPermissions
 */
export function checkIOSAuthorization(): Promise<boolean> {
    return MobeyeGeolocation.checkPermission();
}

/**
 * Request location authorization for iOS.
 * To request for android just use AndroidPermissions
 */
export function requestIOSAuthorization(): Promise<PermissionStatus> {
    return MobeyeGeolocation.askForPermission();
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

        getLastLocations(1).then((res) => {
            res[0] && setLocation(res[0])
        }).catch(console.log);



        /* subscribe to the listener */
        const subscription = locationEmitter.addListener('LOCATION_UPDATED', (result: LocationEvent) => {
            if (result.success) {
                setLocation(result.payload);
            }
        });
        return () => subscription.remove();
    }, []);

    if (Platform.OS === 'ios') {
        location.mock = false
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
    getLastLocations,
    checkIOSAuthorization,
    requestIOSAuthorization,
    checkAccuracyAuthorization,
    getAndroidLocationProvidersStatus,
    checkAndroidLocationSettings,
};
