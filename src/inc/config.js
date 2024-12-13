const musicianList= [
    {
        name: "Bass",
        channel: 0, 
        volume: 10,
        volumeVariance: 1,
        ccBank:  5,
        ccPatch: 68,
        octave: -12,
    },

    {
        name: "Synth", // seclead 5 & sparkle 10
        channel: 1,
        ccBank:  3,
        ccPatch: 20,
    },

    {
        name: "Harp",
        channel: 2,
        ccBank:  6,
        ccPatch: 58,
    },

    {
        name: "Mover",
        octave: 12,
        channel: 3,
        ccBank:  0,
        ccPatch: 105
    },
    {
        name: "Cork/SynBass",
        volume: 80,
        octave: 24,
        channel: 4,
        ccBank:  6,
        ccPatch: 32
    },

];

const pulse =
    {
        channel: 11, 
        pitch:   60,
        volume:  90,
        volumeVariance: 5,
        ccBank:  2,
        ccPatch:93,
    };


module.exports = {
    pulse,
    musicianList
};
