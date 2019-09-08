#!/bin/sh

# フォルダ構成
# pi
#  automata-pod
#   main
#  julius
#   dictation-kit-4.5
#   julius-4.5
#  mecab
#   mecab-0.996
#   mecab-ipadic-2.7.0-20070801

# apt-get を更新
sudo apt-get -y update

# raspberry pi のフォルダ名を英語に変更
sudo apt-get install -y xdg-user-dirs-gtk
LANG=C xdg-user-dirs-update --force

# sleep用
sudo apt-get install -y sleepenh

# 計算用
sudo apt-get install -y bc

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
cd ../
rm -r ./hts-voice

# mei
# wget https://sourceforge.net/projects/mmdagent/files/MMDAgent_Example/MMDAgent_Example-1.8/MMDAgent_Example-1.8.zip
# unzip ./MMDAgent_Example-1.8.zip
# sudo cp -r ./MMDAgent_Example-1.8/Voice/mei/ /usr/share/hts-voice/

# node.js
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# パッケージ
npm install

# Julius
cd ~
sudo apt-get install -y osspd-alsa libasound2-dev libesd0-dev libsndfile1-dev
mkdir julius
cd julius
wget https://github.com/julius-speech/julius/archive/v4.5.tar.gz
tar xvzf v4.5.tar.gz
cd julius-4.5
./configure --with-mictype=alsa
make
sudo make install

# julius-kit
cd ../
wget https://osdn.net/dl/julius/dictation-kit-4.5.zip
unzip dictation-kit-4.5.zip

# soxの利用
sudo apt-get install -y alsa-utils sox libsox-fmt-all

# MeCab (apt-get でインストールすると文字化けするので自分でインストールする)
cd ~
mkdir mecab
cd mecab
wget -O mecab-0.996.tar.gz "https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7cENtOXlicTFaRUE"
tar xvzf mecab-0.996.tar.gz
cd mecab-0.996
./configure --with-charset=utf8 --enable-utf8-only
make
make check
sudo make install

# MeCab 用の辞書 IPA 辞書
cd ../
wget -O mecab-ipadic-2.7.0-20070801.tar.gz "https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7MWVlSDBCSXZMTXM"
tar xvzf mecab-ipadic-2.7.0-20070801.tar.gz
cd mecab-ipadic-2.7.0-20070801
./configure --with-charset=utf8 --enable-utf8-only
make
sudo make install
# 以降以下で、実行可能
# mecab -d /usr/local/lib/mecab/dic/ipadic

# crontab に以下を追加
# @reboot /home/pi/automata-pod/main/20-startup.sh
# 7 * * * * /home/pi/automata-pod/main/21-cron.sh
