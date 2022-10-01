const fs = require("fs");
const schedule = require('node-schedule');

var dict = {};

try {
    const jsonString = fs.readFileSync("./names.json", "utf8");
    dict = JSON.parse(jsonString);
} catch (error) {
    dict = {};
}


schedule.scheduleJob('*/3 * * * *', () => {
    console.log(`Saving db to file. Number of names: ${Object.keys(dict).length}`);
    const jsonString = JSON.stringify(dict);
    fs.writeFile('./names.json', jsonString, err => {
        if (err) {
            console.log('Error writing dict to file', err)
        } else {
            console.log('Successfully wrote dict to file')
        }
    })
});

module.exports = {
    exists: function  (phone) {
        return phone in dict;
    },
    add: function (phone) {
        dict[phone] = {};
    },
    isActive: function (phone) {
        return dict[phone]['active'] == 1;
    },
    activate: function (phone) {
        return dict[phone]['active'] = 1;
    },
    hasFirstName: function (phone) {
        return dict[phone]['name'] != undefined;
    },
    updateName: function(phone, name) {
        dict[phone]['name'] = name;
    },
    hasMomFirstName: function (phone) {
        return dict[phone]['momName'] != undefined;
    },
    updateMomName: function(phone, name) {
        dict[phone]['momName'] = name;
    },
    clear: function(phone) {
        delete dict[phone];
        this.add(phone);
    },
    getName: function (phone) {
      return dict[phone]['name'];
    },
    getMomName: function(phone) {
        return dict[phone]['momName'];
    }
  };
