


const sounds = {
    'Space': './assets/audio/Bass-Drum-1.wav',
}

const playSound = (event) => {
    const sound = new Audio(sounds[event.code]);
    sound.play();
}

document.body.addEventListener('keydown', playSound);
