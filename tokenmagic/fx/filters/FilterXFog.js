import { xFog } from '../glsl/fragmentshaders/xfog.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';

export class FilterXFog extends CustomFilter {
	constructor(params) {
		let { time, color, alphaDiscard } = Object.assign({}, FilterXFog.defaults, params);

		// specific vertex and fragment shaders
		super(customVertex2D, xFog);

		this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);

		Object.assign(this, {
			time,
			color,
			alphaDiscard,
		});

		this.zOrder = 230;
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

	get alphaDiscard() {
		return this.uniforms.alphaDiscard;
	}

	set alphaDiscard(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.alphaDiscard = value;
		}
	}
}

FilterXFog.defaults = {
	time: 0.0,
	color: 0xffffff,
	alphaDiscard: false,
};
