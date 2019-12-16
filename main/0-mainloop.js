//@ts-check

const File = require("./lib/File.js");
const Pod = require("./Pod.js");
const env = File.getEnvironmentFile("./environment.sh");

/**
 * 
 * @param {string} target_text 
 * @param {{search:RegExp[], run: function(string):void}[]} pattern 
 */
const onWakeVoice = function(target_text, pattern) {
	for(let i = 0; i < pattern.length; i++) {
		let is_hit = false;
		for(let j = 0; j < pattern[i].search.length; j++) {
			const reg = pattern[i].search[j];
			if(reg.test(target_text)) {
				is_hit = true;
				break;
			}
		}
		if(is_hit) {
			pattern[i].run(target_text);
			break;
		}
	}
};

Pod.talkText("プログラムを開始します。");

while(true) {
	console.log("...");
	Pod.run("./2-wake-on-voice.sh");

	// ファイルがない場合は失敗している。
	if(!File.isExist(env["JULIUS_RESULT"])) {
		Pod.sleep(1.0);
		continue;
	}

	const julius_result = File.loadTextFile(env["JULIUS_RESULT"]);
	File.deleteFile(env["JULIUS_RESULT"]);

	console.log("recv " + julius_result);

	onWakeVoice(julius_result, [
		{
			search: [ /こんにちわ/ ], run:(test) => {Pod.talkText("はい。こんにちは");}
		},
		{
			search: [ /こんばんわ/ ], run:(test) => {Pod.talkText("はい。こんばんは");}
		},
		{
			search: [ /おはようございます/ ], run:(test) => {Pod.talkText("おはようございます");}
		},
		{
			search: [ /おやすみなさい/ ], run:(test) => {Pod.talkText("はい。おやすみなさい。");}
		},
		{
			search: [ /おつかれさまです/ ], run:(test) => {Pod.talkText("ありがとうございます。");}
		},
		{
			search: [ /すごいですね/ ], run:(test) => {Pod.talkText("ほめても、何も出ませんよ。");}
		},
		{
			search: [ /かわいいですね/ ], run:(test) => {Pod.talkText("ありがとうございます。心に受け取っておきます。");}
		},
		{
			search: [ /じこしょうかい|なまえ/ ], run:(test) => {Pod.talkText("はい。私の名前はポッド。随行支援ユニットです。");}
		},
		{
			search: [ /てんき|きおん|おんど/ ], run:(test) => {
				Pod.talkText("はい。", true);
				Pod.node("./11-get-weather.js \"" + julius_result + "\"");
			}
		},
		{
			search: [ /なんにち|なんようび/ ], run:(test) => {
				Pod.talkText("はい。", true);
				Pod.node("./10-get-time.js \"" + julius_result + "\"");
			}
		},
		{
			search: [ /しゃっとだうん/ ], run:(test) => {
				Pod.talkText("シャットダウンしてよろしいですか。");
				Pod.run("./2-wake-on-voice.sh");
				const julius_result = File.loadTextFile(env["JULIUS_RESULT"]);
				File.deleteFile(env["JULIUS_RESULT"]);
				if(/おねがい/.test(julius_result)) {
					Pod.talkText("シャットダウンします。");
					Pod.run("sudo shutdown -P now");
				}
				else {
					Pod.talkText("要求を破棄しました。");
				}
			}
		},
		{
			search: [ /りぶーと/ ], run:(test) => {
				Pod.talkText("リブートしてよろしいですか。");
				Pod.run("./2-wake-on-voice.sh");
				const julius_result = File.loadTextFile(env["JULIUS_RESULT"]);
				File.deleteFile(env["JULIUS_RESULT"]);
				if(/おねがい/.test(julius_result)) {
					Pod.talkText("リブートします。");
					Pod.run("sudo reboot");
				}
				else {
					Pod.talkText("要求を破棄しました。");
				}
			}
		},
		{
			search: [ /ぷろせす|ぷろぐらむ/ ], run:(test) => {
				Pod.talkText("プロセスを終了してよろしいですか。");
				Pod.run("./2-wake-on-voice.sh");
				const julius_result = File.loadTextFile(env["JULIUS_RESULT"]);
				File.deleteFile(env["JULIUS_RESULT"]);
				if(/おねがい/.test(julius_result)) {
					Pod.talkText("プロセスを終了します。");
					process.exit();
				}
				else {
					Pod.talkText("要求を破棄しました。");
				}
			}
		},
		{
			search: [ /いみ/ ], run:(test) => {
				Pod.talkText("どの意味を調べますか。");
				Pod.run("./3-voice-record.sh");
				if(File.isExist(env["RECOGNIZE_FILE"])) {
					Pod.talkText("はい。", true);
					Pod.run("./4-speech-to-text.sh");
					Pod.talkText("調査を開始します。", true);
					const google_result = File.loadTextFile(env["RECOGNIZE_RESULT"]);
					File.deleteFile(env["RECOGNIZE_RESULT"]);
					console.log("google " + google_result);
					Pod.node("./12-get-dictionary.js \"" + google_result + "\"");
				}
				else {
					Pod.talkText("声がよく聞こえませんでした。");
				}
			}
		},
		{
			search: [ /ぽっど|しつもん/ ], run:(test) => {
				Pod.talkText("はい。なんでしょう。");
				Pod.run("./3-voice-record.sh");
				if(File.isExist(env["RECOGNIZE_FILE"])) {
					Pod.talkText("はい。", true);
					Pod.run("./4-speech-to-text.sh");
					const google_result = File.loadTextFile(env["RECOGNIZE_RESULT"]);
					File.deleteFile(env["RECOGNIZE_RESULT"]);
					console.log("google " + google_result);
					if(/時刻|時間|何時/.test(google_result) && /今|今日|明日|明後日/.test(google_result)) {
						Pod.node("./10-get-time.js \"" + google_result + "\"");
					}
					else if(/天気|気温|温度/.test(google_result) && /今|今日|明日|明後日/.test(google_result)) {
						Pod.node("./11-get-weather.js \"" + google_result + "\"");
					}
					else if(/って何|とは|の意味/.test(google_result)) {
						Pod.talkText("調査を開始します。", true);
						Pod.node("./12-get-dictionary.js \"" + google_result + "\"");
					}
					else {
						Pod.talkText("申し訳ございません。理解できませんでした。");
					}
				}
				else {
					Pod.talkText("声がよく聞こえませんでした。");
				}
			}
		}
	]);

	Pod.sleep(0.1);
}
