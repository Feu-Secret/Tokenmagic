import { Anime } from '../Anime.js';
import './proto/FilterProto.js';
import { FilterDropShadowEx } from './FilterDropShadowEx.js';

export class FilterDropShadow extends FilterDropShadowEx {
	constructor(params) {
		super();
		this.enabled = false;
		this.rotation = 45;
		this.distance = 5;
		this.color = 0x000000;
		this.alpha = 0.5;
		this.shadowOnly = false;
		this.blur = 2;
		this.quality = 3;
		this.padding = 10;
		this.zOrder = 110;
		this.animated = {};
		this.resolution = game.settings.get('core', 'pixelRatioResolutionScaling')
			? window.devicePixelRatio
			: PIXI.settings.FILTER_RESOLUTION;
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
		this.autoFit = false;
	}
}
