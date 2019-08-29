// 参考
// https://cloud.google.com/speech-to-text/docs/sync-recognize#speech-sync-recognize-nodejs
// https://github.com/googleapis/nodejs-speech/issues/309
// 
// 以下で実行する
// node ./4-speech-to-text.js

// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');
const api = require('./4-speech-to-text-api.js');
const file = require('./lib/File');
const output = "./speech-to-text.txt";

// 以下から取得
// https://console.cloud.google.com/apis/dashboard
// https://console.cloud.google.com/apis/credentials
//	4-speech-to-text-api.js
//	const API = {
//		projectId: '...',
//		keyFilename: '...'
//	};
//	module.exports = API;

async function main() {

	// Creates a client
	const client = new speech.SpeechClient(api);

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
	
	file.saveTextFile(output, transcription);
}
main().catch(console.error);
