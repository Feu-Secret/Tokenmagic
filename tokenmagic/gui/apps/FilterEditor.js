import { UI_CONTROLS } from './data/fxControls';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { deepClone, getType, isEmpty, mergeObject } = foundry.utils;

// TODO
// - prettify
// - val1, val2 change controls between range, number, color depending on the param
// - add activate/de-activate to selector (turn effect entry grayish if not active)

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
				const { filterId, filterInternalId, filterType, rank } = filter.tmFilters.tmParams;
				return {
					id: filterId,
					type: filterType,
					label: filterType.charAt(0).toUpperCase() + filterType.slice(1),
					rank,
					thumbnail: 'modules/tokenmagic/gui/macros/images/19 - T01 - Fire.webp',
				};
			})
			.sort((f1, f2) => f1.rank - f2.rank);

		return { filters };
	}

	static async _onEdit(event) {
		console.log(event.target.closest('.filter').dataset);
		const { id, type } = event.target.closest('.filter').dataset;

		try {
			new FilterEditor(this._placeable, id, type).render(true);
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
}

class FilterEditor extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor(placeable, filterId, filterType) {
		super({ id: `tmfx-filter-editor-${placeable.id}-${filterId}-${filterType}` });
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
			template: `modules/tokenmagic/templates/apps/filter-editor/editor-header.hbs`,
		},
		content: {
			template: `modules/tokenmagic/templates/apps/filter-editor/editor-content.hbs`,
		},
		footer: { template: 'templates/generic/form-footer.hbs' },
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				context.title = this._filterType.charAt(0).toUpperCase() + this._filterType.slice(1);
				break;
			case 'content':
				await this._prepareContentContext(context, options);
				break;
			case 'footer':
				// context.buttons = [
				// 	{ type: 'button', icon: 'fa-solid fa-floppy-disk', label: 'SETTINGS.Save', action: 'save' },
				// 	{ type: 'button', icon: 'fa-solid fa-floppy-disk', label: 'CONTROLS.CommonDelete', action: 'delete' },
				// ];
				break;
		}
		return context;
	}

	async _prepareContentContext(context, options) {
		this._readParams();
		// Cache partials
		await foundry.applications.handlebars.getTemplate(
			`modules/tokenmagic/templates/apps/filter-editor/control.hbs`,
			'tmfx-control',
		);

		this._paramToControl = {};
		const controls = [];
		for (const [param, value] of Object.entries(this._params)) {
			const control = this.#genControl(param, value);
			controls.push(control);
			this._paramToControl[param] = control;
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
		].forEach((param) => delete this._params[param]);
	}

	#genControl(param, value) {
		let control = UI_CONTROLS[this._filterType]?.[param] ?? UI_CONTROLS.common[param];
		// If a predefined control does not exist lets deduce a generic one from the value
		if (!control) {
			const type = getType(value);
			if (type === 'string') control = { type: 'text' };
			else if (type === 'number') control = { type: 'number' };
			else throw Error(`Unable to determine param (${param}) control type.`);
		} else control = deepClone(control);

		if (control.type === 'range' || control.type === 'number') {
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

	/** @override */
	_attachPartListeners(partId, element, options) {
		super._attachPartListeners(partId, element, options);
		// switch (partId) {
		// 	case 'header':
		// 		element.querySelector('input[type="search"]').addEventListener('input', this._onSearch.bind(this));
		// 		break;
		// }
	}

	/**
	 * Process form data
	 */
	static async _onSubmit(event, form, formData) {
		const params = foundry.utils.expandObject(formData.object);
		for (const [param, value] of Object.entries(params)) {
			const control = this._paramToControl[param];
			if (control.type === 'color' && control.subtype === 'numeric') params[param] = Number(Color.fromString(value));
		}

		params.filterId = this._filterId;
		params.filterType = this._filterType;
		await TokenMagic.updateFiltersByPlaceable(this._placeable, [params]);
	}

	static async _onAnimate(event) {
		const param = event.target.closest('a').dataset.param;
		this._readParams();

		new AnimationEditor({
			placeable: this._placeable,
			filterId: this._filterId,
			filterType: this._filterType,
			param,
			control: this._paramToControl[param],
			animParams: this._animated[param],
			parentApp: this,
		}).render(true);
	}
}

class AnimationEditor extends HandlebarsApplicationMixin(ApplicationV2) {
	standardControls = ['active', 'loopDuration', 'val1', 'val2', 'loops', 'syncShift'];

	keywordToControls = {
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

	CONTROLS = {
		active: { type: 'boolean', value: true },
		speed: { type: 'number', value: 0.0000025 },
		loopDuration: { type: 'range', min: 0, max: 60000, step: 10, value: 3000 },
		loops: { type: 'number', step: 1, min: 0, value: 0 },
		wantInteger: { type: 'boolean', value: false },
		chaosFactor: { type: 'range', min: 0, max: 1, step: 0.01, value: 0.25 },
		syncShift: { type: 'range', min: 0, max: 1, step: 0.01, value: 0 },
		val1: { type: 'number', value: 0 },
		val2: { type: 'number', value: 0 },
		clockwise: { type: 'boolean', value: true },
	};

	constructor({ placeable, filterId, filterType, param, control, animParams, parentApp } = {}) {
		super({ id: `tmfx-animation-editor-${placeable.id}-${filterId}-${filterType}-${param}` });
		this._placeable = placeable;
		this._filterId = filterId;
		this._filterType = filterType;
		this._param = param;
		this._control = control;
		this._animParams = deepClone(animParams) ?? this._getDefaultParams('move');
		this._parentApp = parentApp;
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
			template: `modules/tokenmagic/templates/apps/filter-editor/editor-header.hbs`,
		},
		content: {
			template: `modules/tokenmagic/templates/apps/filter-editor/animate.hbs`,
		},
		footer: { template: 'templates/generic/form-footer.hbs' },
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'header':
				context.title = this._param.charAt(0).toUpperCase() + this._param.slice(1);
				break;
			case 'content':
				await this._prepareContentContext(context, options);
				break;
			case 'footer':
				// context.buttons = [
				// 	{ type: 'button', icon: 'fa-solid fa-floppy-disk', label: 'CONTROLS.CommonDelete', action: 'delete' },
				// ];
				break;
		}
		return context;
	}

	_getDefaultParams(animType) {
		const params = { animType };
		this.keywordToControls[animType].forEach((c) => {
			params[c] = this.CONTROLS[c].value;
		});
		return params;
	}

	async _prepareContentContext(context, options) {
		// Cache partials
		await foundry.applications.handlebars.getTemplate(
			`modules/tokenmagic/templates/apps/filter-editor/control.hbs`,
			'tmfx-control',
		);

		const animOptions = {};
		Object.keys(this.keywordToControls).forEach((k) => {
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
		this.keywordToControls[this._animParams.animType].forEach((param) => {
			const control = deepClone(this.CONTROLS[param]);
			if (param in this._animParams) control.value = this._animParams[param];
			else control.value = this.CONTROLS[param].value;
			control.label = param.charAt(0).toUpperCase() + param.slice(1);
			control.name = param;
			control[control.type] = true;
			controls.push(control);
		});

		context.controls = controls;
		return context;
	}

	/** @override */
	_attachPartListeners(partId, element, options) {
		super._attachPartListeners(partId, element, options);
		// switch (partId) {
		// 	case 'header':
		// 		element.querySelector('input[type="search"]').addEventListener('input', this._onSearch.bind(this));
		// 		break;
		// }
	}

	/**
	 * Process form data
	 */
	static async _onSubmit(event, form, formData) {
		const params = foundry.utils.expandObject(formData.object);
		if ('loops' in params && !params.loops) params.loops = null;

		let renderParent = false;
		if (params.active !== this._animParams.active) renderParent = true;

		const render = params.animType !== this._animParams.animType;
		mergeObject(this._animParams, params);
		if (render) {
			await this.render({ parts: ['content'] });
			this._onSubmitForm(this.options.form, event);
			return;
		}

		await TokenMagic.updateFiltersByPlaceable(this._placeable, [
			{ filterId: this._filterId, filterType: this._filterType, animated: { [this._param]: params } },
		]);

		if (renderParent && this._parentApp.state === ApplicationV2.RENDER_STATES.RENDERED) {
			this._parentApp.render({ parts: ['content'] });
		}
	}
}
