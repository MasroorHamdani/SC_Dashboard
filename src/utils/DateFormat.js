import moment from 'moment-timezone';

export function getFormatedDateTime(dateTime, format) {
/**
 * Format the passed datetime objects into format passed.
 */
    if(dateTime) {
        dateTime = moment(dateTime, format).format(format);
    }
    return(dateTime);
}

export function formatDateTime(dateTime, inputFormat, outFormat) {
/**
 * Format the passed datetime object to input format and then to output format.
 */
    if(dateTime) {
        dateTime = moment( dateTime, inputFormat).format(outFormat)
    }
    return (dateTime);
}

export function formatDateWithTimeZone(dateTime, inputFormat, outFormat, timeZone) {
/**
 * Format passed datetime object as per timezone.
 */
    if(dateTime) {
        dateTime = moment(dateTime, inputFormat).tz(timeZone).format(outFormat)
    } else {
        dateTime = moment().tz(timeZone).format(outFormat)
    }
    return (dateTime);
}