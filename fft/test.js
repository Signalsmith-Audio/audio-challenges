let fft = require('./fft.js');
let FFT = fft.FFT, RFFT = fft.RFFT;

function testBin(size, bin) {
	let input = new Float64Array(size*2);
	let output = new Float64Array(size*2);
	for (let i = 0; i < size; ++i) {
		input[i*2] = Math.cos(2*Math.PI*bin*i/size);
		input[i*2 + 1] = Math.sin(2*Math.PI*bin*i/size);
	}

	let f = FFT(size);
	f.fft(input, output);

	let errorLimit = 1e-6;
	for (let b = 0; b < size; ++b) {
		let expectedReal = (b == bin) ? size : 0;
		let expectedImag = 0;
		let errorReal = output[2*b] - expectedReal;
		let errorImag = output[2*b + 1] - expectedImag;
		let error = Math.sqrt(errorReal*errorReal + errorImag*errorImag);
		if (!(error < errorLimit)) {
			console.error(b, output[2*b], output[2*b + 1]);
			throw new Error("Failed for bin " + b + "/" + size);
		}
	}
}
function testLinearity(size) {
	let inputA = new Float64Array(size*2), outputA = new Float64Array(size*2);
	let inputB = new Float64Array(size*2), outputB = new Float64Array(size*2);
	let inputSum = new Float64Array(size*2), outputSum = new Float64Array(size*2);
	for (let i = 0; i < size*2; ++i) {
		inputA[i] = Math.random()*2 - 1;
		inputB[i] = Math.random()*2 - 1;
		inputSum[i] = inputA[i] + inputB[i];
	}

	let f = FFT(size);
	f.fft(inputA, outputA);
	f.fft(inputB, outputB);
	f.fft(inputSum, outputSum);

	let errorLimit = 1e-6;
	for (let i = 0; i < size*2; ++i) {
		let diff = outputSum[i] - outputA[i] - outputB[i];
		if (!(Math.abs(diff) < errorLimit)) {
			throw new Error("Failed linearity for size " + size);
		}
	}
}
function testInverse(size) {
	let time = new Float64Array(size*2);
	let spectrum = new Float64Array(size*2);
	let roundTrip = new Float64Array(size*2);
	for (let i = 0; i < size*2; ++i) {
		time[i] = Math.random()*2 - 1;
	}

	let f = FFT(size);
	f.fft(time, spectrum);
	f.ifft(spectrum, roundTrip);

	let errorLimit = 1e-6;
	for (let i = 0; i < size*2; ++i) {
		let diff = roundTrip[i] - time[i]*size;
		if (!(Math.abs(diff) < errorLimit)) {
			throw new Error("Failed inverse for size " + size);
		}
	}
}
function testReal(size) {
	let inputComplex = new Float64Array(size*2), outputComplex = new Float64Array(size*2);
	let inputReal = new Float64Array(size), outputReal = new Float64Array(size);
	let roundTrip = new Float64Array(size);

	for (let i = 0; i < size; ++i) {
		inputReal[i] = Math.random()*2 - 1;
		inputComplex[2*i] = inputReal[i];
		inputComplex[2*i + 1] = 0;
	}

	let f = FFT(size), fr = RFFT(size);
	f.fft(inputComplex, outputComplex);
	fr.fft(inputReal, outputReal);

	let errorLimit = 1e-6;
	for (let i = 2; i < size; ++i) {
		let diff = outputComplex[i] - outputReal[i];
		if (!(Math.abs(diff) < errorLimit)) {
			console.log(i, outputComplex[i], outputReal[i]);
			throw new Error("Failed real for size " + size);
		}
	}

	fr.ifft(outputReal, roundTrip);
	for (let i = 0; i < size; ++i) {
		let diff = roundTrip[i] - inputReal[i]*size;
		if (!(Math.abs(diff) < errorLimit)) {
			throw new Error("Failed real inverse for size " + size);
		}
	}
}
for (let size = 1; size < 32768; size*= 2) {
	console.log("testing size=" + size);
	if (size <= 16) {
		for (let f = 0; f < size; ++f) {
			testBin(size, f);
		}
	} else {
		for (let r = 0; r < 16; ++r) {
			let f = Math.floor(Math.random()*size);
			testBin(size, f);
		}
	}
	testLinearity(size);
	testInverse(size);
	if (size >= 2) testReal(size);
}