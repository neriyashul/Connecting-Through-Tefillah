  
const wa = require('@open-wa/wa-automate');
const interactor = require('./interactor');


wa.create({
  sessionId: "YomKippur'sTfila",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));



function start(client) {
  client.onMessage(async message => {
  console.log(`Message received. from='${message.from}' message='${message.text}'`);
  	if (message.text != "") {
    	const reply = interactor.execute(message);
    	await client.sendText(message.from, reply);
    }
  });
}
