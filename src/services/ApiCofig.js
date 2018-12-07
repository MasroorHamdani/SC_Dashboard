export const getApiConfig = (url, type, data='') => {
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
    return config;

}