/*!
 * Pod.js
 */

const File = require("./lib/File.js");
const child_process = require("child_process");

/**
 * ファイルクラス
 */
class Pod {

	/**
	 * @param {string} text 
	 * @returns {string}
	 */
	static run(text) {
		let ret;
		try {
			ret = child_process.execSync(text);
		}
		catch(e) {
			return e.output.toString();
		}
		return ret.toString();
	}

	/**
	 * @param {number} time 
	 * @returns {string}
	 */
	static sleep(time) {
		return Pod.run("sleepenh " + time);
	}

	/**
	 * @param {string} text 
	 * @returns {string}
	 */
	static talkText(text) {
		console.log("talk " + text);
		return Pod.run("./1-text-to-speech.sh \"" + text + "\"");
	}


}

module.exports = Pod;
