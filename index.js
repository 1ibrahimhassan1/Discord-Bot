const fetch = require('node-fetch')
const Discord = require('discord.js')
const fs = require('fs');

const discordClient = new Discord.Client();

//basically a superset of js' map data structure
discordClient.commands = new Discord.Collection();

//returns all filenames from commands folder that end in .js
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//populates the .commands data struct with all of the commands from the 
//commands file using the names kept in the commandFiles array
for (const file of commandFiles){
    const command = require(`./commands/${file}`)

    discordClient.commands.set(command.name, command);
}

discordClient.once('ready', () => {
    console.log('Ready!');
})

discordClient.on('message', message => {//searching actually works
    //splits recieved message into an array of strings
    let messageArr = message.content.slice(1).split(' ');

    if(!discordClient.commands.has(messageArr[0])) return;

    try{
        discordClient.commands.get(messageArr[0]).execute(message, messageArr)
    } catch (error){
        console.log(error);
        message.channel.send('Something went wrong when attempting to call the command!')
    }
})

discordClient.login(/*key removed*/);