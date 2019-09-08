#!/bin/sh
# crontab
# 
# @reboot /home/pi/automata-pod/main/20-startup.sh
# /etc/rc.local
# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

./0-mainloop.sh &
