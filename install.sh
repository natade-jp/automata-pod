#!/bin/sh

# apt-get ���X�V
sudo apt-get -y update

# raspberry pi �̃t�H���_�����p��ɕύX
sudo apt-get install -y xdg-user-dirs-gtk
LANG=C xdg-user-dirs-update --force

# Open-JDK ���C���X�g�[��
sudo apt-get install -y open-jtalk
sudo apt-get install -y open-jtalk-mecab-naist-jdic hts-voice-nitech-jp-atr503-m001

# �����������C�u�������Z�b�g�A�b�v
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

