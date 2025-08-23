// Import existing feature handlers
const musicHandler = require('./features/music');
const { handleTimezonesCommand } = require('./features/clock');
const { handleFunCommands } = require('./features/fun');
const { handleCurrencyCommand } = require('./features/currency');
const { handlehelpCommands } = require('./features/help');

// Helper function to convert slash command to message format for existing handlers
function createMessageFromSlash(interaction, content) {
    return {
        content: content,
        author: interaction.user,
        guild: interaction.guild,
        channel: interaction.channel,
        member: interaction.member,
        mentions: {
            users: new Map() // Will be populated based on mentions in content
        },
        reply: async (response) => {
            if (interaction.replied || interaction.deferred) {
                return await interaction.followUp(response);
            } else {
                return await interaction.reply(response);
            }
        }
    };
}

// Parse user mentions from string and create mentions object
function parseMentions(mentionString, guild) {
    const mentions = new Map();
    if (mentionString) {
        // Extract user IDs from mentions like <@123456789>
        const mentionMatches = mentionString.match(/<@!?(\d+)>/g);
        if (mentionMatches) {
            mentionMatches.forEach(match => {
                const userId = match.match(/\d+/)[0];
                const user = guild.members.cache.get(userId)?.user;
                if (user) {
                    mentions.set(userId, user);
                }
            });
        }
    }
    return mentions;
}

async function handleSlashCommand(interaction) {
    const { commandName, options } = interaction;

    try {
        switch (commandName) {
            // Help Commands
            case 'help': {
                const fakeMessage = createMessageFromSlash(interaction, '.help');
                handlehelpCommands(fakeMessage);
                break;
            }

            case 'help-music': {
                const fakeMessage = createMessageFromSlash(interaction, '.help-music');
                handlehelpCommands(fakeMessage);
                break;
            }

            // Fun Commands
            case 'ping': {
                const fakeMessage = createMessageFromSlash(interaction, '.ping');
                handleFunCommands(fakeMessage);
                break;
            }

            case 'joke': {
                const fakeMessage = createMessageFromSlash(interaction, '.joke');
                handleFunCommands(fakeMessage);
                break;
            }

            case 'punch':
            case 'slap':
            case 'kick':
            case 'hug':
            case 'poke':
            case 'love': {
                const users = options.getString('users') || '';
                const content = `.${commandName}${users ? ' ' + users : ''}`;
                const fakeMessage = createMessageFromSlash(interaction, content);
                fakeMessage.mentions.users = parseMentions(users, interaction.guild);
                handleFunCommands(fakeMessage);
                break;
            }

            case 'cry': {
                const fakeMessage = createMessageFromSlash(interaction, '.cry');
                handleFunCommands(fakeMessage);
                break;
            }

            case 'server': {
                const fakeMessage = createMessageFromSlash(interaction, '.server');
                handleFunCommands(fakeMessage);
                break;
            }

            case 'userinfo': {
                const fakeMessage = createMessageFromSlash(interaction, '.userinfo');
                handleFunCommands(fakeMessage);
                break;
            }

            // Time Commands
            case 'timezones': {
                const fakeMessage = createMessageFromSlash(interaction, '.timezones');
                handleTimezonesCommand(fakeMessage);
                break;
            }

            case 'time': {
                const region = options.getString('region');
                const fakeMessage = createMessageFromSlash(interaction, `.time ${region}`);
                handleTimezonesCommand(fakeMessage);
                break;
            }

            // Currency Command
            case 'convert': {
                const amount = options.getNumber('amount');
                const from = options.getString('from');
                const to = options.getString('to');
                const fakeMessage = createMessageFromSlash(interaction, `.convert ${amount} ${from} ${to}`);
                handleCurrencyCommand(fakeMessage);
                break;
            }

            // Music Commands
            case 'play': {
                const song = options.getString('song');
                const fakeMessage = createMessageFromSlash(interaction, `.play ${song}`);
                await musicHandler(fakeMessage);
                break;
            }

            case 'playlist': {
                const url = options.getString('url');
                const fakeMessage = createMessageFromSlash(interaction, `.playlist ${url}`);
                await musicHandler(fakeMessage);
                break;
            }

            case 'pause': {
                const fakeMessage = createMessageFromSlash(interaction, '.pause');
                await musicHandler(fakeMessage);
                break;
            }

            case 'resume': {
                const fakeMessage = createMessageFromSlash(interaction, '.resume');
                await musicHandler(fakeMessage);
                break;
            }

            case 'stop': {
                const fakeMessage = createMessageFromSlash(interaction, '.stop');
                await musicHandler(fakeMessage);
                break;
            }

            case 'skip': {
                const fakeMessage = createMessageFromSlash(interaction, '.skip');
                await musicHandler(fakeMessage);
                break;
            }

            case 'queue': {
                const fakeMessage = createMessageFromSlash(interaction, '.queue');
                await musicHandler(fakeMessage);
                break;
            }

            case 'loop': {
                const fakeMessage = createMessageFromSlash(interaction, '.loop');
                await musicHandler(fakeMessage);
                break;
            }

            case 'shuffle': {
                const fakeMessage = createMessageFromSlash(interaction, '.shuffle');
                await musicHandler(fakeMessage);
                break;
            }

            default:
                await interaction.reply({
                    content: 'Unknown slash command!',
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error('Error handling slash command:', error);

        const errorResponse = {
            content: 'There was an error executing this command!',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorResponse);
        } else {
            await interaction.reply(errorResponse);
        }
    }
}

module.exports = { handleSlashCommand };