const fs = require('fs');

async function check_server_exists(server_id) {
    let promise = new Promise(resolve => {
        fs.readdir('./data/', (err, files) => {
            if (err) throw err;
            let fileName = server_id + '.json';
            resolve(files.includes(fileName));
        });
    });
    return promise;
}

module.exports = {
    check_server_exists
}