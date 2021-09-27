/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import { EventSubscriptionVendor, PermissionStatus } from 'react-native';
import { LocationConfiguration, AccuracyAuthorization } from './types';

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
    setTemporaryConfiguration: (configuration: LocationConfiguration) => Promise<boolean>;

    /* Reset the provider to configure options */
    revertTemporaryConfiguration: () => void;

    /* Check the ios geolocation authorization */
    checkPermission: () => Promise<boolean>;

    /* Request the ios geolocation authorization */
    askForPermission: () => Promise<PermissionStatus>;

    /* Check the level of location accuracy the app has permission to use */
    checkAccuracyAuthorization: () => Promise<AccuracyAuthorization>;
}
