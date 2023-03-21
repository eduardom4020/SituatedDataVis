const ApiPath = 'http://192.168.1.71:8000';

const get = () => fetch(ApiPath).then(res => res.json());

export const DataSourceClient = {
    get,
};
