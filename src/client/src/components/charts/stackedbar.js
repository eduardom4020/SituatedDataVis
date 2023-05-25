import { VictoryBar, VictoryChart, VictoryAxis, VictoryStack, VictoryTheme, VictoryLabel } from "victory-native";
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
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{
                top: 40,
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
                height={200}
                padding={{left:20, right: 20}}
                // domainPadding={100}
                domain={{x: [0, 4]}}
            >
                <VictoryStack
                    style={{
                        data: { stroke: "white", strokeWidth: 1 }
                    }}
                    // alignment="middle"
                    horizontal
                >
                {
                    enhancedData.data.map(data => (
                        <VictoryBar
                            barWidth={25}
                            data={data}
                            labelComponent={<VictoryLabel dx={-15} style={{fill: 'white'}}/>}
                        />
                    ))
                }
                <VictoryLabel textAnchor="start" text='iPhone 14 Pro Max - 128GB - Roxo Escuro' dy={80} dx={20} />
                <VictoryLabel textAnchor="start" text='Xiaomi Redmi Note12 Pro5G' y={130} x={20} />
                </VictoryStack>
                <VictoryAxis dependentAxis gridComponent={<></>} domain={[0, 100]} offsetY={35}/>
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
