const musicianList= [
    {
        name: "Bass",
        channel: 0, 
        volumeVariance: 0,
        ccBank:  2,
        ccPatch:93,
        octave: -12,
    },

    {
        name: "Synth",
        channel: 1,
        ccBank:  3,
        ccPatch: 20
    },

    {
        name: "Bahn",
        channel: 2,
        ccBank:  4,
        ccPatch: 6
    },

    {
        name: "Duke",
        volume: 50,
        octave: 12,
        channel: 3,
        ccBank:  4,
        ccPatch: 44
    },
    
    {
        name: "SynBass",
        channel: 4,
        ccBank:  6,
        ccPatch: 32
    },
    {
        name: "Chime",
        octave: 24,
        channel: 5,
        ccBank:  1,
        ccPatch: 91
    },
        
    {
        name: "Path",
        volume: 80,
        channel: 6,
        ccBank:  3,
        ccPatch: 11
    },        
    {
        name: "Arp",
        volume: 90,
        channel: 7,
        ccBank:  4,
        ccPatch: 72
    },
];

const pulse =
    {
        channel: 10, 
        pitch:   60,
        volume:  80,
        volumeVariance: 0,
        ccBank:  7,
        ccPatch: 69
    };


module.exports = {
    pulse,
    musicianList
};
