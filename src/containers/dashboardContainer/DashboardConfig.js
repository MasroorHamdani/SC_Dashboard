export const getDashboardConfig = (url, data, apikey) => {
    return {
        method: 'GET',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apikey,
        }
    }

}