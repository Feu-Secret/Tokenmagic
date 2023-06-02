import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterZoomBlur extends PIXI.filters.ZoomBlurFilter {
	constructor(params) {
		super();
		this.enabled = false;
		this.strength = 0.1;
		this.radiusPercent = 50;
		this.innerRadiusPercent = 10;
		this.zOrder = 300;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	handleTransform(state) {
		this.center[0] = 0.5 * state.sourceFrame.width;
		this.center[1] = 0.5 * state.sourceFrame.height;
		this.radius =
			(Math.max(this.placeableImg.width, this.placeableImg.height) *
				this.targetPlaceable.worldTransform.a *
				this.radiusPercent) /
			200;
		this.innerRadius =
			(Math.max(this.placeableImg.width, this.placeableImg.height) *
				this.targetPlaceable.worldTransform.a *
				this.innerRadiusPercent) /
			200;
	}
}
