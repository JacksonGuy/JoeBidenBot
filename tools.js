const fs = require('fs');

var item_data;
fs.readFile('./data/item_data.json', (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});

async function update_bal(server_id, author_id=null) {
    let promise = new Promise((resolve) => {
        fs.readFile('./data/' + server_id + '.json', (err, data) => {
            if (err) {
                resolve(false);
                return;
            };
            let player_data = JSON.parse(data);
            // Are we updating a single user or all users on a server?
            if (author_id === null) { // All users on a sever
                for (let user in player_data) {
                    let income = 0;

                    // Calculate time difference
                    let last_time = player_data[user]['time'];
                    let time = Math.floor((Date.now() - last_time)/1000); // in seconds

                    // Calculate income for each item
                    for (let item in player_data[user]['items']) {
                        income += (item_data[item]['income'] * player_data[user]['items'][item]) * time;
                    }
                    income = Math.floor(income);

                    player_data[user]['bal'] += income;
                }
            }
            else { // Single user
                let income = 0;

                // Calculate time difference
                let last_time = player_data[author_id]['time'];
                let time = Math.floor((Date.now() - last_time)/1000); // in seconds

                // Calculate income for each item
                for (let item in player_data[author_id]['items']) {
                    income += (item_data[item]['income'] * player_data[author_id]['items'][item]) * time;
                }
                income = Math.floor(income);

                player_data[author_id]['bal'] += income;
            }

            // Write data to file
            player_data = JSON.stringify(player_data, null, 2);
            fs.writeFileSync('./data/' + server_id + '.json', player_data);
            resolve(true);
        });    
    });
    return promise;
}

async function check_server_exists(server_id) {
    let promise = new Promise((resolve) => {
        fs.readdir('./data/', (err, files) => {
            if (err) throw err;
            let fileName = server_id + '.json';
            resolve(files.includes(fileName));
        });
    });
    return promise;
}

module.exports = {
    update_bal,
    check_server_exists
}