import {sprite} from "../glsl/fragmentshaders/sprite.js";
import {customVertex2DSampler} from "../glsl/vertexshaders/customvertex2DSampler.js";
import {CustomFilter} from "./CustomFilter.js";
import {Anime} from "../Anime.js";
import "./proto/FilterProto.js";
import {fixPath} from "../../module/tokenmagic.js";

export class FilterSprite extends CustomFilter {

  tex = null;

  constructor(params) {
    let {
      imagePath,
      color,
      colorize,
      inverse,
      top,
      rotation,
      twRadiusPercent,
      twAngle,
      twRotation,
      bpRadiusPercent,
      bpStrength,
      scale,
      scaleX,
      scaleY,
      translationX,
      translationY,
      play,
      loop
    } = Object.assign({}, FilterSprite.defaults, params);

    const targetSpriteMatrix = new PIXI.Matrix();

    // using specific vertex shader and fragment shader
    super(customVertex2DSampler, sprite);

    // vertex uniforms
    this.uniforms.targetUVMatrix = targetSpriteMatrix;

    // fragment uniforms
    this.uniforms.inputClampTarget = new Float32Array([0, 0, 0, 0]);
    this.uniforms.color = new Float32Array([0.0, 0.0, 0.0]);
    this.uniforms.scale = new Float32Array([1.0, 1.0]);
    this.uniforms.translation = new Float32Array([0.0, 0.0]);

    // to store sprite matrix from the filter manager (and send to vertex)
    this.targetSpriteMatrix = targetSpriteMatrix;

    Object.assign(this, {
      imagePath: fixPath(imagePath),
      color,
      colorize,
      inverse,
      top,
      rotation,
      twRadiusPercent,
      twAngle,
      twRotation,
      bpRadiusPercent,
      bpStrength,
      scale,
      scaleX,
      scaleY,
      translationX,
      translationY,
      play,
      loop
    });

    this.zOrder = 0;
    this.autoFit = false;
    this.animated = {};
    this.setTMParams(params);
    if ( !this.dummy ) {
      this.anime = new Anime(this);
      this.normalizeTMParams();
      this.assignTexture();
    }
  }

  _play = true;
  _loop = true;

  get play() {
    return this._play;
  }

  set play(value) {
    if ( !(value == null) && typeof value === "boolean" ) {
      this._play = value;
      this._playVideo(this._play);
    }
  }

  get loop() {
    return this._loop;
  }

  set loop(value) {
    if ( !(value == null) && typeof value === "boolean" ) {
      this._loop = value;
      this._playVideo(this._play);
    }
  }

  get color() {
    return PIXI.utils.rgb2hex(this.uniforms.color);
  }

  set color(value) {
    PIXI.utils.hex2rgb(value, this.uniforms.color);
  }

  get colorize() {
    return this.uniforms.colorize;
  }

  set colorize(value) {
    if ( !(value == null) && typeof value === "boolean" ) {
      this.uniforms.colorize = value;
    }
  }

  get inverse() {
    return this.uniforms.inverse;
  }

  set inverse(value) {
    if ( !(value == null) && typeof value === "boolean" ) {
      this.uniforms.inverse = value;
    }
  }

  get top() {
    return this.uniforms.top;
  }

  set top(value) {
    if ( !(value == null) && typeof value === "boolean" ) {
      this.uniforms.top = value;
    }
  }

  get rotation() {
    return this.uniforms.rotation;
  }

  set rotation(value) {
    this.uniforms.rotation = value;
  }

  get twRadiusPercent() {
    return this.uniforms.twRadius * 200;
  }

  set twRadiusPercent(value) {
    this.uniforms.twRadius = value / 200;
  }

  get twAngle() {
    return this.uniforms.twAngle;
  }

  set twAngle(value) {
    this.uniforms.twAngle = value;
  }

  get twRotation() {
    return this.uniforms.twAngle * (180 / Math.PI);
  }

  set twRotation(value) {
    this.uniforms.twAngle = value * (Math.PI / 180);
  }

  get bpRadiusPercent() {
    return this.uniforms.bpRadius * 200;
  }

  set bpRadiusPercent(value) {
    this.uniforms.bpRadius = value / 200;
  }

  get bpStrength() {
    return this.uniforms.bpStrength;
  }

  set bpStrength(value) {
    this.uniforms.bpStrength = value;
  }

  get scale() {
    // a little hack (we get only x)
    return this.uniforms.scale[0];
  }

  set scale(value) {
    this.uniforms.scale[1] = this.uniforms.scale[0] = value;
  }

  get scaleX() {
    return this.uniforms.scale[0];
  }

  set scaleX(value) {
    this.uniforms.scale[0] = value;
  }

  get scaleY() {
    return this.uniforms.scale[1];
  }

  set scaleY(value) {
    this.uniforms.scale[1] = value;
  }

  get translationX() {
    return this.uniforms.translation[0];
  }

  set translationX(value) {
    this.uniforms.translation[0] = value;
  }

  get translationY() {
    return this.uniforms.translation[1];
  }

  set translationY(value) {
    this.uniforms.translation[1] = value;
  }

  get uSamplerTarget() {
    return this.uniforms.uSamplerTarget;
  }

  set uSamplerTarget(value) {
    this.uniforms.uSamplerTarget = value;
  }

  _playVideo(value) {
    // Play if baseTexture resource is a video
    if ( this.tex ) {
      const source = getProperty(this.tex, "baseTexture.resource.source");
      if ( source && (source.tagName === "VIDEO") ) {
        source.loop = this._loop;
        source.muted = true;
        if ( value ) game.video.play(source);
        else game.video.stop(source);
      }
    }
  }

  assignTexture() {
    if ( this.hasOwnProperty("imagePath") ) {
      this.tex = PIXI.Texture.from(this.imagePath);

      let sprite = new PIXI.Sprite(this.tex);

      sprite.renderable = false;
      if ( this.placeableImg._texture ) {
        sprite.width = this.placeableImg._texture.baseTexture.realWidth;
        sprite.height = this.placeableImg._texture.baseTexture.realHeight;
        sprite.anchor.set(0.5);
      }
      else {
        sprite.width = this.placeableImg.width;
        sprite.height = this.placeableImg.height;
      }

      this.targetSprite = sprite;
      this.uSamplerTarget = sprite._texture;
      this.placeableImg.addChild(sprite);

      this._playVideo(this._play);
    }
  }

  // override
  apply(filterManager, input, output, clear) {
    const targetSprite = this.targetSprite;
    const tex = targetSprite._texture;

    if ( tex.valid ) {
      if ( !tex.uvMatrix ) tex.uvMatrix = new PIXI.TextureMatrix(tex, 0.0);
      tex.uvMatrix.update();

      this.uniforms.uSamplerTarget = tex;
      this.uniforms.targetUVMatrix =
        filterManager.calculateSpriteMatrix(this.targetSpriteMatrix, targetSprite)
          .prepend(tex.uvMatrix.mapCoord);
      this.uniforms.inputClampTarget = tex.uvMatrix.uClampFrame;
    }

    super.apply(filterManager, input, output, clear);
  }

  // override
  destroy() {
    super.destroy();
    if ( !this.targetSprite.destroyed ) this.targetSprite.destroy({children: true, texture: false, baseTexture: false});
  }
}

FilterSprite.defaults = {
  color: 0x000000,
  colorize: false,
  inverse: false,
  top: false,
  rotation: 0.0,
  twRadiusPercent: 0,
  twAngle: 0,
  bpRadiusPercent: 0,
  bpStrength: 0,
  scaleX: 1,
  scaleY: 1,
  translationX: 0,
  translationY: 0,
  play: true,
  loop: true
};




