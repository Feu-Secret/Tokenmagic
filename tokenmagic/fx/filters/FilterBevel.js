import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterBevel extends PIXI.filters.BevelFilter {
	constructor(params) {
		super();
		this.blendMode = PIXI.BLEND_MODES.NORMAL;
		this.padding = 10;
		this.enabled = false;
		this.rotation = 0;
		this.thickness = 5;
		this.lightColor = 0xffffff;
		this.lightAlpha = 0.95;
		this.shadowColor = 0x000000;
		this.shadowAlpha = 0.95;
		this.zOrder = 90;
		this.quality = 1;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
