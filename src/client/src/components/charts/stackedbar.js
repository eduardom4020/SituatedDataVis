import { VictoryBar, VictoryChart, VictoryLegend, VictoryStack, VictoryTheme } from "victory-native";
import { BaseTheme } from '../themes';

export const StackedBar = ({data, chartEncoding={}, contextualData={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }
    
    const enhancedData = { data };

    return (
        <VictoryChart
            theme={VictoryTheme.material}
            height={350}
            domainPadding={10}
            domain={{x: [0, enhancedData.data.length + 1]}}
        >
            <VictoryStack>
            {
                enhancedData.data.map(data => (
                    <VictoryBar
                        barWidth={25}
                        theme={BaseTheme}
                        data={data}
                    />
                ))
            }
            </VictoryStack>
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
    );
}
