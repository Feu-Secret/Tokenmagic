import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterXBloom extends PIXI.filters.AdvancedBloomFilter {
	constructor(params) {
		super();

		this.enabled = false;
		this.threshold = 0.5;
		this.bloomScale = 1.0;
		this.brightness = 1.0;
		this.blur = 4.0;
		this.quality = 4.0;
		this.zOrder = 40;

		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
