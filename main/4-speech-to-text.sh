#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# 出力ファイル
file_name="speech-to-text.txt"

if [ -f "${file_name}" ]; then
	rm "${file_name}"
fi

node ./4-speech-to-text.js
