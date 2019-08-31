#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# 変数を取得
. ./environment.sh

# すでにファイルがある場合は削除する
if [ -f "${RECOGNIZE_RESULT}" ]; then
	rm "${RECOGNIZE_RESULT}"
fi

node ./4-speech-to-text.js
