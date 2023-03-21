import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useDatasource } from './shared/hooks/use-datasource';

export default Main = () => {
    const datasource = useDatasource();

    return (
        <View style={styles.container}>
            <Text>{!datasource && 'loading...'}</Text>
            {
                datasource && datasource.map(data => (
                    <Text>{JSON.stringify(data, null, 4)}</Text>
                ))
            }
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
