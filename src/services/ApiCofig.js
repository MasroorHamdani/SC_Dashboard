export const getApiConfig = (url, type, data='', params='', header='') => {
/**
 * Config function to create a config object as per the inputs.
 * This object is passed to API once set.
 */
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
    if (header) {
        Object.keys(header).map((key) => (
            config['headers'][key] = header[key]
        ));
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