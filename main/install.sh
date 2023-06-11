#!/bin/sh

# フォルダ構成は以下を想定しています。
# pi
#  automata-pod
#   main
#  julius
#   dictation-kit-4.5
#   julius-4.5
#  mecab
#   mecab-0.996
#   mecab-ipadic-2.7.0-20070801

# 以下のようにRAMディスク化する
# sudo nano /etc/fstab
# 以下を追加
# tmpfs           /tmp            tmpfs   defaults,size=64m,noatime,mode=1777      0       0
# tmpfs           /var/tmp        tmpfs   defaults,size=16m,noatime,mode=1777      0       0
# tmpfs           /var/log        tmpfs   defaults,size=32m,noatime,mode=0755      0       0
# 上書き後、元のフォルダを削除してリブートする
# sudo rm -rf /tmp
# sudo rm -rf /var/tmp
# sudo reboot
# RAMディスク化することで、作成した音声用データの一時ファイルをRAM上に置き反応速度を上げる
# 
# automata-pod
# sudo apt-get install -y git
# git clone https://github.com/natade-jp/automata-pod

# apt-get を更新
sudo apt-get -y update

# raspberry pi のフォルダ名を英語に変更
sudo apt-get install -y xdg-user-dirs-gtk
LANG=C xdg-user-dirs-update --force

# sleep用
sudo apt-get install -y sleepenh

# 計算用
sudo apt-get install -y bc

# Open JTalk をインストール
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
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 必要なパッケージをインストールする
cd ~/automata-pod/main
npm install

# Julius
cd ~
sudo apt-get install -y osspd-alsa libasound2-dev libsndfile1-dev
mkdir julius
cd julius
wget https://github.com/julius-speech/julius/archive/v4.5.tar.gz
tar xvzf v4.5.tar.gz
cd julius-4.5
./configure --build=aarch64-unknown-linux-gnu --with-mictype=alsa
make
sudo make install

# julius-kit
cd ../
wget https://ja.osdn.net/projects/julius/downloads/71011/dictation-kit-4.5.zip
unzip dictation-kit-4.5.zip

# soxの利用
sudo apt-get install -y alsa-utils sox libsox-fmt-all

# MeCab (apt-get でインストールすると文字化けするので自分でインストールする)
cd ~
mkdir mecab
cd mecab
FILE_ID=0B4y35FiV1wh7cENtOXlicTFaRUE
curl -sc /tmp/cookie "https://drive.google.com/uc?export=download&id=${FILE_ID}" > /dev/null
CODE="$(awk '/_warning_/ {print $NF}' /tmp/cookie)"  
curl -Lb /tmp/cookie "https://drive.google.com/uc?export=download&confirm=${CODE}&id=${FILE_ID}" -o mecab-0.996.tar.gz
tar xvzf mecab-0.996.tar.gz
cd mecab-0.996
./configure --build=aarch64-unknown-linux-gnu --with-charset=utf8 --enable-utf8-only
make
make check
sudo make install

# MeCab 用の辞書 IPA 辞書
cd ../
FILE_ID=0B4y35FiV1wh7MWVlSDBCSXZMTXM
curl -sc /tmp/cookie "https://drive.google.com/uc?export=download&id=${FILE_ID}" > /dev/null
CODE="$(awk '/_warning_/ {print $NF}' /tmp/cookie)"  
curl -Lb /tmp/cookie "https://drive.google.com/uc?export=download&confirm=${CODE}&id=${FILE_ID}" -o mecab-ipadic-2.7.0-20070801.tar.gz
tar xvzf mecab-ipadic-2.7.0-20070801.tar.gz
cd mecab-ipadic-2.7.0-20070801
sudo ldconfig -v 
./configure --build=aarch64-unknown-linux-gnu --with-charset=utf8 --enable-utf8-only
make
sudo make install
# 以降以下で、実行可能
# mecab -d /usr/local/lib/mecab/dic/ipadic

# スタートアップ及び、定期実行の設定
#
# /etc/rc.local を編集して以下を追加してください。
# ※crontab 内に @reboot で追加しないでください。
# /home/pi/automata-pod/main/20-startup.sh
#
# crontab に以下を追加してください。
# 7 * * * * /home/pi/automata-pod/main/21-cron.sh

# CUI化
# sudo raspi-config
# 「3 Boot Options」を選択
# 「B1 Desktop / CLI」を選択
# 「B2 Console Autologin Text console, automatically logged in as 'pi' user」を選択
# あとは、Finishで、RebootするとCUIで起動します。

# HDMIを指してもイヤホンジャックから音を強制的に出す
# sudo raspi-config
# 「1 System Options」を選択
# 「S2 Audio」を選択
# 「1 Force 3.5mm ('headphone') jack」を選択
# あとは、Finishで、RebootするとCUIで起動します。
