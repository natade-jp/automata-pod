#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "/bin/sh ${filepath}"` ; then
	return 1
fi

# 引数を代入
INPUT_TEXT=$1

# 引数を代入
IS_BACKGROUND=$2

# 変数を取得
. ./environment.sh

# 出力
OUTPUT="alsa plughw:${DEV_ID_PLAY}"

# wavファイルを作成
echo "${INPUT_TEXT}" | open_jtalk -m "${TALK_HTS}" -x "${TALK_JDIC}" -ow "${TALK_FILE}" ${TALK_OPTION}

# SOXが再生が終わるまでまつ
while :
do
	soxid=`pgrep -fo sox`
	if test ${#soxid} = 0 ; then
		break
	fi
	sleepenh 0.2 > /dev/null
done

# 音量調整
amixer sset PCM ${VOL_SPEAKER} -c${DEV_ID_PLAY} > /dev/null 2>&1

# バックグラウンド再生かそうでないか
if [ "${IS_BACKGROUND}" = "1" ]; then

	# 再生する
	sox "${TALK_FILE}" -t ${OUTPUT} ${TALK_EFFECT} > /dev/null 2>&1 &

else
	# 再生する（再生完了まで待つ）
	sox "${TALK_FILE}" -t ${OUTPUT} ${TALK_EFFECT} > /dev/null 2>&1

	# 消去する
	rm "${TALK_FILE}"
fi
