import { presets as defaultPresets, PresetsLibrary } from "../fx/presets/defaultpresets.js";
import { DataVersion } from "../migration/migration.js";
import { TokenMagic, isVideoDisabled, fixPath } from './tokenmagic.js';
import { AutoTemplateDND5E, dnd5eTemplates } from "./autoTemplate/dnd5e.js";
import { defaultOpacity, emptyPreset } from './constants.js';

const Magic = TokenMagic();

export class TokenMagicSettings extends FormApplication {
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

        let hasAutoTemplates = false;
        switch (game.system.id) {
            case 'dnd5e':
                hasAutoTemplates = true;
                game.settings.registerMenu('tokenmagic', menuAutoTemplateSettings.key, menuAutoTemplateSettings.config);
                game.settings.register(
                    'tokenmagic',
                    settingAutoTemplateSettings.key,
                    mergeObject(settingAutoTemplateSettings.config, {
                        default: AutoTemplateDND5E.defaultConfiguration
                    }, true, true),
                );
                break;
            default:
                break;
        }

        game.settings.register('tokenmagic', 'autoTemplateEnabled', {
            name: game.i18n.localize('TMFX.settings.autoTemplateEnabled.name'),
            hint: game.i18n.localize('TMFX.settings.autoTemplateEnabled.hint'),
            scope: "world",
            config: hasAutoTemplates,
            default: hasAutoTemplates,
            type: Boolean,
            onChange: (value) => TokenMagicSettings.configureAutoTemplate(value),
        });

        game.settings.register('tokenmagic', 'defaultTemplateOnHover', {
            name: game.i18n.localize('TMFX.settings.defaultTemplateOnHover.name'),
            hint: game.i18n.localize('TMFX.settings.defaultTemplateOnHover.hint'),
            scope: "world",
            config: true,
            default: hasAutoTemplates,
            type: Boolean,
            onChange: () => window.location.reload()
        });

        game.settings.register('tokenmagic', 'autohideTemplateElements', {
            name: game.i18n.localize('TMFX.settings.autohideTemplateElements.name'),
            hint: game.i18n.localize('TMFX.settings.autohideTemplateElements.hint'),
            scope: 'world',
            config: true,
            default: true,
            type: Boolean,
            onChange: () => window.location.reload()
        });
      
        game.settings.register('tokenmagic', 'autoFPSEnabled', {
            name: game.i18n.localize('TMFX.settings.autoFPS.name'),
            hint: game.i18n.localize('TMFX.settings.autoFPS.hint'),
            scope: 'client',
            config: true,
            default: false,
            type: Boolean,
            onChange: (value) => TokenMagicSettings.configureAutoFPS(value),
        });

        game.settings.register("tokenmagic", "useAdditivePadding", {
            name: game.i18n.localize("TMFX.settings.useMaxPadding.name"),
            hint: game.i18n.localize("TMFX.settings.useMaxPadding.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean
        });

        game.settings.register("tokenmagic", "minPadding", {
            name: game.i18n.localize("TMFX.settings.minPadding.name"),
            hint: game.i18n.localize("TMFX.settings.minPadding.hint"),
            scope: "world",
            config: true,
            default: 50,
            type: Number
        });

        game.settings.register("tokenmagic", "fxPlayerPermission", {
            name: game.i18n.localize("TMFX.settings.fxPlayerPermission.name"),
            hint: game.i18n.localize("TMFX.settings.fxPlayerPermission.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean
        });

        game.settings.register("tokenmagic", "importOverwrite", {
            name: game.i18n.localize("TMFX.settings.importOverwrite.name"),
            hint: game.i18n.localize("TMFX.settings.importOverwrite.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean
        });

        game.settings.register("tokenmagic", "useZOrder", {
            name: game.i18n.localize("TMFX.settings.useZOrder.name"),
            hint: game.i18n.localize("TMFX.settings.useZOrder.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean
        });

        game.settings.register("tokenmagic", "disableAnimations", {
            name: game.i18n.localize("TMFX.settings.disableAnimations.name"),
            hint: game.i18n.localize("TMFX.settings.disableAnimations.hint"),
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => window.location.reload()
        });

        game.settings.register("tokenmagic", "disableCaching", {
            name: game.i18n.localize("TMFX.settings.disableCaching.name"),
            hint: game.i18n.localize("TMFX.settings.disableCaching.hint"),
            scope: "client",
            config: true,
            default: false,
            type: Boolean
        });

        game.settings.register("tokenmagic", "disableVideo", {
            name: game.i18n.localize("TMFX.settings.disableVideo.name"),
            hint: game.i18n.localize("TMFX.settings.disableVideo.hint"),
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => window.location.reload()
        });

        game.settings.register("tokenmagic", "presets", {
            name: "Token Magic FX presets",
            hint: "Token Magic FX presets",
            scope: "world",
            config: false,
            default: defaultPresets,
            type: Object
        });

        game.settings.register("tokenmagic", "migration", {
            name: "TMFX Data Version",
            hint: "TMFX Data Version",
            scope: "world",
            config: false,
            default: DataVersion.ARCHAIC,
            type: String
        });

        loadTemplates([
            'modules/tokenmagic/templates/settings/settings.html',
            'modules/tokenmagic/templates/settings/dnd5e/categories.html',
            'modules/tokenmagic/templates/settings/dnd5e/overrides.html',
        ]);
    }

    static configureAutoTemplate(enabled = false) {
        switch (game.system.id) {
            case 'dnd5e':
                dnd5eTemplates.configure(enabled);
                break;
            default:
                break;
        }
    }

    static configureAutoFPS(enabled = false) {
        if (enabled) canvas.app.ticker.maxFPS = 0;
        else canvas.app.ticker.maxFPS = game.settings.get("core", "maxFPS");
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

    constructor(object = {}, options) {
        super(object, options);
    }

    getSettingsData() {
        let settingsData = {
            'autoTemplateEnable': game.settings.get('tokenmagic', 'autoTemplateEnabled'),
        }
        switch (game.system.id) {
            case 'dnd5e':
                settingsData['autoTemplateSettings'] = game.settings.get('tokenmagic', 'autoTemplateSettings');
                break;
            default:
                break;
        }
        return settingsData;
    }

    /** @override */
    getData() {
        let data = super.getData();
        data.hasAutoTemplates = false;
        data.emptyPreset = emptyPreset;
        switch (game.system.id) {
            case 'dnd5e':
                data.hasAutoTemplates = true
                data.dmgTypes = CONFIG.DND5E.damageTypes;
                data.templateTypes = CONFIG.MeasuredTemplate.types;
                break;
            default:
                break;
        }
        data.presets = Magic.getPresets(PresetsLibrary.TEMPLATE).sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        data.system = { id: game.system.id, title: game.system.data.title };
        data.settings = this.getSettingsData();
        data.submitText = game.i18n.localize('TMFX.save');
        return data;
    }

    /** @override */
    async _updateObject(_, formData) {
        const data = expandObject(formData);
        for (let [key, value] of Object.entries(data)) {
            if (key == 'autoTemplateSettings' && value.overrides) {
                const compacted = {};
                Object.values(value.overrides).forEach((val, idx) => compacted[idx] = val);
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
        let updateData = {}
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

Hooks.on("canvasReady", () => {
    TokenMagicSettings.configureAutoFPS(game.settings.get('tokenmagic', 'autoFPSEnabled'));
});

Hooks.once("init", () => {
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

    const wrappedMTU = async function (wrapped, ...args) {
        const [data] = args;

        const hasTexture = data.hasOwnProperty("texture");
        const hasPresetData = data.hasOwnProperty("tmfxPreset");

        if (hasTexture) {
            data.texture = fixPath(data.texture);
        }

        if (hasPresetData && data.tmfxPreset !== emptyPreset) {
            let defaultTexture = Magic._getPresetTemplateDefaultTexture(data.tmfxPreset);
            if (!(defaultTexture == null)) {
                if (data.texture === '' || data.texture.startsWith('modules/tokenmagic/fx/assets/templates/'))
                    data.texture = defaultTexture;
            }

        } else if (hasTexture && data.texture.startsWith('modules/tokenmagic/fx/assets/templates/')
            && hasPresetData && data.tmfxPreset === emptyPreset) {
            data.texture = '';
        }

        return await wrapped(...args);
    };

    const wrappedMTD = async function (wrapped, ...args) {
        if (this.data.hasOwnProperty("texture")) {
            this.data.texture = fixPath(this.data.texture);
        }

        return await wrapped(...args);
    };

    let wrappedMTR;
    let wrappedMTRType;

    if (!isVideoDisabled()) {
        wrappedMTRType = "OVERRIDE";
        wrappedMTR = function () {
            if (this.template && !this.template._destroyed) {
                // INTEGRATION FROM MESS
                // THANKS TO MOERILL !!
                let d = canvas.dimensions;
                this.position.set(this.data.x, this.data.y);

                // Extract and prepare data
                let { direction, distance, angle, width } = this.data;
                distance *= (d.size / d.distance);
                width *= (d.size / d.distance);
                direction = toRadians(direction);

                // Create ray and bounding rectangle
                this.ray = Ray.fromAngle(this.data.x, this.data.y, direction, distance);

                // Get the Template shape
                switch (this.data.t) {
                    case "circle":
                        this.shape = this._getCircleShape(distance);
                        break;
                    case "cone":
                        this.shape = this._getConeShape(direction, angle, distance);
                        break;
                    case "rect":
                        this.shape = this._getRectShape(direction, distance);
                        break;
                    case "ray":
                        this.shape = this._getRayShape(direction, distance, width);
                }

                // Draw the Template outline
                this.template.clear()
                    .lineStyle(this._borderThickness, this.borderColor, 0.75)
                    .beginFill(0x000000, 0.0);

                // Fill Color or Texture
                if (this.texture) {
                    let mat = PIXI.Matrix.IDENTITY;
                    // rectangle
                    if (this.shape.width && this.shape.height)
                        mat.scale(this.shape.width / this.texture.width, this.shape.height / this.texture.height);
                    else if (this.shape.radius) {
                        mat.scale(this.shape.radius * 2 / this.texture.height, this.shape.radius * 2 / this.texture.width)
                        // Circle center is texture start...
                        mat.translate(-this.shape.radius, -this.shape.radius);
                    } else if (this.data.t === "ray") {
                        const d = canvas.dimensions,
                            height = this.data.width * d.size / d.distance,
                            width = this.data.distance * d.size / d.distance;
                        mat.scale(width / this.texture.width, height / this.texture.height);
                        mat.translate(0, -height * 0.5);

                        mat.rotate(toRadians(this.data.direction));
                    } else {// cone
                        const d = canvas.dimensions;

                        // Extract and prepare data
                        let { direction, distance, angle } = this.data;
                        distance *= (d.size / d.distance);
                        direction = toRadians(direction);
                        const width = this.data.distance * d.size / d.distance;

                        const angles = [(angle / -2), (angle / 2)];
                        distance = distance / Math.cos(toRadians(angle / 2));

                        // Get the cone shape as a polygon
                        const rays = angles.map(a => Ray.fromAngle(0, 0, direction + toRadians(a), distance + 1));
                        const height = Math.sqrt((rays[0].B.x - rays[1].B.x) * (rays[0].B.x - rays[1].B.x)
                            + (rays[0].B.y - rays[1].B.y) * (rays[0].B.y - rays[1].B.y));
                        mat.scale(width / this.texture.width, height / this.texture.height);
                        mat.translate(0, -height / 2)
                        mat.rotate(toRadians(this.data.direction));
                    }
                    this.template.beginTextureFill({
                        texture: this.texture,
                        matrix: mat,
                        alpha: 1.0
                    });
                    // move into draw or so
                    const source = getProperty(this.texture, "baseTexture.resource.source")
                    if (source && (source.tagName === "VIDEO")) {
                        source.loop = true;
                        source.muted = true;
                        game.video.play(source);
                    }
                }
                else this.template.beginFill(0x000000, 0.0);

                // Draw the shape
                this.template.drawShape(this.shape);

                // Draw origin and destination points
                this.template.lineStyle(this._borderThickness, 0x000000)
                    .beginFill(0x000000, 0.5)
                    .drawCircle(0, 0, 6)
                    .drawCircle(this.ray.dx, this.ray.dy, 6);

                // Update visibility
                this.controlIcon.visible = this.layer._active;
                this.controlIcon.border.visible = this._hover;

                // Draw ruler text
                this._refreshRulerText();
                return this;
            }
            return this;
        };
    }

    if (game.settings.get('tokenmagic', 'autohideTemplateElements')) {
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

                if (!show) {
                    // Hide origin and destination points, i.e., hide everything except the template shape
                    for (const data of template.template.geometry.graphicsData) {
                        if (data.shape !== template.shape) {
                            data.fillStyle.visible = false;
                            data.lineStyle.visible = false;
                        }
                    }
                    template.template.geometry.invalidate();
                }

                template.ruler.renderable = show;

                template.controlIcon.renderable = template.owner;

                if (template.handle) {
                    template.handle.renderable = template.owner;
                }
            }

            return retVal;
        }

        if (wrappedMTR) {
            const _wrappedMTR = wrappedMTR;
            wrappedMTR = function() {
                return autohideTemplateElements.call(this, _wrappedMTR.bind(this), ...arguments);
            }
        } else {
            wrappedMTRType = "WRAPPER";
            wrappedMTR = autohideTemplateElements;
        }
    }

    if (game.settings.get('tokenmagic', 'defaultTemplateOnHover')) {
        Hooks.on("canvasReady", () => {
            canvas.stage.on("mousemove", event => {
                const {x: mx, y: my} = event.data.getLocalPosition(canvas.templates);
                for (const template of canvas.templates.placeables) {
                    const hl = canvas.grid.getHighlightLayer(`Template.${template.id}`);
                    const opacity = template.getFlag("tokenmagic", "templateData")?.opacity ?? 1;
                    if (template.texture && template.texture !== '') {
                        const {x: cx, y: cy} = template.center;
                        const mouseover = template.shape.contains(mx - cx, my - cy);
                        hl.renderable = mouseover;
                        template.template.alpha = (mouseover ? 0.5: 1.0) * opacity;
                    } else {
                        hl.renderable = true;
                        template.template.alpha = opacity;
                    }
                }
            });
        });
    }

    if (game.modules.get("lib-wrapper")?.active) {
        libWrapper.register("tokenmagic", "MeasuredTemplate.prototype.update", wrappedMTU, "WRAPPER");
        libWrapper.register("tokenmagic", "MeasuredTemplate.prototype.draw", wrappedMTD, "WRAPPER");

        if (wrappedMTR) {
            libWrapper.register("tokenmagic", "MeasuredTemplate.prototype.refresh", wrappedMTR, wrappedMTRType);
        }
    } else {
        const cachedMTU = MeasuredTemplate.prototype.update;
        MeasuredTemplate.prototype.update = function () {
            return wrappedMTU.call(this, cachedMTU.bind(this), ...arguments);
        };

        const cachedMTD = MeasuredTemplate.prototype.draw;
        MeasuredTemplate.prototype.draw = function () {
            return wrappedMTD.call(this, cachedMTD.bind(this), ...arguments);
        };

        if (wrappedMTR) {
            if (wrappedMTRType && wrappedMTRType !== "OVERRIDE") {
                const cachedMTR = MeasuredTemplate.prototype.refresh;
                MeasuredTemplate.prototype.refresh = function () {
                    return wrappedMTR.call(this, cachedMTR.bind(this), ...arguments);
                };
            } else {
                MeasuredTemplate.prototype.refresh = wrappedMTR;
            }
        }
    }
});
