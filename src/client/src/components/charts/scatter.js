import { Text, View } from 'react-native';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryLegend } from "victory-native";

export const Scatter = ({domain, data, chartEncoding={}, contextualData={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }
    
    const enhancedData = { data };
    enhancedData.fill = () => '#dbdbdb';
    enhancedData.size = () => 1.5;
    
    const hasContextSelectAction = chartEncoding && Boolean(chartEncoding.contextSelect);
    const selectSeries = hasContextSelectAction && chartEncoding.contextSelect.series;

    let contextActivatedValues = null;

    if(hasContextSelectAction) {
        const contextDeactivatedSeries = contextualData[chartEncoding.contextSelect.contextualDeactivation] || {};
        const contextActivatedSeries = contextualData[chartEncoding.contextSelect.contextualActivation] || {};

        const contextDeactivatedValues = contextDeactivatedSeries[selectSeries] || [];
        
        contextActivatedValues = contextActivatedSeries[selectSeries] || [];
        contextActivatedValues = contextActivatedValues.filter(v => !contextDeactivatedValues.includes(v));
    }
    
    if(contextActivatedValues) {
        enhancedData.data = enhancedData.data.sort((a, b) => {
            const containsA = +(contextActivatedValues.includes(a[selectSeries]));
            const containsB = +(contextActivatedValues.includes(b[selectSeries]));
    
            return containsA > containsB && 1
                || containsA < containsB && -1
                || 0;
        });

        enhancedData.fill = ({datum}) => contextActivatedValues.includes(datum[selectSeries])
            && (chartEncoding.contextSelect.colors[datum[selectSeries]] || '#2596be')
            || '#dbdbdb';

        enhancedData.size = ({datum}) => contextActivatedValues.includes(datum[selectSeries])
            && 2.5
            || 1.5;
    }

    if(!data || !data.length) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <VictoryChart
            theme={VictoryTheme.material}
            domain={domain}
            height={350}
        >
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
                    hasContextSelectAction && (
                        <VictoryLegend y={40}
                            title="Brands"
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            style={{ title: {fontSize: 14 } }}
                            data={
                                contextActivatedValues.map(name => ({ 
                                    name, 
                                    symbol: { 
                                        fill: contextActivatedValues
                                            ? (chartEncoding.contextSelect.colors[name] || '#2596be')
                                            : '#dbdbdb'
                                    }
                                }))
                            }
                        />
                    ) 
                }
            </>
        </VictoryChart>
    );
}
