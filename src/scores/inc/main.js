const midi_info = require('midi-info');


// Adapted from https://codepen.io/jak_e/pen/NrjdLY
// NOTE: This version adds the acciaccatura in patterns 1 & 2
// except for first beat. This is to greatly simplify the programming, and
// ensure the main note hits the beat.
const patternData = [
  [
    { isRest: false, pitch: 64, duration: 364 },
    { isRest: false, pitch: 60, duration:  20 },
    { isRest: false, pitch: 64, duration: 364 },
    { isRest: false, pitch: 60, duration:  20 },
    { isRest: false, pitch: 64, duration: 364 },
    { isRest: false, pitch: 60, duration:  20 },
  ],
  [
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 65, duration: 192 },
    { isRest: false, pitch: 60, duration:  20 },
    { isRest: false, pitch: 64, duration: 364 },
  ],
  [
    { isRest: true, pitch: 60, duration: 192 },
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 65, duration: 192 },
    { isRest: false, pitch: 64, duration: 192 }
  ],
  [
    { isRest: true, pitch: 60, duration: 192 },
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 65, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 }
  ],
  [
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 65, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: true, pitch: 60, duration: 192 }
  ],
  [ { isRest: false, pitch: 72, duration: 3072 } ],
  [
    { isRest: true, pitch: 60, duration: 1344 },
    { isRest: false, pitch: 60, duration: 96 },
    { isRest: false, pitch: 60, duration: 96 },
    { isRest: false, pitch: 60, duration: 192 },
    { isRest: true, pitch: 60, duration: 1728 }
  ],
  [
    { isRest: false, pitch: 67, duration: 2304 },
    { isRest: false, pitch: 65, duration: 3072 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: true, pitch: 60, duration: 1344 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 1536 },
    { isRest: false, pitch: 72, duration: 384 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 288 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: true, pitch: 60, duration: 288 },
    { isRest: false, pitch: 67, duration: 1248 }
  ],
  [
    { isRest: false, pitch: 72, duration: 1536 },
    { isRest: false, pitch: 71, duration: 1536 },
    { isRest: false, pitch: 67, duration: 1536 },
    { isRest: false, pitch: 66, duration: 1536 }
  ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: true, pitch: 60, duration: 1440 }
  ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 72, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 60, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 60, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: true, pitch: 60, duration: 96 }
  ],
  [
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 288 },
    { isRest: false, pitch: 64, duration: 96 }
  ],
  [
    { isRest: true, pitch: 60, duration: 576 },
    { isRest: false, pitch: 79, duration: 576 }
  ],
  [
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 59, duration: 288 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 }
  ],
  [ { isRest: false, pitch: 66, duration: 1152 } ],
  [
    { isRest: false, pitch: 64, duration: 576 },
    { isRest: false, pitch: 64, duration: 576 },
    { isRest: false, pitch: 64, duration: 576 },
    { isRest: false, pitch: 64, duration: 576 },
    { isRest: false, pitch: 64, duration: 576 },
    { isRest: false, pitch: 66, duration: 576 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 71, duration: 192 }
  ],
  [
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 66, duration: 576 },
    { isRest: false, pitch: 66, duration: 576 },
    { isRest: false, pitch: 66, duration: 576 },
    { isRest: false, pitch: 66, duration: 576 },
    { isRest: false, pitch: 66, duration: 576 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 71, duration: 384 }
  ],
  [
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 66, duration: 192 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 67, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 71, duration: 192 }
  ],
  [
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 66, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 69, duration: 576 },
    { isRest: false, pitch: 71, duration: 576 }
  ],
  [
    { isRest: false, pitch: 64, duration: 192 },
    { isRest: false, pitch: 66, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: false, pitch: 69, duration: 192 },
    { isRest: false, pitch: 71, duration: 576 },
    { isRest: false, pitch: 71, duration: 576 },
    { isRest: false, pitch: 71, duration: 576 },
    { isRest: false, pitch: 71, duration: 576 },
    { isRest: false, pitch: 71, duration: 576 }
  ],
  [
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 }
  ],
  [
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 96 },
    { isRest: false, pitch: 66, duration: 96 },
    { isRest: false, pitch: 64, duration: 288 },
    { isRest: false, pitch: 64, duration: 96 }
  ],
  [
    { isRest: false, pitch: 64, duration: 1152 },
    { isRest: false, pitch: 67, duration: 1152 },
    { isRest: false, pitch: 72, duration: 1152 }
  ],
  [ { isRest: false, pitch: 72, duration: 2304 } ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 65, duration: 1248 },
    { isRest: false, pitch: 67, duration: 576 }
  ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: true, pitch: 60, duration: 192 }
  ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: true, pitch: 60, duration: 1344 },
    { isRest: false, pitch: 70, duration: 384 },
    { isRest: false, pitch: 79, duration: 1152 },
    { isRest: false, pitch: 81, duration: 192 },
    { isRest: false, pitch: 79, duration: 384 },
    { isRest: false, pitch: 83, duration: 192 },
    { isRest: false, pitch: 81, duration: 576 },
    { isRest: false, pitch: 79, duration: 192 },
    { isRest: false, pitch: 76, duration: 1152 },
    { isRest: false, pitch: 79, duration: 192 },
    { isRest: false, pitch: 78, duration: 1344 },
    { isRest: true, pitch: 60, duration: 960 },
    { isRest: false, pitch: 76, duration: 960 },
    { isRest: false, pitch: 77, duration: 1152 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 72, duration: 96 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 65, duration: 96 }
  ],
  [
    { isRest: false, pitch: 71, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 72, duration: 768 },
    { isRest: false, pitch: 71, duration: 768 },
    { isRest: false, pitch: 69, duration: 768 },
    { isRest: false, pitch: 72, duration: 768 }
  ],
  [
    { isRest: false, pitch: 77, duration: 96 },
    { isRest: false, pitch: 76, duration: 96 },
    { isRest: false, pitch: 77, duration: 96 },
    { isRest: false, pitch: 76, duration: 96 },
    { isRest: false, pitch: 76, duration: 192 },
    { isRest: false, pitch: 76, duration: 192 },
    { isRest: false, pitch: 76, duration: 192 },
    { isRest: false, pitch: 77, duration: 96 },
    { isRest: false, pitch: 76, duration: 96 }
  ],
  [
    { isRest: false, pitch: 77, duration: 192 },
    { isRest: false, pitch: 76, duration: 384 },
    { isRest: false, pitch: 76, duration: 192 },
    { isRest: false, pitch: 72, duration: 384 }
  ],
  [
    { isRest: false, pitch: 74, duration: 384 },
    { isRest: false, pitch: 74, duration: 384 },
    { isRest: false, pitch: 67, duration: 384 }
  ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 74, duration: 96 },
    { isRest: false, pitch: 76, duration: 96 },
    { isRest: false, pitch: 74, duration: 96 },
    { isRest: true, pitch: 60, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: true, pitch: 60, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: true, pitch: 60, duration: 192 },
    { isRest: false, pitch: 67, duration: 192 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 74, duration: 96 },
    { isRest: false, pitch: 76, duration: 96 },
    { isRest: false, pitch: 74, duration: 96 }
  ],
  [
    { isRest: false, pitch: 74, duration: 96 },
    { isRest: false, pitch: 76, duration: 96 },
    { isRest: false, pitch: 74, duration: 192 }
  ],
  [
    { isRest: false, pitch: 67, duration: 2304 },
    { isRest: false, pitch: 67, duration: 1536 },
    { isRest: false, pitch: 65, duration: 1920 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 70, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 70, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
  [
    { isRest: false, pitch: 65, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 70, duration: 96 }
  ],
  [
    { isRest: false, pitch: 67, duration: 96 },
    { isRest: false, pitch: 70, duration: 96 }
  ],
  [
    { isRest: false, pitch: 70, duration: 96 },
    { isRest: false, pitch: 67, duration: 96 }
  ],
];

    function getPattern(idx) {
        return patternData[idx];
    }

    function getPatternCount() {
        return patternData.length
    }
        
  function getState() {
    return {
        beatsPerBar: 3,
        // bpm: 90, // in C
        bpm: 120, // in Cpp
        patternLength: getPatternCount()
    };
  }

  // let c = getPatternCount();
  // for(let i=0;i<c;++i)
  // console.log(getPattern(i))

module.exports = {
    getPatternCount,
    getPattern,
    getState
};
