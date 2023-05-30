import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDatasource } from '../../shared/hooks/use-datasource';
import { Scatter } from '../charts/scatter';
import { useEffect, useMemo } from 'react';
import { Pie } from '../charts/pie';
import { StackedBar } from '../charts/stackedbar';

const ToChunks = (arr, size = 2) => (
    arr.map((_, i) => i % size == 0 && arr.slice(i, i + size)).filter(Boolean)
);

export const Dashboard = ({contextualData={}, storedData={}, onEncodingSelected=null}) => {
    const datasource = useDatasource('fnac');
    
    const chartEncoding = useMemo(() => {
        if(datasource.encoding) {
            const selectedEncoding = datasource.encoding.find(e => (
                e.chartCode === storedData.selectedChartCode
            ));

            if(selectedEncoding) {
                return selectedEncoding
            }

            const mainEncoding = datasource.encoding.find(e => e.main);
            return mainEncoding;
        }
        
        return null;
    }, [datasource.encoding, storedData]);
    
    useEffect(() => {
        if(onEncodingSelected && chartEncoding) {
            onEncodingSelected(chartEncoding);
        }
    }, [chartEncoding]);
    
    const {
        id,
        brand: var_Brand,
        model: var_Model,
        price: var_Price,
        soldUnits: var_SoldUnits,
        meanRating: var_MeanRating,
        ratings5s,
        ratings4s,
        ratings3s,
        ratings2s,
        ratings1s
    } = datasource.entries;

    //TODO: Send data treatments to charts internal implementations.
    // send to them only datasource entries and contextal data
    const baseData = useMemo(() => {
        if(datasource) {
            return new Array(datasource.count).fill({})
                .filter((_, index) => var_SoldUnits[index])
        }
        return [];
    }, [datasource]);
    
    const maxPrice = var_Price && Math.max(...var_Price) || 1;
    const maxSoldUnits = var_SoldUnits && Math.max(...var_SoldUnits) || 1;

    const scatterDomain = { x: [0, maxSoldUnits], y: [0, maxPrice] };
    
    const scatterData = baseData.map((_, index) => ({
        x: var_SoldUnits[index],
        y: var_Price[index],
        brand: var_Brand[index],
        model: var_Model[index],
        id: id[index],
    }));
    
    const pieData = useMemo(() => {        
        if(
            !datasource.fetching && chartEncoding && ['StackedBarchart', 'Piechart'].includes(chartEncoding.chartType) && 
            storedData.targetSeries && contextualData.directAttention && contextualData.directAttention[storedData.targetSeries]
        ) {
            const selectedContextualData = contextualData.directAttention[storedData.targetSeries];
            const seriesData = datasource.entries[storedData.targetSeries];

            return selectedContextualData.map(selectedData => {
                const dataIndex = seriesData.findIndex(m => m.replaceAll(' ', '') === selectedData.replaceAll(' ', ''));
    
                return {
                    title: `Rating Piehcart of:\n${var_Model[dataIndex]}`,
                    entries: [
                        {
                            x: 1,
                            y: +ratings5s[dataIndex],
                            label: '★★★★★',
                        },
                        {
                            x: 2,
                            y: +ratings4s[dataIndex],
                            label: '★★★★',
                        },
                        {
                            x: 3,
                            y: +ratings3s[dataIndex],
                            label: '★★★',
                        },
                        {
                            x: 4,
                            y: +ratings2s[dataIndex],
                            label: '★★',
                        },
                        {
                            x: 5,
                            y: +ratings1s[dataIndex],
                            label: '★',
                        }
                    ]
                };
            });
        }

        return [{}];
    }, [chartEncoding, contextualData, datasource]);
    
    const stackedBarData = useMemo(() => {
        if(
            !datasource.fetching && chartEncoding && chartEncoding.chartType === 'StackedBarchart' &&
            storedData.targetSeries && contextualData.directAttention && contextualData.directAttention[storedData.targetSeries]
        ) {
            const selectedContextualData = contextualData.directAttention[storedData.targetSeries];
            const seriesData = datasource.entries[storedData.targetSeries];
            
            const selectedDataIndexes = selectedContextualData.map(selectedData => seriesData.findIndex(m => m.replaceAll(' ', '') === selectedData.replaceAll(' ', '')));

            const maxRatingsBySelectedSeries = selectedDataIndexes.map(index => (
                +ratings5s[index] +
                +ratings4s[index] +
                +ratings3s[index] +
                +ratings2s[index] +
                +ratings1s[index]
            ));

            return {
                names: selectedDataIndexes.map(selectedIndex => var_Model[selectedIndex]),
                entries: [
                    selectedDataIndexes.map((selectedIndex, index) => ({
                        x: index + 1,
                        y: (+ratings5s[selectedIndex] / maxRatingsBySelectedSeries[index]) * 100,
                        label: '5★',
                    })),
                    selectedDataIndexes.map((selectedIndex, index) => ({
                        x: index + 1,
                        y: (+ratings4s[selectedIndex] / maxRatingsBySelectedSeries[index]) * 100,
                        label: '4★',
                    })),
                    selectedDataIndexes.map((selectedIndex, index) => ({
                        x: index + 1,
                        y: (+ratings3s[selectedIndex] / maxRatingsBySelectedSeries[index]) * 100,
                        label: '3★',
                    })),
                    selectedDataIndexes.map((selectedIndex, index) => ({
                        x: index + 1,
                        y: (+ratings2s[selectedIndex] / maxRatingsBySelectedSeries[index]) * 100,
                        label: '2★',
                    })),
                    selectedDataIndexes.map((selectedIndex, index) => ({
                        x: index + 1,
                        y: (+ratings1s[selectedIndex] / maxRatingsBySelectedSeries[index]) * 100,
                        label: '1★',
                    })),
                ]
            };
        }

        return [];
    }, [chartEncoding, contextualData, datasource]);
    
    if(datasource.fetching || !chartEncoding) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    const directAttentionSelected = contextualData.directAttention && contextualData.directAttention[storedData.targetSeries];
    
    return (
        <ScrollView>
            <View style={styles.container}>
            {
                chartEncoding.chartType === 'Scatter' ? (
                    <Scatter
                        data={scatterData}
                        domain={scatterDomain}
                        contextualData={contextualData}
                        chartEncoding={chartEncoding}
                        chartProps={{
                            title: 'Smartphones cost / selling in this Fnac store',
                        }}
                    />
                ) : chartEncoding.chartType === 'Piechart' && directAttentionSelected && directAttentionSelected.length === 1 ? (
                    <View style={{display: 'flex', alignItems: 'center', padding: 8, flexDirection: 'column'}}>
                        <Scatter
                            data={scatterData}
                            domain={scatterDomain}
                            contextualData={contextualData}
                            chartEncoding={{
                                contextSelect: {
                                    series: storedData.targetSeries,
                                    contextualActivation: storedData.currentContextualTrigger,
                                    colors: {
                                        [directAttentionSelected[0]]: 0,
                                    },
                                    sizes: {
                                        [directAttentionSelected[0]]: 4,
                                    }
                                }
                            }}
                            chartProps={{
                                title: 'Selected smartphone in cost / selling relation',
                            }}
                        />
                        <View style={{height: 20}}/>
                        <Pie
                            data={pieData[0].entries}
                            contextualData={contextualData}
                            chartEncoding={chartEncoding}
                            title={pieData[0].title}
                            chartProps={{
                                width: 380,
                                height: 320,
                                labelRadius: ({ innerRadius }) => innerRadius + 130,
                            }}
                        />
                    </View>
                ) : chartEncoding.chartType === 'StackedBarchart' ? (
                    <View style={{display: 'flex', alignItems: 'center', padding: 8, flexDirection: 'column', top: 40}}>
                        <StackedBar
                            data={stackedBarData}
                            contextualData={contextualData}
                            chartEncoding={chartEncoding}
                            chartProps={{
                                title: 'Smartphones ratings comparison',
                            }}
                        />
                        <View style={{height: 20}}/>
                        {
                            ToChunks(pieData).map(piesChunk => (
                                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'space-around', flexDirection: 'row', width: 220, padding: 12}}>
                                {
                                    piesChunk.map(pie => (
                                        <Pie
                                            data={pie.entries}
                                            contextualData={contextualData}
                                            chartEncoding={chartEncoding}
                                            title={pie.title}
                                            titleSize={14}
                                            chartProps={{
                                                width: 240,
                                                height: 240,
                                                labelRadius: ({ innerRadius }) => innerRadius + 30,
                                                style: { labels: { fill: "white", fontWeight: 400, fontSize: 8 } },
                                                titleStyles: { width: 150 },
                                            }}
                                        />
                                    ))
                                }
                                </View>
                            ))
                        }
                    </View>
                ) : (
                    <></>
                )
            }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    height: '90%',
    // backgroundColor: '#dbdbdb',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
