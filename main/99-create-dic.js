const File = require("./lib/File.js");
const MojiJS = require("./lib/MojiJS.js");
const yomi2voca = require("./lib/yomi2voca/yomi2voca.js");
const env = File.getEnvironmentFile("./environment.sh");

const MeCab = require("mecab-async");
const mecab = new MeCab();
MeCab.command = env["MECAB_RUN"];

/**
 * MeCab による解析データ
 * @typedef {Object} Morphs
 * @property {string} kanji ください
 * @property {string} lexical 動詞
 * @property {string} compound 非自立
 * @property {string} compound2 *
 * @property {string} compound3 *
 * @property {string} conjugation 五段・ラ行特殊
 * @property {string} inflection 命令ｉ
 * @property {string} original くださる
 * @property {string} reading クダサイ
 * @property {string} pronunciation クダサイ
 * @property {string} kanji ください
 */

/**
 * parseFormat の結果から読みを取得する
 * @param {Morphs[]} morphs 
 * @param {{hiragana : string, romaji : string}}
 */
const getYomiData = function(morphs) {
	let reading = ""
	for(let i = 0; i < morphs.length; i++) {
		const morph = morphs[i];
		reading += morph.reading
	}
	return {
		hiragana : MojiJS.toHiragana(reading),
		romaji : MojiJS.toRomajiFromKatakana(reading).toUpperCase()
	};
}

/**
 * Mecabを使用してテキストを解析する
 * 非同期処理を同期処理へ置き換える
 * @param {string} text 
 * @returns {*} 読み
 */
const parseFormat = (text) => {
	return new Promise((resolve, reject) => {
		MeCab.parseFormat(text, (err, morphs) => {
			resolve(getYomiData(morphs));
		});
	});
}


const main = async() => {
	const kisoku = File.loadTextFile("./dict/main/memo.kisoku");
	const kisoku_lines = kisoku.split(/\r?\n/);

	const load_bunpou = [];
	const load_tango = [];
	const load_yomi = [];
	
	// テキストデータから値を抽出
	{
		for(let i = 0; i < kisoku_lines.length; i++) {
			const line = kisoku_lines[i].trim();
			if(line.length === 0) {
				continue;
			}
			// 文法（文）
			// 例 $文 → $日付 $の $天気 $聞く
			if(/^\$文\s*→/.test(line)) {
				const data = line.replace(/.*→/, "").trim();
				tango_list = data.split(/\s+/);
				load_bunpou.push(tango_list);
			}
			// 文法（単語集合）
			// 例 $日付 → 今日 | 明日 | 明後日
			else if(/^\$[^ \t]+\s*→/.test(line)) {
				const name = line.replace(/\s*→.*/, "").trim();
				const data = line.replace(/.*→/, "").trim();
				word_list = data.split(/\s*\|\s*/);
				load_tango.push(
					{
						name : name,
						word_list : word_list
					}
				);
			}
			// よみ
			// 例 こんにちは こんにちわ
			else if(/^[^#]+[ \t]+[^#]+$/.test(line)) {
				const word = line.replace(/[ \t]+[^#]+/, "").trim();
				const yomi_text = line.replace(/[^#]+[ \t]+/, "").trim();
				load_yomi.push(
					{
						word : word,
						yomi : yomi_text
					}
				);
			}
		}
	}

	// console.log(load_bunpou);
	// console.log(load_tango);
	// console.log(load_yomi);

	// $日付 がついているデータを変数名に変更
	// VAR_AAA のような感じにする
	{
		for(const key in load_bunpou) {
			const word_list = load_bunpou[key];
			for(const word_key in word_list) {
				const word = word_list[word_key].replace(/\$/g, "");
				const yomi = await parseFormat(word);
				console.log(yomi);
			}
		}
	}


	
}

main();

