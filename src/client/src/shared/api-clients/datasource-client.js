const ApiPath = 'http://192.168.1.82:8000';

const get = (endpoint) => fetch(`${ApiPath}/${endpoint}`).then(res => res.json());

export const DataSourceClient = {
    get,
};
