import { xRay } from '../glsl/fragmentshaders/xray.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterXRays extends CustomFilter {
	constructor(params) {
		let { time, color, divisor, intensity, blend, anchorX, anchorY, dimX, dimY } = Object.assign(
			{},
			FilterXRays.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, xRay);

		this.uniforms.color = new Float32Array([1.0, 0.4, 0.1]);
		this.uniforms.anchor = new Float32Array([0.5, -1.0]);
		this.uniforms.dimensions = new Float32Array([1.0, 1.0]);

		Object.assign(this, {
			time,
			color,
			divisor,
			intensity,
			blend,
			anchorX,
			anchorY,
			dimX,
			dimY,
		});

		this.zOrder = 130;
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

	get divisor() {
		return this.uniforms.divisor;
	}

	set divisor(value) {
		this.uniforms.divisor = value;
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

FilterXRays.defaults = {
	time: 0.0,
	color: 0xff8010,
	divisor: 40,
	intensity: 0.1,
	blend: 8,
	anchorX: 0.5,
	anchorY: -1.0,
	dimX: 1,
	dimY: 1,
};
