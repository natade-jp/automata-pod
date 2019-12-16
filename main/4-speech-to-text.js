//@ts-check

// 参考
// https://cloud.google.com/speech-to-text/docs/sync-recognize#speech-sync-recognize-nodejs
// https://github.com/googleapis/nodejs-speech/issues/309
// 
// 以下で実行する
// node ./4-speech-to-text.js

// Imports the Google Cloud client library
const fs = require("fs");
const Speech = require("@google-cloud/speech");
const File = require("./lib/File.js");

const env = File.getEnvironmentFile("./environment.sh");
const json_data = JSON.parse(File.loadTextFile(env["RECOGNIZE_API_KEY"]));
const API_KEY = {
    projectId: json_data["project_id"],
    keyFilename: env["RECOGNIZE_API_KEY"]
};

async function main() {

	// Creates a client
	const client = new Speech.SpeechClient(API_KEY);

	const filename = env["RECOGNIZE_FILE"];
	const encoding = env["RECOGNIZE_ENCODING"];
	const sampleRateHertz = env["RECOGNIZE_FS"];
	const languageCode = env["RECOGNIZE_LANG"];

	const config = {
		encoding: encoding,
		sampleRateHertz: sampleRateHertz,
		languageCode: languageCode
	};
	const audio = {
		content: fs.readFileSync(filename).toString("base64")
	};

	const request = {
		config: config,
		audio: audio
	};

	// Detects speech in the audio file
	const [response] = await client.recognize(request);
	const transcription = response.results
		.map(result => result.alternatives[0].transcript)
		.join("\n");
	
	console.log(transcription);
	File.deleteFile(env["RECOGNIZE_FILE"]);
	File.saveTextFile(env["RECOGNIZE_RESULT"], transcription);
}
main().catch(console.error);
