import __, { __fmt, __pl } from './language-pack/language-pack';

/**
 * Converts a date and time to a short string.
 * - If the date is in the last 20 hours, the time is displayed in the format HH:MM.
 * - If the date is in the last 7 days, the weekday is displayed.
 * - If the date is older, the date is displayed in the format DD.MM.YY.
 * @param {Date|Number} date Input date
 */
export function smallDateTimeToString(date) {
    if(typeof date == 'number') date= TdLibDateToDate(date);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 20 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (date.getTime() >= yesterday.getTime()) {
        return timeToString(date);
    } else if (date.getTime() >= lastWeek.getTime()) {
        return weekdayToString(date);
    } else {
        return dateToString(date);
    }
}

/**
 * Formats time in 12-hour format
 * @param {Date|Number} date input date
 */
export function timeToString(date) {
    if(typeof date == 'number') date= TdLibDateToDate(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Formats weekday in WWW format
 * @param {Date|Number} date input date
 */
export function weekdayToString(date) {
    if(typeof date == 'number') date= TdLibDateToDate(date);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[date.getDay()];
}

/**
 * Formats date in DD.MM.YY format
 * @param {Date|Number} date input date
 */
export function dateToString(date) {
    if(typeof date == 'number') date= TdLibDateToDate(date);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    const year = String(date.getFullYear()).slice(2);
    if (day < 10) {
        day = `0${day}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    return `${day}.${month}.${year}`;
}

/**
 * Converts a future day to a string.  
 * If the day is today, returns 'today'.  
 * If the day is tomorrow, returns 'tomorrow'.  
 * If the day is neither today or tomorrow, returns the monthe and day. (eg. 'February 12')
 * @param {Date|Number} date Input date
 * @returns {string} `today`, `tomorrow` or month+day
 */
export function futureDayToString(date) {
    if(typeof date == 'number') date= TdLibDateToDate(date);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth()) {
        return 'today';
    } else if (date.getDate() == tomorrow.getDate() && date.getMonth() == tomorrow.getMonth()) {
        return 'tomorrow';
    } else {
        const months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }
}

/**
 * Converts a duration to string.
 * If the duration is less than 2 minutes, the string is in the format 'X seconds'.
 * If the duration is less than 2 hours, the string is in the format 'X minutes'.
 * If the duration is less than 1 day, the string is in the format 'X hours'.
 * If the duration is longer, the string is in the format 'X days'.
 * @param {Number} duration Duration in seconds
 */
export function durationToString(duration) {
    if (duration < 2 * 60) {
        return `${duration} seconds`;
    } else if (duration < 2 * 60 * 60) {
        return `${Math.floor(duration / 60)} minutes`;
    } else if (duration < 24 * 60 * 60) {
        return `${Math.floor(duration / 60 / 60)} hours`;
    } else {
        return `${Math.floor(duration / 24 / 60 / 60)} days`;
    }
}

export function lastSeenToString(status) {
    switch (status['@type']) {
    case 'userLastStatusMonth':
        return __('lng_status_last_month');
    
    case 'userStatusLastWeek':
        return __('lng_status_last_week');

    case 'userStatusOffline': {
        let current = Math.floor((new Date().getTime()) / 1000);
        let lastSeen = status.was_online;
        let diff = current - lastSeen; // Difference in seconds
        let diffMinutes = Math.floor(diff / 60);
        let diffHours = Math.floor(diff / 3600);
        
        if (diffMinutes < 1)
        {
            return __('lng_status_lastseen_now');
        }
        if (diffMinutes < 60)
        {
            return __pl('lng_status_lastseen_minutes', [diffMinutes]);
        }
        if (diffHours < 12)
        {
            return __pl('lng_status_lastseen_hours', [diffHours]);
        }
        
        let currentDate = TdLibDateToDate(current);
        let lastSeenDate = TdLibDateToDate(lastSeen);

        if (currentDate.getHours() - diffHours >= 0)
        {
            return __fmt('lng_status_lastseen_today', {time: lastSeenDate.toLocaleTimeString('en-US')});
        }
        if (currentDate.getHours() - diffHours < 0 && currentDate.getHours() - diffHours > -24)
        {
            return __fmt('lng_status_lastseen_yesterday', {time: lastSeenDate.toLocaleTimeString('en-US')});
        }
        return __fmt('lng_status_lastseen_date', {date: lastSeenDate.toLocaleDateString('en-US')});
    }

    case 'userStatusRecently':
        return __('lng_status_recently');

    case 'userStatusOnline':
        return __('lng_status_online');

    default: // userStatusEmpty
        return null;
    }
}

/**
 * Converts a TDLIb unix time to a `Date` object.
 */
export function TdLibDateToDate(tdLibDate) {
    return new Date(tdLibDate * 1000);
}