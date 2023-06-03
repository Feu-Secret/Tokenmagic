import { polymorph } from '../glsl/fragmentshaders/polymorph.js';
import { customVertex2DSampler } from '../glsl/vertexshaders/customvertex2DSampler.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';
import { fixPath } from '../../module/tokenmagic.js';

export class FilterPolymorph extends CustomFilter {
	constructor(params) {
		let { imagePath, progress, magnify, type } = Object.assign({}, FilterPolymorph.defaults, params);

		const targetSpriteMatrix = new PIXI.Matrix();

		// using specific vertex shader and fragment shader
		super(customVertex2DSampler, polymorph);

		// vertex uniforms
		this.uniforms.targetUVMatrix = targetSpriteMatrix;

		// fragment uniforms
		this.uniforms.inputClampTarget = new Float32Array([0, 0, 0, 0]);

		// to store sprite matrix from the filter manager (and send to vertex)
		this.targetSpriteMatrix = targetSpriteMatrix;

		Object.assign(this, {
			imagePath: fixPath(imagePath),
			progress,
			magnify,
			type,
		});

		this.zOrder = 1;
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

	get progress() {
		return this.uniforms.progress * 100;
	}

	set progress(value) {
		this.uniforms.progress = Math.min(Math.max(value * 0.01, 0), 1);
	}

	get magnify() {
		return this.uniforms.magnify;
	}

	set magnify(value) {
		this.uniforms.magnify = Math.min(Math.max(value, 0.1), 100);
	}

	get type() {
		return this.uniforms.type;
	}

	set type(value) {
		this.uniforms.type = Math.floor(value);
	}

	get uSamplerTarget() {
		return this.uniforms.uSamplerTarget;
	}

	set uSamplerTarget(value) {
		this.uniforms.uSamplerTarget = value;
	}

	_setTargetSpriteSize() {
		const sprite = this.targetSprite;
		let ratioW = this.placeableImg._texture.baseTexture.realWidth / sprite.texture.baseTexture.realWidth;
		sprite.width = sprite.texture.baseTexture.realWidth * ratioW;
		sprite.height = sprite.texture.baseTexture.realHeight * ratioW;
		sprite.anchor.set(0.5);
	}

	assignTexture() {
		if (this.hasOwnProperty('imagePath')) {
			let tex = PIXI.Texture.from(this.imagePath);
			let sprite = new PIXI.Sprite(tex);

			sprite.renderable = false;
			this.targetSprite = sprite;

			// We may need to wait for the texture to be loaded before accessing it's width and height
			// In such a case register an update listener which should be called when the texture is loaded/becomes valid
			if (tex.valid) {
				this._setTargetSpriteSize();
			} else {
				tex.on('update', () => {
					this._setTargetSpriteSize();
				});
			}

			this.uSamplerTarget = sprite._texture;
			this.placeableImg.addChild(sprite);
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
			this.uniforms.targetUVMatrix = filterManager
				.calculateSpriteMatrix(this.targetSpriteMatrix, targetSprite)
				.prepend(tex.uvMatrix.mapCoord);
			this.uniforms.inputClampTarget = tex.uvMatrix.uClampFrame;
		}

		super.apply(filterManager, input, output, clear);
	}

	// override
	destroy() {
		super.destroy();
		if (this.placeableImg) this.placeableImg.removeChild(this.targetSprite);
		this.targetSprite.destroy({ children: true, texture: false, baseTexture: false });
	}
}

FilterPolymorph.defaults = {
	progress: 0,
	magnify: 1,
	type: 1,
};
