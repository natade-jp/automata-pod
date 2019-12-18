//@ts-check

const Pod = require("./Pod.js");

let ip4 = Pod.getIpAddress();
if(ip4 === null) {
   Pod.talkText("現在、外部ネットワークへ接続を行っておらず、IPアドレスは付与されておりません。");
}
else {
   Pod.talkText("私のIPアドレスは、" + ip4.replace(/\./g, " ") + "です。");
}

