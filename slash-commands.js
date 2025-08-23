const { SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

// Create slash commands that mirror all existing . commands
const commands = [
    // Help Commands
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),

    new SlashCommandBuilder()
        .setName('help-music')
        .setDescription('Show music-related commands'),

    // Fun Commands
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test bot response'),

    new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get a random programming joke'),

    new SlashCommandBuilder()
        .setName('punch')
        .setDescription('Punch one or more users')
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Mention users to punch (or leave empty)')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap one or more users')
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Mention users to slap (or leave empty)')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick one or more users')
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Mention users to kick (or leave empty)')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug one or more users')
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Mention users to hug (or leave empty)')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Poke one or more users')
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Mention users to poke (or leave empty)')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('love')
        .setDescription('Send love to one or more users')
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Mention users to send love to (or leave empty)')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Cry with a GIF'),

    new SlashCommandBuilder()
        .setName('server')
        .setDescription('Show server info'),

    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Show your info'),

    // Time Commands
    new SlashCommandBuilder()
        .setName('timezones')
        .setDescription('Show current times for all regions'),

    new SlashCommandBuilder()
        .setName('time')
        .setDescription('Show time for a specific region')
        .addStringOption(option =>
            option.setName('region')
                .setDescription('Specify a region or group')
                .setRequired(true)),

    // Currency Command
    new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Convert currency')
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('Amount to convert')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('Currency to convert from (e.g., USD)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Currency to convert to (e.g., EUR)')
                .setRequired(true)),

    // Music Commands
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube by name or URL')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Play a full YouTube playlist')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('YouTube playlist URL')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing song'),

    new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),

    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and leave the voice channel'),

    new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current song queue'),

    new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle loop for the current song'),

    new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the songs in the queue'),
].map(command => command.toJSON());

// Deploy commands function
async function deploySlashCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        // Deploy commands globally (you can change this to guild-specific if needed)
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error deploying slash commands:', error);
    }
}

module.exports = { deploySlashCommands, commands };