//@ts-check

const Pod = require("./Pod.js");
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

const speakJikoku = function() {
	const hour = date.getHours();
	const minutes = date.getMinutes();
	let ji = "";
	if(hour < 12) {
		ji = "午前" + hour;
	}
	else {
		ji = "午後" + (hour - 12);
	}

	const text = ji + "時" + minutes + "分";
	Pod.talkText("只今の時刻は、" + text + "です。");
};

const speakHiduke = function() {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const youbi = [ "日", "月", "火", "水", "木", "金", "土" ][date.getDay()];
	const text = month + "月" + day + "日 " + youbi + "曜日";
	Pod.talkText(itu + "は、" + text + "です。");
};

if(/いま|今/.test(input_text) && /なんじ|何時/.test(input_text)) {
	speakJikoku();
}
else {
	speakHiduke();
	if(/いま|今/.test(input_text) || /きょう|今日/.test(input_text)) {
		speakJikoku();
	}
}
