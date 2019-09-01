// julius-4.5
// https://github.com/julius-speech/julius/archive/v4.5.tar.gz
// 
// 上記のツールに付属している
// julius-4.5/gramtools/yomi2voca/yomi2voca.pl
// を natade-jp が 2019/9/1 にjs化したものです。
//
// julius のライセンスについては以下の通りで詳細は付属の LICENSE.txt を参照してください。
// Copyright (c)   1991-2016 京都大学 河原研究室
// Copyright (c)   1997-2000 情報処理振興事業協会(IPA)
// Copyright (c)   2000-2005 奈良先端科学技術大学院大学 鹿野研究室
// Copyright (c)   2005-2016 名古屋工業大学 Julius開発チーム
//
// オリジナルの yomi2voca.pl のライセンスは以下の通りです。
// Copyright (c) 1991-2013 Kawahara Lab., Kyoto University
// Copyright (c) 2000-2005 Shikano Lab., Nara Institute of Science and Technology
// Copyright (c) 2005-2013 Julius project team, Nagoya Institute of Technology
// All rights reserved

/**
 * ひらがなを音素列に変換
 * 
 * 2019/9/1 natade-jp が julius-4.5/gramtools/yomi2voca/yomi2voca.pl から js 用を作成
 * 
 * - Copyright (c)   1991-2016 京都大学 河原研究室
 * - Copyright (c)   1997-2000 情報処理振興事業協会(IPA)
 * - Copyright (c)   2000-2005 奈良先端科学技術大学院大学 鹿野研究室
 * - Copyright (c)   2005-2016 名古屋工業大学 Julius開発チーム
 * @param {string} text ひらがな
 * @returns {string} 音素列
 */
const yomi2voca = function(text) {

    // 3文字以上からなる変換規則（v a）
    text = text.replace(/う゛ぁ/g, " b a");
    text = text.replace(/う゛ぃ/g, " b i");
    text = text.replace(/う゛ぇ/g, " b e");
    text = text.replace(/う゛ぉ/g, " b o");
    text = text.replace(/う゛ゅ/g, " by u");

    // 2文字からなる変換規則
    text = text.replace(/ぅ゛/g, " b u");

    text = text.replace(/あぁ/g, " a a");
    text = text.replace(/いぃ/g, " i i");
    text = text.replace(/いぇ/g, " i e");
    text = text.replace(/いゃ/g, " y a");
    text = text.replace(/うぅ/g, " u:");
    text = text.replace(/えぇ/g, " e e");
    text = text.replace(/おぉ/g, " o:");
    text = text.replace(/かぁ/g, " k a:");
    text = text.replace(/きぃ/g, " k i:");
    text = text.replace(/くぅ/g, " k u:");
    text = text.replace(/くゃ/g, " ky a");
    text = text.replace(/くゅ/g, " ky u");
    text = text.replace(/くょ/g, " ky o");
    text = text.replace(/けぇ/g, " k e:");
    text = text.replace(/こぉ/g, " k o:");
    text = text.replace(/がぁ/g, " g a:");
    text = text.replace(/ぎぃ/g, " g i:");
    text = text.replace(/ぐぅ/g, " g u:");
    text = text.replace(/ぐゃ/g, " gy a");
    text = text.replace(/ぐゅ/g, " gy u");
    text = text.replace(/ぐょ/g, " gy o");
    text = text.replace(/げぇ/g, " g e:");
    text = text.replace(/ごぉ/g, " g o:");
    text = text.replace(/さぁ/g, " s a:");
    text = text.replace(/しぃ/g, " sh i:");
    text = text.replace(/すぅ/g, " s u:");
    text = text.replace(/すゃ/g, " sh a");
    text = text.replace(/すゅ/g, " sh u");
    text = text.replace(/すょ/g, " sh o");
    text = text.replace(/せぇ/g, " s e:");
    text = text.replace(/そぉ/g, " s o:");
    text = text.replace(/ざぁ/g, " z a:");
    text = text.replace(/じぃ/g, " j i:");
    text = text.replace(/ずぅ/g, " z u:");
    text = text.replace(/ずゃ/g, " zy a");
    text = text.replace(/ずゅ/g, " zy u");
    text = text.replace(/ずょ/g, " zy o");
    text = text.replace(/ぜぇ/g, " z e:");
    text = text.replace(/ぞぉ/g, " z o:");
    text = text.replace(/たぁ/g, " t a:");
    text = text.replace(/ちぃ/g, " ch i:");
    text = text.replace(/つぁ/g, " ts a");
    text = text.replace(/つぃ/g, " ts i");
    text = text.replace(/つぅ/g, " ts u:");
    text = text.replace(/つゃ/g, " ch a");
    text = text.replace(/つゅ/g, " ch u");
    text = text.replace(/つょ/g, " ch o");
    text = text.replace(/つぇ/g, " ts e");
    text = text.replace(/つぉ/g, " ts o");
    text = text.replace(/てぇ/g, " t e:");
    text = text.replace(/とぉ/g, " t o:");
    text = text.replace(/だぁ/g, " d a:");
    text = text.replace(/ぢぃ/g, " j i:");
    text = text.replace(/づぅ/g, " d u:");
    text = text.replace(/づゃ/g, " zy a");
    text = text.replace(/づゅ/g, " zy u");
    text = text.replace(/づょ/g, " zy o");
    text = text.replace(/でぇ/g, " d e:");
    text = text.replace(/どぉ/g, " d o:");
    text = text.replace(/なぁ/g, " n a:");
    text = text.replace(/にぃ/g, " n i:");
    text = text.replace(/ぬぅ/g, " n u:");
    text = text.replace(/ぬゃ/g, " ny a");
    text = text.replace(/ぬゅ/g, " ny u");
    text = text.replace(/ぬょ/g, " ny o");
    text = text.replace(/ねぇ/g, " n e:");
    text = text.replace(/のぉ/g, " n o:");
    text = text.replace(/はぁ/g, " h a:");
    text = text.replace(/ひぃ/g, " h i:");
    text = text.replace(/ふぅ/g, " f u:");
    text = text.replace(/ふゃ/g, " hy a");
    text = text.replace(/ふゅ/g, " hy u");
    text = text.replace(/ふょ/g, " hy o");
    text = text.replace(/へぇ/g, " h e:");
    text = text.replace(/ほぉ/g, " h o:");
    text = text.replace(/ばぁ/g, " b a:");
    text = text.replace(/びぃ/g, " b i:");
    text = text.replace(/ぶぅ/g, " b u:");
    text = text.replace(/ふゃ/g, " hy a");
    text = text.replace(/ぶゅ/g, " by u");
    text = text.replace(/ふょ/g, " hy o");
    text = text.replace(/べぇ/g, " b e:");
    text = text.replace(/ぼぉ/g, " b o:");
    text = text.replace(/ぱぁ/g, " p a:");
    text = text.replace(/ぴぃ/g, " p i:");
    text = text.replace(/ぷぅ/g, " p u:");
    text = text.replace(/ぷゃ/g, " py a");
    text = text.replace(/ぷゅ/g, " py u");
    text = text.replace(/ぷょ/g, " py o");
    text = text.replace(/ぺぇ/g, " p e:");
    text = text.replace(/ぽぉ/g, " p o:");
    text = text.replace(/まぁ/g, " m a:");
    text = text.replace(/みぃ/g, " m i:");
    text = text.replace(/むぅ/g, " m u:");
    text = text.replace(/むゃ/g, " my a");
    text = text.replace(/むゅ/g, " my u");
    text = text.replace(/むょ/g, " my o");
    text = text.replace(/めぇ/g, " m e:");
    text = text.replace(/もぉ/g, " m o:");
    text = text.replace(/やぁ/g, " y a:");
    text = text.replace(/ゆぅ/g, " y u:");
    text = text.replace(/ゆゃ/g, " y a:");
    text = text.replace(/ゆゅ/g, " y u:");
    text = text.replace(/ゆょ/g, " y o:");
    text = text.replace(/よぉ/g, " y o:");
    text = text.replace(/らぁ/g, " r a:");
    text = text.replace(/りぃ/g, " r i:");
    text = text.replace(/るぅ/g, " r u:");
    text = text.replace(/るゃ/g, " ry a");
    text = text.replace(/るゅ/g, " ry u");
    text = text.replace(/るょ/g, " ry o");
    text = text.replace(/れぇ/g, " r e:");
    text = text.replace(/ろぉ/g, " r o:");
    text = text.replace(/わぁ/g, " w a:");
    text = text.replace(/をぉ/g, " o:");

    text = text.replace(/う゛/g, " b u");
    text = text.replace(/でぃ/g, " d i");
    text = text.replace(/でぇ/g, " d e:");
    text = text.replace(/でゃ/g, " dy a");
    text = text.replace(/でゅ/g, " dy u");
    text = text.replace(/でょ/g, " dy o");
    text = text.replace(/てぃ/g, " t i");
    text = text.replace(/てぇ/g, " t e:");
    text = text.replace(/てゃ/g, " ty a");
    text = text.replace(/てゅ/g, " ty u");
    text = text.replace(/てょ/g, " ty o");
    text = text.replace(/すぃ/g, " s i");
    text = text.replace(/ずぁ/g, " z u a");
    text = text.replace(/ずぃ/g, " z i");
    text = text.replace(/ずぅ/g, " z u");
    text = text.replace(/ずゃ/g, " zy a");
    text = text.replace(/ずゅ/g, " zy u");
    text = text.replace(/ずょ/g, " zy o");
    text = text.replace(/ずぇ/g, " z e");
    text = text.replace(/ずぉ/g, " z o");
    text = text.replace(/きゃ/g, " ky a");
    text = text.replace(/きゅ/g, " ky u");
    text = text.replace(/きょ/g, " ky o");
    text = text.replace(/しゃ/g, " sh a");
    text = text.replace(/しゅ/g, " sh u");
    text = text.replace(/しぇ/g, " sh e");
    text = text.replace(/しょ/g, " sh o");
    text = text.replace(/ちゃ/g, " ch a");
    text = text.replace(/ちゅ/g, " ch u");
    text = text.replace(/ちぇ/g, " ch e");
    text = text.replace(/ちょ/g, " ch o");
    text = text.replace(/とぅ/g, " t u");
    text = text.replace(/とゃ/g, " ty a");
    text = text.replace(/とゅ/g, " ty u");
    text = text.replace(/とょ/g, " ty o");
    text = text.replace(/どぁ/g, " d o a");
    text = text.replace(/どぅ/g, " d u");
    text = text.replace(/どゃ/g, " dy a");
    text = text.replace(/どゅ/g, " dy u");
    text = text.replace(/どょ/g, " dy o");
    text = text.replace(/どぉ/g, " d o:");
    text = text.replace(/にゃ/g, " ny a");
    text = text.replace(/にゅ/g, " ny u");
    text = text.replace(/にょ/g, " ny o");
    text = text.replace(/ひゃ/g, " hy a");
    text = text.replace(/ひゅ/g, " hy u");
    text = text.replace(/ひょ/g, " hy o");
    text = text.replace(/みゃ/g, " my a");
    text = text.replace(/みゅ/g, " my u");
    text = text.replace(/みょ/g, " my o");
    text = text.replace(/りゃ/g, " ry a");
    text = text.replace(/りゅ/g, " ry u");
    text = text.replace(/りょ/g, " ry o");
    text = text.replace(/ぎゃ/g, " gy a");
    text = text.replace(/ぎゅ/g, " gy u");
    text = text.replace(/ぎょ/g, " gy o");
    text = text.replace(/ぢぇ/g, " j e");
    text = text.replace(/ぢゃ/g, " j a");
    text = text.replace(/ぢゅ/g, " j u");
    text = text.replace(/ぢょ/g, " j o");
    text = text.replace(/じぇ/g, " j e");
    text = text.replace(/じゃ/g, " j a");
    text = text.replace(/じゅ/g, " j u");
    text = text.replace(/じょ/g, " j o");
    text = text.replace(/びゃ/g, " by a");
    text = text.replace(/びゅ/g, " by u");
    text = text.replace(/びょ/g, " by o");
    text = text.replace(/ぴゃ/g, " py a");
    text = text.replace(/ぴゅ/g, " py u");
    text = text.replace(/ぴょ/g, " py o");
    text = text.replace(/うぁ/g, " u a");
    text = text.replace(/うぃ/g, " w i");
    text = text.replace(/うぇ/g, " w e");
    text = text.replace(/うぉ/g, " w o");
    text = text.replace(/ふぁ/g, " f a");
    text = text.replace(/ふぃ/g, " f i");
    text = text.replace(/ふぅ/g, " f u");
    text = text.replace(/ふゃ/g, " hy a");
    text = text.replace(/ふゅ/g, " hy u");
    text = text.replace(/ふょ/g, " hy o");
    text = text.replace(/ふぇ/g, " f e");
    text = text.replace(/ふぉ/g, " f o");

    // 1音からなる変換規則
    text = text.replace(/あ/g, " a");
    text = text.replace(/い/g, " i");
    text = text.replace(/う/g, " u");
    text = text.replace(/え/g, " e");
    text = text.replace(/お/g, " o");
    text = text.replace(/か/g, " k a");
    text = text.replace(/き/g, " k i");
    text = text.replace(/く/g, " k u");
    text = text.replace(/け/g, " k e");
    text = text.replace(/こ/g, " k o");
    text = text.replace(/さ/g, " s a");
    text = text.replace(/し/g, " sh i");
    text = text.replace(/す/g, " s u");
    text = text.replace(/せ/g, " s e");
    text = text.replace(/そ/g, " s o");
    text = text.replace(/た/g, " t a");
    text = text.replace(/ち/g, " ch i");
    text = text.replace(/つ/g, " ts u");
    text = text.replace(/て/g, " t e");
    text = text.replace(/と/g, " t o");
    text = text.replace(/な/g, " n a");
    text = text.replace(/に/g, " n i");
    text = text.replace(/ぬ/g, " n u");
    text = text.replace(/ね/g, " n e");
    text = text.replace(/の/g, " n o");
    text = text.replace(/は/g, " h a");
    text = text.replace(/ひ/g, " h i");
    text = text.replace(/ふ/g, " f u");
    text = text.replace(/へ/g, " h e");
    text = text.replace(/ほ/g, " h o");
    text = text.replace(/ま/g, " m a");
    text = text.replace(/み/g, " m i");
    text = text.replace(/む/g, " m u");
    text = text.replace(/め/g, " m e");
    text = text.replace(/も/g, " m o");
    text = text.replace(/ら/g, " r a");
    text = text.replace(/り/g, " r i");
    text = text.replace(/る/g, " r u");
    text = text.replace(/れ/g, " r e");
    text = text.replace(/ろ/g, " r o");
    text = text.replace(/が/g, " g a");
    text = text.replace(/ぎ/g, " g i");
    text = text.replace(/ぐ/g, " g u");
    text = text.replace(/げ/g, " g e");
    text = text.replace(/ご/g, " g o");
    text = text.replace(/ざ/g, " z a");
    text = text.replace(/じ/g, " j i");
    text = text.replace(/ず/g, " z u");
    text = text.replace(/ぜ/g, " z e");
    text = text.replace(/ぞ/g, " z o");
    text = text.replace(/だ/g, " d a");
    text = text.replace(/ぢ/g, " j i");
    text = text.replace(/づ/g, " z u");
    text = text.replace(/で/g, " d e");
    text = text.replace(/ど/g, " d o");
    text = text.replace(/ば/g, " b a");
    text = text.replace(/び/g, " b i");
    text = text.replace(/ぶ/g, " b u");
    text = text.replace(/べ/g, " b e");
    text = text.replace(/ぼ/g, " b o");
    text = text.replace(/ぱ/g, " p a");
    text = text.replace(/ぴ/g, " p i");
    text = text.replace(/ぷ/g, " p u");
    text = text.replace(/ぺ/g, " p e");
    text = text.replace(/ぽ/g, " p o");
    text = text.replace(/や/g, " y a");
    text = text.replace(/ゆ/g, " y u");
    text = text.replace(/よ/g, " y o");
    text = text.replace(/わ/g, " w a");
    text = text.replace(/ゐ/g, " i");
    text = text.replace(/ゑ/g, " e");
    text = text.replace(/ん/g, " N");
    text = text.replace(/っ/g, " q");
    text = text.replace(/ー/g, ":");

    // ここまでに処理されてない ぁぃぅぇぉ はそのまま大文字扱い
    text = text.replace(/ぁ/g, " a");
    text = text.replace(/ぃ/g, " i");
    text = text.replace(/ぅ/g, " u");
    text = text.replace(/ぇ/g, " e");
    text = text.replace(/ぉ/g, " o");
    text = text.replace(/ゎ/g, " w a");
    text = text.replace(/ぉ/g, " o");

    // その他特別なルール
    text = text.replace(/を/g, " o");

    // 最初の空白を削る
    text = text.replace(/^ ([a-z])/, "$1");

    // 変換の結果長音記号が続くことがまれにあるので一つにまとめる
    text = text.replace(/:+/g, ":");

    return text;
}

module.exports = yomi2voca;
