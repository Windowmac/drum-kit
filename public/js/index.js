const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

const init = async () => {
  audioCtx = new AudioContext();
  const buffer = audioCtx.createBuffer(
    1,
    audioCtx.sampleRate * 1,
    audioCtx.sampleRate
  );
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < channelData.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }

  const primaryGainControl = audioCtx.createGain();
  primaryGainControl.gain.setValueAtTime(0.5, 0);
  primaryGainControl.connect(audioCtx.destination);

  const snareFilter = audioCtx.createBiquadFilter();
  snareFilter.type = 'highpass';
  snareFilter.frequency.value = 2000; // Measured in Hz
  snareFilter.connect(primaryGainControl);

  const closedHatResponse = await fetch(
    'https://unpkg.com/@teropa/drumkit@1.1.0/src/assets/hatClosed2.mp3'
  ).catch((err) => {
    console.log(err);
  });
  const closedBuffer = await closedHatResponse.arrayBuffer();
  const closedHatBuffer = await audioCtx.decodeAudioData(closedBuffer);

  const openHatResponse = await fetch(
    'https://unpkg.com/@teropa/drumkit@1.1.0/src/assets/hatOpen2.mp3'
  ).catch((err) => {
    console.log(err);
  });
  const openBuffer = await openHatResponse.arrayBuffer();
  const openHatBuffer = await audioCtx.decodeAudioData(openBuffer);

  const playSnare = () => {
    document.querySelector('#snare_drum').style.background = 'white';
    document.querySelector('#snare_drum').style.border = '1px solid black';
    setTimeout(() => {
      document.querySelector('#snare_drum').style.background = 'black';
      document.querySelector('#snare_drum').style.border = '';
    }, 500);
    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    const whiteNoiseGain = audioCtx.createGain();
    whiteNoiseGain.gain.setValueAtTime(1, audioCtx.currentTime);
    whiteNoiseGain.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.2
    );
    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(snareFilter);

    whiteNoiseSource.start();
    whiteNoiseSource.stop(audioCtx.currentTime + 0.2);

    const snareOscillator = audioCtx.createOscillator();
    snareOscillator.type = 'triangle';
    snareOscillator.frequency.setValueAtTime(180, 0);

    const snareOscillatorGain = audioCtx.createGain();
    snareOscillatorGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    snareOscillatorGain.gain.exponentialRampToValueAtTime(
      0.1,
      audioCtx.currentTime + 0.2
    );
    snareOscillator.connect(snareOscillatorGain);
    snareOscillatorGain.connect(primaryGainControl);
    snareOscillator.start();
    snareOscillator.stop(audioCtx.currentTime + 0.2);
  };

  const playKick = () => {
    document.querySelector('#bass_drum').style.background = 'white';
    document.querySelector('#bass_drum').style.border = '1px solid black';
    setTimeout(() => {
      document.querySelector('#bass_drum').style.background = 'black';
      document.querySelector('#bass_drum').style.border = '';
    }, 500);
    const kickOscillator = audioCtx.createOscillator();
    kickOscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    kickOscillator.frequency.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.5
    );

    const kickGain = audioCtx.createGain();
    kickGain.gain.setValueAtTime(1, 0);
    kickGain.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.5
    );

    kickOscillator.connect(kickGain);
    kickGain.connect(primaryGainControl);
    kickOscillator.start();
    kickOscillator.stop(audioCtx.currentTime + 0.5);
  };

  const playClosedHat = async () => {
    document.querySelector('#closed_hat').style.borderTop = '100px solid white';
    document.querySelector('#closed_hat').style.borderLeft = '50px solid black';
    document.querySelector('#closed_hat').style.borderRight = '50px solid black';
    setTimeout(() => {
      document.querySelector('#closed_hat').style.borderTop = '100px solid black';
      document.querySelector('#closed_hat').style.borderLeft = '50px solid transparent';
      document.querySelector('#closed_hat').style.borderRight = '50px solid transparent';
    }, 450);
    const closedHatSource = audioCtx.createBufferSource();
    closedHatSource.buffer = closedHatBuffer;
    closedHatSource.connect(primaryGainControl);
    closedHatSource.start();
  };

  const playOpenHat = async () => {
    document.querySelector('#open_hat').style.borderBottom = '100px solid white';
    document.querySelector('#open_hat').style.borderLeft = '50px solid black';
    document.querySelector('#open_hat').style.borderRight = '50px solid black';
    setTimeout(() => {
      document.querySelector('#open_hat').style.borderBottom = '100px solid black';
      document.querySelector('#open_hat').style.borderLeft = '50px solid transparent';
      document.querySelector('#open_hat').style.borderRight = '50px solid transparent';
    }, 450);
    const openHatSource = audioCtx.createBufferSource();
    openHatSource.buffer = openHatBuffer;
    openHatSource.connect(primaryGainControl);
    openHatSource.start();
  };

  const sounds = {
    Space: playKick,
    KeyJ: playClosedHat,
    KeyK: playOpenHat,
    KeyF: playClosedHat,
    KeyD: playOpenHat,
    KeyG: playSnare,
    KeyH: playSnare,
  };

  const playSound = (event) => {
    sounds[event.code]();
  };

  document.body.addEventListener('keydown', playSound);
};

document.querySelector('#start').addEventListener('click', () => {
  if (!audioCtx) {
    init();
  }
  // check if context is in suspended state (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  document
    .querySelector('#center_column')
    .removeChild(document.querySelector('#start'));

  const bassDrumEl = document.createElement('div');
  bassDrumEl.id = 'bass_drum';
  const snareDrumEl = document.createElement('div');
  snareDrumEl.id = 'snare_drum';
  const closedHatEl = document.createElement('div');
  closedHatEl.id = 'closed_hat';
  const openHatEl = document.createElement('div');
  openHatEl.id = 'open_hat';

  document.querySelector('#center_column').appendChild(snareDrumEl);
  document.querySelector('#center_column').appendChild(bassDrumEl);
  document.querySelector('#center_column').appendChild(closedHatEl);
  document.querySelector('#center_column').appendChild(openHatEl);
  document.querySelector('#key_section').style.display = "block";
});