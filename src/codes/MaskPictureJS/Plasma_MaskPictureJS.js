import { pluginName } from '../../common/pluginName';
import { command_maskPicture, command_unmaskPicture, parseArgs_maskPicture, parseArgs_unmaskPicture } from './_build/Plasma_MaskPictureJS_commands';

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
  }

  gameScreen.maskPictureRequest = function () {
    return this._maskPictureRequest;
  };

  gameScreen.unmaskPictureRequest =  function () {
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
      const baseSprite = this._pictureContainer.children
        .find(sprite => sprite.pictureId() === $gameScreen.maskPictureRequest().base);
      const maskSprite = this._pictureContainer.children
        .find(sprite => sprite.pictureId() === $gameScreen.maskPictureRequest().mask);
      if (baseSprite && maskSprite) {
        baseSprite.setMask(maskSprite);
      }
      $gameScreen.resetMaskPictureRequest();
    }
    if ($gameScreen.unmaskPictureRequest()) {
      const baseSprite = this._pictureContainer.children
        .find(sprite => sprite.pictureId() === $gameScreen.unmaskPictureRequest());
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
