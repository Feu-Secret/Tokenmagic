/* -------------------------------------------- */
/*  Tokens Management                           */
/* -------------------------------------------- */

import { Anime } from '../../fx/Anime.js';
import { PlaceableType } from '../constants.js';
import { Magic } from '../tokenmagic.js';
import { getPlaceableById, requestLoadFilters } from '../util.js';

Hooks.on('createToken', (document) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (document.flags?.tokenmagic?.filters) {
		let placeable = getPlaceableById(document._id, PlaceableType.TOKEN);
		requestLoadFilters(placeable, 250);
	}
});

/* -------------------------------------------- */

Hooks.on('deleteToken', (_, document) => {
	if (!(document == null || !document._id)) {
		Anime.removeAnimation(document._id);
	}
});

/* -------------------------------------------- */

Hooks.on('updateToken', (document, options) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (['img', 'tint', 'height', 'width', 'name'].some((k) => k in options)) {
		let placeable = getPlaceableById(document._id, PlaceableType.TOKEN);
		Anime.removeAnimation(document._id); // removing animations on this placeable
		Magic._clearImgFiltersByPlaceable(placeable); // clearing the filters (owned by tokenmagic)
		requestLoadFilters(placeable, 250);
	} else {
		Magic._updateFilters(document, options, PlaceableType.TOKEN);
	}
});
