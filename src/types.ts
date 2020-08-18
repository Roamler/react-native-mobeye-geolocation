/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/**
 * iOS location error, android seems to never throw errors
 */
export enum LocationError {
    locationUnknown = 0, // simple error the service will keep trying
    denied = 1, // user unauthorized location update
    headingFailure= 3, // heading could not be determined because of strong interference from nearby magnetic fields
}

export type Location = {
    latitude: number;
    longitude: number;
    accuracy: number;
    time: number;
}

export type LocationEventSuccess = {
    success: true;
    payload: Location;
}

export type LocationEventError = {
    success: false;
    payload: LocationError;
}

export type LocationEvent = LocationEventSuccess | LocationEventError;
