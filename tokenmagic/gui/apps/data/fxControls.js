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
		blend: {
			type: 'range',
			min: 0,
			max: 13,
			step: 1,
		},
		fireBlend: {
			type: 'range',
			min: 0,
			max: 13,
			step: 1,
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
		gridPadding: {
			type: 'range',
			min: 0,
			max: 10,
			step: 0.1,
			animatable: false,
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
	},
	bulgepinch: {
		strength: {
			type: 'range',
			min: -1,
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
