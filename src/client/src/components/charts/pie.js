import { VictoryPie, VictoryChart, VictoryLegend } from "victory-native";
import { BaseTheme } from '../themes';

export const Pie = ({data, chartEncoding={}, contextualData={}}) => {
    if(!chartEncoding) {
        throw new Error('Unable to mount chart without encoding');
    }
    
    const enhancedData = { data };
    // const hasContextSelectAction = chartEncoding && Boolean(chartEncoding.contextSelect);
    // const selectSeries = hasContextSelectAction && chartEncoding.contextSelect.series;

    return (
        <>
            <VictoryPie
                theme={BaseTheme}
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
        </>
    );
}
