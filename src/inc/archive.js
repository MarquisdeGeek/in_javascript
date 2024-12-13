const midi_info = require('midi-info');

// https://github.com/carter-thaxton/midi-file#readme
const writeMidi = require('midi-file').writeMidi


function Archive() {
    let currentData;


    function start() {
        currentData = {
            header: {},
            tracks: []
        };

        // Create some dummy track data
        for(let track = 0;track<16;++track) {
            currentData.tracks[track] = {
                lastGlobalPPQN: 0,
                data: []
            };
        }
    }


    function stop() {
        // We don't, currently, care.
    }

    function getArchiveAsStream() {
        if (!currentData) {
            return;
        }

        // Create our own, shallow, copy so we can manipulate it accordingly
        const theirFormat = Object.assign({}, currentData);

        // Remove any unused tracks
        theirFormat.tracks= theirFormat.tracks.filter((trk) => {
            return trk.data.length;
        });
    
        // Return only the useful data
        theirFormat.tracks = theirFormat.tracks.map((trk) => {
            return trk.data;
        });
        
    
        // Fill in the header
        theirFormat.header.format = 1;
        theirFormat.header.numTracks = theirFormat.tracks.length;
        theirFormat.header.ticksPerBeat = 384;


        // Generate it
        const outputStream = writeMidi(theirFormat);
        return outputStream;
    }


    function addEvent(track, msg, globalPPQN) {
        if (!currentData) {
            return;
        }

        let event = midi_info.Messages.parse.unpack(msg);
        // console.log(`m:`, msg, ":",event);

        if (event) {
            let actualTrack = event.channel ?? track; // Are we more discriminating for some meta messages (e.g. trackname)?
            event.deltaTime = globalPPQN - currentData.tracks[actualTrack].lastGlobalPPQN;

            // console.log(`m:`, actualTrack, ":",globalPPQN, currentData.tracks[actualTrack].lastGlobalPPQN, `:`, msg, event);
            currentData.tracks[actualTrack].data.push(event);
            currentData.tracks[actualTrack].lastGlobalPPQN = globalPPQN;
        }

    }

    
    return {
        start,
        stop,
        addEvent,
        getArchiveAsStream,
    }
}



module.exports = Archive;

