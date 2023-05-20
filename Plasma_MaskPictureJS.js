// Plasma_MaskPictureJS 1.0.0
// Copyright (c) 2023 Plasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/20 1.0.0 公開
 */

/*:
 * @plugindesc ピクチャを別のピクチャでマスクする
 * @author Plasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command maskPicture
 * @text ピクチャをマスクする
 * @arg base
 * @text ベースピクチャID
 * @type number
 * @arg mask
 * @text マスクピクチャID
 * @type number
 *
 * @command unmaskPicture
 * @text ピクチャにかけたマスクを解除する
 * @arg base
 * @text ベースピクチャID
 * @type number
 *
 * @help
 * version: 1.0.0
 * ピクチャでピクチャをマスクします。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_maskPicture(args) {
    return {
      base: Number(args.base || 0),
      mask: Number(args.mask || 0),
    };
  }

  function parseArgs_unmaskPicture(args) {
    return {
      base: Number(args.base || 0),
    };
  }

  const command_maskPicture = 'maskPicture';

  const command_unmaskPicture = 'unmaskPicture';

  PluginManager.registerCommand(pluginName, command_maskPicture, function (args) {
    const parsedArgs = parseArgs_maskPicture(args);
    $gameScreen.maskPicture(parsedArgs.base, parsedArgs.mask);
  });

  PluginManager.registerCommand(pluginName, command_unmaskPicture, function (args) {
    const parsedArgs = parseArgs_unmaskPicture(args);
    $gameScreen.unmaskPicture(parsedArgs.base);
  });

  function Game_Screen_MaskPictureMixIn(gameScreen) {
    gameScreen.maskPicture = function (basePictureId, maskPictureId) {
      const basePicture = this.picture(basePictureId);
      const maskPicture = this.picture(maskPictureId);
      if (!basePicture || !maskPicture) {
        return;
      }

      this._maskPictureRequest = {
        base: basePictureId,
        mask: maskPictureId,
      };
    };

    gameScreen.unmaskPicture = function (basePictureId) {
      this._unmaskPictureRequest = basePictureId;
    };

    gameScreen.maskPictureRequest = function () {
      return this._maskPictureRequest;
    };

    gameScreen.unmaskPictureRequest = function () {
      return this._unmaskPictureRequest;
    };

    gameScreen.resetMaskPictureRequest = function () {
      this._maskPictureRequest = undefined;
    };

    gameScreen.resetUnmaskPictureRequest = function () {
      this._unmaskPictureRequest = undefined;
    };
  }

  Game_Screen_MaskPictureMixIn(Game_Screen.prototype);

  function Spriteset_MaskPictureMixIn(spritesetClass) {
    const _update = spritesetClass.update;
    spritesetClass.update = function () {
      _update.call(this);
      this.updateMask();
    };

    spritesetClass.updateMask = function () {
      if ($gameScreen.maskPictureRequest()) {
        const baseSprite = this._pictureContainer.children.find(
          (sprite) => sprite.pictureId() === $gameScreen.maskPictureRequest().base,
        );
        const maskSprite = this._pictureContainer.children.find(
          (sprite) => sprite.pictureId() === $gameScreen.maskPictureRequest().mask,
        );
        if (baseSprite && maskSprite) {
          baseSprite.setMask(maskSprite);
        }
        $gameScreen.resetMaskPictureRequest();
      }
      if ($gameScreen.unmaskPictureRequest()) {
        const baseSprite = this._pictureContainer.children.find(
          (sprite) => sprite.pictureId() === $gameScreen.unmaskPictureRequest(),
        );
        if (baseSprite) {
          baseSprite.unmask();
        }
        $gameScreen.resetUnmaskPictureRequest();
      }
    };
  }

  Spriteset_MaskPictureMixIn(Spriteset_Base.prototype);

  function Sprite_Picture_MaskMixIn(spritePicture) {
    spritePicture.setMask = function (sprite) {
      this.mask = sprite;
    };

    spritePicture.unmask = function () {
      this.mask = undefined;
    };

    spritePicture.pictureId = function () {
      return this._pictureId;
    };
  }

  Sprite_Picture_MaskMixIn(Sprite_Picture.prototype);
})();
