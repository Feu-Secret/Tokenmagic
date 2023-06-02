import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterBulgePinch extends PIXI.filters.BulgePinchFilter {
	constructor(params) {
		super();

		this.strength = 0;
		this.radiusPercent = 100;
		this.zOrder = 140;
		this.autoFit = false;

		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}

		// Anchor point
		this.center = [0.5, 0.5];
	}

	handleTransform() {
		this.radius =
			(Math.max(this.placeableImg.width, this.placeableImg.height) *
				this.targetPlaceable.worldTransform.a *
				this.radiusPercent) /
			200;
	}
}
