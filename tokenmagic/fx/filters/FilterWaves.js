import { magicWaves } from '../glsl/fragmentshaders/waves.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterWaves extends CustomFilter {
	constructor(params) {
		let { time, color, inward, frequency, strength, minIntensity, maxIntensity, anchorX, anchorY } = Object.assign(
			{},
			FilterWaves.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, magicWaves);

		this.uniforms.color = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.anchor = new Float32Array([0.5, 0.5]);

		Object.assign(this, {
			time,
			color,
			inward,
			frequency,
			strength,
			minIntensity,
			maxIntensity,
			anchorX,
			anchorY,
		});

		this.zOrder = 280;
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

	get inward() {
		return this.uniforms.inward;
	}

	set inward(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.inward = value;
		}
	}

	get anchorX() {
		return this.uniforms.anchor[0];
	}

	set anchorX(value) {
		this.uniforms.anchor[0] = value;
	}

	get anchorY() {
		return this.uniforms.anchor[1];
	}

	set anchorY(value) {
		this.uniforms.anchor[1] = value;
	}

	get frequency() {
		return this.uniforms.frequency;
	}

	set frequency(value) {
		this.uniforms.frequency = value;
	}

	get strength() {
		return this.uniforms.strength;
	}

	set strength(value) {
		this.uniforms.strength = value;
	}

	get minIntensity() {
		return this.uniforms.minIntensity;
	}

	set minIntensity(value) {
		this.uniforms.minIntensity = value;
	}

	get maxIntensity() {
		return this.uniforms.maxIntensity;
	}

	set maxIntensity(value) {
		this.uniforms.maxIntensity = value;
	}
}

FilterWaves.defaults = {
	time: 0,
	color: 0xffffff,
	inward: false,
	frequency: 35,
	strength: 0.01,
	minIntensity: 1.2,
	maxIntensity: 3.5,
	anchorX: 0.5,
	anchorY: 0.5,
};
