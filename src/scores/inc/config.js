const musicianList= [
    {
        name: "Bass",
        channel: 0, 
        volume: 50,
        volumeVariance: 5,
        ccBank:  6,  // G
        ccPatch: 19, // 20
        octave: -12,
    },

    {
        name: "Synth", // seclead 5 & sparkle 10
        channel: 1,
        ccBank:  3, // D70 = Obiwan pad (Biwa! Geddit?)
        ccPatch: 69,
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
        volume: 60,
        octave: 0,
        channel: 4,
        ccBank:  4,
        ccPatch: 89,
        // ccBank:  6,
        // ccPatch: 32
    },

];

const pulse =
    {
        channel: 11, 
        volume:  50,
        pitch:   60,
        volumeVariance: 5,
        ccBank:  2,
        ccPatch:93,
    };


module.exports = {
    pulse,
    musicianList
};
