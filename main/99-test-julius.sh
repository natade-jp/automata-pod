#!/bin/sh

# 変数を取得
. ./environment.sh

# 起動していたら終了
PID=`pgrep -fo julius | wc -c` > /dev/null 2>&1
if [ ${PID} -ne 0 ] ; then
	killall julius > /dev/null
fi

# 音量調整
amixer sset PCM ${VOL_MIC} -c${DEV_ID_REC} > /dev/null 2>&1

# デバイスを指定
export ALSADEV="plughw:${DEV_ID_REC}"

# julius -C ${JULIUS_MAIN} -C ${JULIUS_AMGMM} -nostrip
julius -C ${JULIUS_AMGMM} -nostrip -gram ${JULIUS_GRAM} -fvad 3 -lv 1
