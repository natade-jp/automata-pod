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
	Pod.run("./2-wake-on-voice.sh");

	const julius_result = File.loadTextFile(env["JULIUS_RESULT"]);
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
			search: [ /てんき|きおん|おんど/ ], run:(test) => {
				Pod.talkText("はい。");
				Pod.node("./11-get-weather.js \"" + julius_result + "\"");
			}
		},
		{
			search: [ /なんにち|なんようび/ ], run:(test) => {
				Pod.talkText("はい。");
				Pod.node("./10-get-time.js \"" + julius_result + "\"");
			}
		},
		{
			search: [ /しゃっとだうん/ ], run:(test) => {
				Pod.talkText("シャットダウンします。");
				Pod.run("sudo shutdown -r now");
			}
		},
		{
			search: [ /りぶーと/ ], run:(test) => {
//				Pod.talkText("リブートします。");
//				Pod.run("sudo reboot");
			}
		},
		{
			search: [ /いみ/ ], run:(test) => {
				Pod.talkText("どの意味を調べますか。");
			}
		},
		{
			search: [ /ぽっど|しつもん/ ], run:(test) => {
				Pod.talkText("はい。なんでしょう。");
			}
		}
	]);

	Pod.sleep(0.1);
}
