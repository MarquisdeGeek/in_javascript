
function wsCommsParse(data) {
    // Responses from specific requests
    if (data.msg === "result") {
        if (data.result.action == "musician") {
            const idx = data.result.musicianIdx;
            uiUpdateMusicianState(idx, data.result.musician);

        } else if (data.result.action == "midifile") {
            const blob = base64ToBlob(data.result.base64String, "text/octet-stream");
            const filename = data.result.filename;
            const link = document.createElement("a");

            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }
    
    }

    // Generic, catch-all, state
    if (data.msg === "state") {
        // console.log(data.state);
        uiUpdateEnsembleState(data.state);
    }
    
}


// Work out where everyone is, relative to the others
function getPerformanceState(estate) {
    let pstate = {};

    pstate.isPlaying = estate.isPlaying;
    pstate.patternLength = estate.ensemble.score.patternLength;
    //
    pstate.phases = Array(pstate.patternLength + 1).fill(0);
    pstate.posLast = 9999;
    pstate.posFirst = 0;

    estate.ensemble.musicians.forEach((m) => {
        if (typeof m.pattern !== typeof undefined) {
            pstate.phases[m.pattern]++;
            //
            pstate.posFirst = Math.max(pstate.posFirst, m.pattern);
            pstate.posLast  = Math.min(pstate.posLast,  m.pattern);
        }
    });


    return pstate;
}


function uiUpdateEnsembleState(estate) {

    const performanceState = getPerformanceState(estate);

    estate.ensemble.musicians.forEach((m, idx) => {
        uiUpdateMusicianState(idx, m, performanceState);
    });

    updateProgress(performanceState);
}


// Note: not all fields will be complete
function uiUpdateMusicianState(idx, mstate, pstate) {
    const thisMuso = $(`*[data-musician="${idx}"]`);

    // const stub = ("0" + mstate.musicianIdx).substring(-2);
    if (mstate.name) {
        thisMuso.filter(".ui_status_name").text(mstate.name);
    }

    if (!mstate.isPlaying) {
        thisMuso.filter(".ui_status_progress").text(`(paused)`);
        thisMuso.filter(".ui_action_pause").filter(".controlButton").text(`Resume`);
    } else {
        thisMuso.filter(".ui_action_pause").filter(".controlButton").text(`Pause`);
    }

    if (typeof mstate.octave !== typeof undefined) {
        // Remove all existing selected items
        thisMuso.filter('.ui_action_octave').removeClass("selected");

        // Then just add the necessary one back
        const thisOctave = thisMuso.filter(`*[data-octave="${mstate.octave}"]`);
        thisOctave.addClass("selected");

    }

    if (typeof mstate.volume !== typeof undefined) {
        setValue(idx, mstate.volume);
    }

    if (pstate && typeof mstate.pattern !== typeof undefined) {
        const toShow = mstate.pattern ? mstate.pattern : 1; // show the first, if we've not yet started
        const stubThis = ("0" + toShow).substr(-2);       
        const srcThis = `scores/${stubThis}.png`;
        thisMuso.filter(".ui_status_score").attr("src", srcThis);

        const stubNext = ("0" + (toShow+1)).substr(-2);       
        const srcNext = `scores/${stubNext}.png`;
        thisMuso.filter(".ui_status_score_next").attr("src", mstate.pattern === pstate.patternLength ? '' : srcNext);
        

        let nextButtonActsAs = "Next";
        if (mstate.pattern === 0) {
            nextButtonActsAs = "Start";
        } else if (mstate.pattern === pstate.patternLength) {
            nextButtonActsAs = "End";
        }
        thisMuso.filter(".controlButton").filter(".ui_action_next").text(nextButtonActsAs);

         
        if (mstate.pattern === pstate.patternLength && !mstate.isPlaying) {
            thisMuso.filter(".ui_status_progress").text(`(finished)`);
        } else if (mstate.pattern) {
            thisMuso.filter(".ui_status_progress").text(`${mstate.pattern} of ${pstate.patternLength}`);
        } else {
            thisMuso.filter(".ui_status_progress").text(`(not started)`);
        }

        // Relative progress indicators
        let behindYou = 0;
        let aheadOfYou = 0;
        for(let i=0;i<pstate.patternLength;++i) {
            if (i < mstate.pattern) {
                behindYou += pstate.phases[i];
            } else if (i > mstate.pattern) {
                aheadOfYou += pstate.phases[i];
            }
        }

        thisMuso.filter(".ui_status_behind").text(`${pstate.isPlaying ? behindYou : "--"}`);
        thisMuso.filter(".ui_status_equal").text(`${pstate.isPlaying ? ( pstate.phases[mstate.pattern]===1?"You": pstate.phases[mstate.pattern]) : "--"}`);
        thisMuso.filter(".ui_status_ahead").text(`${pstate.isPlaying ? aheadOfYou : "--"}`);
     
        thisMuso.filter(".ui_status_last").text(`${pstate.isPlaying ? mstate.pattern - pstate.posLast : "--"}`);
        thisMuso.filter(".ui_status_first").text(`${pstate.isPlaying ? pstate.posFirst - mstate.pattern: "--"}`);

        let rstr = '';
        if (mstate.currentPattern.repeats) {
            rstr = `Repeats: ${mstate.currentPattern.repeats}`
        }
        if (mstate.currentPattern.timeStart) {
            let msSince = Date.now() - mstate.currentPattern.timeStart;
            rstr += rstr ? " | " : "";
            rstr += `Duration: ${Math.floor(msSince/1000)}s`
        }
        thisMuso.filter(".ui_status_telaps").text(rstr);
    }

}


// Called via volume.js
function onVolumeChange(e) {
    const musicianIndex = $(e.target).data().musician;
    const volume = parseInt(e.target.value);

    webSocket.send(JSON.stringify({msg: "p_in_volume", musicianIndex: musicianIndex, volume: volume}));
}
