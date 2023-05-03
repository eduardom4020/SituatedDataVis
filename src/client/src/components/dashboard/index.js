import { StyleSheet, Text, View } from 'react-native';
import { useDatasource } from '../../shared/hooks/use-datasource';
import { Scatter } from '../charts/scatter';
import { useEffect, useMemo } from 'react';
import { Pie } from '../charts/pie';

export const Dashboard = ({contextualData={}, storedData={}, onEncodingSelected=null}) => {
    const datasource = useDatasource('phoneBrands');
    
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
        camera: var_Camera,
        rating5s,
        rating4s,
        rating3s,
        rating2s,
        rating1s
    } = datasource.entries;

    //TODO: Send data treatments to charts internal implementations.
    // send to them only datasource entries and contextal data

    const baseData = useMemo(() => {
        if(datasource) {
            return new Array(datasource.count).fill({})
                .filter((_, index) => var_Camera[index])
        }
        return [];
    }, [datasource]);

    const maxPrice = var_Price && Math.max(...var_Price.map(v => +v.slice(1))) || 1;
    const maxCamera = var_Camera && Math.max(...var_Camera.map(v => +v)) || 1;

    const scatterDomain = { x: [0, maxCamera], y: [0, maxPrice] };

    const scatterData = baseData.map((_, index) => ({
        x: +var_Camera[index],
        y: +var_Price[index].slice(1),
        brand: var_Brand[index],
        model: var_Model[index],
    }));

    const pieData = useMemo(() => {
        if(!datasource.fetching && chartEncoding && chartEncoding.chartType === 'Piechart' && contextualData.directAttention && contextualData.directAttention.model) {
            const selectedModel = contextualData.directAttention.model;
            const selectedModelIndex = var_Model.findIndex(m => m.replaceAll(' ', '') === selectedModel[0].replaceAll(' ', ''));
    
            return [
                {
                    x: 1,
                    y: +rating5s[selectedModelIndex],
                    label: '5*',
                },
                {
                    x: 2,
                    y: +rating4s[selectedModelIndex],
                    label: '4*',
                },
                {
                    x: 3,
                    y: +rating3s[selectedModelIndex],
                    label: '3*',
                },
                {
                    x: 4,
                    y: +rating2s[selectedModelIndex],
                    label: '2*',
                },
                {
                    x: 5,
                    y: +rating1s[selectedModelIndex],
                    label: '1*',
                }
            ];
        }

        return [];
    }, [chartEncoding, contextualData, datasource]);

    console.log({pieData})
    
    if(datasource.fetching && !chartEncoding) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
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
                <Pie
                    data={pieData}
                    contextualData={contextualData}
                    chartEncoding={chartEncoding}
                />
            ) : (
                <></>
            )
        }
            
        </View>
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
