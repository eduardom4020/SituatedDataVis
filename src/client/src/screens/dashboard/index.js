import { Button, View } from "react-native"
import { Dashboard } from "../../components/dashboard"

export const DashboardScreen = ({ navigation, route }) => {
    return (
        <View>
            <Dashboard contextualData={route.params.contextualData}/>
            <Button onPress={() => {
                navigation.navigate('QrScanner', { contextualData: route.params.contextualData });
            }}
                title="Scan QRCode"
            />
        </View>
    )
}
