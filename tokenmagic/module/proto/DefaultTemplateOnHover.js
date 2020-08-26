class DefaultTemplateOnHover {
	constructor() {
		this._origRefresh = null;
	}

	configure(enabled = false) {
		if (!enabled) {
			if (this._origRefresh !== null) {
				// Restoring the original function when setting toggled off is unsafe
				// in the case that there is another module patching the same function
				// and they're loaded after us, so resort to refresh here.
				/*
					MeasuredTemplate.prototype.refresh = this._origRefresh;
					this._origRefresh = null;
				*/
				window.location.reload();
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