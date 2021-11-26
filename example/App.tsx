/**
 * Sample React Native App
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    PermissionsAndroid,
    PermissionStatus,
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import Geolocation, { useLocation, getAndroidLocationProvidersStatus, checkAndroidLocationSettings, locationEmitter, LocationProvidersStatus } from '@mobeye/react-native-geolocation';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    buttons: {
        flex: 0.5,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});

export default function App() {
    const [permission, setPermission] = useState(false);
    const [accuracyAuthorization, setAccuracyAuthorization] = useState('');
    const [locationProviderStatus, setLocationProviderStatus] = useState<LocationProvidersStatus>({
        isGPSLocationEnabled: true,
        isNetworkLocationEnabled: true
    });
    const prevPermission = useRef(false);
    const location = useLocation();

    /* location provider status update */
    useEffect(() => {
        if (Platform.OS === 'android') {
            // update location status when app starts
            const updateLocationStatus = async () => {
                const locationStatus: LocationProvidersStatus = await getAndroidLocationProvidersStatus();
                setLocationProviderStatus(locationStatus);
            };
            updateLocationStatus().catch(console.log);

            // keep listening to any location settings modification while using app
            const locationProviderListener = locationEmitter.addListener('Location_check', (payload: LocationProvidersStatus) => {
                setLocationProviderStatus(payload);
            });
            return () => locationProviderListener.remove();
        }
    }, []);

    useEffect(() => {
        Geolocation.configure();
        if (Platform.OS === 'ios') {
            Geolocation.checkIOSAuthorization().then((res: boolean) => {
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

    const date = Platform.OS === 'ios' ? moment.unix(location.time) : moment(location.time);

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={'#F5FCFF'}
            />
            <Text style={styles.welcome}>☆ MobeyeGeolocation example ☆</Text>
            <Text style={styles.instructions}>Have geolocation permission: {permission.toString()}</Text>
            <Text style={styles.instructions}>Latitude: {location.latitude.toString()}</Text>
            <Text style={styles.instructions}>Longitude: {location.longitude.toString()}</Text>
            <Text style={styles.instructions}>Accuracy: {location.accuracy.toString()}</Text>
            <Text style={styles.instructions}>Mock: {location.mock.toString()}</Text>
            <Text style={styles.instructions}>Accuracy Authorization: {accuracyAuthorization.toString()}</Text>
            <Text style={styles.instructions}>Is GPS location provider enabled: {locationProviderStatus.isGPSLocationEnabled.toString()}</Text>
            <Text style={styles.instructions}>Is network location provider enabled: {locationProviderStatus.isNetworkLocationEnabled.toString()}</Text>
            <Text style={styles.instructions}>Date: {date.format('MM/DD/YYYY hh:mm:ss')}</Text>
            <View style={styles.buttons}>
                <Button
                    title={'Ask permission'}
                    onPress={() => {
                        if (Platform.OS === 'ios') {
                            Geolocation.requestIOSAuthorization().then((res: PermissionStatus) => {
                                setPermission(res === 'granted');
                            });
                        } else {
                            PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION').then((res) => {
                                setPermission(res === 'granted');
                            });
                        }
                    }}
                />
                <Button
                    title={'Balanced Power and Accuracy'}
                    onPress={() => {
                        Geolocation.revertTemporaryConfiguration();
                    }}
                />
                <Button
                    title={'Best Accuracy'}
                    onPress={() => {
                        Geolocation.setTemporaryConfiguration({
                            desiredAccuracy: 'BestAccuracy',
                            distanceFilter: 1000,
                            updateInterval: 1000,
                        });
                    }}
                />
                <Button
                    title={'Check accuracy authorization'}
                    onPress={() => {
                        Geolocation.checkAccuracyAuthorization().then(res => {
                            setAccuracyAuthorization(res);
                        });
                    }}
                />
                {/* Make sure to disable your location provider before testing in order to see the system dialog,
                otherwise the method won't do anything */}
                <Button
                    title={'Enable location provider'}
                    onPress={() => {
                        checkAndroidLocationSettings();
                    }}
                />
            </View>
        </View>
    );
}
