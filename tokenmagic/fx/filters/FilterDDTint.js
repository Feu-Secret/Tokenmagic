import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';
import { ddTint } from '../glsl/fragmentshaders/ddtint.js';

export class FilterDDTint extends CustomFilter {
	constructor(params) {
		super(customVertex2D, ddTint);
		this.tint = [1, 0, 0];
		this.zOrder = 100;
		this.animating = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get tint() {
		return this.uniforms.tint;
	}

	set tint(value) {
		this.uniforms.tint = value;
	}
}
