## 概要

L6470のMicrobit向けライブラリです。
ステッピングモーター特有の概念やドライバの利用方法への学習なしに、モーターを駆動することが可能です。
ステッピングモーターの位置決め性を活かしながら、制御ロジックに集中してプログラミングできることを目指しています。

## 機能

L6470の一部機能のみ実装しています。
* 設定
    * SSピン選択
    * 最高速度[rpm]設定（MAX_SPEEDレジスタ）
    * 全パラメーターレジスタへの書き込み（SetParamコマンド）
    * 全パラメーターレジスタの読み込み（GetParamコマンド）
* 回転
    * 方向・速度[rpm]を指定した回転（Runコマンド）
    * 方向・回転角度量[°]を指定した回転（Moveコマンド）
* 停止
    * 減速停止（SoftStopコマンド）
    * 減速停止後励磁解除（SoftHizコマンド）
* 位置指定
    * 原点セット（ResetPosコマンド）
    * 原点位置に移動（GoHomeコマンド）
* 初期設定
    * 対L6470内レジスタ設定項目（後述）
    * 対ライブラリ内部設定項目（後述）


### 初期設定-対L6470内レジスタ設定項目

設定値は、Strawberry LinuxでL6470ドライバキットとセット販売されているモーター向け。
キットの説明書での推奨値を利用。

https://strawberry-linux.com/catalog/items?code=12023

SetParam命令で変更可
|  項目  |  設定値  |
| ---- | ---- |
|  MAX_SPEED  |  0x20  |
|  KVAL_HOLD  |  0xff  |
|  KVAL_RUN  |  0xff  |
|  KVAL_ACC  |  0xff  |
|  KVAL_DEC  |  0xff  |
|  OCH_TH  |  0xf  |
|  STALL_TH  |  0x7f  |
|  STEP_MODE  |  0x7  |

### 初期設定-対ライブラリ内部設定項目

JavaScript側で変更可
|  項目  |  設定値  |
| ---- | ---- |
|  1周あたりのステップ数  |  200  |



## 拡張機能として使用

このリポジトリは、MakeCode で **拡張機能** として追加できます。

* [https://makecode.microbit.org/](https://makecode.microbit.org/) を開く
* **新しいプロジェクト** をクリックしてください
* ギアボタンメニューの中にある **拡張機能** をクリックしてください
* **https://github.com/k-fujimaru/l6470_microbit** を検索してインポートします。

## このプロジェクトを編集します ![ビルド ステータス バッジ](https://github.com/k-fujimaru/l6470_microbit/workflows/MakeCode/badge.svg)

MakeCode でこのリポジトリを編集します。

* [https://makecode.microbit.org/](https://makecode.microbit.org/) を開く
* **読み込む** をクリックし、 **URLから読み込む...** をクリックしてください
* **https://github.com/k-fujimaru/l6470_microbit** を貼り付けてインポートをクリックしてください

## ブロックのプレビュー

この画像はマスター内の最後のコミットからのブロックコードを示しています。
このイメージは更新に数分かかる場合があります。

![生成されたブロック](https://github.com/k-fujimaru/l6470_microbit/raw/master/.github/makecode/blocks.png)

#### メタデータ (検索、レンダリングに使用)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
