

const midi = require('@julusian/midi');
const performer = require('midi-live-performer');
const midi_info = require('midi-info');



function Musician(idx, musicianConfig) {
    // let midiOutput;
    let patternIdx;
    let patternIdxTarget;
    let isPlaying = false;
    let currentScore;
    let volume;
    let volumeVariancePercent;
    let octaveShift;
    let channel;
    let currentPattern;
    let refillAtPQN;

    (function ctor() {
        channel = musicianConfig.channel;

        setVolume(musicianConfig.volume ?? 100);
        setVolumeVariance(musicianConfig.volumeVariance ?? 10);
        setOctave(musicianConfig.octave ?? 0);
        //
        currentPattern = {
            repeats: 0
        };
    })();


    function sendPatchData(sequencer) {
        sequencer.sendTrackName(channel, musicianConfig.name);
        sequencer.sendCC(channel, midi_info.Constants.Messages.cc.BANK_SELECT, musicianConfig.ccBank);
        sequencer.setProgram(channel, musicianConfig.ccPatch);
    }


    function startPiece(sequencer) {
        sendPatchData(sequencer);
    }


    function reset(score) {
        currentScore = score;
        refillAtPQN = undefined;

        patternIdx = 0;
        patternIdxTarget = 0;
        
        currentPattern = {
            repeats: 0
        };
    }


    function refill(sequencer, bar, beat, pulse, qnp) {
        if (!isPlaying || !currentScore) {
            return;
        }

        // Rem: pattern 0 means 'no pattern'
        if (patternIdxTarget === 0) { 
            return;
        }

        let songBeats = ((bar * 3) + beat);
        let pulseAt = songBeats * 384 + qnp;
        if (typeof refillAtPQN === typeof undefined) {
            if (beat) {
                return;
            }
        } else {
            if (refillAtPQN > pulseAt) {
                return;
            }
        }
        let pattern = currentScore.getPattern(patternIdxTarget - 1);

        if (patternIdx !== patternIdxTarget) {
            sequencer.sendMarkerMessage(channel, `M:${channel} P:${patternIdxTarget}`);
        }


        let t = 0;
        pattern && pattern.forEach((p) => {
            let duration = p.duration;

            duration *= musicianConfig.speed ?? 1;

            if (!p.isRest) {
                const variance = (volume * volumeVariancePercent) / 100;
                const randomness = Math.floor(Math.random() * variance);
                const thisVolume = volume + (randomness - variance/2);
                sequencer.qNote(t, channel, p.pitch + octaveShift,  thisVolume, duration);
            }

            t += duration;
        });

        // Any special things?
        switch(musicianConfig.sfx) {
            // Repeat the phrase, but an octave higher
            // (which apologies for the copy+paste)
            case 1:
                pattern && pattern.forEach((p) => {
                    let duration = p.duration;
        
                    duration *= musicianConfig.speed ?? 1;
        
                    if (!p.isRest) {
                        const variance = (volume * volumeVariancePercent) / 100;
                        const randomness = Math.floor(Math.random() * variance);
                        const thisVolume = volume + (randomness - variance/2);
                        sequencer.qNote(t, channel, p.pitch + octaveShift + 12,  thisVolume, duration);
                    }
        
                    t += duration;
                });
        
                break;
        }

        // Add any bars of rest
        if (musicianConfig.rest) {
            // move the duration of the bar with notes, plus the same again for every
            // bar of rests
            t *= musicianConfig.rest + 1; 
        }

        refillAtPQN = pulseAt + t;

        if (patternIdx !== patternIdxTarget) {
            currentPattern.repeats = 0;
            currentPattern.timeStart = Date.now(); // WIP
        }

        currentPattern.repeats++;
        patternIdx = patternIdxTarget;


        return true;
    }


    function ping(sequencer) {
        const qnDuration = midi_info.Constants.Pulses.DURATION_CROCHET;
        const telaps = 0;

        sendPatchData(sequencer);

        sequencer.qNote(telaps, channel, midi_info.Constants.Notes.MIDDLE_C + octaveShift, volume, qnDuration);
    }


    function nextPattern() {
        return playPattern(patternIdxTarget + 1);
    }

    function playPattern(patternIndex) {
        if (patternIndex > currentScore.getPatternCount()) {
            isPlaying = false;
            return;
        }
        isPlaying = true;
        patternIdxTarget = patternIndex;
    }


    function setVolume(v) {
        volume = v;
    }

    function setVolumeVariance(v) {
        volumeVariancePercent = v;
    }

    function setOctave(oct) {
        octaveShift = oct;    

        return { octave: octaveShift };
    }

    function pauseResume() {
        isPlaying = !isPlaying;
        
        return { isPlaying: isPlaying };
    }
    

    function getState() {
        return {
            name: musicianConfig.name,
            isPlaying: isPlaying,
            pattern: patternIdx,
            volume: volume,
            octave: octaveShift,
            currentPattern: currentPattern
        };
    }

    
    return {
        reset,
        ping,
        refill,
        startPiece,
        nextPattern,
        playPattern,
        setOctave,
        setVolume,
        getState,
        pauseResume,
    }

}

module.exports = Musician;
