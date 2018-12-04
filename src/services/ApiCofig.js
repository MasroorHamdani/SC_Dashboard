export const getApiConfig = (url, apikey='', type, data='') => {
    const config = {
        method: type,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apikey,
        }
    }
    if (data) {
        config['data'] = data;
    }
    return config;

}