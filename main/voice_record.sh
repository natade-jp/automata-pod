#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# デバイス番号
deviceid="1"
# 無音時の音量レベルを調べる
muon_check_sec="0.5"
# 最長
max_sec="8"
# 無音判定時間
muon_sec="2.5"
# サンプリング周波数
fs="16000"
# 出力ファイル
file_name="rec.flac"

# 入力
input_dev="alsa plughw:${deviceid}"

# 指定した長さの音を録音する
getstats_command="sox -c 1 -t ${input_dev} -n -S stats trim 0 ${muon_check_sec}"
getstats="$(${getstats_command} 2>&1 > /dev/null)"

# データからピークのデシベルを取得する
pklev=`echo ${getstats} | grep -oE "Pk lev dB [-0-9.]+" | grep -oE "[-0-9.]+"`

# 録音する
silence_db=`echo "${pklev} + 5" | bc`
getvoise_command="sox -c 1 -r ${fs} -t ${input_dev} ${file_name} trim 0 ${max_sec} silence 0 1 ${muon_sec} ${silence_db}d"
getvoise="$(${getvoise_command} 2>&1 > /dev/null)"
rec_length=`echo "${getvoise}" | grep -oE "[0-9]{2}\.[0-9]{2} " | tail -n 1`

# 録音した長さ比較する
is_success=`echo "${muon_sec} + 0.5 < ${rec_length}" | bc`
if [ ${is_success} = 0 ]; then
	echo "失敗"
	rm ${file_name}
else
	echo "録音成功"
fi
