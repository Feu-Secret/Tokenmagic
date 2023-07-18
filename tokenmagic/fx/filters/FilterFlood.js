import { seaFlood } from '../glsl/fragmentshaders/flood.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterFlood extends CustomFilter {
	constructor(params) {
		let { time, scale, glint, billowy, color, shiftX, shiftY, tintIntensity } = Object.assign(
			{},
			FilterFlood.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, seaFlood);

		this.uniforms.waterColor = new Float32Array([0.0, 0.18, 0.54]);
		this.uniforms.shift = new Float32Array([0.0, 0.0]);

		Object.assign(this, {
			time,
			scale,
			glint,
			billowy,
			color,
			shiftX,
			shiftY,
			tintIntensity,
		});

		this.zOrder = 170;
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
		return PIXI.utils.rgb2hex(this.uniforms.waterColor);
	}

	set color(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.waterColor);
	}

	get scale() {
		return this.uniforms.scale;
	}

	set scale(value) {
		this.uniforms.scale = value;
	}

	get glint() {
		return this.uniforms.glint;
	}

	set glint(value) {
		this.uniforms.glint = value;
	}

	get billowy() {
		return this.uniforms.billowy;
	}

	set billowy(value) {
		this.uniforms.billowy = value;
	}

	get tintIntensity() {
		return this.uniforms.tintIntensity;
	}

	set tintIntensity(value) {
		this.uniforms.tintIntensity = value;
	}

	get shiftX() {
		return this.uniforms.shift[0];
	}

	set shiftX(value) {
		this.uniforms.shift[0] = value;
	}

	get shiftY() {
		this.uniforms.shift[1];
	}

	set shiftY(value) {
		this.uniforms.shift[1] = value;
	}
}

FilterFlood.defaults = {
	time: 0,
	glint: 0.5,
	scale: 70,
	billowy: 0.5,
	color: 0x0020a9,
	shiftX: 0,
	shiftY: 0,
	tintIntensity: 0.2,
};
