# React Native Mobeye Geolocation

React Native Geolocation API for Android and iOS. It allows to get geolocation as well in background as in foreground.

<p align="center" >
  <a href="https://www.npmjs.com/package/@mobeye/react-native-geolocation"><img src="https://img.shields.io/npm/dm/@mobeye/react-native-geolocation.svg?style=flat-square" alt="NPM downloads"></a>
  <a href="https://www.npmjs.com/package/@mobeye/react-native-geolocation"><img src="https://img.shields.io/npm/v/@mobeye/react-native-geolocation.svg?style=flat-square" alt="NPM version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/github/license/Mobeye/react-native-mobeye-geolocation.svg?style=flat-square" alt="License"></a>
</p>
<p align="center" >
  <a href="https://github.com/Mobeye/react-native-mobeye-geolocation/commits/master"><img src="https://img.shields.io/github/commit-activity/m/Mobeye/react-native-mobeye-geolocation.svg?style=flat-square" alt="Commit activity"></a>
  <a href="https://github.com/Mobeye/react-native-mobeye-geolocation/commits/master"><img src="https://img.shields.io/github/last-commit/Mobeye/react-native-mobeye-geolocation.svg?style=flat-square" alt="Last Commit"></a>
  <a href="https://github.com/Mobeye/react-native-mobeye-geolocation/releases"><img src="https://img.shields.io/github/commits-since/Mobeye/react-native-mobeye-geolocation/latest.svg?style=flat-square" alt="Last commit since release"></a>
</p>

---

## Table of Contents

-   [React Native Mobeye Geolocation](#react-native-mobeye-geolocation)
    -   [Getting started](#getting-started)
    -   [General Usage](#general-usage)
    -   [API](#API)
    -   [Example](#example)
    -   [License](#license)

## Getting started

Install the library using Yarn:

```bash
yarn add @mobeye/react-native-geolocation
```

## General Usage

see the [example](https://github.com/Mobeye/react-native-mobeye-geolocation/blob/master/example/App.tsx) for more complete usage

```javascript
import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import Geolocation, { useLocation } from '@mobeye/react-native-geolocation';

export const App = () => {
    const [permission, setPermission] = useState(false);
    const prevPermission = useRef(false);
    const location = useLocation();

    useEffect(() => {
        Geolocation.configuration(10, 500, 'BalancedPower');
        if (Platform.OS === 'ios') {
            Geolocation.checkIOSAuthorization().then((res) => {
                setPermission(res);
            });
        } else {
            PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION').then((res) => {
                setPermission(res);
            });
        }
    }, []);

    useEffect(() => {
        if (!prevPermission.current && permission) {
            Geolocation.start();
        }
        prevPermission.current = permission;
    }, [permission]);

    return (
        <View>
            <Text>Latitude: {location.latitude.toString()}</Text>
            <Text>Longitude: {location.longitude.toString()}</Text>
            <Text>Accuracy: {location.accuracy.toString()}</Text>
            <Text>Is from mock provider: {location.mock.toString()}</Text>
        </View>
    );
};
```

## API

-   **Types:**
    -   [`AccuracyLevel`](#accuracylevel)
    -   [`AccuracyAuthorization`](#accuracyauthorization)
    -   [`LocationProvidersStatus`](#locationprovidersstatus)
    -   [`LocationConfiguration`](#locationconfiguration)
    -   [`Location`](#location)
    -   [`Errors`](#errors)
-   **Methods:**
    -   [`configure()`](#configure)
    -   [`start()`](#start)
    -   [`useLocation()`](#uselocation)
    -   [`setTemporaryConfiguration()`](#settemporaryconfiguration)
    -   [`revertTemporaryConfiguration()`](#reverttemporaryconfiguration)
    -   [`checkIOSauthorization()`](#checkiosauthorization)
    -   [`requestIOSauthorization()`](#requestiosauthorization)
    -   [`checkIOSAccuracyAuthorization()`](#checkiosaccuracyauthorization)
    -   [`getAndroidLocationProvidersStatus()`](#getandroidlocationprovidersstatus)
    -   [`checkAndroidLocationSettings()`](#checkandroidlocationsettings)

### Types

#### `LocationConfiguration`

The configuration options for the library:

| Property          | Type                              | Description                                                                                           |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `distanceFilter`  | `number`                          | The minimum distance in meters a device must move before an update event is generated.                |
| `desiredAccuracy` | [`AccuracyLevel`](#accuracylevel) | The accuracy of the location data that your app wants to receive.                                     |
| `updateInterval`  | `number`                          | The rate in milliseconds at which your app prefers to receive location updates. Used only by Android. |
| `bufferSize`      | `number`                          | The number of previous computed location keeps in memory.                                             |

#### `AccuracyLevel`

Describes different accuracy level available:

| Value                  | Description                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `'PowerSaving'`        | Largely relies on cell towers and avoids GPS and Wi-Fi inputs, providing coarse (city-level) accuracy with minimal battery drain.          |
| `'BalancedPower'`      | Typically uses a combination of Wi-Fi and cell information to compute device location. Very rarely uses GPS.                               |
| `'BestAccuracy'`       | Provides the most accurate location possible, which is computed using as many inputs as necessary and may cause significant battery drain. |
| `'NavigationAccuracy'` | This level of accuracy is intended for use in navigation apps that require precise position information at all times.                      |

Note that the `NavigationAccuracy` and `BestAccuracy` have the same effect on Android and that `NavigationAccuracy` is usable only if the phone is plugged in.

#### `AccuracyAuthorization`

Describes different accuracy authorization levels:

| Value               | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `'ReducedAccuracy'` | Only approximate location is available.                                       |
| `'FullAccuracy'`    | Precise location is available, the `'AccuracyLevel'` can be set to any value. |

#### `LocationProvidersStatus`

Describes location providers status on android phones:

| Property                   | Type      | Description                                                        |
| -------------------------- | --------- | ------------------------------------------------------------------ |
| `isGPSLocationEnabled`     | `boolean` | Represents the status of the GPS location provider on android.     |
| `isNetworkLocationEnabled` | `boolean` | Represents the status of the Network location provider on android. |

#### `Location`

Describe a computed location:

| Property    | Type      | Description                                                                                                                                                                                                   |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `latitude`  | `number`  | The latitude in degrees. Positive values indicate latitudes north of the equator. Negative values indicate latitudes south of the equator.                                                                    |
| `longitude` | `number`  | The longitude in degrees. Measurements are relative to the zero meridian, with positive values extending east of the meridian and negative values extending west of the meridian.                             |
| `accuracy`  | `number`  | The location’s latitude and longitude identify the center of the circle, and this value indicates the radius in meter of that circle. A negative value indicates that the latitude and longitude are invalid. |
| `time`      | `number`  | The time at which this location was determined. It is an Unix Time Stamp in seconds.                                                                                                                          |
| `mock`      | `boolean` | Returns true if the Location came from a mock provider. Works only for Android, always return false on IOS                                                                                                    |

#### `Errors`

You can encounter some errors that are described in this table:

| Code | Name                             | Description                                                   |
| ---- | -------------------------------- | ------------------------------------------------------------- |
| `1`  | `USER_REJECT_LOCATION`           | The user forbids the using of his geolocation.                |
| `2`  | `NO_LOCATION_AVAILABLE`          | No locations available saved in the buffer.                   |
| `3`  | `LOCATION_NOT_CONFIGURED`        | You must configure the service before employing some methods. |
| `4`  | `INVALID_CONFIGURATION`          | The requested configuration is not valid.                     |
| `5`  | `UNKNOWN_AUTHORIZATION_STATUS`   | Apple may add new authorizations that are unknown.            |
| `6`  | `UNKNOWN_ACCURACY_AUTHORIZATION` | Apple may add new accuracy authorizations that are unknown.   |

### Methods

#### `configure()`

Configure the library with the given configuration and instantiate the provider service. You only need to supply the properties you want to change from the default values. Any other methods will not work if the service is not instantiated. This method can be called only once.

_Example:_

```javascript
Geolocation.configure({
    distanceFilter: 100,
    desiredAccuracy: 'BalancedPower',
    bufferSize: 10,
});
```

#### `start()`

Start the service using options defined with [`configure()`](#configure). The module sends a `'LOCATION_UPDATED'` event when a new computed location has changed significantly. Locations are also computed in background.

_Example:_

```javascript
Geolocation.start();
```

#### `useLocation()`

A React Hook which can be used to get access to the last computed location and to follow updates when the location significantly changes. It returns a hook with the [`Location`](#location) type.

_Example:_

```javascript
import { useLocation } from '@mobeye/react-native-geolocation';

const YourComponent = () => {
    const location = useLocation();

    return (
        <View>
            <Text>Latitude: {location.latitude.toString()}</Text>
            <Text>Longitude: {location.longitude.toString()}</Text>
            <Text>Accuracy: {location.accuracy.toString()}</Text>
            <Text>Is from mock provider: {location.mock.toString()}</Text>
        </View>
    );
};
```

#### `getLastLocations()`

Return a `Promise` that gets last locations saved in the buffer. You can optionally send a `number` of locations you need to retrieve. Without number, the method returns all saved locations in the buffer.

_Example:_

```javascript
Geolocation.getLastLocations(10).then((locations) => {
    const lastLocation = locations[0];
    console.log('Latitude', lastLocation.latitude);
    console.log('Longitude', lastLocation.longitude);
});
```

#### `setTemporaryConfiguration()`

Sometime you may need to temporary change the accuracy level to have a better user tracking. This method changes on the fly your configuration (except the buffer size).

_Example:_

```javascript
Geolocation.setTemporaryConfiguration({
    distanceFilter: 20,
    desiredAccuracy: 'BestAccuracy',
});
```

#### `revertTemporaryConfiguration()`

Reset configuration with the [`LocationConfiguration`](#locationconfiguration) used with [`configure()`](#configure).

_Example_

```javascript
Geolocation.revertTemporaryConfiguration();
```

#### `checkIOSAuthorization()`

Return a `Promise` that gets the location permission status as `boolean` for ios. For android, you can use [`PermissionAndroid`](https://reactnative.dev/docs/permissionsandroid).

_Example:_

```javascript
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Geolocation from '@mobeye/react-native-geolocation';

const YourComponent = () => {
    const [permission, setPermission] = useState(false);

    useEffect(() => {
        Geolocation.configure();
        if (Platform.OS === 'ios') {
            Geolocation.checkIOSAuthorization().then((status) => setPermission(status));
        }
    }, []);

    return (
        <View>
            <Text>Do you have permission? {permission.toString()}</Text>
        </View>
    );
};
```

> :warning: In the futur, Apple may add new authorizations. In this case, the `Promise` will be rejected with the code error `5`. Do not hesitate to create a pull request to add the new authorization.

#### `requestIOSAuthorization()`

Requests the geolocation permission for ios. Returns a `Promise` that resolves to a [`PermissionStatus`](https://reactnative.dev/docs/permissionsandroid#result-strings-for-requesting-permissions). [`configure`](#configure) must be called before this method since the service will start on its own if the user set the geolocation permission.

```javascript
import { useEffect, useState } from 'react';
import { Platform, PermissionStatus } from 'react-native';
import Geolocation from '@mobeye/react-native-geolocation';

const YourComponent = () => {
    const [status, setStatus] = useState(PermissionStatus.denied);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Geolocation.requestIOSAuthorization().then((status) => setStatus(status));
        }
    }, []);

    return (
        <View>
            <Text>Do you have permission? {status}</Text>
        </View>
    );
};
```

#### `checkIOSAccuracyAuthorization()`

Requests the geolocation accuracy authorization on ios devices. Returns a `Promise` that resolves to a [`AccuracyAuthorization`](#accuracyauthorization)

```javascript
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Geolocation from '@mobeye/react-native-geolocation';

const YourComponent = () => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Geolocation.checkIOSAccuracyAuthorization().then((status) => setStatus(status));
        }
    }, []);

    return (
        <View>
            <Text>Accuracy authorization level: {status}</Text>
        </View>
    );
};
```

#### `getAndroidLocationProvidersStatus()`

Requests the geolocation status. Returns a `Promise` that resolves to a [`LocationProviderStatus`](#locationproviderstatus)

_Example:_

```javascript
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Geolocation, { LocationProvidersStatus } from '@mobeye/react-native-geolocation';

const YourComponent = () => {
    const [locationStatus, setLocationStatus] =
        useState <
        LocationProvidersStatus >
        {
            isGPSLocationEnabled: false,
            isNetworkLocationEnabled: false,
        };

    useEffect(() => {
        if (Platform.OS === 'android') {
            Geolocation.getAndroidLocationProvidersStatus().then((status) => setLocationStatus(status));
        }
    }, []);

    return (
        <View>
            <Text>Is GPS location enabled? {locationStatus.isGPSLocationEnabled}</Text>
            <Text>Is Network location enabled? {locationStatus.isNetworkLocationEnabled}</Text>
        </View>
    );
};
```

#### `checkAndroidLocationSettings()`

Requests to determine whether the location settings are enabled on android phones, if the settings must be changed then a dialog that prompts the user for permission to modify the location settings should be displayed and it returns a GeolocationError which is CHECK_SETTINGS_FAILURE when it fails. For more information please check this [link](https://developer.android.com/training/location/change-location-settings)

_Example:_

```javascript
Geolocation.checkAndroidLocationSettings().catch(console.log);
```

### Example

You can run a simple example present in the module to test the geolocation. First, you need to install node_modules and example pods:

```bash
yarn && cd example/ios/ && pod install && cd - && yarn start
```

Then, open the example directory with xcode or android studio to build the example.

### License

-   See [LICENSE](/LICENSE)

---

<p align="center">
  <a href="https://mobeye-app.com/">
    <img width="120px" src="https://u4s4z4j6.stackpathcdn.com/wp-content/uploads/2018/10/logo-noir-e1568971859438.png">
  </a>
  <p align="center">
    Built and maintained by <a href="https://mobeye-app.com/">Mobeye</a>.
  </p>
</p>
