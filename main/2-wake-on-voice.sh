#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "/bin/sh ${filepath}"` ; then
	return 1
fi

# 変数を取得
. ./environment.sh

# 音量調整
amixer sset PCM ${VOL_MIC} -c${DEV_ID_REC} > /dev/null 2>&1

# 起動していたら終了
PID=`pgrep -fo julius | wc -c` > /dev/null 2>&1
if [ ${PID} -ne 0 ] ; then
	killall julius > /dev/null 2>&1
fi

# デバイスを指定
export ALSADEV="plughw:${DEV_ID_REC}"

# バッググラウンドで起動
# 手動実行する場合は特に問題がおきないが、
# 自動実行させる場合は "crontab @reboot" では実行しようとするとエラーなしで即終了する。
# そのため /etc/rc.local で起動させる。
julius -C ${JULIUS_AMGMM} -nostrip -gram ${JULIUS_GRAM} -fvad 3 -lv 1 -module > /dev/null &

# 1秒待つ
sleepenh 1.0 > /dev/null

# 起動していなかったら異常終了したと考える
PID=`pgrep -fo julius` > /dev/null 2>&1
if [ ${#PID} -eq 0 ] ; then
	exit 0
fi

# 起動するまで待つ
while :
do
	TCP=`netstat -a | grep "10500"`
	if [ ${#TCP} -ne 0 ]; then
    	break
    fi
	sleepenh 0.1 > /dev/null
done

# クライアントを実行
node ./2-wake-on-voice.js

# 最後にサーバーを終了する
PID=`pgrep -fo julius | wc -c` > /dev/null 2>&1
if [ ${PID} -ne 0 ] ; then
	killall julius > /dev/null 2>&1
fi
