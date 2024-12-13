
function InJs(score, ensemble) {
let hasStated = false;
let state = {};

    (function ctor() {
        resetPiece();
    })();


    function startPiece() {
        hasStated = true;

        ensemble.startPiece();
    }


    function stopPiece() {
        ensemble.stopPiece();
    }
    

    function resetPiece() {
        hasStated = false;
        ensemble.setScore(score);
        ensemble.resetPiece();
    }

    function getState() {
        return {
            isPlaying: hasStated,
            ensemble:  ensemble.getState()
        }
    }

    function pingMusicians(musicianIndex) {
        return ensemble.pingMusicians(musicianIndex);
    }


    function nextPattern(musicianIndex) {
        if (!hasStated) {
            startPiece();
        }
        //
        return ensemble.nextPattern(musicianIndex);
    }


    function setVolume(musicianIndex, volume) {
        return ensemble.setVolume(musicianIndex, volume);
    }


    function setOctave(musicianIndex, octave) {
        return ensemble.setOctave(musicianIndex, octave);
    }

    function pauseResume(musicianIndex) {
        return ensemble.pauseResume(musicianIndex);
    }

    
    return {
        resetPiece,
        startPiece,
        stopPiece,
        getState,
        pingMusicians,
        nextPattern,
        setVolume,
        setOctave,
        pauseResume
    }
}

module.exports = InJs;
