const performer = require('midi-live-performer');
const midi_info = require('midi-info');

const Musician = require('./musician');


function Ensemble(cfg) {
    let musicianList = [];
    let logging;
    let currentScore;
    let isPlayingPulse;
    let sequencer;


    (function ctor() {

        // Init
        isPlayingPulse = false;

        logging = cfg.logging;

        sequencer = new performer.Sequencer(cfg.outputHandler);

        // Prepare the sequencer by determining patches and output devices from cfg
        for(let i=0;i<cfg.musicianList.length;++i) {
            musicianList.push({
                musician: new Musician(i, cfg.musicianList[i]),
                log: []
            });
        }

        sequencer.on('pulse', function (bar, beat, pulse, qnp) {
            // console.log(`pulse = : `,bar, beat, pulse, qnp)

            let refilled = false;

            if (isPlayingPulse) {
                if (pulse === 0) {
                    const qnDuration = midi_info.Constants.Pulses.DURATION_QUAVER;
                    sequencer.qNote(0, cfg.pulse.channel, cfg.pulse.pitch, cfg.pulse.volume, qnDuration);
                }
                //
                musicianList.forEach((m) => {
                    refilled |= m.musician.refill(sequencer, bar, beat, pulse, qnp);
                });
            }

            if (refilled && cfg.onRefill) {
                cfg.onRefill();
            }
        });


        process.on('SIGINT', async function() {
            console.log("Caught interrupt signal, stopping sequence");
            sequencer.stopSequence();
        
            console.log("Sending notes off");
            sequencer.allNotesOff();
        
            console.log("Exitting");
            process.exit();
        });
        
    })();


    function startLogging() {
    }


    function stopLogging() {         
    }


    function startArchive() {
        if (cfg.archive) {
            cfg.archive.start();
        }
    }
    

    function stopArchive() {
        if (cfg.archive) {
            cfg.archive.stop();
        }
    }


    function startPiece() {
        isPlayingPulse = true;

        startLogging();
        startArchive();

        sequencer.restartSequence();


        // Prepare the sequencer by determining patches and output devices from cfg
        for(let i=0;i<cfg.musicianList.length;++i) {
            musicianList[i].musician.startPiece(sequencer);
        }

        // Set up the pulse
        sequencer.sendCC(cfg.pulse.channel, midi_info.Constants.Messages.cc.BANK_SELECT, cfg.pulse.ccBank);
        sequencer.setProgram(cfg.pulse.channel, cfg.pulse.ccPatch);

    }


    function stopPiece() {
        isPlayingPulse = false;

        stopLogging();
        stopArchive();
    }


    function setScore(score) {
        currentScore = score;

        const state = currentScore.getState();
        sequencer.setBeatsPerBar(state.beatsPerBar);
        sequencer.setBPM(state.bpm);

        resetPiece();
    }


    function resetPiece() {
        stopPiece();

        sequencer.allNotesOff();
        sequencer.restartSongPosition();

        musicianList.forEach((m) => {
            m.musician.reset(currentScore);
        });
    }


    function getState() {
        const state = {};

        state.musicians = musicianList.map((m) => m.musician.getState());
        state.score = currentScore ? currentScore.getState() : {};
        state.pulse = isPlayingPulse;
    
        return state;
    }


    function pingMusicians(musicianIndex) {
        if (typeof musicianIndex === typeof undefined) {
            const qnDuration = midi_info.Constants.Pulses.DURATION_QUAVER;
            sequencer.qNote(0, cfg.pulse.channel, cfg.pulse.pitch, cfg.pulse.volume, qnDuration);

            musicianList.forEach((m) => {
                m.musician.ping(sequencer);
            });
        } else {
            musicianList[musicianIndex].musician.ping(sequencer);
        }
    }


    function nextPattern(musicianIndex) {
        if (musicianIndex < 0 || musicianIndex >= musicianList.length) {
            return;
        }
        //
        const muso = musicianList[musicianIndex];

        muso.musician.nextPattern();
    }

    function setVolume(musicianIndex, volume) {
        const muso = musicianList[musicianIndex];
        muso.musician.setVolume(volume);
    }


    function setOctave(musicianIndex, octave) {
        const muso = musicianList[musicianIndex];
        return {
            action: "musician",
            musicianIdx: musicianIndex,
            musician: muso.musician.setOctave(octave)
        };
    }


    function pauseResume(musicianIndex) {
        const muso = musicianList[musicianIndex];
        return {
            action: "musician",
            musicianIdx: musicianIndex,
            musician: muso.musician.pauseResume()
        };
    }

    
    return {
        setScore,
        getState,
        startPiece,
        stopPiece,
        resetPiece,
        nextPattern,
        setVolume,
        setOctave,
        pauseResume,
        pingMusicians
    }

}

module.exports = Ensemble;
