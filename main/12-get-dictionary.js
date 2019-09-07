//@ts-check
/// <reference path="./node_modules/@types/jquery/index.d.ts" />

const File = require("./lib/File.js");
const Pod = require("./Pod.js");
const env = File.getEnvironmentFile("./environment.sh");

const webscrape = require("webscrape");
// @ts-ignore
const scraper = webscrape.default();

let input_text = "";
if(process.argv.length && process.argv.length >= 3) {
	input_text = process.argv[2];
}

{
	let test = null;
	test = input_text.match(/([^っ]+)って/);
	if(test) {
		input_text = test[1];
	}
	test = input_text.match(/([^と]+)とは/);
	if(test) {
		input_text = test[1];
	}
	test = input_text.match(/([^の]+)の意味/);
	if(test) {
		input_text = test[1];
	}
	test = input_text.match(/([^に]+)について/);
	if(test) {
		input_text = test[1];
	}
	test = input_text.match(/([^を]+)を/);
	if(test) {
		input_text = test[1];
	}
}

async function main() {
	
	let result;

	try {
		result = await scraper.get("https://ja.wikipedia.org/wiki/" + encodeURIComponent(input_text));
	}
	catch(e) {
		Pod.talkText(input_text + "の意味は分かりませんでした。");
		return;
	}

	/**
	 * @type {typeof $}
	 */
	const jquery = result.$;

	let text = jquery("#bodyContent .mw-parser-output > p").text();
	let search_type = 0;

	if(!/。/.test(text)) {
		text = jquery("#bodyContent").text();
		search_type = 1;
	}

	// 最初の説明を取得
	{
		let is_hit = false;
		while(true) {
			let test;
			if(search_type === 0) {
				test = text.match(/[^。]+。/);
				if(test) {
					text = test[0];
					is_hit = true;
					break;
				}
			}
			else {
				test = text.match(new RegExp(input_text + "[^「」]]{0,32}(（[^）]+）|\\([^)]+\\))?と?は[^。]+。"));
				if(test) {
					text = test[0];
					is_hit = true;
					break;
				}
				test = text.match(/\s[\u0020-\u007E\u3041-\u3096\u30A1-\u30FA\u3400-\u9FFF\uD840-\uDFFF\uF900-\uFAFF]{0,32}(（[^）]+）|\([^)]+\))と?は[^。]+。/);
				if(test) {
					text = test[0];
					is_hit = true;
					break;
				}
			}
			break;
		}
		if(!is_hit) {
			Pod.talkText("要約に失敗しました。");
			return;
		}
	}

	// 整形
	{
		text = text.replace(/(（[^）]+）)|\([^)]+\)|\[[^\]]*\]|\s/g, "");
	}

	// 口調の変更
	{
		text = text.replace(/・/, "");
		text = text.replace(/である。/, "です。");
		text = text.replace(/([^する])。/, "$1です。");
	}

	Pod.talkText(text);

}

async function execute() {
	try {
		await main();
	} catch (e) {
		console.error(e.stack || e);
	}
}

execute();
