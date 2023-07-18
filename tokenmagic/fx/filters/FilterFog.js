import { innerFog } from '../glsl/fragmentshaders/fog.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';

export class FilterFog extends CustomFilter {
	constructor(params) {
		let { time, color, density, dimX, dimY } = Object.assign({}, FilterFog.defaults, params);

		// specific vertex and fragment shaders
		super(customVertex2D, innerFog);

		this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);
		this.uniforms.dimensions = new Float32Array([1.0, 1.0]);

		Object.assign(this, {
			time,
			color,
			density,
			dimX,
			dimY,
		});

		this.zOrder = 190;
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

	get density() {
		return this.uniforms.density;
	}

	set density(value) {
		this.uniforms.density = value;
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
}

FilterFog.defaults = {
	time: 0.0,
	color: 0xffffff,
	density: 0.5,
	dimX: 1.0,
	dimY: 1.0,
};
