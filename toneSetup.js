//////////////////////////////////////////////////////////////////
// Tone.js Audio Engine Setup
//////////////////////////////////////////////////////////////////
let polySynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: "fatsawtooth",
    count: 3,
    spread: 10,
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
    attackCurve: "exponential",
  },
});


const synth1 = new Tone.Synth();
const synth2 = new Tone.Synth();
const synth3 = new Tone.Synth();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Sampler
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
let sampler = new Tone.Sampler({
    urls: {
        D2: "mel_low_d.wav",
        C3: "four.m4a",
    },
    baseUrl: "./assets/audioSamples/"
});
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Audio Effects
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const filter = new Tone.Filter(20000, "lowpass");    
const distortion = new Tone.Distortion(0.1);        
const reverb = new Tone.Reverb(2);                 
const meter = new Tone.Meter();                     
meter.smoothing = 0.1;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////// Init Function
// This gets triggered when the user closes the dialog element
// It will connect the polysynth => filter => distortion => meter => audio output


function toneInit() {
    
    polySynth.chain(filter, distortion, reverb, meter, Tone.Destination);
    
    synth1.chain(filter, distortion, reverb, Tone.Destination);
    synth2.chain(filter, distortion, reverb, Tone.Destination);
    synth3.chain(filter, distortion, reverb, Tone.Destination);

    console.log("Tone.js initialized");
}


function playNote(synth, note="C4", duration="8n") {
    synth.triggerAttackRelease(note, duration);
}

function playChord(notes=["C4","E4","G4"], duration="8n") {
    polySynth.triggerAttackRelease(notes, duration);
}


