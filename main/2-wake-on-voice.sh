#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# 変数を取得
. ./environment.sh

# 音量調整
amixer sset PCM ${VOL_MIC} -c${DEV_ID_REC} > /dev/null 2>&1

# 起動していたら終了
PID=`pgrep -fo julius | wc -c` > /dev/null 2>&1
if [ ${PID} -ne 0 ] ; then
	killall julius > /dev/null
fi

# デバイスを指定
export ALSADEV="plughw:${DEV_ID_REC}"

# バッググラウンドで起動
julius -C ${JULIUS_AMGMM} -nostrip -gram ${JULIUS_GRAM} -module > /dev/null &

# 起動するまで待つ
while :
do
	TCP=`netstat -a | grep "10500"`
	if [ ${#TCP} -ne 0 ]; then
    	break
    fi
	sleepenh 0.1 > /dev/null
done

# 1秒待つ
sleep 1

# クライアントを実行
node ./2-wake-on-voice.js

# 最後にサーバーを終了する
PID=`pgrep -fo julius | wc -c` > /dev/null 2>&1
if [ ${PID} -ne 0 ] ; then
	killall julius > /dev/null
fi
