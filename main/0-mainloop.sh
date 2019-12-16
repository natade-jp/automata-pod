#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "/bin/sh ${filepath}"` ; then
	return 1
fi

# 変数を取得
. ./environment.sh

# ファイルを消去する
rm ${TALK_FILE}.*

# 最新の情報を取得
./21-cron.sh

# スタート
node ./0-mainloop.js


