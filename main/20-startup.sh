#!/bin/sh
# 
# /etc/rc.local を編集して以下を追加してください。
# /home/pi/automata-pod/main/20-startup.sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

./0-mainloop.sh &
