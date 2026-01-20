import { PlaceableType } from '../../module/constants.js';
import { ANIM_PARAM_CONTROLS, FILTER_PARAM_CONTROLS } from './data/fxControls.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { deepClone, getType, isEmpty, mergeObject } = foundry.utils;

// TODO
// - prettify
// - filterId editing of some kind?
// - certain params such as active/enabled/filterId are common between all filters/animates, bake them into hbs files

export function filterEditor(placeable) {
	try {
		const placeables = placeable ? [placeable] : TokenMagic.getControlledPlaceables();
		if (placeables.length) new FilterSelector(placeables[0].document ?? placeables[0]).render(true);
	} catch (e) {}
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

	static getFilter(document, { filterId, filterType } = {}) {
		const filters = document.getFlag('tokenmagic', 'filters');
		return filters?.find((f) => f.tmFilters.tmFilterId === filterId && f.tmFilters.tmFilterType === filterType)
			?.tmFilters.tmParams;
	}

	/** @override */
	async _prepareContext(options) {
		let filters = this._document.getFlag('tokenmagic', 'filters') ?? [];
		filters = filters
			.map((filter) => {
				const { filterId, filterType, rank, enabled } = filter.tmFilters.tmParams;
				return {
					filterId,
					filterType,
					label: filterId,
					rank,
					thumbnail: 'modules/tokenmagic/gui/macros/images/19 - T01 - Fire.webp',
					enabled,
				};
			})
			.sort((f1, f2) => f1.rank - f2.rank);
		this._filterCount = filters.length;

		return { filters };
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
		const { filterId, filterType } = event.target.closest('.filter').dataset;
		const dragData = {
			filterId,
			filterType,
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
		if (!data.filterId || !data.filterType) return;
		if (this._document.id !== data.placeableId && this._document.parent.id !== data.sceneId) return;

		const { filterId, filterType } = event.target.closest('.filter').dataset;
		if (data.filterId === filterId && data.filterType === filterType) return;

		return this._onUpdateFilterRank(data, { filterId, filterType });
	}

	async _onAddFilter({ filterId, filterType, placeableId, documentName, sceneId } = {}) {
		const scene = game.scenes.get(sceneId);
		const document = scene?.getEmbeddedDocument(documentName, placeableId);
		if (!document) return;

		const filter = deepClone(FilterSelector.getFilter(document, { filterId, filterType }));
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
				rank: toParams.rank,
			},
			{
				filterId: toParams.filterId,
				filterType: toParams.filterType,
				rank: fromParams.rank,
			},
		]);
		this.render(true);
	}

	async _closeChildApps() {}

	static async _onEdit(event) {
		try {
			const filterEl = event.target.closest('.filter');
			const { filterId, filterType } = filterEl.dataset;
			const appId = `tmfx-filter-editor-${this._document.id}-${filterId}-${filterType}`;
			const activeInstance = foundry.applications.instances.get(appId);
			if (activeInstance) activeInstance.close();
			else {
				const { left, bottom } = filterEl.getBoundingClientRect();
				new FilterEditor(
					{ document: this._document, filterId, filterType },
					{ id: appId, position: { left, top: bottom } },
				).render(true);
			}
		} catch (e) {
			console.log(e);
		}
	}

	static async _onDelete(event) {
		const { filterId, filterType } = event.target.closest('.filter').dataset;
		if (filterId && filterType) {
			await TokenMagic.deleteFilters(this._document, filterId, filterType);

			const appId = `tmfx-filter-editor-${this._document.id}-${filterId}-${filterType}`;
			const activeInstance = foundry.applications.instances.get(appId);
			if (activeInstance) activeInstance.close();
		}
	}

	static async _onToggle(event) {
		const { filterId, filterType } = event.target.closest('.filter').dataset;
		await TokenMagic.updateFiltersByPlaceable(this._document, [
			{ filterId, filterType, enabled: !event.target.closest('.toggle').classList.contains('active') },
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

				if ('-=filters' in tm || tm.filters?.length !== this._filterCount) {
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
	constructor({ document, filterId, filterType } = {}, options) {
		super(options);
		this._document = document;
		this._filterId = filterId;
		this._filterType = filterType;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: '',
		tag: 'form',
		window: {
			title: 'Filter',
			contentClasses: ['standard-form'],
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
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				context.title = this._filterType.charAt(0).toUpperCase() + this._filterType.slice(1);
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
			controls.push(control);
			this._paramControls[param] = control;
		}
		controls.sort((c1, c2) => (c1.order ?? 0) - (c2.order ?? 0));

		return Object.assign(context, { controls, filterId: this._filterId });
	}

	_readParams() {
		this._params = deepClone(
			FilterSelector.getFilter(this._document, { filterId: this._filterId, filterType: this._filterType }),
		);
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
		let control = FILTER_PARAM_CONTROLS[this._filterType]?.[param] ?? FILTER_PARAM_CONTROLS.common[param];
		// If a predefined control does not exist lets deduce a generic one from the value
		if (!control) {
			const type = getType(value);
			if (type === 'string') control = { type: 'text' };
			else if (type === 'number') control = { type: 'number' };
			else if (type === 'boolean') control = { type: 'boolean' };
			else throw Error(`Unable to determine param (${param}) control type.`);
		} else control = deepClone(control);

		if (control.type === 'range' || control.type === 'number' || control.type === 'color') {
			if (!('animatable' in control)) control.animatable = true;
			if (!isEmpty(this._animated[param]) && this._animated[param].active) control.animated = true;
		}

		control.name = param;
		if (control.type === 'color') control.value = new Color(value).toString();
		else control.value = value;

		control[control.type] = true;
		control.label = param.charAt(0).toUpperCase() + param.slice(1);

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

		params.filterId = this._filterId;
		params.filterType = this._filterType;
		await TokenMagic.updateFiltersByPlaceable(this._document, [params]);
	}

	static async _onAnimate(event) {
		const param = event.target.closest('a').dataset.param;
		const appId = `tmfx-animation-editor-${this._document.id}-${this._filterId}-${this._filterType}-${param}`;
		const activeInstance = foundry.applications.instances.get(appId);
		if (activeInstance) activeInstance.close();
		else {
			const formGroupEl = event.target.closest('.form-group');
			const { left, bottom } = formGroupEl.getBoundingClientRect();
			new AnimationEditor(
				{
					document: this._document,
					filterId: this._filterId,
					filterType: this._filterType,
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

	constructor({ document, filterId, filterType, param, control, parentApp } = {}, options) {
		super(options);
		this._document = document;
		this._filterId = filterId;
		this._filterType = filterType;
		this._param = param;
		this._control = control;
		this._parentApp = parentApp;
		this._initAnimParams();
	}

	_initAnimParams() {
		const tmParams = FilterSelector.getFilter(this._document, {
			filterId: this._filterId,
			filterType: this._filterType,
		});
		this._renderParent = !Boolean(tmParams.animated?.[this._param]);
		this._animParams = mergeObject(
			{
				animType: this._control.type === 'color' ? 'colorOscillation' : 'move',
				val1: tmParams[this._param],
				val2: tmParams[this._param],
				active: true,
				speed: 0.0000025,
				loopDuration: 3000,
				loops: 0,
				wantInteger: false,
				chaosFactor: 0.25,
				syncShift: 0,
				clockwise: true,
			},
			tmParams.animated?.[this._param] ?? {},
		);
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
				context.title = this._param.charAt(0).toUpperCase() + this._param.slice(1);
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
			animOptions[k] = (k.charAt(0).toUpperCase() + k.slice(1)).match(/[A-Z][a-z]+/g).join(' ');
		});

		const controls = [
			{
				type: 'select',
				select: true,
				name: 'animType',
				label: 'AnimType',
				options: animOptions,
				value: this._animParams.animType,
				order: 0,
			},
		];
		keyControls[this._animParams.animType].forEach((param) => {
			let control;
			if (param === 'val1' || param === 'val2') {
				control = { ...this._control, order: 1 };
				delete control.animatable;
				delete control.animated;
			} else {
				control = deepClone(ANIM_PARAM_CONTROLS[param]);
			}

			if (control.type === 'color') control.value = new Color(this._animParams[param]).toString();
			else control.value = this._animParams[param];

			control.label = param.charAt(0).toUpperCase() + param.slice(1);
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

		if (params.active !== this._animParams.active) this._renderParent = true;

		const render = params.animType !== this._animParams.animType;
		mergeObject(this._animParams, params);
		if (render) {
			await this.render({ parts: ['animate'] });
			this._onSubmitForm(this.options.form, event);
			return;
		}

		await TokenMagic.updateFiltersByPlaceable(this._document, [
			{ filterId: this._filterId, filterType: this._filterType, animated: { [this._param]: params } },
		]);

		if (this._renderParent && this._parentApp.state === ApplicationV2.RENDER_STATES.RENDERED) {
			if (FilterSelector.getFilter(this._document, { filterId: this._filterId, filterType: this._filterType }))
				this._parentApp.render({ parts: ['filter'] });
		}
	}
}
