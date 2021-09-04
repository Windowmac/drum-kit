
const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioCtx;

const bassDrum = () => {}

const bassDrumEl = document.getElementById('bass-drum');
const snareDrumEl = document.getElementById('snare-drum');
const closedHatEl = document.getElementById('closed-hat'); 
const openHatEl = document.getElementById('open-hat');

const init = () => {

	audioCtx = new AudioContext();

	audioCtx.createMediaElementSource(bassDrumEl).connect(audioCtx.destination);
    audioCtx.createMediaElementSource(snareDrumEl).connect(audioCtx.destination);
    audioCtx.createMediaElementSource(closedHatEl).connect(audioCtx.destination);
    audioCtx.createMediaElementSource(openHatEl).connect(audioCtx.destination);

    const sounds = {
        'Space': bassDrumEl,
        'KeyJ': closedHatEl,
        'KeyK': openHatEl,
        'KeyH': snareDrumEl
    }

    const playSound = (event) => {
        console.log(event.code);
        sounds[event.code].play();
    }

    document.body.addEventListener('keydown', playSound);
}

document.querySelector('#start').addEventListener('click', () => {
    if(!audioCtx) {
		init();
	}

	// check if context is in suspended state (autoplay policy)
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}
})



