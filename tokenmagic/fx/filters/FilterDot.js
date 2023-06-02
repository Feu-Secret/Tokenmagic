import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterDot extends PIXI.filters.DotFilter {
	constructor(params) {
		super();
		this.scale = 1;
		this.angle = 5;
		this.grayscale = true;
		this.zOrder = 330;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
