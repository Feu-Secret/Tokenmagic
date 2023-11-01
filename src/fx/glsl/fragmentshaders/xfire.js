export const burnXFire = `
precision mediump float;

uniform float time;
uniform float amplitude;
uniform float dispersion;
uniform float discardThreshold;
uniform int blend;
uniform bool alphaDiscard;
uniform bool chromatic;
uniform bool inlay;
uniform vec2 scale;
uniform vec3 color;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float MU_3 = 0.333333333334;

float rand(vec2 n) { 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float maxRgbIntensity(vec3 col) {
    return max(max(col.r,col.g),col.b);
}

float colorIntensity(vec3 col) {
    return clamp((col.r + col.g + col.b)*MU_3,0.,1.);
}

vec3 blendLinearDual(vec3 base, vec3 blend, float intensity) {
    if (intensity < dispersion) {
        return mix(base,blend,pow(abs((1.-dispersion)),clamp(10.*dispersion,1.,3.)));
    } 
    return mix(blend,mix(blend,base,1.-pow(intensity*dispersion,0.5)),1.-pow(intensity,4.));
}

vec3 blendScreen(vec3 base, vec3 blend, float intensity) {
    return vec3(1.)
            -((1.-base*(intensity+dispersion))
            *(1.-blend*clamp(pow(intensity,dispersion),0.,1.)));
}

float blendScreenPure(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreenPure(vec3 base, vec3 blend) {
	return vec3(blendScreenPure(base.r,blend.r),blendScreenPure(base.g,blend.g),blendScreenPure(base.b,blend.b));
}

vec3 blendMix(vec3 base, vec3 blend) {
	return mix(blendLinearDual(base, blend, smoothstep(0.35,0.6,1.-colorIntensity(blend))),
	           blendScreen(base, blend, smoothstep(0.,1.,1.-colorIntensity(blend))),
	           smoothstep(0.,1.,colorIntensity((base+blend)*0.5)));
}

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec4 blender(int blend, vec3 scol, vec3 tcol) {
    if (blend <= 1) {
        scol = mix(scol, tcol, smoothstep(dispersion, 1., maxRgbIntensity(tcol)));
    } else if (blend == 2) {
        scol = blendLinearDual(scol, tcol, maxRgbIntensity(tcol));
    } else if (blend == 3) {
        scol = blendLinearDual(scol, tcol, colorIntensity(tcol));
    } else if (blend == 4) {
        scol = blendScreen(scol, tcol, maxRgbIntensity(tcol));
    } else if (blend == 5) {
        scol = blendScreen(scol, tcol, colorIntensity(tcol));
    } else if (blend == 6) {
        scol = blendVividLight(scol,tcol);
    } else if (blend == 7) {
        scol = blendColorDodge(scol,tcol);
    } else if (blend == 8) {
        scol = blendColorBurn(scol,tcol);
    } else if (blend == 9) {
        scol = blendScreen(scol, blendVividLight(scol,tcol), colorIntensity(tcol));
    } else if (blend == 10) {
        scol = blendScreen(scol, blendColorDodge(scol,tcol), colorIntensity(tcol));
    } else if (blend == 11) {
        scol = blendLinearDual(blendVividLight(scol,tcol), tcol, maxRgbIntensity(tcol));
    } else if (blend == 12) {
        scol = blendMix(scol,tcol);
    } else if (blend == 13) {
        scol = blendScreenPure(scol,tcol);
    } else if (blend >= 14) {
        scol = blendScreenPure(scol,tcol*0.5);
    }

    return vec4(scol,1.);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), 
	       mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < 5; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec3 fire(in vec4 pixel) {
    vec3 c1,c2,c3,c4;

    if (chromatic) {
        c1 = vec3(0.00, 0.50, 0.50);
    	c2 = vec3(0.60, 0.35, 0.70);
    	c3 = vec3(0.20, 0.90, 1.00);
    	c4 = vec3(0.90, 1.00, 0.60); 
    } else if ( any(greaterThan(color,vec3(0.))) ) {
        c1 = vec3(0.10*color);
    	c2 = vec3(0.85*color);
    	c3 = vec3(0.35*color);
    	c4 = vec3(color);
    } else {
        c1 = color1;
        c2 = color2;
        c3 = color3;
        c4 = color4;
    }

	const vec3 c5 = vec3(0.1);
	const vec3 c6 = vec3(0.9);
	const vec2 pivot = vec2(0.5);
	
    vec2 uv = vFilterCoord;
    uv -= pivot;
	vec2 p = uv * mat2(8.*scale.x,0.0,0.0,8.*scale.y);
	uv += pivot;

    vec2 r;
	vec3 c;
	float t = time*0.1;
	float q = fbm(p - t);

	if (inlay) {
	    float sat = pixel.r + pixel.g + pixel.b;
	    float sat4 = sat*4.;
	    r = vec2(fbm(p + q + t - p.x - p.y - sat), fbm(p + q - t + sat4));
	    c = mix(c1, c2, fbm(p + r + sat4)) + mix(c3, c4, 1.4-pixel.rgb) - mix(c5, c6, r.y);
	} else {
	    r = vec2(fbm(p + q + time - p.x - p.y), fbm(p + q - t));
	    c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	}
	
	return clamp(c,0.,1.);
}

void main() {
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec3 fire = fire(pixel);
    if (alphaDiscard && all(lessThanEqual(fire,vec3(discardThreshold))))  {
        discard;
    }

    vec4 result = blender(blend, pixel.rgb, fire);

	gl_FragColor = result*pixel.a;
}
`;
