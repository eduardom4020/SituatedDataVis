import { Text, View } from 'react-native';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryLegend, VictoryAxis } from "victory-native";
import { colors as BaseThemeColors } from '../themes/base';

export const Scatter = ({domain, data, chartEncoding={}, contextualData={}, chartProps={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }

    const enhancedData = { data };
    enhancedData.fill = () => '#dbdbdb';
    enhancedData.size = () => 1.5;
    
    const hasContextSelectAction = chartEncoding && Boolean(chartEncoding.contextSelect);
    const selectSeries = hasContextSelectAction && chartEncoding.contextSelect.series;

    let contextActivatedValues = [];

    if(hasContextSelectAction) {
        const contextDeactivatedSeries = contextualData[chartEncoding.contextSelect.contextualDeactivation] || {};
        const contextActivatedSeries = contextualData[chartEncoding.contextSelect.contextualActivation] || {};

        const contextDeactivatedValues = contextDeactivatedSeries[selectSeries] || [];
        
        contextActivatedValues = contextActivatedSeries[selectSeries] || [];
        
        contextActivatedValues = contextActivatedValues.filter(v => !contextDeactivatedValues.includes(v));
    }
    
    if(contextActivatedValues.length) {
        enhancedData.data = enhancedData.data.sort((a, b) => {
            const containsA = +(contextActivatedValues.includes(a[selectSeries].replace(/ /g, '')));
            const containsB = +(contextActivatedValues.includes(b[selectSeries].replace(/ /g, '')));
    
            return containsA > containsB && 1
                || containsA < containsB && -1
                || 0;
        });

        enhancedData.fill = ({datum}) => {
            if(contextActivatedValues.includes(datum[selectSeries].replace(/ /g, ''))) {
                const colorThemeIndex = chartEncoding.contextSelect.colors && chartEncoding.contextSelect.colors[datum[selectSeries].replace(/ /g, '')];
                
                if(colorThemeIndex == null || colorThemeIndex === '') {
                    return '#2596be';
                }

                return BaseThemeColors[+colorThemeIndex];
            }

            return '#dbdbdb';
        }

        enhancedData.size = ({datum}) => contextActivatedValues.includes(datum[selectSeries].replace(/ /g, ''))
            && (chartEncoding.contextSelect.sizes && chartEncoding.contextSelect.sizes[datum[selectSeries].replace(/ /g, '')] || 2.5)
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
        <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{
                top: 80,
                textAlign: 'center',
                fontWeight: 300,
                fontSize: 24,
                ...(chartProps.titleStyles || {})
            }}>
                {chartProps.title || 'Scatter'}
            </Text>
            <VictoryChart
                theme={VictoryTheme.material}
                height={400}
                padding={{bottom:100,left:80, right: 40, top: 100}}
            >
                <VictoryScatter
                    style={{
                        data: {
                            fill: enhancedData.fill,
                        }
                    }}
                    data={enhancedData.data}
                    size={enhancedData.size}
                />
                <VictoryAxis
                    label='Sold Units'
                    crossAxis
                    domain={domain.x}
                    fixLabelOverlap
                    style={{
                        axisLabel: { fontSize: 14, padding: 30 },
                    }}
                    gridComponent={<></>}
                />
                <VictoryAxis
                    label='Price (€)'
                    dependentAxis
                    domain={domain.y}
                    fixLabelOverlap
                    style={{
                        axisLabel: { fontSize: 14, padding: 50 },
                    }}
                    gridComponent={<></>}
                />
                {
                    hasContextSelectAction && (
                        <VictoryLegend
                            x={60} 
                            y={350}
                            title="Selected:"
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            style={{ title: {fontSize: 14 } }}
                            data={
                                contextActivatedValues.map(name => {
                                    const selectedColor = chartEncoding.contextSelect.colors[name];
                                    
                                    return { 
                                        name: selectSeries === 'id' ? enhancedData.data.find(x => x.id === name).model : name, 
                                        symbol: { 
                                            fill: contextActivatedValues
                                                ? (selectedColor != null ? BaseThemeColors[+selectedColor] : '#2596be')
                                                : '#dbdbdb'
                                        }
                                    }
                                })
                            }
                        />
                    ) 
                }
            </VictoryChart>
        </View>
    );
}
