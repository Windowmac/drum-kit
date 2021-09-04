const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

const init = () => {
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
  primaryGainControl.gain.setValueAtTime(0.05, 0);
  primaryGainControl.connect(audioCtx.destination);

  const snareFilter = audioCtx.createBiquadFilter();
  snareFilter.type = 'highpass';
  snareFilter.frequency.value = 2000; // Measured in Hz
  snareFilter.connect(primaryGainControl);

  const playSnare = () => {
    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(snareFilter);
    whiteNoiseSource.start();
  };

  const playKick = () => {
      const kickOscillator = audioCtx.createOscillator();
      kickOscillator.frequency.setValueAtTime(261.1, 0);
      kickOscillator.connect(primaryGainControl);
      kickOscillator.start();
      kickOscillator.stop(audioCtx.currentTime + 0.5);
  }

  const sounds = {
    Space: playKick,
    // 'KeyJ': closedHatEl,
    // 'KeyK': openHatEl,
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
});
