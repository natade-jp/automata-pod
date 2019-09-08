#!/bin/sh

# デバイス番号
DEV_ID_PLAY="0"
DEV_ID_REC="1"

# ボリューム
VOL_SPEAKER="100%"
VOL_MIC="100%"

# open_jtalk用
# atr503_m001
# TALK_HTS="/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"
# mei
# TALK_HTS="/usr/share/hts-voice/mei/mei_normal.htsvoice"
# tohoku-f01
TALK_HTS="/usr/share/hts-voice/tohoku-f01/tohoku-f01-neutral.htsvoice"
TALK_JDIC="/var/lib/mecab/dic/open-jtalk/naist-jdic"
TALK_FILE="./text-to-speech.wav"
TALK_OPTION="-r 1.05"
# この辺を参考に声をいじる
# https://stackoverflow.com/questions/29957719/how-to-make-robot-or-dalek-voice-using-sox-library
# TALK_EFFECT="echo 1.0 0.75 100 0.3"
# TALK_EFFECT="overdrive 10 echo 0.8 0.8 5 0.7 echo 0.8 0.7 6 0.7 echo 0.8 0.7 10 0.7 echo 0.8 0.7 12 0.7"
TALK_EFFECT="pitch -60 overdrive 10 echo 0.8 0.8 5 0.7 echo 0.8 0.7 6 0.7 echo 0.8 0.7 10 0.7 echo 1.0 0.75 100 0.3"
# TALK_EFFECT="stretch 1.2 133.33 lin 0.2 0.4 overdrive 30 30 echo 0.4 0.8 15 0.8 synth sine fmod 30 echo 0.8 0.8 29 0.8"

# julius用
JULIUS_MAIN="/home/pi/julius/dictation-kit-4.5/main.jconf"
JULIUS_AMGMM="/home/pi/julius/dictation-kit-4.5/am-gmm.jconf"
JULIUS_GRAM="./dict/main"
JULIUS_MINSCORE_1GRAM=2500 # 1ワードの最低認識スコア
JULIUS_MINSCORE_NGRAM=3500 # それ以上の最低認識スコア
JULIUS_RESULT="speech-to-text.txt"

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

# mecab
MECAB_RUN="mecab -d /usr/local/lib/mecab/dic/ipadic"

#天気予報など
INFO_KION_URL="http://www.jma.go.jp/jp/amedas_h/today-51106.html?areaCode=000&groupCode=36"
INFO_KION_JSON="info_kion.json"
INFO_TENKI_URL="https://www.jma.go.jp/jp/week/329.html"
INFO_TENKI_JSON="info_tenki.json"
