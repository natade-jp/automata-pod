#!/bin/sh
#
# crontab -e で以下を追加してください
# ※crontab 内に @reboot で追加しないでください。
# 7 * * * * /home/pi/automata-pod/main/21-cron.sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "/bin/sh ${filepath}"` ; then
	return 1
fi

node "./21-cron.js"
