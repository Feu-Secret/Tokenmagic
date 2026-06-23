import { PlaceableType } from '../constants.js';
import { broadcast, mustBroadCast } from '../tokenmagic.js';
import { callAsyncHook } from '../util.js';
import { gMaxRank } from './PlaceableObjectProto.js';

Object.values(PlaceableType).forEach((type) => {
	const cls = getDocumentClass(type);
	if (!cls) return;

	cls.prototype._TMFXsetFlag = async function (flag) {
		await callAsyncHook('tokenmagic._TMFXsetFlag', flag);
		if (mustBroadCast()) {
			broadcast('updatePlaceable', {
				placeableId: this.id,
				placeableType: this._TMFXgetPlaceableType(),
				update: { 'flags.tokenmagic.filters': flag },
				sceneId: this.parent.id,
			});
		} else await this.setFlag('tokenmagic', 'filters', flag);
	};

	cls.prototype._TMFXunsetFlag = async function () {
		if (mustBroadCast()) {
			broadcast('updatePlaceable', {
				placeableId: this.id,
				placeableType: this._TMFXgetPlaceableType(),
				update: { 'flags.tokenmagic.filters': null },
				sceneId: this.parent.id,
			});
		} else await this.unsetFlag('tokenmagic', 'filters');
	};

	cls.prototype._TMFXsetAnimeFlag = async function (flag) {
		if (mustBroadCast()) {
			broadcast('updatePlaceable', {
				placeableId: this.id,
				placeableType: this._TMFXgetPlaceableType(),
				update: { 'flags.tokenmagic.animeInfo': flag },
				sceneId: this.parent.id,
			});
		} else await this.setFlag('tokenmagic', 'animeInfo', flag);
	};

	cls.prototype._TMFXunsetAnimeFlag = async function () {
		if (mustBroadCast()) {
			broadcast('updatePlaceable', {
				placeableId: this.id,
				placeableType: this._TMFXgetPlaceableType(),
				update: { 'flags.tokenmagic.animeInfo': null },
				sceneId: this.parent.id,
			});
		} else await this.unsetFlag('tokenmagic', 'animeInfo');
	};

	cls.prototype._TMFXgetMaxFilterRank = function () {
		const placeable = this.object;
		if (!placeable) return gMaxRank++;
		else return placeable._TMFXgetMaxFilterRank();
	};

	cls.prototype._TMFXgetPlaceableType = function () {
		if (Object.values(PlaceableType).includes(this.documentName)) {
			return this.documentName;
		}
		return PlaceableType.NOT_SUPPORTED;
	};
});
