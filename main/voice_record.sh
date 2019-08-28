#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# 最大5秒、あるいは3秒無音なら録音停止
sox -c 1 -r 8000 -t alsa plughw:1 test.flac trim 0 5 silence 0 1 3.0 -35d
