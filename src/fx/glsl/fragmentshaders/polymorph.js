export const polymorph = `#version 300 es
precision mediump float;

uniform float progress;
uniform float magnify;
uniform int type;
uniform vec4 inputClamp;
uniform vec4 inputClampTarget;
uniform sampler2D uSampler;
uniform sampler2D uSamplerTarget;
uniform mat3 filterMatrixInverse;

in vec2 vTextureCoord;
in vec2 vTextureCoordExtra;
in vec2 vFilterCoord;

out vec4 outputColor;

const float PI = 3.14159265358;

float getClip(vec2 uv) {
    return step(3.5,
       step(inputClampTarget.x, uv.x) +
       step(inputClampTarget.y, uv.y) +
       step(uv.x, inputClampTarget.z) +
       step(uv.y, inputClampTarget.w));
}

vec4 getFromColor(vec2 uv) {
    return texture(uSampler,clamp(uv,inputClamp.xy,inputClamp.zw));
}

vec4 getToColor(vec2 uv) {
    return texture(uSamplerTarget,clamp(uv,inputClampTarget.xy,inputClampTarget.zw))*getClip(uv);
}

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 offset(float progress, float x, float theta, float str) {
    float shifty = str*progress*cos(10.0*(progress+x));
    return vec2(0, shifty);
}

vec2 roffset(float progress, float x, float theta, float str) {
    float shifty = (1.-progress)*str*progress*cos(10.0*(progress+x));
    return vec2(0, shifty);
}

float noise(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy * progress, vec2(a, b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 morph(vec2 uv, vec2 uvt) {
    vec4 ca = getFromColor(uv);
    vec4 cb = getToColor(uvt);
    vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);
    vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);
    vec2 oc = mix(oa,ob,0.5)*0.1;
    float w0 = progress;
    float w1 = 1.0-w0;
    vec2 sourceMappedCoord = (filterMatrixInverse * vec3(vFilterCoord+(oc*0.4)*w0, 1.0)).xy;
    vec4 fromcol = getFromColor(sourceMappedCoord);
    vec4 tocol = getToColor(uvt-oc*w1);
    float a = mix(ca.a, cb.a, progress);
    return mix(fromcol, tocol, progress)*a;
}

vec4 waterdrop(vec2 uv, vec2 uvt) {
    vec2 dirt = uvt - vec2(.5);
    float distt = length(dirt);
    if (distt > progress) {
        return mix(getFromColor(uv), getToColor(uvt), progress);
    } else {
        vec2 shiftuvt = dirt * sin(distt * 60. - progress * 20.);
        vec2 fuv = (filterMatrixInverse * vec3(vFilterCoord + (shiftuvt*(1.-progress)), 1.0)).xy;
        return mix(getFromColor(fuv), getToColor(uvt + (shiftuvt*(1.-progress))), progress);
    }
}

vec4 dreamy(vec2 uv, vec2 uvt) {
    return mix(getFromColor(uv + offset(progress, uv.x, 0.0, 0.03)), 
               getToColor(uvt + offset(1.0-progress, uvt.x, 3.14, 0.03)), 
               progress);
}

vec2 swirluv(vec2 uv) {
    vec2 xy = 2.* uv - 1.;
    float fdist = length(xy);
    if (fdist > 1.) return uv;
    uv -= vec2( 0.5, 0.5 );
    float dist = length(uv);
    if ( dist < 1. ) {
	    float pct = (1. - dist);
	    float a = ( progress <= 0.5 ) ? mix( 0.0, 1.0, progress*2. ) : mix( 1.0, 0.0, (progress-0.5)*2. );
	    float t = pct * pct * a * 5.0 * 3.14159;
	    float s = sin( t );
	    float c = cos( t );
	    uv = vec2(dot(uv,vec2(c,-s)),dot(uv,vec2(s,c)));
    }
    uv += vec2(0.5,0.5);
    return uv;
}

vec4 swirl(vec2 uv, vec2 uvt) {
    vec2 suvfrom = swirluv(vFilterCoord);
    vec2 suvto = swirluv(uvt);
    vec2 sourceMappedCoord = (filterMatrixInverse * vec3(suvfrom, 1.0)).xy;
    vec4 fscol = getFromColor(sourceMappedCoord);
    vec4 ftcol = getToColor(suvto);
    return mix( fscol, ftcol, progress );
}

vec4 crosswarp(vec2 uv, vec2 uvt) {
    float x = progress;
    x = smoothstep(.0,1.0,(x*2.0+uv.x-1.0));
    vec4 rawfscol = getFromColor(uv);
    vec4 fscol = getFromColor((uv-.5)*(1.-x)+.5);
    vec4 ftcol = getToColor(uvt);
    return mix(fscol, ftcol, x)*mix(rawfscol.a,ftcol.a,progress);
}

vec4 tvnoise(vec2 uv, vec2 uvt) {
    vec4 noise = vec4(vec3(noise(uv)), 1.);
    vec4 fscol = getFromColor(uv);
    vec4 ftcol = getToColor(uvt);
    float alphamix = mix(fscol.a, ftcol.a, pow(clamp(progress,0.,1.), 0.6));
    if (progress <= 0.30) {
        return mix(fscol, noise*alphamix, pow(clamp(progress,0.,1.),0.3-progress));
    } else if (progress >= 0.70) {
        return mix(noise*alphamix, ftcol, pow(clamp(progress-0.7,0.,1.),1.-progress));
    } else {
        return noise*alphamix;
    }
}

vec4 hologram(vec2 uv, vec2 uvt) {
    float cosProg = 0.5*(cos(2.*PI*progress)+1.);
    vec4 fscol = getFromColor(uv + roffset(progress, uvt.x, 0., 0.12));
    vec4 ftcol = getToColor(uvt + roffset(progress, uvt.x, 0., 0.6));
  
    float scintensity = max(max(fscol.r,fscol.g),fscol.b);
    float tcintensity = max(max(ftcol.r,ftcol.g),ftcol.b);

    vec4 tscol = vec4(0.,fscol.g*3.,0.,1.)*scintensity;
    vec4 ttcol = vec4(ftcol.r*3.,0.,0.,1.)*tcintensity;
    
    vec4 iscol = vec4(0.,fscol.g*3.,fscol.b*3.,1.)*scintensity;
    vec4 itcol = vec4(ftcol.r*3.,0.,ftcol.b*3.,1.)*tcintensity;
    
    vec4 smix = mix(mix(fscol,tscol,progress),iscol,1.-cosProg);
    vec4 tmix = mix(mix(ftcol,ttcol,1.-progress),itcol,1.-cosProg);;

    return mix(smix, 
               tmix, 
               progress);
}

vec4 wind(vec2 uv, vec2 uvt) {
    float r = rand(vec2(0, uv.y));
    float m = smoothstep(0.0, -0.25, uv.x*0.75 + 0.25*r - (progress * 1.25));
    return mix(
        getFromColor(uv),
        getToColor(uvt),
        m
    );
}

vec4 transition(vec2 uv, vec2 uvt) {
    return mix(
        getFromColor(uv),
        getToColor(uvt),
        progress
    );
}

void main() {
    vec4 result;
    float scale = 1./magnify;
    vec2 uvExtra = vTextureCoordExtra;
    uvExtra -= vec2(0.5);
    uvExtra *= mat2(scale,0.,0.,scale);
    uvExtra += vec2(0.5);

    // shortcut to prevent a lot of computation if progress is equal to 0 or 1
    if (progress == 1.) {
        outputColor = getToColor(uvExtra);
        return;
    }

    if (progress == 0.) {
        outputColor = getFromColor(vTextureCoord);
        return;
    }

    if (type <= 1 || type >= 10) {
        result = transition(vTextureCoord, uvExtra);
    } else if (type == 2) {
        result = dreamy(vTextureCoord, uvExtra);
    } else if (type == 3) {
        result = swirl(vTextureCoord, uvExtra);
    } else if (type == 4) {
        result = waterdrop(vTextureCoord, uvExtra);
    } else if (type == 5) {
        result = tvnoise(vTextureCoord, uvExtra);
    } else if (type == 6) {
        result = morph(vTextureCoord, uvExtra);
    } else if (type == 7) {
        result = crosswarp(vTextureCoord, uvExtra);
    } else if (type == 8) {
        result = wind(vTextureCoord, uvExtra);
    } else if (type == 9) {
        result = hologram(vTextureCoord, uvExtra);
    } 
   
    outputColor = result;
}
`;
