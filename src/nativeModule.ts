/**
 * Copyright (c) Mobeye.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { NativeModules } from 'react-native';
import { GeolocationNativeModule } from './privateTypes';

const MobeyeGeolocation: GeolocationNativeModule = NativeModules.MobeyeGeolocation;

export default MobeyeGeolocation;
