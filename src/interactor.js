const db = require('./db');
const messages = require('./messages');

function register(phone) {
    db.add(phone);
}

function activate(phone) {
    db.activate(phone);
    return messages.askFirstNameMessage;
}

function addFirstName(phone, text) {
    db.updateName(phone, text);
    return messages.askMomFirstNameMessage
}

function getDataReceivedMessage(phone) {
    let name = db.getName(phone);
    let momName = db.getMomName(phone);
    return messages.dataReceivedMessage(name, momName);
}



module.exports = {
    execute: function (message) {
        const phone = message.from.split('@')[0];
        if (!db.exists(phone)) {
            register(phone);
        } 
        if (!message.text) {
            console.log(`Message is null. From: '${message.from}'. Message:'${message.text}'`)
            return addFirstName(phone, message.text);
        } else if (!db.isActive(phone)) {
            if (message.text.startsWith('1')) {
                return activate(phone);
            } else {
                return messages.startConversationMessage;
            }
        } else if (message.text.startsWith('3')) {
            db.clear(phone);
            return messages.dataDeletedSuccessfully;
        } else if (!db.hasFirstName(phone)) {
            return addFirstName(phone, message.text);
        } else if (!db.hasMomFirstName(phone)) {
            db.updateMomName(phone, message.text);
            return getDataReceivedMessage(phone);
        } else if (message.text.startsWith('2')) {
            db.clear(phone);
            return activate(phone);
        } else {
            return getDataReceivedMessage(phone);
        }
    }
  };
