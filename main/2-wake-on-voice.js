//@ts-check

const net = require("net");
const File = require("./lib/File.js");
const env = File.getEnvironmentFile("./environment.sh");

// 接続
const client = new net.Socket();

client.connect( 10500, "localhost", function( data ){
	console.log( "接続完了" );
});

// 閉じた場合の動作
client.on("close", function(){
	console.log( "接続終了" );
})

// エラー発生時
process.on("uncaughtException", function (err) {
    // @ts-ignore
    console.log(err.errno);
	process.exit();
});

// Ctrl + C
process.on("SIGINT", function() {
	process.exit();
});

// 受信時
let receive_buffer = "";
client.on("data", function( data ){
	const text = data.toString().split(/\r?\n/g);
	for(let i = 0 ; i < text.length; i++) {
		// 文が途切れている可能性もあるので繋げていく
		receive_buffer += text[i];
		if(/>$/.test(receive_buffer)) {
			// 最後が > なら文章として成立。
			receiveLine(receive_buffer);
			receive_buffer = "";
		}
	}
});

let is_recogout = false;
let buffer_recogout = "";
/**
 * 1ラインのデータを受信時の動作
 * @param {string} line 
 */
const receiveLine = function(line) {
	if(/<RECOGOUT>/.test(line)) {
		is_recogout = true;
	}
	if(is_recogout) {
		buffer_recogout += line + "\n";
	}
	if(/<\/RECOGOUT>/.test(line)) {
		is_recogout = false;
		onRecogout(buffer_recogout);
		buffer_recogout = "";
	}
}

/**
 * 音声認識データを取得
 * @param {string} text_recogout 
 */
const onRecogout = function(text_recogout) {

	const lines = text_recogout.split("\n");
	let score_value = 0;
	let words_value = "";
	let words_count = -2;
	for(let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const score = line.match(/SCORE="-?[0-9.]+"/);
		if(score) {
			score_value = parseFloat(score[0].replace(/[A-Z"=]/g, ""))
		}
		const word = line.match(/WORD="[^"]*"/);
		if(word) {
			words_count++;
			words_value += word[0].replace(/(WORD=")([^"]*)(")/, "$2") + " ";
		}
	}

	if(words_count >= 0) {
		onRecogoutKaiseki({
			score : score_value * -1, // 分かりにくいので正にする
			text : words_value,
			count :words_count
		});
	}

}

/**
 * 音声認識データを取得
 * @param {{score : number, count : number, text : string}} data 
 */
const onRecogoutKaiseki = function(data) {
	// 1つのワードのみの
	if(data.count === 1) {
		
		if(data.score < parseFloat(env["JULIUS_MINSCORE_1GRAM"])) {
			return;
		}
	}
	// 2ワード以上
	else if(data.score < parseFloat(env["JULIUS_MINSCORE_NGRAM"])) {
		return;
	}

	// 記号を削除
	const transcription = data.text.replace(/\[[^\]]+\]/g, "").trim();
	console.log(transcription);
	File.saveTextFile(env["JULIUS_RESULT"], transcription);

	// 終了
	process.exit();
}
