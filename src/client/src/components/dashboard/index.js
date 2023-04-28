import { StyleSheet, Text, View } from 'react-native';
import { useDatasource } from '../../shared/hooks/use-datasource';
import { Scatter } from '../charts/scatter';

export const Dashboard = ({contextualData={}}) => {
    const datasource = useDatasource('phoneBrands');

    if(datasource.fetching) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    const { 
        brand: var_Brand,
        model: var_Model,
        price: var_Price,
        camera: var_Camera
    } = datasource.entries;

    const maxPrice = var_Price && Math.max(...var_Price.map(v => +v.slice(1))) || 1;
    const maxCamera = var_Camera && Math.max(...var_Camera.map(v => +v)) || 1;
    const domain = { x: [0, maxCamera], y: [0, maxPrice] };

    const data = new Array(datasource.count).fill({})
        .filter((_, index) => var_Camera[index])
        .map((_, index) => ({
            x: +var_Camera[index],
            y: +var_Price[index].slice(1),
            brand: var_Brand[index],
            model: var_Model[index],
        }));

    return (
        <View style={styles.container}>
            <Scatter 
                chartCode='phones-scatter'
                data={data}
                domain={domain}
                contextualData={contextualData}
                encoding={datasource.encoding}
            />
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
