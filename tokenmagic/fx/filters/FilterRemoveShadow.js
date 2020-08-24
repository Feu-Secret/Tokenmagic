import { removeShadowFrag } from '../glsl/fragmentshaders/removeshadow.js';
import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterRemoveShadow extends PIXI.Filter {

    constructor(params) {
        let { alphaTolerance } = Object.assign({}, FilterRemoveShadow.defaults, params);

        // using the default vertex shader and the specific fragment shader
        super(undefined, removeShadowFrag);

        Object.assign(this, {
            alphaTolerance,
        });

        this.zOrder = 10;
        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();
    }

    get alphaTolerance() {
        return this.uniforms.alphaTolerance;
    }
    set alphaTolerance(value) {
        this.uniforms.alphaTolerance = value;
    }
}

FilterRemoveShadow.defaults = {
    alphaTolerance: 0.8,
};

