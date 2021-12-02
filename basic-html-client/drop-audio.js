function fetchAudio(url) {
	return fetch(url)
		.then(response => response.arrayBuffer())
		.then(buffer => decodeArrayBuffer(buffer, url));
}
function decodeArrayBuffer(buffer, url) {
	var ac = new AudioContext;
	return ac.decodeAudioData(buffer).then(audioBuffer => {
		var channelBuffers = [];
		for (var c = 0; c < audioBuffer.numberOfChannels; ++c) {
			channelBuffers.push(audioBuffer.getChannelData(c));
		}
		return {sampleRate: audioBuffer.sampleRate, channels: channelBuffers, url: url};
	});
}
function decodeAudioFile(file) {
	return new Promise((pass, fail) => {
		var reader = new FileReader();
		reader.onload = function(e) {
			pass(reader.result);
		};
		reader.onerror = fail;
		reader.readAsArrayBuffer(file);
	}).then(buffer => decodeArrayBuffer(buffer, URL.createObjectURL(file)));
}
function getDroppedFiles(event) {
	var files = [];
	event.preventDefault();
	var dt = event.dataTransfer;
	if (dt.items) {
		// Use DataTransferItemList interface to access the file(s)
		for (var i=0; i < dt.items.length; i++) {
			if (dt.items[i].kind == "file") {
				var f = dt.items[i].getAsFile();
				files.push(f);
			}
		}
	} else {
		// Use DataTransfer interface to access the file(s)
		for (var i=0; i < dt.files.length; i++) {
			var f = dt.files[i];
			files.push(f);
		}
	}
	return files;
}

function createDropZone(dropZone, hoverClass, callback) {
	let timeout = null;
	dropZone.ondragover = event => {
		dropZone.classList.add(hoverClass);
		event.preventDefault();
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			dropZone.classList.remove(hoverClass);
		}, 300);
	};
	dropZone.ondrop = event => {
		event.preventDefault();
		var file = getDroppedFiles(event)[0];
		decodeAudioFile(file).then(obj => callback(null, obj)).catch(e => callback(e));
	};
}

