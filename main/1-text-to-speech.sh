#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname ${0}`

# 自分を含めて3つ起動しているのでやめる
filepath="${0}"
if [ 3 -eq `pgrep -cf "/bin/sh ${filepath}"` ] ; then
	return 1
fi

# 自分を含めて2つ起動しているので、プログラムが終わるまで待つ
if [ 2 -eq `pgrep -cf "/bin/sh ${filepath}"` ] ; then
	while :
	do
		if [ 1 -eq `pgrep -cf "/bin/sh ${filepath}"` ] ; then
			break
		fi
		sleepenh 0.2 > /dev/null
	done
fi

# 引数を代入
INPUT_TEXT="${1}"

# 変数を取得
. ./environment.sh

# 出力
OUTPUT="alsa plughw:${DEV_ID_PLAY}"

# 音量調整
amixer sset PCM ${VOL_SPEAKER} -c${DEV_ID_PLAY} > /dev/null 2>&1

# ヘッダを除去しつつ、パイプで作成した音声データをリアルタイムで再生する
echo "${INPUT_TEXT}" | open_jtalk -m "${TALK_HTS}" -x "${TALK_JDIC}" -ow /dev/stdout ${TALK_OPTION} | dd skip=44 2>&1 | sox -r 48000 -c 1 -t s16 - -t ${OUTPUT} ${TALK_EFFECT} > /dev/null 2>&1
