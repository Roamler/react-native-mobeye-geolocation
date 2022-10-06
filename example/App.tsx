/**
 * Sample React Native App
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView,
    AppState,
    AppStateStatus,
} from 'react-native';
import Geolocation, {
    useLocation,
    LocationProvidersStatus,
    AccuracyAuthorization,
    AccuracyLevel,
    LocationConfiguration,
    Location,
} from '@mobeye/react-native-geolocation';
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
        marginBottom: 10,
        flex: 0.5,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});

const DEFAULT_CONFIGURATION: LocationConfiguration = {
    desiredAccuracy: 'BalancedPower' as AccuracyLevel,
    distanceFilter: 500,
    updateInterval: 5 * 1000,
    bufferSize: 10,
};

export default function App() {
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    const [permission, setPermission] = useState<boolean>(false);
    const prevPermission = useRef<boolean>(false);
    const [accuracyAuthorization, setAccuracyAuthorization] = useState<AccuracyAuthorization>('ReducedAccuracy');
    const [locationProviderStatus, setLocationProviderStatus] = useState<LocationProvidersStatus>({
        isGPSLocationEnabled: false,
        isNetworkLocationEnabled: false,
    });

    const [config, setConfig] = useState<LocationConfiguration>(DEFAULT_CONFIGURATION);

    const [locations, setLocations] = useState<Location[]>([]);
    const location = useLocation();

    const askPermission = () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestIOSAuthorization();
        } else {
            /* For location permissions request, and starting from android 12+, we need to request
             * both permissions, FINE and COARSE, in order to have access to user precise location */
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);
        }
    };

    /* listen the app state for background / foreground transition to check location authorizations */
    useEffect(() => {
        const checkPermission = () => {
            if (Platform.OS === 'ios') {
                Geolocation.checkIOSAuthorization().then((isAuthorized: boolean) => {
                    setPermission(isAuthorized);
                });
            } else {
                // Checking only the coarse location permission is enough to know whether we have access to user location or not
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((isAuthorized) => {
                    setPermission(isAuthorized);
                });
            }
        };

        const checkAccuracyAuthorization = () => {
            if (Platform.OS === 'ios') {
                Geolocation.checkIOSAccuracyAuthorization().then((acc: AccuracyAuthorization) => {
                    setAccuracyAuthorization(acc);
                });
            } else {
                /* Checking fine location permission will give us the information on whether the user has activated precise
                location or not */
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((isAuthorized) => {
                    const acc = isAuthorized ? 'FullAccuracy' : 'ReducedAccuracy';
                    setAccuracyAuthorization(acc);
                });
            }
        };

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            const prevAppState = appStateRef.current;

            if (prevAppState.match(/inactive|background/) && nextAppState === 'active') {
                checkPermission();
                checkAccuracyAuthorization();
            }

            appStateRef.current = nextAppState;
        };

        // check authorizations when app starts
        checkPermission();
        checkAccuracyAuthorization();
        // keep listening to any location authorizations modification while using app
        const appStateListener = AppState.addEventListener('change', handleAppStateChange);
        return () => appStateListener.remove();
    }, []);

    /* location provider status update */
    useEffect(() => {
        if (Platform.OS === 'android') {
            // update location providers status when app starts
            const updateProvidersLocationStatus = async () => {
                const locationProvidersStatus: LocationProvidersStatus = await Geolocation.getAndroidLocationProvidersStatus();
                setLocationProviderStatus(locationProvidersStatus);
            };
            updateProvidersLocationStatus().catch(console.log);

            // keep listening to any location providers status while using app
            const locationProviderListener = Geolocation.locationEmitter.addListener(
                'Location_check',
                (payload: LocationProvidersStatus) => {
                    setLocationProviderStatus(payload);
                }
            );
            return () => locationProviderListener.remove();
        }
        return () => null;
    }, []);

    useEffect(() => {
        Geolocation.configure(DEFAULT_CONFIGURATION);
    }, []);

    useEffect(() => {
        if (!prevPermission.current && permission) {
            Geolocation.start();
        }
        prevPermission.current = permission;
    }, [permission]);

    const locationTime = Platform.OS === 'ios' ? moment.unix(location.time) : moment(location.time);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <StatusBar barStyle={'dark-content'} backgroundColor={'#F5FCFF'} />

                <Text style={styles.welcome}>☆ MobeyeGeolocation example ☆</Text>
                <Text style={styles.instructions}>
                    Have geolocation permission: {permission !== undefined ? permission.toString() : ' - '}
                </Text>
                <Text style={styles.instructions}>Accuracy Authorization: {accuracyAuthorization || ' - '}</Text>
                <View style={styles.buttons}>
                    <Button title={'Ask location permission'} onPress={() => askPermission()} />
                </View>

                {Platform.OS === 'android' && (
                    <View>
                        <Text style={styles.instructions}>
                            Is GPS location provider enabled: {locationProviderStatus.isGPSLocationEnabled.toString()}
                        </Text>
                        <Text style={styles.instructions}>
                            Is network location provider enabled:{' '}
                            {locationProviderStatus.isNetworkLocationEnabled.toString()}
                        </Text>
                        <View style={styles.buttons}>
                            {/* Make sure to disable your location provider before testing in order to see the system dialog,
                    otherwise the method won't do anything */}
                            <Button
                                title={'Enable location provider'}
                                onPress={() => Geolocation.checkAndroidLocationSettings()}
                            />
                        </View>
                    </View>
                )}

                <Text style={{ marginTop: 10 }}>Active configuration:</Text>
                <Text style={styles.instructions}>desired accuracy: {config.desiredAccuracy}</Text>
                <Text style={styles.instructions}>distance filter: {config.distanceFilter}</Text>
                <Text style={styles.instructions}>update interval: {config.updateInterval}</Text>
                <Text style={styles.instructions}>buffer size: {config.bufferSize}</Text>
                <View style={styles.buttons}>
                    <Button
                        title={'Revert configuration to balanced'}
                        onPress={() => {
                            Geolocation.revertTemporaryConfiguration();
                            setConfig(DEFAULT_CONFIGURATION);
                        }}
                    />
                    <Button
                        title={'Best Accuracy and max power'}
                        onPress={() => {
                            const newConf = {
                                desiredAccuracy: 'BestAccuracy' as AccuracyLevel,
                                distanceFilter: 10,
                                updateInterval: 1000,
                            };
                            Geolocation.setTemporaryConfiguration(newConf);
                            setConfig({ ...DEFAULT_CONFIGURATION, ...newConf });
                        }}
                    />
                </View>

                <Text style={{ marginTop: 10 }}>useLocation data:</Text>
                <Text style={styles.instructions}>Latitude: {location.latitude}</Text>
                <Text style={styles.instructions}>Longitude: {location.longitude}</Text>
                <Text style={styles.instructions}>Accuracy: {location.accuracy}</Text>
                <Text style={styles.instructions}>Time: {locationTime.format('MM/DD/YYYY hh:mm:ss')}</Text>
                <Text style={styles.instructions}>Mock: {location.mock.toString()}</Text>

                <Text style={{ marginTop: 10 }}>getLastLocations data:</Text>
                {locations.map((loc: Location, idx: number) => {
                    return (
                        <Text key={idx} style={styles.instructions}>
                            {'(' + loc.latitude + '; ' + loc.longitude + '), '}
                        </Text>
                    );
                })}

                <View style={styles.buttons}>
                    <Button
                        title={'Get last locations'}
                        onPress={() => {
                            Geolocation.getLastLocations(10).then((lastLocations: Location[]) =>
                                setLocations(lastLocations)
                            );
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
