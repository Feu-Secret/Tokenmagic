import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterReplaceColor extends PIXI.filters.ColorReplaceFilter {
	constructor(params) {
		super();
		this.originalColor = FilterReplaceColor.defaults.originalColor;
		this.newColor = FilterReplaceColor.defaults.newColor;
		this.epsilon = FilterReplaceColor.defaults.epsilon;
		this.zOrder = 100;
		this.animating = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}

FilterReplaceColor.defaults = {
	epsilon: 0.7,
	originalColor: 0xff0000,
	newColor: 0x00ff00,
};
