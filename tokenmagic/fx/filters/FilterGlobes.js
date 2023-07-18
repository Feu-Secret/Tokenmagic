import { globes } from '../glsl/fragmentshaders/globes.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterGlobes extends CustomFilter {
	constructor(params) {
		let { time, color, scale, distortion, alphaDiscard } = Object.assign({}, FilterGlobes.defaults, params);

		// using specific vertex shader and fragment shader
		super(customVertex2D, globes);

		this.uniforms.color = new Float32Array([0.75, 0.75, 0.75]);

		Object.assign(this, {
			time,
			color,
			scale,
			distortion,
			alphaDiscard,
		});

		this.zOrder = 270;
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

	get scale() {
		return this.uniforms.scale;
	}

	set scale(value) {
		this.uniforms.scale = value;
	}

	get distortion() {
		return this.uniforms.distortion;
	}

	set distortion(value) {
		this.uniforms.distortion = value;
	}

	get alphaDiscard() {
		return this.uniforms.alphaDiscard;
	}

	set alphaDiscard(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.alphaDiscard = value;
		}
	}
}

FilterGlobes.defaults = {
	time: 0.0,
	color: 0xaa3050,
	scale: 20,
	distortion: 0.25,
	alphaDiscard: false,
};
