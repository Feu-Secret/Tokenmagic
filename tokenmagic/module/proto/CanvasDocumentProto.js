import { PlaceableType } from '../constants.js';
import { broadcast, mustBroadCast } from '../tokenmagic.js';
import { callAsyncHook } from '../utilities.js';
import { gMaxRank } from './PlaceableObjectProto.js';

Object.values(PlaceableType).forEach((type) => {
	const cls = getDocumentClass(type);
	if (!cls) return;

	cls.prototype._TMFXsetFlag = async function (flag) {
		await callAsyncHook('tokenmagic._TMFXsetFlag', flag);
		if (mustBroadCast()) broadcast(this, flag, SocketAction.SET_FLAG);
		else await this.setFlag('tokenmagic', 'filters', flag);
	};

	cls.prototype._TMFXunsetFlag = async function () {
		if (mustBroadCast()) broadcast(this, null, SocketAction.SET_FLAG);
		else await this.unsetFlag('tokenmagic', 'filters');
	};

	cls.prototype._TMFXsetAnimeFlag = async function (flag) {
		if (mustBroadCast()) broadcast(this, flag, SocketAction.SET_ANIME_FLAG);
		else await this.setFlag('tokenmagic', 'animeInfo', flag);
	};

	cls.prototype._TMFXunsetAnimeFlag = async function () {
		if (mustBroadCast()) broadcast(this, null, SocketAction.SET_ANIME_FLAG);
		else await this.unsetFlag('tokenmagic', 'animeInfo');
	};

	cls.prototype._TMFXgetMaxFilterRank = function () {
		const placeable = this.object;
		if (!placeable) return gMaxRank++;
		else return placeable._TMFXgetMaxFilterRank();
	};

	cls.prototype._TMFXgetPlaceableType = function () {
		if (
			[
				PlaceableType.TOKEN,
				PlaceableType.TEMPLATE,
				PlaceableType.TILE,
				PlaceableType.DRAWING,
				PlaceableType.REGION,
			].includes(this.documentName)
		)
			return this.documentName;
		return PlaceableType.NOT_SUPPORTED;
	};
});
