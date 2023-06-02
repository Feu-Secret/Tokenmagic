import { mirrorImages } from '../glsl/fragmentshaders/mirrorimages.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from '../Anime.js';
import './proto/FilterProto.js';

export class FilterMirrorImages extends CustomFilter {
	constructor(params) {
		let { time, blend, alphaImg, alphaChr, nbImage, ampX, ampY } = Object.assign(
			{},
			FilterMirrorImages.defaults,
			params
		);

		// using specific vertex shader and fragment shader
		super(customVertex2D, mirrorImages);

		Object.assign(this, {
			time,
			blend,
			alphaImg,
			alphaChr,
			nbImage,
			ampX,
			ampY,
		});

		this.zOrder = 100;
		this.autoFit = false;
		this.animated = {};
		this.setTMParams(params);
		if (!this.dummy) {
			this.anime = new Anime(this);
			this.normalizeTMParams();
		}
	}

	get time() {
		return this.uniforms.time;
	}

	set time(value) {
		this.uniforms.time = value;
	}

	get alphaImg() {
		return this.uniforms.alphaImg;
	}

	set alphaImg(value) {
		this.uniforms.alphaImg = value;
	}

	get alphaChr() {
		return this.uniforms.alphaChr;
	}

	set alphaChr(value) {
		this.uniforms.alphaChr = value;
	}

	get nbImage() {
		return this.uniforms.nbImage;
	}

	set nbImage(value) {
		this.uniforms.nbImage = Math.floor(value);
	}

	get blend() {
		return this.uniforms.blend;
	}

	set blend(value) {
		this.uniforms.blend = Math.floor(value);
	}

	get ampX() {
		return this.uniforms.ampX;
	}

	set ampX(value) {
		this.uniforms.ampX = value;
	}

	get ampY() {
		return this.uniforms.ampY;
	}

	set ampY(value) {
		this.uniforms.ampY = value;
	}
}

FilterMirrorImages.defaults = {
	time: 0,
	blend: 4,
	alphaImg: 0.5,
	alphaChr: 1.0,
	nbImage: 4,
	ampX: 0.15,
	ampY: 0.15,
};
