import _ from "lodash";

export function capitalizeFirstLetter(string) {
    if (string) {
        string = string.trim();
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return string;
    }
}



export function getTokenData(token, attr) {
/**
 * Get User details from the token passed in JWT.
 * This user data is used in Header component to be displayed.
 */
    let tokenDict = token['R'] ? JSON.parse(token['R']) : [], data;
    if(tokenDict && tokenDict.length >0) 
    {
        data = _.find(tokenDict, attr)
    }
    return data;
}