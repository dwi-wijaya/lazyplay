export const parseState = (state) => {
    const status = {
        '-2': 'Queue',
        '-1': 'Not Started',
        '0': 'Ended',
        '1': 'Playing',
        '2': 'Paused',
        '3': 'Buffering',
        '5': 'Cued',
    }
    return status.hasOwnProperty(state) ? status[state] : '-'
}
