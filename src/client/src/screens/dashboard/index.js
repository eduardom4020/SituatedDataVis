import { Button, View } from "react-native"
import { Dashboard } from "../../components/dashboard"
import { useCallback, useEffect, useState } from "react"

export const DashboardScreen = ({ navigation, route }) => {
    const [ storedData, setStoredData ] = useState(route.params.storedData || {});

    const onEncodingSelected = useCallback((encoding) => (
        setStoredData({...(storedData || {}), encoding})
    ), [storedData]);

    useEffect(() => {
        setStoredData(route.params.storedData);
    }, [route.params.storedData])
    
    return (
        <View>
            <Button onPress={() => {
                navigation.navigate(
                    'QrScanner', 
                    {
                        contextualData: route.params.contextualData,
                        storedData
                    }
                );
            }}
                title="Scan QRCode"
            />
            <Dashboard
                contextualData={route.params.contextualData}
                storedData={storedData}
                onEncodingSelected={onEncodingSelected}
            />
        </View>
    )
}
