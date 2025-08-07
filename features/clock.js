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

// 🔧 Helper: get time string
function formatTime(name, zone) {
    const time = moment().tz(zone).format('hh:mm A');
    return `${name.padEnd(12)}: ${time}  (${zone})`;
}

// 🔧 Show all times
function getTimes() {
    let msg = '```Current Times:\n\n';
    for (const [name, zone] of entries) {
        msg += formatTime(name, zone) + '\n';
    }
    msg += '```';
    return msg;
}

// 🔧 Show filtered times
function getGroupTimes(group) {
    const filtered = entries.filter(([_, zone]) =>
        zone.toLowerCase().includes(group.toLowerCase())
    );

    if (filtered.length === 0) return null;

    let msg = `\`\`\`Times for: ${group.toUpperCase()}\n\n`;
    for (const [name, zone] of filtered) {
        msg += formatTime(name, zone) + '\n';
    }
    msg += '```';
    return msg;
}

// 📦 Main handler
function handleTimezonesCommand(message) {
    const content = message.content.trim().toLowerCase();

    if (content === '.timezones') {
        message.channel.send(getTimes());
        return;
    }

    if (content.startsWith('.time')) {
        const parts = content.split(' ');
        if (parts.length === 1) {
            message.channel.send("🕐 Please specify a region or group: `.time <region>`");
            return;
        }

        const input = parts[1].toUpperCase();

        // Exact region name match
        const match = entries.find(([name]) => name === input);
        if (match) {
            const [name, zone] = match;
            const time = moment().tz(zone).format('hh:mm A');
            message.channel.send(`🕓 **${name}** time: ${time} (${zone})`);
            return;
        }

        // Group match (e.g., "europe", "india")
        const groupTimes = getGroupTimes(input);
        if (groupTimes) {
            message.channel.send(groupTimes);
        } else {
            message.channel.send(`❌ No timezones found for \`${input}\``);
        }
    }
}

module.exports = { handleTimezonesCommand };
