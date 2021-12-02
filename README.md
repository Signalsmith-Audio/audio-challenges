# Audio Challenges

This project aims to be a set of audio-related challenges to help build an intuitive link between maths, code and sound.

This is a *very* early-stage project.  The goals are:

* natural progression of difficulty and complexity
* can be completed in any language
* informative displays of the altered waveform and spectrum

## Design

We want to stay as neutral as possible, and not be tied to a particular language or framework.  As such, the challenges are web-based, where you drop a WAV file into the browser to be analysed.

The challenges are written as plain JavaScript files, with `challenge.js` providing the `Challenge` class, as well as some helpful DSP analysis tools for checking the submitted results.

## Joining in

There are loads of different areas you could help in, so (whatever your skillset) reach out if you're feeling keen!  Some specific things include:

### Feedback and suggestions

What do you think about the project?  What could we do better?

### Get-started kits in different languages

We'd love there to be some easy get-started kits in a few different languages, for example:

* Python: with SciPy, reading/writing WAV files is pretty easy.
* a JUCE project: produces a plugin you can apply to the input track in a DAW (and export WAV files)
* Plain C++: with minimal dependencies and a trivial build system
* audio programming languages (JSFX, SuperCollider, MAX/MSP, etc.)

### Web design

The current client (in `basic-html-client/`) is functional but not that pretty.  The challenges are (hopefully) written in a fairly neutral way to enable you to write a shinier and more fun client.

### Planning and leadership

This is currently a Signalsmith Audio project, but we would love it to be collaborative.

This kind of teaching resource works best if tightly curated (i.e. not a wiki), but if we get a few other people committed to this, we can move this to its own GitHub organisation.

## License

This code (including the challenges) are released under the [MIT license](https://choosealicense.com/licenses/mit/).
