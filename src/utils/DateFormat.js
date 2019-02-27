import moment from 'moment-timezone';

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
    return (dateTime);
}

export function formatDateWithTimeZone(dateTime, inputFormat, outFormat, timeZone) {
    if(dateTime) {
        dateTime = moment(dateTime, inputFormat).tz(timeZone).format(outFormat)
    } else {
        dateTime = moment().tz(timeZone).format(outFormat)
    }
    return (dateTime);
}