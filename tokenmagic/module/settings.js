import { presets as defaultPresets, PresetsLibrary } from '../fx/presets/defaultpresets.js';
import { DataVersion } from '../migration/migration.js';
import { TokenMagic, isVideoDisabled, fixPath } from './tokenmagic.js';
import { dnd5eTemplates } from './autoTemplate/dnd5e.js';
import { pf2eTemplates } from './autoTemplate/pf2e.js';
import { witcherTemplates } from './autoTemplate/TheWitcherTRPG.js';
import { defaultOpacity, emptyPreset } from './constants.js';

const Magic = TokenMagic();

export class TokenMagicSettings extends FormApplication {
	constructor(object = {}, options) {
		super(object, options);
	}

	/** @override */
	static get defaultOptions() {
		return {
			...super.defaultOptions,
			template: 'modules/tokenmagic/templates/settings/settings.html',
			height: 'auto',
			title: game.i18n.localize('TMFX.settings.autoTemplateSettings.dialog.title'),
			width: 600,
			classes: ['tokenmagic', 'settings'],
			tabs: [
				{
					navSelector: '.tabs',
					contentSelector: 'form',
					initial: 'name',
				},
			],
			submitOnClose: false,
		};
	}

	static init() {
		const menuAutoTemplateSettings = {
			key: 'autoTemplateSettings',
			config: {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.name'),
				label: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.label'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.hint'),
				type: TokenMagicSettings,
				restricted: true,
			},
		};

		const settingAutoTemplateSettings = {
			key: 'autoTemplateSettings',
			config: {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.name'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.hint'),
				scope: 'world',
				config: false,
				default: {},
				type: Object,
			},
		};

		const templates = this.getSystemTemplates();
		let hasAutoTemplates = !!templates;
		if (templates) {
			game.settings.registerMenu('tokenmagic', menuAutoTemplateSettings.key, menuAutoTemplateSettings.config);
			game.settings.register(
				'tokenmagic',
				settingAutoTemplateSettings.key,
				mergeObject(
					settingAutoTemplateSettings.config,
					{
						default: templates.constructor.defaultConfiguration,
					},
					true,
					true
				)
			);
		}

		game.settings.register('tokenmagic', 'autoTemplateEnabled', {
			name: game.i18n.localize('TMFX.settings.autoTemplateEnabled.name'),
			hint: game.i18n.localize('TMFX.settings.autoTemplateEnabled.hint'),
			scope: 'world',
			config: hasAutoTemplates,
			default: hasAutoTemplates,
			type: Boolean,
			onChange: (value) => TokenMagicSettings.configureAutoTemplate(value),
		});

		game.settings.register('tokenmagic', 'defaultTemplateOnHover', {
			name: game.i18n.localize('TMFX.settings.defaultTemplateOnHover.name'),
			hint: game.i18n.localize('TMFX.settings.defaultTemplateOnHover.hint'),
			scope: 'world',
			config: true,
			default: hasAutoTemplates,
			type: Boolean,
			onChange: () => window.location.reload(),
		});

		game.settings.register('tokenmagic', 'autohideTemplateElements', {
			name: game.i18n.localize('TMFX.settings.autohideTemplateElements.name'),
			hint: game.i18n.localize('TMFX.settings.autohideTemplateElements.hint'),
			scope: 'world',
			config: true,
			default: true,
			type: Boolean,
			onChange: () => window.location.reload(),
		});

		game.settings.register('tokenmagic', 'useAdditivePadding', {
			name: game.i18n.localize('TMFX.settings.useMaxPadding.name'),
			hint: game.i18n.localize('TMFX.settings.useMaxPadding.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'minPadding', {
			name: game.i18n.localize('TMFX.settings.minPadding.name'),
			hint: game.i18n.localize('TMFX.settings.minPadding.hint'),
			scope: 'world',
			config: true,
			default: 50,
			type: Number,
		});

		game.settings.register('tokenmagic', 'fxPlayerPermission', {
			name: game.i18n.localize('TMFX.settings.fxPlayerPermission.name'),
			hint: game.i18n.localize('TMFX.settings.fxPlayerPermission.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'importOverwrite', {
			name: game.i18n.localize('TMFX.settings.importOverwrite.name'),
			hint: game.i18n.localize('TMFX.settings.importOverwrite.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'useZOrder', {
			name: game.i18n.localize('TMFX.settings.useZOrder.name'),
			hint: game.i18n.localize('TMFX.settings.useZOrder.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'disableAnimations', {
			name: game.i18n.localize('TMFX.settings.disableAnimations.name'),
			hint: game.i18n.localize('TMFX.settings.disableAnimations.hint'),
			scope: 'client',
			config: true,
			default: false,
			type: Boolean,
			onChange: () => window.location.reload(),
		});

		game.settings.register('tokenmagic', 'disableCaching', {
			name: game.i18n.localize('TMFX.settings.disableCaching.name'),
			hint: game.i18n.localize('TMFX.settings.disableCaching.hint'),
			scope: 'client',
			config: true,
			default: true,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'disableVideo', {
			name: game.i18n.localize('TMFX.settings.disableVideo.name'),
			hint: game.i18n.localize('TMFX.settings.disableVideo.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
			onChange: () => window.location.reload(),
		});

		game.settings.register('tokenmagic', 'presets', {
			name: 'Token Magic FX presets',
			hint: 'Token Magic FX presets',
			scope: 'world',
			config: false,
			default: defaultPresets,
			type: Object,
		});

		game.settings.register('tokenmagic', 'migration', {
			name: 'TMFX Data Version',
			hint: 'TMFX Data Version',
			scope: 'world',
			config: false,
			default: DataVersion.ARCHAIC,
			type: String,
		});

		loadTemplates([
			'modules/tokenmagic/templates/settings/settings.html',
			'modules/tokenmagic/templates/settings/dnd5e/categories.html',
			'modules/tokenmagic/templates/settings/dnd5e/overrides.html',
			'modules/tokenmagic/templates/settings/pf2e/categories.html',
			'modules/tokenmagic/templates/settings/pf2e/overrides.html',
			'modules/tokenmagic/templates/settings/TheWitcherTRPG/categories.html',
			'modules/tokenmagic/templates/settings/TheWitcherTRPG/overrides.html',
		]);
	}

	static configureAutoTemplate(enabled = false) {
		this.getSystemTemplates()?.configure(enabled);
	}

	static getSystemTemplates() {
		switch (game.system.id) {
			case 'dnd5e':
				return dnd5eTemplates;
			case 'pf2e':
				return pf2eTemplates;
			case 'TheWitcherTRPG':
				return witcherTemplates;
			default:
				return null;
		}
	}

	getSettingsData() {
		let settingsData = {
			autoTemplateEnable: game.settings.get('tokenmagic', 'autoTemplateEnabled'),
		};
		if (TokenMagicSettings.getSystemTemplates()) {
			settingsData['autoTemplateSettings'] = game.settings.get('tokenmagic', 'autoTemplateSettings');
		}
		return settingsData;
	}

	/** @override */
	getData() {
		let data = super.getData();
		data.hasAutoTemplates = false;
		data.emptyPreset = emptyPreset;
		const templates = TokenMagicSettings.getSystemTemplates();
		if (templates) {
			mergeObject(data, templates.getData());
		}

		data.presets = Magic.getPresets(PresetsLibrary.TEMPLATE).sort(function (a, b) {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
		data.system = { id: game.system.id, title: game.system.title };
		data.settings = this.getSettingsData();
		data.submitText = game.i18n.localize('TMFX.save');
		return data;
	}

	/** @override */
	async _updateObject(_, formData) {
		const data = expandObject(formData);
		for (let [key, value] of Object.entries(data)) {
			if (key === 'autoTemplateSettings' && value.overrides) {
				const compacted = {};
				Object.values(value.overrides).forEach((val, idx) => (compacted[idx] = val));
				value.overrides = compacted;
			}
			await game.settings.set('tokenmagic', key, value);
		}
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find('button.add-override').click(this._onAddOverride.bind(this));
		html.find('button.remove-override').click(this._onRemoveOverride.bind(this));
	}

	async _onAddOverride(event) {
		event.preventDefault();
		let idx = 0;
		const entries = event.target.closest('div.tab').querySelectorAll('div.override-entry');
		const last = entries[entries.length - 1];
		if (last) {
			idx = last.dataset.idx + 1;
		}
		let updateData = {};
		updateData[`autoTemplateSettings.overrides.${idx}.target`] = '';
		updateData[`autoTemplateSettings.overrides.${idx}.opacity`] = defaultOpacity;
		updateData[`autoTemplateSettings.overrides.${idx}.tint`] = null;
		updateData[`autoTemplateSettings.overrides.${idx}.preset`] = emptyPreset;
		updateData[`autoTemplateSettings.overrides.${idx}.texture`] = null;
		await this._onSubmit(event, { updateData: updateData, preventClose: true });
		this.render();
	}

	async _onRemoveOverride(event) {
		event.preventDefault();
		let idx = event.target.dataset.idx;
		const el = event.target.closest(`div[data-idx="${idx}"]`);
		if (!el) {
			return true;
		}
		el.remove();
		await this._onSubmit(event, { preventClose: true });
		this.render();
	}
}

Hooks.once('init', () => {
	// Extracted from https://github.com/leapfrogtechnology/just-handlebars-helpers/
	Handlebars.registerHelper('concat', function (...params) {
		// Ignore the object appended by handlebars.
		if (typeof params[params.length - 1] === 'object') {
			params.pop();
		}

		return params.join('');
	});
	TokenMagicSettings.init();
	TokenMagicSettings.configureAutoTemplate(game.settings.get('tokenmagic', 'autoTemplateEnabled'));

	const wmtdUpdate = async function (wrapped, ...args) {
		const [document] = args;
		let preset, hasPresetData;

		const tex = document.texture ?? '';
		const hasTexture = !!document.texture;
		const opt = document.flags?.tokenmagic?.options ?? null;
		if (!opt) {
			preset = document['flags.tokenmagic.templateData.preset'];
		}
		hasPresetData = !!preset;

		//const hasOpt = data["flags.tokenmagic"]?.options ?? null;

		if (hasTexture) {
			document.texture = fixPath(document.texture);
		}

		if (opt == null) {
			if (hasPresetData && preset !== emptyPreset) {
				let defaultTexture = Magic._getPresetTemplateDefaultTexture(preset);
				if (!(defaultTexture == null)) {
					if (tex === '' || tex.startsWith('modules/tokenmagic/fx/assets/templates/'))
						document.texture = defaultTexture;
				}
			} else if (
				hasTexture &&
				tex.startsWith('modules/tokenmagic/fx/assets/templates/') &&
				hasPresetData &&
				preset === emptyPreset
			) {
				document.texture = '';
			}
		}

		return await wrapped(...args);
	};

	const wmtDraw = async function (wrapped, ...args) {
		if (this.document.texture) {
			this.document.texture = fixPath(this.document.texture);
		}
		const retVal = await wrapped(...args);
		this.template.alpha = this.document.getFlag('tokenmagic', 'templateData')?.opacity ?? 1;
		return retVal;
	};

	let wmtApplyRenderFlags;
	let wmtApplyRenderFlagsType;

	let wmtRefreshTemplate;
	let wmtRefreshTemplateType;

	if (!isVideoDisabled()) {
		const toRadians = Math.toRadians;

		wmtApplyRenderFlagsType = 'WRAPPER';

		wmtApplyRenderFlags = function (wrapped, ...args) {
			const [flags] = args;
			if (flags?.refreshShape) flags.refreshShape = this.template && !this.template._destroyed;
			return wrapped(...args);
		};

		/* ------------------------------------------------------------------------------------ */

		wmtRefreshTemplateType = 'OVERRIDE';

		/**
		 *
		 * @return {wmtRefreshTemplate}
		 */
		wmtRefreshTemplate = function () {
			const t = this.template.clear();
			if (!this.isVisible) return;

			// Draw the Template outline
			t.lineStyle(this._borderThickness, this.borderColor, 0.75).beginFill(0x000000, 0.0);

			// Fill Color or Texture
			if (this.texture) {
				let mat = PIXI.Matrix.IDENTITY;
				// rectangle
				if (this.shape.width && this.shape.height)
					mat.scale(this.shape.width / this.texture.width, this.shape.height / this.texture.height);
				else if (this.shape.radius) {
					mat.scale((this.shape.radius * 2) / this.texture.height, (this.shape.radius * 2) / this.texture.width);
					// Circle center is texture start...
					mat.translate(-this.shape.radius, -this.shape.radius);
				} else if (this.document.t === 'ray') {
					const d = canvas.dimensions,
						height = (this.document.width * d.size) / d.distance,
						width = (this.document.distance * d.size) / d.distance;
					mat.scale(width / this.texture.width, height / this.texture.height);
					mat.translate(0, -height * 0.5);

					mat.rotate(toRadians(this.document.direction));
				} else {
					// cone
					const d = canvas.dimensions;

					// Extract and prepare data
					let { direction, distance, angle } = this.document;
					distance *= d.size / d.distance;
					direction = Math.toRadians(direction);
					const width = (this.document.distance * d.size) / d.distance;

					const angles = [angle / -2, angle / 2];
					distance = distance / Math.cos(Math.toRadians(angle / 2));

					// Get the cone shape as a polygon
					const rays = angles.map((a) => Ray.fromAngle(0, 0, direction + Math.toRadians(a), distance + 1));
					const height = Math.sqrt(
						(rays[0].B.x - rays[1].B.x) * (rays[0].B.x - rays[1].B.x) +
							(rays[0].B.y - rays[1].B.y) * (rays[0].B.y - rays[1].B.y)
					);
					mat.scale(width / this.texture.width, height / this.texture.height);
					mat.translate(0, -height / 2);
					mat.rotate(toRadians(this.document.direction));
				}

				t.beginTextureFill({
					texture: this.texture,
					matrix: mat,
					alpha: 1.0,
				});
				const source = getProperty(this.texture, 'baseTexture.resource.source');
				if (source && source.tagName === 'VIDEO') {
					source.loop = true;
					source.muted = true;
					game.video.play(source);
				}
			} else t.beginFill(0x000000, 0.0);

			// Draw the shape
			t.drawShape(this.shape);

			// Draw origin and destination points
			t.lineStyle(this._borderThickness, 0x000000)
				.beginFill(0x000000, 0.5)
				.drawCircle(0, 0, 6)
				.drawCircle(this.ray.dx, this.ray.dy, 6);

			// Update visibility
			this.controlIcon.visible = !!this.layer.active;
			this.controlIcon.border.visible = !!this.hover;
			const alpha = this.document.getFlag('tokenmagic', 'templateData')?.opacity ?? 1;
			t.alpha = this.hover ? alpha / 1.25 : alpha;

			return this;
		};

		/* ------------------------------------------------------------------------------------ */
	}

	if (game.settings.get('tokenmagic', 'autohideTemplateElements')) {
		/**
		 *
		 * @param wrapped
		 * @param args
		 * @return {*}
		 */
		const autohideTemplateElements = function (wrapped, ...args) {
			// Save texture and border thickness
			const texture = this.texture;
			const borderThickness = this._borderThickness;

			// Hide template texture while moving
			if (this._original || this.parent === canvas.templates.preview) {
				this.texture = null;
			}

			// Show border outline only on hover if the template is textured
			if (this.texture && this.texture !== '' && !this._hover) {
				this._borderThickness = 0;
			}

			const retVal = wrapped(...args);

			// Restore texture and border thickness
			this.texture = texture;
			this._borderThickness = borderThickness;

			{
				// Show the origin/destination points and ruler text only on hover or while creating but not while moving
				const template = this._original ?? this;
				const show = !this._original && (this._hover || this.parent === canvas.templates.preview);

				if (!show && template.template?.geometry) {
					// Hide origin and destination points, i.e., hide everything except the template shape
					for (const document of template.template.geometry.graphicsData) {
						if (document.shape !== template.shape) {
							document.fillStyle.visible = false;
							document.lineStyle.visible = false;
						}
					}
					template.template.geometry.invalidate();
				}

				if (template.ruler) template.ruler.renderable = show;
				if (template.controlIcon) template.controlIcon.renderable = template.owner;
				if (template.handle) template.handle.renderable = template.owner;
			}
			return retVal;
		};

		/* ------------------------------------------------------------------------------------ */

		if (wmtApplyRenderFlags) {
			const _wmtApplyRenderFlags = wmtApplyRenderFlags;
			wmtApplyRenderFlags = function () {
				return autohideTemplateElements.call(this, _wmtApplyRenderFlags.bind(this), ...arguments);
			};
		} else {
			wmtApplyRenderFlagsType = 'WRAPPER';
			wmtApplyRenderFlags = autohideTemplateElements;
		}
	}

	if (game.settings.get('tokenmagic', 'defaultTemplateOnHover')) {
		Hooks.on('canvasReady', () => {
			canvas.stage.on('mousemove', (event) => {
				const { x: mx, y: my } = event.data.getLocalPosition(canvas.templates);
				for (const template of canvas.templates.placeables) {
					const hl = canvas.grid.getHighlightLayer(`MeasuredTemplate.${template.id}`);
					const opacity = template.document.getFlag('tokenmagic', 'templateData')?.opacity ?? 1;
					if (template.texture && template.texture !== '') {
						const { x: cx, y: cy } = template.center;
						const mouseover = template.shape?.contains(mx - cx, my - cy);
						hl.renderable = mouseover;
						template.template.alpha = (mouseover ? 0.5 : 1.0) * opacity;
					} else {
						hl.renderable = true;
						template.template.alpha = opacity;
					}
				}
			});
		});
	}

	if (game.modules.get('lib-wrapper')?.active) {
		libWrapper.register('tokenmagic', 'MeasuredTemplateDocument.prototype.update', wmtdUpdate, 'WRAPPER');
		libWrapper.register('tokenmagic', 'MeasuredTemplate.prototype._draw', wmtDraw, 'WRAPPER');
		if (wmtApplyRenderFlags)
			libWrapper.register(
				'tokenmagic',
				'MeasuredTemplate.prototype._applyRenderFlags',
				wmtApplyRenderFlags,
				wmtApplyRenderFlagsType
			);
		if (wmtRefreshTemplate)
			libWrapper.register(
				'tokenmagic',
				'MeasuredTemplate.prototype._refreshTemplate',
				wmtRefreshTemplate,
				wmtRefreshTemplateType
			);
	} else {
		const cmtdUpdate = MeasuredTemplateDocument.prototype.update;
		MeasuredTemplateDocument.prototype.update = function () {
			return wmtdUpdate.call(this, cmtdUpdate.bind(this), ...arguments);
		};
		const cmtDraw = MeasuredTemplate.prototype._draw;
		MeasuredTemplate.prototype._draw = function () {
			return wmtDraw.call(this, cmtDraw.bind(this), ...arguments);
		};

		if (wmtApplyRenderFlags) {
			if (wmtApplyRenderFlagsType && wmtApplyRenderFlagsType !== 'OVERRIDE') {
				const cmtApplyRenderFlags = MeasuredTemplate.prototype._applyRenderFlags;
				MeasuredTemplate.prototype._applyRenderFlags = function () {
					return wmtApplyRenderFlags.call(this, cmtApplyRenderFlags.bind(this), ...arguments);
				};
			} else {
				MeasuredTemplate.prototype._applyRenderFlags = wmtApplyRenderFlags;
			}
		}

		if (wmtRefreshTemplate) {
			if (wmtRefreshTemplateType && wmtRefreshTemplateType !== 'OVERRIDE') {
				const cmtRefreshTemplate = MeasuredTemplate.prototype._refreshTemplate;
				MeasuredTemplate.prototype._refreshTemplate = function () {
					return wmtRefreshTemplate.call(this, cmtRefreshTemplate.bind(this), ...arguments);
				};
			} else {
				MeasuredTemplate.prototype._refreshTemplate = wmtRefreshTemplate;
			}
		}
	}
});
