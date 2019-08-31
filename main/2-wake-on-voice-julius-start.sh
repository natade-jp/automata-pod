#!/bin/sh

# 参考
# https://qiita.com/fishkiller/items/c6c5c4dcd9bb8184e484

# 変数を取得
. ./environment.sh

# 起動していたら終了
PID=`pgrep -fo julius | wc -c` > /dev/null 2>&1
if [ ${PID} -ne 0 ] ; then
	killall julius > /dev/null
fi

# バッググラウンドで起動
export ALSADEV="plughw:${DEV_ID_REC}"
julius -C ${JULIUS_AMGMM} -nostrip -gram ${JULIUS_GRAM} -module > /dev/null &
PID=$!

# 起動するまで待つ
while :
do
	TCP=`netstat -a | grep "10500"`
	if [ ${#TCP} -ne 0 ]; then
    	break
    fi
	sleepenh 0.1 > /dev/null
done

# プロセスIDを出力
echo ${PID}
