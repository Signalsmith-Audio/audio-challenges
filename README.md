# Audio Challenges C++ starter kit

This is a starting point for solving the [Audio Challenges](https://signalsmith-audio.github.io/audio-challenges/).  The first challenge is solved, and you can add more.

## To build and run

There is only one source file: `main.cpp`.

You can build this however you like, but there is also a (very simple) [`Makefile`](Makefile):

```
make
```

This builds `main.cpp` into  `out/main`, which you can then run (e.g. `out/main fixed-gain input.wav output.wav`).

## `wav.h`

This is a simple library to read and write 16-bit WAV files - enough for demos and experiments.

### Sample-rate and channel count

Get/set these as `.sampleRate` and `.channel`:

```cpp
Wav wav;
// Sample-rate, as a double
wav.sampleRate = 48000;
// Channel-count as an unsigned int
wav.channels = 2;
// Length
int length = wav.length();
```

WAV sample-rates are actually 32-bit integers, but it's stored here as a `double` so you can divide by it more easily.

### Sample data

Samples are in `.samples`, which is a `std::vector<double>`:

```cpp
wav.samples.resize(1000);
wav.samples[0] = 0;
```

WAV samples are interleaved, so it might be more convenient to access them using `.at(channel, index)`:

```cpp
for (int i = 0; i < wav.length(); ++i) {
	for (int c = 0; c < wav.channels; ++c) {
		double value = wav.at(c, i);
		wav.at(c, i) = value*2;
	}
}
```

Samples are scaled to the unit range (-1, 1), and converted appropriately on input/output.

### Reading and writing

You read/write with `.read()` and `.write()`, using filenames as `std::string`.

These return a `Wav::Result` object, which evaluates `true` for success, and `false` for failure.  It has a `.reason` string for human-readable errors.

```cpp
Wav wav;
auto result = wav.read("input.wav");
if (!result) {
	std::cerr << "WAV error: " << result.reason << "\n";
}
```

The result of the latest operation is also available as `wav.result`, so you can write stuff like this:

```cpp
if (!wav.write("output.wav")) {
	std::cerr << wav.result.reason << "\n";
}
```

### Limitations

The `Wav` class only supports 16-bit PCM, and no extended formats.  As such, it's probably not a good choice if you're writing proper software which takes a wide range of WAV inputs.

However, it's enough to solve the audio challenges (which only use 16-bit inputs).  If you need support for a wider range of WAV files, use a different library - or help use out by adding it yourself, it's open source!

## License

This code is released as [CC0](https://creativecommons.org/publicdomain/zero/1.0/).  If you need anything else, get in touch.
