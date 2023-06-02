import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterAscii extends PIXI.filters.AsciiFilter {
	constructor(params) {
		super();
		this.size = 8;
		this.zOrder = 310;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}
}
