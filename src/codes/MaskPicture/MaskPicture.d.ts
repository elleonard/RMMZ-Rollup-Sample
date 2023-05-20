/// <reference path="../../typings/rmmz.d.ts" />

type MaskPictureRequest = {base: number, mask: number};

declare interface Game_Screen {
  _maskPictureRequest: MaskPictureRequest|undefined;
  _unmaskPictureRequest: number|undefined;

  maskPicture(base: number, mask: number): void;
  unmaskPicture(base: number): void;
  maskPictureRequest(): MaskPictureRequest|undefined;
  unmaskPictureRequest(): number|undefined;
  resetMaskPictureRequest(): void;
  resetUnmaskPictureRequest(): void;
}

declare interface Spriteset_Base {
  updateMask(): void;
}

declare interface Sprite_Picture {
  setMask<T extends PIXI.Container>(sprite: T): void;
  unmask(): void;
  pictureId(): number;
}
