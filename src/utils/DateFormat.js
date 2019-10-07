import moment from 'moment-timezone';
import {DATE_TIME_FORMAT} from '../constants/Constant';

export function getFormatedDateTime(dateTime, format=DATE_TIME_FORMAT) {
/**
 * Format the passed datetime objects into format passed.
 */
    if(dateTime) {
        dateTime = moment(dateTime, format).format(format);
    }
    return(dateTime);
}

export function formatDateTime(dateTime, inputFormat=DATE_TIME_FORMAT, outFormat=DATE_TIME_FORMAT) {
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

export function getTimeDifference (startTime, endTime) {
    // startTime = moment(startTime, DATE_TIME_FORMAT);
    // endTime = moment(endTime, DATE_TIME_FORMAT);
    // moment(endTime.diff(startTime)).format("m[m] s[s]")
    // let duration = moment.duration(endTime.diff(startTime));
    // let hours = duration.asHours();
    let start = moment(startTime, DATE_TIME_FORMAT),
        end = moment(endTime, DATE_TIME_FORMAT);
    return start.isSame(end, 'date');
}

export function getXHourOldDateTime (hours='') {
    let now = new Date();
    now.setHours(now.getHours()-hours);
    return now
}

export function getTodaysStartDateTime () {
    let dateTime = new Date();
    dateTime.setHours(0,0,0,0);
    return dateTime;
}