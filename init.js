var mineflayer = require('mineflayer');
var options = {
    host: "constantiam.net", // optional
    port: 25565, // optional
    username: "OBF", // email and password are required only for
    password: "OBF", // online-mode=true servers
    version: "1.12.2"
};
var bot = mineflayer.createBot(options);
bindevents(bot);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var firsttrigger = false;

function chat(msg) {
    bot.chat(JSON.stringify(msg.substr(0, 80)).replace(/\"/g, ""));
}
bot._client.once('session', session => options.session = session);

function bindevents(newbot) {
    newbot.on('spawn', () => {
        if (!firsttrigger) {
            console.log("START!!!");
            chat("> Available Commands : !whois, !iam, !randomquote, !age, !kys, !eval, !pos");
            firsttrigger = true;
            setInterval(function() {
                chat("> Available Commands : !whois, !iam, !randomquote, !age, !kys, !eval, !pos");
            }, 300000);
        }
    });
    newbot.on("message", function(message) {
        var fs = require('fs');
        console.log(message.toMotd().replace(/§./gi, ""));
        if (message.toMotd().replace(/§./gi, "").startsWith("Dosbillones")) {
            var killer = message.toMotd().replace(/§./gi, "").split("\n")[message.toMotd().replace(/§./gi, "").split("\n").length];
            console.log(killer);
            fs.readFile('leaderboard.json', function(err, data) {
                var json = JSON.parse(data);
                json[killer] = (json[killer] || 0) + 1;
                fs.writeFile("whois.json", JSON.stringify(json), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            });
        }
        if (/(?<=whispers: tell )[^ ]*/gi.test(message.toMotd().replace(/§./gi, "")) && !message.toMotd().replace(/§./gi, "").startsWith("<") && /(?<=whispers: tell )[^ ]*/gi.test(message.toMotd().replace(/§./gi, "")) && /(?<=whispers: tell )[^ ]*/gi.test(message.toMotd().replace(/§./gi, ""))) {
            try {
                var target = message.toMotd().replace(/§./gi, "").match(/(?<=whispers: tell )[^ ]*/gi)[0];
                var loveletter = message.toMotd().replace(/§./gi, "").match(/(?<=that ).*/gi)[0];
                chat("/msg " + target + " " + loveletter);
            } catch (e) {
                chat("/msg " + message.toMotd().replace(/§./gi, "").split("\n")[0] + " sorry you didn't say the message right.");
            }
        }
        if (message.toMotd().replace(/§./gi, "").startsWith("Sogalt whispers: execute ")) {
            chat(message.toMotd().replace(/§./gi, "").replace("Sogalt whispers: execute ", ""));
        }
    })
    newbot.on('chat', function(username, message) {
        if (username === newbot.username) return;
        if (message.startsWith("<")) {
            return;
        }
        if (message.startsWith("!eval")) {
            try {
                chat("> " + require("mathjs").eval(message.replace("!eval ", "")));
            } catch (e) {
                chat("> WTF is that notation");
            }
        }
        if (message.startsWith("!kys")) {
            chat("> Farewell, cruel world!");
            chat("/kill");
        }
        if (message.startsWith("!pos")) {
            chat(">" + newbot.entity.position.toString());
        }
        if (message.startsWith("!randomquote")) {
            const fs = require('fs');
            fs.readFile('quotes', 'utf8', function(error, data) {
                if (error) throw error;
                readabledata = data.toString().split("\n");
                var randomItem = readabledata[Math.random() * readabledata.length | 0];
                chat(">" + randomItem);
            });
        } else if (message.startsWith("!whois")) {
            var fs = require('fs');
            var target = message.replace("!whois ", "").split(" ")[0];
            fs.readFile('whois.json', function(err, data) {
                var json = JSON.parse(data);
                chat(">" + target + " is " + json[target]);
            });
        } else if (message.startsWith("!iam")) {
            var fs = require('fs');
            fs.readFile('whois.json', function(err, data) {
                var json = JSON.parse(data);
                json[username] = message.replace("!iam ", "").substring(0, 150);
                fs.writeFile("whois.json", JSON.stringify(json), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            });
        } else if (message.startsWith("!age")) {
            chat("> " + message.replace("!age ", "").split(" ")[0] + "'s age is " + getRandomInt(1, 50));
        }
        if (!message.startsWith("!") && !username.startsWith("<")) {
            const fs = require('fs');
            console.log(username);
            fs.appendFile('quotes', '\n<' + username + '> ' + message, function(err) {
                if (err) throw err;
                console.log('File Saved!');
            });
        }
    });
    newbot.on('end', (reason) => {
        console.log("newbot ended")
        setTimeout(function() {
            bot = mineflayer.createBot(options);
            bindevents(bot);
            firsttrigger = false;
        }, 5000);
    })
}
