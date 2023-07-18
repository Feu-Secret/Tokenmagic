import { innerSmoke } from '../glsl/fragmentshaders/smoke.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterSmoke extends CustomFilter {
	constructor(params) {
		let { time, color, blend, dimX, dimY } = Object.assign({}, FilterSmoke.defaults, params);

		// using specific vertex shader and fragment shader
		super(customVertex2D, innerSmoke);

		this.uniforms.color = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.scale = new Float32Array([1.0, 1.0]);

		Object.assign(this, {
			time,
			color,
			blend,
			dimX,
			dimY,
		});

		this.zOrder = 200;
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

	get blend() {
		return this.uniforms.blend;
	}

	set blend(value) {
		this.uniforms.blend = Math.floor(value);
	}

	get dimX() {
		return this.uniforms.scale[0];
	}

	set dimX(value) {
		this.uniforms.scale[0] = value;
	}

	get dimY() {
		return this.uniforms.scale[1];
	}

	set dimY(value) {
		this.uniforms.scale[1] = value;
	}
}

FilterSmoke.defaults = {
	time: 0,
	color: 0xffffff,
	blend: 13,
	dimX: 1,
	dimY: 1,
};
