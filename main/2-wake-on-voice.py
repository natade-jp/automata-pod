# -*- coding: utf-8 -*-

# 参考
# https://qiita.com/fishkiller/items/c6c5c4dcd9bb8184e484
#
# 以下で実行する
# python3 ./2-wake-on-voice.py

import subprocess
import socket
import string
import os
import time
import sys

host = '127.0.0.1' #localhost
port = 10500   #julisuサーバーモードのポート

def main():

	p = subprocess.Popen(["./2-wake-on-voice-julius-start.sh"], stdout=subprocess.PIPE, shell=True) # julius起動スクリプトを実行
	pid = str(p.stdout.read().decode('utf-8')) # juliusのプロセスIDを取得
	time.sleep(1) # 1秒間スリープ
	client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	client.connect((host, port)) #サーバーモードで起動したjuliusに接続

	try:
		data = '' # dataの初期化
		killword ='' # 前回認識した言葉を記憶するための変数
		while 1:
			# print(data) # 認識した言葉を表示して確認
			if '</RECOGOUT>\n.' in data:
				for line in data.split('\n'):
					index = line.find('WORD="')
					if index != -1:
						line = line[index+6:line.find('"',index+6)]
					
					if line == 'ポッド':
						print('OK')
						sys.exit()
					
					elif line == 'こんにちは':
						print(line)
					
					data = "" # dataの初期化
			else:
				data += str(client.recv(1024).decode('utf-8')) # dataが空のときjuliusからdataに入れる


	except KeyboardInterrupt:
		p.kill()
		subprocess.call(["kill " + pid], shell=True)# juliusのプロセスを終了する。
		client.close()

if __name__ == "__main__":
	main()
