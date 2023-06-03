import { matrix } from '../glsl/fragmentshaders/matrix.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterTransform extends CustomFilter {
	constructor(params) {
		let {
			rotation,
			twRadiusPercent,
			twAngle,
			twRotation,
			bpRadiusPercent,
			bpStrength,
			scale,
			scaleX,
			scaleY,
			pivotX,
			pivotY,
			translationX,
			translationY,
		} = Object.assign({}, FilterTransform.defaults, params);

		super(customVertex2D, matrix);

		this.uniforms.scale = new Float32Array([1.0, 1.0]);
		this.uniforms.pivot = new Float32Array([0.5, 0.5]);
		this.uniforms.translation = new Float32Array([0.0, 0.0]);

		Object.assign(this, {
			rotation,
			twRadiusPercent,
			twAngle,
			twRotation,
			bpRadiusPercent,
			bpStrength,
			scale,
			scaleX,
			scaleY,
			pivotX,
			pivotY,
			translationX,
			translationY,
		});

		this.zOrder = 1000;
		this.autoFit = false;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get rotation() {
		return this.uniforms.rotation;
	}

	set rotation(value) {
		this.uniforms.rotation = value;
	}

	get twRadiusPercent() {
		return this.uniforms.twRadius * 200;
	}

	set twRadiusPercent(value) {
		this.uniforms.twRadius = value / 200;
	}

	get twAngle() {
		return this.uniforms.twAngle;
	}

	set twAngle(value) {
		this.uniforms.twAngle = value;
	}

	get twRotation() {
		return this.uniforms.twAngle * (180 / Math.PI);
	}

	set twRotation(value) {
		this.uniforms.twAngle = value * (Math.PI / 180);
	}

	get bpRadiusPercent() {
		return this.uniforms.bpRadius * 200;
	}

	set bpRadiusPercent(value) {
		this.uniforms.bpRadius = value / 200;
	}

	get bpStrength() {
		return this.uniforms.bpStrength;
	}

	set bpStrength(value) {
		this.uniforms.bpStrength = value;
	}

	get scale() {
		// a little hack (we get only x)
		return this.uniforms.scale[0];
	}

	set scale(value) {
		this.uniforms.scale[1] = this.uniforms.scale[0] = value;
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

	get pivotX() {
		return this.uniforms.pivot[0];
	}

	set pivotX(value) {
		this.uniforms.pivot[0] = value;
	}

	get pivotY() {
		return this.uniforms.pivot[1];
	}

	set pivotY(value) {
		this.uniforms.pivot[1] = value;
	}

	get translationX() {
		return this.uniforms.translation[0];
	}

	set translationX(value) {
		this.uniforms.translation[0] = value;
	}

	get translationY() {
		return this.uniforms.translation[1];
	}

	set translationY(value) {
		this.uniforms.translation[1] = value;
	}
}

FilterTransform.defaults = {
	rotation: 0.0,
	twRadiusPercent: 0,
	twAngle: 0,
	bpRadiusPercent: 0,
	bpStrength: 0,
	scaleX: 1,
	scaleY: 1,
	pivotX: 0.5,
	pivotY: 0.5,
	translationX: 0,
	translationY: 0,
};
