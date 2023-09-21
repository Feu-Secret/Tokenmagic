import { spritemask } from '../glsl/fragmentshaders/spritemask.js';
import { customVertex2DSampler } from '../glsl/vertexshaders/customvertex2DSampler.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';
import { fixPath } from '../../module/tokenmagic.js';

export class FilterSpriteMask extends CustomFilter {
	tex = null;

	constructor(params) {
		let {
			imagePath,
			alpha,
			repeat,
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
			loop,
			maintainAspectRatio,
			maintainScale,
		} = Object.assign({}, FilterSpriteMask.defaults, params);

		const targetSpriteMatrix = new PIXI.Matrix();

		// using specific vertex shader and fragment shader
		super(customVertex2DSampler, spritemask);

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
			alpha,
			repeat,
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
			loop,
			maintainAspectRatio,
			maintainScale,
		});

		this.zOrder = 0;
		this.autoFit = false;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	setTMParams(params) {
		super.setTMParams(params);
		if (!this.dummy && 'imagePath' in params) {
			this.assignTexture();
		}
	}

	_play = true;
	_loop = true;
	_maintainAspectRatio = false;
	_maintainScale = false;

	get play() {
		return this._play;
	}

	set play(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this._play = value;
			this._playVideo(this._play);
		}
	}

	get loop() {
		return this._loop;
	}

	set loop(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this._loop = value;
			this._playVideo(this._play);
		}
	}

	get maintainAspectRatio() {
		return this._maintainAspectRatio;
	}

	set maintainAspectRatio(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this._maintainAspectRatio = value;
		}
	}

	get maintainScale() {
		return this._maintainScale;
	}

	set maintainScale(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this._maintainScale = value;
		}
	}

	get alpha() {
		return this.uniforms.alpha;
	}

	set alpha(value) {
		this.uniforms.alpha = value;
	}

	get repeat() {
		return this.uniforms.repeat;
	}

	set repeat(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.repeat = value;
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

	async _playVideo(value) {
		// Play if baseTexture resource is a video
		if (this.tex) {
			const source = getProperty(this.tex, 'baseTexture.resource.source');
			if (source && source.tagName === 'VIDEO') {
				if (isNaN(source.duration)) {
					await new Promise((resolve) => {
						source.onloadedmetadata = () => resolve();
					});
				}
				if (value) game.video.play(source, { loop: this._loop, volume: 0 });
				else game.video.stop(source);
			}
		}
	}

	assignTexture() {
		if (this.hasOwnProperty('imagePath')) {
			// Destroy the previous sprite
			if (this.targetSprite && !this.targetSprite.destroyed)
				this.targetSprite.destroy({ children: true, texture: false, baseTexture: false });
			this.tex = PIXI.Texture.from(this.imagePath);

			let sprite = new PIXI.Sprite(this.tex);

			sprite.renderable = false;
			if (this.placeableImg._texture) {
				sprite.width = this.placeableImg._texture.baseTexture.realWidth;
				sprite.height = this.placeableImg._texture.baseTexture.realHeight;
				sprite.anchor.set(0.5);
			} else {
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

		if (tex.valid) {
			if (!tex.uvMatrix) tex.uvMatrix = new PIXI.TextureMatrix(tex, 0.0);
			tex.uvMatrix.update();

			this.uniforms.uSamplerTarget = tex;
			if (this.maintainScale) {
				let pScale = targetSprite.parent.scale;
				targetSprite.scale.set(1 / pScale.x, 1 / pScale.y);
			}

			let w = targetSprite.worldTransform;
			if (this.maintainAspectRatio) {
				let scale = Math.min(w.a, w.d);
				w.set(scale, w.b, w.c, scale, w.tx, w.ty);
			}

			this.uniforms.targetUVMatrix = filterManager.calculateSpriteMatrix(this.targetSpriteMatrix, targetSprite);
			this.uniforms.inputClampTarget = tex.uvMatrix.uClampFrame;
		}

		super.apply(filterManager, input, output, clear);
	}

	// override
	destroy() {
		super.destroy();
		if (!this.targetSprite.destroyed) this.targetSprite.destroy({ children: true, texture: false, baseTexture: false });
	}
}

FilterSpriteMask.defaults = {
	alpha: 1,
	repeat: false,
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
	loop: true,
	maintainAspectRatio: false,
	maintainScale: false,
};
