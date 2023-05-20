// Plasma_ThinMessageWindow 1.0.0
// Copyright (c) 2023 Plasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/04/16 1.0.0 公開
 */

/*:
 * @plugindesc メッセージウィンドウの幅を変更する
 * @author Plasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 指定したスイッチがONの時、メッセージウィンドウの幅を細くします。
 */

(() => {
  'use strict';

  /**
   * メッセージウィンドウの幅を細くするスイッチ
   */
  const THIN_MESSAGE_WINDOW_SWITCH = 12;

  /**
   * 細くなったメッセージウィンドウの幅
   */
  const THIN_MESSAGE_WINDOW_WIDTH = 350;

  function Window_Message_ThinMessageWindowMixIn(windowClass) {
    const _initialize = windowClass.initialize;
    windowClass.initialize = function (rect) {
      _initialize.call(this, rect);
      this._defaultWidth = rect.width;
    };

    const _updatePlacement = windowClass.updatePlacement;
    windowClass.updatePlacement = function () {
      if (this.windowWidth() !== this.width) {
        /**
         * ウィンドウを作ったときに設定した幅、x座標を再設定し
         * 描画範囲を再度生成する
         */
        this.width = this.windowWidth();
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.createContents();
      }
      _updatePlacement.call(this);
    };

    windowClass.windowWidth = function () {
      return $gameSwitches.value(THIN_MESSAGE_WINDOW_SWITCH) ? THIN_MESSAGE_WINDOW_WIDTH : this._defaultWidth;
    };
  }

  Window_Message_ThinMessageWindowMixIn(Window_Message.prototype);
})();
