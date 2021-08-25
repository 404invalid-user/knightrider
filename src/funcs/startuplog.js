/*
 * licence https://github.com/404invalid-user/knightrider/blob/main/LICENCE
 */
const fetch = require('node-fetch');
const { blue, red, magenta } = require('chalk');
const { version } = require('../../package.json')
module.exports = async() => {
    let latestVersion;
    let updatenote = 'no note';
    await fetch('https://raw.githubusercontent.com/404invalid-user/knightrider/main/package.json')
        .then(res => res.json())
        .then(json => {
            latestVersion = json.version;
            if (json.note) {
                updatenote = json.note;
            };
        });
    console.log("┌──────────────────────────────────────────────────────┐\n│ Made By: " + blue('404invalid') + red('-') + magenta('user') + " (https://invalidlag.com)    │\n└──────────────────────────────────────────────────────┘");

    const tablea = "┌────────────────────────────────────────┐";
    const tableb = "│ version infromation                    │";
    const tablec = "├──────────────────────┬─────────────────┤";
    const tabled = `│   Current Version:   │      ${version}    │`;
    const tablee = "├──────────────────────┼─────────────────┤";
    const tablef = `│    Lates Version:    │      ${latestVersion}    │`;
    const tableg = "├──────────────────────┼─────────────────┤";
    const tableh = `│   update note:       │ ${updatenote}│`;
    const tablei = "└──────────────────────┴─────────────────┘";
    console.log(tablea + '\n' + tableb + '\n' + tablec + '\n' + tabled + '\n' + tablee + '\n' + tablef + '\n' + tableg + '\n' + tableh + '\n' + tablei)
}