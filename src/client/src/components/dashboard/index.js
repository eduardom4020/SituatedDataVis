import { StyleSheet, Text, View } from 'react-native';
import { VictoryScatter, VictoryChart, VictoryTheme } from "victory-native";

import { useDatasource } from '../../shared/hooks/use-datasource';

export const Dashboard = ({contextualData={}}) => {
    const datasource = useDatasource();

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

    const sortedData_ByEnhancing = data.sort((a, b) => {
        const A_ShouldBeEnhanced = +(
            contextualData
            && contextualData.focus
            && contextualData.focus.brands
            && contextualData.focus.brands.includes(a.brand)
        );

        const B_ShouldBeEnhanced = +(
            contextualData
            && contextualData.focus
            && contextualData.focus.brands
            && contextualData.focus.brands.includes(b.brand)
        );

        return A_ShouldBeEnhanced > B_ShouldBeEnhanced && 1
            || A_ShouldBeEnhanced < B_ShouldBeEnhanced && -1
            || 0;
    });

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
                                    fill: ({datum}) => (
                                        contextualData && contextualData.focus && contextualData.focus.brands
                                        && contextualData.focus.brands.includes(datum.brand)
                                            && '#2596be'
                                            || "#dbdbdb"
                                    ),
                                    size: ({datum}) => (
                                        contextualData && contextualData.focus && contextualData.focus.brands
                                        && contextualData.focus.brands.includes(datum.brand)
                                            && 2.5
                                            || 1.5
                                    )
                                }
                            }}
                            data={sortedData_ByEnhancing}
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
