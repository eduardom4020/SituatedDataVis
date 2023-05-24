import { VictoryBar, VictoryChart, VictoryLegend, VictoryStack, VictoryTheme, VictoryLabel } from "victory-native";
import { BaseTheme, PieRatingsTheme } from '../themes';
import { Text, View } from 'react-native';

export const StackedBar = ({data, chartEncoding={}, contextualData={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }
    
    const enhancedData = { data };

    return (
        <View style={{
            width: '100%',
            justifyContent: 'center'
        }}>
            <Text style={{
                top: 80,
                width: '100%',
                textAlign: 'center',
                fontWeight: 300,
                fontSize: 24
            }}>Phone Ratings Comparison</Text>
            <VictoryChart
                theme={{
                    ...VictoryTheme.material,
                    stack: {
                        colorScale: PieRatingsTheme.pie.colorScale
                    }
                }}
                height={250}
                padding={{bottom:100,left:80, right: 40, top: 100}}
                // domainPadding={10}
                // domain={{x: [0, enhancedData.data[0].length + 1]}}
            >
                <VictoryStack
                    style={{
                        data: { stroke: "white", strokeWidth: 1 }
                    }}
                    alignment="middle"
                >
                {
                    enhancedData.data.map(data => (
                        <VictoryBar
                            barWidth={25}
                            data={data}
                            labelComponent={<VictoryLabel dx={-15} style={{fill: 'white'}}/>}
                            horizontal
                        />
                    ))
                }
                </VictoryStack>
                {/* <VictoryAxis crossAxis fixLabelOverlap />
                <VictoryAxis dependentAxis /> */}
                {/* <VictoryLegend y={40}
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
                /> */}
            </VictoryChart>
        </View>
    );
}
