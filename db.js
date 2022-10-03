const fs = require("fs");

var dict = {};

try {
    const jsonString = fs.readFileSync("./names.json", "utf8");
    dict = JSON.parse(jsonString);
} catch (error) {
    dict = {};
}

function update_file() {
    const jsonString = JSON.stringify(dict);
    fs.writeFile('./names.json', jsonString, err => {
        if (err) {
            console.log('Error writing dict to file', err)
        } else {
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
    exists: function  (phone) {
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
    getMomName: function(phone) {
        return dict[phone]['momName'];
    },
    add: function (phone) {
        init(phone);
    },
    activate: function (phone) {
		update(phone, 'active', 1);
    },
    updateName: function(phone, name) {
        update(phone, 'name', name);
    },
    updateMomName: function(phone, name) {
        update(phone, 'momName', name);
    },
    clear: function(phone) {
        resetPhone(phone);
    }
  };
