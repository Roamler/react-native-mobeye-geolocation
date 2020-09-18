/**
 * Sample React Native App
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, PermissionsAndroid, PermissionStatus, Platform, StyleSheet, Text, View } from 'react-native';
import Geolocation, { useLocation } from 'react-native-mobeye-geolocation';
import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default function App() {
    const [permission, setPermission] = useState(false);
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
            <Text style={styles.welcome}>☆MobeyeGeolocation example☆</Text>
            <Text style={styles.instructions}>Have geolocation permission: {permission.toString()}</Text>
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
            <Text style={styles.instructions}>Latitude: {location.latitude.toString()}</Text>
            <Text style={styles.instructions}>Longitude: {location.longitude.toString()}</Text>
            <Text style={styles.instructions}>Accuracy: {location.accuracy.toString()}</Text>
            <Text style={styles.instructions}>Date: {date.format('MM/DD/YYYY hh:mm')}</Text>
            <Button
                title={'Balanced Power and Accuracy'}
                onPress={() => {
                    Geolocation.stopBestAccuracyLocation();
                }}
            />
            <Button
                title={'Best Accuracy'}
                onPress={() => {
                    Geolocation.startBestAccuracyLocation(50);
                }}
            />
        </View>
    );
}
