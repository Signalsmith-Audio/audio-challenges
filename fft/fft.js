// A fairly small and neat FFT - not the fastest, but not terrible
// Expects interleaved complex pairs (i.e. `[real0, imag0, real1, imag1, ...]`)
function FFT(size) {
	if (!(this instanceof FFT)) return new FFT(size);

	var twiddleRealCache = new Float64Array(size);
	var twiddleImagCache = new Float64Array(size);
	var stride = 1;
	while (stride < size) {
		for (var i = 0; i < stride; ++i) {
			var twiddleReal = Math.cos(Math.PI*i/stride);
			var twiddleImag = -Math.sin(Math.PI*i/stride);
			twiddleRealCache[stride + i] = twiddleReal;
			twiddleImagCache[stride + i] = twiddleImag;
		}
		stride *= 2;
	}

	function fftStep2(buffer, stride, direction) {
		var offset = 0;
		var doubleStride = stride*2;
		while (offset < size*2) {
			for (var i = 0; i < stride; ++i) {
				var indexA = offset + i*2, indexB = indexA + doubleStride;
				var realA = buffer[indexA], imagA = buffer[indexA + 1];
				var realB = buffer[indexB], imagB = buffer[indexB + 1];

				var diffReal = realA - realB;
				var diffImag = imagA - imagB;
				var twiddleReal = twiddleRealCache[stride + i];
				var twiddleImag = direction*twiddleImagCache[stride + i];

				buffer[indexA] = realA + realB;
				buffer[indexA + 1] = imagA + imagB;
				buffer[indexB] = diffReal*twiddleReal - diffImag*twiddleImag;
				buffer[indexB + 1] = diffReal*twiddleImag + diffImag*twiddleReal;
			}
			offset += doubleStride*2;
		}
	}
	function fft(buffer) {
		for (var s = size/2; s >= 1; s /= 2) {
			fftStep2(buffer, s, 1);
		}
	}
	function ifft(buffer) {
		for (var s = size/2; s >= 1; s /= 2) {
			fftStep2(buffer, s, -1);
		}
	}

	function bitSwap(x, N) {
		var result = 0;
		N >>= 1;
		while (N) {
			result = (result << 1) + (x&1);
			N >>= 1;
			x >>= 1;
		}
		return result;
	}
	var permutations = [];
	for (var i = 0; i < size; i++) {
		var i2 = bitSwap(i, size);
		if (i < i2) {
			permutations.push(i);
			permutations.push(i2);
		}
	}
	function fft_permute(buffer, offset, step, N) {
		for (var i = 0; i < permutations.length; i += 2) {
			var index1 = permutations[i], index2 = permutations[i + 1];

			var tmpReal = buffer[index1*2], tmpImag = buffer[index1*2 + 1];
			buffer[index1*2] = buffer[index2*2];
			buffer[index1*2 + 1] = buffer[index2*2 + 1];
			buffer[index2*2] = tmpReal;
			buffer[index2*2 + 1] = tmpImag;
		}
	}
	function getInPlace(input, output) {
		if (!output) return input;
		for (var i = 0; i < size*2; ++i) {
			output[i] = input[i];
		}
		return output;
	}
	this.fft = function(input, output) {
		var buffer = getInPlace(input, output);
		fft(buffer, 0, 2, size);
		fft_permute(buffer, 0, 2, size);
	};
	this.ifft = function(input, output) {
		var buffer = getInPlace(input, output);
		ifft(buffer, 0, 2, size);
		fft_permute(buffer, 0, 2, size);
	};
}
// Real-valued FFT
// Accepts real waveforms, and interleaved complex spectra (with Nyquist stuffed into bin 0)
function RFFT(size) {
	if (!(this instanceof RFFT)) return new RFFT(size);
	var hSize = size>>1, qSize = size>>2;
	var complexFft = new FFT(hSize);

	var complexBuffer = new Float64Array(size);
	var twiddles = new Float64Array(hSize + 2);
	for (var i = 0; i <= qSize; ++i) {
		var rotPhase = -2*Math.PI*i/size;
		twiddles[2*i] = Math.sin(rotPhase);
		twiddles[2*i + 1] = -Math.cos(rotPhase);
	}

	this.fft = function(input, output) {
		complexFft.fft(input, complexBuffer);
		output[0] = complexBuffer[0] + complexBuffer[1],
		output[1] = complexBuffer[0] - complexBuffer[1];
		for (var i = 1; i <= qSize; ++i) {
			var conjI = hSize - i;

			var oddR = (complexBuffer[2*i] + complexBuffer[2*conjI])*0.5;
			var oddI = (complexBuffer[2*i + 1] - complexBuffer[2*conjI + 1])*0.5;
			var iEvenR = (complexBuffer[2*i] - complexBuffer[2*conjI])*0.5;
			var iEvenI = (complexBuffer[2*i + 1] + complexBuffer[2*conjI + 1])*0.5;
			var twiddleR = twiddles[2*i], twiddleI = twiddles[2*i + 1];
			var rotR = iEvenR*twiddleR - iEvenI*twiddleI;
			var rotI = iEvenR*twiddleI + iEvenI*twiddleR;

			output[2*i] = oddR + rotR;
			output[2*i + 1] = oddI + rotI;
			output[2*conjI] = oddR - rotR;
			output[2*conjI + 1] = rotI - oddI;
		}
	};
	this.ifft = function(input, output) {
		complexBuffer[0] = input[0] + input[1],
		complexBuffer[1] = input[0] - input[1];
		for (var i = 1; i <= qSize; ++i) {
			var conjI = hSize - i;

			var oddR = input[2*i] + input[2*conjI];
			var oddI = input[2*i + 1] - input[2*conjI + 1];
			var iEvenR = input[2*i] - input[2*conjI];
			var iEvenI = input[2*i + 1] + input[2*conjI + 1];
			var twiddleR = twiddles[2*i], twiddleI = twiddles[2*i + 1];
			var rotR = iEvenR*twiddleR + iEvenI*twiddleI;
			var rotI = iEvenI*twiddleR - iEvenR*twiddleI;

			complexBuffer[2*i] = oddR + rotR;
			complexBuffer[2*i + 1] = oddI + rotI;
			complexBuffer[2*conjI] = oddR - rotR;
			complexBuffer[2*conjI + 1] = rotI - oddI;
		}
		complexFft.ifft(complexBuffer, output);
	};
}
if (typeof module === 'object' && module) {
	module.exports = {
		FFT: FFT,
		RFFT: RFFT
	};
}