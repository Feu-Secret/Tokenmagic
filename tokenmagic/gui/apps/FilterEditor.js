import { ANIM_PARAM_CONTROLS, FILTER_PARAM_CONTROLS } from './data/fxControls.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { deepClone, getType, isEmpty, mergeObject } = foundry.utils;

// TODO
// - prettify
// - add activate/de-activate to selector (turn effect entry grayish if not active)
// - filterId editing of some kind?
// - certain params such as active/enabled/filterId are common between all filters/animates, bake them into hbs files

export function filterEditor() {
	try {
		const placeables = TokenMagic.getControlledPlaceables();
		if (placeables.length) new FilterSelector(placeables[0]).render(true);
	} catch (e) {}
}

class FilterSelector extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor(placeable) {
		super({
			id: `tmfx-filter-selector-${placeable.id}`,
			window: { title: `TokenMagicFX Filters [${placeable.document.documentName}]` },
		});
		this._placeable = placeable;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		window: {},
		classes: ['tokenmagic', 'selector', 'flexcol'],
		actions: {
			edit: FilterSelector._onEdit,
			delete: FilterSelector._onDelete,
			toggle: FilterSelector._onToggle,
		},
		position: {
			width: 450,
			height: 450,
		},
	};

	/** @override */
	static PARTS = {
		main: {
			template: `modules/tokenmagic/templates/apps/filter-editor/selector.hbs`,
		},
	};

	/** @override */
	async _prepareContext(options) {
		let filters = this._placeable.document.getFlag('tokenmagic', 'filters') ?? [];
		filters = filters
			.map((filter) => {
				const { filterId, filterInternalId, filterType, rank, enabled } = filter.tmFilters.tmParams;
				return {
					id: filterId,
					type: filterType,
					label: filterType.charAt(0).toUpperCase() + filterType.slice(1),
					rank,
					thumbnail: 'modules/tokenmagic/gui/macros/images/19 - T01 - Fire.webp',
					enabled,
				};
			})
			.sort((f1, f2) => f1.rank - f2.rank);

		return { filters };
	}

	static async _onEdit(event) {
		try {
			const filterEl = event.target.closest('.filter');
			const { id, type } = filterEl.dataset;
			const appId = `tmfx-filter-editor-${this._placeable.id}-${id}-${type}`;
			const activeInstance = foundry.applications.instances.get(appId);
			if (activeInstance) activeInstance.close();
			else {
				const { left, bottom, width } = filterEl.getBoundingClientRect();
				new FilterEditor(
					{ placeable: this._placeable, filterId: id, filterType: type },
					{ id: appId, position: { left, top: bottom, width } },
				).render(true);
			}
		} catch (e) {
			console.log(e);
		}
	}

	static async _onDelete(event) {
		const filterId = event.target.closest('.filter').dataset.id;
		if (filterId) {
			await TokenMagic.deleteFilters(this._placeable, filterId);
			this.render(true);
		}
	}

	static async _onToggle(event) {
		const { id, type } = event.target.closest('.filter').dataset;
		await TokenMagic.updateFiltersByPlaceable(this._placeable, [
			{ filterId: id, filterType: type, enabled: !event.target.closest('.toggle').classList.contains('active') },
		]);
		this.render(true);
	}
}

class FilterEditor extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor({ placeable, filterId, filterType } = {}, options) {
		super(options);
		this._placeable = placeable;
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
			width: 400,
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

		context.controls = controls;
		return context;
	}

	_readParams() {
		this._params = deepClone(
			this._placeable.document
				.getFlag('tokenmagic', 'filters')
				.find((f) => f.tmFilters.tmFilterId === this._filterId && f.tmFilters.tmFilterType === this._filterType)
				.tmFilters.tmParams,
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
			control.animatable = true;
			if (!isEmpty(this._animated[param]) && this._animated[param].active) control.animated = true;
		}

		control.name = param;
		if (control.type === 'color' && control.subtype === 'numeric') control.value = new Color(value).toString();
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
			if (control.type === 'color' && control.subtype === 'numeric') params[param] = Number(Color.fromString(value));
		}

		params.filterId = this._filterId;
		params.filterType = this._filterType;
		await TokenMagic.updateFiltersByPlaceable(this._placeable, [params]);
	}

	static async _onAnimate(event) {
		const param = event.target.closest('a').dataset.param;
		const appId = `tmfx-animation-editor-${this._placeable.id}-${this._filterId}-${this._filterType}-${param}`;
		const activeInstance = foundry.applications.instances.get(appId);
		if (activeInstance) activeInstance.close();
		else {
			const formGroupEl = event.target.closest('.form-group');
			const { left, bottom } = formGroupEl.getBoundingClientRect();
			new AnimationEditor(
				{
					placeable: this._placeable,
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
		colorOscillation: this.standardControls,
		syncColorOscillation: this.standardControls,
		halfCosOscillation: this.standardControls,
		halfColorOscillation: this.standardControls,
		rotation: ['active', 'loopDuration', 'loops', 'syncShift', 'clockwise'],
		syncRotation: ['active', 'loopDuration', 'loops', 'syncShift', 'clockwise'],
		randomNumber: ['active', 'val1', 'val2', 'wantInteger'],
		randomNumberPerLoop: ['active', 'val1', 'val2', 'loops', 'wantInteger'],
		randomColorPerLoop: ['active', 'loopDuration', 'loops'],
	};

	constructor({ placeable, filterId, filterType, param, control, parentApp } = {}, options) {
		super(options);
		this._placeable = placeable;
		this._filterId = filterId;
		this._filterType = filterType;
		this._param = param;
		this._control = control;
		this._parentApp = parentApp;
		this._initAnimParams();
	}

	_initAnimParams() {
		const tmParams = this._placeable.document
			.getFlag('tokenmagic', 'filters')
			.find((f) => f.tmFilters.tmFilterId === this._filterId && f.tmFilters.tmFilterType === this._filterType)
			.tmFilters.tmParams;
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

		const animOptions = {};
		Object.keys(this.keywordControls).forEach((k) => {
			animOptions[k] = k.charAt(0).toUpperCase() + k.slice(1);
		});

		const controls = [
			{
				type: 'select',
				select: true,
				name: 'animType',
				label: 'AnimType',
				options: animOptions,
				value: this._animParams.animType,
			},
		];
		this.keywordControls[this._animParams.animType].forEach((param) => {
			let control;
			if (param === 'val1' || param === 'val2') {
				control = { ...this._control };
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

		context.controls = controls;
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

		let renderParent = false;
		if (params.active !== this._animParams.active) renderParent = true;

		const render = params.animType !== this._animParams.animType;
		mergeObject(this._animParams, params);
		if (render) {
			await this.render({ parts: ['animate'] });
			this._onSubmitForm(this.options.form, event);
			return;
		}

		await TokenMagic.updateFiltersByPlaceable(this._placeable, [
			{ filterId: this._filterId, filterType: this._filterType, animated: { [this._param]: params } },
		]);

		if (renderParent && this._parentApp.state === ApplicationV2.RENDER_STATES.RENDERED) {
			this._parentApp.render({ parts: ['filter'] });
		}
	}
}
