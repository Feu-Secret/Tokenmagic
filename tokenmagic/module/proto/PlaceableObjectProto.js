import { Magic, isZOrderConfig } from '../tokenmagic.js';
import { autoMinRank, PlaceableType } from '../constants.js';
const { logCompatibilityWarning } = foundry.utils;

export var gMaxRank = autoMinRank;

const { PlaceableObject } = foundry.canvas.placeables;

PlaceableObject.prototype.TMFXaddFilters = async function (paramsArray, replace = false) {
	await Magic.addFilters(this, paramsArray, replace);
};

PlaceableObject.prototype.TMFXupdateFilters = async function (paramsArray) {
	await Magic.updateFiltersByPlaceable(this, paramsArray);
};

PlaceableObject.prototype.TMFXaddUpdateFilters = async function (paramsArray) {
	await Magic.addUpdateFilters(this, paramsArray);
};

PlaceableObject.prototype.TMFXdeleteFilters = async function (filterId = null) {
	await Magic.deleteFilters(this, filterId);
};

PlaceableObject.prototype.TMFXhasFilterType = function (filterType) {
	return Magic.hasFilterType(this, filterType);
};

PlaceableObject.prototype.TMFXhasFilterId = function (filterId) {
	return Magic.hasFilterId(this, filterId);
};

PlaceableObject.prototype._TMFXsetFlag = async function (flag) {
	logCompatibilityWarning(
		'You are accessing PlaceableObject._TMFXsetFlag which must now be accessed through CanvasDocument._TMFXsetFlag',
		{ since: '0.7.4', once: true },
	);
	return this.document._TMFXsetFlag(flag);
};

PlaceableObject.prototype._TMFXsetAnimeFlag = async function (flag) {
	logCompatibilityWarning(
		'You are accessing PlaceableObject._TMFXsetAnimeFlag which must now be accessed through CanvasDocument._TMFXsetAnimeFlag',
		{ since: '0.7.4', once: true },
	);
	return this.document._TMFXsetAnimeFlag(flag);
};

PlaceableObject.prototype._TMFXunsetFlag = async function () {
	logCompatibilityWarning(
		'You are accessing PlaceableObject._TMFXunsetFlag which must now be accessed through CanvasDocument._TMFXunsetFlag',
		{ since: '0.7.4', once: true },
	);
	return this.document._TMFXunsetFlag();
};

PlaceableObject.prototype._TMFXunsetAnimeFlag = async function () {
	logCompatibilityWarning(
		'You are accessing PlaceableObject._TMFXunsetFlag which must now be accessed through CanvasDocument._TMFXunsetFlag',
		{ since: '0.7.4', once: true },
	);
	return this.document._TMFXunsetAnimeFlag();
};

PlaceableObject.prototype._TMFXgetSprite = function () {
	const type = this._TMFXgetPlaceableType();
	switch (type) {
		case PlaceableType.TOKEN:
			return this.mesh;
		case PlaceableType.TILE:
			return this.mesh ?? this.bg;
		case PlaceableType.TEMPLATE:
			return this.template;
		case PlaceableType.DRAWING:
			return this.hasText ? this.text : this.shape;
		case PlaceableType.REGION:
			return this.children.find((ch) => ch instanceof foundry.canvas.placeables.regions.RegionMesh);
		default:
			return null;
	}
};

PlaceableObject.prototype._TMFXgetPlaceablePadding = function () {
	// get the placeable padding, by taking into account all filters and options
	let accPadding = 0;
	const filters = this._TMFXgetSprite().filters;
	if (filters instanceof Array) {
		for (const filter of filters) {
			if (!filter.enabled) continue;
			if (canvas.app.renderer.filter.useMaxPadding) {
				accPadding = Math.max(accPadding, filter.padding);
			} else {
				accPadding += filter.padding;
			}
		}
	}
	return accPadding;
};

PlaceableObject.prototype._TMFXcheckSprite = function () {
	const type = this._TMFXgetPlaceableType();
	switch (type) {
		case PlaceableType.TOKEN:
		case PlaceableType.TILE:
			return !(this.mesh == null);
		case PlaceableType.TEMPLATE:
			return !(this.template == null);
		case PlaceableType.DRAWING:
			return !(this.shape == null);
		case PlaceableType.REGION:
			return !(this.children.find((ch) => ch instanceof foundry.canvas.placeables.regions.RegionMesh) == null);
		default:
			return null;
	}
};

PlaceableObject.prototype._TMFXgetMaxFilterRank = function () {
	const sprite = this._TMFXgetSprite();
	if (sprite?.filters == null) {
		return gMaxRank++;
	} else {
		let maxRank = Math.max(...sprite.filters.map((f) => f.rank), autoMinRank);
		gMaxRank = Math.max(maxRank, gMaxRank) + 1;
		return gMaxRank;
	}
};

PlaceableObject.prototype._TMFXsetRawFilters = function (filters) {
	function insertFilter(filters) {
		function filterZOrderCompare(a, b) {
			if (a.zOrder < b.zOrder) return -1;
			if (a.zOrder > b.zOrder) return 1;
			return 0;
		}

		function filterRankCompare(a, b) {
			if (a.rank < b.rank) return -1;
			if (a.rank > b.rank) return 1;
			return 0;
		}

		if (!isZOrder) {
			if (!filters.hasOwnProperty('rank')) {
				let maxRank = Math.max(...sprite.filters.map((f) => f.rank), autoMinRank);
				filters.rank = maxRank + 1;
			}
		}

		sprite.filters.push(filters);
		isZOrder ? sprite.filters.sort(filterZOrderCompare) : sprite.filters.sort(filterRankCompare);
	}

	function addFilter(filters) {
		if (!isZOrder && !filters.hasOwnProperty('rank')) {
			filters.rank = autoMinRank;
		}
		sprite.filters = [filters];
	}

	const isZOrder = isZOrderConfig();
	const sprite = this._TMFXgetSprite();
	if (sprite == null) {
		return false;
	}

	if (filters == null) {
		sprite.filters = null;
	} else {
		sprite.filters == null ? addFilter(filters) : insertFilter(filters);
	}

	return true;
};

PlaceableObject.prototype._TMFXunsetRawFilters = function () {
	return this._TMFXsetRawFilters(null);
};

PlaceableObject.prototype._TMFXgetPlaceableType = function () {
	if (
		[
			PlaceableType.TOKEN,
			PlaceableType.TEMPLATE,
			PlaceableType.TILE,
			PlaceableType.DRAWING,
			PlaceableType.REGION,
		].includes(this.constructor.embeddedName)
	)
		return this.constructor.embeddedName;
	return PlaceableType.NOT_SUPPORTED;
};
