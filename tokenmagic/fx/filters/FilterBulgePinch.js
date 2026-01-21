import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterBulgePinch extends PIXI.filters.BulgePinchFilter {
	constructor(params) {
		super();

		this.strength = 0;
		this.radiusPercent = 100;
		this.zOrder = 140;
		this.autoFit = false;
		this.center = [0.5, 0.5]; // Anchor point

		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get anchorX() {
		return this.center[0];
	}

	set anchorX(value) {
		this.center[0] = value;
	}

	get anchorY() {
		return this.center[1];
	}

	set anchorY(value) {
		this.center[1] = value;
	}

	handleTransform() {
		this.radius =
			(Math.max(this.placeableImg.width, this.placeableImg.height) *
				this.targetPlaceable.worldTransform.a *
				this.radiusPercent) /
			200;
	}
}

FilterBulgePinch.defaults.anchorX = 0.5;
FilterBulgePinch.defaults.anchorY = 0.5;
