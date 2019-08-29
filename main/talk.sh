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
text=$1

# atr503_m001
# htsvoice="/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"

# mei
# htsvoice="/usr/share/hts-voice/mei/mei_normal.htsvoice"

# tohoku-f01
htsvoice="/usr/share/hts-voice/tohoku-f01/tohoku-f01-neutral.htsvoice"

jdic="/var/lib/mecab/dic/open-jtalk/naist-jdic"
wavfile="./talkdata.wav"
deviceid="0"
volume="80%"
effect="tempo 1.05 echo 1.0 0.75 100 0.3"

# 出力
speaker="alsa plughw:${deviceid}"

# wavファイルを作成
echo "${text}" | open_jtalk -m "${htsvoice}" -x "${jdic}" -ow "${wavfile}"

# 音量調整
amixer sset PCM ${volume} -c${deviceid}

# 再生する
sox "${wavfile}" -t ${speaker} ${effect} > /dev/null 2>&1

# 消去する
rm ${wavfile}

