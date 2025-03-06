import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { Client, Account } from 'appwrite';
import { WebView } from 'react-native-webview';


const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('675f19af00004a6f0bf8');
const account = new Account(client);

const NEAREST_CLINIC = {
    latitude: 31.7767, // Example location (Jerusalem)
    longitude: 35.2345,
};

export default function App() {
    const [userLocation, setUserLocation] = useState(null);
    
    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn('Location permission denied');
                    return;
                }

                if (Platform.Version >= 29) {
                    const backgroundLocationGranted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
                    );
    
                    if (backgroundLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
                        console.warn('ACCESS_BACKGROUND_LOCATION denied');
                        return;
                    }
                }
            }
            console.log('Getting user location...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    console.log('User Location:', newLocation); 
                    setUserLocation(newLocation);
                },
                (error) => console.error(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        requestLocationPermission();
    }, []);

    const mapHtml = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://js.arcgis.com/4.26/"></script>
            <script>
                require(["esri/views/MapView", "esri/WebMap", "esri/Graphic"], function(MapView, WebMap, Graphic) {
                    var webmap = new WebMap({
                        portalItem: { id: "f2e9b762544945f390ca4ac3671cfa72" }
                    });

                    var view = new MapView({
                        container: "viewDiv",
                        map: webmap,
                        center: [${userLocation ? userLocation.longitude : NEAREST_CLINIC.longitude}, ${userLocation ? userLocation.latitude : NEAREST_CLINIC.latitude}],
                        zoom: 10
                    });

                    function addMarker(longitude, latitude, color) {
                        var point = {
                            type: "point",
                            longitude: longitude,
                            latitude: latitude
                        };

                        var markerSymbol = {
                            type: "simple-marker",
                            color: color,
                            size: "12px",
                            outline: { color: "black", width: 1 }
                        };

                        var pointGraphic = new Graphic({
                            geometry: point,
                            symbol: markerSymbol
                        });

                        view.graphics.add(pointGraphic);
                    }

                    // Add user location marker
                    if (${userLocation ? 'true' : 'false'}) {
                        addMarker(${userLocation?.longitude}, ${userLocation?.latitude}, "blue");
                    }

                    // Add clinic location marker
                    addMarker(${NEAREST_CLINIC.longitude}, ${NEAREST_CLINIC.latitude}, "red");
                });
            </script>
        </head>
        <body>
            <div id="viewDiv" style="height: 100vh; width: 100vw;"></div>
        </body>
        </html>
    `;

    return (
        <View style={styles.container}>
            <WebView source={{ html: mapHtml }} style={styles.webview} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    webview: { flex: 1 },
});
