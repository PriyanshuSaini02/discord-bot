const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Import feature handlers
const musicHandler = require('./features/music');
const { handleTimezonesCommand } = require('./features/clock');
const { handleFunCommands } = require('./features/fun');
const { handleCurrencyCommand } = require('./features/currency');
const { handlehelpCommands } = require('./features/help');

// Import slash command functionality
const { deploySlashCommands } = require('./slash-commands');
const { handleSlashCommand } = require('./slash-handlers');

// Create bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once('ready', async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
    console.log(`🔧 Deploying slash commands...`);

    // Deploy slash commands when bot is ready
    await deploySlashCommands();

    console.log(`✅ Bot ready! Supports both . commands and / slash commands`);
});

// Handle legacy message commands (existing functionality preserved)
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();

    // Handle features with existing logic
    handlehelpCommands(message);
    musicHandler(message);
    handleTimezonesCommand(message);
    handleFunCommands(message);

    if (content.toLowerCase().startsWith('.convert')) {
        handleCurrencyCommand(message);
    }
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    await handleSlashCommand(interaction);
});

client.login(process.env.DISCORD_TOKEN);
