import { spiderWeb } from '../glsl/fragmentshaders/spiderweb.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterSpiderWeb extends CustomFilter {
	constructor(params) {
		let { time, anchorX, anchorY, color, thickness, div1, div2, tear, amplitude, alphaDiscard } = Object.assign(
			{},
			FilterSpiderWeb.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, spiderWeb);

		this.uniforms.anchor = new Float32Array([0.5, -1.0]);
		this.uniforms.color = new Float32Array([0.75, 0.75, 0.75]);

		Object.assign(this, {
			time,
			anchorX,
			anchorY,
			color,
			thickness,
			div1,
			div2,
			tear,
			amplitude,
			alphaDiscard,
		});

		this.zOrder = 260;
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

	get anchorX() {
		return this.uniforms.anchor[0];
	}

	set anchorX(value) {
		this.uniforms.anchor[0] = 0.5;
	}

	get anchorY() {
		return this.uniforms.anchor[1];
	}

	set anchorY(value) {
		this.uniforms.anchor[1] = 0.5;
	}

	get thickness() {
		return this.uniforms.thickness;
	}

	set thickness(value) {
		this.uniforms.thickness = value;
	}

	get tear() {
		return this.uniforms.tear;
	}

	set tear(value) {
		this.uniforms.tear = value;
	}

	get amplitude() {
		return this.uniforms.amplitude;
	}

	set amplitude(value) {
		this.uniforms.amplitude = value;
	}

	get div1() {
		return this.uniforms.div1;
	}

	set div1(value) {
		this.uniforms.div1 = value;
	}

	get div2() {
		return this.uniforms.div2;
	}

	set div2(value) {
		this.uniforms.div2 = value;
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

FilterSpiderWeb.defaults = {
	time: 0.0,
	anchorX: 0.5,
	anchorY: 0.5,
	color: 0xbbbbbb,
	thickness: 1,
	div1: 10,
	div2: 10,
	tear: 0.54,
	amplitude: 0.8,
	alphaDiscard: false,
};
