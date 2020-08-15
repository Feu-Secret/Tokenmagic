import { spiderWeb } from '../glsl/fragmentshaders/spiderweb.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterSpiderWeb extends PIXI.Filter {

    constructor(params) {
        let {
            time,
            anchorX,
            anchorY
        } = Object.assign({}, FilterSpiderWeb.defaults, params);

        // using specific vertex shader and fragment shader
        super(customVertex2D, spiderWeb);

        this.uniforms.anchor = new Float32Array([0.5, -1.0]);

        Object.assign(this, {
            time, anchorX, anchorY
        });

        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();
    }

    get time() {
        return this.uniforms.time;
    }

    set time(value) {
        this.uniforms.time = value;
    }

    get anchorX() {
        return this.uniforms.anchor[0];
    }

    set anchorX(value) {
        this.uniforms.anchor[0] = 0.5;
    }

    get anchorY() {
        return this.uniforms.anchor[1];
    }

    set anchorY(value) {
        this.uniforms.anchor[1] = 0.5;
    }
}

FilterSpiderWeb.defaults = {
    time: 0.0,
    anchorX: 0.5,
    anchorY: 0.5,
};




