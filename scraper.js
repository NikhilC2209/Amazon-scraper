const nightmare = require("nightmare")();
require("dotenv").config()

const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSID, authToken);

amazonPrice();

async function amazonPrice() {
    try {
        const url = "https://www.amazon.in/Logitech-Prodigy-G213-Gaming-Keyboard/dp/B01K48R5V4";
        const urlArray = url.split('/');
        console.log(urlArray);
        const priceString = await nightmare.goto(url)
        .wait("#priceblock_ourprice")
        .evaluate(() => document.getElementById("priceblock_ourprice").textContent)
        .end()

        const priceFloat = parseFloat(priceString.replace(priceString[0],'').replace(',',''));
        if(priceFloat < 4495) {
            sendSMS(`Price for ${urlArray[3]} is lower\n Click ${url} to view`);
        }
        if(priceFloat > 4495) {
            sendSMS(`Price for ${urlArray[3]} is higher\n Click ${url} to view`);
        }
    }
    catch (err) {
        console.log(err);
    }
}

function sendSMS(body) {
    client.messages.create({
        to: process.env.MY_PHONE_NUMBER,
        from: '+14153199497',
        body: body
    })
    .then((message) => {
        console.log(message.sid,"Message Sent");
    })
    .catch(err => console.log(err))
}