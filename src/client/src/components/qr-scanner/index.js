import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Constants as BarCodeScannerConstants } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';

export const QrScanner = ({ onScan=()=>null }) => {
    const [ data, setData ] = useState();
    const [hasPermission, setHasPermission] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleQrCodeScanned = useCallback(({ type, data }) => {
        if(hasPermission && type === BarCodeScannerConstants.BarCodeType.qr && data) {
            const newData = JSON.parse(data.trim().replace(/\n|\s|\t|\\n|\\s|\\t/g, ''));
            setData(newData);
        }
    }, [hasPermission]);
    
    useEffect(() => {
        if(hasPermission && data) {
            onScan(data);
        }
    }, [hasPermission, data])

    useEffect(() => {
        if(isFocused) {
            setData(null);
        }
    }, [isFocused])

    if (hasPermission === null) {
        return <Text>Requesting for camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera!</Text>;
    }

    if(isFocused) {
        return (
            <BarCodeScanner
                onBarCodeScanned={data ? undefined : handleQrCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        );
    }

    return null;
}
