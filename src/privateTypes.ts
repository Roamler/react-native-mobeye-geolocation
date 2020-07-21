/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import { PermissionStatus } from "react-native";

export interface GeolocationNativeModule {
    /* Initiate the location provider */
    initiateLocation: () => Promise<void>;

    /* Get the `n` last computed geolocation
    * return the list of Location object as string
    * */
    getLastLocations: (n: number) => Promise<string>;

    /* Check the ios geolocation authorization */
    checkPermission: () => Promise<boolean>;

    /* request the ios geolocation authorization */
    askForPermission: () => Promise<PermissionStatus>;
}
