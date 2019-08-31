// 参考
// https://cloud.google.com/speech-to-text/docs/sync-recognize#speech-sync-recognize-nodejs
// https://github.com/googleapis/nodejs-speech/issues/309
// 
// 以下で実行する
// node ./4-speech-to-text.js

// Imports the Google Cloud client library
const fs = require('fs');
const Speech = require('@google-cloud/speech');
const Key = require('./4-speech-to-text-api.js');
const File = require('./lib/File');
const output = "./speech-to-text.txt";

async function main() {

	// Creates a client
	const client = new Speech.SpeechClient(Key);

	const filename = './voice-record.flac';
	const encoding = 'FLAC';
	const sampleRateHertz = 16000;
	const languageCode = 'ja-JP';

	const config = {
		encoding: encoding,
		sampleRateHertz: sampleRateHertz,
		languageCode: languageCode
	};
	const audio = {
		content: fs.readFileSync(filename).toString('base64')
	};

	const request = {
		config: config,
		audio: audio
	};

	// Detects speech in the audio file
	const [response] = await client.recognize(request);
	const transcription = response.results
		.map(result => result.alternatives[0].transcript)
		.join('\n');
	
	File.saveTextFile(output, transcription);
}
main().catch(console.error);
