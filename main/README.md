# automata-pod

# 説明

本プログラムは、Raspberry PI 向けの対話システム用プログラムです。某随行支援ユニットに影響を受けて作成を開始しました。

# インストール方法
`./main/install.sh` 内部のスクリプトを読み、基本的には上から実行することでインストールが可能です。ただし、 `nano` で特定のファイルを編集したり、 `crontab` を使用する場合もあります。

内部の設定ファイルは、 `./main/enviroment.sh` にまとめています。本プログラムは、**Shell** と **Node.js** を用いて動作するプログラム群となっており、どちらも、この `./main/enviroment.sh` を参照するようになっています。

音声認識にGoogleの音声認識 **Cloud Speech-to-Text API** を使用しています。以下からAPIキー(`*.json`)をダウンロードして、`./main/` 配下に `GOOGLE_APPLICATION_CREDENTIALS.json` というファイル名で保存してください。

- https://console.cloud.google.com/apis/dashboard
- https://console.cloud.google.com/apis/credentials

# 利用方法

正式な利用方法のテキストが準備できていません。現状、本説明書、及び `./main/install.sh` 、及び `./main/enviroment.sh` を読み使用方法を察してください。あるいは、Twitterなどで私に聞いてください。

# 利用しているソフト

`./main/install.sh` のスクリプトを読むと分かる通り、色々なソフトを利用しています。以下に利用したソフトをいくつか紹介します。

## [Julius](https://julius.osdn.jp/)

京大、奈良先端大、名工大が開発した音声認識エンジンです。本プログラムにおいて、固定文の認識に使用しています。[BSDライセンス](https://github.com/julius-speech/julius/blob/master/LICENSE)です。なお、Juliusの一部 `yomi2voca.pl` を本プログラムでは `Node.js` 用に変更したライブラリ `yomi2voca.js` を作成しました。ライセンスに取り扱いに注意してください。 `./main/lib/yomi2voca/` 配下に作成したライブラリがあります。

## [MeCab](https://taku910.github.io/mecab/)

形態素解析エンジンです。本プログラムにおいて、Julius用の辞書を作成する際に利用しています。`./main/99-create-dic.js` を用いて、独自形式の辞書(`./main/dict/main.kisoku`)を自動変換しています。

## [Open JTalk](http://open-jtalk.sourceforge.net/)

名工大が開発しているHMMテキスト音声合成システムです。[修正BSDライセンス](http://open-jtalk.sourceforge.net/readme_open_jtalk.php)です。読み上げに使用しています。

## [HTS voice tohoku-f01](https://github.com/icn-lab/htsvoice-tohoku-f01)

東北大学が開発している音声合成データです。音声合成に使用しています。[Creative Commons Attributions 4.0.](https://creativecommons.org/licenses/by/4.0/)です。

## その他

その他、`Node.js` のライブラリをいくつか導入しています。詳細は `./main/package.json` を参照してください。

# ライセンス

GitHub上で公開しているソースコード群は、特別に何か記載していない限り、MITライセンスと致します。コード上にライセンス等記載があれば、そちらを優先いたします。

## Author ##
- [natade-jp](https://github.com/natade-jp/)
