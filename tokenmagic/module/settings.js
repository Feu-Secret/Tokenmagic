import { presets as defaultPresets } from '../fx/presets/defaultpresets.js';
import { DataVersion } from '../migration/migration.js';
import { TokenMagic, isVideoDisabled, fixPath } from './tokenmagic.js';
import { AutoTemplateDND5E } from '../gui/apps/autoTemplate/dnd5e.js';
import { AutoTemplatePF2E } from '../gui/apps/autoTemplate/pf2e.js';
import { AutoTemplateTheWitcherTRPG } from '../gui/apps/autoTemplate/TheWitcherTRPG.js';
import { emptyPreset } from './constants.js';

const Magic = TokenMagic();

export class TokenMagicSettings {
	static init() {
		const autoTemplateClass = this.getSystemTemplateClass();
		const hasAutoTemplates = !!autoTemplateClass;
		if (autoTemplateClass) {
			game.settings.registerMenu('tokenmagic', 'autoTemplateSettings', {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.name'),
				label: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.label'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.hint'),
				type: autoTemplateClass,
				restricted: true,
			});
			game.settings.register('tokenmagic', 'autoTemplateSettings', {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.name'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.hint'),
				scope: 'world',
				config: false,
				default: autoTemplateClass.defaultConfiguration,
				type: Object,
			});
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
			requiresReload: true,
		});

		game.settings.register('tokenmagic', 'autohideTemplateElements', {
			name: game.i18n.localize('TMFX.settings.autohideTemplateElements.name'),
			hint: game.i18n.localize('TMFX.settings.autohideTemplateElements.hint'),
			scope: 'world',
			config: true,
			default: true,
			type: Boolean,
			requiresReload: true,
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
			requiresReload: true,
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
			requiresReload: true,
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
	}

	static configureAutoTemplate(enabled = false) {
		this.getSystemTemplates()?.configure(enabled);
	}

	static getSystemTemplates() {
		if (this._autoTemplate) return this._autoTemplate;

		const cls = this.getSystemTemplateClass();
		this._autoTemplate = cls ? new cls() : null;

		return this._autoTemplate;
	}

	static getSystemTemplateClass() {
		switch (game.system.id) {
			case 'dnd5e':
				return AutoTemplateDND5E;
			case 'pf2e':
				return AutoTemplatePF2E;
			case 'TheWitcherTRPG':
				return AutoTemplateTheWitcherTRPG;
			default:
				return null;
		}
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
		return await wrapped(...args);
	};

	let wmtApplyRenderFlags;
	let wmtApplyRenderFlagsType;

	let wmtRefreshTemplate;

	if (!isVideoDisabled()) {
		const toRadians = Math.toRadians;

		wmtApplyRenderFlagsType = 'WRAPPER';

		wmtApplyRenderFlags = function (wrapped, ...args) {
			const [flags] = args;
			if (flags?.refreshShape) flags.refreshShape = this.template && !this.template._destroyed;
			return wrapped(...args);
		};

		/* ------------------------------------------------------------------------------------ */

		/**
		 *
		 * @return {wmtRefreshTemplate}
		 */
		wmtRefreshTemplate = function () {
			const t = this.template.clear();
			if (!this.isVisible) return;

			// Draw the Template outline
			t.lineStyle(this._borderThickness, this.document.borderColor, 0.75).beginFill(0x000000, 0.0);

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
				const source = foundry.utils.getProperty(this.texture, 'baseTexture.resource.source');
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
				.drawCircle(this.ray.dx, this.ray.dy, 6)
				.endFill();

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
				if (template.controlIcon) template.controlIcon.renderable = template.isOwner;
				if (template.handle) template.handle.renderable = template.isOwner;
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
					const hl = canvas.interface.grid.getHighlightLayer(template.highlightId);
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

	libWrapper.register('tokenmagic', 'MeasuredTemplateDocument.prototype.update', wmtdUpdate, 'WRAPPER');
	libWrapper.register('tokenmagic', 'foundry.canvas.placeables.MeasuredTemplate.prototype._draw', wmtDraw, 'WRAPPER');

	libWrapper.register(
		'tokenmagic',
		'foundry.canvas.placeables.MeasuredTemplate.prototype._refreshState',
		function (wrapped, ...args) {
			const result = wrapped(...args);

			// Update visibility
			this.template.alpha = this.document.getFlag('tokenmagic', 'templateData')?.opacity ?? 1;
			this.controlIcon.visible = !!this.layer.active;
			this.controlIcon.border.visible = !!this.hover;

			return result;
		},
		'WRAPPER'
	);

	if (wmtApplyRenderFlags)
		libWrapper.register(
			'tokenmagic',
			'foundry.canvas.placeables.MeasuredTemplate.prototype._applyRenderFlags',
			wmtApplyRenderFlags,
			wmtApplyRenderFlagsType
		);
	if (wmtRefreshTemplate)
		libWrapper.register(
			'tokenmagic',
			'foundry.canvas.placeables.MeasuredTemplate.prototype._refreshTemplate',
			wmtRefreshTemplate,
			'OVERRIDE'
		);
});
