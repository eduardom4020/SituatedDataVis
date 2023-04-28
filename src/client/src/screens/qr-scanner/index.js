import { useCallback } from 'react';
import { QrScanner } from '../../components/qr-scanner';

export const QrScannerScreen = ({ navigation, route }) => {
    const onScan = useCallback((data) => {
        if(route.params && route.params.contextualData) {
            const {
                near,
                far,
                directAttention,
            } = data;

            const { contextualData={} } = route.params;

            console.log('Here ', near, contextualData)

            if(near) {
                contextualData.near = Object.entries(near)
                    .map(([key, values]) => ({
                        [key]: [...(contextualData.near[key] || []), ...values]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {});
            }

            if(far) {
                contextualData.far = Object.entries(far)
                    .map(([key, values]) => ({
                        [key]: [...(contextualData.far[key] || []), ...values]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {});
            }

            if(directAttention) {
                contextualData.directAttention = Object.entries(directAttention)
                    .map(([key, values]) => ({
                        [key]: [...(contextualData.far[directAttention] || []), ...values]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {});
            }

            navigation.navigate('Dashboard', { contextualData });
        } else {
            navigation.navigate('Dashboard', { contextualData: data });
        }
    }, [route.params]);
    
    return (
        <QrScanner onScan={onScan} />
    );
}
