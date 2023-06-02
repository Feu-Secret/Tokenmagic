import { CustomFilter } from './CustomFilter.js';

export class FilterBlurEx extends CustomFilter {
	blurXFilter;
	blurYFilter;

	_repeatEdgePixels;

	constructor(strength = 8, quality = 4, resolution = PIXI.settings.FILTER_RESOLUTION, kernelSize = 5) {
		super();

		this.blurXFilter = new BlurFilterPassEx(true, strength, quality, resolution, kernelSize);
		this.blurYFilter = new BlurFilterPassEx(false, strength, quality, resolution, kernelSize);

		this.resolution = resolution;
		this.quality = quality;
		this.blur = strength;

		this.repeatEdgePixels = false;
	}

	apply(filterManager, input, output, clearMode) {
		const xStrength = Math.abs(this.blurXFilter.strength);
		const yStrength = Math.abs(this.blurYFilter.strength);

		if (xStrength && yStrength) {
			const renderTarget = filterManager.getFilterTexture();

			this.blurXFilter.apply(filterManager, input, renderTarget, PIXI.CLEAR_MODES.CLEAR);
			this.blurYFilter.apply(filterManager, renderTarget, output, clearMode);

			filterManager.returnFilterTexture(renderTarget);
		} else if (yStrength) {
			this.blurYFilter.apply(filterManager, input, output, clearMode);
		} else {
			this.blurXFilter.apply(filterManager, input, output, clearMode);
		}
	}

	updatePadding() {
		if (this._repeatEdgePixels) {
			this.padding = 0;
		} else {
			this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
		}
	}

	get blur() {
		return this.blurXFilter.blur;
	}

	set blur(value) {
		this.blurXFilter.blur = this.blurYFilter.blur = value;
		this.updatePadding();
	}

	get quality() {
		return this.blurXFilter.quality;
	}

	set quality(value) {
		this.blurXFilter.quality = this.blurYFilter.quality = value;
	}

	get blurX() {
		return this.blurXFilter.blur;
	}

	set blurX(value) {
		this.blurXFilter.blur = value;
		this.updatePadding();
	}

	get blurY() {
		return this.blurYFilter.blur;
	}

	set blurY(value) {
		this.blurYFilter.blur = value;
		this.updatePadding();
	}

	get blendMode() {
		return this.blurYFilter.blendMode;
	}

	set blendMode(value) {
		this.blurYFilter.blendMode = value;
	}

	get repeatEdgePixels() {
		return this._repeatEdgePixels;
	}

	set repeatEdgePixels(value) {
		this._repeatEdgePixels = value;
		this.updatePadding();
	}
}

export class BlurFilterPassEx extends CustomFilter {
	horizontal;
	strength;
	passes;
	_quality;

	constructor(horizontal, strength = 8, quality = 4, resolution = PIXI.settings.FILTER_RESOLUTION, kernelSize = 5) {
		const vertSrc = generateBlurVertSource(kernelSize, horizontal);
		const fragSrc = generateBlurFragSource(kernelSize);

		super(
			// vertex shader
			vertSrc,
			// fragment shader
			fragSrc
		);

		this.horizontal = horizontal;

		this.resolution = resolution;

		this._quality = 0;

		this.quality = quality;

		this.blur = strength;
	}

	apply(filterManager, input, output, clearMode) {
		if (output) {
			if (this.horizontal) {
				this.uniforms.strength = (1 / output.width) * (output.width / input.width);
			} else {
				this.uniforms.strength = (1 / output.height) * (output.height / input.height);
			}
		} else {
			if (this.horizontal) {
				this.uniforms.strength = (1 / filterManager.renderer.width) * (filterManager.renderer.width / input.width);
			} else {
				this.uniforms.strength = (1 / filterManager.renderer.height) * (filterManager.renderer.height / input.height);
			}
		}

		// screen space!
		this.uniforms.strength *= this.strength;
		this.uniforms.strength /= this.passes;

		if (this.passes === 1) {
			filterManager.applyFilter(this, input, output, clearMode);
		} else {
			const renderTarget = filterManager.getFilterTexture();
			const renderer = filterManager.renderer;

			let flip = input;
			let flop = renderTarget;

			this.state.blend = false;
			filterManager.applyFilter(this, flip, flop, PIXI.CLEAR_MODES.CLEAR);

			for (let i = 1; i < this.passes - 1; i++) {
				filterManager.bindAndClear(flip, PIXI.CLEAR_MODES.BLIT);

				this.uniforms.uSampler = flop;

				const temp = flop;

				flop = flip;
				flip = temp;

				renderer.shader.bind(this);
				renderer.geometry.draw(5);
			}

			this.state.blend = true;
			filterManager.applyFilter(this, flop, output, clearMode);
			filterManager.returnFilterTexture(renderTarget);
		}
	}

	get blur() {
		return this.strength;
	}

	set blur(value) {
		this.padding = 1 + Math.abs(value) * 2;
		this.strength = value;
	}

	get quality() {
		return this._quality;
	}

	set quality(value) {
		this._quality = value;
		this.passes = value;
	}
}

const GAUSSIAN_VALUES = {
	5: [0.153388, 0.221461, 0.250301],
	7: [0.071303, 0.131514, 0.189879, 0.214607],
	9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
	11: [0.0093, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
	13: [0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
	15: [0.000489, 0.002403, 0.009246, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448],
};

const fragTemplate = [
	'varying vec2 vBlurTexCoords[%size%];',
	'uniform sampler2D uSampler;',

	'void main(void)',
	'{',
	'    gl_FragColor = vec4(0.0);',
	'    %blur%',
	'}',
].join('\n');

export function generateBlurFragSource(kernelSize) {
	const kernel = GAUSSIAN_VALUES[kernelSize];
	const halfLength = kernel.length;

	let fragSource = fragTemplate;

	let blurLoop = '';
	const template = 'gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;';
	let value;

	for (let i = 0; i < kernelSize; i++) {
		let blur = template.replace('%index%', i.toString());

		value = i;

		if (i >= halfLength) {
			value = kernelSize - i - 1;
		}

		blur = blur.replace('%value%', kernel[value].toString());

		blurLoop += blur;
		blurLoop += '\n';
	}

	fragSource = fragSource.replace('%blur%', blurLoop);
	fragSource = fragSource.replace('%size%', kernelSize.toString());

	return fragSource;
}

const vertTemplate = `
    attribute vec2 aVertexPosition;
    uniform mat3 projectionMatrix;
    uniform float strength;
    varying vec2 vBlurTexCoords[%size%];
    uniform vec4 inputSize;
    uniform vec4 outputFrame;
    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }
    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }
    void main(void)
    {
        gl_Position = filterVertexPosition();
        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;

export function generateBlurVertSource(kernelSize, x) {
	const halfLength = Math.ceil(kernelSize / 2);

	let vertSource = vertTemplate;

	let blurLoop = '';
	let template;

	if (x) {
		template = 'vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);';
	} else {
		template = 'vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);';
	}

	for (let i = 0; i < kernelSize; i++) {
		let blur = template.replace('%index%', i.toString());

		blur = blur.replace('%sampleIndex%', `${i - (halfLength - 1)}.0`);

		blurLoop += blur;
		blurLoop += '\n';
	}

	vertSource = vertSource.replace('%blur%', blurLoop);
	vertSource = vertSource.replace('%size%', kernelSize.toString());

	return vertSource;
}

export function getMaxKernelSize(gl) {
	const maxVaryings = PIXI.gl.getParameter(PIXI.gl.MAX_VARYING_VECTORS);
	let kernelSize = 15;

	while (kernelSize > maxVaryings) {
		kernelSize -= 2;
	}

	return kernelSize;
}
