import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterGlow extends PIXI.filters.GlowFilter {
	constructor(params) {
		super();
		this.padding = 15;
		this.enabled = false;
		this.innerStrength = 0;
		this.outerStrength = 6.5;
		this.color = 0x0020ff;
		this.quality = 1;
		this.alpha = 1;
		this.zOrder = 70;
		this.animated = {};
		this.setTMParams(params);
		// Imposed value. Should not be a shader uniform
		this.distance = 10;
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
