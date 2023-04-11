import { StyleSheet, Text, View } from 'react-native';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryLegend } from "victory-native";

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

    const isNearToBrands = contextualData && contextualData.near && contextualData.near.brands;
    const hasColorsEncoding = datasource && datasource.encoding.colors && datasource.encoding.colors.some(c => c.series === 'brands');

    if(isNearToBrands) {
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

        if(hasColorsEncoding) {
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
                height={350}
            >
                {
                    datasource.count > 0 && (
                        <>
                            <VictoryScatter
                                style={{
                                    data: {
                                        fill: enhancedData.fill,
                                        size: enhancedData.size,
                                    }
                                }}
                                data={enhancedData.data}
                            />
                            {
                                isNearToBrands && (
                                    <VictoryLegend y={40}
                                        title="Brands"
                                        centerTitle
                                        orientation="horizontal"
                                        gutter={20}
                                        style={{ title: {fontSize: 14 } }}
                                        data={
                                            contextualData.near.brands.map(name => ({ 
                                                name, 
                                                symbol: { 
                                                    fill: hasColorsEncoding
                                                        ? datasource.encoding.colors.find(c => c.series === 'brands').mapping[name]
                                                        : '#2596be'
                                                }
                                            }))
                                        }
                                    />
                                ) 
                            }
                        </>
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
