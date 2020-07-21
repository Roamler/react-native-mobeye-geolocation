/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import MobeyeGeolocation from './nativeModule';
import { Location } from './types';
import { PermissionStatus } from 'react-native';

/**
 * Start location service
 */
export function initiateLocation(): void {
    MobeyeGeolocation.initiateLocation();
}

/**
 * Get last `n` last locations computed by the service.
 * @param n last computed locations
 */
export function getLastLocations(n: number): Promise<[Location]> {
    return MobeyeGeolocation.getLastLocations(n).then((result) => {
        const locations: [Location] = JSON.parse(result);
        return locations;
    });
}

/**
 * Check location authorization for iOS.
 * To check for android just use AndroidPermissions
 */
export function checkIOSLocationAuthorization(): Promise<boolean> {
    return MobeyeGeolocation.checkPermission();
}

/**
 * Request location authorization for iOS.
 * To request for android just use AndroidPermissions
 */
export function requestIOSLocationAuthorizatrion(): Promise<PermissionStatus> {
    return MobeyeGeolocation.askForPermission();
}
