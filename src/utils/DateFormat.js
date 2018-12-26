import moment from 'moment';

export function getFormatedDateTime(dateTime, format) {
    if(dateTime) {
        dateTime = moment(dateTime, format).format(format);
    }
    return(dateTime);
}