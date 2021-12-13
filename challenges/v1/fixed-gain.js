let challenge = new Challenge("Fixed gain");
challenge.source = "synth-chord";
challenge.scope = 2;
challenge.fftPeriod = 0.05;
challenge.descriptionHtml = `
	<p>Multiply every sample in the input by <code>0.25</code></p>
`;
challenge.explanationHtml = `
	<p>Multiplying a waveform by a constant factor makes it louder or quieter.</p>
`;
challenge.testWaveform = (sampleRate, input, output) => {
	if (input.length != output.length) return "Channel counts don't match";

	let inputEnergy = 0, outputEnergy = 0;
	input.forEach(channel => {
		for (let i = 0; i < channel.length; ++i) inputEnergy += channel[i]*channel[i];
	});
	output.forEach(channel => {
		for (let i = 0; i < channel.length; ++i) outputEnergy += channel[i]*channel[i];
	});

	let expected = inputEnergy*0.25*0.25;
	console.log(inputEnergy, outputEnergy, expected);
	if (outputEnergy > expected*1.05) return "energy too high";
	if (outputEnergy < expected*0.95) return "energy too low";
};
Challenge.register(challenge);
