const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    getVoiceConnection,
} = require('@discordjs/voice');
const play = require('play-dl');
const ytdl = require('@distube/ytdl-core');

const player = createAudioPlayer();
const queue = new Map(); // guildId -> queue data
const isLooping = new Map(); // guildId -> loop state

module.exports = async function handleMusic(message) {
    const args = message.content.trim().split(' ');
    const command = args.shift().toLowerCase();

    const guildId = message.guild.id;
    const serverQueue = queue.get(guildId) || {
        songs: [],
        isPlaying: false,
        connection: null,
        textChannel: message.channel
    };
    queue.set(guildId, serverQueue);

    if (command === '.play') {
        const query = args.join(' ');
        if (!message.member.voice.channel) return message.reply('❌ Join a voice channel first!');
        if (!query) return message.reply('❌ Provide a song name or URL.');

        try {
            let songsToAdd = [];

            if (play.yt_validate(query) === 'playlist') {
                const playlist = await play.playlist_info(query);
                const videos = await playlist.all_videos();
                songsToAdd = videos.map(video => ({ title: video.title, url: video.url }));
                message.reply(`📃 Added ${songsToAdd.length} songs from playlist.`);
            } else if (ytdl.validateURL(query)) {
                const info = await play.video_info(query);
                songsToAdd = [{ title: info.video_details.title, url: info.video_details.url }];
            } else {
                const results = await play.search(query, { limit: 1 });
                if (!results.length) return message.reply('❌ No results found.');
                songsToAdd = [{ title: results[0].title, url: results[0].url }];
            }

            serverQueue.songs.push(...songsToAdd);

            if (!serverQueue.isPlaying) {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                serverQueue.connection = connection;
                connection.subscribe(player);
                playNext(guildId);
            } else {
                message.reply(`✅ Added ${songsToAdd.length} song(s) to queue.`);
            }
        } catch (err) {
            console.error(err);
            message.reply('❌ Error playing song.');
        }

    } else if (command === '.skip') {
        player.stop(true);
        message.reply('⏭️ Skipped the song.');

    } else if (command === '.stop') {
        getVoiceConnection(guildId)?.destroy();
        queue.delete(guildId);
        isLooping.delete(guildId);
        player.stop(true);
        message.reply('🛑 Stopped and cleared queue.');

    } else if (command === '.queue') {
        try {
            if (serverQueue.songs.length === 0) {
                message.reply('📭 The queue is empty.');
            } else {
                let queueList = serverQueue.songs.map((s, i) => `${i + 1}. ${s.title}`);
                const chunkSize = 10;

                for (let i = 0; i < queueList.length; i += chunkSize) {
                    const chunk = queueList.slice(i, i + chunkSize).join('\n');
                    await message.channel.send(`📃 **Queue (Part ${Math.floor(i / chunkSize) + 1}):**\n${chunk}`);
                }
            }
        } catch (err) {
            console.error('❌ Error showing queue:', err);
            message.reply('❌ Could not display queue.');
        }

    } else if (command === '.pause') {
        player.pause();
        message.reply('⏸️ Paused.');

    } else if (command === '.resume') {
        player.unpause();
        message.reply('▶️ Resumed.');

    } else if (command === '.loop') {
        const loop = !isLooping.get(guildId);
        isLooping.set(guildId, loop);
        message.reply(`🔁 Loop is now ${loop ? 'ON' : 'OFF'}.`);

    } else if (command === '.shuffle') {
        if (serverQueue.songs.length <= 1) return message.reply('Not enough songs.');
        for (let i = serverQueue.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [serverQueue.songs[i], serverQueue.songs[j]] = [serverQueue.songs[j], serverQueue.songs[i]];
        }
        message.reply('🔀 Shuffled.');
    }
};

async function playNext(guildId) {
    const serverQueue = queue.get(guildId);
    if (!serverQueue || !serverQueue.songs.length) {
        serverQueue?.connection?.destroy();
        queue.delete(guildId);
        return;
    }

    const song = serverQueue.songs[0];
    serverQueue.isPlaying = true;

    try {
        const stream = ytdl(song.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });
        const resource = createAudioResource(stream);
        player.play(resource);
        serverQueue.textChannel.send(`🎶 Now playing: **${song.title}**`);
    } catch (err) {
        console.error(err);
        serverQueue.textChannel.send(`❌ Failed to play: **${song.title}**, skipping.`);
        serverQueue.songs.shift();
        playNext(guildId);
    }
}

player.on(AudioPlayerStatus.Idle, () => {
    const [guildId] = queue.keys();
    const serverQueue = queue.get(guildId);
    if (!serverQueue) return;

    if (!isLooping.get(guildId)) {
        serverQueue.songs.shift();
    }
    playNext(guildId);
});
