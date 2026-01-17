export const UI_CONTROLS = {
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
