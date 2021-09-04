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
  snareFilter.frequency.value = 1500; // Measured in Hz
  snareFilter.connect(primaryGainControl);

  const createSnare = () => {
    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(snareFilter);
    return whiteNoiseSource;
  };

  const sounds = {
    Space: () => {
      const whiteNoiseSource = audioCtx.createBufferSource();
      whiteNoiseSource.buffer = buffer;
      whiteNoiseSource.connect(primaryGainControl);
      return whiteNoiseSource;
    },
    // 'KeyJ': closedHatEl,
    // 'KeyK': openHatEl,
    KeyH: createSnare,
  };

  const playSound = (event) => {
    sounds[event.code]().start();
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
