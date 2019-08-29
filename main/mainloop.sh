#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

./1-text-to-speech.sh "プログラムを開始します。"

while :
do
	killall julius
	./2-wake-on-voice.sh
	./1-text-to-speech.sh "ご用件をどうぞ"
	./3-voice-record.sh
	if [ -f "./voice-record.flac" ]; then
		./1-text-to-speech.sh "はい"
		./4-speech-to-text-api.js
		text=`cat ./speech-to-text.txt`
		./1-text-to-speech.sh ${text}
	else
		./1-text-to-speech.sh "声がよく聞こえませんでした。"
	fi
	sleep 1
done

