/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import { NativeModule, PermissionStatus } from 'react-native';
import { LocationConfiguration, AccuracyAuthorization, LocationProvidersStatus } from './types';


export interface GeolocationNativeModule extends NativeModule{
    /* configure the location service */
    configure: (
        configuration: LocationConfiguration
    ) => Promise<boolean>;

    /* start the location service */
    start: () => void;

    /* Get the `n` last computed geolocation
     * return the list of Location object as string
     */
    getLastLocations: (number: number) => Promise<string>;

    /* Set the provider to get the best location */
    setTemporaryConfiguration: (configuration: LocationConfiguration) => Promise<boolean>;

    /* Reset the provider to configure options */
    revertTemporaryConfiguration: () => void;

    /* Check the ios geolocation authorization */
    checkPermission: () => Promise<boolean>;

    /* Request the ios geolocation authorization */
    askForPermission: () => Promise<PermissionStatus>;

    /* Check the level of location accuracy the app has permission to use */
    checkAccuracyAuthorization: () => Promise<AccuracyAuthorization>;

    /* Check if location settings are coherent with user options and propose a resolution popup if it's possible on Android.
     * it returns a GeolocationError which is CHECK_SETTINGS_FAILURE when either the resolution is not feasible or when
     * it encounter a problem with the pendingIntent */
    checkLocationSettings: () => Promise<void>;

    /* Get the location status for the GPS provider and the Network provider */
    getLocationProvidersStatus: () => Promise<LocationProvidersStatus>;
}
