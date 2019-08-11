#!/bin/sh

# �V�F���X�N���v�g������ꏊ���J�����g�f�B���N�g���ɂ���
cd `dirname $0`

# ��d�N���h�~
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# ��������
text=$1

# atr503_m001
# htsvoice="/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"

# mei
# htsvoice="/usr/share/hts-voice/mei/mei_normal.htsvoice"

# tohoku-f01
htsvoice="/usr/share/hts-voice/tohoku-f01/tohoku-f01-neutral.htsvoice"

jdic="/var/lib/mecab/dic/open-jtalk/naist-jdic"
wavfile="./test.wav"

echo "${text}" | open_jtalk -m "${htsvoice}" -x "${jdic}" -ow "${wavfile}"
aplay "${wavfile}"

