﻿//@ts-check

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
	
	/**
	 * @type {import("./21-cron.js").気温データ[]}
	 */
	let data_array = JSON.parse(File.loadTextFile(env["INFO_KION_JSON"]));
	
	// 今の時刻に最も近いデータを取得
	let min_delta = Number.POSITIVE_INFINITY;
	let target = null;
	for(let i = 0; i < data_array.length; i++) {
		const data = data_array[i];
		const day = new Date(data["日付"]);
		const delta = Math.abs(date.getTime() - day.getTime());
		if(delta < min_delta) {
			target = data;
			min_delta = delta;
		}
	}

	if(target) {
		const text = "只今のがい気温は、" + target["気温"] + "度です。";
		Pod.talkText(text);
	}
}
else {
	
	const date_day = new Date(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " 00:00");

	/**
	 * @type {import("./21-cron.js").天気データ[]}
	 */
	let data_array = JSON.parse(File.loadTextFile(env["INFO_TENKI_JSON"]));
	
	// 今の時刻に最も近いデータを取得
	let min_delta = Number.POSITIVE_INFINITY;
	let target = null;
	for(let i = 0; i < data_array.length; i++) {
		const data = data_array[i];
		const day = new Date(data["日付"]);
		const delta = Math.abs(date.getTime() - day.getTime());
		if(delta < min_delta) {
			target = data;
			min_delta = delta;
		}
	}

	if(target) {
		let text = itu + "の天気は" + target["天気"] + "、降水確率は" + target["降水確率"] + "%、最低気温は" + target["最低気温"] + "度、最高気温は" + target["最高気温"] + "度になります。";
		text = text.replace(/一時雨/g, "一時あめ")
		Pod.talkText(text);
	}
}
