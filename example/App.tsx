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
import Geolocation, { useLocation } from '@mobeye/react-native-geolocation';
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
    const prevPermission = useRef(false);
    const location = useLocation();

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
            </View>
        </View>
    );
}
