export const parseState = (state) => {
    const status = {
        '-2': 'Queue',
        '-1': 'Waiting',
        '0': 'Ended',
        '1': 'Playing',
        '2': 'Paused',
        '3': 'Buffering',
        '5': 'Cued',
    }
    return status.hasOwnProperty(state) ? status[state] : '-'
}
export const stateIcon = (state) => {
    const statusIcon = {
        '-2': 'fal fa-hourglass-start',
        '-1': 'fal fa-spinner-third fa-spin',
        '0': 'fal fa-circle-stop',
        '1': 'fal fa-waveform-lines',
        '2': 'fal fa-circle-pause',
        '3': 'fas fa-spinner-third fa-spin',
        '5': 'Cued',
    }
    return statusIcon.hasOwnProperty(state) ? statusIcon[state] : '-'

}
