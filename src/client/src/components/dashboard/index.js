import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDatasource } from '../../shared/hooks/use-datasource';
import { Scatter } from '../charts/scatter';
import { useEffect, useMemo } from 'react';
import { Pie } from '../charts/pie';
import { StackedBar } from '../charts/stackedbar';

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
        brand: var_Brand,
        model: var_Model,
        price: var_Price,
        soldUnits: var_SoldUnits,
        // camera: var_Camera,
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
    }));
    
    const pieData = useMemo(() => {
        if(!datasource.fetching && chartEncoding && chartEncoding.chartType === 'Piechart' && contextualData.directAttention && contextualData.directAttention.model) {
            const selectedModels = contextualData.directAttention.model;
            const selectedModelIndex = var_Model.findIndex(m => m.replaceAll(' ', '') === selectedModels[0].replaceAll(' ', ''));
    
            return [
                {
                    x: 1,
                    y: +ratings5s[selectedModelIndex],
                    label: '5*',
                },
                {
                    x: 2,
                    y: +ratings4s[selectedModelIndex],
                    label: '4*',
                },
                {
                    x: 3,
                    y: +ratings3s[selectedModelIndex],
                    label: '3*',
                },
                {
                    x: 4,
                    y: +ratings2s[selectedModelIndex],
                    label: '2*',
                },
                {
                    x: 5,
                    y: +ratings1s[selectedModelIndex],
                    label: '1*',
                }
            ];
        }

        return [];
    }, [chartEncoding, contextualData, datasource]);
    
    const stackedBarData = useMemo(() => {
        if(!datasource.fetching && chartEncoding && chartEncoding.chartType === 'StackedBarchart' && contextualData.directAttention && contextualData.directAttention.model) {
            const selectedModels = contextualData.directAttention.model;
            const selectedModelIndexes = selectedModels.map(selectedModel => var_Model.findIndex(m => m.replaceAll(' ', '') === selectedModel.replaceAll(' ', '')));

            const maxRatingsBySelectedModels = selectedModelIndexes.map(selectedModelIndex => (
                +ratings5s[selectedModelIndex] +
                +ratings4s[selectedModelIndex] +
                +ratings3s[selectedModelIndex] +
                +ratings2s[selectedModelIndex] +
                +ratings1s[selectedModelIndex]
            ));

            return [
                selectedModelIndexes.map((selectedModelIndex, index) => ({
                    x: `phone${index + 1}`,
                    y: (+ratings5s[selectedModelIndex] / maxRatingsBySelectedModels[index]) * 100,
                    label: '5*',
                })),
                selectedModelIndexes.map((selectedModelIndex, index) => ({
                    x: `phone${index + 1}`,
                    y: (+ratings4s[selectedModelIndex] / maxRatingsBySelectedModels[index]) * 100,
                    label: '4*',
                })),
                selectedModelIndexes.map((selectedModelIndex, index) => ({
                    x: `phone${index + 1}`,
                    y: (+ratings3s[selectedModelIndex] / maxRatingsBySelectedModels[index]) * 100,
                    label: '3*',
                })),
                selectedModelIndexes.map((selectedModelIndex, index) => ({
                    x: `phone${index + 1}`,
                    y: (+ratings2s[selectedModelIndex] / maxRatingsBySelectedModels[index]) * 100,
                    label: '2*',
                })),
                selectedModelIndexes.map((selectedModelIndex, index) => ({
                    x: `phone${index + 1}`,
                    y: (+ratings1s[selectedModelIndex] / maxRatingsBySelectedModels[index]) * 100,
                    label: '1*',
                })),
            ];
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
                    />
                ) : chartEncoding.chartType === 'Piechart' ? (
                    <View>
                        <Scatter
                            data={scatterData}
                            domain={scatterDomain}
                            contextualData={contextualData}
                            chartEncoding={{
                                contextSelect: {
                                    series: 'model',
                                    contextualActivation: 'directAttention',
                                    colors: {
                                        "RedmiNote12Pro5G-128GB-MidnightBlack": "#1982c4",
                                    },
                                    sizes: {
                                        "RedmiNote12Pro5G-128GB-MidnightBlack": 4,
                                    }
                                }
                            }}
                        />
                        <View style={{height: 20}}/>
                        <Pie
                            data={pieData}
                            contextualData={contextualData}
                            chartEncoding={chartEncoding}
                            title='Xiaomi Redmi Note12 Pro5G: Ratings'
                        />
                    </View>
                ) : chartEncoding.chartType === 'StackedBarchart' ? (
                    // <View>
                    //     <StackedBar
                    //         data={stackedBarData}
                    //         contextualData={contextualData}
                    //         chartEncoding={chartEncoding}
                    //     />
                    //     <View style={{height: 20}}/>
                    //     <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 2}}>
                    //         <Pie
                    //             data={pieData}
                    //             contextualData={contextualData}
                    //             chartEncoding={chartEncoding}
                    //             title='Xiaomi Redmi Note12 Pro5G: Ratings'
                    //         />
                    //     </View>
                    // </View>
                    <StackedBar
                        data={stackedBarData}
                        contextualData={contextualData}
                        chartEncoding={chartEncoding}
                    />
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
