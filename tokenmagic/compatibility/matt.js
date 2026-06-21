export async function registerActions(MonksActiveTiles) {
	MonksActiveTiles.registerTileGroup('tokenmagic', 'TokenMagicFX');

	MonksActiveTiles.registerTileAction('tokenmagic', 'tmfx-apply-preset', {
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
				name: 'Preset Name',
				type: 'text',
				required: true,
			},
			{
				id: 'state',
				name: 'Action',
				list: 'state',
				type: 'list',
				defvalue: 'add',
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
		},
		group: 'tokenmagic',
		fn: async (args = {}) => {
			const { tile, tokens, action, userId, value, method, change } = args;

			let entities = await MonksActiveTiles.getEntities(args, action.data?.collection || 'tokens');
			if (entities.length) {
				const presetName = await MonksActiveTiles.getValue(action.data.preset, args);

				const preset = TokenMagic.getPreset(presetName);
				if (!preset?.length) return;
				const { filterId } = preset[0];
				const isActive = entities.some((c) => TokenMagic.hasFilterId(c, filterId));

				const state = action.data.action;
				if (state === 'remove' || (state === 'toggle' && isActive)) {
					const filterIds = new Set(TokenMagic.getPreset(presetName).map((p) => p.filterId));
					for (const placeable of entities) {
						for (const filterId of filterIds) {
							if (TokenMagic.hasFilterId(placeable, filterId)) {
								await TokenMagic.deleteFilters(placeable, filterId);
								if (placeable.documentName === 'Region' && !placeable.flags['tokenmagic']?.filters) {
									await placeable.update({ ['flags.tokenmagic.regionData']: _del });
								}
							}
						}
					}
				} else if (state === 'add' || (state === 'toggle' && !isActive)) {
					for (const placeable of entities) {
						if (!TokenMagic.hasFilterId(placeable, filterId)) {
							await TokenMagic.addUpdateFilters(placeable, preset);
						}
					}
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
			return `<span class="action-style">TokenMagicFX</span> <span class="details-style">"${game.i18n.localize(trigger.values.state[action.data?.state])}"</span> <span class="value-style">&lt;${action.data.preset}&gt;</span> to <span class="entity-style">${entityName}</span>`;
		},
	});
}
