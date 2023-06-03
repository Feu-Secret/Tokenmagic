import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterCRT extends PIXI.filters.CRTFilter {
	constructor(params) {
		super();
		this.curvature = 1.0;
		this.lineWidth = 1.0;
		this.lineContrast = 0.25;
		this.verticalLine = false;
		this.noise = 0.08;
		this.noiseSize = 1.0;
		this.seed = 0;
		this.vignetting = 0;
		this.zOrder = 320;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
