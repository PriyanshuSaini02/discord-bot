const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Import feature handlers
const musicHandler = require('./features/music');
const { handleTimezonesCommand } = require('./features/clock');
const { handleFunCommands } = require('./features/fun');
const { handleCurrencyCommand } = require('./features/currency');
const { handlehelpCommands }= require('./features/help')

// Create bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();

    // Handle features
    handlehelpCommands(message);
    musicHandler(message);
    handleTimezonesCommand(message);
    handleFunCommands(message);

    if (content.toLowerCase().startsWith('.convert')) {
        handleCurrencyCommand(message);
    }
});

client.login(process.env.DISCORD_TOKEN);
