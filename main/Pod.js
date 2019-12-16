// @ts-check
/**
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
	 * @param {boolean} [is_background=false]
	 * @returns {string}
	 */
	static run(text, is_background) {
		let ret;
		let is_background_ = is_background ? 1 : 0;
		try {
			if(!is_background_) {
				ret = child_process.execSync(text);
			}
			else {
				ret = child_process.exec(text);
			}
		}
		catch(e) {
			return e.output.toString();
		}
		return ret.toString();
	}

	/**
	 * @param {string} text 
	 * @returns {string}
	 */
	static node(text) {
		return Pod.run("node " + text);
	}

	/**
	 * @param {number} time 
	 * @returns {string}
	 */
	static sleep(time) {
		return Pod.run("sleepenh " + time);
	}

	/**
	 * @returns {boolean}
	 */
	static isConnectedInternet() {
		const ip_data = Pod.run("ip address");
		const ip_data_line = ip_data.split("\n");
		let ip4 = null;
		for(let i = 0; i < ip_data_line.length; i++) {
			const line = ip_data_line[i];
			if(/ inet /.test(line)) {
				const m = line.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/);
				if(m) {
					const get_ip4 = m[0];
					if(get_ip4 !== "127.0.0.1") {
						ip4 = get_ip4;
						break;
					}
				}
			}
		}
		return ip4 !== null;
	}

	/**
	 * @param {string} text 
	 * @param {boolean} [is_background=false]
	 * @returns {string}
	 */
	static talkText(text, is_background) {
		let is_background_ = is_background ? true : false;
		console.log("talk " + text);
		return Pod.run("./1-text-to-speech.sh \"" + text + "\"", is_background_);
	}

}

module.exports = Pod;
