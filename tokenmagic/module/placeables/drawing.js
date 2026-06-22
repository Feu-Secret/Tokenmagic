/* -------------------------------------------- */
/*  Drawings Management                         */
/* -------------------------------------------- */

import { Anime } from '../../fx/Anime.js';
import { PlaceableType } from '../constants.js';
import { Magic } from '../tokenmagic.js';
import { getPlaceableById, requestLoadFilters } from '../util.js';

Hooks.on('createDrawing', (document) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (document.flags?.tokenmagic?.filters) {
		let placeable = getPlaceableById(document._id, PlaceableType.DRAWING);
		requestLoadFilters(placeable, 250);
	}
});

/* -------------------------------------------- */

Hooks.on('deleteDrawing', (_, document) => {
	if (!(document == null || !document._id)) {
		Anime.removeAnimation(document._id);
	}
});

/* -------------------------------------------- */

Hooks.on('updateDrawing', (document, options) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (!options.flags?.tokenmagic || options.x || options.y) {
		let placeable = getPlaceableById(document._id, PlaceableType.DRAWING);
		Anime.removeAnimation(document._id); // removing animations on this placeable
		Magic._clearImgFiltersByPlaceable(placeable); // clearing the filters (owned by tokenmagic)
		requestLoadFilters(placeable, 250);
	} else {
		Magic._updateFilters(document, options, PlaceableType.DRAWING);
	}
});
