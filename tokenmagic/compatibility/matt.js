import { PresetsLibrary } from '../fx/presets/defaultpresets.js';
import { broadcast } from '../module/util.js';

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
				type: 'line',
				get help() {
					return game.i18n.localize('TMFX.matt.transient.hint');
				},
			},
			{
				id: 'transient',
				name: 'TMFX.matt.transient.label',
				type: 'checkbox',
				defvalue: false,
			},
			{
				id: 'showto',
				name: 'MonksActiveTiles.ctrl.for',
				list: 'showto',
				type: 'list',
				subtype: 'for',
				defvalue: 'trigger',
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
			showto: {
				everyone: 'MonksActiveTiles.for.all',
				players: 'MonksActiveTiles.for.players',
				gm: 'MonksActiveTiles.for.gm',
				trigger: 'MonksActiveTiles.for.triggering',
				token: 'MonksActiveTiles.for.token',
				owner: 'MonksActiveTiles.for.owner',
				previous: 'MonksActiveTiles.for.current',
			},
		},
		group: 'tokenmagic',
		fn: async (args = {}) => {
			const { tile, tokens, action, userId, value, method, change } = args;

			const presetName = await MonksActiveTiles.getValue(action.data.preset, args);
			const entities = await MonksActiveTiles.getEntities(args, action.data?.collection || 'tokens');
			const { state, transient } = action.data;

			if (entities.length) {
				if (transient) {
					const showUsers = MonksActiveTiles.getForPlayers(action.data.showto || 'trigger', args);

					if (showUsers.includes(game.user.id)) {
						for (const placeable of entities) {
							await TokenMagic.togglePreset(placeable, presetName, { action: state, transient });
						}
					} else if (showUsers.length) {
						const placeables = entities.reduce((acc, p) => {
							const sceneId = p.parent.id;
							acc[sceneId] ??= [];
							acc[sceneId].push({ placeableType: p.documentName, id: p.id });
							return acc;
						}, {});

						broadcast('togglePreset', {
							placeables,
							toggleAction: state,
							transient,
							presetName,
							userIds: showUsers,
						});
					}
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

			let forUser = '';
			if (action.data?.transient) {
				const showto = action.data.showto.name ?? trigger.values.showto[action.data.showto];
				forUser = `, ${game.i18n.localize('MonksActiveTiles.ctrl.for')} <span class="action-style">${game.i18n.localize(showto)}</span>`;
			}

			return `<span class="action-style">TMFX</span> <span class="details-style">"${game.i18n.localize(trigger.values.state[action.data?.state])}"</span> <span class="value-style">&lt;${action.data.preset}&gt;</span> ${preposition} <span class="entity-style">${entityName}</span>${forUser}`;
		},
	});
}
