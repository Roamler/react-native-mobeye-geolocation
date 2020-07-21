/**
 * Sample React Native App
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initiateLocation } from 'react-native-mobeye-geolocation';

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
    useEffect(() => {
        initiateLocation();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>☆MobeyeGeolocation example☆</Text>
        </View>
    );
}
