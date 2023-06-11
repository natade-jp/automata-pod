//@ts-check

const File = require("./lib/File.js");
const Pod = require("./Pod.js");
const env = File.getEnvironmentFile("./environment.sh");

let input_text = "";
if(process.argv.length && process.argv.length >= 3) {
	input_text = process.argv[2];
}

const date = new Date();

let itu = "今日";
if(/いま|今/.test(input_text) && /きょう|今日/.test(input_text)) {
	itu = "今日";
}
else if(/あした|明日/.test(input_text)) {
	date.setDate(date.getDate() + 1);
	itu = "明日";
}
else if(/あさって|明後日/.test(input_text)) {
	date.setDate(date.getDate() + 2);
	itu = "あさって";
}
else if(/きのう|昨日/.test(input_text)) {
	date.setDate(date.getDate() - 1);
	itu = "昨日";
}

if(/いま|今/.test(input_text) && /きおん|おんど|気温|温度/.test(input_text)) {
	
	Pod.talkText("すみません。今のがい気温は分かりません。");
}
else {
	
	Pod.talkText("すみません。天気は分かりません。");
}
