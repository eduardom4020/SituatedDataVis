import { useEffect, useCallback, useState, useMemo } from 'react';
import { DataSourceClient } from '../api-clients/datasource-client';

export const useDatasource = () => {
    const [fetching, setFetching] = useState(false);
    const [data, setData] = useState([]);
    
    const fetchData = useCallback(async () => {
        const data = await DataSourceClient.get();
        setData(data);
    }, []);

    useEffect(() => {
        setFetching(true);
        fetchData()
            .then(() => setFetching(false))
            .catch(console.error);
    }, [fetchData]);

    const count = useMemo(() => (
        data && data.length || 0
    ), [data]);

    const entries = useMemo(() => (
        data
            && data.reduce((acc, curr) => (
                Object.entries(curr)
                    .map(([cKey, cVal]) => ({
                        [cKey]: [...(acc[cKey] || []), cVal]
                    }))
                    .reduce((acc, curr) => ({...acc, ...curr}), {})
            ), {})
            || {}
    ), [data]);

    return {
        entries,
        count,
        fetching,
    };
}