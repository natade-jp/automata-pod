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

# htsvoice="/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"
htsvoice="/usr/share/hts-voice/mei/mei_normal.htsvoice"
jdic="/var/lib/mecab/dic/open-jtalk/naist-jdic"
wavfile="./test.wav"

echo "${text}" | open_jtalk -m "${htsvoice}" -x "${jdic}" -ow "${wavfile}"
aplay "${wavfile}"

