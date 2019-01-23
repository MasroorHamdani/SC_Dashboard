import moment from 'moment';

export function getFormatedDateTime(dateTime, format) {
    if(dateTime) {
        dateTime = moment(dateTime, format).format(format);
    }
    return(dateTime);
}

export function formatDateTime(dateTime, inputFormat, outFormat) {
    if(dateTime) {
        dateTime = moment( dateTime, inputFormat).format(outFormat)
    }
    return dateTime
}