import { Anime } from '../Anime.js';
import './proto/FilterProto.js';
import { FilterBlurEx } from './FilterBlurEx.js';

export class FilterBlur extends FilterBlurEx {
	constructor(params) {
		super();
		this.enabled = false;
		this.blur = 2;
		this.quality = 4;
		this.zOrder = 290;
		this.repeatEdgePixels = false;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get blur() {
		return this.strengthX;
	}

	set blur(value) {
		this.strengthX = this.strengthY = value;
	}

	get blurX() {
		return this.strengthX;
	}

	set blurX(value) {
		this.strengthX = value;
	}

	get blurY() {
		return this.strengthY;
	}

	set blurY(value) {
		this.strengthY = value;
	}

	calculatePadding() {
		const scale = this.targetPlaceable.worldTransform.a;
		this.blurXFilter.blur = scale * this.strengthX;
		this.blurYFilter.blur = scale * this.strengthY;
		this.updatePadding();
		super.calculatePadding();
	}
}
