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
		},
	},
};

export const ANIM_PARAM_CONTROLS = {
	active: { type: 'boolean' },
	speed: { type: 'number' },
	loopDuration: { type: 'range', min: 0, max: 60000, step: 10 },
	loops: { type: 'number', step: 1, min: 0 },
	wantInteger: { type: 'boolean' },
	chaosFactor: { type: 'range', min: 0, max: 1, step: 0.01 },
	syncShift: { type: 'range', min: 0, max: 1, step: 0.01 },
	val1: { type: 'number' },
	val2: { type: 'number' },
	clockwise: { type: 'boolean' },
};
