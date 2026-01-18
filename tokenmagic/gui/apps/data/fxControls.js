export const FILTER_PARAM_CONTROLS = {
	common: {
		filterId: {
			type: 'text',
		},
		color: {
			type: 'color',
			subtype: 'numeric',
		},
		time: {
			type: 'range',
			min: 0,
			max: 30000,
			step: 1,
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
		enabled: {
			type: 'boolean',
		},
	},
	fire: {
		intensity: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
		},
		amplitude: {
			type: 'range',
			min: 0,
			max: 100,
			step: 1,
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
