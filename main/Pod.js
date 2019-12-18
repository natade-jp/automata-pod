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
	 * @returns {string|null}
	 */
	static getIpAddress() {
		/*

		以下のような情報を取得できる

		1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
			link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
			inet 127.0.0.1/8 scope host lo
			valid_lft forever preferred_lft forever
			inet6 ::1/128 scope host
			valid_lft forever preferred_lft forever
		2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast state DOWN group default qlen 1000
			link/ether aa:aa:aa:aa:aa:aa brd ff:ff:ff:ff:ff:ff
		3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
			link/ether aa:aa:aa:aa:aa:aa brd ff:ff:ff:ff:ff:ff
			inet 192.168.11.202/24 brd 192.168.11.255 scope global noprefixroute wlan0
			valid_lft forever preferred_lft forever
			inet6 XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:165a/64 scope global dynamic mngtmpaddr noprefixroute
			valid_lft 14177sec preferred_lft 14177sec
			inet6 XXXX::XXXX:XXXX:XXXX:XXXX/64 scope link
			valid_lft forever preferred_lft forever

		*/

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
		return ip4;
	}

	/**
	 * @returns {boolean}
	 */
	static isConnectedInternet() {
		return Pod.getIpAddress() !== null;
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
