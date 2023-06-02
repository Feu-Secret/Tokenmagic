import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterRGBSplit extends PIXI.filters.RGBSplitFilter {
	constructor(params) {
		super();
		this.red = new Float32Array([-10, 0]);
		this.green = new Float32Array([0, 10]);
		this.blue = new Float32Array([0, 0]);
		this.zOrder = 340;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get redX() {
		return this.uniforms.red[0];
	}

	set redX(value) {
		this.uniforms.red[0] = value;
	}

	get redY() {
		return this.uniforms.red[1];
	}

	set redY(value) {
		this.uniforms.red[1] = value;
	}

	get greenX() {
		return this.uniforms.green[0];
	}

	set greenX(value) {
		this.uniforms.green[0] = value;
	}

	get greenY() {
		return this.uniforms.green[1];
	}

	set greenY(value) {
		this.uniforms.green[1] = value;
	}

	get blueX() {
		return this.uniforms.blue[0];
	}

	set blueX(value) {
		this.uniforms.blue[0] = value;
	}

	get blueY() {
		return this.uniforms.blue[1];
	}

	set blueY(value) {
		this.uniforms.blue[1] = value;
	}
}
