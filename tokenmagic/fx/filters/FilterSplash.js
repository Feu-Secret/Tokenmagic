import { splash } from '../glsl/fragmentshaders/splash.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterSplash extends CustomFilter {
	constructor(params) {
		let { time, seed, spread, splashFactor, color, dimX, dimY, blend, cut, textureAlphaBlend, anchorX, anchorY } =
			Object.assign({}, FilterSplash.defaults, params);

		// using specific vertex shader and fragment shader
		super(customVertex2D, splash);

		this.uniforms.color = new Float32Array([1.0, 0.05, 0.05]);
		this.uniforms.dimensions = new Float32Array([1.0, 1.0]);
		this.uniforms.anchor = new Float32Array([0.0, 0.0]);

		Object.assign(this, {
			time,
			seed,
			spread,
			splashFactor,
			color,
			dimX,
			dimY,
			blend,
			cut,
			textureAlphaBlend,
			anchorX,
			anchorY,
		});

		this.zOrder = 5;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get time() {
		return this.uniforms.time;
	}

	set time(value) {
		this.uniforms.time = value;
	}

	get color() {
		return PIXI.utils.rgb2hex(this.uniforms.color);
	}

	set color(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color);
	}

	get seed() {
		return this.uniforms.seed;
	}

	set seed(value) {
		this.uniforms.seed = value;
	}

	get spread() {
		return this.uniforms.spread;
	}

	set spread(value) {
		this.uniforms.spread = value;
	}

	get splashFactor() {
		return this.uniforms.splashFactor;
	}

	set splashFactor(value) {
		this.uniforms.splashFactor = value;
	}

	get dimX() {
		return this.uniforms.dimensions[0];
	}

	set dimX(value) {
		this.uniforms.dimensions[0] = value;
	}

	get dimY() {
		return this.uniforms.dimensions[1];
	}

	set dimY(value) {
		this.uniforms.dimensions[1] = value;
	}

	get anchorY() {
		return this.uniforms.anchor[1] + 0.5;
	}

	set anchorY(value) {
		this.uniforms.anchor[1] = value - 0.5;
	}

	get anchorX() {
		return this.uniforms.anchor[0] + 0.5;
	}

	set anchorX(value) {
		this.uniforms.anchor[0] = value - 0.5;
	}

	get blend() {
		return this.uniforms.blend;
	}

	set blend(value) {
		this.uniforms.blend = Math.floor(value);
	}

	get cut() {
		return this.uniforms.cut;
	}

	set cut(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.cut = value;
		}
	}

	get textureAlphaBlend() {
		return this.uniforms.textureAlphaBlend;
	}

	set textureAlphaBlend(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.textureAlphaBlend = value;
		}
	}
}

FilterSplash.defaults = {
	time: Math.random() * 2000,
	color: 0xf00505,
	seed: 0.1,
	spread: 5,
	splashFactor: 2,
	dimX: 1,
	dimY: 1,
	blend: 8,
	cut: false,
	textureAlphaBlend: false,
	anchorX: 0.5,
	anchorY: 0.5,
};
