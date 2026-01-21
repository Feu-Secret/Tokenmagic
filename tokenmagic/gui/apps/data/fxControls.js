const ALPHA_CONTROL = {
	type: 'range',
	min: 0,
	max: 1,
	step: 0.01,
};
const COLOR_CONTROL = {
	type: 'color',
};

export const FILTER_PARAM_CONTROLS = {
	common: {
		color: COLOR_CONTROL,
		time: {
			type: 'range',
			min: 0,
			max: 30000,
			step: 0.1,
			order: 99999,
		},
		zOrder: {
			type: 'range',
			min: 0,
			max: 99999,
			step: 1,
			order: 99999,
		},
		blend: {
			type: 'range',
			min: 0,
			max: 13,
			step: 1,
			animatable: false,
			order: 99997,
		},
		gridPadding: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.1,
			order: 99995,
			animatable: false,
		},
		anchorX: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		anchorY: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		resolution: {
			type: 'ignore',
		},
		kernels: {
			type: 'ignore',
		},
		alphaDiscard: {
			type: 'boolean',
		},
		alpha: ALPHA_CONTROL,
		rotation: {
			type: 'range',
			min: 0,
			max: 360,
			step: 0.5,
		},
		padding: {
			type: 'range',
			min: 0,
			max: 500,
			step: 1,
			order: 99998,
			animatable: false,
		},
		blendMode: {
			type: 'select',
			get options() {
				return Object.entries(PIXI.BLEND_MODES).reduce((opts, [k, v]) => {
					if (Number.isNumeric(k)) opts[Number(k)] = v;
					return opts;
				}, {});
			},
			animatable: false,
			order: 99997,
		},
		seed: {
			type: 'range',
			min: 0,
			max: 9999,
			step: 1,
		},
		radiusPercent: {
			type: 'range',
			min: 0,
			max: 300,
			step: 1,
		},
		zIndex: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
	},
	ddTint: {
		tint: {
			type: 'ignore',
		},
	},
	dot: {
		scale: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		angle: {
			type: 'range',
			min: 0,
			max: 360,
			step: 1,
		},
	},
	ascii: {
		size: {
			type: 'range',
			min: 0,
			max: 50,
			step: 1,
		},
	},
	replaceColor: {
		epsilon: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		originalColor: {
			type: 'color',
			validate: (value) => {
				if (Array.isArray(value)) return PIXI.utils.rgb2hex(value);
				return value;
			},
		},
		newColor: {
			type: 'color',
			validate: (value) => {
				if (Array.isArray(value)) return PIXI.utils.rgb2hex(value);
				return value;
			},
		},
	},
	web: {
		thickness: {
			type: 'range',
			min: 0,
			max: 6,
			step: 0.1,
		},
		div1: {
			type: 'range',
			min: 1,
			max: 50,
			step: 1,
			label: 'Horizontal Divisions',
		},
		div2: {
			type: 'range',
			min: 1,
			max: 50,
			step: 1,
			label: 'Vertical Divisions',
		},
		tear: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.01,
		},
		amplitude: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
		},
	},
	polymorph: {
		type: {
			type: 'select',
			options: {
				1: 'Fade',
				2: 'Deamy',
				3: 'Swirl',
				4: 'Waterdrop',
				5: 'TV Noise',
				6: 'Morph',
				7: 'Cross-Warp',
				8: 'Wind',
				9: 'Hologram',
			},
		},
		magnify: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
		},
		imagePath: {
			type: 'file',
			fileType: 'imagevideo',
		},
	},
	splash: {
		spread: {
			type: 'range',
			min: 0.01,
			max: 15,
			step: 0.01,
		},
		splashFactor: {
			type: 'range',
			min: 0.01,
			max: 10,
			step: 0.1,
		},
		dimX: {
			type: 'range',
			min: -3,
			max: 3,
			step: 0.01,
		},
		dimY: {
			type: 'range',
			min: -3,
			max: 3,
			step: 0.01,
		},
		anchorX: {
			type: 'range',
			min: -1,
			max: 2,
			step: 0.01,
		},
		anchorY: {
			type: 'range',
			min: -1,
			max: 2,
			step: 0.01,
		},
	},
	ripples: {
		amplitude: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		intensity: {
			type: 'range',
			min: 0.0001,
			max: 0.2,
			step: 0.0001,
		},
		_octave: {
			type: 'ignore',
		},
	},
	globes: {
		distortion: {
			type: 'range',
			min: 0,
			max: 25,
			step: 0.01,
		},
		scale: {
			type: 'range',
			min: 1,
			max: 400,
			step: 1,
		},
	},
	xfire: {
		blend: {
			type: 'range',
			min: 0,
			max: 14,
			step: 1,
			animatable: false,
			order: 99997,
		},
		amplitude: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.1,
		},
		dispersion: ALPHA_CONTROL,
		scaleX: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.01,
		},
		scaleY: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.01,
		},
		color1: COLOR_CONTROL,
		color2: COLOR_CONTROL,
		color3: COLOR_CONTROL,
		color4: COLOR_CONTROL,
		discardThreshold: ALPHA_CONTROL,
	},
	liquid: {
		intensity: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.1,
		},
		scale: {
			type: 'range',
			min: 0.1,
			max: 8,
			step: 0.01,
		},
	},
	pixel: {
		sizeX: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
		sizeY: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
	},
	xglow: {
		auraType: {
			type: 'select',
			options: {
				1: 'Ripples',
				2: 'Noisy',
			},
		},
		thickness: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
		scale: {
			type: 'range',
			min: 0,
			max: 15,
			step: 1,
		},
		auraIntensity: {
			type: 'range',
			min: 0,
			max: 1000,
			step: 1,
		},
		subAuraIntensity: {
			type: 'range',
			min: 0,
			max: 50,
			step: 0.5,
		},
		threshold: {
			type: 'range',
			min: 0,
			max: 5,
			step: 0.1,
		},
	},
	xray: {
		dimX: {
			type: 'range',
			min: -3,
			max: 3,
			step: 0.01,
		},
		dimY: {
			type: 'range',
			min: -3,
			max: 3,
			step: 0.01,
		},
		divisor: {
			type: 'range',
			min: 0,
			max: 200,
			step: 1,
		},
		intensity: {
			type: 'range',
			min: 0,
			max: 200,
			step: 1,
		},
	},
	field: {
		shieldType: {
			type: 'range',
			min: 1,
			max: 13,
			step: 1,
		},
		lightAlpha: ALPHA_CONTROL,
		lightSize: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.1,
		},
		radius: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		hideRadius: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		scale: {
			type: 'range',
			min: 0.1,
			max: 2,
			step: 0.01,
		},
		intensity: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		discardThreshold: ALPHA_CONTROL,
		// changing value does not meaningfully influence appearance
		posLightX: {
			type: 'ignore',
		},
		posLightY: {
			type: 'ignore',
		},
	},
	images: {
		nbImage: {
			type: 'range',
			min: 1,
			max: 10,
			step: 1,
		},
		alphaImg: ALPHA_CONTROL,
		alphaChr: ALPHA_CONTROL,
		ampX: ALPHA_CONTROL,
		ampY: ALPHA_CONTROL,
	},
	smoke: {
		dimX: {
			type: 'range',
			min: -3,
			max: 3,
			step: 0.01,
		},
		dimY: {
			type: 'range',
			min: -3,
			max: 3,
			step: 0.01,
		},
	},
	flood: {
		scale: {
			type: 'range',
			min: 0,
			max: 1000,
			step: 1,
		},
		glint: ALPHA_CONTROL,
		tintIntensity: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.01,
		},
		billowy: {
			type: 'range',
			min: 0,
			max: 4,
			step: 0.1,
		},
		shiftX: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		shiftY: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
	},
	fire: {
		intensity: {
			type: 'range',
			min: 0,
			max: 2,
			step: 0.01,
		},
		amplitude: {
			type: 'range',
			min: 0,
			max: 100,
			step: 0.1,
		},
		fireBlend: {
			type: 'range',
			min: 0,
			max: 13,
			step: 1,
			animatable: false,
			order: 99997,
		},
	},
	shadow: {
		distance: {
			type: 'range',
			min: 0,
			max: 500,
			step: 1,
		},
		blur: {
			type: 'range',
			min: 0,
			max: 5,
			step: 0.1,
		},
		quality: {
			type: 'range',
			min: 0,
			max: 8,
			step: 1,
			animatable: false,
		},
	},
	bevel: {
		lightColor: COLOR_CONTROL,
		shadowColor: COLOR_CONTROL,
		shadowAlpha: ALPHA_CONTROL,
		lightAlpha: ALPHA_CONTROL,
		thickness: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
	},
	outline: {
		thickness: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
		quality: {
			type: 'range',
			min: 0,
			max: 8,
			step: 1,
			animatable: false,
		},
	},
	sprite: {
		imagePath: {
			type: 'file',
			fileType: 'imagevideo',
			order: 0,
		},
		scaleX: {
			type: 'range',
			min: 0.01,
			max: 10,
			step: 0.01,
		},
		scaleY: {
			type: 'range',
			min: 0.01,
			max: 10,
			step: 0.01,
		},
		translationX: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		translationY: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		twRadiusPercent: {
			type: 'ignore',
		},
		twAngle: {
			type: 'ignore',
		},
		bpRadiusPercent: {
			type: 'ignore',
		},
		bpStrength: {
			type: 'ignore',
		},
	},
	transform: {
		translationX: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		translationY: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		pivotX: {
			type: 'range',
			min: -6,
			max: 6,
			step: 0.01,
		},
		pivotY: {
			type: 'range',
			min: -6,
			max: 6,
			step: 0.01,
		},
		scaleX: {
			type: 'range',
			min: 0.1,
			max: 30,
			step: 0.01,
		},
		scaleY: {
			type: 'range',
			min: 0.1,
			max: 30,
			step: 0.01,
		},
		bpRadiusPercent: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
		bpStrength: {
			type: 'range',
			min: 0,
			max: 1.4,
			step: 0.01,
		},
		twRadiusPercent: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
		twAngle: {
			type: 'range',
			min: 0,
			max: 90,
			step: 0.1,
		},
	},
	adjustment: {
		brightness: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 0,
		},
		contrast: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 1,
		},
		saturation: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 2,
		},
		gamma: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 3,
		},
		red: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 4,
		},
		green: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 5,
		},
		blue: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
			order: 6,
		},
	},
	glow: {
		outerStrength: {
			type: 'range',
			min: 0,
			max: 20,
			step: 0.1,
		},
		innerStrength: {
			type: 'range',
			min: 0,
			max: 20,
			step: 0.1,
		},
		quality: {
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
		},
		distance: {
			type: 'ignore',
		},
	},
	xbloom: {
		threshold: {
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
		},
		bloomScale: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
		},
		brightness: {
			type: 'range',
			min: 0,
			max: 3,
			step: 0.01,
		},
		blur: {
			type: 'range',
			min: 0,
			max: 32,
			step: 1,
		},
		quality: {
			type: 'range',
			min: 0,
			max: 8,
			step: 1,
		},
		pixelSize: {
			type: 'ignore',
		},
	},
	distortion: {
		maskPath: {
			type: 'file',
			fileType: 'imagevideo',
		},
		maskSpriteScaleX: {
			type: 'range',
			min: 0,
			max: 20,
			step: 0.1,
		},
		maskSpriteScaleY: {
			type: 'range',
			min: 0,
			max: 20,
			step: 0.1,
		},
	},
	oldfilm: {
		sepia: ALPHA_CONTROL,
		noise: ALPHA_CONTROL,
		noiseSize: {
			type: 'range',
			min: 0.2,
			max: 5,
			step: 0.1,
		},
		scratch: ALPHA_CONTROL,
		scratchDensity: ALPHA_CONTROL,
		scratchWidth: {
			type: 'range',
			min: 0.5,
			max: 5,
			step: 0.1,
		},
		vignetting: ALPHA_CONTROL,
		vignettingAlpha: ALPHA_CONTROL,
		vignettingBlur: ALPHA_CONTROL,
	},
	twist: {
		angle: {
			type: 'range',
			min: -10,
			max: 10,
			step: 0.01,
		},
		offset: {
			type: 'ignore',
		},
	},
	bulgepinch: {
		strength: {
			type: 'range',
			min: -1,
			max: 1,
			step: 0.01,
		},
		radius: {
			type: 'ignore',
		},
		anchorX: {
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
		},
		anchorY: {
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
		},
	},
	blur: {
		quality: {
			type: 'range',
			min: 0,
			max: 5,
			step: 1,
		},
		blur: {
			type: 'range',
			min: 0,
			max: 10,
			step: 1,
		},
		blurX: {
			type: 'range',
			min: 0,
			max: 10,
			step: 1,
		},
		blurY: {
			type: 'range',
			min: 0,
			max: 10,
			step: 1,
		},
	},
	zoomblur: {
		innerRadiusPercent: {
			type: 'range',
			min: 0,
			max: 300,
			step: 1,
		},
		strength: ALPHA_CONTROL,
	},
	shockwave: {
		amplitude: {
			type: 'range',
			min: 0,
			max: 50,
			step: 1,
		},
		wavelength: {
			type: 'range',
			min: 0,
			max: 500,
			step: 1,
		},
		radius: {
			type: 'range',
			min: 0,
			max: 500,
			step: 1,
		},
		brightness: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.1,
		},
		speed: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
	},
	zapshadow: {
		alphaTolerance: ALPHA_CONTROL,
	},
	ray: {
		divisor: {
			type: 'range',
			min: 0,
			max: 600,
			step: 1,
		},
		dimX: {
			type: 'range',
			min: 1,
			max: 200,
			step: 1,
		},
		dimY: {
			type: 'range',
			min: 1,
			max: 200,
			step: 1,
		},
	},
	fog: {
		density: ALPHA_CONTROL,
		dimX: {
			type: 'range',
			min: -15,
			max: 15,
			step: 1,
		},
		dimY: {
			type: 'range',
			min: -15,
			max: 15,
			step: 1,
		},
	},
	electric: {
		intensity: {
			type: 'range',
			min: 0,
			max: 10,
			step: 1,
			animatable: false,
		},
	},
	fumes: {
		dimX: ALPHA_CONTROL,
		dimY: ALPHA_CONTROL,
	},
	wave: {
		strength: {
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
		},
		frequency: {
			type: 'range',
			min: 0,
			max: 300,
			step: 1,
		},
		maxIntensity: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.01,
		},
		minIntensity: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.01,
		},
	},
};

export const ANIM_PARAM_CONTROLS = {
	active: { type: 'boolean', order: -1 },
	val1: { type: 'number', order: 1 },
	val2: { type: 'number', order: 2 },
	loopDuration: { type: 'range', min: 0, max: 60000, step: 20, order: 20 },
	speed: { type: 'number', order: 30 },
	wantInteger: { type: 'boolean', order: 40 },
	chaosFactor: { type: 'range', min: 0, max: 1, step: 0.01, order: 50 },
	syncShift: { type: 'range', min: 0, max: 1, step: 0.01, order: 60 },
	clockwise: { type: 'boolean', order: 70 },
	loops: { type: 'number', step: 1, min: 0, order: 80 },
};
