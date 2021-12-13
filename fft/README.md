# JS FFT

This is a simple JavaScript FFT implementation for power-of-2-sizes, including Real FFTs.

## How to use

In the browser:
```html
<script src="fft.js"></script>
<script>
	// Classes are defined in the global namespace
	var fft = new FFT(256); // Complex FFT
	var rfft = new RFFT(256); // Real FFT
</script>
```

In Node:
```javascript
let ssfft = require('signalsmith-js-fft');
let FFT = ssfft.FFT, RFFT = ssfft.RFFT;
```

### Complex FFTs

For complex FFTs, the inputs and outputs are complex-interleaved (i.e. `[real0, imag0, real1, imag1, ...]`), so the arrays should be twice the FFT size.

```javascript
var fft = new FFT(256);
//
var waveform = new Float64Array(512), spectrum = new Float64Array(512);

fft.fft(waveform, spectrum); // forward FFT
fft.ifft(spectrum, waveform); // round-trip is scaled by 256
```

### Real FFTs

For real-valued FFTs, the Nyquist result is packed into the imaginary part of bin 0, so the arrays are exactly the FFT size.

```javascript
var rfft = new RFFT(256);
var waveform = new Float64Array(256), spectrum = new Float64Array(256);

rfft.fft(waveform, spectrum); // forward FFT
rfft.ifft(spectrum, waveform); // round-trip is scaled by 256
```

## License

The licence is MIT License - but we're flexible, so get in touch if you need anything else.
