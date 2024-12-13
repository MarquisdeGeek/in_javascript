require("dotenv").config();

// NPM modules
const midi = require('@julusian/midi');

// Local modules
const Config = require("./inc/config.js");
const scoreID = Config.scoreID || process.env.SCORE_ID || 'inc';

const score = require(`./scores/${scoreID}/main.js`);
const Utils = require("./inc/utils.js");
const Ensemble = require("./inc/ensemble.js");
const Archive = require("./inc/archive.js");
const InJs = require("./inc/injs.js");


// Sort out the MIDI device
// console.log(Config)
Utils.listDevices();

const midiOutput = new midi.Output();
const midiOutputPort = process.env.MIDI_DEVICE_INPUT_NAME;
midiOutput.openPortByName(midiOutputPort);


// Construct the objects
const archive = new Archive();
const ensemble = new Ensemble({
    outputHandler: {
        sendMessage: function(msg, globalPPQN, track) {
            // Ignore meta messages, when sending to a MIDI device
            if (msg.length && msg[0] !== 0xff) {
                midiOutput.sendMessage(msg);
            }

            // Write to file
            archive.addEvent(track, msg, globalPPQN);
        }
    },
    archive: archive,
    pulse: Config.pulse,
    musicianList: Config.musicianList,
    onRefill: () => {
        // Send a new state only when the buffer has been filled with the next phrase
        ss.sendState();
    }
});

const performance = new InJs(score, ensemble, archive);

// Build the web component
const WebServer = require("./web_server.js", scoreID);
const SocketServer = require("./sockets_server.js");

const web = new WebServer(process.env.PORT_WEBSERVER, process.env.PORT_SOCKETS, scoreID, Config.musicianList);
const ss = new SocketServer(process.env.PORT_SOCKETS, performance, archive);

