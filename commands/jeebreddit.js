const fetch = require('node-fetch');

//will contain list of subReddits already searched so their 
//index (or number of times searched) is stored separately
let subReddit = {};

module.exports = {
    name: 'jeebreddit',
    description: "gets post from a specific subreddit's front pag",
    execute(message, messageArr){
        fetch(`https://www.reddit.com/r/${messageArr[1]}.json?limit=100`)
        .then(res => res.json())
        .then(data => data.data.children.map(listing => listing.data))
        .then(data => {
            //why this check? for some reason, some subreddits that don't exist
            //don't return a 404. we'll check here and make sure that we've actually
            //tapped a subreddit that exists and have recieved an array of images
            if(data.length !== 0){
                //checks if subreddit searched has already been searched
                //for. if it has been, increment the number of times indicating
                //how many times it has been searched for. if it has not been 
                //searched for previously, create an instance of it in the 
                //subreddit JSON object.
                if(subReddit[messageArr[1]]) {
                    if(subReddit[messageArr[1]].searchIndex < 100){
                        subReddit[messageArr[1]].searchIndex++;
                    } else {
                        subReddit[messageArr[1]].searchIndex = 2;
                    }
                } else{
                    subReddit[messageArr[1]] = {searchIndex: 2};
                }

                message.channel.send(data[subReddit[messageArr[1]].searchIndex].url)
                .then(() => data[subReddit[messageArr[1]].searchIndex].url.includes('www.reddit.com') ? console.log('URL sent is not an image/video/gif') : message.channel.send(`Link is: https://www.reddit.com${data[subReddit[messageArr[1]].searchIndex].permalink}`))
                .catch(err => {
                    message.channel.send('This subbreddit exists, but is likely empty!')
                    console.log(`IN MESSAGE.SEND ERROR: ${err}`)
                })                    

                console.log(`Current post number of /r/${messageArr[1]} is: ${subReddit[messageArr[1]].searchIndex}`);
            } else{
                message.channel.send("Something went wrong! You likely tried to find a reddit that doesn't exist!")
            }
        })
        .catch(err => {
            message.channel.send("Something went wrong! You likely tried to find a reddit that doesn't exist!")
            console.log('IN ERROR: ' + err)
        })
    }
}

//can apparently append .json to the end of all endpoints designated
//"listing" to get a json response containing all of the data
//you will find the data in the response.json() response in
//data.data.children
