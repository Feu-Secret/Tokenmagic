import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterAdjustment extends PIXI.filters.AdjustmentFilter {
	constructor(params) {
		super();
		this.enabled = false;
		this.gamma = 1;
		this.saturation = 1;
		this.contrast = 1;
		this.brightness = 1;
		this.red = 1;
		this.green = 1;
		this.blue = 1;
		this.alpha = 1;
		this.zOrder = 30;
		this.animating = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
