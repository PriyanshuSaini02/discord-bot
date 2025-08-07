// Help
function handlehelpCommands(message) {
    const msg = message.content.toLowerCase();
    if (msg === '.help') {
        return message.reply(
            "**Commands:**\n" +
            "`.ping` - Test bot response\n" +
            "`.joke` - Get a random programming joke\n" +
            "`.punch [@user(s)]` - Punch one or more users\n" +
            "`.slap [@user(s)]` - Slap one or more users\n" +
            "`.kick [@user(s)]` - Kick one or more users\n" +
            "`.hug [@user(s)]` - Hug one or more users\n" +
            "`.poke [@user(s)]` - Poke one or more users\n" +
            "`.love [@user(s)]` - Send love to one or more users\n" +
            "`.cry` - Cry with a GIF\n" +
            "`.server` - Show server info\n" +
            "`.userinfo` - Show your info\n" +
            "`.timezones` - Show current times for all regions\n" +
            "`.time <region>` - Show time for a specific region\n" +
            "`.convert <Ammount> <From> <To>` - convert the currecy\n" +
            "`.help-music` - Show commands related to music"
        );
    }
    else if (msg === '.help-music') {
        return message.reply(
            "**Commands:**\n" +
            "`.play < song / url >` -  Play a song from YouTube by name or URL\n" +
            "`.playlist < url >` - Play a full YouTube playlist\n" +
            "`.pause` - Pause the currently playing song\n" +
            "`.resume` - Resume the paused song\n" +
            "`.stop` - Stop the music and leave the voice channel\n" +
            "`.skip` - Skip the current song\n" +
            "`.queue` - Display the current song queue\n" +
            "`.loop` - Toggle loop for the current song\n" +
            "`.shuffle` - Shuffle the songs in the queue\n"
        );
    }
}

module.exports={handlehelpCommands};