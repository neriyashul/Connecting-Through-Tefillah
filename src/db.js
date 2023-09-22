const fs = require("fs");

var dict = {};
var autoUpdated = false;
filePath = './names.json'

try {
    const jsonString = fs.readFileSync(filePath, "utf8");
    dict = JSON.parse(jsonString);
    console.log("read the file successfully")
} catch (error) {
    dict = {};
}



function watch_for_changes_in_file() {
    console.log("\nThe file was edited");
    console.log("autoUpdated = " + autoUpdated)
    fs.watchFile(
        filePath,
        {
            bigint: false,
            persistent: true,
            interval: 1000,
        },
        (curr, prev) => {
            if (autoUpdated) {
                autoUpdated = false
                return
            }
    
            console.log("Previous Modified Time", prev.mtime);
            console.log("Current Modified Time", curr.mtime);
    
            try {
                const jsonString = fs.readFileSync(filePath, "utf8");
                dict = JSON.parse(jsonString);
                console.log("dict - in memory variable updated")
            } catch (error) {
                console.error(error)
            }
        }
    );    
}
watch_for_changes_in_file()

function update_file() {
    const jsonString = JSON.stringify(dict);
    fs.writeFile(filePath, jsonString, err => {
        if (err) {
            console.log('Error writing dict to file', err)
        } else {
            autoUpdated = true
            console.log("autoUpdated = " + autoUpdated)
            console.log(`Successfully wrote dict to file. Number of names: ${Object.keys(dict).filter((key) => dict[key]['active'] == 1).length}`)
        }
    });
}

function init(phone) {
    dict[phone] = {};
    update_file();
}

function update(phone, field, value) {
    dict[phone][field] = value;
    update_file();
}

function resetPhone(phone) {
    dict[phone] = {};
    update_file();
}


module.exports = {
    exists: function (phone) {
        return phone in dict;
    },
    isActive: function (phone) {
        return dict[phone]['active'] == 1;
    },
    hasFirstName: function (phone) {
        return dict[phone]['name'] != undefined;
    },
    hasMomFirstName: function (phone) {
        return dict[phone]['momName'] != undefined;
    },
    getName: function (phone) {
        return dict[phone]['name'];
    },
    getMomName: function (phone) {
        return dict[phone]['momName'];
    },
    add: function (phone) {
        init(phone);
    },
    activate: function (phone) {
        update(phone, 'active', 1);
    },
    updateName: function (phone, name) {
        update(phone, 'name', name);
    },
    updateMomName: function (phone, name) {
        update(phone, 'momName', name);
    },
    clear: function (phone) {
        resetPhone(phone);
    }
};
