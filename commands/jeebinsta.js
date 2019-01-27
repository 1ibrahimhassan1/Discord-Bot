const puppeteer = require('puppeteer');

let instagram = {};

module.exports = {
    name: 'jeebinsta',
    description: "gets post from a specific instagram's front page",
    postNumber: 0,
    execute(message, messageArr){
        if(message.author.id === '148673724718120960'){

            //checks if instagram user has been searched for
            if(!instagram[messageArr[1]]){
                instagram[messageArr[1]] = {rowNumber: 0, picInRow: 0}
            }

            puppeteer.launch({headless: false})
            .then(async browser => {
                console.log('launching...')
                const page = await browser.newPage();
                console.log(instagram)
                await page.goto(`https://www.instagram.com/${messageArr[1]}`)
                .catch(() => message.channel.send('It appears something has gone wrong! The connection has likely timed out.'))  

                await page.evaluate((instagram, messageArr) => {
                    let testing = document.getElementById('react-root').children;//returns 2 kids
                    let testing2 = testing[1].children;//select second kid, then get kids, returns 3 kids
                    let testing3 = testing2[0].children;//select only child, returns 4 kids
                    let testing4 = testing3[0].children;//select last kid, returns single kid
                    let testing5 = testing4[3].children;//select only child, return 2 kids
                    let testing6 = testing5[0].children;//select first child, returns 1 kid
                    let testing7 = testing6[0].children;//select only child, returns 8 kids
                    let testing8 = testing7[0].children;//since each kid represents a row and each row contains
                                                        //3 pictures, select any row 1-8 and any photo 1-3
                    let testing9 = testing8[instagram[messageArr[1]].rowNumber].children;//will select first row, returns 3 kids
                    let testing10 = testing9[instagram[messageArr[1]].picInRow].children;//select first photo out of the row, for testing
                    let testing11 = testing10[0].getAttribute('href');
            
                    console.log(testing11);
            
                    return testing11;
                }, instagram, messageArr)       
                .then(picUrl => {
                    if(instagram[messageArr[1]].rowNumber > 8){
                        instagram[messageArr[1]].rowNumber = 0;
                    }
    
                    if(instagram[messageArr[1]].picInRow < 2){
                        instagram[messageArr[1]].picInRow++;
                    } else{
                        instagram[messageArr[1]].picInRow = 0;
                        instagram[messageArr[1]].rowNumber++;
                    }

                    message.channel.send(`https://www.instagram.com/${messageArr[1]}${picUrl}`)
                })
                .catch(() => message.channel.send("Oops! The instagram user you looked for either has no pictures, doesn't exist, has their account set to private, or has the page layout magically restructured by instagram because fuck web scrapers :^)!"))
                
                await browser.close()
                console.log('closing...');
            })
        } else {
            message.channel.send("you aren't authorized!")
        }
    }
}
