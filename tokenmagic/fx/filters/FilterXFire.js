import { burnXFire } from '../glsl/fragmentshaders/xfire.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterXFire extends CustomFilter {
	constructor(params) {
		let {
			time,
			color,
			color1,
			color2,
			color3,
			color4,
			amplitude,
			dispersion,
			blend,
			scaleX,
			scaleY,
			alphaDiscard,
			discardThreshold,
			chromatic,
			inlay,
		} = Object.assign({}, FilterXFire.defaults, params);

		// using specific vertex shader and fragment shader
		super(customVertex2D, burnXFire);

		this.uniforms.color = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.color1 = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.color2 = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.color3 = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.color4 = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.scale = new Float32Array([1.0, 1.0]);

		Object.assign(this, {
			time,
			color,
			color1,
			color2,
			color3,
			color4,
			amplitude,
			dispersion,
			blend,
			scaleX,
			scaleY,
			alphaDiscard,
			discardThreshold,
			chromatic,
			inlay,
		});

		this.zOrder = 145;
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

	get color1() {
		return PIXI.utils.rgb2hex(this.uniforms.color1);
	}

	set color1(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color1);
	}

	get color2() {
		return PIXI.utils.rgb2hex(this.uniforms.color2);
	}

	set color2(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color2);
	}

	get color3() {
		return PIXI.utils.rgb2hex(this.uniforms.color3);
	}

	set color3(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color3);
	}

	get color4() {
		return PIXI.utils.rgb2hex(this.uniforms.color4);
	}

	set color4(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color4);
	}

	get amplitude() {
		return this.uniforms.amplitude;
	}

	set amplitude(value) {
		this.uniforms.amplitude = value;
	}

	get dispersion() {
		return this.uniforms.dispersion;
	}

	set dispersion(value) {
		this.uniforms.dispersion = value;
	}

	get blend() {
		return this.uniforms.blend;
	}

	set blend(value) {
		this.uniforms.blend = Math.floor(value);
	}

	get scaleX() {
		return this.uniforms.scale[0];
	}

	set scaleX(value) {
		this.uniforms.scale[0] = value;
	}

	get scaleY() {
		return this.uniforms.scale[1];
	}

	set scaleY(value) {
		this.uniforms.scale[1] = value;
	}

	get alphaDiscard() {
		return this.uniforms.alphaDiscard;
	}

	set alphaDiscard(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.alphaDiscard = value;
		}
	}

	get discardThreshold() {
		return this.uniforms.discardThreshold;
	}

	set discardThreshold(value) {
		this.uniforms.discardThreshold = value;
	}

	get chromatic() {
		return this.uniforms.chromatic;
	}

	set chromatic(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.chromatic = value;
		}
	}

	get inlay() {
		return this.uniforms.inlay;
	}

	set inlay(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.inlay = value;
		}
	}
}

FilterXFire.defaults = {
	time: 0,
	color: 0x000000,
	color1: 0x250000,
	color2: 0xb20000,
	color3: 0x330000,
	color4: 0xffe500,
	amplitude: 1,
	dispersion: 0.25,
	blend: 2,
	scaleX: 1,
	scaleY: 1,
	discardThreshold: 0.1,
	alphaDiscard: false,
	chromatic: false,
	inlay: false,
};
