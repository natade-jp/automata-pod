#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "/bin/sh ${filepath}"` ; then
	return 1
fi

node ./0-mainloop.js
