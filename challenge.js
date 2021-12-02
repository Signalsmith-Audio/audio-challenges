function Challenge(title) {
	this.title = title;
};
Challenge.register = function(challenge) {
	alert("The host web-page should override Challenge.register() to display a challenge.");
};
