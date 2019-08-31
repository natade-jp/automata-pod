#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# 引数を代入
INPUT_TEXT=$1

# 変数を取得
. ./environment.sh

# 出力
OUTPUT="alsa plughw:${DEV_ID_PLAY}"

# wavファイルを作成
echo "${INPUT_TEXT}" | open_jtalk -m "${TALK_HTS}" -x "${TALK_JDIC}" -ow "${TALK_FILE}"

# 音量調整
amixer sset PCM ${VOL_SPEAKER} -c${DEV_ID_PLAY} > /dev/null 2>&1

# 再生する
sox "${TALK_FILE}" -t ${OUTPUT} ${TALK_EFFECT} > /dev/null 2>&1

# 消去する
rm ${TALK_FILE}
