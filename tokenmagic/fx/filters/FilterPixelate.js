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

	set sizeX(value) {
		this.size[0] = value;
	}

	get sizeX() {
		return this.size[0];
	}

	set sizeY(value) {
		this.size[1] = value;
	}

	get sizeY() {
		return this.size[1];
	}
}
