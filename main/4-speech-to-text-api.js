const File = require('./lib/File');
const path = "./GOOGLE_APPLICATION_CREDENTIALS.json";

// 以下から取得
// https://console.cloud.google.com/apis/dashboard
// https://console.cloud.google.com/apis/credentials

const json_data = JSON.parse(File.loadTextFile(path));

const API_KEY = {
    projectId: json_data["project_id"],
    keyFilename: path
};

module.exports = API_KEY;
