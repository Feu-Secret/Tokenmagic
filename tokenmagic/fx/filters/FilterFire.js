import { burnFire } from '../glsl/fragmentshaders/fire.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterFire extends CustomFilter {
	constructor(params) {
		let { time, color, amplitude, intensity, fireBlend, blend, anchorX, anchorY, alphaDiscard } = Object.assign(
			{},
			FilterFire.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, burnFire);

		this.uniforms.color = new Float32Array([1.0, 1.0, 1.0]);
		this.uniforms.anchor = new Float32Array([1.0, 1.0]);

		Object.assign(this, {
			time,
			color,
			amplitude,
			intensity,
			fireBlend,
			blend,
			anchorX,
			anchorY,
			alphaDiscard,
		});

		this.zOrder = 150;
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

	get amplitude() {
		return this.uniforms.amplitude;
	}

	set amplitude(value) {
		this.uniforms.amplitude = value;
	}

	get intensity() {
		return this.uniforms.intensity;
	}

	set intensity(value) {
		this.uniforms.intensity = value;
	}

	get fireBlend() {
		return this.uniforms.fireBlend;
	}

	set fireBlend(value) {
		this.uniforms.fireBlend = Math.floor(value);
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

	get alphaDiscard() {
		return this.uniforms.alphaDiscard;
	}

	set alphaDiscard(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.alphaDiscard = value;
		}
	}
}

FilterFire.defaults = {
	time: 0,
	color: 0xffffff,
	amplitude: 1,
	intensity: 1,
	fireBlend: 1,
	blend: 2,
	anchorX: 1,
	anchorY: 1,
	alphaDiscard: false,
};
