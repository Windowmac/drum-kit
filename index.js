


const sounds = {
    'Space': './assets/audio/Bass-Drum-1.wav',
    'KeyJ': './assets/audio/Closed-Hi-Hat-1.wav',
    'KeyK': './assets/audio/Wet-Open-Hi-Hat-1.wav',
    'KeyH': './assets/audio/Snare-Drum-1.wav'
}

const playSound = (event) => {
    console.log(event.code);
    const sound = new Audio(sounds[event.code]);
    sound.play();
}

document.body.addEventListener('keydown', playSound);
