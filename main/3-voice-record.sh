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

# すでにファイルがある場合は削除する
if [ -f "${RECOGNIZE_FILE}" ]; then
	rm "${RECOGNIZE_FILE}"
fi

# 入力
input_dev="alsa plughw:${DEV_ID_REC}"

# 指定した長さの音を録音する
getstats_command="sox -c 1 -t ${input_dev} -n -S stats trim 0 ${RECOGNIZE_CHECK_MUON_SEC}"
getstats="$(${getstats_command} 2>&1 > /dev/null)"

# データからピークのデシベルを取得する
pklev=`echo ${getstats} | grep -oE "Pk lev dB [-0-9.]+" | grep -oE "[-0-9.]+"`

# 録音する
silence_db=`echo "${pklev} + 5" | bc`
getvoise_command="sox -c 1 -r ${RECOGNIZE_FS} -t ${input_dev} -r ${RECOGNIZE_FS} ${RECOGNIZE_FILE} trim 0 ${RECOGNIZE_REC_MAX_SEC} silence 0 1 ${RECOGNIZE_MUON_SEC} ${silence_db}d"
getvoise="$(${getvoise_command} 2>&1 > /dev/null)"
rec_length=`echo "${getvoise}" | grep -oE "[0-9]{2}\.[0-9]{2} " | tail -n 1`

# 録音した長さ比較する
is_success=`echo "${RECOGNIZE_MUON_SEC} + 0.5 < ${rec_length}" | bc`
if [ ${is_success} = 0 ]; then
	echo "失敗"
	rm "${RECOGNIZE_FILE}"
else
	echo "録音成功"
fi
