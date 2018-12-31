export const getApiConfig = (url, type, data='', params='') => {
    const config = {
        method: type,
        url: url,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (data) {
        config['data'] = data;
    }
    let parameter = '';
    if (params) {
        Object.keys(params).map((key) => (
            parameter = `${parameter}${key}=${params[key]}&`
        ))
        config['url'] = `${config['url']}?${parameter}`;
    }
    return config;

}