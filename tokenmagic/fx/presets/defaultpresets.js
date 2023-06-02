export const PresetsLibrary = {
	MAIN: 'tmfx-main',
	TEMPLATE: 'tmfx-template',
};

export var presets = [];

let params = [
	{
		filterType: 'bevel',
		filterId: 'bevel',
		rotation: 0,
		thickness: 5,
		lightColor: 0xff0000,
		lightAlpha: 0.8,
		shadowColor: 0x00ff00,
		shadowAlpha: 0.5,
		animated: {
			rotation: {
				active: true,
				clockWise: true,
				loopDuration: 1600,
				animType: 'syncRotation',
			},
		},
	},
];

var presetObject = {};
presetObject.name = 'bevel';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'adjustment',
		filterId: 'adjustment',
		saturation: 1.5,
		brightness: 1.5,
		contrast: 2,
		gamma: 2,
		red: 4,
		green: 0.25,
		blue: 0.25,
		alpha: 1,
		animated: {
			alpha: {
				active: true,
				loopDuration: 5000,
				animType: 'syncCosOscillation',
				val1: 0.15,
				val2: 1,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'adjustment';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'shadow',
		filterId: 'dropshadow',
		rotation: 35,
		blur: 2,
		quality: 5,
		distance: 20,
		alpha: 0.7,
		padding: 10,
		shadowOnly: false,
		color: 0x000000,
		animated: {
			blur: {
				active: true,
				loopDuration: 1500,
				animType: 'syncCosOscillation',
				val1: 2,
				val2: 3,
			},
			rotation: {
				active: true,
				loopDuration: 150,
				animType: 'syncSinOscillation',
				val1: 33,
				val2: 35,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'dropshadow';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'outline',
		filterId: 'outline',
		padding: 10,
		color: 0xee6035,
		thickness: 1,
		quality: 5,
		animated: {
			thickness: {
				active: true,
				loopDuration: 800,
				animType: 'syncCosOscillation',
				val1: 1,
				val2: 6,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'outline';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'glow',
		filterId: 'glow',
		outerStrength: 7,
		innerStrength: 0,
		color: 0x006000,
		quality: 0.5,
		padding: 10,
		animated: {
			color: {
				active: true,
				loopDuration: 3000,
				animType: 'colorOscillation',
				val1: 0x003000,
				val2: 0x00ff00,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'glow';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'xbloom',
		filterId: 'bloom',
		threshold: 0.35,
		bloomScale: 0,
		brightness: 1,
		blur: 0.1,
		padding: 10,
		quality: 15,
		blendMode: 0,
		animated: {
			bloomScale: {
				active: true,
				loopDuration: 2000,
				animType: 'syncCosOscillation',
				val1: 0,
				val2: 2.1,
			},
			threshold: {
				active: false,
				loopDuration: 1000,
				animType: 'syncCosOscillation',
				val1: 0.0,
				val2: 1.9,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'bloom';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'distortion',
		filterId: 'distortion',
		maskPath: 'modules/tokenmagic/fx/assets/distortion-1.png',
		maskSpriteScaleX: 5,
		maskSpriteScaleY: 5,
		padding: 20,
		animated: {
			maskSpriteX: { active: true, speed: 0.05, animType: 'move' },
			maskSpriteY: { active: true, speed: 0.07, animType: 'move' },
		},
	},
];

presetObject = new Object();
presetObject.name = 'distortion';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'oldfilm',
		filterId: 'oldfilm',
		sepia: 0.6,
		noise: 0.2,
		noiseSize: 1.0,
		scratch: 0.8,
		scratchDensity: 0.5,
		scratchWidth: 1.2,
		vignetting: 0.9,
		vignettingAlpha: 0.6,
		vignettingBlur: 0.2,
		animated: {
			seed: {
				active: true,
				animType: 'randomNumber',
				val1: 0,
				val2: 1,
			},
			vignetting: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 2000,
				val1: 0.2,
				val2: 0.4,
			},
		},
	},
	{
		filterType: 'outline',
		filterId: 'oldfilm',
		color: 0x000000,
		thickness: 0,
	},
];

presetObject = new Object();
presetObject.name = 'oldfilm';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'twist',
		filterId: 'twist',
		radiusPercent: 120,
		angle: 0,
		animated: {
			angle: {
				active: true,
				animType: 'sinOscillation',
				loopDuration: 10000,
				val1: -0.6 * Math.PI,
				val2: +0.6 * Math.PI,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'twist';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'bulgepinch',
		filterId: 'bulge',
		padding: 150,
		strength: 0,
		zIndex: 2,
		radiusPercent: 200,
		animated: {
			strength: {
				active: true,
				animType: 'cosOscillation',
				loopDuration: 2000,
				val1: 0,
				val2: 0.45,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'bulge';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'blur',
		filterId: 'blur',
		padding: 10,
		quality: 4.0,
		blur: 0,
		blurX: 0,
		blurY: 0,
		animated: {
			blurX: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 500,
				val1: 0,
				val2: 6,
			},
			blurY: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 750,
				val1: 0,
				val2: 6,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'blur';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zoomblur',
		filterId: 'zoomblur',
		strength: 0.15,
		innerRadiusPercent: 65,
		radiusPercent: 100,
		padding: 30,
		animated: {
			innerRadiusPercent: {
				active: true,
				animType: 'sinOscillation',
				loopDuration: 500,
				val1: 65,
				val2: 75,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'zoomblur';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'shockwave',
		filterId: 'shockwave',
		time: 0,
		amplitude: 8,
		wavelength: 75,
		radius: 500,
		brightness: 1.5,
		speed: 25,
		padding: 0,
		animated: {
			time: {
				animType: 'cosOscillation',
				active: true,
				loopDuration: 1800,
				val1: 0,
				val2: 10,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'shockwave';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zapshadow',
		filterId: 'zapshadow',
		alphaTolerance: 0.45,
	},
];

presetObject = new Object();
presetObject.name = 'zapshadow';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'ray',
		filterId: 'rays',
		time: 0,
		color: 0xcf8000,
		alpha: 0.5,
		divisor: 32,
		anchorX: 0,
		anchorY: 0,
		animated: {
			time: {
				active: true,
				speed: 0.0005,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'rays';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'fog',
		filterId: 'fog',
		color: 0x000000,
		density: 0.65,
		time: 0,
		dimX: 1,
		dimY: 1,
		animated: {
			time: {
				active: true,
				speed: 2.2,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'fog';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'fumes',
		filterId: 'fumes',
		color: 0x808080,
		time: 0,
		blend: 8,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'fumes';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'electric',
		filterId: 'electric',
		color: 0xffffff,
		time: 0,
		blend: 1,
		intensity: 5,
		animated: {
			time: {
				active: true,
				speed: 0.002,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'electric';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'fire',
		filterId: 'fire',
		intensity: 1,
		color: 0xffffff,
		amplitude: 1,
		time: 0,
		blend: 2,
		fireBlend: 1,
		animated: {
			time: {
				active: true,
				speed: -0.0024,
				animType: 'move',
			},
			intensity: {
				active: true,
				loopDuration: 15000,
				val1: 0.8,
				val2: 2,
				animType: 'syncCosOscillation',
			},
			amplitude: {
				active: true,
				loopDuration: 4400,
				val1: 1,
				val2: 1.4,
				animType: 'syncCosOscillation',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'fire';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'wave',
		filterId: 'waves',
		time: 0,
		anchorX: 0.5,
		anchorY: 0.5,
		strength: 0.015,
		frequency: 120,
		color: 0xffffff,
		maxIntensity: 2.5,
		minIntensity: 0.9,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0085,
				animType: 'move',
			},
			anchorX: {
				active: false,
				val1: 0.15,
				val2: 0.85,
				animType: 'syncChaoticOscillation',
				loopDuration: 20000,
			},
			anchorY: {
				active: false,
				val1: 0.15,
				val2: 0.85,
				animType: 'syncSinOscillation',
				loopDuration: 20000,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'waves';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'flood',
		filterId: 'flood',
		time: 0,
		color: 0x0020bb,
		billowy: 0.43,
		tintIntensity: 0.72,
		glint: 0.31,
		scale: 70,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0006,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'flood';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'smoke',
		filterId: 'smoke',
		color: 0x5099dd,
		time: 0,
		blend: 2,
		dimX: 0.1,
		dimY: 1,
		animated: {
			time: {
				active: true,
				speed: 0.009,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'smoke';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'images',
		filterId: 'images',
		time: 0,
		nbImage: 4,
		alphaImg: 1.0,
		alphaChr: 0.0,
		blend: 4,
		ampX: 0.1,
		ampY: 0.1,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'images';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'images',
		filterId: 'chaos-images',
		time: 0,
		nbImage: 4,
		alphaImg: 1.0,
		alphaChr: 0.0,
		blend: 4,
		ampX: 0.1,
		ampY: 0.1,
		padding: 80,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
			ampX: {
				active: true,
				val1: 0.0,
				val2: 0.3,
				chaosFactor: 0.03,
				animType: 'syncChaoticOscillation',
				loopDuration: 2000,
			},
			ampY: {
				active: true,
				val1: 0.0,
				val2: 0.3,
				chaosFactor: 0.04,
				animType: 'syncChaoticOscillation',
				loopDuration: 1650,
			},
			alphaChr: {
				active: true,
				animType: 'randomNumberPerLoop',
				val1: 0.0,
				val2: 1,
				loopDuration: 250,
			},
			alphaImg: {
				active: true,
				animType: 'randomNumberPerLoop',
				val1: 0.8,
				val2: 1,
				loopDuration: 250,
			},
			nbImage: {
				active: true,
				val1: 1,
				val2: 9,
				animType: 'syncSinOscillation',
				loopDuration: 1400,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'chaos-images';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'images',
		filterId: 'spectral-images',
		time: 0,
		blend: 4,
		nbImage: 4,
		padding: 100,
		alphaImg: 0.5,
		alphaChr: 0.0,
		ampX: 0.1,
		ampY: 0.1,
		animated: {
			time: {
				speed: 0.001,
				animType: 'move',
			},
			ampX: {
				val1: 0,
				val2: 0.22,
				animType: 'syncCosOscillation',
				loopDuration: 2500,
			},
			ampY: {
				val1: 0,
				val2: 0.24,
				animType: 'syncCosOscillation',
				loopDuration: 2500,
				pauseBetweenDuration: 2500,
			},
			alphaChr: {
				val1: 1,
				val2: 0,
				animType: 'syncCosOscillation',
				loopDuration: 2500,
			},
			alphaImg: {
				val1: 0.2,
				val2: 0.8,
				animType: 'syncSinOscillation',
				loopDuration: 2500,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'spectral-images';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'hexa-field',
		shieldType: 2,
		gridPadding: 1.5,
		color: 0xcc00cc,
		time: 0,
		blend: 3,
		intensity: 1,
		lightAlpha: 0.5,
		lightSize: 0.5,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'hexa-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'fire-field',
		shieldType: 1,
		gridPadding: 2,
		color: 0xe58550,
		time: 0,
		blend: 2,
		intensity: 1.15,
		lightAlpha: 2,
		lightSize: 0.7,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'fire-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'smoke-field',
		shieldType: 3,
		gridPadding: 1.5,
		color: 0x60cc70,
		time: 0,
		blend: 2,
		intensity: 0.9,
		lightAlpha: 1,
		lightSize: 0.7,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'smoke-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'earth-field',
		shieldType: 4,
		gridPadding: 2,
		color: 0xbb9070,
		time: 0,
		blend: 1,
		intensity: 1.25,
		lightAlpha: 1,
		lightSize: 0.7,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'earth-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'earth-field-top',
		shieldType: 5,
		gridPadding: 3,
		color: 0xaaaaaa,
		time: 0,
		blend: 5,
		intensity: 1.9,
		lightAlpha: 1,
		lightSize: 0.7,
		scale: 1,
		radius: 1,
		zIndex: 5,
		chromatic: true,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'earth-field-top';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'air-field',
		shieldType: 6,
		gridPadding: 1.2,
		color: 0x7090aa,
		time: 0,
		blend: 14,
		intensity: 1,
		lightAlpha: 1,
		lightSize: 0.7,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'air-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'magic-field',
		shieldType: 7,
		gridPadding: 1,
		color: 0xffffff,
		time: 0,
		blend: 10,
		intensity: 0.8,
		lightAlpha: 1,
		lightSize: 0.45,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'magic-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'chromatic-field',
		shieldType: 8,
		gridPadding: 2,
		color: 0xaaaaaa,
		time: 0,
		blend: 0,
		intensity: 1,
		lightAlpha: 0,
		lightSize: 0,
		scale: 1,
		radius: 1,
		chromatic: true,
		animated: {
			time: {
				active: true,
				speed: 0.0045,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'chromatic-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'water-field',
		shieldType: 9,
		gridPadding: 1.2,
		color: 0x20bbee,
		time: 0,
		blend: 4,
		intensity: 1,
		lightAlpha: 0.7,
		lightSize: 0.5,
		scale: 0.6,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'water-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'evil-field',
		shieldType: 9,
		gridPadding: 2,
		color: 0xff3010,
		time: 0,
		blend: 5,
		intensity: 1,
		lightAlpha: 4,
		lightSize: 0.8,
		scale: 0.5,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0012,
				animType: 'move',
			},
			lightSize: {
				val1: 0.4,
				val2: 1.5,
				animType: 'syncCosOscillation',
				loopDuration: 5000,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'evil-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'grid-field',
		shieldType: 11,
		gridPadding: 2,
		color: 0x00cccc,
		time: 0,
		blend: 2,
		intensity: 1,
		lightAlpha: 1,
		lightSize: 0.3,
		scale: 0.5,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0009,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'grid-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'warp-field',
		shieldType: 12,
		gridPadding: 2,
		color: 0xffffff,
		time: 0,
		blend: 2,
		intensity: 1,
		lightAlpha: 0.8,
		lightSize: 0.5,
		scale: 0.9,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0009,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'warp-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'field',
		filterId: 'color-field',
		shieldType: 13,
		gridPadding: 2,
		color: 0x00cc00,
		time: 0,
		blend: 14,
		intensity: 1,
		lightAlpha: 0,
		lightSize: 0,
		scale: 1,
		radius: 1,
		chromatic: false,
		animated: {
			time: {
				active: true,
				speed: 0.0009,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'color-field';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'xray',
		filterId: 'sunburst',
		time: 0,
		color: 0xffbb00,
		blend: 9,
		dimX: 1,
		dimY: 1,
		anchorX: 0,
		anchorY: 0,
		divisor: 36,
		intensity: 4,
		animated: {
			time: {
				active: true,
				speed: 0.0012,
				animType: 'move',
			},
			anchorX: {
				animType: 'syncCosOscillation',
				loopDuration: 6000,
				val1: 0.4,
				val2: 0.6,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'sunburst';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'xray',
		filterId: 'clover',
		time: 0,
		color: 0x00ff00,
		blend: 9,
		dimX: 0.05,
		dimY: 0.05,
		anchorX: 0.5,
		anchorY: 0.5,
		divisor: 4,
		intensity: 1,
		animated: {
			time: {
				active: true,
				speed: 0.0012,
				animType: 'move',
			},
			anchorX: {
				animType: 'syncCosOscillation',
				loopDuration: 6000,
				val1: 0.4,
				val2: 0.6,
			},
			anchorY: {
				animType: 'syncSinOscillation',
				loopDuration: 6000,
				val1: 0.4,
				val2: 0.6,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'clover';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'xray',
		filterId: 'scan',
		time: 0,
		color: 0xffffff,
		blend: 5,
		dimX: 20,
		dimY: 20,
		anchorX: 0.5,
		anchorY: 0,
		divisor: 8,
		intensity: 1,
		animated: {
			time: {
				active: true,
				speed: 0.0005,
				animType: 'move',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'scan';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'xray',
		filterId: 'blue-rays',
		time: 0,
		color: 0x1030ff,
		blend: 9,
		dimX: 1,
		dimY: 1,
		anchorX: 0,
		anchorY: 0,
		divisor: 24,
		intensity: 1,
		animated: {
			time: {
				active: true,
				speed: 0.0002,
				animType: 'move',
			},
			anchorX: {
				animType: 'syncCosOscillation',
				loopDuration: 18000,
				val1: 0.05,
				val2: 0.95,
			},
			anchorY: {
				animType: 'syncSinOscillation',
				loopDuration: 18000,
				val1: 0.05,
				val2: 0.95,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'blue-rays';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'liquid',
		filterId: 'spectral-body',
		color: 0x20aaee,
		time: 0,
		blend: 8,
		intensity: 4,
		spectral: true,
		scale: 0.9,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
			color: {
				active: true,
				loopDuration: 6000,
				animType: 'colorOscillation',
				val1: 0xffffff,
				val2: 0x00aaff,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'spectral-body';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'liquid',
		filterId: 'mantle-of-madness',
		color: 0x0090ff,
		time: 0,
		blend: 5,
		intensity: 0.0001,
		spectral: false,
		scale: 7,
		animated: {
			time: {
				active: true,
				speed: 0.0015,
				animType: 'move',
			},
			intensity: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 30000,
				val1: 0.0001,
				val2: 4,
			},
			scale: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 30000,
				val1: 7,
				val2: 1,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'mantle-of-madness';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'wave',
		filterId: 'drift-in-plans',
		time: 0,
		anchorX: 0.5,
		anchorY: 0.5,
		strength: 0.035,
		frequency: 80,
		color: 0xffffff,
		maxIntensity: 1.5,
		minIntensity: 0.5,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0085,
				animType: 'move',
			},
			anchorX: {
				active: true,
				val1: 0.35,
				val2: 0.65,
				animType: 'syncCosOscillation',
				loopDuration: 10000,
			},
			anchorY: {
				active: true,
				val1: 0.35,
				val2: 0.65,
				animType: 'syncSinOscillation',
				loopDuration: 10000,
			},
		},
	},
	{
		filterType: 'liquid',
		filterId: 'drift-in-plans',
		color: 0xff0000,
		time: 0,
		blend: 6,
		intensity: 5,
		spectral: false,
		scale: 2.5,
		animated: {
			time: {
				active: true,
				speed: 0.0018,
				animType: 'move',
			},
			color: {
				active: true,
				loopDuration: 9000,
				animType: 'colorOscillation',
				val1: 0xff0000,
				val2: 0xffffff,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'drift-in-plans';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zapshadow',
		filterId: 'fire-aura',
		alphaTolerance: 0.5,
	},
	{
		filterType: 'xglow',
		filterId: 'fire-aura',
		auraType: 2,
		color: 0x903010,
		thickness: 9.8,
		scale: 4,
		time: 0,
		auraIntensity: 2,
		subAuraIntensity: 1.5,
		threshold: 0.4,
		discard: true,
		animated: {
			time: {
				active: true,
				speed: 0.0027,
				animType: 'move',
			},
			thickness: {
				active: true,
				loopDuration: 3000,
				animType: 'cosOscillation',
				val1: 2,
				val2: 5,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'fire-aura';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zapshadow',
		filterId: 'glacial-aura',
		alphaTolerance: 0.5,
	},
	{
		filterType: 'xglow',
		filterId: 'glacial-aura',
		auraType: 1,
		color: 0x5099dd,
		thickness: 4.5,
		scale: 3,
		time: 0,
		auraIntensity: 0.8,
		subAuraIntensity: 0.25,
		threshold: 0.5,
		discard: false,
		animated: {
			time: {
				active: true,
				speed: 0.0018,
				animType: 'move',
			},
			thickness: {
				val1: 2,
				val2: 4.7,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
			subAuraIntensity: {
				val1: 0.45,
				val2: 0.65,
				animType: 'cosOscillation',
				loopDuration: 6000,
			},
			auraIntensity: {
				val1: 0.9,
				val2: 2.2,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'glacial-aura';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zapshadow',
		filterId: 'anti-aura',
		alphaTolerance: 0.5,
	},
	{
		filterType: 'xglow',
		filterId: 'anti-aura',
		auraType: 2,
		color: 0x050505,
		thickness: 2.7,
		scale: 7,
		time: 0,
		auraIntensity: 5,
		subAuraIntensity: 2,
		threshold: 0.08,
		discard: false,
		animated: {
			time: {
				active: true,
				speed: 0.0012,
				animType: 'move',
			},
			auraIntensity: {
				active: true,
				loopDuration: 3000,
				animType: 'syncCosOscillation',
				val1: 5,
				val2: 0,
			},
			subAuraIntensity: {
				active: true,
				loopDuration: 3000,
				animType: 'syncCosOscillation',
				val1: 2,
				val2: 0,
			},
			color: {
				active: true,
				loopDuration: 6000,
				animType: 'syncColorOscillation',
				val1: 0x050505,
				val2: 0x200000,
			},
			threshold: {
				active: true,
				loopDuration: 1500,
				animType: 'syncCosOscillation',
				val1: 0.02,
				val2: 0.5,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'anti-aura';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'fire',
		filterId: 'pure-fire-aura',
		intensity: 1,
		color: 0xffffff,
		amplitude: 1,
		time: 0,
		blend: 2,
		fireBlend: 1,
		animated: {
			time: {
				active: true,
				speed: -0.0024,
				animType: 'move',
			},
			intensity: {
				active: true,
				loopDuration: 15000,
				val1: 0.8,
				val2: 2,
				animType: 'syncCosOscillation',
			},
			amplitude: {
				active: true,
				loopDuration: 4400,
				val1: 1,
				val2: 1.4,
				animType: 'syncCosOscillation',
			},
		},
	},
	{
		filterType: 'zapshadow',
		filterId: 'pure-fire-aura',
		alphaTolerance: 0.5,
	},
	{
		filterType: 'xglow',
		filterId: 'pure-fire-aura',
		auraType: 2,
		color: 0x903010,
		thickness: 9.8,
		scale: 4,
		time: 0,
		auraIntensity: 2,
		subAuraIntensity: 1.5,
		threshold: 0.4,
		discard: true,
		animated: {
			time: {
				active: true,
				speed: 0.0027,
				animType: 'move',
			},
			thickness: {
				active: true,
				loopDuration: 3000,
				animType: 'cosOscillation',
				val1: 2,
				val2: 5,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'pure-fire-aura';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zapshadow',
		filterId: 'pure-fire-aura-2',
		alphaTolerance: 0.5,
	},
	{
		filterType: 'xglow',
		filterId: 'pure-fire-aura-2',
		auraType: 2,
		color: 0x903010,
		thickness: 9.8,
		scale: 4,
		time: 0,
		auraIntensity: 1,
		subAuraIntensity: 0.3,
		threshold: 0.5,
		discard: true,
		animated: {
			time: {
				active: true,
				speed: 0.0027,
				animType: 'move',
			},
			thickness: {
				active: true,
				loopDuration: 3000,
				animType: 'cosOscillation',
				val1: 2,
				val2: 3.6,
			},
		},
	},
	{
		filterType: 'fire',
		filterId: 'pure-fire-aura-2',
		intensity: 1,
		color: 0xffffff,
		amplitude: 1,
		time: 0,
		blend: 2,
		fireBlend: 1,
		animated: {
			time: {
				active: true,
				speed: -0.0024,
				animType: 'move',
			},
			intensity: {
				active: true,
				loopDuration: 15000,
				val1: 0.8,
				val2: 3,
				animType: 'syncCosOscillation',
			},
			amplitude: {
				active: true,
				loopDuration: 4400,
				val1: 1,
				val2: 1.6,
				animType: 'syncCosOscillation',
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'pure-fire-aura-2';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'zapshadow',
		filterId: 'pure-ice-aura',
		alphaTolerance: 0.5,
	},
	{
		filterType: 'xglow',
		filterId: 'pure-ice-aura',
		auraType: 1,
		color: 0x5099dd,
		thickness: 4.5,
		scale: 10,
		time: 0,
		auraIntensity: 0.25,
		subAuraIntensity: 1,
		threshold: 0.5,
		discard: false,
		animated: {
			time: {
				active: true,
				speed: 0.0018,
				animType: 'move',
			},
			thickness: {
				val1: 2,
				val2: 3.3,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
			subAuraIntensity: {
				val1: 0.45,
				val2: 0.65,
				animType: 'cosOscillation',
				loopDuration: 6000,
			},
			auraIntensity: {
				val1: 0.9,
				val2: 2.2,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
		},
	},
	{
		filterType: 'smoke',
		filterId: 'pure-ice-aura',
		color: 0x80ccff,
		time: 0,
		blend: 2,
		dimX: 0.3,
		dimY: 1,
		animated: {
			time: {
				active: true,
				speed: -0.006,
				animType: 'move',
			},
			dimX: {
				val1: 0.4,
				val2: 0.2,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
		},
	},
];

presetObject = new Object();
presetObject.name = 'pure-ice-aura';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

params = [
	{
		filterType: 'pixel',
		filterId: 'pixelate',
		sizeX: 2.5,
		sizeY: 2.5,
	},
];

presetObject = new Object();
presetObject.name = 'pixelate';
presetObject.library = PresetsLibrary.MAIN;
presetObject.params = params;
presets.push(presetObject);

export var templatePresets = [];

// white : **electric , **waves, ***xrays, **liquid (normal), (clover)
// black : **liquid (protoplasm), **smoke, **rays, outline, **fumes, **fog, **flood, **fire
// no texture : **glow, **bulge, **blur, **bloom

params = [
	{
		filterType: 'flood',
		filterId: 'Watery Surface',
		time: 0,
		color: 0x0020bb,
		billowy: 0.43,
		tintIntensity: 0.72,
		glint: 0.31,
		scale: 70,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0006,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Watery Surface';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'liquid',
		filterId: 'Protoplasm',
		color: 0x20aaee,
		time: 0,
		blend: 8,
		intensity: 4,
		spectral: true,
		scale: 1.4,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Protoplasm';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'liquid',
		filterId: 'Watery Surface 2',
		color: 0x20aaee,
		time: 0,
		blend: 8,
		intensity: 4,
		spectral: false,
		scale: 1.4,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Watery Surface 2';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'smoke',
		filterId: 'Smoky Area',
		color: 0xaaaaaa,
		time: 0,
		blend: 2,
		dimX: 1,
		dimY: 1,
		animated: {
			time: {
				active: true,
				speed: 0.002,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Smoky Area';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'electric',
		filterId: 'Shock',
		color: 0xffffff,
		time: 0,
		blend: 1,
		intensity: 5,
		animated: {
			time: {
				active: true,
				speed: 0.002,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Shock';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'xray',
		filterId: 'Annihilating Rays',
		time: 0,
		color: 0xffbb00,
		blend: 9,
		dimX: 1,
		dimY: 1,
		anchorX: 0,
		anchorY: 0,
		divisor: 6,
		intensity: 4,
		animated: {
			time: {
				active: true,
				speed: 0.0012,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Annihilating Rays';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'ray',
		filterId: 'Classic Rays',
		time: 0,
		color: 0xcf8000,
		alpha: 0.5,
		divisor: 32,
		anchorX: 0,
		anchorY: 0,
		animated: {
			time: {
				active: true,
				speed: 0.0005,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Classic Rays';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'fumes',
		filterId: 'Smoke Filaments',
		color: 0x808080,
		time: 0,
		blend: 8,
		animated: {
			time: {
				active: true,
				speed: 0.001,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Smoke Filaments';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'fire',
		filterId: 'Flames',
		intensity: 1.5,
		color: 0xffffff,
		amplitude: 1.3,
		time: 0,
		blend: 2,
		fireBlend: 1,
		animated: {
			time: {
				active: true,
				speed: -0.0016,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Flames';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'xfog',
		filterId: 'Thick Fog',
		autoFit: false,
		color: 0x3090ff,
		time: 0,
		animated: {
			time: {
				active: true,
				speed: 0.0006,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Thick Fog';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-vstrong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'glow',
		filterId: 'Glowing Outline',
		outerStrength: 5.5,
		innerStrength: 0,
		color: 0x006000,
		quality: 0.5,
		padding: 10,
		animated: {
			outerStrength: {
				active: true,
				loopDuration: 3000,
				animType: 'syncCosOscillation',
				val1: 5.5,
				val2: 1.5,
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Glowing Outline';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'wave',
		filterId: 'Waves',
		time: 0,
		anchorX: 0.5,
		anchorY: 0.5,
		strength: 0.015,
		frequency: 120,
		color: 0xffffff,
		maxIntensity: 2.5,
		minIntensity: 0.9,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0085,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Waves';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'wave',
		filterId: 'Waves 2',
		time: 0,
		anchorX: 0.5,
		anchorY: 0.5,
		strength: 0.014,
		frequency: 400,
		color: 0xffffff,
		maxIntensity: 2.4,
		minIntensity: 0.8,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0385,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Waves 2';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'wave',
		filterId: 'Waves 3',
		time: 0,
		anchorX: 0.5,
		anchorY: 0.5,
		strength: 0.017,
		frequency: 35,
		color: 0xffffff,
		maxIntensity: 2.6,
		minIntensity: 0.9,
		padding: 20,
		animated: {
			time: {
				active: true,
				speed: 0.0085,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Waves 3';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'xglow',
		filterId: 'Zone : Fire',
		auraType: 1,
		color: 0x903010,
		scale: 1.5,
		time: 0,
		auraIntensity: 1.8,
		subAuraIntensity: 0.25,
		threshold: 0.6,
		discard: false,
		animated: {
			time: {
				active: true,
				speed: 0.0027,
				animType: 'move',
			},
			thickness: {
				active: true,
				loopDuration: 3000,
				animType: 'cosOscillation',
				val1: 2,
				val2: 5,
			},
		},
	},
	{
		filterType: 'fire',
		filterId: 'Zone : Fire',
		intensity: 1.5,
		color: 0xffffff,
		amplitude: 1,
		time: 0,
		blend: 2,
		fireBlend: 1,
		animated: {
			time: {
				active: true,
				speed: -0.0015,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Zone : Fire';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'xglow',
		filterId: 'Zone : Electricity',
		auraType: 2,
		color: 0x303030,
		scale: 1.5,
		time: 0,
		auraIntensity: 1,
		subAuraIntensity: 0.9,
		threshold: 0,
		discard: true,
		animated: {
			time: {
				active: true,
				speed: 0.0027,
				animType: 'move',
			},
			thickness: {
				active: true,
				loopDuration: 3000,
				animType: 'cosOscillation',
				val1: 1,
				val2: 2,
			},
		},
	},
	{
		filterType: 'electric',
		filterId: 'Zone : Electricity',
		color: 0xffffff,
		time: 0,
		blend: 1,
		intensity: 5,
		animated: {
			time: {
				active: true,
				speed: 0.002,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Zone : Electricity';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'xglow',
		filterId: 'Zone : Blizzard',
		auraType: 1,
		color: 0x5099dd,
		thickness: 4.5,
		scale: 5,
		time: 0,
		auraIntensity: 0.25,
		subAuraIntensity: 1,
		threshold: 0.5,
		discard: false,
		animated: {
			time: {
				active: true,
				speed: 0.0018,
				animType: 'move',
			},
			thickness: {
				val1: 2,
				val2: 3.3,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
			subAuraIntensity: {
				val1: 0.05,
				val2: 0.1,
				animType: 'cosOscillation',
				loopDuration: 6000,
			},
			auraIntensity: {
				val1: 0.9,
				val2: 2.2,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
		},
	},
	{
		filterType: 'smoke',
		filterId: 'Zone : Blizzard',
		color: 0x80ccff,
		time: 0,
		blend: 2,
		dimY: 1,
		animated: {
			time: {
				active: true,
				speed: -0.005,
				animType: 'move',
			},
			dimX: {
				val1: 0.4,
				val2: 0.2,
				animType: 'cosOscillation',
				loopDuration: 3000,
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Zone : Blizzard';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'bulgepinch',
		filterId: 'Bulging Out',
		padding: 150,
		strength: 0,
		radiusPercent: 200,
		animated: {
			strength: {
				active: true,
				animType: 'cosOscillation',
				loopDuration: 2000,
				val1: 0,
				val2: 0.45,
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Bulging Out';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'blur',
		filterId: 'Blurred Texture',
		padding: 25,
		quality: 4.0,
		blur: 0,
		blurX: 0,
		blurY: 0,
		animated: {
			blurX: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 500,
				val1: 0,
				val2: 6,
			},
			blurY: {
				active: true,
				animType: 'syncCosOscillation',
				loopDuration: 750,
				val1: 0,
				val2: 6,
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Blurred Texture';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'xbloom',
		filterId: 'Bloomed Texture',
		threshold: 0.35,
		bloomScale: 0,
		brightness: 1,
		blur: 0.1,
		padding: 10,
		quality: 15,
		blendMode: 0,
		animated: {
			bloomScale: {
				active: true,
				loopDuration: 2000,
				animType: 'syncCosOscillation',
				val1: 0,
				val2: 2.1,
			},
			threshold: {
				active: false,
				loopDuration: 1000,
				animType: 'syncCosOscillation',
				val1: 0.0,
				val2: 1.9,
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Bloomed Texture';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'liquid',
		filterId: 'Wild Magic',
		color: 0xff0000,
		time: 0,
		blend: 6,
		intensity: 5,
		spectral: false,
		scale: 2.5,
		animated: {
			time: {
				active: true,
				speed: 0.0018,
				animType: 'move',
			},
		},
	},
	{
		filterType: 'wave',
		filterId: 'Wild Magic',
		time: 0,
		anchorX: 0.5,
		anchorY: 0.5,
		strength: 0.014,
		frequency: 10,
		color: 0xffffff,
		maxIntensity: 1.3,
		minIntensity: 0.6,
		padding: 10,
		animated: {
			time: {
				active: true,
				speed: 0.0065,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Wild Magic';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'web',
		filterId: 'Spider Web 1',
		anchorX: 0.5,
		anchorY: 0.5,
		color: 0xffffff,
		thickness: 2,
		div2: 5,
		time: 98.8,
		animated: {
			time: {
				active: true,
				loopDuration: 5000,
				animType: 'cosOscillation',
				val1: 98.8,
				val2: 99.7,
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Spider Web 1';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'web',
		filterId: 'Spider Web 2',
		anchorX: 0.5,
		anchorY: 0.5,
		color: 0xcccccc,
		animated: {
			time: {
				active: true,
				speed: 0.0005,
				animType: 'move',
			},
		},
	},
	{
		filterType: 'liquid',
		filterId: 'Spider Web 2',
		color: 0xff0000,
		time: 0,
		blend: 4,
		intensity: 8,
		spectral: false,
		scale: 0.2,
		animated: {
			time: {
				active: true,
				speed: 0.0005,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Spider Web 2';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

params = [
	{
		filterType: 'web',
		filterId: 'Spider Web 3',
		anchorX: 0.5,
		anchorY: 0.5,
		color: 0xcccccc,
		time: 100,
	},
	{
		filterType: 'liquid',
		filterId: 'Spider Web 3',
		color: 0xff0000,
		time: 0,
		blend: 1,
		intensity: 4,
		spectral: true,
		scale: 0.2,
		animated: {
			time: {
				active: true,
				speed: 0.0005,
				animType: 'move',
			},
		},
	},
];

presetObject = {};
presetObject.name = 'Spider Web 3';
presetObject.library = PresetsLibrary.TEMPLATE;
presetObject.defaultTexture = 'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png';
presetObject.params = params;
templatePresets.push(presetObject);

export var allPresets = presets.concat(templatePresets);
