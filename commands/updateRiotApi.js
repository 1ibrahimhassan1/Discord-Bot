let ingame = require('./ingame')

module.exports = {
    name: 'updateriotapi',
    description: "updates the api key to access riot's api",
    execute(message, messageArr){
        if(message.author.id === '148673724718120960'){
            ingame.key = `?api_key=${messageArr[1]}`;
            message.channel.send('Updated api key!')
        } else {
            message.channel.send("you aren't authorized!")
        }
    }
}