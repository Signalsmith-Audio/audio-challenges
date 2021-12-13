let challenge = new Challenge("1kHz Lowpass");
challenge.source = "synth-chord";
challenge.scope = 0.5;
challenge.fftPeriod = 0.1;
challenge.descriptionHtml = `
	<p>Apply a 2nd-order Butterword lowpass at 1kHz</p>
`;
challenge.testSpectrum = (sampleRate, times, freqs, inputs, outputs) => {
	if (inputs.length != outputs.length) return "channel counts don't match";
	
	for (let c = 0; c < inputs.length; ++c) {
		var minDb = Infinity;
		for (let f = 0; f < freqs.length; ++f) {
			let inputEnergy = 0;
			let outputEnergy = 0;
			for (let i = 0; i < times.length; ++i) {
				let inputR = inputs[c][i][2*f];
				let inputI = inputs[c][i][2*f + 1];
				let outputR = outputs[c][i][2*f];
				let outputI = outputs[c][i][2*f + 1];
				inputEnergy += inputR*inputR + inputI*inputI;
				outputEnergy += outputR*outputR + outputI*outputI;
			}
			let ratio = outputEnergy/inputEnergy;
			let db = 10*Math.log10(ratio);
			let errorDb = 0.1;
			if (freqs[f] < 8000) {
				if (db > errorDb) return "Energy too high (" + db + "dB) at " + freqs[f] + "Hz";
				// >= -0.5dB below 500Hz
				if (freqs[f] < 500 && db < -0.5 + errorDb) return "Energy too low (" + db + "dB) at " + freqs[f] + "Hz";
				// -3dB at 1kHz
				if (freqs[f] < 980 && db < -3 - errorDb) return "Energy too low (" + db + "dB) at " + freqs[f] + "Hz";
				if (freqs[f] > 1020 && db > -3 + errorDb) return "Energy too high (" + db + "dB) at " + freqs[f] + "Hz";
				// about 12.25 at 2kHz
				if (freqs[f] < 1980 && db < -12.5 - errorDb) return "Energy too low (" + db + "dB) at " + freqs[f] + "Hz";
				if (freqs[f] > 2020 && db > -12 + errorDb) return "Energy too high (" + db + "dB) at " + freqs[f] + "Hz";
				// Monotonically decreasing
				if (db > minDb + 0.5) return "Energy should always decrease (" + db + "dB) at " + freqs[f] + "Hz";
			}
			minDb = Math.min(minDb, db);
		}
	}
};
Challenge.register(challenge);
