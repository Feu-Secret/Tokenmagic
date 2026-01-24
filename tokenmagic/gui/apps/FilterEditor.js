import { PresetsLibrary } from '../../fx/presets/defaultpresets.js';
import { PlaceableType } from '../../module/constants.js';
import { FilterType } from '../../module/tokenmagic.js';
import { ANIM_PARAM_CONTROLS, FILTER_PARAM_CONTROLS } from './data/fxControls.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { deepClone, getType, isEmpty, mergeObject } = foundry.utils;

/**
 * TODO:
 * add a group field to controls, to group them into fieldsets
 * Twist filter 'offset' {x: 0, y: 0} // ignore for now
 * zoomblur filter 'center' [672.5, 552.5] (not normalized/static like the bulge filter)
 * Pixelate/Ascii filters respond to camera movement
 * Perhaps during preset creation detect if finite loop animation exists and prompt for auto destroy flag?
 */

export function filterEditor(placeable, sourceBounds) {
	placeable = placeable ?? TokenMagic.getControlledPlaceables()[0];
	if (!placeable) return;

	const document = placeable.document ?? placeable;
	const appId = FilterSelector.genId(document);

	const activeInstance = foundry.applications.instances.get(appId);
	if (activeInstance) {
		activeInstance.close();
		return;
	}
	new FilterSelector(document, sourceBounds).render(true);
}

/**
 * First char to uppercase and insert spaces at upper case characters
 * @param {string} text
 * @returns
 */
function genLabel(text) {
	return (text.charAt(0).toUpperCase() + text.slice(1)).match(/[A-Z0-9][a-z]*/g).join(' ');
}

class FilterSelector extends HandlebarsApplicationMixin(ApplicationV2) {
	static genId(document) {
		return `tmfx-filter-selector-${document.id}`;
	}

	constructor(document, sourceBounds) {
		const options = {
			id: FilterSelector.genId(document),
		};

		// If bounds of the triggering element are provided lets position this
		// window relative to center right
		if (sourceBounds) {
			const b = sourceBounds;
			const { width, height } = FilterSelector.DEFAULT_OPTIONS.position;
			options.position = {
				left: b.left - width - 50,
				top: b.top + (b.bottom - b.top) / 2 - height / 2,
			};
		}

		super(options);
		this._document = document;
	}

	get title() {
		let title = game.i18n.localize('TMFX.TokenMagic') + ' ' + game.i18n.localize('TMFX.app.filterSelector.title');
		if (this._document.documentName === 'Token' && this._document.name.trim()) title += ` [ ${this._document.name} ]`;
		else title += ` [ ${this._document.documentName} ]`;
		return title;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		window: { resizable: true },
		classes: ['tokenmagic', 'selector', 'flexcol'],
		actions: {
			select: FilterSelector._onEdit,
			delete: FilterSelector._onDelete,
			toggle: FilterSelector._onToggle,
			presetSearch: FilterSelector._onPresetSearch,
			macro: FilterSelector._onSave,
			preset: FilterSelector._onSave,
			randomize: FilterSelector._onRandomize,
		},
		position: {
			width: 300,
			height: 450,
		},
	};

	/** @override */
	static PARTS = {
		header: {
			template: `modules/tokenmagic/templates/apps/preset-search/header-controls.hbs`,
		},
		filters: {
			template: `modules/tokenmagic/templates/apps/filter-editor/filter-list.hbs`,
		},
	};

	static getFilter(document, { filterId, filterType, filterInternalId }) {
		const filters = document.getFlag('tokenmagic', 'filters');
		return filters?.find(
			(f) =>
				f.tmFilters.tmFilterId === filterId &&
				f.tmFilters.tmFilterType === filterType &&
				f.tmFilters.tmFilterInternalId === filterInternalId,
		)?.tmFilters.tmParams;
	}

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				this._prepareHeaderContext(context, options);
				break;
			case 'filters':
				await this._prepareFiltersContext(context, options);
				break;
		}
		return context;
	}

	_prepareHeaderContext(context, options) {
		const filters = this._document.getFlag('tokenmagic', 'filters');
		const hasFilters = filters?.length;
		const hasActiveRandomizedFields = filters?.some((f) => {
			const randomized = f.tmFilters.tmParams.randomized;
			if (isEmpty(randomized)) return false;
			return Object.values(randomized).some((r) => !r.hasOwnProperty('active') || r.active);
		});

		context.controls = [
			{
				action: 'presetSearch',
				tooltip: 'Presets',
				icon: 'fa-solid fa-box',
			},
			{
				action: 'preset',
				tooltip: 'Save as Preset',
				icon: 'fa-solid fa-floppy-disk',
				disabled: !hasFilters,
			},
			{
				action: 'macro',
				tooltip: 'Display as Macro',
				icon: 'fa-solid fa-code',
				disabled: !hasFilters,
			},
			{
				action: 'randomize',
				tooltip: 'Re-roll Randomized Fields',
				icon: 'fa-solid fa-dice',
				disabled: !hasActiveRandomizedFields,
			},
		];
	}

	async _prepareFiltersContext(context, options) {
		this._filters = (this._document.getFlag('tokenmagic', 'filters') ?? [])
			.map((filter) => {
				const { filterId, filterType, rank, enabled, filterInternalId } = filter.tmFilters.tmParams;
				return {
					filterId,
					filterType,
					filterInternalId,
					label: filterId,
					subtext: filterType,
					rank,
					thumbnail: FILTER_PARAM_CONTROLS[filterType]?._thumb ?? FILTER_PARAM_CONTROLS.common._thumb,
					controls: [
						{
							class: 'toggle',
							action: 'toggle',
							icon: 'fa-sharp fa-solid fa-power-off',
							tooltip: game.i18n.localize('CONTROLS.CommonOnOff'),
							active: enabled || enabled == undefined,
						},
						{
							class: 'delete',
							action: 'delete',
							tooltip: game.i18n.localize('SIDEBAR.Delete'),
							icon: 'fa-solid fa-trash',
						},
					],
				};
			})
			.sort((f1, f2) => f1.rank - f2.rank);

		return Object.assign(context, { filters: this._filters });
	}

	/** @override */
	_attachFrameListeners() {
		super._attachFrameListeners();
		this.element.querySelector('.window-content').addEventListener('drop', this._onWindowDrop.bind(this));
	}
	/** @override */
	_attachPartListeners(partId, element, options) {
		super._attachPartListeners(partId, element, options);

		this.element.querySelectorAll('.filter').forEach((element) => {
			element.addEventListener('dragstart', this._onDragStart.bind(this));
			element.addEventListener('drop', this._onFilterDrop.bind(this));
		});
	}

	_onDragStart(event) {
		const { filterId, filterType, filterInternalId } = event.target.closest('.filter').dataset;
		const dragData = {
			filterId,
			filterType,
			filterInternalId,
			placeableId: this._document.id,
			documentName: this._document.documentName,
			sceneId: this._document.parent.id,
		};
		event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
	}

	async _onWindowDrop(event) {
		const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
		if (data.presetName && data.library) {
			return this._onAddPreset(data);
		} else if (this._document.id !== data.placeableId || this._document.parent.id !== data.sceneId) {
			return this._onAddFilter(data);
		}
	}

	async _onAddPreset({ presetName, library }) {
		const preset = TokenMagic.getPresets(library).find((p) => p.name === presetName);
		if (!preset?.params?.length) return;

		if (preset.defaultTexture && this._document.documentName === 'MeasuredTemplate') {
			await this._document.update({ texture: preset.defaultTexture });
		}

		await TokenMagic.addFilters(this._document, preset.params);
	}

	async _onFilterDrop(event) {
		const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
		if (!data.filterId || !data.filterType || !data.filterInternalId) return;
		if (this._document.id !== data.placeableId && this._document.parent.id !== data.sceneId) return;

		const { filterId, filterType, filterInternalId } = event.target.closest('.filter').dataset;
		if (data.filterId === filterId && data.filterType === filterType && data.filterInternalId === filterInternalId)
			return;

		return this._onUpdateFilterRank(data, { filterId, filterType, filterInternalId });
	}

	async _onAddFilter({ filterId, filterType, filterInternalId, placeableId, documentName, sceneId } = {}) {
		const scene = game.scenes.get(sceneId);
		const document = scene?.getEmbeddedDocument(documentName, placeableId);
		if (!document) return;

		const filter = deepClone(FilterSelector.getFilter(document, { filterId, filterType, filterInternalId }));
		if (!filter) return;

		await TokenMagic.addUpdateFilters(this._document, [filter]);
		return this.render(true);
	}

	async _onUpdateFilterRank(fromFilter, toFilter) {
		const filters = this._document.getFlag('tokenmagic', 'filters');
		if (!filters || !filters.length) return;

		const fromParams = FilterSelector.getFilter(this._document, fromFilter);
		const toParams = FilterSelector.getFilter(this._document, toFilter);
		if (!fromParams || !toParams) return;

		await TokenMagic.updateFiltersByPlaceable(this._document, [
			{
				filterId: fromParams.filterId,
				filterType: fromParams.filterType,
				filterInternalId: fromParams.filterInternalId,
				rank: toParams.rank,
			},
			{
				filterId: toParams.filterId,
				filterType: toParams.filterType,
				filterInternalId: toParams.filterInternalId,
				rank: fromParams.rank,
			},
		]);
		this.render(true);
	}

	static async _onEdit(event) {
		try {
			const filterEl = event.target.closest('.filter');
			const { filterId, filterType, filterInternalId } = filterEl.dataset;
			const filterIdentifier = { filterId, filterType, filterInternalId };

			const appId = FilterEditor.genId(this._document, filterIdentifier);
			const activeInstance = foundry.applications.instances.get(appId);
			if (activeInstance) activeInstance.close();
			else {
				const { left, bottom } = filterEl.getBoundingClientRect();
				new FilterEditor(
					{ document: this._document, filterIdentifier },
					{ id: appId, position: { left, top: bottom } },
				).render(true);
			}
		} catch (e) {
			console.log(e);
		}
	}

	static async _onDelete(event) {
		const { filterId, filterType, filterInternalId } = event.target.closest('.filter').dataset;

		await TokenMagic.deleteFilters(this._document, filterId, filterType, filterInternalId);

		const appId = FilterEditor.genId(this._document, { filterId, filterType, filterInternalId });
		const activeInstance = foundry.applications.instances.get(appId);
		if (activeInstance) activeInstance.close();
	}

	static async _onToggle(event) {
		const { filterId, filterType, filterInternalId } = event.target.closest('.filter').dataset;
		await TokenMagic.updateFiltersByPlaceable(this._document, [
			{
				filterId,
				filterType,
				filterInternalId,
				enabled: !event.target.closest('.toggle').classList.contains('active'),
			},
		]);
		this.render(true);
	}

	static _onPresetSearch(event) {
		import('./PresetSearch.js').then((module) => {
			module.presetSearch({
				position: {
					top: this.position.top,
					left: this.position.left + this.position.width,
				},
			});
		});
	}

	static _onSave(event) {
		const action = event.target.closest('a').dataset.action;
		new SavePreset(this._document, action === 'macro').render(true);
	}

	static _onRandomize() {
		const paramArray = getCloneFilterParams(this._document);
		if (paramArray?.length) window.TokenMagic.updateFiltersByPlaceable(this._document, paramArray);
	}

	/** @override */
	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
		this._hooks = [];
		for (const layer of Object.values(PlaceableType)) {
			if (!layer) continue;
			const hook = `update${layer}`;
			const id = Hooks.on(hook, (document, change, options, userId) => {
				if (document.id !== this._document.id) return;
				const tm = change.flags?.tokenmagic;
				if (!tm) return;

				// TODO: a smarter comparison?
				if ('-=filters' in tm || tm.filters?.length !== this._filters.length) {
					this.render({ parts: ['header', 'filters'] });
				}
			});
			this._hooks.push({ hook, id });
		}
	}

	/** @override */
	async close(options = {}) {
		await super.close(options);
		this._hooks?.forEach((h) => {
			Hooks.off(h.hook, h.id);
		});
	}
}

class FilterEditor extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor({ document, filterIdentifier } = {}, options) {
		super(options);
		this._document = document;
		this._filterIdentifier = filterIdentifier;
	}

	static genId(document, { filterId, filterType, filterInternalId }) {
		return `tmfx-filter-editor-${document.id}-${filterId}-${filterType}-${filterInternalId}`;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: '',
		tag: 'form',
		window: {
			title: 'TMFX.app.filterEditor.title',
			icon: 'fa-solid fa-fire',
			contentClasses: ['standard-form'],
			resizable: true,
		},
		position: {
			width: 444,
		},
		classes: ['tokenmagic', 'editor', 'standard-form'],
		form: {
			handler: FilterEditor._onSubmit,
			submitOnChange: true,
			closeOnSubmit: false,
		},
		actions: {
			animate: FilterEditor._onAnimate,
			randomize: FilterEditor._onRandomize,
		},
	};

	/** @override */
	static PARTS = {
		header: {
			template: `modules/tokenmagic/templates/apps/filter-editor/header.hbs`,
		},
		filter: {
			template: `modules/tokenmagic/templates/apps/filter-editor/filter.hbs`,
			scrollable: [''],
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				context.title = genLabel(this._filterIdentifier.filterType);
				break;
			case 'filter':
				await this._prepareFilterContext(context, options);
				break;
		}
		return context;
	}

	async _prepareFilterContext(context, options) {
		this._readParams();
		// Cache partials
		await foundry.applications.handlebars.getTemplate(
			`modules/tokenmagic/templates/apps/filter-editor/control.hbs`,
			'tmfx-control',
		);

		this._paramControls = {};
		const controls = [];
		for (const [param, value] of Object.entries(this._params)) {
			const control = this.#genControl(param, value);
			if (!control) continue;
			controls.push(control);
			this._paramControls[param] = control;
		}
		controls.sort((c1, c2) => (c1.order ?? 0) - (c2.order ?? 0));

		const groups = [];
		const temp = {};
		for (const control of controls) {
			const group = control.group;
			if (!group) groups.push(control);
			else {
				if (!temp[group]) {
					temp[group] = { label: genLabel(group), controls: [] };
					groups.push(temp[group]);
				}
				temp[group].controls.push(control);
			}
		}

		return Object.assign(context, { groups, filterId: this._filterIdentifier.filterId });
	}

	_readParams() {
		this._params = deepClone(FilterSelector.getFilter(this._document, this._filterIdentifier));

		// Some filters have explicitly defined default values
		const defaults = FilterType[this._filterIdentifier.filterType].defaults;
		if (defaults) {
			this._params = Object.assign(deepClone(defaults), this._params);
		}

		if (!isEmpty(this._params.animated)) {
			this._animated = this._params.animated;
		} else this._animated = {};

		if (!isEmpty(this._params.randomized)) {
			this._randomized = this._params.randomized;
		} else this._randomized = {};

		// Remove un-editable parameters
		[
			'placeableId',
			'placeableType',
			'filterInternalId',
			'filterOwner',
			'updateId',
			'filterType',
			'filterId',
			'animated',
			'randomized',
			'enabled',
			'rank',
		].forEach((param) => delete this._params[param]);
	}

	#genControl(param, value) {
		let control =
			FILTER_PARAM_CONTROLS[this._filterIdentifier.filterType]?.[param] ?? FILTER_PARAM_CONTROLS.common[param];
		// If a predefined control does not exist lets deduce a generic one from the value
		if (!control) {
			const type = getType(value);
			if (type === 'string') control = { type: 'text' };
			else if (type === 'number') control = { type: 'number' };
			else if (type === 'boolean') control = { type: 'boolean' };
			else {
				console.warn(`Unable to determine param (${param}) control type.`, value);
				return null;
			}
		} else control = deepClone(control);

		if (control.type === 'ignore') return null;

		// Is control animatable
		if (control.type === 'range' || control.type === 'number' || control.type === 'color') {
			if (!('animatable' in control)) control.animatable = true;
			const animated = this._animated[param];
			if (animated && (animated.active || !('active' in animated))) control.animated = true;
		}

		// Is control randomizable
		if (!('randomizable' in control)) control.randomizable = true;
		const randomized = this._randomized[param];
		if (randomized && (randomized.active || !('active' in randomized))) control.randomized = true;

		if (control.animated || control.randomized) control.disabled = true;

		control.name = param;

		if (control.validate) value = control.validate(value);

		if (control.type === 'color') control.value = new Color(value).toString();
		else control.value = value;

		control[control.type] = true;
		control.label = genLabel(param);

		return control;
	}

	/**
	 * Process form data
	 */
	static async _onSubmit(event, form, formData) {
		const params = foundry.utils.expandObject(formData.object);
		for (const [param, value] of Object.entries(params)) {
			const control = this._paramControls[param];
			if (control.type === 'color') params[param] = Number(Color.fromString(value));
		}

		Object.assign(params, this._filterIdentifier);
		await TokenMagic.updateFiltersByPlaceable(this._document, [params]);
	}

	static async _onAnimate(event) {
		const param = event.target.closest('a').dataset.param;
		const appId = AnimationEditor.genId(this._document, {
			...this._filterIdentifier,
			param,
		});
		const activeInstance = foundry.applications.instances.get(appId);
		if (activeInstance) activeInstance.close();
		else {
			const formGroupEl = event.target.closest('.form-group');
			const { left, bottom } = formGroupEl.getBoundingClientRect();
			new AnimationEditor(
				{
					document: this._document,
					filterIdentifier: this._filterIdentifier,
					param,
					control: this._paramControls[param],
					parentApp: this,
				},
				{ id: appId, position: { top: bottom, left } },
			).render(true);
		}
	}

	static async _onRandomize(event) {
		const param = event.target.closest('a').dataset.param;
		const appId = RandomizationEditor.genId(this._document, {
			...this._filterIdentifier,
			param,
		});
		const activeInstance = foundry.applications.instances.get(appId);
		if (activeInstance) activeInstance.close();
		else {
			const formGroupEl = event.target.closest('.form-group');
			const { left, bottom } = formGroupEl.getBoundingClientRect();
			new RandomizationEditor(
				{
					document: this._document,
					filterIdentifier: this._filterIdentifier,
					param,
					controls: this._paramControls,
					parentApp: this,
				},
				{ id: appId, position: { top: bottom, left } },
			).render(true);
		}
	}

	/** @override */
	_attachPartListeners(partId, element, options) {
		super._attachPartListeners(partId, element, options);

		// For smoother experience when using color-picker, lets respond to 'input' events
		// and trigger 'change' events in turn triggering form submit and filter update
		if (partId === 'filter') {
			const INTERVAL_MS = 200;
			let lastChangeTime = 0;
			let trailingTimer = null;
			element.querySelectorAll('color-picker').forEach((element) => {
				element.addEventListener('input', (event) => {
					const now = performance.now();
					if (now - lastChangeTime >= INTERVAL_MS) {
						event.target.dispatchEvent(new Event('change'));
						lastChangeTime = performance.now();
					}

					clearTimeout(trailingTimer);
					trailingTimer = setTimeout(() => {
						event.target.dispatchEvent(new Event('change'));
						lastChangeTime = performance.now();
					}, INTERVAL_MS);
				});
			});
		}
	}
}

class AnimationEditor extends HandlebarsApplicationMixin(ApplicationV2) {
	static genId(document, { filterId, filterType, filterInternalId, param }) {
		return `tmfx-animation-editor-${document.id}-${filterId}-${filterType}-${filterInternalId}-${param}`;
	}

	constructor({ document, filterIdentifier, param, control, parentApp } = {}, options) {
		super(options);
		this._document = document;
		this._filterIdentifier = filterIdentifier;
		this._param = param;
		this._control = control;
		this._parentApp = parentApp;
		this._initAnimParams();
	}

	standardControls = ['active', 'loopDuration', 'val1', 'val2', 'loops', 'syncShift'];

	keywordControls = {
		move: ['active', 'speed'],
		cosOscillation: this.standardControls,
		sinOscillation: this.standardControls,
		syncCosOscillation: this.standardControls,
		syncSinOscillation: this.standardControls,
		chaoticOscillation: ['active', 'loopDuration', 'val1', 'val2', 'chaosFactor', 'loops', 'syncShift'],
		syncChaoticOscillation: ['active', 'loopDuration', 'val1', 'val2', 'chaosFactor', 'loops', 'syncShift'],
		halfCosOscillation: this.standardControls,
		rotation: ['active', 'loopDuration', 'loops', 'syncShift', 'clockwise'],
		syncRotation: ['active', 'loopDuration', 'loops', 'syncShift', 'clockwise'],
		randomNumber: ['active', 'val1', 'val2', 'wantInteger'],
		randomNumberPerLoop: ['active', 'val1', 'val2', 'loops', 'wantInteger'],
	};

	colorKeywordControls = {
		colorOscillation: this.standardControls,
		syncColorOscillation: this.standardControls,
		halfColorOscillation: this.standardControls,
		randomColorPerLoop: ['active', 'loopDuration', 'loops'],
	};

	_initAnimParams() {
		const tmParams = FilterSelector.getFilter(this._document, this._filterIdentifier);
		const animated = tmParams.animated?.[this._param];

		this._animParams = mergeObject(
			{
				animType: this._control.type === 'color' ? 'colorOscillation' : 'move',
				val1: tmParams[this._param],
				val2: tmParams[this._param],
				active: false,
				speed: 0.0000025,
				loopDuration: 3000,
				loops: 0,
				wantInteger: false,
				chaosFactor: 0.25,
				syncShift: 0,
				clockwise: true,
			},
			animated ?? {},
		);

		if (animated && !animated.hasOwnProperty('active')) delete this._animParams.active;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		tag: 'form',
		window: {
			title: 'TMFX.app.animationEditor.title',
			icon: 'fa-regular fa-clapperboard-play',
			contentClasses: ['standard-form'],
		},
		position: {
			width: 400,
		},
		classes: ['tokenmagic', 'animate', 'standard-form'],
		form: {
			handler: AnimationEditor._onSubmit,
			submitOnChange: true,
			closeOnSubmit: false,
		},
		actions: {},
	};

	/** @override */
	static PARTS = {
		header: {
			template: `modules/tokenmagic/templates/apps/filter-editor/header.hbs`,
		},
		animate: {
			template: `modules/tokenmagic/templates/apps/filter-editor/animate.hbs`,
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				context.title = genLabel(this._param);
				break;
			case 'animate':
				await this._prepareAnimateContext(context, options);
				break;
		}
		return context;
	}

	async _prepareAnimateContext(context, options) {
		// Cache partials
		await foundry.applications.handlebars.getTemplate(
			`modules/tokenmagic/templates/apps/filter-editor/control.hbs`,
			'tmfx-control',
		);

		const keyControls = this._control.type === 'color' ? this.colorKeywordControls : this.keywordControls;

		const animOptions = {};
		Object.keys(keyControls).forEach((k) => {
			animOptions[k] = genLabel(k);
		});

		const controls = [
			{
				type: 'select',
				select: true,
				name: 'animType',
				label: 'Animation Type',
				options: animOptions,
				value: this._animParams.animType,
				order: 0,
			},
		];
		keyControls[this._animParams.animType].forEach((param) => {
			let control;
			if (param === 'val1' || param === 'val2') {
				control = { ...this._control, order: 1, disabled: false, label: null };
			} else {
				control = deepClone(ANIM_PARAM_CONTROLS[param]);
			}

			if (control.type === 'color') control.value = new Color(this._animParams[param]).toString();
			else control.value = this._animParams[param];

			if (!control.label) control.label = genLabel(param);
			control.name = param;
			control[control.type] = true;
			controls.push(control);
		});

		context.controls = controls.sort((c1, c2) => c1.order - c2.order);
		return context;
	}

	/**
	 * Process form data
	 */
	static async _onSubmit(event, form, formData) {
		const params = foundry.utils.expandObject(formData.object);
		if ('loops' in params && !params.loops) params.loops = null;

		if (this._control.type === 'color') {
			if (getType(params.val1) === 'string') params.val1 = Number(Color.fromString(params.val1));
			if (getType(params.val2) === 'string') params.val2 = Number(Color.fromString(params.val2));
		}

		const renderParent = params.active !== this._animParams.active;
		const render = params.animType !== this._animParams.animType;
		mergeObject(this._animParams, params);
		if (render) {
			await this.render({ parts: ['animate'] });
			this._onSubmitForm(this.options.form, event);
			return;
		}

		await TokenMagic.updateFiltersByPlaceable(this._document, [
			{ ...this._filterIdentifier, animated: { [this._param]: params } },
		]);

		if (renderParent && this._parentApp.state === ApplicationV2.RENDER_STATES.RENDERED) {
			if (FilterSelector.getFilter(this._document, this._filterIdentifier))
				this._parentApp.render({ parts: ['filter'] });
		}
	}
}

class RandomizationEditor extends HandlebarsApplicationMixin(ApplicationV2) {
	static genId(document, { filterId, filterType, filterInternalId, param }) {
		return `tmfx-randomization-editor-${document.id}-${filterId}-${filterType}-${filterInternalId}-${param}`;
	}

	constructor({ document, filterIdentifier, param, controls, parentApp } = {}, options) {
		super(options);
		this._document = document;
		this._filterIdentifier = filterIdentifier;
		this._param = param;
		this._control = controls[param];
		this._controls = controls;
		this._parentApp = parentApp;
		this._initRandomizeParams();
	}

	_initRandomizeParams() {
		const tmParams = FilterSelector.getFilter(this._document, this._filterIdentifier);
		let randomized = tmParams.randomized?.[this._param];

		if (randomized && Array.isArray(randomized)) randomized = { list: randomized };

		this._randomizeParams = mergeObject(
			{
				active: false,
				type: null,
				val1: this._control.min ?? tmParams[this._param],
				val2: this._control.max ?? tmParams[this._param],
				step: this._control.step ?? 1,
				list: [],
				link: null,
			},
			randomized ?? {},
		);

		if (randomized && !randomized.hasOwnProperty('active')) delete this._randomizeParams.active;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		tag: 'form',
		window: {
			title: 'TMFX.app.randomizationEditor.title',
			icon: 'fa-solid fa-dice',
			contentClasses: ['standard-form'],
		},
		position: {
			width: 400,
		},
		classes: ['tokenmagic', 'randomize', 'standard-form'],
		form: {
			handler: RandomizationEditor._onSubmit,
			submitOnChange: true,
			closeOnSubmit: false,
		},
		actions: {
			addListElement: RandomizationEditor._onAddListElement,
			remove: RandomizationEditor._onRemove,
		},
	};

	/** @override */
	static PARTS = {
		header: {
			template: `modules/tokenmagic/templates/apps/filter-editor/header.hbs`,
		},
		randomize: {
			template: `modules/tokenmagic/templates/apps/filter-editor/randomize.hbs`,
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				context.title = genLabel(this._param);
				break;
			case 'randomize':
				await this._prepareRandomizeContext(context, options);
				break;
		}
		return context;
	}

	async _prepareRandomizeContext(context, options) {
		// Cache partials
		await foundry.applications.handlebars.getTemplate(
			`modules/tokenmagic/templates/apps/filter-editor/control.hbs`,
			'tmfx-control',
		);

		// == Randomization types ==

		const TYPE_OPTIONS = {
			any: game.i18n.localize('TMFX.app.randomizationEditor.option.any.label'),
			range: game.i18n.localize('TMFX.app.randomizationEditor.option.range'),
			list: game.i18n.localize('TMFX.app.randomizationEditor.option.list.label'),
		};

		const controlType = this._control.type;
		const allowedTypes = [];

		if (controlType === 'range') {
			allowedTypes.push('any', 'range', 'list');
		} else if (controlType === 'file' || controlType == 'text') {
			allowedTypes.push('list');
		} else if (controlType === 'color') {
			allowedTypes.push('any', 'list', 'range');
		} else if (controlType == 'boolean') {
			allowedTypes.push('any');
		} else if (controlType === 'select') {
			allowedTypes.push('any', 'list');
		} else if (controlType === 'number') {
			allowedTypes.push('range', 'list');
		}

		const typeOptions = {};
		Object.keys(TYPE_OPTIONS).forEach((k) => {
			if (allowedTypes.includes(k)) typeOptions[k] = TYPE_OPTIONS[k];
		});

		// ==
		const type = this._randomizeParams.type ?? (this._randomizeParams.list.length ? 'list' : allowedTypes[0]);

		let controls = [];
		if (type === 'range') {
			controls.push({
				...this._control,
				value: this._randomizeParams.val1,
				disabled: false,
				name: 'val1',
				label: game.i18n.localize('TMFX.app.randomizationEditor.option.min'),
			});
			controls.push({
				...this._control,
				value: this._randomizeParams.val2,
				disabled: false,
				name: 'val2',
				label: game.i18n.localize('TMFX.app.randomizationEditor.option.max'),
			});
		} else if (type === 'list') {
			for (let i = 0; i < this._randomizeParams.list.length; i++) {
				controls.push({
					...this._control,
					value: this._randomizeParams.list[i],
					disabled: false,
					name: `list.${i}`,
					label: `[${i}]`,
					removable: true,
				});
			}
		}

		if (this._control.type === 'color') {
			controls.forEach((c) => (c.value = new Color(c.value).toString()));
		}

		// Identify parameters eligible for linking
		let linkables = {};
		for (const [param, control] of Object.entries(this._controls)) {
			if (this._param !== param && ['type', 'min', 'max', 'step'].every((k) => this._control[k] === control[k])) {
				linkables[param] = control.label;
			}
		}
		if (isEmpty(linkables)) {
			linkables = null;
			this._randomizeParams.link = null;
		}

		return Object.assign(context, {
			typeOptions,
			type,
			controls,
			linkables,
			link: this._randomizeParams.link,
			active: this._randomizeParams.active,
		});
	}

	static _onAddListElement(event) {
		this._randomizeParams.list.push(this._randomizeParams.val1);
		this.render({ parts: ['randomize'] }).then(() => {
			this._onSubmitForm(this.options.form, event);
		});
	}

	static _onRemove(event) {
		const param = event.target.closest('.mod-control').dataset.param;
		const index = Number(param.split('.').pop());
		this._randomizeParams.list.splice(index, 1);
		this.render({ parts: ['randomize'] }).then(() => {
			this._onSubmitForm(this.options.form, event);
		});
	}

	/**
	 * Process form data
	 */
	static async _onSubmit(event, form, formData) {
		const params = foundry.utils.expandObject(formData.object);
		if (params.list) params.list = Object.values(params.list);

		if (this._control.type === 'color') {
			if (params.list) params.list = params.list.map((v) => Number(Color.fromString(v)));
			if (params.val1) params.val1 = Number(Color.fromString(params.val1));
			if (params.val2) params.val2 = Number(Color.fromString(params.val2));
			params.color = true;
		}

		const renderParent = params.active !== this._randomizeParams.active;
		const render = params.type !== this._randomizeParams.type;
		mergeObject(this._randomizeParams, params);
		if (render) {
			await this.render({ parts: ['randomize'] });
			this._onSubmitForm(this.options.form, event);
			return;
		}

		const update = deepClone(this._randomizeParams);
		if (update.type !== 'list') {
			update.list = [];
		}
		if (update.type === 'any') {
			if (this._control.type === 'color') {
				update.val1 = 0;
				update.val2 = 0xffffff;
			} else if (this._control.hasOwnProperty('min')) {
				update.val1 = this._control.min;
				update.val2 = this._control.max;
			}
		}

		await TokenMagic.updateFiltersByPlaceable(this._document, [
			{ ...this._filterIdentifier, randomized: { [this._param]: update } },
		]);

		if (renderParent && this._parentApp.state === ApplicationV2.RENDER_STATES.RENDERED) {
			if (FilterSelector.getFilter(this._document, this._filterIdentifier))
				this._parentApp.render({ parts: ['filter'] });
		}
	}
}

class SavePreset extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor(document, displayMacro = false) {
		super();
		this._document = document;
		this._displayMacro = displayMacro;

		this._originalParams = getCloneFilterParams(document);
		if (!this._originalParams?.length) throw Error('Document does not contain filters.');

		this._name = this._originalParams[0].filterId;
		if (FilterType[this._name]) this._name = 'NewFilter';

		this._filterRandomized = true;
		this._filterAnimated = true;
	}

	_prepareParams() {
		const params = deepClone(this._originalParams);
		params.forEach((param) => {
			param.filterId = this._name;
			if (this._filterAnimated && param.animated) {
				Object.keys(param.animated).forEach((k) => {
					if ('active' in param.animated[k] && !param.animated[k].active) {
						delete param.animated[k];
					}
				});
			}
			if (this._filterRandomized && param.randomized) {
				Object.keys(param.randomized).forEach((k) => {
					if ('active' in param.randomized[k] && !param.randomized[k].active) {
						delete param.randomized[k];
					}
				});
			}
		});

		return params;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: 'tmfx-save-preset',
		tag: 'form',
		window: {
			contentClasses: ['standard-form'],
		},
		position: {
			width: 500,
		},
		classes: ['tokenmagic', 'standard-form'],
		form: {
			handler: SavePreset._onSubmit,
			submitOnChange: true,
			closeOnSubmit: false,
		},
		actions: {
			save: SavePreset._onSave,
		},
	};

	get title() {
		if (this._displayMacro) return game.i18n.localize('DOCUMENT.Macro');
		return game.i18n.localize('TMFX.app.savePreset.title');
	}

	/** @override */
	static PARTS = {
		main: { template: `modules/tokenmagic/templates/apps/filter-editor/save.hbs` },
		footer: { template: 'templates/generic/form-footer.hbs' },
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'main':
				context.name = this._name;
				context.filterRandomized = this._filterRandomized;
				context.filterAnimated = this._filterAnimated;
				if (this._displayMacro) context.macro = this._genMacro();
				break;
			case 'footer':
				if (!this._displayMacro) {
					context.buttons = [
						{ type: 'button', icon: 'fa-solid fa-floppy-disk', label: game.i18n.localize('TMFX.save'), action: 'save' },
					];
				} else context.buttons = [];
				break;
		}
		return context;
	}

	_genMacro() {
		return `const params = ${JSON.stringify(this._prepareParams(), null, 2)};\n\nawait TokenMagic.addUpdateFiltersOnSelected(params);`;
	}

	/**
	 * Process form data
	 */
	static async _onSubmit(event, form, formData) {
		const { name, filterRandomized, filterAnimated } = foundry.utils.expandObject(formData.object);

		this._name = name;
		this._filterRandomized = filterRandomized;
		this._filterAnimated = filterAnimated;

		if (this._displayMacro) this.element.querySelector('textarea').value = this._genMacro();
	}

	static async _onSave(event) {
		const name = this._name;
		const library = this._document.documentName === 'MeasuredTemplate' ? PresetsLibrary.TEMPLATE : PresetsLibrary.MAIN;
		const params = this._prepareParams();

		const preset = TokenMagic.getPreset({ name, library });
		if (preset) {
			const overwrite = await foundry.applications.api.DialogV2.confirm({
				window: { title: 'TMFX.app.savePreset.confirm.title' },
				content: `<p style="color: red;"><strong>${game.i18n.localize('TMFX.app.savePreset.confirm.message')}</strong></p>`,
			});
			if (!overwrite) return;
			await TokenMagic.deletePreset({ name, library }, true);
		}

		await TokenMagic.addPreset({ name, library }, params);
		this.close(true);
	}
}

function getCloneFilterParams(document) {
	const filters = deepClone(document.getFlag('tokenmagic', 'filters'));
	if (!filters?.length) return null;

	const params = filters.map((f) => f.tmFilters.tmParams);
	params.forEach((param) => {
		['updateId', 'placeableId', 'filterInternalId', 'filterOwner', 'placeableType'].forEach((k) => {
			delete param[k];
		});
	});

	return params;
}
