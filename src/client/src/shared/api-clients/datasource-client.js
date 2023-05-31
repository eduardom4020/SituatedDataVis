const ApiPath = 'http://situated-dashboard-backend.herokuapp.com';

const get = (endpoint) => fetch(`${ApiPath}/${endpoint}`).then(res => res.json());

export const DataSourceClient = {
    get,
};
