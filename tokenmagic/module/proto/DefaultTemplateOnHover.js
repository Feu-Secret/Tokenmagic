class DefaultTemplateOnHover {
	constructor() {
		this._origRefresh = null;
	}

	configure(enabled = false) {
		if (!enabled) {
			// Restore original function when setting toggled off
			if (this._origRefresh !== null) {
				MeasuredTemplate.prototype.refresh = this._origRefresh;
				this._origRefresh = null;
			}
			return;
		}
		this._origRefresh = MeasuredTemplate.prototype.refresh;
		MeasuredTemplate.prototype.refresh = this.refreshFn();
	}

	refreshFn() {
		const self = this;
		return function () {
			if (game.settings.get('tokenmagic', 'defaultTemplateOnHover')) {
				const hl = canvas.grid.getHighlightLayer(`Template.${this.id}`);
				if (this.texture && this.texture !== '') {
					hl.renderable = this._hover;
				} else {
					hl.renderable = true;
				}
			}
			self._origRefresh.apply(this);
		};
	}
}

export const defaultTemplateOnHover = new DefaultTemplateOnHover();