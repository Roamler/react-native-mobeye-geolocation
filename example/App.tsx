/**
 * Sample React Native App
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, PermissionsAndroid, PermissionStatus, Platform, StyleSheet, Text, View } from 'react-native';
import {
    useLocation,
    checkIOSLocationAuthorization,
    initiateLocation,
    requestIOSLocationAuthorization,
} from 'react-native-mobeye-geolocation';
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
        if (Platform.OS === 'ios') {
            checkIOSLocationAuthorization().then((res: boolean) => {
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
            initiateLocation(10);
        }
        prevPermission.current = permission;
    }, [permission]);

    const date = Platform.OS === 'ios' ? moment.unix(location.time) : moment(location.time);

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>☆MobeyeGeolocation example☆</Text>
            <Text style={styles.instructions}>Have geolocation permission: {String(permission)}</Text>
            <Button
                title={'Ask permission'}
                onPress={() => {
                    if (Platform.OS === 'ios') {
                        requestIOSLocationAuthorization().then((res: PermissionStatus) => {
                            setPermission(res === 'granted');
                        });
                    } else {
                        PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION').then((res) => {
                            setPermission(res === 'granted');
                        });
                    }
                }}
            />
            <Text style={styles.instructions}>Latitude: {String(location.latitude)}</Text>
            <Text style={styles.instructions}>Longitude: {String(location.longitude)}</Text>
            <Text style={styles.instructions}>Accuracy: {String(location.accuracy)}</Text>
            <Text style={styles.instructions}>Date: {date.format('MM/DD/YYYY hh:mm')}</Text>
        </View>
    );
}
