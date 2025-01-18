require('dotenv').config({ path: __dirname + '/../.env' });

import { connect } from './database/index';
import { login } from './bot/index';
import updateSlashCommands from './updateSlashCommands';
import { start } from './site/index'

async function main(): Promise<void> {
    await connect();
    await login();
    if (process.env.RELOADCMDS !== 'false') await updateSlashCommands();
    await start();
}

main();