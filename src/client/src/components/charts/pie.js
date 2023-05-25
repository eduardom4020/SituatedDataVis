import { VictoryPie, VictoryChart, VictoryLegend } from "victory-native";
import { BaseTheme, PieRatingsTheme } from '../themes';
import { Text, View } from 'react-native';

export const Pie = ({data, chartEncoding={}, contextualData={}, title, titleSize=24, pieProps={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }
    
    const enhancedData = { data };
    
    // const hasContextSelectAction = chartEncoding && Boolean(chartEncoding.contextSelect);
    // const selectSeries = hasContextSelectAction && chartEncoding.contextSelect.series;

    return (
        <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{
                // top: 80,
                width: '100%',
                textAlign: 'center',
                fontWeight: 300,
                fontSize: titleSize
            }}>{title || 'Phone Ratings'}</Text>
            <VictoryPie
                {...{theme: PieRatingsTheme, ...pieProps}}
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
