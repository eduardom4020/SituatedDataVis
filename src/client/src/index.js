import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QrScannerScreen } from './screens/qr-scanner';
import { DashboardScreen } from './screens/dashboard';

const Stack = createNativeStackNavigator();

export default Main = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="QrScanner"
                component={QrScannerScreen}
                options={{title: 'Scan QR Code!'}}
            />
            <Stack.Screen 
                name="Dashboard"
                component={DashboardScreen}
                options={{title: 'Contextual Dashboard'}}
            />
        </Stack.Navigator>
    </NavigationContainer>
);
