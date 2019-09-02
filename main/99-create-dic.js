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
	const hiragana = MojiJS.toHiragana(reading).replace(/[？！。、]/g , "");
	const voca = yomi2voca(hiragana);
	return {
		hiragana : hiragana,
		voca : voca,
		romaji : MojiJS.toRomajiFromHiragana(hiragana).toUpperCase(),
		yomi : voca.replace(/ /g , "").toUpperCase()
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
	
	// 文法規則とYOMIが記載されたテキストから値を抽出
	{
		for(let i = 0; i < kisoku_lines.length; i++) {
			const line = kisoku_lines[i].trim();
			if(line.length === 0) {
				continue;
			}

			// 文法（オートマトン）データ
			// 例 $文 → $日付 $の $天気 $聞く
			// $文 と書いてある場合は、終わりと終了がある
			// $は変数を表す
			if( /^\$文\s*→/.test(line) || /$[^ |]+\s*→\s*([^ |]+ +){2,}/.test(line) ) {
				const name = line.replace(/\s*→.*/, "").trim();
				const data = line.replace(/.*→/, "").trim();
				const automaton = data.split(/\s+/);
				load_bunpou.push(
					{
						name : name,
						automaton : automaton
					}
				);
			}

			// 文法（単語集合）データ
			// 例 $日付 → 今日 | 明日 | 明後日
			// 1つの変数に対して、読み方を記載する。
			else if(/^\$[^ \t]+\s*→/.test(line)) {
				const name = line.replace(/\s*→.*/, "").trim();
				const data = line.replace(/.*→/, "").trim();
				const word_list = data.split(/\s*\|\s*/);
				load_tango.push(
					{
						name : name,
						word_list : word_list
					}
				);
			}

			// 読みデータ(*.yomi)
			// 例 こんにちは こんにちわ
			// MeCabでは変換できない場合に利用する
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

	// 読みデータを整形
	// 読みデータがある場合は読みデータを優先させる。
	const yomi_hash = {};
	{
		for(const key in load_yomi) {
			const hash_key = load_yomi[key].word;
			const hiragana = MojiJS.toHiragana(load_yomi[key].yomi).replace(/[？！。、]/g , "");
			const voca = yomi2voca(hiragana);
			yomi_hash[hash_key] = {
				hiragana : hiragana,
				voca : voca,
				romaji : MojiJS.toRomajiFromHiragana(hiragana).toUpperCase(),
				yomi : voca.replace(/ /g , "").toUpperCase()
			}
		}
	}

	// console.log(load_bunpou);
	// console.log(load_tango);
	// console.log(load_yomi);

	// $日付 がついているデータを変数名に変更
	// VAR_AAA のような感じにする
	{
		// grammarファイル（Julian文法ファイル）を作成する
		// S : NS_B HELLO NS_E
		// HELLO : OHAYOU
		// HELLO : KONNICHIWA

		const grammar = [];

		// オートマトンによる文法を作成
		for(const key in load_bunpou) {
			const bunpou = load_bunpou[key];
			const is_bun = bunpou.name === "$文";
			let grammar_line = null;

			// 左の部分
			if(is_bun) {
				// 文の場合は終端が必要
				grammar_line = "S: NS_B";
			}
			else {
				const word = bunpou.name.replace(/\$/g, "");
				if(!yomi_hash[word]) {
					yomi_hash[word] = await parseFormat(word);
				}
				grammar_line = "VAR_" + yomi_hash[word].yomi + ":"
			}

			// 右の部分を作成
			for(const word_key in bunpou.automaton) {
				let is_var = false;
				let word = bunpou.automaton[word_key];
				if(/^\$/.test(word)) {
					is_var = true;
					word = word.replace(/\$/g, "");
				}
				let parse_name = null;
				// すでにデータがあるならハッシュを使う
				if(!yomi_hash[word]) {
					yomi_hash[word] = await parseFormat(word);
				}
				parse_name = yomi_hash[word];
				grammar_line += (is_var ? " VAR_" : " ") + parse_name.yomi;
			}
			
			if(is_bun) {
				grammar_line += " NS_E";
			}
			
			grammar.push(grammar_line);
		}

		// ワードを作成
		for(const key in load_tango) {
			const tango_list = load_tango[key];
			const word = tango_list.name.replace(/\$/g, "");
			let parse_name = null;
			// すでにデータがあるならハッシュを使う
			if(!yomi_hash[word]) {
				yomi_hash[word] = await parseFormat(word);
			}
			parse_name = yomi_hash[word];
			let grammar_line = "VAR_" + parse_name.yomi + ":";
			for(const word_key in tango_list.word_list) {
				const word = tango_list.word_list[word_key];
				if(!yomi_hash[word]) {
					yomi_hash[word] = await parseFormat(word);
				}
				const yomi = yomi_hash[word];
				grammar_line += " " + yomi.yomi;
			}
			grammar.push(grammar_line);
		}

		console.log(grammar.join("\n"));

	}


	
}

main();

