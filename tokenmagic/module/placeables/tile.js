/* -------------------------------------------- */
/*  Tiles Management                            */
/* -------------------------------------------- */

import { Anime } from '../../fx/Anime.js';
import { PlaceableType } from '../constants.js';
import { Magic } from '../tokenmagic.js';
import { getPlaceableById, requestLoadFilters } from '../util.js';

Hooks.on('createTile', (document) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (document.flags?.tokenmagic?.filters) {
		const placeable = getPlaceableById(document._id, PlaceableType.TILE);
		requestLoadFilters(placeable, 250);
	}
});

/* -------------------------------------------- */

Hooks.on('deleteTile', (_, document) => {
	if (!(document == null || !document._id)) {
		Anime.removeAnimation(document._id);
	}
});

/* -------------------------------------------- */

Hooks.on('updateTile', (document, options) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (options.texture?.src || options.overhead) {
		const placeable = getPlaceableById(document._id, PlaceableType.TILE);
		Anime.removeAnimation(document._id); // removing animations on this placeable
		Magic._clearImgFiltersByPlaceable(placeable); // clearing the filters (owned by tokenmagic)
		requestLoadFilters(placeable, 250);
	} else {
		Magic._updateFilters(document, options, PlaceableType.TILE);
	}
});
