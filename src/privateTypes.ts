/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import { EventSubscriptionVendor, PermissionStatus } from 'react-native';
import { LocationConfiguration } from './types';

export interface GeolocationNativeModule extends EventSubscriptionVendor{
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
    startBestAccuracyLocation: (distance: number) => void;

    /* Reset the provider to configure options */
    stopBestAccuracyLocation: () => void;

    /* Check the ios geolocation authorization */
    checkPermission: () => Promise<boolean>;

    /* Request the ios geolocation authorization */
    askForPermission: () => Promise<PermissionStatus>;
}
