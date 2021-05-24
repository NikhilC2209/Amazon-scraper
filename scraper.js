// const express = require("express");
// const app = express();
// app.set("view engine","ejs");
// app.set("views", __dirname + "/views");


const nightmare = require("nightmare")();
require("dotenv").config()

const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSID, authToken);

async function amazonPrice() {
    try {
        const url = "https://www.amazon.in/Logitech-Prodigy-G213-Gaming-Keyboard/dp/B01K48R5V4";
        const urlArray = url.split('/');
        console.log(urlArray);
        const priceString = await nightmare.goto(url)
        .wait("#priceblock_ourprice")
        .evaluate(() => document.getElementById("priceblock_ourprice").textContent)

        const priceFloat = parseFloat(priceString.replace(priceString[0],'').replace(',',''));
        console.log(priceFloat)
        if(priceFloat < 4495) {
            sendSMS(`Price for ${urlArray[3]} is lower\n Click ${url} to view`);
        }
        if(priceFloat > 4495) {
            sendSMS(`Price for ${urlArray[3]} is higher\n Click ${url} to view`);
        }
        //console.log("here")
        await nightmare.end().catch(error => console.error(error))
    }
    catch (err) {
        console.log(err);
    }
}

function sendSMS(body) {
    client.messages.create({
        to: process.env.MY_PHONE_NUMBER,
        from: '+14158818616',
        body: body
    })
    .then((message) => {
        console.log(message.sid,"Message Sent")
    })
    .catch(err => console.log(err))
}

// app.get('/', function(req, res) {
//     amazonPrice();
//     res.render('index2');
// });

// app.get('/home', function(req, res) {
//     res.render('index');
// });

// app.listen(process.env.PORT || 3000,() => {
//     console.log("Server up and running at http://127.0.0.1:3000");
// })

amazonPrice()