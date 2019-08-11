#!/bin/sh

# apt-get を更新
sudo apt-get -y update

# raspberry pi のフォルダ名を英語に変更
sudo apt-get install -y xdg-user-dirs-gtk
LANG=C xdg-user-dirs-update --force

# Open-JDK をインストール
sudo apt-get install -y open-jtalk
sudo apt-get install -y open-jtalk-mecab-naist-jdic hts-voice-nitech-jp-atr503-m001

# 音声合成ライブラリをセットアップ
mkdir -p hts-voice
cd ./hts-voice

# tohoku-f01
wget https://github.com/icn-lab/htsvoice-tohoku-f01/archive/master.zip
unzip ./master.zip
mv ./htsvoice-tohoku-f01-master ./tohoku-f01
sudo cp -r ./tohoku-f01 /usr/share/hts-voice/

# mei
# wget https://sourceforge.net/projects/mmdagent/files/MMDAgent_Example/MMDAgent_Example-1.8/MMDAgent_Example-1.8.zip
# unzip ./MMDAgent_Example-1.8.zip
# sudo cp -r ./MMDAgent_Example-1.8/Voice/mei/ /usr/share/hts-voice/

