function Stft(sampleRate, fftPeriod) {
	// Find next power of 2
	let windowSize = Math.round(fftPeriod*sampleRate);
	let fftSize = 2;
	while (fftSize < windowSize) fftSize *= 2;

	let fft = new RFFT(fftSize);

	let fftWindow = new Float64Array(windowSize);
	for (let i = 0; i < windowSize; ++i) {
		let r = (i + 0.5)/windowSize;
		// Blackmann-Harris
		fftWindow[i] = 0.35875 - 0.48829*Math.cos(r*2*Math.PI) + 0.14128*Math.cos(r*4*Math.PI) - 0.01168*Math.cos(r*6*Math.PI);
	}

	this.analyse = (inputs) => {
		let intervalSamples = Math.round(windowSize/4);

		let times = [];
		let spectra = inputs.map(x => []);
		let time = new Float64Array(fftSize);
		for (let offset = 0; offset <= inputs[0].length - windowSize; offset += intervalSamples) {
			for (let c = 0; c < inputs.length; ++c) {
				let channel = inputs[c];
				for (let i = 0; i < windowSize; ++i) {
					time[i] = channel[i + offset]*fftWindow[i]/windowSize;
				}
				// Zero-pad
				for (let i = windowSize; i < fftSize; ++i) {
					time[i] = 0;
				}

				let spectrum = new Float64Array(fftSize);
				fft.fft(time, spectrum);
				spectrum[1] = 0; // remove Nyquist, it's in a weird place and not really useful anyway
				spectra[c].push(spectrum);
			}
			times.push((offset + windowSize*0.5)/sampleRate);
		}
		let freqs = [];
		for (let b = 0; b < fftSize/2; ++b) {
			freqs.push(b/fftSize*sampleRate);
		}
		return {
			times: times,
			freqs: freqs,
			channels: spectra
		};
	};
};
