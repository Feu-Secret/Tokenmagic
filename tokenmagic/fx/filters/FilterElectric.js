import { zapElectricity } from '../glsl/fragmentshaders/electricity.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterElectric extends CustomFilter {
	constructor(params) {
		let { time, blend, color } = Object.assign({}, FilterElectric.defaults, params);

		var shaderFragment;
		if (params.hasOwnProperty('intensity') && typeof params.intensity === 'number') {
			var intensityVal = Math.floor(params.intensity);
			shaderFragment = zapElectricity.replace('#define INTENSITY 5', '#define INTENSITY ' + intensityVal);
		} else {
			shaderFragment = zapElectricity;
		}

		super(customVertex2D, shaderFragment);

		this.uniforms.color = new Float32Array([1.0, 1.0, 1.0, 1.0]);
		this.uniforms.blend = 2;

		Object.assign(this, {
			time,
			blend,
			color,
		});

		this.zOrder = 160;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}

		this.quality = 0.5;
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

	get blend() {
		return this.uniforms.blend;
	}

	set blend(value) {
		this.uniforms.blend = Math.floor(value);
	}
}

FilterElectric.defaults = {
	time: 0.0,
	blend: 1,
	color: 0xffffff,
};
