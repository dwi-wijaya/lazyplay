export function parseDuration(duration) {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matches = duration.match(regex);
    
    const hours = (matches[1] ? parseInt(matches[1].replace('H', '')) : 0);
    const minutes = (matches[2] ? parseInt(matches[2].replace('M', '')) : 0);
    const seconds = (matches[3] ? parseInt(matches[3].replace('S', '')) : 0);
    
    const hoursString = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
    const minutesString = String(minutes).padStart(2, '0') + ':';
    const secondsString = String(seconds).padStart(2, '0');
    
    return hoursString + minutesString + secondsString;
}
