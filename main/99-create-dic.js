const File = require("./lib/File.js");
const MojiJS = require("./lib/MojiJS.js");
const yomi2voca = require("./lib/yomi2voca/yomi2voca.js");
const env = File.getEnvironmentFile("./environment.sh");

const MeCab = require("mecab-async");
const mecab = new MeCab();
MeCab.command = env["MECAB_RUN"];

// 非同期処理を同期処理へ置き換える
const parseFormat = (text) => {
	return new Promise((resolve, reject) => {
		MeCab.parseFormat(text, (err, morphs) => {
			resolve(morphs);
		});
	});
}


const main = async() => {
	const kisoku = File.loadTextFile("./dict/main/memo.kisoku");
	const kisoku_lines = kisoku.split(/\r?\n/);

	
	for(let i = 0; i < kisoku_lines.length; i++) {
		const line = kisoku_lines[i].trim();
		// 文法（文）
		if(/^\$文\s*→/.test(line)) {
			
		}
		// 文法（単語集合）
		else if(/^\$[^ \t]+\s*→/.test(line)) {

		}
		// 音素
		else if(/^[^#]*$/.test(line)) {

		}
		console.log(line);
		
	}


}

main();

/*
const read = async() => {
    const foo = await parseFormat("を教えてください");
    console.log(foo);
}
read();


*/