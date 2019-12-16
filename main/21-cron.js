//@ts-check
/// <reference path="./node_modules/@types/jquery/index.d.ts" />

const File = require("./lib/File.js");
const Pod = require("./Pod.js");
const env = File.getEnvironmentFile("./environment.sh");

const webscrape = require("webscrape");
// @ts-ignore
const scraper = webscrape.default();

/**
 * ネットワークにつながっていないので処理を終了させる
 */
if(!Pod.isConnectedInternet()) {
	process.exit(0);
}

/**
 * @typedef {Object} 気温データ
 * @property {string} 日付
 * @property {string} 気温
 * @property {string} 湿度
 */

/**
 * 気温情報を取得する
 * @returns {Promise<気温データ[]>}
 */
async function getKion() {
	const result = await scraper.get(env["INFO_KION_URL"]);
	/**
	 * @type {typeof $}
	 */
	const jquery = result.$;

	const day = jquery(".td_title").text().trim();
	const day_match = day.match(/(\d+)年0?(\d+)月0?(\d+)日/);
	if(!day_match) {
		return null;
	}

	/**
	 * @type {気温データ[]}
	 */
	const jsonarray_data = [];
	const table = jquery("#tbl_list").html().replace(/[\s\r\n]/g, "");
	const lines = table.split(/<\/tr><tr>/);
	for(let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const tsv_line = line.replace(/(<td[^>]+>)|(<\/td>)/g , ",").replace(/<\/tr>|<tr>|,+/g, ",");
		const tsv_lines = tsv_line.split(",");
		if(tsv_lines.length < 8) {
			continue;
		}
		const hour = tsv_lines[1];
		const temperature = tsv_lines[2];
		const humidity = tsv_lines[7];
		if(!/\d+\.\d+/.test(temperature)) {
			continue;
		}
		const day = new Date(day_match[1] + "/" + day_match[2] + "/" + day_match[3] + " " + hour + ":00");
		jsonarray_data.push({
			"日付" : day.toString(),
			"気温" : temperature,
			"湿度" : humidity
		});
	}

	return jsonarray_data;
}

/**
 * @typedef {Object} 天気データ
 * @property {string} 日付
 * @property {string} 天気
 * @property {string} 降水確率
 * @property {string} 最高気温
 * @property {string} 最低気温
 */

/**
 * 天気予報情報を取得する
 * @returns {Promise<天気データ[]>}
 */
async function getTenki() {
	const result = await scraper.get(env["INFO_TENKI_URL"]);
	/**
	 * @type {typeof $}
	 */
	const jquery = result.$;
	const table = jquery("#infotablefont").text().replace(/[\s\r\n]+/g, " ");

	// 日付 8日 9月 10火 11水 12木 13金 14土
	const hiduke = table.match(/日付 ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)/);
	// 愛知県 晴のち曇 晴時々曇 晴時々曇 曇時々晴 曇 曇 曇時々晴
	const tenki = table.match(/[都道府県] ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)/);
	// 降水確率(%) 0/0/10/10 10 20 30 40 40 30
	const kousui = table.match(/降[^ ]+ ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)/);
	// 最高(℃) 35 35 (34～38) 35 (34～39) 35 (32～36) 34 (31～37) 33 (29～35) 32 (29～35)
	const saikou = table.match(/最高[^ ]+ (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?)/);
	// 最低(℃) 25 26 (25～28) 26 (24～27) 26 (25～27) 25 (24～26) 24 (23～26) 24 (22～26)
	const saitei = table.match(/最低[^ ]+ (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?) (\d+( \([^)]+\))?)/);
	
	if(!hiduke || !tenki || !kousui || !saikou || !saitei) {
		return null;
	}

	// データの代入
	const yohou_data = [];
	for(let i = 0; i < 7; i++) {
		let kousui_text = kousui[1 + i];
		
		//スラッシュがあったら最大を選択
		if(/\//.test(kousui_text)) {
			const kousui_text_list = kousui_text.split("/");
			let kousui_max = 0;
			for(let j = 0; j < kousui_text_list.length;j++) {
				if( parseFloat(kousui_text_list[j]) > kousui_max) {
					kousui_max = parseFloat(kousui_text_list[j]);
				}
			}
			kousui_text = "" + kousui_max;
		}

		yohou_data.push({
			hiduke : hiduke[1 + i].match(/\d+/)[0],
			tenki : tenki[1 + i],
			kousui : kousui_text,
			saikou : saikou[1 + i * 2].match(/\d+/)[0],
			saitei : saitei[1 + i * 2].match(/\d+/)[0]
		});
	}

	const date = new Date();
	const date_info = new Date(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " 00:00");
	date_info.setDate(date_info.getDate() + 1);

	// 次の日があっていない。
	if(date_info.getDate() !== parseFloat(yohou_data[0].hiduke)) {
		return null;
	}

	/**
	 * @type {天気データ[]}
	 */
	const jsonarray_data = [];
	for(let i = 0; i < yohou_data.length; i++) {
		jsonarray_data.push({
			"日付" : date_info.toString(),
			"天気" : yohou_data[i].tenki,
			"降水確率" : yohou_data[i].kousui,
			"最高気温" : yohou_data[i].saikou,
			"最低気温" : yohou_data[i].saitei
		});
		date_info.setDate(date_info.getDate() + 1);
	}

	return jsonarray_data;
}

/**
 * 情報を更新する
 * @param {string} filename 
 * @param {気温データ[]|天気データ[]} jsonarray_data 
 */
async function updateJSON(filename, jsonarray_data) {
	if(jsonarray_data === null) {
		return;
	}

	/**
	 * @typedef {気温データ[]|天気データ[]}
	 */
	let data_array = [];
	
	// 以前のデータがあったらロードする
	if(File.isExist(filename)) {
		data_array = JSON.parse(File.loadTextFile(filename));
	}

	// 古いデータを削除する
	{
		const old_time = (new Date()).getTime() - (7 * 24 * 60 * 60 * 1000);
		for(let i = 0; i < data_array.length; i++) {
			const data = data_array[i];
			const time = (new Date(data["日付"])).getTime();
			if(time < old_time) {
				data_array.splice(i, 1);
				i--;
			}
		}
	}

	// 最新の情報を追加する
	{
		for(let i = 0; i < jsonarray_data.length; i++) {
			const add_data = jsonarray_data[i];
			const add_time = add_data["日付"];
			let is_hit = false;
			for(let j = 0; j < data_array.length; j++) {
				if(data_array[j]["日付"] === add_time) {
					// 新しい情報に書き換える
					data_array[j] = add_data;
					is_hit = true;
					break;
				}
			}
			if(!is_hit) {
				// 新しい情報を追加する
				data_array.push(add_data);
			}
		}
	}

	const json_text = JSON.stringify(data_array);
	File.saveTextFile(filename, json_text);
}

async function main() {
	const kiondata = await getKion();
	updateJSON(env["INFO_KION_JSON"], kiondata);
	const tenkidata = await getTenki();
	updateJSON(env["INFO_TENKI_JSON"], tenkidata);
}

async function execute() {
	try {
		await main();
	} catch (e) {
		console.error(e.stack || e);
	}
}

execute();
