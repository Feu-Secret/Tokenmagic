import { Anime } from "./Anime.js";
import { removeShadowFrag } from '../pixifilters/fragments/removeshadow.js';

export class FilterRemoveShadow extends PIXI.Filter {

    constructor(params) {
        let { alphaTolerance } = Object.assign({}, FilterRemoveShadow.defaults, params);

        // using the default vertex shader and the specific fragment shader
        super(undefined, removeShadowFrag);

        Object.assign(this, {
            alphaTolerance,
        });

        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
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

