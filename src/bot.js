const { randomInt, sign } = require('crypto');
const discord = require('discord.js');
const client = new discord.Client();
const jsonPackage = require('../assets/package.json');
const jsonConfig = require('../assets/config.json');
const yt = require('ytdl-core');
const botToken = jsonConfig.ITEMS.TOKEN;
const genChannelId = //General channel id goes here;
const genChannel = client.channels.cache.find(
    channel => channel.id === genChannelId
);

var isOnline = false;

function onLogin() {
    client.on('ready', () => {
        console.log('Bot logged in as: ' + client.user.tag);
        isOnline = true;

        const loginEmbed = new discord.MessageEmbed()

            .setTitle('BALEX')
            .setColor('#FFF700')
            .setAuthor('Masen')
            .setDescription('Super Admin Bot')
            .setThumbnail('https://64.media.tumblr.com/7ec6f0c954bc1b766869e7ba061032ec/e2089a02b59fe93a-27/s640x960/2e28536b545452ab07c0745e65a7fb08855ac2ba.jpg')
            .addField('Alt Name', 'JS-Bot')
            .addField('Version:', jsonPackage.version)
            .addField('Language: ', 'Javascript', true)
            .setImage('https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png')
            .setTimestamp()
            .setFooter('BALEX');

        const helpEmbed = new discord.MessageEmbed()

            .setColor('#fff700')
            .setDescription('Type: $help for a list of commands')
            .setThumbnail('https://64.media.tumblr.com/7ec6f0c954bc1b766869e7ba061032ec/e2089a02b59fe93a-27/s640x960/2e28536b545452ab07c0745e65a7fb08855ac2ba.jpg')
            .setTimestamp()
            .setFooter('BALEX');

        client.channels.cache.get(genChannelId).send(loginEmbed);
        client.channels.cache.get(genChannelId).send(helpEmbed);

        if (isOnline === true) {
            console.log('BOT ONLINE');
        }

    });
}

client.on('ready', () => {
    console.log('CLIENT IS READY');
});

client.on('message', async msg => {

    console.log(`${msg.content}`);

    if (msg.content.startsWith(`${jsonConfig.prefix}playAudio`)) {
        playAudio(msg);
        return;
    }

    if (msg.content.startsWith(`${jsonConfig.prefix}stopAudio`)) {
        stopAudio(msg);
        return;
    }
    
    if (msg.content.startsWith(`${jsonConfig.prefix}kick`)) {
        kickUser(msg);
        return;
    }

    if (msg.content.startsWith(`${jsonConfig.prefix}ban`)) {
        banUser(msg);
        return;
    }

    if (msg.content.startsWith(`${jsonConfig.prefix}help`)) {
        const helpDisplayEmbed = new discord.MessageEmbed()

            .setColor('#fff700')
            .setTitle('Commands')
            .setThumbnail('https://64.media.tumblr.com/7ec6f0c954bc1b766869e7ba061032ec/e2089a02b59fe93a-27/s640x960/2e28536b545452ab07c0745e65a7fb08855ac2ba.jpg')
            .addField(`${jsonConfig.prefix}playAudio :`, 'Plays audio @ mentioned URL')
            .addField(`${jsonConfig.prefix}stopAudio :`, 'Stops audio stream')
            .addField(`${jsonConfig.prefix}ping :`, 'Gets user and client latency')
            .addField(`${jsonConfig.prefix}kick :`, 'Kicks mentioned member')
            .addField(`${jsonConfig.prefix}ban :`, 'Bans mentioned member')
            .setTimestamp()
            .setFooter('BALEX');

        client.channels.cache.get(genChannelId).send(helpDisplayEmbed);

        return;
    }

    if (msg.content === '$ping') {  
        msg.channel.send(`USER Latency: ${Date.now() - msg.createdTimestamp}ms. CLIENT Latency: ${Math.round(client.ws.ping)}ms`);
    }
});

async function playAudio(msg) {
    try {
        const args = msg.content.split(' ');

        if (!args[1]) return msg.channel.send('Please specify a URL.');
        const voiceChannel = msg.member.voice.channel;

        if (!voiceChannel) msg.channel.send('You need to be in a voice channel to play music.');

        if (args[1].includes('youtube.com')) {
            voiceChannel.join().then(connection => {
                console.log(`${client.user.tag} JOINED VOICE CHANNEL`);

                const audioStream = yt(args[1]);
                connection.play(audioStream).on('end', () => {
                    console.log('AUDIO FINISHED');
                }).on('error', error => {
                    console.error(error);
                })

                console.log(`PLAYING AUDIO: ${[args[1]]}`);

            }).catch(error => {
                console.log(error);

            });

        }

    } catch {
        console.error('COULD\'NT JOIN VOICE CHANNEL');
    }
}

async function stopAudio(msg) {
    try {
        const voiceChannel = msg.member.voice.channel.leave();
        console.log(`${client.user.tag} LEFT VOICE CHANNEL`);
    } catch {
        console.error('ERROR leaving voice channel');
    }
}

async function kickUser(msg) {
    try {
        if (!msg.guild) return;
        const user = msg.mentions.users.first();

        if (user) {
            const member = msg.guild.members.resolve(user);

            if (member) {
                member.kick().then(() => {
                    msg.channel.send(`KICKED ${user.tag}`);
                }).catch(error => {
                    console.error(err);
                });
            } else {
                msg.channel.send('That user isn\'t in this guild');
            }
        } else {
            msg.channel.send('No user was mentioned.');
        }
    } catch {
        console.error('ERROR KICKING MEMBER');
    }
}

async function banUser(msg) {
    try {
        if (!msg.guild) return;
        const user = msg.mentions.users.first();

        if (user) {
            const member = msg.guild.members.resolve(user);

            if (member) {
                member.ban().then(() => {
                    msg.channel.send(`BANNED ${user.tag}`);
                }).catch(error => {
                    console.error(err);
                });
            } else {
                msg.channel.send('That user isn\'t in this guild');
            }
        } else {
            msg.channel.send('No user was mentioned.');
        }
    } catch {
        console.error('ERROR BANNING MEMBER');
    }
}

client.login(botToken);
onLogin();
