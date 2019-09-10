#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname ${0}`
MY_PID="$$"

# 自分を含めて2つ起動しているのでやめる
filepath="${0}"
if [ 2 -eq `pgrep -cf "/bin/sh ${filepath}"` ] ; then
	return 1
fi

# 合成中
isMake() {
	local FILE_NAME=$1
	local HIT=`pgrep -a open_jtalk | grep -o "${FILE_NAME}"`
	if [ ${#HIT} -ne 0 ] ; then
		return 1
	fi
	# $? で参照可能
	return 0
}

# 再生中
isPlay() {
	local FILE_NAME=$1
	local HIT=`pgrep -a sox | grep -o "${FILE_NAME}"`
	if [ ${#HIT} -ne 0 ] ; then
		return 1
	fi
	# $? で参照可能
	return 0
}

# 引数を代入
INPUT_TEXT="${1}"

# 変数を取得
. ./environment.sh

# 出力
OUTPUT="alsa plughw:${DEV_ID_PLAY}"

# リスト
INPUT_TEXT=`echo "${INPUT_TEXT}" | sed -E "s/^\s+|\s+$//g" | grep -oE "[^、。「」]+"`

# 長さを調べる
INPUT_TEXT_LENGTH=0
for LINE_I in ${INPUT_TEXT}
do
	INPUT_TEXT_LENGTH=`expr ${INPUT_TEXT_LENGTH} + 1`
done

# 指定した行を取り出す関数
INPUT_TEXT_ARRAY() {
	local TARGET_LINE=$1
	local LEN=0
	for LINE_I in ${INPUT_TEXT}
	do
		if [ ${TARGET_LINE} -eq ${LEN} ] ; then
			echo ${LINE_I}
			break
		fi
		LEN=`expr ${LEN} + 1`
	done
	# $? で参照可能
	return 0
}

# 音量調整
amixer sset PCM ${VOL_SPEAKER} -c${DEV_ID_PLAY} > /dev/null 2>&1

MAKE_ID=0 #作成中のデータ
PLAY_ID=0 #再生中のデータ
while :
do

	# open_jtalk で作成するデータがある場合は作成する
	if [ ${MAKE_ID} -lt ${INPUT_TEXT_LENGTH} ] ; then
		# バッググラウンドで作成中なら、まだ作成しない（1つ前のファイルを調べる）
		MAKE_FILE_NAME="${TALK_FILE}.${MY_PID}.`expr ${MAKE_ID} - 1`.wav"
		isMake "${MAKE_FILE_NAME}"
		if [ $? -eq 0 ] ; then
			# ファイルを作成していないので作成できる
			MAKE_FILE_NAME="${TALK_FILE}.${MY_PID}.${MAKE_ID}.wav"
			echo `INPUT_TEXT_ARRAY ${MAKE_ID}` | open_jtalk -m "${TALK_HTS}" -x "${TALK_JDIC}" -ow "${MAKE_FILE_NAME}" ${TALK_OPTION} &
			MAKE_ID=`expr ${MAKE_ID} + 1`
		fi
	fi

	# sox で再生する
	if [ ${PLAY_ID} -lt ${INPUT_TEXT_LENGTH} ] ; then
		# バッググラウンドで再生中なら、まだ再生しない（1つ前のファイルを調べる）
		PLAY_FILE_NAME="${TALK_FILE}.${MY_PID}.`expr ${PLAY_ID} - 1`.wav"
		isPlay "${PLAY_FILE_NAME}"
		if [ $? -eq 0 ] ; then
			# 再生したいファイルがあるか
			PLAY_FILE_NAME="${TALK_FILE}.${MY_PID}.${PLAY_ID}.wav"
			if [ -e "${PLAY_FILE_NAME}" ] ; then
				# バッググラウンドで作成していないか
				isMake "${PLAY_FILE_NAME}"
				if [ $? -eq 0 ] ; then
					# 再生可能である
					sox "${PLAY_FILE_NAME}" -t ${OUTPUT} ${TALK_EFFECT} > /dev/null 2>&1 &
					PLAY_ID=`expr ${PLAY_ID} + 1`
				fi
			fi
		fi
	fi

	# 処理が終わったらループを抜ける
	if [ ${MAKE_ID} -ge ${INPUT_TEXT_LENGTH} ] && [ ${PLAY_ID} -ge ${INPUT_TEXT_LENGTH} ] ; then
		break;
	fi

	sleepenh 0.2 > /dev/null
done

# 再生がすべて終わるまで待つ
while :
do
	soxid=`pgrep -fo sox`
	if [ ${#soxid} -eq 0 ]; then
		break
	fi
	sleepenh 0.2 > /dev/null
done

# ファイルを消去する
rm ${TALK_FILE}.${MY_PID}.*
