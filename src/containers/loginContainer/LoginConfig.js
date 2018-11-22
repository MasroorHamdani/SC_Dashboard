export const getLoginConfig = (url, data, apikey) => {
    return {
        method: 'POST',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apikey,
        }
    }

}