const jsonFile = require('./assets/config.json');
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var jsonData = jsonFile.ITEMS;

function getPassWord(password){

    readLine.question('PASSWORD: ', password =>{
        
        if (password === jsonFile.ITEMS.PASS_W){
            console.log(`CLIENT TOKEN: ${jsonFile.ITEMS.TOKEN}`);
            const clientFile = require('./src/bot.js');
        }

        else{
            console.log('PASSWORD INCORRECT');
        }
    });
            
} 

getPassWord();