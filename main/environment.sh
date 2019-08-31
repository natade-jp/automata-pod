#!/bin/sh

# デバイス番号
DEV_ID_PLAY="0"
DEV_ID_REC="1"

# ボリューム
VOL_SPEAKER="80%"
VOL_MIC=""

# open_jtalk用
# atr503_m001
# TALK_HTS="/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"
# mei
# TALK_HTS="/usr/share/hts-voice/mei/mei_normal.htsvoice"
# tohoku-f01
TALK_HTS="/usr/share/hts-voice/tohoku-f01/tohoku-f01-neutral.htsvoice"
TALK_JDIC="/var/lib/mecab/dic/open-jtalk/naist-jdic"
TALK_FILE="./text-to-speech.wav"
TALK_EFFECT="tempo 1.05 echo 1.0 0.75 100 0.3"

# julius用
JULIUS_AMGMM=~/julius/dictation-kit-4.5/am-gmm.jconf
JULIUS_GRAM="./dict/pod"

# google 音声認識用
RECOGNIZE_FILE="voice-record.flac"
RECOGNIZE_ENCODING="FLAC"
RECOGNIZE_CHECK_MUON_SEC="0.5"
RECOGNIZE_REC_MAX_SEC="8"
RECOGNIZE_MUON_SEC="2.5"
RECOGNIZE_FS="16000"
RECOGNIZE_LANG="ja-JP"
# 以下から取得
# https://console.cloud.google.com/apis/dashboard
# https://console.cloud.google.com/apis/credentials
RECOGNIZE_API_KEY="./GOOGLE_APPLICATION_CREDENTIALS.json"
RECOGNIZE_RESULT="speech-to-text.txt"

