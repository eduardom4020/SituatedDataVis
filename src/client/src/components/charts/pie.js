import { VictoryPie, VictoryChart, VictoryLegend } from "victory-native";
import { BaseTheme, PieRatingsTheme } from '../themes';
import { Text, View } from 'react-native';

export const Pie = ({data, chartEncoding={}, contextualData={}, title, titleSize=24, chartProps={}}) => {
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
                // top: 80,
                width: 350,
                textAlign: 'center',
                fontWeight: 300,
                fontSize: titleSize,
                ...(chartProps.titleStyles || {})
            }}>{title || 'Phone Ratings'}</Text>
            <VictoryPie
                {...{theme: PieRatingsTheme, ...chartProps}}
                data={enhancedData.data}
            />
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
        </View>
    );
}
