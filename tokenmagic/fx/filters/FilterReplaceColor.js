import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterReplaceColor extends PIXI.filters.ColorReplaceFilter {
	constructor(params) {
		super();
		this.originalColor = [1, 0, 0];
		this.newColor = [0, 1, 0];
		this.epsilon = 0.7;
		this.zOrder = 100;
		this.animating = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
