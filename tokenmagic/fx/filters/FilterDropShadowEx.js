import { CustomFilter } from './CustomFilter.js';
import { dropShadow } from '../glsl/fragmentshaders/dropshadow.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import './proto/FilterProto.js';

export class FilterDropShadowEx extends CustomFilter {
	shadowOnly;
	angle = 45;

	_distance = 5;
	_resolution = PIXI.settings.FILTER_RESOLUTION;
	_tintFilter;
	_blurFilter;

	constructor(options = {}) {
		super();

		const opt = options ? { ...FilterDropShadowEx.defaults, ...options } : FilterDropShadowEx.defaults;

		const { kernels, blur, quality, resolution } = opt;

		this._tintFilter = new PIXI.Filter(customVertex2D, dropShadow);
		this._tintFilter.uniforms.color = new Float32Array(4);
		this._tintFilter.uniforms.shift = new PIXI.Point();
		this._tintFilter.resolution = resolution;
		this._blurFilter = kernels
			? new PIXI.filters.KawaseBlurFilter(kernels)
			: new PIXI.filters.KawaseBlurFilter(blur, quality);

		this._pixelSize = 1.0;
		this.resolution = resolution;

		const { shadowOnly, rotation, distance, alpha, color } = opt;

		this.shadowOnly = shadowOnly;
		this.rotation = rotation;
		this.distance = distance;
		this.alpha = alpha;
		this.color = color;
	}

	apply(filterManager, input, output, clear) {
		this._updateShiftAndScale();
		const target = filterManager.getFilterTexture();

		this._tintFilter.apply(filterManager, input, target, 1);
		this._blurFilter.apply(filterManager, target, output, clear);

		if (this.shadowOnly !== true) {
			filterManager.applyFilter(this, input, output, 0);
		}

		filterManager.returnFilterTexture(target);
	}

	_updateShiftAndScale() {
		const scale = this.targetPlaceable?.worldTransform.a ?? 1.0;
		this._tintFilter.uniforms.shift.set(
			this.distance * Math.cos(this.angle) * scale,
			this.distance * Math.sin(this.angle) * scale
		);
		this._pixelSize = Math.max(1.0, 1.0 * scale);
	}

	get resolution() {
		return this._resolution;
	}
	set resolution(value) {
		this._resolution = value;

		if (this._tintFilter) {
			this._tintFilter.resolution = value;
		}
		if (this._blurFilter) {
			this._blurFilter.resolution = value;
		}
	}

	get distance() {
		return this._distance;
	}
	set distance(value) {
		this._distance = value;
	}

	get rotation() {
		return this.angle / PIXI.DEG_TO_RAD;
	}
	set rotation(value) {
		this.angle = value * PIXI.DEG_TO_RAD;
	}

	get alpha() {
		return this._tintFilter.uniforms.alpha;
	}
	set alpha(value) {
		this._tintFilter.uniforms.alpha = value;
	}

	get color() {
		return PIXI.utils.rgb2hex(this._tintFilter.uniforms.color);
	}
	set color(value) {
		new PIXI.Color(value).toRgbArray(this._tintFilter.uniforms.color);
	}

	get kernels() {
		return this._blurFilter.kernels;
	}
	set kernels(value) {
		this._blurFilter.kernels = value;
	}

	get blur() {
		return this._blurFilter.blur;
	}
	set blur(value) {
		this._blurFilter.blur = value;
	}

	get quality() {
		return this._blurFilter.quality;
	}
	set quality(value) {
		this._blurFilter.quality = value;
	}

	get _pixelSize() {
		return this._blurFilter.pixelSize;
	}
	set _pixelSize(value) {
		this._blurFilter.pixelSize = value;
	}
}

FilterDropShadowEx.defaults = {
	rotation: 45,
	distance: 5,
	color: 0x000000,
	alpha: 0.5,
	shadowOnly: false,
	kernels: null,
	blur: 2,
	quality: 3,
	resolution: PIXI.settings.FILTER_RESOLUTION,
};
