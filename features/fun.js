// fun.js
const jokes = require('./jokes.json');
const punchGifs = require('./punch.json');
const slapGifs = require('./slap.json');
const kickGifs = require('./kick.json');
const hugGifs = require('./hug.json');
const pokeGifs = require('./poke.json');
const loveGifs = require('./love.json');
const cryGifs = require('./cry.json');

function handleFunCommands(message) {
    const msg = message.content.toLowerCase();

    // Ping
    if (msg === '.ping') {
        return message.reply('🏓 Pong!');
    }
    // Joke
    if (msg === '.joke') {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        return message.reply(randomJoke);
    }

    // Action commands
    if (msg.startsWith('.punch')) {
        return sendGifCommand(message, punchGifs, "👊", ["punched", "smacked", "hit"]);
    }
    if (msg.startsWith('.slap')) {
        return sendGifCommand(message, slapGifs, "🖐️", ["slapped", "smacked", "whacked"]);
    }
    if (msg.startsWith('.kick')) {
        return sendGifCommand(message, kickGifs, "🦵", ["kicked", "booted", "dropkicked"]);
    }
    if (msg.startsWith('.hug')) {
        return sendGifCommand(message, hugGifs, "🤗", ["hugged", "embraced"]);
    }
    if (msg.startsWith('.poke')) {
        return sendGifCommand(message, pokeGifs, "👉", ["poked", "tapped", "prodded"]);
    }
    if (msg.startsWith('.love')) {
        return sendGifCommand(message, loveGifs, "❤️", ["sent love to", "showed love to", "shared hearts with"]);
    }
    if (msg.startsWith('.cry')) {
        return sendGifCommand(message, cryGifs, "😭", ["is crying", "sheds tears", "is sobbing"], true);
    }

    // Server info
    if (msg === '.server') {
        return message.reply(`📌 Server name: **${message.guild.name}**\n👥 Members: **${message.guild.memberCount}**`);
    }

    // User info
    if (msg === '.userinfo') {
        return message.reply(`👤 Username: **${message.author.username}**\n🆔 ID: **${message.author.id}**`);
    }
}

// Helper function for action GIFs
function sendGifCommand(message, gifArray, emoji, actionVariations, isSelfOnly = false) {
    const mentionedUsers = message.mentions.users;
    const randomGif = gifArray[Math.floor(Math.random() * gifArray.length)];
    const randomAction = actionVariations[Math.floor(Math.random() * actionVariations.length)];

    if (mentionedUsers.size > 0 && !isSelfOnly) {
        const mentionsList = Array.from(mentionedUsers.values())
            .map(user => `<@${user.id}>`)
            .join(', ');
        return message.channel.send(`${emoji} **<@${message.author.id}>** ${randomAction} **${mentionsList}**!\n${randomGif}`);
    } else {
        return message.channel.send(`${emoji} **<@${message.author.id}>** ${randomAction}!\n${randomGif}`);
    }
}

module.exports = { handleFunCommands };
