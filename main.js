const { Client, Intents } = require('discord.js');
const { token } = require("./config.json");
const fs = require('fs');
const tools = require('./tools');
const player = require('./player');
const { Encounter, createEnemy, enemyResponse } = require('./enemy');
const { castSpell } = require('./spells');

const ENCOUNTERCHANCE = 0; 

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('im back losers', { type: 'PLAYING' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    switch(interaction.commandName) {
        case 'test':
            await interaction.reply("oh boy hopefully everything works");
            break;

        case 'erase':
            interaction.channel.messages.fetch({limit: 100 }).then(messages => {
                messages.forEach(message => message.delete());
            });
            await interaction.reply(`Deleting ${interaction.options.getInteger('amount')} messages`);
            break;
        
        case 'spam':
            await interaction.reply(`${interaction.options.getString('message')}`);
            for (let i = 0; i < interaction.options.getInteger('amount')-1; i++) {
                await interaction.channel.send(`${interaction.options.getString('message')}`);
            }
            break;

        case 'stalin':
            target = interaction.options.getString('user');
            target = target.slice(3, target.length-1);

            interaction.channel.messages.fetch({limit: 100 }).then(messages => {
                messages.forEach(message => {
                    if (message.author.id === target) {
                        message.delete();
                    }
                });
            });
            await interaction.reply(`Deleting messages from ${interaction.options.getString('user')}`);
            break;

        case 'new':
            player.createPlayer(interaction.user.id);
            await interaction.reply('New Characher Created');
            break;

        case 'move':
            fs.readFile(`./players/${interaction.user.id}.json`, (err, data) => {
                if (err) throw err;
                let p = JSON.parse(data);

                if (p.instanceID !== 0) {
                    interaction.reply("Can't move while in combat!");
                    return;
                }
            
                switch (interaction.options.getString('direction')) {
                    case 'town':
                        p.position.location = "town"
                        p.position.x = 0;
                        p.position.y = 0;
                    case 'north':
                        p.position.location = "wilderness"
                        p.position.y += 1;
                        break;
                    case 'south':
                        p.position.location = "wilderness"
                        p.position.y -= 1;
                        break;
                    case 'east':
                        p.position.location = "wilderness"
                        p.position.x += 1;
                        break;
                    case 'west':
                        p.position.location = "wilderness"
                        p.position.x -= 1;
                        break;
                    default:
                        interaction.reply("Not a valid direction (North, East, South, West)");
                }

                // Random Encounter Chance
                let random = tools.randomNum(ENCOUNTERCHANCE);
                if (random === 0) { // Encounter
                    let e = Encounter();
                    e.players.push(p.id);
                    let skeleton = createEnemy("Skeleton", p.level, e);
                    p.instanceID = e.id;
                    interaction.reply(`Encounter!\nYou are now in combat\n${skeleton.name} - Health: ${skeleton.health}/${skeleton.maxHealth}`);
                }
                else {
                    if (interaction.options.getString('direction') === "town") {
                        interaction.reply("Returned to town");
                    }
                    else {
                        interaction.reply("Move Successful");
                    }
                }
                tools.writePlayerData(interaction.user.id, p);
            });
            break; 

        case "inspect":
            let pid = interaction.options.getString("player");
            if (pid === "self") {
                fs.readFile(`./players/${interaction.user.id}.json`, (err, data) => {
                    if (err) throw err;
                    let p = JSON.parse(data);
                    interaction.reply(`
                    Health: ${p.health}/${p.maxHealh}
                    Mana: ${p.mana}/${p.maxMana}
                    Level: ${p.level}\nGold: ${p.gold}
                    Strength: ${p.stats.Strength}
                    Stamina: ${p.stats.Stamina}
                    Agility: ${p.stats.Agility}
                    Intelligence: ${p.stats.Intelligence}`);
                });
            }
            else {
                pid = pid.slice(3, pid.length-1);
                fs.readFile(`./players/${pid}.json`, (err, data) => {
                    if (err) throw err;
                    let p = JSON.parse(data);
                    interaction.reply(`
                    Level: ${p.level}
                    Gold: ${p.gold}
                    Strength: ${p.stats.Strength}
                    Stamina: ${p.stats.Stamina}
                    Agility: ${p.stats.Agility}
                    Intelligence: ${p.stats.Intelligence}`);
                });
            }
            break;

        case "inventory":
            fs.readFile(`./players/${interaction.user.id}.json`, (err, data) => {
                if (err) throw err;
                let p = JSON.parse(data);
                reply = ""
                for (item in p.inventory) {
                    reply += (`${item}: ${p.inventory[item]}\n`);
                }
                interaction.reply(reply);
            });
            break;

        case "location":
            fs.readFile(`./players/${interaction.user.id}.json`, (err, data) => {
                if (err) throw err;
                let p = JSON.parse(data);
                if (p.position.location === "wilderness") {
                    interaction.reply(`Current location: Wilderness (${p.position.x}, ${p.position.y})`);
                }
                else {
                    interaction.reply("Current location: Town");
                }
            });
            break;

        case "cast":
            // So many readFile's 
            // Makes my head hurt that this is the best I could come up with
            // Also fuck async programming
            fs.readFile(`./players/${interaction.user.id}.json`, (err, data) => {
                if (err) throw err;
                let p = JSON.parse(data);
                let spell = interaction.options.getString('spell');
                fs.readFile(`./encounters/${p.instanceID}.json`, (err, data) => {
                    if (err) throw err;
                    let encounter = JSON.parse(data);
                    let enemyID = encounter.enemyName[interaction.options.getString('target')];
                    fs.readFile(`./enemies/${enemyID}.json`, (err, data) => {
                        if (err) throw err;
                        let target = JSON.parse(data);
                        result = castSpell(spell, p, target);
                        interaction.reply(`Hit target with ${spell} for ${result} damage!\n${target.name} - Health: ${target.health}/${target.maxHealth}`);
                        enemyResponse(encounter);
                    });
                });
            });
    }
});

client.login(token);