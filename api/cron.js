import { supabase } from '@services/supabase'

export default async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('songs')
            .delete()
            .eq('status', -2);

        if (error) {
            logError(`Error deleting songs: ${error.message}`);
            res.status(500).json({ error: error.message });
        } else {
            logSuccess(`Successfully deleted songs: ${data.length} rows affected`);
            res.status(200).json({ message: 'Old songs deleted', data });
        }
    } catch (err) {
        logError(`Unexpected error: ${err.message}`);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

const logSuccess = (message) => {
    const logMessage = `[${new Date().toISOString()}] SUCCESS: ${message}\n`;
    writeLog(logMessage);
    console.log(logMessage);
};

const logError = (message) => {
    const logMessage = `[${new Date().toISOString()}] ERROR: ${message}\n`;
    writeLog(logMessage);
    console.error(logMessage);
};

const writeLog = (message) => {
    const logFilePath = join(process.cwd(), 'logs', 'cronDeleteSongs.log');
    writeFileSync(logFilePath, message, { flag: 'a' });
};