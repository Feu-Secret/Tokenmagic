import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterOldFilm extends PIXI.filters.OldFilmFilter {
	constructor(params) {
		super();
		this.enabled = false;
		this.vignetting = 0;
		this.noise = 0.08;
		this.scratch = 0.1;
		this.scratchDensity = 0.1;
		this.seed = 0;
		this.zOrder = 60;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
