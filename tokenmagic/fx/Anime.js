import { isAnimationDisabled } from '../module/tokenmagic.js';

export class Anime {
	constructor(puppet) {
		const self = this;
		this.puppet = puppet;
		this.animated = null;
		this.animeId = randomID();

		// Time/synchronization related variables
		this.frameTime = {};
		this.elapsedTime = {};
		this.loopElapsedTime = {};
		this.loops = {};
		this.internalLoops = {};
		this.ping = {};
		this.pauseBetweenElapsedTime = {};
		this.pauseBetween = {};
		this.shutdown = {};

		if (!(this.puppet == null)) {
			if (
				this.puppet.hasOwnProperty('animated') &&
				!(this.puppet.animated == null) &&
				typeof this.puppet.animated === 'object' &&
				Object.keys(this.puppet.animated).length > 0
			) {
				this.initAnimatedInternals(this.puppet.animated);
				this.animated = this.puppet.animated; // easy access to the puppet's animodes
			}
			Anime.addAnimation(self); // ready to tick
		}
	}

	static rgbToValue(r, g, b) {
		return (r << 16) | (g << 8) | b;
	}

	static valueToRgb(bin) {
		const r = bin >> 16;
		const g = (bin >> 8) & 0xff;
		const b = bin & 0xff;
		return [r, g, b];
	}

	static oscillation(elapsed, loopDuration, syncShift, val1, val2, func, isSync, xpi = Anime.twoPi) {
		return (
			((val1 - val2) *
				(func(
					xpi * (isSync ? Anime.getSynchronizedTime(loopDuration, syncShift) : elapsed / loopDuration + syncShift)
				) +
					1)) /
				2 +
			val2
		);
	}

	static colOscillation(elapsed, loopDuration, syncShift, val1, val2, isSync, xpi = Anime.twoPi) {
		const rgbValue1 = Anime.valueToRgb(val1);
		const rgbValue2 = Anime.valueToRgb(val2);

		return Anime.rgbToValue(
			Math.floor(
				Anime.oscillation(elapsed, loopDuration, syncShift, rgbValue1[0], rgbValue2[0], Math.cos, isSync, xpi)
			),
			Math.floor(
				Anime.oscillation(elapsed, loopDuration, syncShift, rgbValue1[1], rgbValue2[1], Math.cos, isSync, xpi)
			),
			Math.floor(Anime.oscillation(elapsed, loopDuration, syncShift, rgbValue1[2], rgbValue2[2], Math.cos, isSync, xpi))
		);
	}

	static getSynchronizedTime(loopDuration, syncShift) {
		return Anime._lastTime / loopDuration + syncShift;
	}

	static getSynchronizedRotation(loopDuration, syncShift) {
		return (360 * ((Anime._lastTime + syncShift) % loopDuration)) / loopDuration;
	}

	static getPuppetsByParams(params) {
		let puppetArray = [];
		Anime._animeMap.forEach((anime, id) => {
			if (
				anime.puppet.placeableId === params.placeableId &&
				anime.puppet.filterId === params.filterId &&
				(!anime.puppet.hasOwnProperty('filterInternalId') || anime.puppet.filterInternalId === params.filterInternalId)
			) {
				puppetArray.push(anime.puppet);
			}
		});
		return puppetArray;
	}

	static addAnimation(anime) {
		Anime._animeMap.set(anime.animeId, anime);
		Anime._resumeAnimation();
	}

	static removeAnimation(placeableId) {
		Anime._animeMap.forEach((anime, id) => {
			if (anime.puppet.placeableId === placeableId) {
				Anime._animeMap.delete(id);
			}
		});
		if (Anime._animeMap.size === 0) {
			Anime._suspendAnimation();
		}
	}

	static removeAnimationByFilterId(placeableId, filterId) {
		Anime._animeMap.forEach((anime, id) => {
			if (anime.puppet.placeableId === placeableId && anime.puppet.filterId === filterId) {
				Anime._animeMap.delete(id);
			}
		});
		if (Anime._animeMap.size === 0) {
			Anime._suspendAnimation();
		}
	}

	static resetAnimation() {
		Anime._animeMap = new Map();
		Anime._suspended = true;
	}

	static tick() {
		Anime._lastTime = canvas.app.ticker.lastTime;
		Anime._frameTime = Anime._lastTime - Anime._prevTime;

		for (const [id, anime] of Anime._animeMap) {
			if (anime.puppet.enabled) {
				if (anime.puppet.hasOwnProperty('preComputation') && anime.puppet.placeableImg != null) {
					anime.puppet.preComputation();
				}
				if (anime.puppet.hasOwnProperty('animated') && !(anime.puppet.animated == null)) {
					anime.animate(Anime._frameTime);
				}
			}
		}

		Anime._prevTime = Anime._lastTime;
	}

	static _suspendAnimation() {
		if (Anime._activated && !Anime._suspended && !isAnimationDisabled()) {
			Anime._detachFromTicker();
		}
		Anime._suspended = true;
	}

	static _resumeAnimation() {
		if (Anime._activated && Anime._suspended && !isAnimationDisabled()) {
			Anime._attachToTicker();
		}
		Anime._suspended = false;
	}

	static activateAnimation() {
		if (!Anime._activated && !Anime._suspended && !isAnimationDisabled()) {
			Anime._attachToTicker();
		}
		Anime._activated = true;
	}

	static deactivateAnimation() {
		if (Anime._activated && !Anime._suspended && !isAnimationDisabled()) {
			Anime._detachFromTicker();
		}
		Anime._activated = false;
	}

	static _attachToTicker() {
		canvas.app.ticker.add(Anime.tick, this, PIXI.UPDATE_PRIORITY.LOW + 1);
		Anime._lastTime = canvas.app.ticker.lastTime;
		Anime._prevTime = Anime._lastTime;
	}

	static _detachFromTicker() {
		canvas.app.ticker.remove(Anime.tick, this);
		Anime._lastTime = 0;
		Anime._prevTime = 0;
	}

	static getAnimeMap() {
		return Anime._animeMap;
	}

	initAnimatedInternals(animated) {
		Object.keys(animated).forEach((effect) => {
			// Internals init
			this.initInternals(effect);
		});
	}

	initInternals(effect) {
		this.elapsedTime[effect] = 0;
		this.loopElapsedTime[effect] = 0;
		this.pauseBetweenElapsedTime[effect] = 0;
		this.loops[effect] = 0;
		this.internalLoops[effect] = 0;
		this.frameTime[effect] = 0;
		this.pauseBetween[effect] = false;
		this.ping[effect] = false;
		this.shutdown[effect] = false;
	}

	hasInternals(effect) {
		return this.elapsedTime.hasOwnProperty(effect);
	}

	animate(frameTime) {
		for (const effect of Object.keys(this.puppet.animated)) {
			if (this.animated[effect].active && this.cycleCheck(effect, frameTime)) {
				if (this[this.animated[effect].animType] != null) {
					this[this.animated[effect].animType](effect);
				}
				if (this.shutdown[effect]) {
					this.animated[effect].active = false;
					this.shutdown[effect] = false;

					// persists the value of an effect which is terminated.
					this.persistTerminatedEffect(effect);
				} else {
					this.loopElapsedTime[effect] += frameTime;
					this.elapsedTime[effect] += frameTime;
				}
			}
		}
		this.autoDisableCheck();
	}

	cycleCheck(effect, frameTime) {
		this.frameTime[effect] = frameTime;

		if (this.isPauseBetweenLoop(effect, frameTime)) {
			return false;
		}

		if (this.loopElapsedTime[effect] > this.animated[effect].loopDuration) {
			this.loopElapsedTime[effect] -= this.animated[effect].loopDuration;
			this.ping[effect] = true;

			if (this.animated[effect].loops !== Infinity) {
				this.loops[effect]++;
				this.internalLoops[effect]++;
			}

			if (this.loops[effect] >= this.animated[effect].loops) {
				// correction to stop exactly on the target value when the last loop end.
				this.elapsedTime[effect] = this.internalLoops[effect] * this.animated[effect].loopDuration;
				this.loops[effect] = 0;
				this.loopElapsedTime[effect] = 0;
				this.shutdown[effect] = true;
			} else if (this.animated[effect].pauseBetweenDuration > 0) {
				this.elapsedTime[effect] = this.animated[effect].loopDuration;
				this.pauseBetween[effect] = true;
			}
		}
		return true;
	}

	async persistTerminatedEffect(effect) {
		if (!(this.puppet.filterOwner === game.data.userId)) {
			return;
		}

		let animeInfo;
		let doInit = true;
		let flag = this.puppet.targetPlaceable.document.getFlag('tokenmagic', 'animeInfo');

		if (flag) {
			// fastest than array.find
			for (const animeinfo of flag.values()) {
				if (
					animeinfo.tmFilterId === this.puppet.filterId &&
					animeinfo.tmFilterInternalId === this.puppet.filterInternalId &&
					animeinfo.tmFilterEffect === effect
				) {
					if (animeinfo && animeinfo instanceof Object) {
						animeinfo.tmFilterEffectValue = this.puppet[effect];
						doInit = false;
						break;
					}
				}
			}
		}

		if (doInit) {
			animeInfo = [
				{
					tmFilterId: this.puppet.filterId,
					tmFilterInternalId: this.puppet.filterInternalId,
					tmFilterEffect: effect,
					tmFilterEffectValue: this.puppet[effect],
				},
			];

			if (flag) flag = flag.concat(animeInfo);
			else flag = animeInfo;
		}

		flag = duplicate(flag);
		await this.puppet.targetPlaceable._TMFXsetAnimeFlag(flag);
	}

	autoDisableCheck() {
		if (!(this.puppet.autoDisable || this.puppet.autoDestroy)) {
			return;
		}
		if (!(this.puppet.filterOwner === game.data.userId)) {
			return;
		}
		if (this.puppet.enabled === false && !this.puppet.autoDestroy) {
			return;
		}

		if (Object.values(this.animated).every((animeEffect) => animeEffect.active === false)) {
			this.disableOrDestroy();
		}
	}

	async disableOrDestroy() {
		if (this.puppet == null) return;
		const placeable = this.puppet.targetPlaceable;
		if (placeable == null) return;

		if (this.puppet.autoDestroy) {
			await window.TokenMagic.deleteFilters(placeable, this.puppet.filterId);
		} else {
			let params = {};
			params.filterType = this.puppet.filterType;
			params.filterId = this.puppet.filterId;
			params.enabled = false;
			await window.TokenMagic.updateFiltersByPlaceable(placeable, [params]);
		}
	}

	isPauseBetweenLoop(effect, frametime) {
		if (this.pauseBetween[effect] && this.animated[effect].pauseBetweenDuration > 0) {
			this.pauseBetweenElapsedTime[effect] += frametime;
			if (this.pauseBetweenElapsedTime[effect] < this.animated[effect].pauseBetweenDuration) {
				return true;
			} else {
				this.pauseBetweenElapsedTime[effect] = 0;
				return (this.pauseBetween[effect] = false);
			}
		}
		return false;
	}

	pauseBetweenCheck(effect, frametime) {
		if (this.pauseStart[effect] && this.animated[effect].pauseStartDuration > 0) {
			this.pauseStartElapsedTime[effect] += frametime;
			if (this.pauseStartElapsedTime[effect] < this.animated[effect].pauseStartDuration) {
				return false;
			} else {
				this.pauseStart[effect] = false;
				return true;
			}
		}
	}

	moveToward(effect) {
		this.puppet[effect] =
			((this.animated[effect].val1 - this.animated[effect].val2) / this.animated[effect].loopDuration) *
			this.elapsedTime[effect];
	}

	colorOscillation(effect) {
		this.puppet[effect] = Anime.colOscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			false
		);
	}

	halfColorOscillation(effect) {
		this.puppet[effect] = Anime.colOscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			false,
			Math.PI
		);
	}

	syncColorOscillation(effect) {
		this.puppet[effect] = Anime.colOscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			true
		);
	}

	cosOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.cos,
			false
		);
	}

	halfCosOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.cos,
			false,
			Math.PI
		);
	}

	sinOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.sin,
			false
		);
	}

	halfSinOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.sin,
			false,
			Math.PI
		);
	}

	chaoticOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift + Math.random() * this.animated[effect].chaosFactor,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.cos,
			false
		);
	}

	syncCosOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.cos,
			true
		);
	}

	syncSinOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.sin,
			true
		);
	}

	syncChaoticOscillation(effect) {
		this.puppet[effect] = Anime.oscillation(
			this.elapsedTime[effect],
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift + Math.random() * this.animated[effect].chaosFactor,
			this.animated[effect].val1,
			this.animated[effect].val2,
			Math.cos,
			true
		);
	}

	rotation(effect) {
		const computedRotation = (360 * this.elapsedTime[effect]) / this.animated[effect].loopDuration;
		this.puppet[effect] = this.animated[effect].clockWise ? computedRotation : 360 - computedRotation;
	}

	syncRotation(effect) {
		const computedRotation = Anime.getSynchronizedRotation(
			this.animated[effect].loopDuration,
			this.animated[effect].syncShift
		);
		this.puppet[effect] = this.animated[effect].clockWise ? computedRotation : 360 - computedRotation;
	}

	randomNumber(effect) {
		const randomNumber =
			Math.random() * (this.animated[effect].val2 - this.animated[effect].val1) + this.animated[effect].val1;
		if (this.animated[effect].wantInteger) {
			this.puppet[effect] = Math.floor(randomNumber);
		} else {
			this.puppet[effect] = randomNumber;
		}
	}

	randomNumberPerLoop(effect) {
		if (this._ringing(effect)) {
			this.randomNumber(effect);
		}
	}

	randomColor(effect) {
		this.puppet[effect] = Math.floor(Math.random() * 16777215);
	}

	randomColorPerLoop(effect) {
		if (this._ringing(effect)) {
			this.randomColor(effect);
		}
	}

	move(effect) {
		this.puppet[effect] += this.animated[effect].speed * this.frameTime[effect];
	}

	_ringing(effect) {
		if (this.ping[effect]) {
			this.ping[effect] = false;
			return true;
		}
		return false;
	}
}

Anime._lastTime = 0;
Anime._prevTime = 0;
Anime._frameTime = 0;
Anime._animeMap = new Map();
Anime.twoPi = Math.PI * 2;
Anime._activated = false;
Anime._suspended = true;
