import { Anime } from '../Anime.js';
import './proto/FilterProto.js';
import { fixPath } from '../../module/tokenmagic.js';

export class FilterDistortion extends PIXI.filters.DisplacementFilter {
	constructor(params) {
		// Loading distortion sprite
		var displacementSpriteMask;
		var spriteMaskPath;
		spriteMaskPath = params.hasOwnProperty('maskPath')
			? fixPath(params.maskPath)
			: 'modules/tokenmagic/fx/assets/distortion-1.png';
		displacementSpriteMask = PIXI.Sprite.from(spriteMaskPath);
		super(displacementSpriteMask);

		// Configuring distortion sprite
		this.sprite = displacementSpriteMask;
		this.wrapMode = PIXI.WRAP_MODES.REPEAT;
		this.position = new PIXI.Point();
		this.skew = new PIXI.Point();
		this.pivot = new PIXI.Point();
		this.anchorSet = 0.5;
		this.transition = null;
		this.padding = 15; // conf
		this.enabled = false;
		this.maskSpriteX = 0;
		this.maskSpriteY = 0;
		this.maskSpriteScaleX = 4;
		this.maskSpriteScaleY = 4;
		this.maskSpriteSkewX = 0;
		this.maskSpriteSkewY = 0;
		this.maskSpriteRotation = 0;
		this.zOrder = 4000;
		this.sticky = true;

		this.animated = {};
		this.setTMParams(params);
		this.maskPath = spriteMaskPath;
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
			this.sprite.anchor.set(this.anchorSet);
			this.sprite.texture.baseTexture.wrapMode = this.wrapMode;
		}
	}

	set maskSpriteX(value) {
		this.position.x = value;
	}

	set maskSpriteY(value) {
		this.position.y = value;
	}

	get maskSpriteX() {
		return this.position.x;
	}

	get maskSpriteY() {
		return this.position.y;
	}

	set maskSpriteScaleX(value) {
		this.scale.x = value;
	}

	set maskSpriteScaleY(value) {
		this.scale.y = value;
	}

	get maskSpriteScaleX() {
		return this.scale.x;
	}

	get maskSpriteScaleY() {
		return this.scale.y;
	}

	set maskSpriteRotation(value) {
		this.rotation = value;
	}

	get maskSpriteRotation() {
		return this.rotation;
	}

	set maskSpriteSkewX(value) {
		this.skew.x = value;
	}

	get maskSpriteSkewX() {
		return this.skew.x;
	}

	set maskSpriteSkewY(value) {
		this.skew.y = value;
	}

	get maskSpriteSkewY() {
		return this.skew.y;
	}

	set maskSpritePivotX(value) {
		this.pivot.x = value;
	}

	get maskSpritePivotX() {
		return this.pivot.x;
	}

	set maskSpritePivotY(value) {
		this.pivot.y = value;
	}

	get maskSpritePivotY() {
		return this.pivot.y;
	}

	handleTransform() {
		this.sprite.position.x = this.targetPlaceable.x + this.placeableImg.x + this.position.x;
		this.sprite.position.y = this.targetPlaceable.y + this.placeableImg.y + this.position.y;
		this.sprite.skew.x = this.skew.x;
		this.sprite.skew.x = this.skew.y;
		this.sprite.rotation = this.rotation;
		this.sprite.pivot.x = this.pivot.x;
		this.sprite.pivot.y = this.pivot.y;

		if (this.sticky) this.sprite.rotation += this.placeableImg.rotation;

		this.sprite.transform.updateTransform(canvas.stage.transform);
	}

	apply(filterManager, input, output, clear) {
		this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
		this.uniforms.scale.x = this.scale.x;
		this.uniforms.scale.y = this.scale.y;

		const wt = this.maskSprite.worldTransform;
		this.uniforms.rotation[0] = wt.a;
		this.uniforms.rotation[1] = wt.b;
		this.uniforms.rotation[2] = wt.c;
		this.uniforms.rotation[3] = wt.d;

		filterManager.applyFilter(this, input, output, clear);
	}
}
