import { useCallback } from 'react';
import { QrScanner } from '../../components/qr-scanner';

export const QrScannerScreen = ({ navigation, route }) => {
    const onScan = useCallback((data) => {
        if(route.params && route.params.contextualData) {
            const {
                near: {
                    brands
                }
            } = route.params.contextualData;
    
            if(data && data.near && data.near.brands) {
                data.near.brands = [...data.near.brands, ...brands];
            }
        }

        navigation.navigate('Dashboard', { contextualData: data });
    }, [route.params]);
    
    return (
        <QrScanner onScan={onScan} />
    );
}
