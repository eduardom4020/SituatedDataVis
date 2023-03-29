import { useEffect, useCallback, useState, useMemo } from 'react';
import { DataSourceClient } from '../api-clients/datasource-client';

export const useDatasource = (name) => {
    const [fetching, setFetching] = useState(false);

    const [encoding, setEncoding] = useState({});
    const [data, setData] = useState([]);
    
    const fetchEncoding = useCallback(async () => {
        const encoding = await DataSourceClient.get(name);
        setEncoding(encoding);
    }, []);

    const fetchData = useCallback(async () => {
        const data = await DataSourceClient.get(`${name}/data`);
        setData(data);
    }, []);

    useEffect(() => {
        setFetching(true);

        fetchEncoding()
            .then(fetchData)
            .then(() => setFetching(false))
            .catch(console.error);            
    }, [fetchData, fetchEncoding]);

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
        encoding,
    };
}