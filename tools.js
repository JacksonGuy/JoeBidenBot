const fs = require('fs');

var item_data;
fs.readFile('./data/item_data.json', (err, data) => {
    if (err) throw err;
    item_data = JSON.parse(data);
});

async function update_bal(server, author=null) {
    fs.readFile('./data/balance_data.json', (err, data) => {
        if (err) throw err;
        let bal_data = JSON.parse(data);
        
        fs.readFile('./data/player_item_data.json', (err, data) => {
            if (err) throw err;
            player_items = JSON.parse(data);

            fs.readFile('./data/player_time_data.json', (err, data) => {
                if (err) throw err;
                time_data = JSON.parse(data);
                if (author !== null) { // Update single balance
                    if (!(author in bal_data[server])) {
                        return;
                    }

                    let income = 0;
                    
                    // Calculate time difference 
                    let last_time = time_data[server][author];
                    let time = Math.floor( (Date.now() - last_time) / 1000); // in seconds

                    for (let item in player_items[server][author]) {
                        income += (item_data[item]['income'] * player_items[server][author][item]) * time;
                    }
                    income = Math.floor(income);

                    // Update balance
                    bal_data[server][author] += income;
                    bal_data = JSON.stringify(bal_data, null, 2);
                    fs.writeFileSync('./data/balance_data.json', bal_data);

                    // Update time
                    time_data[server][author] = Date.now();
                    time_data = JSON.stringify(time_data, null, 2);
                    fs.writeFileSync('./data/player_time_data.json', time_data);

                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(1), 2000
                        });
                    });
                }
                else { // Update all balances for a server
                    for (let user in bal_data[server]) {
                        let income = 0;

                        // Calculate time difference
                        let last_time = time_data[server][user];
                        let time = Math.floor( (Date.now() - last_time) / 1000); // in seconds

                        for (let item in player_items[server][user]) {
                            income += (item_data[item]['income'] * player_items[server][user][item]) * time;
                        }
                        income = Math.floor(income);

                        // Update balance
                        bal_data[server][user] += income;

                        // Update time
                        time_data[server][user] = Date.now();
                    }
                    
                    // Write data to files
                    bal_data = JSON.parse(bal_data, null, 2);
                    fs.writeFileSync('./data/balance_data.json', bal_data);
                    time_data = JSON.stringify(time_data, null, 2);
                    fs.writeFileSync('./data/player_time_data.json', time_data);

                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(1), 2000
                        });
                    });
                }
            });
        });
    });
}

module.exports = {
    update_bal
}