#!/bin/sh

CONF1=~/julius/dictation-kit-4.5/main.jconf
CONF2=~/julius/dictation-kit-4.5/am-gmm.jconf
GRAM=./dict/hello

export ALSADEV="plughw:1,0"
# julius -C ${CONF1} -C ${CONF2} -nostrip
julius -C ${CONF2} -nostrip -gram ${GRAM}
