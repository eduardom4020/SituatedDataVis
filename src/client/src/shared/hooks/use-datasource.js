import { useEffect, useCallback, useState } from 'react';
import { DataSourceClient } from '../api-clients/datasource-client';

export const useDatasource = () => {
    const [data, setData] = useState(null);
    
    const fetchData = useCallback(async () => {
        const data = await DataSourceClient.get();
        setData(data);
    }, []);

    useEffect(() => {
        fetchData().catch(console.error);
    }, [fetchData]);

    return data;
}