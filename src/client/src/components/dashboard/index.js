import { StyleSheet, Text, View } from 'react-native';
import { VictoryScatter, VictoryChart, VictoryTheme } from "victory-native";

import { useDatasource } from '../../shared/hooks/use-datasource';

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

    const enhancedData = { data };

    if(contextualData && contextualData.near && contextualData.near.brands) {
        enhancedData.data = enhancedData.data.sort((a, b) => {
            const containsA = +(contextualData.near.brands.includes(a.brand));
            const containsB = +(contextualData.near.brands.includes(b.brand));
    
            return containsA > containsB && 1
                || containsA < containsB && -1
                || 0;
        });

        enhancedData.fill = ({datum}) => contextualData.near.brands.includes(datum.brand)
            && '#2596be'
            || '#dbdbdb';
        console.log('Datasource ', datasource.encoding.colors)
        if(datasource && datasource.encoding.colors && datasource.encoding.colors.some(c => c.series === 'brands')) {
            enhancedData.fill = ({datum}) => contextualData.near.brands.includes(datum.brand)
                && (datasource.encoding.colors.find(c => c.series === 'brands').mapping[datum.brand] || '#2596be')
                || '#dbdbdb';
        }

        enhancedData.size = ({datum}) => contextualData.near.brands.includes(datum.brand)
            && 2.5
            || 1.5;
    }

    return (
        <View style={styles.container}>
            <VictoryChart
                theme={VictoryTheme.material}
                domain={domain}
            >
                {
                    datasource.count > 0 && (
                        <VictoryScatter
                            style={{
                                data: {
                                    fill: enhancedData.fill,
                                    size: enhancedData.size,
                                }
                            }}
                            data={enhancedData.data}
                        />
                    )
                }
            </VictoryChart>
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
