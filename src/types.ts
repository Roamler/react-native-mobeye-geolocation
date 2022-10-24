/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/**
 * Accuracy authorization levels
 */
export type AccuracyAuthorization = "FullAccuracy" | "ReducedAccuracy";

/**
 * Different types of accuracy
 */
export type AccuracyLevel = "PowerSaving" | "BalancedPower" | "BestAccuracy" | "NavigationAccuracy";

export type LocationConfiguration = {
    desiredAccuracy: AccuracyLevel,
    distanceFilter: number,
    updateInterval: number,
    bufferSize: number,
}

export type Location = {
    latitude: number;
    longitude: number;
    accuracy: number;
    time: number;
    mock: boolean;
}

export type LocationEventSuccess = {
    success: true;
    payload: Location;
}

export type LocationEventError = {
    success: false;
    payload: string;
}

export type LocationEvent = LocationEventSuccess | LocationEventError;

export type LocationProvidersStatus ={
    isGPSLocationEnabled: boolean;
    isNetworkLocationEnabled: boolean
}
