import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterPixelate extends PIXI.filters.PixelateFilter {
	constructor(params) {
		super();
		this.enabled = false;
		this.animated = {};
		this.sizeX = 5;
		this.sizeY = 5;
		this.zOrder = 20;
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	handleTransform() {
		this.size.x = this.sizeX * this.targetPlaceable.worldTransform.a;
		this.size.y = this.sizeY * this.targetPlaceable.worldTransform.a;
	}
}
