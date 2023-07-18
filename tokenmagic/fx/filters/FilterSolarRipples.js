import { solarRipples } from '../glsl/fragmentshaders/ripples.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterSolarRipples extends CustomFilter {
	constructor(params) {
		let { time, color, amplitude, intensity, alphaDiscard, _octaves } = Object.assign(
			{},
			FilterSolarRipples.defaults,
			params
		);

		if (typeof _octaves !== 'number') _octaves = FilterSolarRipples.defaults._octave;
		let fragment = solarRipples.replace(`#define OCTAVES 3`, `#define OCTAVES ${_octaves}`);

		// using specific vertex shader and fragment shader
		super(customVertex2D, fragment);

		this.uniforms.color = new Float32Array([0.75, 0.75, 0.75]);

		Object.assign(this, {
			time,
			color,
			amplitude,
			intensity,
			alphaDiscard,
		});

		this.zOrder = 250;
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

	get amplitude() {
		return this.uniforms.amplitude;
	}

	set amplitude(value) {
		this.uniforms.amplitude = value;
	}

	get intensity() {
		return this.uniforms.intensity;
	}

	set intensity(value) {
		this.uniforms.intensity = value;
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

FilterSolarRipples.defaults = {
	time: 0.0,
	color: 0xbbbbbb,
	amplitude: 1,
	intensity: 0.001,
	alphaDiscard: false,
	_octave: 3,
};
