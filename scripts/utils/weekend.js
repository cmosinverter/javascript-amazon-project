import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function isWeekend(date) {
    return date.day() === 0 || date.day() === 6;
}

export default isWeekend;