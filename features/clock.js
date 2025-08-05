const moment = require('moment-timezone');

const entries = [
    ['ASIA', 'Asia/Kolkata'],
    ['EU', 'Europe/Berlin'],
    ['UK', 'Europe/London'],
    ['NYC', 'America/New_York'],
    ['LA', 'America/Los_Angeles'],
    ['CHICAGO', 'America/Chicago'],
    ['TORONTO', 'America/Toronto'],
    ['VANCOUVER', 'America/Vancouver'],

    // India
    ['INNOCENT', 'Asia/Kolkata'],
    ['MAYON', 'Asia/Kolkata'],
    ['KREJIL', 'Asia/Kolkata'],
    ['INFERNIUS', 'Asia/Kolkata'],
    ['PHANTOM', 'Asia/Kolkata'],
    ['PLURK', 'Asia/Kolkata'],
    ['VANSH', 'Asia/Kolkata'],
    ['DANA', 'Asia/Kolkata'],
    ['GLITCH', 'Asia/Kolkata'],
    ['CHROME', 'Asia/Kolkata'],
    ['FATHOMICS', 'Asia/Kolkata'],
    ['WEI', 'Asia/Kolkata'],

    // Europe
    ['15', 'Europe/London'],
    ['NEON', 'Europe/Amsterdam'],
    ['NANACHI', 'Europe/Brussels'],

    // America
    ['TRG', 'America/Toronto'],
    ['BOZOLORD', 'America/New_York'],
    ['FLAME', 'America/Chicago'],
];

// Format all time zones for "!timezones"
// function getTimes() {
//     let msg = '```';
//     msg += `Current Times:\n\n`;
//     for (const [name, zone] of entries) {
//         const time = moment().tz(zone).format('hh:mm A');
//         msg += `${name.padEnd(12)}: ${time}  (${zone})\n`;
//     }
//     msg += '```';
//     return msg;
// }

function handleTimezonesCommand(message) {
    const content = message.content.toLowerCase();

    // Show all timezones (no role restriction now)
    if (content === '`timezones') {
        return message.channel.send(getTimes());
    }

    // Show time for a specific region
    if (content.startsWith('`time ')) {
        const regionInput = content.split(' ')[1].toUpperCase();
        const match = entries.find(([name]) => name === regionInput);

        if (!match) {
            message.channel.send(`❌ Unknown region: ${regionInput}`);
        } else {
            const [name, zone] = match;
            const time = moment().tz(zone).format('hh:mm A');
            message.channel.send(`**${name}** time: ${time} (${zone})`);
        }
    }
}

module.exports = { handleTimezonesCommand };
