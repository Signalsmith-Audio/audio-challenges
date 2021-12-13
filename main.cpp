#include "wav.h"

#include <iostream>
#include <string>
#include <cmath>

#define LOG_EXPR(expr) std::cout << #expr " = " << (expr) << "\n";

int main(int argc, const char **argv) {
	// Make sure we have all the arguments we need
	if (argc < 4) {
		std::cerr << "Usage: " << argv[0] << " [task] input.wav output.wav\n";
		return 1;
	}
	std::string task = argv[1], inputFile = argv[2], outputFile = argv[3];

	// Read the input WAV
	Wav wav(inputFile);
	if (!wav.result) {
		std::cerr << "Error reading " << inputFile << ": " << wav.result.reason << "\n";
		return 1;
	}

	// Run the appropriate task
	if (task == "fixed-gain") {
		for (int i = 0; i < wav.length(); ++i) {
			for (int c = 0; c < wav.channels; ++c) {
				wav.at(c, i) = wav.at(c, i)*0.25;
			}
		}
	} else {
		std::cerr << "invalid task\n";
		return 1;
	}

	// Write the output file
	if (!wav.write(outputFile)) {
		std::cerr << "Error writing " << outputFile << ": " << wav.result.reason << "\n";
		return 1;
	}
	
	std::cout << task << ": " << inputFile << " -> " << outputFile << "\n";
}
