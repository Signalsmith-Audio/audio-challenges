function Challenge(title) {
	this.title = title;
};
// Here are the things that challenges should fill out
Challenge.prototype = {
	source: "synth-chord", // audio source ID, from `audio-sources/`
	scope: 0.1, // oscilloscope length (if a number), or [position, length],
	fftPeriod: 0.05, // FFT analysis period
	descriptionHtml: "<p>The challenge details</p>",
	explanationHtml: "<p>Explain the results</p>",
	testWaveform: (sampleRate, input, output) => {
		// input and output are lists containing a buffer for each channel
		// Returning a string means an error
		if (input.length != output.length) return "Result has " + output.length + " channels instead of " + input.length;

		return null; // returning null means the challenge is accepted
	},
	testSpectrum: (sampleRate, times, freqs, input, output) => {
		// times and freqs are lists of the STFT times and bin frequencies
		// input and output are lists containing lists of spectra, with interleaved complex values
		var channel = 0, timeIndex = 0, freqIndex = 5;
		var binReal = input[channel][timeIndex][freqIndex*2];
		var binImag = input[channel][timeIndex][freqIndex*2 + 1];
	}
};

Challenge.register = function(challenge) {
	alert("The host web-page should override Challenge.register() to display a challenge.");
};
