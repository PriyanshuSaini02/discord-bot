require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleTimezonesCommand } = require('./features/clock');
const { handleFunCommands } = require('./features/fun');
const { handleCurrencyCommand } = require('./features/currency');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});


client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // Timezone commands
    handleTimezonesCommand(message);

    // Fun/general commands
    handleFunCommands(message);

    if (message.content.toLowerCase().startsWith('!convert')) {
    handleCurrencyCommand(message);
    }
});

client.login(process.env.DISCORD_TOKEN);
