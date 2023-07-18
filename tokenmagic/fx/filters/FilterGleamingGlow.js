import { magicGlow } from '../glsl/fragmentshaders/magicglow.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterGleamingGlow extends CustomFilter {
	constructor(params) {
		let { time, color, thickness, scale, auraIntensity, subAuraIntensity, discard, threshold, auraType } =
			Object.assign({}, FilterGleamingGlow.defaults, params);

		// using specific vertex shader and fragment shader
		super(customVertex2D, magicGlow);

		this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 1.0]);
		this.uniforms.thickness = new Float32Array([0.01, 0.01]);

		Object.assign(this, {
			time,
			color,
			thickness,
			scale,
			auraIntensity,
			subAuraIntensity,
			discard,
			threshold,
			auraType,
		});

		this.zOrder = 80;
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

	get scale() {
		return this.uniforms.scale;
	}

	set scale(value) {
		this.uniforms.scale = value;
	}

	get auraIntensity() {
		return this.uniforms.auraIntensity;
	}

	set auraIntensity(value) {
		this.uniforms.auraIntensity = value;
	}

	get subAuraIntensity() {
		return this.uniforms.subAuraIntensity;
	}

	set subAuraIntensity(value) {
		this.uniforms.subAuraIntensity = value;
	}

	get threshold() {
		return this.uniforms.threshold;
	}

	set threshold(value) {
		this.uniforms.threshold = value;
	}

	get color() {
		return PIXI.utils.rgb2hex(this.uniforms.color);
	}

	set color(value) {
		new PIXI.Color(value).toRgbArray(this.uniforms.color);
	}

	get discard() {
		return this.uniforms.holes;
	}

	set discard(value) {
		if (!(value == null) && typeof value === 'boolean') {
			this.uniforms.holes = value;
		}
	}

	get auraType() {
		return this.uniforms.auraType;
	}

	set auraType(value) {
		this.uniforms.auraType = Math.floor(value);
	}

	apply(filterManager, input, output, clear) {
		this.uniforms.thickness[0] = (this.thickness * this.targetPlaceable.worldTransform.a) / input._frame.width;
		this.uniforms.thickness[1] = (this.thickness * this.targetPlaceable.worldTransform.a) / input._frame.height;
		super.apply(filterManager, input, output, clear);
	}
}

FilterGleamingGlow.defaults = {
	time: 0,
	color: 0xff8010,
	thickness: 5,
	scale: 1,
	auraIntensity: 1,
	subAuraIntensity: 1,
	discard: false,
	threshold: 0.5,
	auraType: 1,
};
