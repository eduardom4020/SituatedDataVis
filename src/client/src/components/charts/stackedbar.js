import { VictoryBar, VictoryChart, VictoryAxis, VictoryStack, VictoryTheme, VictoryLabel } from "victory-native";
import { BaseTheme, PieRatingsTheme } from '../themes';
import { Text, View } from 'react-native';

export const StackedBar = ({data, chartEncoding={}, contextualData={}, chartProps={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }
    
    const enhancedData = { data };

    return (
        <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{
                top: 50,
                width: '100%',
                textAlign: 'center',
                fontWeight: 300,
                fontSize: 24,
                marginBottom: 40,
            }}>
                { chartProps.title || 'Stacked bars' }
            </Text>
            <VictoryChart
                theme={{
                    ...VictoryTheme.material,
                    stack: {
                        colorScale: PieRatingsTheme.pie.colorScale
                    }
                }}
                height={200 + (enhancedData.data.names.length * 30)}
                padding={{left:20, right: 20}}
            >
                <VictoryStack
                    style={{
                        data: { stroke: "white", strokeWidth: 1 }
                    }}
                    horizontal
                >
                {
                    enhancedData.data.entries.map(data => (
                        <VictoryBar
                            barWidth={25}
                            data={data}
                            labelComponent={
                                <VictoryLabel dx={-20} style={{fill: 'white'}}/>
                            }
                        />
                    ))
                }
                </VictoryStack>
                <VictoryBar
                    data={
                        enhancedData.data.names.map((label, index) => (
                            { x: index + 1, y: 0, label: `${label.slice(0, 52)}${label.slice(52) != '' ? '...' : ''}` }
                        ))
                    } 
                    labelComponent={<VictoryLabel dy={-22} dx={0} style={{fontSize: 14}} />}
                />
                <VictoryAxis dependentAxis gridComponent={<></>} domain={[0, 100]} offsetY={30}/>
                <VictoryAxis crossAxis domain={[0, enhancedData.data.names.length + 1]} 
                    gridComponent={<></>} axisComponent={<></>} tickComponent={<></>} tickLabelComponent={<></>}
                />
                {/* 
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
