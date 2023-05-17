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

            const { contextualData={}, storedData={} } = route.params;
            const { encoding } = storedData || {};

            if(near) {
                contextualData.near = Object.entries(near)
                    .map(([key, values]) => ({
                        [key]: [...new Set([...(contextualData.near[key] || []), ...values])]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {});
            }

            if(far) {
                contextualData.far = Object.entries(far)
                    .map(([key, values]) => ({
                        [key]: [...new Set([...(contextualData.far[key] || []), ...values])]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {});
            }

            if(directAttention) {
                contextualData.directAttention = Object.entries(directAttention)
                    .map(([key, values]) => ({
                        [key]: [...new Set([...(contextualData.directAttention[key] || []), ...values])]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {});
            }
            
            if(
                encoding
                && encoding.changeRepresentation
                && data.hasOwnProperty(encoding.changeRepresentation.contextualTrigger)
                && Object.keys(data[encoding.changeRepresentation.contextualTrigger]).includes(encoding.changeRepresentation.series)
            ) {
                storedData.selectedChartCode = encoding.changeRepresentation.showChart;
            }

            if(
                encoding
                && encoding.blendRepresentations
                && data.hasOwnProperty(encoding.blendRepresentations.contextualTrigger)
                && Object.keys(data[encoding.blendRepresentations.contextualTrigger]).includes(encoding.blendRepresentations.series)
            ) {
                storedData.selectedChartCode = encoding.blendRepresentations.showChart;
            }

            navigation.navigate('Dashboard', { contextualData, storedData });
        } else {
            navigation.navigate('Dashboard', { contextualData: data });
        }
    }, [route.params]);
    
    return (
        <QrScanner onScan={onScan} />
    );
}
