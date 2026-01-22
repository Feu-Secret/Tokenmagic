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

export function filterEditor(placeable) {
	try {
		const placeables = placeable ? [placeable] : TokenMagic.getControlledPlaceables();
		if (placeables.length) new FilterSelector(placeables[0].document ?? placeables[0]).render(true);
	} catch (e) {}
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
	constructor(document) {
		super({
			id: `tmfx-filter-selector-${document.id}`,
			window: { title: `TokenMagicFX Filters [${document.documentName}]` },
		});
		this._document = document;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		window: { resizable: true },
		classes: ['tokenmagic', 'selector', 'flexcol'],
		actions: {
			edit: FilterSelector._onEdit,
			delete: FilterSelector._onDelete,
			toggle: FilterSelector._onToggle,
		},
		position: {
			width: 300,
			height: 450,
		},
	};

	/** @override */
	static PARTS = {
		main: {
			template: `modules/tokenmagic/templates/apps/filter-editor/selector.hbs`,
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
	async _prepareContext(options) {
		this._filters = (this._document.getFlag('tokenmagic', 'filters') ?? [])
			.map((filter) => {
				const { filterId, filterType, rank, enabled, filterInternalId } = filter.tmFilters.tmParams;
				return {
					filterId,
					filterType,
					filterInternalId,
					label: filterId,
					rank,
					thumbnail: FILTER_PARAM_CONTROLS[filterType]?._thumb ?? FILTER_PARAM_CONTROLS.common._thumb,
					enabled,
				};
			})
			.sort((f1, f2) => f1.rank - f2.rank);

		return { filters: this._filters };
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
		if (this._document.id !== data.placeableId || this._document.parent.id !== data.sceneId) {
			return this._onAddFilter(data);
		}
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
					this.render(true);
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
			title: 'Filter',
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

		if (control.type === 'range' || control.type === 'number' || control.type === 'color') {
			if (!('animatable' in control)) control.animatable = true;
			const animated = this._animated[param];
			if (animated && (animated.active || !('active' in animated))) control.animated = true;
		}

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
			title: 'Animate',
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
				control = { ...this._control, order: 1, animatable: false, animated: false, label: null };
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
