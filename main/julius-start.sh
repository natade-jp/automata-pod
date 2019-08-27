#!/bin/sh

# 参考
# https://qiita.com/fishkiller/items/c6c5c4dcd9bb8184e484

AMGMM=~/julius/dictation-kit-4.5/am-gmm.jconf
GRAM=./dict/hello

export ALSADEV="plughw:1,0"
julius -C ${AMGMM} -nostrip -gram ${GRAM} -module > /dev/null &

# プロセスIDを出力
echo $!

sleep 2
