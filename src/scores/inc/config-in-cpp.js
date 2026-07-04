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
        // rest:    1
    },

    {
        name: "Mover",
        octave: 12,
        channel: 3,
        ccBank:  0,
        ccPatch: 105
    },
    {
        name: "Stella",
        octave: 12,
        channel: 12,
        ccBank:  0,
        ccPatch: 122,
        speed:   2
    },
    
    {
        name: "Cork/SynBass",
        volume: 80,
        octave: 24,
        channel: 4,
        ccBank:  6,
        ccPatch: 32
    },
    {
        name: "sigma",
        octave: 12,
        channel: 5,
        ccBank:  1,
        ccPatch: 91,
        rest:    1,
    },
        
    {
        name: "Pad",
        volume: 80,
        channel: 6,
        ccBank:  2,
        ccPatch: 113,
        speed:   3,
        rest:    1
    },        
    {
        name: "Arp",
        volume: 90,
        octave: 12,
        channel: 7,
        ccBank:  4,
        ccPatch: 72,
        sfx:     1
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
