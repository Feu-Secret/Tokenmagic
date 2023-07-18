import { cosmicRayFrag } from '../glsl/fragmentshaders/cosmicray.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterRays extends CustomFilter {
	constructor(params) {
		let { time, color, divisor, alpha, anchorX, anchorY, dimX, dimY, alphaDiscard } = Object.assign(
			{},
			FilterRays.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, cosmicRayFrag);

		this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);
		this.uniforms.anchor = new Float32Array([0.5, 0.5]);
		this.uniforms.dimensions = new Float32Array([1.0, 1.0]);

		Object.assign(this, {
			time,
			color,
			divisor,
			alpha,
			anchorX,
			anchorY,
			dimX,
			dimY,
			alphaDiscard,
		});

		this.zOrder = 120;
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

	get alpha() {
		return this.uniforms.color[3];
	}

	set alpha(value) {
		if (value >= 0 && value <= 1) {
			this.uniforms.color[3] = value;
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

	get alphaDiscard() {
		return this.uniforms.alphaDiscard;
	}

	set alphaDiscard(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.alphaDiscard = value;
		}
	}
}

FilterRays.defaults = {
	time: 0.0,
	color: 0xff8010,
	divisor: 16,
	alpha: 0.55,
	anchorX: 0.5,
	anchorY: 0.5,
	dimX: 100,
	dimY: 100,
	alphaDiscard: false,
};
