const fetch = require('node-fetch');

//connecting to server
let apiKey = '?api_key=RGAPI-3a88808d-7e83-4fde-8429-046ea357a2da';
const riotUrl = 'https://na1.api.riotgames.com'

//routes
const getSummonerInfo = `/lol/summoner/v4/summoners/by-name/`;
const getActiveGame = `/lol/spectator/v4/active-games/by-summoner/`; //ends with {encryptedSummonerId}

module.exports = {
    name: 'ingame',
    description: 'returns a list of summoners who are in game and who are not from the summoners provided',
    key: apiKey,
    execute(message, messageArr){
        if(messageArr.length >= 2 && messageArr.length < 20){
            let summonerName = messageArr.slice(1).map(summoner => summoner.replace('_', ' '));
            let summonerIngame = [], summonerNotIngame = [], summonerNotFound = [];

            console.log(`Searching for: ${summonerName}`)

            let searches = summonerName.map(summoner => {
                return fetch(riotUrl + getSummonerInfo + summoner + this.key)
                .then(res => res.json())
                .then((data) => {
                    return fetch(riotUrl + getActiveGame + data.id + this.key)
                })
                .catch((err) => console.log(err))
                .then(res => res.json())
                /*purposefully removed*/
                )
                .catch((rejectedData) => {
                    //console.log('Could not find ' + summonerName + "'s game. The result code is: " + rejectedData.result)
                    return rejectedData
                })
            })
    
            Promise.all(searches)
            .then(data => data.forEach(summoner => {
                if(summoner.result === 20){
                    summonerIngame.push(summoner.summonerInQuestion)
                } else if(summoner.result === 10){
                    summonerNotIngame.push(summoner.summonerInQuestion)
                } else if(summoner.result === 0){
                    summonerNotFound.push(summoner.summonerInQuestion)
                }
            }))
            .then(() => {
                let result = '';
                
                if(summonerIngame.length > 0){
                    result = result.concat(`Summoner(s) currently in game: ${summonerIngame}\n`)
                }
                if(summonerNotIngame.length > 0) {
                    result = result.concat(`Summoner(s) currently not in game: ${summonerNotIngame}\n`)
                }
                if(summonerNotFound.length > 0) {
                    result = result.concat(`Summoner(s) not found: ${summonerNotFound}`)
                }

                message.channel.send(result)
            })
        } else {
            message.channel.send('Be sure to include the names of the summoners you want to search after the command! Also, keep in mind that summoners requiring a space in between words should have the words separated by an underscore.')
        }
    }
}