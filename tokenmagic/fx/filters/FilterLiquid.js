import { liquid } from '../glsl/fragmentshaders/liquid.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterLiquid extends CustomFilter {
	constructor(params) {
		let { time, color, scale, intensity, blend, spectral, alphaDiscard } = Object.assign(
			{},
			FilterLiquid.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, liquid);

		this.uniforms.color = new Float32Array([0.1, 0.45, 1.0]);

		Object.assign(this, {
			time,
			color,
			scale,
			intensity,
			blend,
			spectral,
			alphaDiscard,
		});

		this.zOrder = 180;
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

	get scale() {
		return this.uniforms.scale;
	}

	set scale(value) {
		this.uniforms.scale = value;
	}

	get color() {
		return PIXI.utils.rgb2hex(this.uniforms.color);
	}

	set color(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color);
	}

	get intensity() {
		return this.uniforms.intensity;
	}

	set intensity(value) {
		this.uniforms.intensity = value;
	}

	get blend() {
		return this.uniforms.blend;
	}

	set blend(value) {
		this.uniforms.blend = Math.floor(value);
	}

	get spectral() {
		return this.uniforms.spectral;
	}

	set spectral(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.spectral = value;
		}
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

FilterLiquid.defaults = {
	time: 0.0,
	color: 0x0595ff,
	scale: 1,
	intensity: 5,
	blend: 4,
	spectral: false,
	alphaDiscard: false,
};
