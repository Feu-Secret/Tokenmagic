import { getPlaceableById, getMinPadding, PlaceableType } from '../../../module/tokenmagic.js';
import '../../../module/proto/PlaceableObjectProto.js';

PIXI.Filter.prototype.setTMParams = function (params) {
	this.autoDisable = false;
	this.autoDestroy = false;
	this.gridPadding = 0;
	this.boundsPadding = new PIXI.Point(0, 0);
	this.currentPadding = 0;
	this.recalculatePadding = true;
	this.dummy = false;
	foundry.utils.mergeObject(this, params);
	if (!this.dummy) {
		this.rawPadding = this.rawPadding ?? this.padding ?? 0;
		this.originalPadding = Math.max(this.rawPadding, getMinPadding());
		this.assignPlaceable();
		this.activateTransform();
		Object.defineProperty(this, 'padding', {
			get: function () {
				if (this.recalculatePadding) this.calculatePadding();
				return this.currentPadding;
			},
			set: function (padding) {
				this.rawPadding = padding;
				this.originalPadding = Math.max(padding, getMinPadding());
			},
		});
	} else {
		this.apply = function (filterManager, input, output, clear) {
			filterManager.applyFilter(this, input, output, clear);
		};
	}
};

PIXI.Filter.prototype.getPlaceable = function () {
	return getPlaceableById(this.placeableId, this.placeableType);
};

PIXI.Filter.prototype.getPlaceableType = function () {
	return this.placeableType;
};

PIXI.Filter.prototype.calculatePadding = function () {
	const target = this.placeableImg;
	let width;
	let height;

	{
		const ang = !this.sticky && this.placeableType !== PlaceableType.TOKEN ? target.rotation : 0;
		const sin = Math.sin(ang);
		const cos = Math.cos(ang);
		width = Math.abs(target.width * cos) + Math.abs(target.height * sin);
		height = Math.abs(target.width * sin) + Math.abs(target.height * cos);
	}

	if (this.gridPadding > 0) {
		const gridSize = canvas.dimensions.size;
		this.boundsPadding.x = this.boundsPadding.y = (this.gridPadding - 1) * gridSize;
		this.boundsPadding.x += (gridSize - 1 - ((width + gridSize - 1) % gridSize)) / 2;
		this.boundsPadding.y += (gridSize - 1 - ((height + gridSize - 1) % gridSize)) / 2;
	} else {
		this.boundsPadding.x = this.boundsPadding.y = this.rawPadding;
	}

	{
		const ang = this.sticky ? target.rotation : 0;
		const sin = Math.sin(ang);
		const cos = Math.cos(ang);
		this.currentPadding =
			Math.max(
				Math.abs(this.boundsPadding.x * cos) + Math.abs(this.boundsPadding.y * sin),
				Math.abs(this.boundsPadding.x * sin) + Math.abs(this.boundsPadding.y * cos)
			) +
			(this.originalPadding - this.rawPadding);
	}

	this.boundsPadding.x += (width - target.width) / 2;
	this.boundsPadding.y += (height - target.height) / 2;

	const scale = this.targetPlaceable.worldTransform.a;

	this.boundsPadding.x *= scale;
	this.boundsPadding.y *= scale;
	this.currentPadding *= scale;
};

PIXI.Filter.prototype.assignPlaceable = function () {
	this.targetPlaceable = this.getPlaceable();
	this.targetPlaceable != null
		? (this.placeableImg = this.targetPlaceable._TMFXgetSprite())
		: (this.placeableImg = null);
};

PIXI.Filter.prototype.activateTransform = function () {
	this.preComputation = this.filterTransform;
	this.filterTransform();

	const apply = this.apply;
	this.apply = function (filterManager, input, output, clear, state) {
		if ('handleTransform' in this) {
			this.handleTransform(state);
		}
		return apply.apply(this, arguments);
	};
};

PIXI.Filter.prototype.filterTransform = function () {
	if (this.hasOwnProperty('zIndex')) {
		this.targetPlaceable.zIndex = this.zIndex;
	}
};

PIXI.Filter.prototype.normalizeTMParams = function () {
	if (this.hasOwnProperty('animated') && !(this.animated == null)) {
		// Normalize animations properties
		Object.keys(this.animated).forEach((effect) => {
			if (this.animated[effect].active == null || typeof this.animated[effect].active != 'boolean') {
				this.animated[effect].active = true;
			}
			if (
				this.animated[effect].loops == null ||
				typeof this.animated[effect].loops != 'number' ||
				this.animated[effect].loops <= 0
			) {
				this.animated[effect].loops = Infinity;
			}
			if (
				this.animated[effect].loopDuration == null ||
				typeof this.animated[effect].loopDuration != 'number' ||
				this.animated[effect].loopDuration <= 0
			) {
				this.animated[effect].loopDuration = 3000;
			}
			if (this.animated[effect].clockWise == null || typeof this.animated[effect].clockWise != 'boolean') {
				this.animated[effect].clockWise = true;
			}
			if (
				this.animated[effect].pauseBetweenDuration == null ||
				typeof this.animated[effect].pauseBetweenDuration != 'number' ||
				this.animated[effect].pauseBetweenDuration <= 0
			) {
				this.animated[effect].pauseBetweenDuration = 0;
			}
			if (
				this.animated[effect].syncShift == null ||
				typeof this.animated[effect].syncShift != 'number' ||
				this.animated[effect].syncShift < 0
			) {
				this.animated[effect].syncShift = 0;
			}
			if (this.animated[effect].val1 == null || typeof this.animated[effect].val1 != 'number') {
				this.animated[effect].val1 = 0;
			}
			if (this.animated[effect].val2 == null || typeof this.animated[effect].val2 != 'number') {
				this.animated[effect].val2 = 0;
			}
			if (this.anime[this.animated[effect].animType] === undefined) {
				this.animated[effect].animType = null;
			}
			if (this.animated[effect].speed == null || typeof this.animated[effect].speed != 'number') {
				this.animated[effect].speed = 0;
			}
			if (this.animated[effect].chaosFactor == null || typeof this.animated[effect].chaosFactor != 'number') {
				this.animated[effect].chaosFactor = 0.25;
			}
			if (this.animated[effect].wantInteger == null || typeof this.animated[effect].wantInteger != 'boolean') {
				this.animated[effect].wantInteger = false;
			}

			if (!this.anime.hasInternals(effect)) {
				this.anime.initInternals(effect);
			}

			this.anime.animated = this.animated;
		});
	}
};
