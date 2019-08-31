const net = require('net');

// 接続
const client = new net.Socket();
client.connect( 10500, 'localhost', function( data ){
	console.log( "接続完了" );
});

// 受信時
client.on('data', function( data ){
	const text = data.toString().split(/\r?\n/g);
	for(let i = 0 ; i < text.length; i++) {
		const line = text[i];
		if(/WORD="/.test(line)) {
			const word = line.replace(/.*WORD="([^"]*).*/, "$1");
			const cm = line.replace(/.*CM="([^"]*).*/, "$1");
			if(/ポッド/.test(word)) {
				console.log( "OK" );
				process.exit();
			}
		}
	}
});

// 閉じた場合の動作
client.on('close', function(){
	console.log( "接続終了" );
})

// エラー発生時
process.on('uncaughtException', function (err) {
    console.log(err.errno);
});

// Ctrl + C
process.on('SIGINT', function() {
	require('child_process').execSync('killall julius');
	process.exit();
});
