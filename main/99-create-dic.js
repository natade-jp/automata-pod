//@ts-check

const MojiJS = require("mojijs");
const yomi2voca = require("./lib/yomi2voca/yomi2voca.js");
const File = require("./lib/File.js");
const env = File.getEnvironmentFile("./environment.sh");

const MeCab = require("mecab-async");
const mecab = new MeCab();
// @ts-ignore
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
 * MeCabを使用してテキストを解析する
 * 非同期処理を同期処理へ置き換える
 * @param {string} text 
 * @returns {Promise<*>} 読み
 */
const parseFormat = (text) => {
	return new Promise((resolve, reject) => {
		// @ts-ignore
		MeCab.parseFormat(text,(err, morphs) => {
			let reading = ""
			for(let i = 0; i < morphs.length; i++) {
				const morph = morphs[i];
				reading += morph.reading
			}
			resolve(reading);
		});
	});
}

const TARGET_FILE = "./dict/main";
const INPUT_FILE_KISOKU = TARGET_FILE + ".kisoku";
const OUTPUT_FILE_GEAMMER = TARGET_FILE + ".grammar";
const OUTPUT_FILE_VOCA = TARGET_FILE + ".voca";

const main = async() => {
	const kisoku = File.loadTextFile(INPUT_FILE_KISOKU);
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

	/**
	 * @param {Object<string, {hiragana : string, voca : string, romaji : string, yomi : string, is_notvar : boolean}>}
	 */
	const yomi_hash = {};

	/**
	 * @param {string} text 
	 * @param {string} [def_reading]
	 * @returns {Promise<*>}
	 */
	const getYomiData = async(text, def_reading) => {
		let word = text;
		let is_notvar = /^[^$]/.test(word);
		if(!is_notvar) {
			word = word.replace(/\$/g, "");
		}
		// すでにデータがあるならハッシュを使う
		if(!yomi_hash[word]) {
			let reading = null;
			if(def_reading !== undefined) {
				reading = def_reading;
			}
			else {
				reading = await parseFormat(word);
			}
			const hiragana = MojiJS.toHiragana(reading).replace(/[？！。、]/g , "");
			const voca = yomi2voca(hiragana);
			const romaji = MojiJS.toRomajiFromHiragana(hiragana).toUpperCase();
			const yomi = voca.replace(/ /g , "").toUpperCase();
			yomi_hash[word] = {
				hiragana : hiragana,
				voca : voca,
				romaji : romaji,
				yomi : yomi,
				is_notvar : false
			}
		}
		// 変数以外に利用されている（読みとして）
		if(def_reading === undefined) {
			yomi_hash[word].is_notvar = yomi_hash[word].is_notvar || is_notvar;
		}
		const ret = (is_notvar ? "" : "VAR_") + yomi_hash[word].yomi;
		return ret;
	}
	
	// 読みデータを整形
	// 読みデータがある場合は読みデータを優先させる。
	{
		for(const key in load_yomi) {
			getYomiData(load_yomi[key].word, load_yomi[key].yomi);
		}
	}

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
				grammar_line = await getYomiData(bunpou.name) + ":"
			}
			// 右の部分を作成
			for(const word_key in bunpou.automaton) {
				grammar_line += " " + await getYomiData(bunpou.automaton[word_key]);
			}
			if(is_bun) {
				grammar_line += " NS_E";
			}
			grammar.push(grammar_line);
		}

		// ワードを作成
		for(const key in load_tango) {
			const tango_list = load_tango[key];
			for(const word_key in tango_list.word_list) {
				let grammar_line = await getYomiData(tango_list.name) + ":";
				grammar_line += " " + await getYomiData(tango_list.word_list[word_key]);
				grammar.push(grammar_line);
			}
		}

		File.saveTextFile(OUTPUT_FILE_GEAMMER, grammar.join("\n") + "\n");
	}

	{
		const voca = [];
		const chohuku = {};
		for(const key in yomi_hash) {
			const data = yomi_hash[key];
			if(!data.is_notvar) {
				continue;
			}
			if(chohuku[data.yomi]) {
				continue;
			}
			voca.push("% " + data.yomi);
			voca.push(data.hiragana + " " + data.voca);
			chohuku[data.yomi] = true;
		}
		voca.push("% NS_B");
		voca.push("[s] silB");
		voca.push("% NS_E");
		voca.push("[/s] silE");

		File.saveTextFile(OUTPUT_FILE_VOCA, voca.join("\n") + "\n");
	}

	// 辞書ファイルを作成する
	{
		require("child_process").execSync("mkdfa.pl " + TARGET_FILE);
	}
}

main();

