import { PresetsLibrary } from '../fx/presets/defaultpresets.js';
import { SocketAction } from '../module/tokenmagic.js';

export async function registerActions(MonksActiveTiles) {
	MonksActiveTiles.registerTileGroup('tokenmagic', 'TokenMagicFX');

	MonksActiveTiles.registerTileAction('tokenmagic', 'tmfx-toggle-preset', {
		name: game.i18n.localize('TMFX.matt.togglePreset'),
		requiresGM: false,
		ctrls: [
			{
				id: 'entity',
				name: 'MonksActiveTiles.ctrl.select-entity',
				type: 'select',
				subtype: 'entity',
				check: true,
				options: { show: ['tile', 'token', 'within', 'players', 'previous', 'tagger'] },
				restrict: (entity) => {
					return (
						entity instanceof foundry.canvas.placeables.Token ||
						entity instanceof foundry.canvas.placeables.Tile ||
						entity instanceof foundry.canvas.placeables.Drawing ||
						entity instanceof foundry.canvas.placeables.Region
					);
				},
			},
			{
				id: 'collection',
				name: 'Collection',
				list: 'collection',
				type: 'list',
				onChange: (app, ctrl, action, data) => {
					let displayName = game.i18n.format('MonksActiveTiles.CurrentCollection', {
						collection: $(ctrl).val() || 'tokens',
					});
					$('input[name="data.entity"]', app.element).next().html(displayName);
				},
				conditional: (app) => {
					let entity = $('input[name="data.entity"]', app.element).data('value') || {};
					return entity?.id == 'previous';
				},
				defvalue: 'tokens',
			},
			{
				id: 'preset',
				name: 'TMFX.matt.preset',
				type: 'list',
				list: 'presets',
				required: true,
			},
			{
				id: 'state',
				name: 'MonksActiveTiles.Action',
				list: 'state',
				type: 'list',
				defvalue: 'add',
			},
			{
				id: 'transient',
				name: 'TMFX.matt.transient.label',
				type: 'checkbox',
				defvalue: false,
				get help() {
					return game.i18n.localize('TMFX.matt.transient.hint');
				},
			},
		],
		values: {
			state: {
				add: 'MonksActiveTiles.state.add',
				remove: 'MonksActiveTiles.state.remove',
				toggle: 'MonksActiveTiles.state.toggle',
			},
			collection: {
				drawings: 'Drawings',
				regions: 'Regions',
				tiles: 'Tiles',
				tokens: 'Tokens',
			},
			get presets() {
				return [...TokenMagic.getPresets(PresetsLibrary.MAIN), ...TokenMagic.getPresets(PresetsLibrary.REGION)].reduce(
					(obj, p) => {
						obj[p.name] = p.name;
						return obj;
					},
					{},
				);
			},
		},
		group: 'tokenmagic',
		fn: async (args = {}) => {
			const { tile, tokens, action, userId, value, method, change } = args;

			const presetName = await MonksActiveTiles.getValue(action.data.preset, args);
			const entities = await MonksActiveTiles.getEntities(args, action.data?.collection || 'tokens');
			const { state, transient } = action.data;

			if (entities.length) {
				if (transient && game.user.id !== userId) {
					const tmPlaceables = entities.reduce((acc, p) => {
						const sceneId = p.parent.id;
						acc[sceneId] ??= [];
						acc[sceneId].push({ placeableType: p.documentName, id: p.id });
						return acc;
					}, {});
					const data = {
						tmAction: SocketAction.TOGGLE_PRESET,
						tmPlaceables,
						action: state,
						transient,
						presetName,
						userId,
					};
					game.socket.emit('module.tokenmagic', data);
					return;
				}

				for (const placeable of entities) {
					await TokenMagic.togglePreset(placeable, presetName, { action: state, transient });
				}
			}

			let result = {};
			MonksActiveTiles.addToResult(entities, result);

			return result;
		},
		content: async (trigger, action) => {
			let ctrl = trigger.ctrls.find((c) => c.id == 'entity');
			let entityName = await MonksActiveTiles.entityName(
				action.data?.entity || ctrl?.defvalue || 'previous',
				(action.data?.entity == 'previous' ? action.data?.collection : null) || 'tiles',
			);

			const state = action.data?.state;
			const preposition = state === 'toggle' ? 'on' : state === 'remove' ? 'from' : 'to';

			return `<span class="action-style">TokenMagicFX</span> <span class="details-style">"${game.i18n.localize(trigger.values.state[action.data?.state])}"</span> <span class="value-style">&lt;${action.data.preset}&gt;</span> ${preposition} <span class="entity-style">${entityName}</span>`;
		},
	});
}
