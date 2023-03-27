import { useCallback } from 'react';
import { QrScanner } from '../../components/qr-scanner';

export const QrScannerScreen = ({ navigation }) => {
    const onScan = useCallback((data) => {
        navigation.navigate('Dashboard', { contextualData: data });
    })
    
    return (
        <QrScanner onScan={onScan}/>
    );
}
