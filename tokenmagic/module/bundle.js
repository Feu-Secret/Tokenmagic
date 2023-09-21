class e{constructor(t){this.puppet=t,this.animated=null,this.animeId=randomID(),// Time/synchronization related variables
this.frameTime={},this.elapsedTime={},this.loopElapsedTime={},this.loops={},this.internalLoops={},this.ping={},this.pauseBetweenElapsedTime={},this.pauseBetween={},this.shutdown={},null!=this.puppet&&(this.puppet.hasOwnProperty("animated")&&null!=this.puppet.animated&&"object"==typeof this.puppet.animated&&Object.keys(this.puppet.animated).length>0&&(this.initAnimatedInternals(this.puppet.animated),this.animated=this.puppet.animated),e.addAnimation(this))}static rgbToValue(e,t,i){return e<<16|t<<8|i}static valueToRgb(e){return[e>>16,e>>8&255,255&e]}static oscillation(t,i,a,r,s,o,l,n=e.twoPi){return(r-s)*(o(n*(l?e.getSynchronizedTime(i,a):t/i+a))+1)/2+s}static colOscillation(t,i,a,r,s,o,l=e.twoPi){let n=e.valueToRgb(r),c=e.valueToRgb(s);return e.rgbToValue(Math.floor(e.oscillation(t,i,a,n[0],c[0],Math.cos,o,l)),Math.floor(e.oscillation(t,i,a,n[1],c[1],Math.cos,o,l)),Math.floor(e.oscillation(t,i,a,n[2],c[2],Math.cos,o,l)))}static getSynchronizedTime(t,i){return e._lastTime/t+i}static getSynchronizedRotation(t,i){return 360*((e._lastTime+i)%t)/t}static getPuppetsByParams(t){let i=[];return e._animeMap.forEach((e,a)=>{e.puppet.placeableId!==t.placeableId||e.puppet.filterId!==t.filterId||e.puppet.hasOwnProperty("filterInternalId")&&e.puppet.filterInternalId!==t.filterInternalId||i.push(e.puppet)}),i}static addAnimation(t){e._animeMap.set(t.animeId,t),e._resumeAnimation()}static removeAnimation(t){e._animeMap.forEach((i,a)=>{i.puppet.placeableId===t&&e._animeMap.delete(a)}),0===e._animeMap.size&&e._suspendAnimation()}static removeAnimationByFilterId(t,i){e._animeMap.forEach((a,r)=>{a.puppet.placeableId===t&&a.puppet.filterId===i&&e._animeMap.delete(r)}),0===e._animeMap.size&&e._suspendAnimation()}static resetAnimation(){e._animeMap=new Map,e._suspended=!0}static tick(){for(let[t,i]of(e._lastTime=canvas.app.ticker.lastTime,e._frameTime=e._lastTime-e._prevTime,e._animeMap))i.puppet.enabled&&(i.puppet.hasOwnProperty("preComputation")&&null!=i.puppet.placeableImg&&i.puppet.preComputation(),i.puppet.hasOwnProperty("animated")&&null!=i.puppet.animated&&i.animate(e._frameTime));e._prevTime=e._lastTime}static _suspendAnimation(){!e._activated||e._suspended||tt()||e._detachFromTicker(),e._suspended=!0}static _resumeAnimation(){e._activated&&e._suspended&&!tt()&&e._attachToTicker(),e._suspended=!1}static activateAnimation(){e._activated||e._suspended||tt()||e._attachToTicker(),e._activated=!0}static deactivateAnimation(){!e._activated||e._suspended||tt()||e._detachFromTicker(),e._activated=!1}static _attachToTicker(){canvas.app.ticker.add(e.tick,this,PIXI.UPDATE_PRIORITY.LOW+1),e._lastTime=canvas.app.ticker.lastTime,e._prevTime=e._lastTime}static _detachFromTicker(){canvas.app.ticker.remove(e.tick,this),e._lastTime=0,e._prevTime=0}static getAnimeMap(){return e._animeMap}initAnimatedInternals(e){Object.keys(e).forEach(e=>{// Internals init
this.initInternals(e)})}initInternals(e){this.elapsedTime[e]=0,this.loopElapsedTime[e]=0,this.pauseBetweenElapsedTime[e]=0,this.loops[e]=0,this.internalLoops[e]=0,this.frameTime[e]=0,this.pauseBetween[e]=!1,this.ping[e]=!1,this.shutdown[e]=!1}hasInternals(e){return this.elapsedTime.hasOwnProperty(e)}animate(e){for(let t of Object.keys(this.puppet.animated))this.animated[t].active&&this.cycleCheck(t,e)&&(null!=this[this.animated[t].animType]&&this[this.animated[t].animType](t),this.shutdown[t]?(this.animated[t].active=!1,this.shutdown[t]=!1,// persists the value of an effect which is terminated.
this.persistTerminatedEffect(t)):(this.loopElapsedTime[t]+=e,this.elapsedTime[t]+=e));this.autoDisableCheck()}cycleCheck(e,t){return this.frameTime[e]=t,!this.isPauseBetweenLoop(e,t)&&(this.loopElapsedTime[e]>this.animated[e].loopDuration&&(this.loopElapsedTime[e]-=this.animated[e].loopDuration,this.ping[e]=!0,this.animated[e].loops!==1/0&&(this.loops[e]++,this.internalLoops[e]++),this.loops[e]>=this.animated[e].loops?(// correction to stop exactly on the target value when the last loop end.
this.elapsedTime[e]=this.internalLoops[e]*this.animated[e].loopDuration,this.loops[e]=0,this.loopElapsedTime[e]=0,this.shutdown[e]=!0):this.animated[e].pauseBetweenDuration>0&&(this.elapsedTime[e]=this.animated[e].loopDuration,this.pauseBetween[e]=!0)),!0)}async persistTerminatedEffect(e){let t;if(this.puppet.filterOwner!==game.data.userId)return;let i=!0,a=this.puppet.targetPlaceable.document.getFlag("tokenmagic","animeInfo");if(a){for(let t of a.values())if(t.tmFilterId===this.puppet.filterId&&t.tmFilterInternalId===this.puppet.filterInternalId&&t.tmFilterEffect===e&&t&&t instanceof Object){t.tmFilterEffectValue=this.puppet[e],i=!1;break}}i&&(t=[{tmFilterId:this.puppet.filterId,tmFilterInternalId:this.puppet.filterInternalId,tmFilterEffect:e,tmFilterEffectValue:this.puppet[e]}],a=a?a.concat(t):t),a=duplicate(a),await this.puppet.targetPlaceable._TMFXsetAnimeFlag(a)}autoDisableCheck(){(this.puppet.autoDisable||this.puppet.autoDestroy)&&this.puppet.filterOwner===game.data.userId&&(!1!==this.puppet.enabled||this.puppet.autoDestroy)&&Object.values(this.animated).every(e=>!1===e.active)&&this.disableOrDestroy()}async disableOrDestroy(){if(null==this.puppet)return;let e=this.puppet.targetPlaceable;if(null!=e){if(this.puppet.autoDestroy)await window.TokenMagic.deleteFilters(e,this.puppet.filterId);else{let t={};t.filterType=this.puppet.filterType,t.filterId=this.puppet.filterId,t.enabled=!1,await window.TokenMagic.updateFiltersByPlaceable(e,[t])}}}isPauseBetweenLoop(e,t){return!!this.pauseBetween[e]&&this.animated[e].pauseBetweenDuration>0&&(this.pauseBetweenElapsedTime[e]+=t,this.pauseBetweenElapsedTime[e]<this.animated[e].pauseBetweenDuration||(this.pauseBetweenElapsedTime[e]=0,this.pauseBetween[e]=!1))}pauseBetweenCheck(e,t){if(this.pauseStart[e]&&this.animated[e].pauseStartDuration>0)return this.pauseStartElapsedTime[e]+=t,!(this.pauseStartElapsedTime[e]<this.animated[e].pauseStartDuration)&&(this.pauseStart[e]=!1,!0)}moveToward(e){this.puppet[e]=(this.animated[e].val1-this.animated[e].val2)/this.animated[e].loopDuration*this.elapsedTime[e]}colorOscillation(t){this.puppet[t]=e.colOscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,!1)}halfColorOscillation(t){this.puppet[t]=e.colOscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,!1,Math.PI)}syncColorOscillation(t){this.puppet[t]=e.colOscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,!0)}cosOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,Math.cos,!1)}halfCosOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,Math.cos,!1,Math.PI)}sinOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,Math.sin,!1)}halfSinOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,Math.sin,!1,Math.PI)}chaoticOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift+Math.random()*this.animated[t].chaosFactor,this.animated[t].val1,this.animated[t].val2,Math.cos,!1)}syncCosOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,Math.cos,!0)}syncSinOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift,this.animated[t].val1,this.animated[t].val2,Math.sin,!0)}syncChaoticOscillation(t){this.puppet[t]=e.oscillation(this.elapsedTime[t],this.animated[t].loopDuration,this.animated[t].syncShift+Math.random()*this.animated[t].chaosFactor,this.animated[t].val1,this.animated[t].val2,Math.cos,!0)}rotation(e){let t=360*this.elapsedTime[e]/this.animated[e].loopDuration;this.puppet[e]=this.animated[e].clockWise?t:360-t}syncRotation(t){let i=e.getSynchronizedRotation(this.animated[t].loopDuration,this.animated[t].syncShift);this.puppet[t]=this.animated[t].clockWise?i:360-i}randomNumber(e){let t=Math.random()*(this.animated[e].val2-this.animated[e].val1)+this.animated[e].val1;this.animated[e].wantInteger?this.puppet[e]=Math.floor(t):this.puppet[e]=t}randomNumberPerLoop(e){this._ringing(e)&&this.randomNumber(e)}randomColor(e){this.puppet[e]=Math.floor(16777215*Math.random())}randomColorPerLoop(e){this._ringing(e)&&this.randomColor(e)}move(e){this.puppet[e]+=this.animated[e].speed*this.frameTime[e]}_ringing(e){return!!this.ping[e]&&(this.ping[e]=!1,!0)}}e._lastTime=0,e._prevTime=0,e._frameTime=0,e._animeMap=new Map,e.twoPi=2*Math.PI,e._activated=!1,e._suspended=!0;let t="NOFX";var i=1e4;PlaceableObject.prototype.TMFXaddFilters=async function(e,t=!1){await td.addFilters(this,e,t)},PlaceableObject.prototype.TMFXupdateFilters=async function(e){await td.updateFiltersByPlaceable(this,e)},PlaceableObject.prototype.TMFXaddUpdateFilters=async function(e){await td.addUpdateFilters(this,e)},PlaceableObject.prototype.TMFXdeleteFilters=async function(e=null){await td.deleteFilters(this,e)},PlaceableObject.prototype.TMFXhasFilterType=function(e){return td.hasFilterType(this,e)},PlaceableObject.prototype.TMFXhasFilterId=function(e){return td.hasFilterId(this,e)},PlaceableObject.prototype._TMFXsetFlag=async function(e){e7()?e1(this,e,e0.SET_FLAG):await this.document.setFlag("tokenmagic","filters",e)},PlaceableObject.prototype._TMFXsetAnimeFlag=async function(e){e7()?e1(this,e,e0.SET_ANIME_FLAG):await this.document.setFlag("tokenmagic","animeInfo",e)},PlaceableObject.prototype._TMFXunsetFlag=async function(){e7()?e1(this,null,e0.SET_FLAG):await this.document.unsetFlag("tokenmagic","filters")},PlaceableObject.prototype._TMFXunsetAnimeFlag=async function(){e7()?e1(this,null,e0.SET_ANIME_FLAG):await this.document.unsetFlag("tokenmagic","animeInfo")},PlaceableObject.prototype._TMFXgetSprite=function(){let e=this._TMFXgetPlaceableType();switch(e){case eK.TOKEN:return this.mesh;case eK.TILE:return this.mesh??this.bg;case eK.TEMPLATE:return this.template;case eK.DRAWING:return this.hasText?this.text:this.shape;default:return null}},PlaceableObject.prototype._TMFXgetPlaceablePadding=function(){// get the placeable padding, by taking into account all filters and options
let e=0,t=this._TMFXgetSprite().filters;if(t instanceof Array)for(let i of t)i.enabled&&(canvas.app.renderer.filter.useMaxPadding?e=Math.max(e,i.padding):e+=i.padding);return e},PlaceableObject.prototype._TMFXcheckSprite=function(){let e=this._TMFXgetPlaceableType();switch(e){case eK.TOKEN:case eK.TILE:return null!=this.mesh;case eK.TEMPLATE:return null!=this.template;case eK.DRAWING:return null!=this.shape;default:return null}},PlaceableObject.prototype._TMFXgetMaxFilterRank=function(){let e=this._TMFXgetSprite();return null==e?i++:null==e.filters?i++:i=Math.max(Math.max(...e.filters.map(e=>e.rank),1e4),i)+1},PlaceableObject.prototype._TMFXsetRawFilters=function(e){let t=te(),i=this._TMFXgetSprite();return null!=i&&(null==e?i.filters=null:null==i.filters?(t||e.hasOwnProperty("rank")||(e.rank=1e4),i.filters=[e]):function(e){if(!t&&!e.hasOwnProperty("rank")){let t=Math.max(...i.filters.map(e=>e.rank),1e4);e.rank=t+1}i.filters.push(e),t?i.filters.sort(function(e,t){return e.zOrder<t.zOrder?-1:e.zOrder>t.zOrder?1:0}):i.filters.sort(function(e,t){return e.rank<t.rank?-1:e.rank>t.rank?1:0})}(e),!0)},PlaceableObject.prototype._TMFXunsetRawFilters=function(){return this._TMFXsetRawFilters(null)},PlaceableObject.prototype._TMFXgetPlaceableType=function(){return[eK.TOKEN,eK.TEMPLATE,eK.TILE,eK.DRAWING].includes(this.constructor.embeddedName)?this.constructor.embeddedName:eK.NOT_SUPPORTED},PIXI.Filter.prototype.setTMParams=function(e){this.autoDisable=!1,this.autoDestroy=!1,this.gridPadding=0,this.boundsPadding=new PIXI.Point(0,0),this.currentPadding=0,this.recalculatePadding=!0,this.dummy=!1,foundry.utils.mergeObject(this,e),this.dummy?this.apply=function(e,t,i,a){e.applyFilter(this,t,i,a)}:(this.rawPadding=this.rawPadding??this.padding??0,this.originalPadding=Math.max(this.rawPadding,e3()),this.assignPlaceable(),this.activateTransform(),Object.defineProperty(this,"padding",{get:function(){return this.recalculatePadding&&this.calculatePadding(),this.currentPadding},set:function(e){this.rawPadding=e,this.originalPadding=Math.max(e,e3())}}))},PIXI.Filter.prototype.getPlaceable=function(){return tn(this.placeableId,this.placeableType)},PIXI.Filter.prototype.getPlaceableType=function(){return this.placeableType},PIXI.Filter.prototype.calculatePadding=function(){let e,t;let i=this.placeableImg;{let a=this.sticky||this.placeableType===eK.TOKEN?0:i.rotation,r=Math.sin(a),s=Math.cos(a);e=Math.abs(i.width*s)+Math.abs(i.height*r),t=Math.abs(i.width*r)+Math.abs(i.height*s)}if(this.gridPadding>0){let i=canvas.dimensions.size;this.boundsPadding.x=this.boundsPadding.y=(this.gridPadding-1)*i,this.boundsPadding.x+=(i-1-(e+i-1)%i)/2,this.boundsPadding.y+=(i-1-(t+i-1)%i)/2}else this.boundsPadding.x=this.boundsPadding.y=this.rawPadding;{let e=this.sticky?i.rotation:0,t=Math.sin(e),a=Math.cos(e);this.currentPadding=Math.max(Math.abs(this.boundsPadding.x*a)+Math.abs(this.boundsPadding.y*t),Math.abs(this.boundsPadding.x*t)+Math.abs(this.boundsPadding.y*a))+(this.originalPadding-this.rawPadding)}this.boundsPadding.x+=(e-i.width)/2,this.boundsPadding.y+=(t-i.height)/2;let a=this.targetPlaceable.worldTransform.a;this.boundsPadding.x*=a,this.boundsPadding.y*=a,this.currentPadding*=a},PIXI.Filter.prototype.assignPlaceable=function(){this.targetPlaceable=this.getPlaceable(),null!=this.targetPlaceable?this.placeableImg=this.targetPlaceable._TMFXgetSprite():this.placeableImg=null},PIXI.Filter.prototype.activateTransform=function(){this.preComputation=this.filterTransform,this.filterTransform();let e=this.apply;this.apply=function(t,i,a,r,s){return"handleTransform"in this&&this.handleTransform(s),e.apply(this,arguments)}},PIXI.Filter.prototype.filterTransform=function(){this.hasOwnProperty("zIndex")&&(this.targetPlaceable.zIndex=this.zIndex)},PIXI.Filter.prototype.normalizeTMParams=function(){this.hasOwnProperty("animated")&&null!=this.animated&&Object.keys(this.animated).forEach(e=>{(null==this.animated[e].active||"boolean"!=typeof this.animated[e].active)&&(this.animated[e].active=!0),(null==this.animated[e].loops||"number"!=typeof this.animated[e].loops||this.animated[e].loops<=0)&&(this.animated[e].loops=1/0),(null==this.animated[e].loopDuration||"number"!=typeof this.animated[e].loopDuration||this.animated[e].loopDuration<=0)&&(this.animated[e].loopDuration=3e3),(null==this.animated[e].clockWise||"boolean"!=typeof this.animated[e].clockWise)&&(this.animated[e].clockWise=!0),(null==this.animated[e].pauseBetweenDuration||"number"!=typeof this.animated[e].pauseBetweenDuration||this.animated[e].pauseBetweenDuration<=0)&&(this.animated[e].pauseBetweenDuration=0),(null==this.animated[e].syncShift||"number"!=typeof this.animated[e].syncShift||this.animated[e].syncShift<0)&&(this.animated[e].syncShift=0),(null==this.animated[e].val1||"number"!=typeof this.animated[e].val1)&&(this.animated[e].val1=0),(null==this.animated[e].val2||"number"!=typeof this.animated[e].val2)&&(this.animated[e].val2=0),void 0===this.anime[this.animated[e].animType]&&(this.animated[e].animType=null),(null==this.animated[e].speed||"number"!=typeof this.animated[e].speed)&&(this.animated[e].speed=0),(null==this.animated[e].chaosFactor||"number"!=typeof this.animated[e].chaosFactor)&&(this.animated[e].chaosFactor=.25),(null==this.animated[e].wantInteger||"boolean"!=typeof this.animated[e].wantInteger)&&(this.animated[e].wantInteger=!1),this.anime.hasInternals(e)||this.anime.initInternals(e),this.anime.animated=this.animated})};class a extends PIXI.filters.AdjustmentFilter{constructor(t){super(),this.enabled=!1,this.gamma=1,this.saturation=1,this.contrast=1,this.brightness=1,this.red=1,this.green=1,this.blue=1,this.alpha=1,this.zOrder=30,this.animating={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class r extends PIXI.filters.AsciiFilter{constructor(t){super(),this.size=8,this.zOrder=310,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class s extends PIXI.filters.AdvancedBloomFilter{constructor(t){super(),this.enabled=!1,this.threshold=.5,this.bloomScale=1,this.brightness=1,this.blur=4,this.quality=4,this.zOrder=40,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class o extends PIXI.filters.DotFilter{constructor(t){super(),this.scale=1,this.angle=5,this.grayscale=!0,this.zOrder=330,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class l extends PIXI.filters.DisplacementFilter{constructor(t){var i,a;super(i=PIXI.Sprite.from(a=t.hasOwnProperty("maskPath")?ts(t.maskPath):"modules/tokenmagic/fx/assets/distortion-1.png")),// Configuring distortion sprite
this.sprite=i,this.wrapMode=PIXI.WRAP_MODES.REPEAT,this.position=new PIXI.Point,this.skew=new PIXI.Point,this.pivot=new PIXI.Point,this.anchorSet=.5,this.transition=null,this.padding=15,this.enabled=!1,this.maskSpriteX=0,this.maskSpriteY=0,this.maskSpriteScaleX=4,this.maskSpriteScaleY=4,this.maskSpriteSkewX=0,this.maskSpriteSkewY=0,this.maskSpriteRotation=0,this.zOrder=4e3,this.sticky=!0,this.animated={},this.setTMParams(t),this.maskPath=a,this.dummy||(this.anime=new e(this),this.normalizeTMParams(),this.sprite.anchor.set(this.anchorSet),this.sprite.texture.baseTexture.wrapMode=this.wrapMode)}set maskSpriteX(e){this.position.x=e}set maskSpriteY(e){this.position.y=e}get maskSpriteX(){return this.position.x}get maskSpriteY(){return this.position.y}set maskSpriteScaleX(e){this.scale.x=e}set maskSpriteScaleY(e){this.scale.y=e}get maskSpriteScaleX(){return this.scale.x}get maskSpriteScaleY(){return this.scale.y}set maskSpriteRotation(e){this.rotation=e}get maskSpriteRotation(){return this.rotation}set maskSpriteSkewX(e){this.skew.x=e}get maskSpriteSkewX(){return this.skew.x}set maskSpriteSkewY(e){this.skew.y=e}get maskSpriteSkewY(){return this.skew.y}set maskSpritePivotX(e){this.pivot.x=e}get maskSpritePivotX(){return this.pivot.x}set maskSpritePivotY(e){this.pivot.y=e}get maskSpritePivotY(){return this.pivot.y}handleTransform(){this.sprite.position.x=this.targetPlaceable.x+this.placeableImg.x+this.position.x,this.sprite.position.y=this.targetPlaceable.y+this.placeableImg.y+this.position.y,this.sprite.skew.x=this.skew.x,this.sprite.skew.x=this.skew.y,this.sprite.rotation=this.rotation,this.sprite.pivot.x=this.pivot.x,this.sprite.pivot.y=this.pivot.y,this.sticky&&(this.sprite.rotation+=this.placeableImg.rotation),this.sprite.transform.updateTransform(canvas.stage.transform)}apply(e,t,i,a){this.uniforms.filterMatrix=e.calculateSpriteMatrix(this.maskMatrix,this.maskSprite),this.uniforms.scale.x=this.scale.x,this.uniforms.scale.y=this.scale.y;let r=this.maskSprite.worldTransform;this.uniforms.rotation[0]=r.a,this.uniforms.rotation[1]=r.b,this.uniforms.rotation[2]=r.c,this.uniforms.rotation[3]=r.d,e.applyFilter(this,t,i,a)}}class n extends PIXI.filters.OldFilmFilter{constructor(t){super(),this.enabled=!1,this.vignetting=0,this.noise=.08,this.scratch=.1,this.scratchDensity=.1,this.seed=0,this.zOrder=60,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class c extends PIXI.filters.GlowFilter{constructor(t){super(),this.padding=15,this.enabled=!1,this.innerStrength=0,this.outerStrength=6.5,this.color=8447,this.quality=1,this.alpha=1,this.zOrder=70,this.animated={},this.setTMParams(t),// Imposed value. Should not be a shader uniform
this.distance=10,this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class m extends PIXI.filters.OutlineFilter{constructor(t){super(),this.blendMode=PIXI.BLEND_MODES.NORMAL,this.padding=5,this.enabled=!1,this.thickness=3,this.color=0,this.quality=1,this.zOrder=50,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class u extends PIXI.filters.BevelFilter{constructor(t){super(),this.blendMode=PIXI.BLEND_MODES.NORMAL,this.padding=10,this.enabled=!1,this.rotation=0,this.thickness=5,this.lightColor=16777215,this.lightAlpha=.95,this.shadowColor=0,this.shadowAlpha=.95,this.zOrder=90,this.quality=1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}let d=new PIXI.Rectangle;class p extends PIXI.Filter{constructor(...e){super(...e),this.uniforms.filterMatrix&&this.uniforms.filterMatrixInverse||(this.uniforms.filterMatrix=new PIXI.Matrix),this.uniforms.filterMatrixInverse||(this.uniforms.filterMatrixInverse=new PIXI.Matrix)}apply(e,t,i,a){let r=this.uniforms.filterMatrix;if(r){let{sourceFrame:t,destinationFrame:i,target:a}=e.activeState;r.set(i.width,0,0,i.height,t.x,t.y);let s=PIXI.Matrix.TEMP_MATRIX,o=a.getLocalBounds(d);if(this.sticky){s.copyFrom(a.transform.worldTransform),s.invert();let e=a.transform.rotation,t=Math.sin(e),i=Math.cos(e),r=Math.hypot(i*s.a+t*s.c,i*s.b+t*s.d),l=Math.hypot(-t*s.a+i*s.c,-t*s.b+i*s.d);o.pad(r*this.boundsPadding.x,l*this.boundsPadding.y)}else{let e=a.transform;s.a=e.scale.x,s.b=0,s.c=0,s.d=e.scale.y,s.tx=e.position.x-e.pivot.x*e.scale.x,s.ty=e.position.y-e.pivot.y*e.scale.y,s.prepend(a.parent.transform.worldTransform),s.invert();let t=Math.hypot(s.a,s.b),i=Math.hypot(s.c,s.d);o.pad(t*this.boundsPadding.x,i*this.boundsPadding.y)}r.prepend(s),r.translate(-o.x,-o.y),r.scale(1/o.width,1/o.height);let l=this.uniforms.filterMatrixInverse;l&&(l.copyFrom(r),l.invert())}e.applyFilter(this,t,i,a)}}let f=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alpha;
uniform vec3 color;

uniform vec2 shift;
uniform vec4 inputSize;

void main(void){
    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);

    // Premultiply alpha
    sample.rgb = color.rgb * sample.a;

    // alpha user alpha
    sample *= alpha;

    gl_FragColor = sample;
}
`,h=`
precision mediump float;

attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;
uniform vec4 inputSize;
uniform vec4 outputFrame;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0., 1.);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
    vFilterCoord = (filterMatrix * vec3(vTextureCoord, 1.0)).xy;
}
`;class g extends p{shadowOnly;angle=45;_distance=5;_resolution=PIXI.settings.FILTER_RESOLUTION;_tintFilter;_blurFilter;constructor(e={}){super();let t=e?{...g.defaults,...e}:g.defaults,{kernels:i,blur:a,quality:r,resolution:s}=t;this._tintFilter=new PIXI.Filter(h,f),this._tintFilter.uniforms.color=new Float32Array(4),this._tintFilter.uniforms.shift=new PIXI.Point,this._tintFilter.resolution=s,this._blurFilter=i?new PIXI.filters.KawaseBlurFilter(i):new PIXI.filters.KawaseBlurFilter(a,r),this._pixelSize=1,this.resolution=s;let{shadowOnly:o,rotation:l,distance:n,alpha:c,color:m}=t;this.shadowOnly=o,this.rotation=l,this.distance=n,this.alpha=c,this.color=m}apply(e,t,i,a){this._updateShiftAndScale();let r=e.getFilterTexture();this._tintFilter.apply(e,t,r,1),this._blurFilter.apply(e,r,i,a),!0!==this.shadowOnly&&e.applyFilter(this,t,i,0),e.returnFilterTexture(r)}_updateShiftAndScale(){let e=this.targetPlaceable?.worldTransform.a??1;this._tintFilter.uniforms.shift.set(this.distance*Math.cos(this.angle)*e,this.distance*Math.sin(this.angle)*e),this._pixelSize=Math.max(1,1*e)}get resolution(){return this._resolution}set resolution(e){this._resolution=e,this._tintFilter&&(this._tintFilter.resolution=e),this._blurFilter&&(this._blurFilter.resolution=e)}get distance(){return this._distance}set distance(e){this._distance=e}get rotation(){return this.angle/PIXI.DEG_TO_RAD}set rotation(e){this.angle=e*PIXI.DEG_TO_RAD}get alpha(){return this._tintFilter.uniforms.alpha}set alpha(e){this._tintFilter.uniforms.alpha=e}get color(){return PIXI.utils.rgb2hex(this._tintFilter.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this._tintFilter.uniforms.color)}get kernels(){return this._blurFilter.kernels}set kernels(e){this._blurFilter.kernels=e}get blur(){return this._blurFilter.blur}set blur(e){this._blurFilter.blur=e}get quality(){return this._blurFilter.quality}set quality(e){this._blurFilter.quality=e}get _pixelSize(){return this._blurFilter.pixelSize}set _pixelSize(e){this._blurFilter.pixelSize=e}}g.defaults={rotation:45,distance:5,color:0,alpha:.5,shadowOnly:!1,kernels:null,blur:2,quality:3,resolution:PIXI.settings.FILTER_RESOLUTION};class v extends PIXI.filters.TwistFilter{constructor(t){super(),this.enabled=!1,this.radiusPercent=50,this.angle=4,this.zOrder=240,this.animated={},this.offset=[0,0],this.autoFit=!1,this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}handleTransform(){this.offset[0]=this.placeableImg.worldTransform.tx,this.offset[1]=this.placeableImg.worldTransform.ty,this.radius=Math.max(this.placeableImg.width,this.placeableImg.height)*this.targetPlaceable.worldTransform.a*this.radiusPercent/200}}class b extends PIXI.filters.ZoomBlurFilter{constructor(t){super(),this.enabled=!1,this.strength=.1,this.radiusPercent=50,this.innerRadiusPercent=10,this.zOrder=300,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}handleTransform(e){this.center[0]=.5*e.sourceFrame.width,this.center[1]=.5*e.sourceFrame.height,this.radius=Math.max(this.placeableImg.width,this.placeableImg.height)*this.targetPlaceable.worldTransform.a*this.radiusPercent/200,this.innerRadius=Math.max(this.placeableImg.width,this.placeableImg.height)*this.targetPlaceable.worldTransform.a*this.innerRadiusPercent/200}}class y extends p{blurXFilter;blurYFilter;_repeatEdgePixels;constructor(e=8,t=4,i=PIXI.settings.FILTER_RESOLUTION,a=5){super(),this.blurXFilter=new x(!0,e,t,i,a),this.blurYFilter=new x(!1,e,t,i,a),this.resolution=i,this.quality=t,this.blur=e,this.repeatEdgePixels=!1}apply(e,t,i,a){let r=Math.abs(this.blurXFilter.strength),s=Math.abs(this.blurYFilter.strength);if(r&&s){let r=e.getFilterTexture();this.blurXFilter.apply(e,t,r,PIXI.CLEAR_MODES.CLEAR),this.blurYFilter.apply(e,r,i,a),e.returnFilterTexture(r)}else s?this.blurYFilter.apply(e,t,i,a):this.blurXFilter.apply(e,t,i,a)}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=2*Math.max(Math.abs(this.blurXFilter.strength),Math.abs(this.blurYFilter.strength))}get blur(){return this.blurXFilter.blur}set blur(e){this.blurXFilter.blur=this.blurYFilter.blur=e,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(e){this.blurXFilter.quality=this.blurYFilter.quality=e}get blurX(){return this.blurXFilter.blur}set blurX(e){this.blurXFilter.blur=e,this.updatePadding()}get blurY(){return this.blurYFilter.blur}set blurY(e){this.blurYFilter.blur=e,this.updatePadding()}get blendMode(){return this.blurYFilter.blendMode}set blendMode(e){this.blurYFilter.blendMode=e}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(e){this._repeatEdgePixels=e,this.updatePadding()}}class x extends p{horizontal;strength;passes;_quality;constructor(e,t=8,i=4,a=PIXI.settings.FILTER_RESOLUTION,r=5){let s=function(e,t){let i;let a=Math.ceil(e/2),r=C,s="";i=t?"vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);":"vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";for(let t=0;t<e;t++){let e=i.replace("%index%",t.toString());s+=(e=e.replace("%sampleIndex%",`${t-(a-1)}.0`))+"\n"}return(r=r.replace("%blur%",s)).replace("%size%",e.toString())}(r,e),o=function(e){let t;let i=T[e],a=i.length,r="varying vec2 vBlurTexCoords[%size%];\nuniform sampler2D uSampler;\nvoid main(void)\n{\n    gl_FragColor = vec4(0.0);\n    %blur%\n}",s="";for(let r=0;r<e;r++){let o="gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;".replace("%index%",r.toString());t=r,r>=a&&(t=e-r-1),s+=(o=o.replace("%value%",i[t].toString()))+"\n"}return(r=r.replace("%blur%",s)).replace("%size%",e.toString())}(r);super(s,o),this.horizontal=e,this.resolution=a,this._quality=0,this.quality=i,this.blur=t}apply(e,t,i,a){if(i?this.horizontal?this.uniforms.strength=1/i.width*(i.width/t.width):this.uniforms.strength=1/i.height*(i.height/t.height):this.horizontal?this.uniforms.strength=1/e.renderer.width*(e.renderer.width/t.width):this.uniforms.strength=1/e.renderer.height*(e.renderer.height/t.height),// screen space!
this.uniforms.strength*=this.strength,this.uniforms.strength/=this.passes,1===this.passes)e.applyFilter(this,t,i,a);else{let r=e.getFilterTexture(),s=e.renderer,o=t,l=r;this.state.blend=!1,e.applyFilter(this,o,l,PIXI.CLEAR_MODES.CLEAR);for(let t=1;t<this.passes-1;t++){e.bindAndClear(o,PIXI.CLEAR_MODES.BLIT),this.uniforms.uSampler=l;let t=l;l=o,o=t,s.shader.bind(this),s.geometry.draw(5)}this.state.blend=!0,e.applyFilter(this,l,i,a),e.returnFilterTexture(r)}}get blur(){return this.strength}set blur(e){this.padding=1+2*Math.abs(e),this.strength=e}get quality(){return this._quality}set quality(e){this._quality=e,this.passes=e}}let T={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},C=`
    attribute vec2 aVertexPosition;
    uniform mat3 projectionMatrix;
    uniform float strength;
    varying vec2 vBlurTexCoords[%size%];
    uniform vec4 inputSize;
    uniform vec4 outputFrame;
    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }
    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }
    void main(void)
    {
        gl_Position = filterVertexPosition();
        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;class w extends PIXI.filters.ShockwaveFilter{constructor(t){super(),this.enabled=!1,this.time=0,this.amplitude=5,this.wavelength=100,this.speed=50,this.brightness=1.5,this.radius=200,this.zOrder=220,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}handleTransform(e){this.center[0]=.5*e.sourceFrame.width,this.center[1]=.5*e.sourceFrame.height}}class I extends PIXI.filters.BulgePinchFilter{constructor(t){super(),this.strength=0,this.radiusPercent=100,this.zOrder=140,this.autoFit=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams()),// Anchor point
this.center=[.5,.5]}handleTransform(){this.radius=Math.max(this.placeableImg.width,this.placeableImg.height)*this.targetPlaceable.worldTransform.a*this.radiusPercent/200}}let P=`
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alphaTolerance;

void main(void) {
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a <= alphaTolerance) {
        pixel = vec4(0.);
    } 
    gl_FragColor = pixel;
}
`;class M extends p{constructor(t){let{alphaTolerance:i}=Object.assign({},M.defaults,t);// using the default vertex shader and the specific fragment shader
super(void 0,P),Object.assign(this,{alphaTolerance:i}),this.zOrder=10,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get alphaTolerance(){return this.uniforms.alphaTolerance}set alphaTolerance(e){this.uniforms.alphaTolerance=e}}M.defaults={alphaTolerance:.8};let F=`
precision mediump float;
precision mediump int;

uniform sampler2D uSampler;
uniform float time;
uniform vec2 dimensions;
uniform vec2 anchor;
uniform vec4 color;
uniform float divisor;
uniform bool alphaDiscard;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

float PI = 3.14159265359;
float speed = 1.2;
float width = 0.5;
float subdivide = 512.0;

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec2 uv = (vFilterCoord - anchor) / dimensions;    
    float len = length(uv *0.5),
   		angle = ( atan(uv.x, uv.y) / ( 2. * PI) ) + 1.5,
    	wobble = 48. + 24. * cos(time/5.),
    	white = fract((angle) * divisor + sin((sqrt(len) * wobble) - time * speed));
    
    white  = 2.* cos(white / (PI * 0.1));
    white *= floor(fract(angle * divisor + sin(time / speed - (len * 1.2) * wobble)) *subdivide) / subdivide;
    
    vec4 color1 = smoothstep(0., 1., white * color);
    vec4 result = mix(pixel, color1, color1.a);
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.05)))) discard;
    gl_FragColor = result*pixel.a;
}
`;class k extends p{constructor(t){let{time:i,color:a,divisor:r,alpha:s,anchorX:o,anchorY:l,dimX:n,dimY:c,alphaDiscard:m}=Object.assign({},k.defaults,t);// using specific vertex shader and fragment shader
super(h,F),this.uniforms.color=new Float32Array([1,.4,.1,.55]),this.uniforms.anchor=new Float32Array([.5,.5]),this.uniforms.dimensions=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,divisor:r,alpha:s,anchorX:o,anchorY:l,dimX:n,dimY:c,alphaDiscard:m}),this.zOrder=120,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get divisor(){return this.uniforms.divisor}set divisor(e){this.uniforms.divisor=e}get alpha(){return this.uniforms.color[3]}set alpha(e){e>=0&&e<=1&&(this.uniforms.color[3]=e)}get anchorX(){return this.uniforms.anchor[0]}set anchorX(e){this.uniforms.anchor[0]=e}get anchorY(){return this.uniforms.anchor[1]}set anchorY(e){this.uniforms.anchor[1]=e}get dimX(){return this.uniforms.dimensions[0]}set dimX(e){this.uniforms.dimensions[0]=e}get dimY(){return this.uniforms.dimensions[1]}set dimY(e){this.uniforms.dimensions[1]=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}k.defaults={time:0,color:16744464,divisor:16,alpha:.55,anchorX:.5,anchorY:.5,dimX:100,dimY:100,alphaDiscard:!1};let S=`
precision mediump float;

uniform float time;
uniform vec3 color;
uniform float density;
uniform vec2 dimensions;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

// generates pseudo-random based on screen position
float random(vec2 pos) 
{
	return fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// perlin noise
float noise(vec2 pos) 
{
	vec2 i = floor(pos);
	vec2 f = fract(pos);
	float a = random(i + vec2(0.0, 0.0));
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// fractional brownian motion
float fbm(vec2 pos) 
{
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100.);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
	for (int i=0; i<16; i++) 
	{
		v = (sin(v*1.07)) + ( a * noise(pos) );
		pos = rot * pos * 1.9 + shift;
		a *= 0.5;
	}
	return v;
}

mat4 contrastMatrix(float contrast)
{
	float t = ( 1.0 - contrast ) * 0.5;
    
    return mat4( contrast, 0, 0, 0,
                 0, contrast, 0, 0,
                 0, 0, contrast, 0,
                 t, t, t, 1 );
}

vec4 fog()
{
	vec2 p = (vFilterCoord.xy * 8. - vFilterCoord.xy) * dimensions;
	
	float time2 = time * 0.0025;
	
	vec2 q = vec2(0.0);
	q.x = fbm(p);
	q.y = fbm(p);
	vec2 r = vec2(-1.0);
	r.x = fbm(p * q + vec2(1.7, 9.2) + .15 * time2);
	r.y = fbm(p * q + vec2(9.3, 2.8) + .35 * time2);
	float f = fbm(p*.2 + r*3.102);

	vec4 fogPixel = mix(
		vec4(color,1.0),
		vec4(1.5, 1.5, 1.5, 1.5),
		clamp(length(r.x), 0.4, 1.)
	);

	return (f *f * f + 0.6 * f * f + 0.5 * f) * fogPixel;
}

void main(void) 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);

    // to avoid computation on an invisible pixel.
    if (pixel.a == 0.) {
		gl_FragColor = pixel;
		return;
    }

	vec4 fogPixel = contrastMatrix(3.0)*fog();
    gl_FragColor = mix(pixel, fogPixel, 1.*density) * pixel.a;
}
`;class A extends p{constructor(t){let{time:i,color:a,density:r,dimX:s,dimY:o}=Object.assign({},A.defaults,t);// specific vertex and fragment shaders
super(h,S),this.uniforms.color=new Float32Array([1,.4,.1,.55]),this.uniforms.dimensions=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,density:r,dimX:s,dimY:o}),this.zOrder=190,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get density(){return this.uniforms.density}set density(e){this.uniforms.density=e}get dimX(){return this.uniforms.dimensions[0]}set dimX(e){this.uniforms.dimensions[0]=e}get dimY(){return this.uniforms.dimensions[1]}set dimY(e){this.uniforms.dimensions[1]=e}}A.defaults={time:0,color:16777215,density:.5,dimX:1,dimY:1};let O=`
precision mediump float;

uniform float time;
uniform vec3 color;
uniform bool alphaDiscard;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265;
const mat3 rotationMatrix = mat3(1.0,0.0,0.0,0.0,0.47,-0.88,0.0,0.88,0.47);
	
float hash(float p)
{
    return fract(sin(dot(vec2(p*0.00010,0.),vec2(12.9898,78.233))) * 43758.5453);
}

float noise( vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+0.0  ), hash(n+1.0),f.x),mix( hash(n+57.0 ), hash(n+58.0 ),f.x),f.y),
           mix(mix( hash(n+113.0), hash(n+114.0),f.x),mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
} 

vec4 map( vec3 p )
{
	float d = 0.2 - p.y;	
	vec3 q = p  - vec3(0.0,1.0,0.0)*time;
	float f  = 0.5*noise( q ); q = q*2.02 - vec3(0.25,0.25,0.25)*time*0.4;
	f += 0.25*noise( q ); 
    q = q*2.03 - vec3(0.0,1.0,0.0)*time*0.2;
	f += 0.125*noise( q ); 
	d = clamp( d + 4.5*f, 0.0, 1.0 );
	vec3 col = mix( vec3(0.9,0.9,0.9), vec3(0.1,0.1,0.1), d ) + 0.05*sin(p);
	return vec4( col, d );
}

vec3 cloudify( vec3 ro, vec3 rd )
{
	vec4 s = vec4(0.);
	float t = 0.0;
    vec3 col = color*0.75;
    vec3 p;
    vec4 k;

	for( int i=0; i<90; i++ )
	{
		if( s.a > 0.97 ) break;
		p = ro + t*rd;
		k = map( p );
		k.rgb *= mix( col, color, clamp( (p.y-0.2)*0.5, 0.0, 1.0 ) );
		k.a *= 0.5;
		k.rgb *= k.a;
		s = s + k*(1.0-s.a);	
		t += 0.05;
	}
	return clamp( s.xyz, 0.0, 1.0 );
}

vec4 xfog()
{
	vec3 vo = vec3(0.0,4.9,-40.);
	vec3 vd = normalize(vec3(vFilterCoord.xy, 1.)) * rotationMatrix * 2.25;
	vec3 volume = cloudify( vo, vd );
	volume *= volume;
	return vec4( volume, 1.0 );
}

void main() 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a == 0.) discard;
    vec4 result = max( xfog(), pixel) * pixel.a;
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.15)))) discard;
    gl_FragColor = result;
}
`;class _ extends p{constructor(t){let{time:i,color:a,alphaDiscard:r}=Object.assign({},_.defaults,t);// specific vertex and fragment shaders
super(h,O),this.uniforms.color=new Float32Array([1,.4,.1,.55]),Object.assign(this,{time:i,color:a,alphaDiscard:r}),this.zOrder=230,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}_.defaults={time:0,color:16777215,alphaDiscard:!1};let X=`
precision mediump float;
precision mediump int;

#define INTENSITY 5

const float PI = 3.14159265358979323846264;

uniform sampler2D uSampler;
uniform vec4 color;
varying vec2 vFilterCoord;
varying vec2 vTextureCoord;
uniform float time;
uniform int blend;

vec4 blenderVec3(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol; }
    else if (blend == 13) { fCol = fCol + sCol; }
    else { fCol = fCol + sCol; }
    
    return vec4(fCol,1.0);
}

float Perlin(vec3 P)
{
    vec3 Pi = floor(P);
    vec3 Pf = P - Pi;
    vec3 Pf_min1 = Pf - 1.0;

    Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
    vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);

    vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
    const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
    vec3 lowz_mod = vec3(1.0 / (SOMELARGEFLOATS + Pi.zzz * ZINC));
    vec3 highz_mod = vec3(1.0 / (SOMELARGEFLOATS + Pi_inc1.zzz * ZINC));
    vec4 hashx0 = fract(Pt * lowz_mod.xxxx);
    vec4 hashx1 = fract(Pt * highz_mod.xxxx);
    vec4 hashy0 = fract(Pt * lowz_mod.yyyy);
    vec4 hashy1 = fract(Pt * highz_mod.yyyy);
    vec4 hashz0 = fract(Pt * lowz_mod.zzzz);
    vec4 hashz1 = fract(Pt * highz_mod.zzzz);

    vec4 grad_x0 = hashx0 - 0.49999;
    vec4 grad_y0 = hashy0 - 0.49999;
    vec4 grad_z0 = hashz0 - 0.49999;
    vec4 grad_x1 = hashx1 - 0.49999;
    vec4 grad_y1 = hashy1 - 0.49999;
    vec4 grad_z1 = hashz1 - 0.49999;
    vec4 grad_results_0 = inversesqrt(grad_x0 * grad_x0 + grad_y0 * grad_y0 + grad_z0 * grad_z0) * (vec2(Pf.x, Pf_min1.x).xyxy * grad_x0 + vec2(Pf.y, Pf_min1.y).xxyy * grad_y0 + Pf.zzzz * grad_z0);
    vec4 grad_results_1 = inversesqrt(grad_x1 * grad_x1 + grad_y1 * grad_y1 + grad_z1 * grad_z1) * (vec2(Pf.x, Pf_min1.x).xyxy * grad_x1 + vec2(Pf.y, Pf_min1.y).xxyy * grad_y1 + Pf_min1.zzzz * grad_z1);

    vec3 blend = Pf * Pf * Pf * (Pf * (Pf * 6.0 - 15.0) + 10.0);
    vec4 res0 = mix(grad_results_0, grad_results_1, blend.z);
    vec4 blend2 = vec4(blend.xy, vec2(1.0 - blend.xy));
    float final = dot(res0, blend2.zxzx * blend2.wwyy);
    return (final * 1.1547005383792515290182975610039);  // scale things to a strict -1.0->1.0 range  *= 1.0/sqrt(0.75)
}

float fbm(vec3 p)
{
    float v = 0.0;
    v += Perlin(p * 0.9) * 1.5 * cos(PI * time * 0.48);
    v += Perlin(p * 3.99) * 0.5 * sin(PI * time * 0.4);
    v += Perlin(p * 8.01) * 0.4 * cos(PI * time * 0.4);
    v += Perlin(p * 15.05) * 0.05 * sin(PI * time * 0.8);

    return v;
}

vec4 electric() {
    vec3 noiseVec = vec3(vFilterCoord, 1.);
    vec3 color = vec3(0.0);
    for (int i = 0; i < INTENSITY; ++i ) {
        noiseVec = noiseVec.yxz;
        float t = abs(2.0 / (fbm(noiseVec + vec3(0.0, time / float(i + 4), 0.0)) * 120.0));
        color += t * vec3(float(i + 1) * 0.1 + 0.1, 0.5, 2.0);
    }
    return vec4(color, 1.);
}

void main() {
 
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    
    // to avoid computation of invisible pixels
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }
    
    vec4 electric = electric();
    electric *= color;

    gl_FragColor = blenderVec3(blend,pixel,electric)*pixel.a;
}
`;class z extends p{constructor(t){let{time:i,blend:a,color:r}=Object.assign({},z.defaults,t);if(t.hasOwnProperty("intensity")&&"number"==typeof t.intensity){var s,o=Math.floor(t.intensity);s=X.replace("#define INTENSITY 5","#define INTENSITY "+o)}else s=X;super(h,s),this.uniforms.color=new Float32Array([1,1,1,1]),this.uniforms.blend=2,Object.assign(this,{time:i,blend:a,color:r}),this.zOrder=160,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams()),this.quality=.5}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}}z.defaults={time:0,blend:1,color:16777215};let D=`
precision mediump float;
precision mediump int;

uniform vec3 color;
uniform vec2 anchor;
uniform float time;
uniform bool inward;
uniform float frequency;
uniform float strength;
uniform float minIntensity;
uniform float maxIntensity;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    float speed = inward ? 1.0 : -1.0;

    vec2 centeredUVs = vFilterCoord - anchor;
    float dist = length(centeredUVs);
    float sinVal = sin((time * speed) + (dist * frequency));
    
    float sinValNormalized = sinVal * 0.5 + 0.5;
    float lerp = ((maxIntensity - minIntensity) * sinValNormalized) + minIntensity;
    
    float rotationAmount = strength * sinVal;

    float sinX = sin ( rotationAmount );
    float cosX = cos ( rotationAmount );
    mat2 rotationMatrix = mat2( cosX, -sinX, sinX, cosX);
    vec2 newTextureCoord = vTextureCoord - vec2(0.5,0.5);

    newTextureCoord = vec2(newTextureCoord * rotationMatrix ); 
    newTextureCoord = newTextureCoord + vec2(0.5, 0.5);     
    vec4 col = texture2D(uSampler, newTextureCoord);
    
    col.rgb = col.rgb * color * lerp;
    if (col.r != 0. && col.g != 0. && col.b != 0.) {
       col.a = pixel.a;
    }

    gl_FragColor = col * pixel.a;
}
`;class E extends p{constructor(t){let{time:i,color:a,inward:r,frequency:s,strength:o,minIntensity:l,maxIntensity:n,anchorX:c,anchorY:m}=Object.assign({},E.defaults,t);// using specific vertex shader and fragment shader
super(h,D),this.uniforms.color=new Float32Array([1,1,1]),this.uniforms.anchor=new Float32Array([.5,.5]),Object.assign(this,{time:i,color:a,inward:r,frequency:s,strength:o,minIntensity:l,maxIntensity:n,anchorX:c,anchorY:m}),this.zOrder=280,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get inward(){return this.uniforms.inward}set inward(e){null!=e&&"boolean"==typeof e&&(this.uniforms.inward=e)}get anchorX(){return this.uniforms.anchor[0]}set anchorX(e){this.uniforms.anchor[0]=e}get anchorY(){return this.uniforms.anchor[1]}set anchorY(e){this.uniforms.anchor[1]=e}get frequency(){return this.uniforms.frequency}set frequency(e){this.uniforms.frequency=e}get strength(){return this.uniforms.strength}set strength(e){this.uniforms.strength=e}get minIntensity(){return this.uniforms.minIntensity}set minIntensity(e){this.uniforms.minIntensity=e}get maxIntensity(){return this.uniforms.maxIntensity}set maxIntensity(e){this.uniforms.maxIntensity=e}}E.defaults={time:0,color:16777215,inward:!1,frequency:35,strength:.01,minIntensity:1.2,maxIntensity:3.5,anchorX:.5,anchorY:.5};let R=`
precision mediump float;

uniform float time;
uniform float amplitude;
uniform float intensity;
uniform int fireBlend;
uniform int blend;
uniform bool alphaDiscard;
uniform vec2 anchor;
uniform vec3 color;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

float rand(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec4 blenderVec3(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol; }
    else if (blend == 13) { fCol = fCol + sCol; }
    else { fCol = fCol + sCol; }
    
    return vec4(fCol,1.0);
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), 
	       mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 fire() 
{
    const vec3 c1 = vec3(0.1, 0.0, 0.);
	const vec3 c2 = vec3(0.7, 0.0, 0.);
	const vec3 c3 = vec3(0.2, 0.0, 0.);
	const vec3 c4 = vec3(1.0, 0.9, 0.);
	const vec3 c5 = vec3(0.1);
	const vec3 c6 = vec3(0.9);
    vec2 uv = vFilterCoord - anchor;
	vec2 p = uv.xy * 8.0;
	float q = fbm(p - time * 0.1);
	vec2 r = vec2(fbm(p + q + time * 0.7 - p.x - p.y), fbm(p + q - time * 0.4));
	vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	return vec4(c * cos(1.57/(intensity-0.03) * uv.y), 1.0);
}

vec4 fireBlending()
{
    vec4 fire = fire();
    vec4 tint = vec4(color,1.0);
    return blenderVec3(fireBlend,fire,tint);
}

vec4 resultBlending(vec4 pixel, vec4 fire)
{
    vec4 result = blenderVec3(blend,pixel,fire);
    return result;
}

void main() 
{
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec4 result = resultBlending(pixel, fireBlending())*pixel.a;
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.50)))) discard;
	gl_FragColor = result;
}
`;class Y extends p{constructor(t){let{time:i,color:a,amplitude:r,intensity:s,fireBlend:o,blend:l,anchorX:n,anchorY:c,alphaDiscard:m}=Object.assign({},Y.defaults,t);// using specific vertex shader and fragment shader
super(h,R),this.uniforms.color=new Float32Array([1,1,1]),this.uniforms.anchor=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,amplitude:r,intensity:s,fireBlend:o,blend:l,anchorX:n,anchorY:c,alphaDiscard:m}),this.zOrder=150,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get amplitude(){return this.uniforms.amplitude}set amplitude(e){this.uniforms.amplitude=e}get intensity(){return this.uniforms.intensity}set intensity(e){this.uniforms.intensity=e}get fireBlend(){return this.uniforms.fireBlend}set fireBlend(e){this.uniforms.fireBlend=Math.floor(e)}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get anchorX(){return this.uniforms.anchor[0]}set anchorX(e){this.uniforms.anchor[0]=e}get anchorY(){return this.uniforms.anchor[1]}set anchorY(e){this.uniforms.anchor[1]=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}Y.defaults={time:0,color:16777215,amplitude:1,intensity:1,fireBlend:1,blend:2,anchorX:1,anchorY:1,alphaDiscard:!1};let L=`
precision mediump float;
precision mediump int;

uniform float time;
uniform vec2 dimensions;
uniform int blend;
uniform vec3 color;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

#define TWOPI 6.28318530718

vec4 toGray(in vec4 color)
{
  float average = (color.r + color.g + color.b) * 0.33333334;
  return vec4(average, average, average, 1.0);
}

vec4 colorize(in vec4 grayscale, in vec4 color)
{
    return (grayscale * color);
}

vec4 blenderVec3(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol; }
    else if (blend == 13) { fCol = fCol + sCol; }
    else { fCol = fCol + sCol; }
    
    return vec4(fCol,1.0);
}

vec4 fog(vec2 fragCoord)
{
    float t = time * 0.26 + 23.0;
    vec2 uv = fragCoord.xy * dimensions.xy;

    vec2 p = mod(uv * TWOPI, TWOPI) - 250.0;
    vec2 i = vec2(p);
    float c = 0.75;
    float intensity = 0.014;

    for (int n = 0; n < 4; n++) {
        float t = t * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(.5 * p.x / (sin(0.40 * i.x + t) / intensity), p.y / (cos(i.y + t) / intensity)));
    }

    c *= 0.16666667;
    c = 1.17 - pow(c, 1.4);
    vec3 colour = vec3(pow(abs(c), 8.0));

    return vec4(colour * colour, 1.);
}


void main() 
{
    vec4 pixel = texture2D(uSampler,vTextureCoord);

    // to avoid computation on an invisible pixel.
    if (pixel.a==0.) {
        gl_FragColor = pixel;
        return;
    }

    // fog generation.
    vec4 fog = colorize(
               toGray(
                 fog(vFilterCoord.xy) 
               + fog(-vFilterCoord.xy * 0.65))
                    ,vec4(color/3., 1.)) * 0.9;

    // we put the fog and the pixel into the blender, and we serve, adjusted by the pixel alpha.
	gl_FragColor = blenderVec3(blend, fog, pixel) * pixel.a;
}
`;class j extends p{constructor(t){let{time:i,color:a,blend:r,dimX:s,dimY:o}=Object.assign({},j.defaults,t);// using specific vertex shader and fragment shader
super(h,L),this.uniforms.color=new Float32Array([1,1,1]),this.uniforms.dimensions=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,blend:r,dimX:s,dimY:o}),this.zOrder=210,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get dimX(){return this.uniforms.dimensions[0]}set dimX(e){this.uniforms.dimensions[0]=e}get dimY(){return this.uniforms.dimensions[1]}set dimY(e){this.uniforms.dimensions[1]=e}}j.defaults={time:0,color:16777215,blend:2,dimX:1,dimY:1};let q=`
precision mediump float;

uniform float time;
uniform float scale;
uniform float glint;
uniform float billowy;
uniform float tintIntensity;
uniform vec2 shift;
uniform vec3 waterColor;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;
uniform mat3 filterMatrixInverse;

const float timeSpeed = 3.;

#define TWOPI 6.28318531

float randomVal (float inVal)
{
    return fract(sin(mod(dot(vec2(inVal, 2523.2361) , vec2(12.9898,78.233)), TWOPI)) * 43758.5453)-0.5;
}

vec2 randomVec2 (float inVal)
{
    return normalize(vec2(randomVal(inVal), randomVal(inVal+151.523)));
}

float makeWaves(vec2 uv, float theTime, float offset)
{
    float result = 0.0;
    float direction = 0.0;
    float sineWave = 0.0;
    vec2 randVec = vec2(0.0,0.0);
    float i;
    for(int n = 0; n < 16; n++)
    {
        i = float(n)+offset;
        randVec = randomVec2(float(i));
  		direction = (uv.x*randVec.x+uv.y*randVec.y);
        sineWave = sin(mod(direction*randomVal(i+1.6516)+theTime*timeSpeed, TWOPI));
        sineWave = smoothstep(0.2,1.,sineWave);
    	result += randomVal(i+123.0)*sineWave;
    }
    return result;
}

vec4 water( vec2 fragCoord )
{
    vec4 fragColor;
	vec2 uv = fragCoord.xy * 0.5;
    
    vec2 uv2 = uv * scale;
    
    uv *= 2.0;

    float result = 0.0;
    float result2 = 0.0;
    
    result = makeWaves( uv2+vec2(time*timeSpeed,0.0), time, 0.1);
    result2 = makeWaves( uv2-vec2(time*0.8*timeSpeed,0.0), time*0.8+1.06, 0.26);
    
    result *= 0.2;
    
    result = smoothstep(0.35,1.1,1.0-abs(result));
    result2 = smoothstep(0.35,1.1,1.0-abs(result2));
    
    result = 2.0*smoothstep(0.35,1.8,(result+result2)*glint);

    vec2 p = vec2(result, result2)*0.019 + (cos( mod(  uv*1.1 - sin(mod(uv.yx + time*timeSpeed/20., TWOPI)), TWOPI) )*0.012);
    uv.x -= shift.x;
    uv.y -= shift.y;
    uv += p * billowy;
    vec4 pixel = texture2D( uSampler , (filterMatrixInverse * vec3(uv, 1.0)).xy );
	return (vec4(result)*0.9 + pixel)*pixel.a;
}

void main() {
    vec4 water = water(vFilterCoord);
    vec4 result = mix(vec4(waterColor,1.0),water,1./(tintIntensity+1.000000001))*water.a;
    gl_FragColor = result;
}
`;class N extends p{constructor(t){let{time:i,scale:a,glint:r,billowy:s,color:o,shiftX:l,shiftY:n,tintIntensity:c}=Object.assign({},N.defaults,t);// using specific vertex shader and fragment shader
super(h,q),this.uniforms.waterColor=new Float32Array([0,.18,.54]),this.uniforms.shift=new Float32Array([0,0]),Object.assign(this,{time:i,scale:a,glint:r,billowy:s,color:o,shiftX:l,shiftY:n,tintIntensity:c}),this.zOrder=170,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.waterColor)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.waterColor)}get scale(){return this.uniforms.scale}set scale(e){this.uniforms.scale=e}get glint(){return this.uniforms.glint}set glint(e){this.uniforms.glint=e}get billowy(){return this.uniforms.billowy}set billowy(e){this.uniforms.billowy=e}get tintIntensity(){return this.uniforms.tintIntensity}set tintIntensity(e){this.uniforms.tintIntensity=e}get shiftX(){return this.uniforms.shift[0]}set shiftX(e){this.uniforms.shift[0]=e}get shiftY(){this.uniforms.shift[1]}set shiftY(e){this.uniforms.shift[1]=e}}N.defaults={time:0,glint:.5,scale:70,billowy:.5,color:8361,shiftX:0,shiftY:0,tintIntensity:.2};let V=`
precision mediump float;
precision mediump int;

uniform float time;
uniform vec2 scale;
uniform vec3 color;
uniform int blend;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

#define F4 0.309016994374947451
#define PI 3.14159
#define SPEED 0.01

vec4 blenderVec3(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol; }
    else if (blend == 13) { fCol = fCol + sCol; }
    else { fCol = fCol + sCol; }
    
    return vec4(fCol,1.0);
}

vec4 mod289(vec4 x) 
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float mod289(float x) 
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) 
{
    return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) 
{
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) 
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r) 
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) 
{
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
}

float snoise(vec4 v) 
{
    const vec4  C = vec4( 0.138196601125011,
                          0.276393202250021,
                          0.414589803375032,
                         -0.447213595499958);

    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
      
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
      
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
                        i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                    + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
            + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

float surface( vec4 coord ) 
{
	float n = 0.0;

	n += 0.25 * abs( snoise( coord * 4.0 ) );
	n += 0.5 * abs( snoise( coord * 8.0 ) );
	n += 0.25 * abs( snoise( coord * 16.0 ) );
	n += 0.125 * abs( snoise( coord * 32.0 ) );
	
	return n;
}

void main() 
{
    vec4 pixel = texture2D(uSampler,vTextureCoord);

    // to avoid computation on an invisible pixel
    if (pixel.a == 0.) {
        gl_FragColor = pixel;
        return;
    }

    vec2 uv = vFilterCoord - vec2(0.375*scale.x,0.375*scale.y);
    float s = uv.x * scale.x;
    float t = uv.y * scale.y;
    
    float multiplier = 1.0 / ( 2.0 * PI );
    float nx = cos( s * 2.0 * PI ) * multiplier;
    float ny = cos( t * 2.0 * PI ) * multiplier;
    float nz = sin( s * 2.0 * PI ) * multiplier;
    float nw = sin( t * 2.0 * PI ) * multiplier;

    float surf = surface( vec4( nx, ny, nz, nw ) + time * SPEED );
    vec4 result = vec4( color * vec3( surf ), 1.0 );
    
    gl_FragColor = blenderVec3(blend,pixel,result) * pixel.a;
}
`;class B extends p{constructor(t){let{time:i,color:a,blend:r,dimX:s,dimY:o}=Object.assign({},B.defaults,t);// using specific vertex shader and fragment shader
super(h,V),this.uniforms.color=new Float32Array([1,1,1]),this.uniforms.scale=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,blend:r,dimX:s,dimY:o}),this.zOrder=200,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get dimX(){return this.uniforms.scale[0]}set dimX(e){this.uniforms.scale[0]=e}get dimY(){return this.uniforms.scale[1]}set dimY(e){this.uniforms.scale[1]=e}}B.defaults={time:0,color:16777215,blend:13,dimX:1,dimY:1};let W=`
precision mediump float;

uniform float time;
uniform int blend;
uniform int shieldType;
uniform vec3 color;
uniform vec2 posLight;
uniform vec3 ambientColor;
uniform float intensity;
uniform float lightColorAlpha;
uniform float lightSize;
uniform float scale;
uniform float radius;
uniform float hideRadius;
uniform float discardThreshold;
uniform bool chromatic;
uniform bool alphaDiscard;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

#define SQRT5B20 0.30901699
#define PI 3.14159265
#define TWOPI 6.28318531
#define SPEED 0.01
#define MU_TWOPI 0.15915494309
#define MU_289 0.00346020761
#define MU_3 0.33333333334
#define MU_1_5 0.66666666667

vec3 hsvToRgb(vec3 hsVcolor)
{
    vec4 K = vec4(1., 2.0 * MU_3, 1.0 * MU_3, 3.0);
    vec3 p = abs(fract(hsVcolor.xxx + K.xyz) 
             * 6.0 - K.www);
    return hsVcolor.z 
           * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), hsVcolor.y);
}

vec3 multihue(vec2 uv) 
{
    float h = 0.5 + atan(uv.y, uv.x) * MU_TWOPI;
    vec3 hsv = vec3(h, 1., 1.);
    return hsvToRgb(hsv);
}

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 random2(vec2 p) 
{
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float bornedCos(float minimum, float maximum)
{
    return (maximum-minimum)*(cos(PI*time*0.10 + 1.)*0.5)+minimum;
}

float bornedSin(float minimum, float maximum)
{
    return (maximum-minimum)*(sin(PI*time*0.10 + 1.)*0.5)+minimum;
}

vec4 mod289(vec4 x) 
{
    return x - floor(x * MU_289) * 289.0;
}

float mod289(float x) 
{
    return x - floor(x * MU_289) * 289.0;
}

vec4 permute(vec4 x) 
{
    return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) 
{
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) 
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r) 
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) 
{
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;
}

float snoise(vec4 v) 
{
    const vec4  C = vec4( 0.138196601125011,
                          0.276393202250021,
                          0.414589803375032,
                         -0.447213595499958);

    vec4 i  = floor(v + dot(v, vec4(SQRT5B20)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);

    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
      
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
      
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
                        i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                    + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
            + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

float surface( vec4 coord ) 
{
	float n = 0.0;

	n += 0.25 * abs( snoise( coord * 4.0 ) );
	n += 0.5 * abs( snoise( coord * 8.0 ) );
	n += 0.25 * abs( snoise( coord * 16.0 ) );
	n += 0.125 * abs( snoise( coord * 32.0 ) );
	
	return n;
}

vec4 ambientLight(vec4 pixel, vec2 fragCoord, vec2 posLg) 
{
  vec3 lightColor = (color+vec3(2.)) * MU_3;
  vec2 position = posLg;
  
  float maxDistance = lightSize;
  float distance = distance(fragCoord-posLg, position);
  float value = 1.0 - smoothstep(-0.2, maxDistance, distance);
  
  vec3 ambient = pixel.rgb * color * intensity;
  vec3 light = (lightColor*lightColorAlpha) * clamp(value, 0.0, 1.0);
  vec3 intensity = ambient + light;
  vec3 final = pixel.rgb * intensity;

  return vec4(final, 1.0);
}

vec3 toGray(vec3 color)
{
  float average = (color.r + color.g + color.b)*0.3333333;
  return vec3(average, average, average);
}

vec3 colorize(vec3 grayscale, vec3 color)
{
    return (grayscale * color);
}

vec4 blenderVec3(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol + 0.00001); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol + 0.00001; }
    else if (blend == 13) { fCol = fCol + sCol; return vec4(fCol,0.6); }
    else if (blend == 14) { return mix(fColv4,sColv4,1.-fColv4.a); }
    else if (blend == 15) { return mix(fColv4,sColv4,fColv4.a); }
    else { fCol = fCol + sCol; }
    
    return vec4(fCol,(fColv4.a+sColv4.a)*0.5);
}

float hexDist(vec2 p) 
{
	p = abs(p);
	
    float c = dot(p, normalize(vec2(1,1.73)));
    c = max(c, p.x);
    
    return c;
}

vec4 hexCoords(vec2 uv) 
{
	const vec2 r = vec2(1, 1.73);
    const vec2 h = r*.5;
    
    vec2 a = mod(uv, r)-h;
    vec2 b = mod(uv-h, r)-h;
    vec2 gv = dot(a, a) < dot(b,b) ? a : b;
    
    float x = atan(gv.x, gv.y);
    float y = .65-hexDist(gv);
    vec2 id = uv-gv;
    return vec4(x, y, id.x,id.y);
}

vec4 hexa(vec2 fragCoord)
{
    float t = time;
    
    vec2 uv = fragCoord;
    vec2 uv1 = uv + vec2(0, sin(uv.x*1. +t)*.25);
    
    vec2 uv2 = .5*uv1 + .5*uv + vec2(sin(uv.y*5. + t)*.05, 0);
    float a = 1. + t*0.1;
    float c = cos(a);
    float s = sin(a);
    uv2 *= mat2(c, -s, s, c);
    
    vec3 col = color;
    col += (smoothstep(abs(uv2.y)*MU_1_5, 3.99, hexCoords(uv2*15.).y) * 40.*(sin(t)+1.));
    col += (smoothstep(abs(uv2.x)*MU_1_5, 3.99, hexCoords(uv2*15.).y) * 40.*(cos(t)+1.));

    return vec4(colorize(toGray(clamp(col,0.,2.)),color),1.);
}

vec4 voronoi( in vec2 x, float step1, float step2 ) 
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    vec2 mg, mr;
    float md = 8.0;
    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( time + 6.2831*o );

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    md = 8.0;
    for (int j= -2; j <= 1; j++) {
        for (int i= -2; i <= 1; i++) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( time + 6.2831*o );

            vec2 r = g + o - f;

            if ( dot(mr-r,mr-r)>0.000001 ) {
                md = min(md, dot( 0.6*(mr+r), normalize(r-mr) ));
            }
        }
    }
    vec3 intermediate = vec3(md, mr);
    vec3 final = (intermediate.x*(0.4 + .5*sin(64.0*intermediate.x))*color);
    final = mix( color, final, smoothstep( step1, step2, intermediate.x*18. ) );
    return vec4(final,1.);
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(random(b), random(b + d.yx), f.x), 
	       mix(random(b + d.xy), random(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = 1.;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

float fbm2(vec2 n) 
{
	float total = 0.0, amp = 1.;
	for (int i = 0; i < 2; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 ripples(vec2 suv) 
{
    suv.x += time*0.5;
    vec3 c1 = vec3(0.);
    vec3 c2 = vec3(c1);
    vec3 c3 = vec3(c1);
    vec3 c4 = vec3(color.r*5., color.g*3.333, color.b*2.);
    vec3 c5 = vec3(c3);
    vec3 c6 = vec3(c1);
    vec2 p = suv;
    float q = 2.*fbm2(p + time*2.);
    vec2 r = vec2(fbm2(p + q + ( time  ) - p.x - p.y), fbm2(p + p + ( time )));
    r.x += bornedCos(-0.3,-0.2);
    r.y += 200.*bornedSin(-1.9,1.9);
    
    vec3 c = color * (
        mix( c1, c2, fbm( p + r ) ) + mix( c3, c4, r.x ) - mix( c5, c6, r.y )
    );
    return vec4(c,1.);
}

vec4 fire(vec2 suv) 
{
    vec3 c1 = color+vec3(0.1, 0.0, 0.)*0.666667;
	vec3 c2 = color+vec3(0.7, 0.0, 0.)*0.666667;
	vec3 c3 = color+vec3(0.2, 0.0, 0.)*0.666667;
	vec3 c4 = color+vec3(1.0, 0.9, 0.)*0.666667;
	vec3 c5 = vec3(0.1);
	vec3 c6 = vec3(0.9);
    vec2 uv = suv - vec2(0.92,0.26);
	vec2 p = uv.xy * 8.0;
	float q = fbm(p - time * 0.1);
	vec2 r = vec2(fbm(p + q + time * 0.7 - p.x - p.y), fbm(p + q - time * 0.4));
	vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	return vec4(c * cos(1.57/(1.-0.03) * uv.y), 1.0);
}

vec4 surface4d(vec2 suv)
{
    float s = suv.x + 0.61;
    float t = suv.y + 0.5;
    float nx = cos( s * TWOPI ) * MU_TWOPI;
    float ny = cos( t * TWOPI ) * MU_TWOPI;
    float nz = sin( s * TWOPI ) * MU_TWOPI;
    float nw = sin( t * TWOPI ) * MU_TWOPI;

    float surf = surface( vec4( nx, ny, nz, nw ) + time * 0.03 );
    return vec4( color * vec3( surf ), 1.0 );
}

vec4 noisy(vec2 suv)
{
    vec4 noiseColor;
    noiseColor.rgb = (color.rgb * noise(suv + fbm(suv) + time*0.5));
    noiseColor.a = 1.;
    return clamp(noiseColor,0.,1.);
}

vec2 circuit(vec2 p) {
	p = fract(p);
	float r = 0.3;
	float v = 0.0, g = 1.0;
	float d;
	
	const int iter = 7;
	for(int i = 0; i < iter; i ++)
	{
		d = p.x - r;
		g += pow(clamp(1.0 - abs(d), 0.0, 1.0), 200.0);
		
		if(d > 0.0) {
			p.x = (p.x - r) / (1.8 - r);
		}
		else {
			p.x = p.x;
		}
		p = p.yx;
	}
	v /= float(iter);
	return vec2(g, v);
}

vec4 denseSmoke(vec2 suv)
{
    vec4 noiseColor;
    vec2 uv;
    uv.x = (fbm(suv*2.)-suv.x);
    uv.y = (suv.y+fbm(suv*2.));
    noiseColor.rgb = (color.rgb * min(fbm(uv - time*0.5),fbm(uv)*1.5));
    noiseColor.a = 1.0;
    return clamp(noiseColor,0.,1.);
}

vec4 dancingFume(vec2 suv)
{
    vec4 noiseColor;
    vec2 uv;
    uv.x += noise(suv)+fbm(suv);
    uv.y += noise(suv)+fbm(suv);
    uv *= 0.5;
    noiseColor.rgb = (color.rgb * fbm((uv + suv*0.15) - time));
    noiseColor.a = 1.0;
    return clamp(noiseColor,0.,1.);
}

vec4 hugeSmoke(vec2 suv)
{
    vec4 noiseColor;
    vec2 uv;
    uv.x += sin(suv.y)+fbm(suv);
    uv.y += cos(suv.x)+fbm(suv);
    uv *= 0.5;
    noiseColor.rgb = (color.rgb * fbm((uv + suv) - time));
    noiseColor.a = 1.0;
    return clamp(noiseColor,0.,1.);
}

vec4 grid(vec2 suv)
{
    vec2 uv = suv + vec2(0.,-1.5);
	vec2 cid2 = floor(uv);
	float cid = (cid2.y + cid2.x);

	vec2 dg = circuit(uv);
	float d = dg.x;
	vec3 col1 = (0.5-vec3(max(min(d, 2.0) - 1., 0.))) * color * 2.;
    col1.rgb = sqrt(col1.rgb*0.5);
	vec3 col2 = vec3(max(d - 1.0, 0.0)) * color * 30. ;

	float f = max(0.7 - mod(sin(-uv.y) - cos(-uv.x) + (time * 1.) + (dg.y * 0.2), 0.9), 0.0) * 1.;
	col2 *= f;

    return vec4(col1 + col2, 1.0);
}

vec4 galaxy(vec2 suv)
{
    vec2 uv = suv*0.166666667 
        + vec2(bornedCos(0.0,0.7),
               bornedSin(0.0,0.7));

    float t = 0.44 * time 
            + (( 0.25 + 0.05 * sin( time * 0.44 )) 
            / ( length( uv.xy ) + 0.2 )) * 2.2;
    
    float si = sin( t * 1.5 );
    float co = cos( t * 0.66666667 );
    mat2 matrix = mat2( -co, si, si, co );
    
    float c;
    float v1 = 0.0;
    float v2 = 0.0;
    vec3 uv2 = vec3( uv, 0.0 );
    
    for( int i = 0; i < 50; i++ ) {
        float s = float( i ) * 0.035;
        vec3 p = s * uv2;
        p.xy *= matrix;
        p += vec3( .22,.3, s - 1.5 - sin( t * 0.13 ) * 0.1 );

        for( int i = 0; i < 6; i++ ) {
            p = abs( p ) / dot( p, p ) - 0.659;
        }

        v1 += dot( p,p ) * 0.0045 * ( 1.8 + sin( length( uv.xy * 13.0 ) + 0.5 - t * 0.2 ) );
        v2 += dot( p,p ) * 0.0045 * ( 1.5 + sin( length( uv.xy * 13.5 ) + 2.2 - t * 0.3 ) );
        c = length( p.xy * 0.5 ) * 1.05;
    }
    
    float len = length( uv );
    v1 *= smoothstep( 0.7, 0.0, len );
    v2 *= smoothstep( 0.6, 0.0, len );
    
    float r = clamp( c, 0.0, 1.0 );
    float g = clamp( ( v1 + c ) * 0.25, 0.0, 1.0 );
    float b = clamp( v2, 0.0, 1.0 );
    vec3 col = color * vec3( r, g, b ) + smoothstep( 0.15, 0.0, len ) * 0.9;

    return clamp(vec4( col, 1.0 ),0.,1.);
}

vec2 getSphere(out float alpha, out float r)
{
  vec2 tc = vFilterCoord.xy;
  vec2 p = (-1.0 + 2. * tc) * (1.01 / radius);
  r = dot(p,p);
  r > 0.943 ? alpha = max(min(40.*log(1./r),1.),0.) : alpha = 1.;
  float f = (1.0-sqrt(1.0-r))/(r);
  vec2 uv;
  uv.x = p.x*f;
  uv.y = p.y*f;
  return uv;
}

void computeHideAlpha(out float alpha)
{
  vec2 tc = vFilterCoord.xy;
  vec2 p = (-1.0 + 2. * tc) * (1.01 / hideRadius);
  float r = dot(p,p);
  r > 0.9 ? alpha = 1.-max(min(40.*log(1./r),1.),0.) : alpha = 0.;
}

void main()
{
    float a, r, hideAlpha;
    vec4 result;
    vec4 pixel = texture2D(uSampler, vTextureCoord);

    if (hideRadius > 0.) computeHideAlpha(hideAlpha);
    else hideAlpha = 1.;

    if (pixel.a == 0. && hideAlpha == 0.) {
        discard;
    }

    vec2 uv = getSphere(a, r);

    if (shieldType <= 1) {
        result = ripples(15.*uv*scale);
    } else if (shieldType == 2) {
        result = hexa(uv*scale);
    } else if (shieldType == 3) {
        result = fire(uv/1.5*scale);
    } else if (shieldType == 4) {
        result = voronoi(uv*scale*3.+0.3*cos(time),0.29,0.0);
    } else if (shieldType == 5) {
        result = voronoi(uv*scale*3.+0.3*cos(time),0.0019,1.);
    } else if (shieldType == 6) {
        result = 3.*surface4d(uv*scale);
    } else if (shieldType == 7) {
        result = noisy(uv*20.*scale);
    } else if (shieldType == 8) {
        result = denseSmoke(uv*10.*scale);
    } else if (shieldType == 9) {
        result = dancingFume(uv*20.*scale);
    } else if (shieldType == 10) {
        result = hugeSmoke(uv*5.*scale);
    } else if (shieldType == 11) {
        result = grid(uv*5.*scale);
    } else if (shieldType == 12) {
        result = galaxy(uv*5.*scale);
    } else if (shieldType != 1) {
        result = vec4(color,1.);
    }

    vec4 colorized;
    vec3 chromaOption;
    if (chromatic) {
        vec2 vHue = uv;
        vHue.x -= bornedCos(-0.,+2.2);
        vHue.y -= bornedSin(-0.,+2.2);
        chromaOption = multihue(vHue);
    } else {
        chromaOption = color;
    }
    colorized = (vec4(
                    colorize(
                        toGray(result.rgb), chromaOption), result.a) + result)*0.5;
    vec4 preRenderedResult = clamp(ambientLight(clamp(colorized, 0., 1.)*intensity, uv, posLight-vec2(0.5,0.5)),0.,1.);
    vec4 final = vec4(preRenderedResult.rgb * hideAlpha, 1.);

    if (alphaDiscard && all(lessThanEqual(final.rgb,vec3(discardThreshold)))) {
        if (pixel.a == 0.) discard;
        else {
            gl_FragColor = pixel;
            return;
        }
    }

    gl_FragColor =
            r > 1.0
                ? pixel*(1.-a)
                : (pixel.a < 1. 
                        ? mix( blenderVec3(13, pixel, final), blenderVec3(blend, pixel, final), pixel.a)
                        : blenderVec3(blend, pixel, final) * a);
}
`;class G extends p{constructor(t){let{time:i,color:a,lightAlpha:r,blend:s,shieldType:o,posLightX:l,posLightY:n,lightSize:c,scale:m,intensity:u,radius:d,hideRadius:p,chromatic:f,discardThreshold:g,alphaDiscard:v}=Object.assign({},G.defaults,t);// using specific vertex shader and fragment shader
super(h,W),this.uniforms.color=new Float32Array([1,1,1]),this.uniforms.posLight=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,lightAlpha:r,blend:s,shieldType:o,posLightX:l,posLightY:n,lightSize:c,scale:m,intensity:u,radius:d,hideRadius:p,chromatic:f,discardThreshold:g,alphaDiscard:v}),this.zOrder=2e3,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get lightAlpha(){return this.uniforms.lightColorAlpha}set lightAlpha(e){this.uniforms.lightColorAlpha=e}get shieldType(){return this.uniforms.shieldType}set shieldType(e){this.uniforms.shieldType=Math.floor(e)}get posLightX(){return this.uniforms.posLight[0]}set posLightX(e){this.uniforms.posLight[0]=e}get posLightY(){return this.uniforms.posLight[1]}set posLightY(e){this.uniforms.posLight[1]=e}get lightSize(){return this.uniforms.lightSize}set lightSize(e){this.uniforms.lightSize=e}get scale(){return this.uniforms.scale}set scale(e){this.uniforms.scale=e}get intensity(){return this.uniforms.intensity}set intensity(e){this.uniforms.intensity=e}get radius(){return this.uniforms.radius}set radius(e){this.uniforms.radius=e}get hideRadius(){return this.uniforms.hideRadius}set hideRadius(e){this.uniforms.hideRadius=e}get discardThreshold(){return this.uniforms.discardThreshold}set discardThreshold(e){this.uniforms.discardThreshold=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}get chromatic(){return this.uniforms.chromatic}set chromatic(e){null!=e&&"boolean"==typeof e&&(this.uniforms.chromatic=e)}}G.defaults={time:0,color:12303291,lightAlpha:1,blend:2,shieldType:1,posLightX:.65,posLightY:.25,lightSize:.483,scale:1,intensity:1,radius:1,hideRadius:0,chromatic:!1,discardThreshold:.25,alphaDiscard:!1};let U=`
precision mediump float;

uniform float time;
uniform float alphaImg;
uniform float alphaChr;
uniform float ampX;
uniform float ampY;
uniform int blend;
uniform int nbImage;
uniform sampler2D uSampler;
uniform vec4 inputClamp;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265;

float bornedCos(float mi, float ma) {
    return (ma-mi)*(cos(2.*PI*time*0.2+1.)*0.5)+mi;
}

float bornedSin(float mi, float ma) {
    return (ma-mi)*(sin(2.*PI*time*0.2+1.)*0.5)+mi;
}

vec4 blender(int blend, vec4 fCol, vec4 sCol)
{
    if ( blend == 1) { fCol.rgb = fCol.rgb * sCol.rgb; }
    else if (blend == 2) { fCol.rgb = (1. - (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 3) { fCol.rgb = min(fCol.rgb, sCol.rgb); }
    else if (blend == 4) { fCol.rgb = max(fCol.rgb, sCol.rgb); }
    else if (blend == 5) { fCol.rgb = abs(fCol.rgb - sCol.rgb); }
    else if (blend == 6) { fCol.rgb = 1. - abs(1. - fCol.rgb - sCol.rgb); }
    else if (blend == 7) { fCol.rgb = fCol.rgb + sCol.rgb - (2. * fCol.rgb * sCol.rgb); }
    else if (blend == 8) { fCol.rgb = all(lessThanEqual(fCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb) : (1. - 2. * (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 9) { fCol.rgb = all(lessThanEqual(sCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb) : (1. - 2. * (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 10) { fCol.rgb = all(lessThanEqual(sCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb + fCol.rgb * fCol.rgb * (1. - 2. * sCol.rgb)) : sqrt(fCol.rgb) * (2. * sCol.rgb - 1.) + (2. * fCol.rgb) * (1. - sCol.rgb); }
    else if (blend == 11) { fCol.rgb = fCol.rgb / (1.0 - sCol.rgb); }
    else if (blend == 12) { fCol.rgb = 1.0 - (1.0 - fCol.rgb) / (sCol.rgb)+0.001; }
    else if (blend == 13) { fCol.rgb = fCol.rgb + sCol.rgb; }
    else if (blend == 14) { fCol.rgb = (max(fCol.rgb,sCol.rgb)-(min(fCol.rgb,sCol.rgb)))+abs(fCol.rgb-sCol.rgb);}
    else { fCol.rgb = clamp(fCol.rgb + sCol.rgb,0.,1.); }

    fCol.a = max(fCol.a,sCol.a);
    return fCol;
}

vec4 renderMirror(vec2 translation, vec4 prevpix)
{
    vec2 displaced = vTextureCoord + translation;
    return blender(blend, prevpix, 
                   texture2D(uSampler, clamp(displaced, inputClamp.xy, inputClamp.zw)));
}

void main() 
{
    float x = ampX * bornedCos(0.,1.);
    float y = ampY * bornedSin(0.,1.);
    vec4 renderedPixel;
    vec2 translation;

    if (nbImage >= 1) {
        translation = vec2(x,y);
        renderedPixel = texture2D(uSampler, clamp(vTextureCoord + translation, inputClamp.xy, inputClamp.zw));
    }
    if (nbImage >= 2) {
        translation = 0.90*vec2(-x,y*0.5);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 3) {
        translation = 0.70*vec2(x,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 4) {
        translation = 0.80*vec2(-x*0.6,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 5) {
        translation = 1.20*vec2(-x,y*0.4);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 6) {
        translation = 1.10*vec2(x,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 7) {
        translation = 0.6*vec2(-x*0.4,-y);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 8) {
        translation = 1.3*vec2(-x,y*0.70);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    if (nbImage >= 9) {
        translation = vec2(x*0.5,y*0.85);
        renderedPixel = renderMirror(translation, renderedPixel);
    }
    renderedPixel = renderedPixel*alphaImg;
    gl_FragColor = blender(blend,texture2D(uSampler, vTextureCoord)*alphaChr , renderedPixel);
}
`;class H extends p{constructor(t){let{time:i,blend:a,alphaImg:r,alphaChr:s,nbImage:o,ampX:l,ampY:n}=Object.assign({},H.defaults,t);// using specific vertex shader and fragment shader
super(h,U),Object.assign(this,{time:i,blend:a,alphaImg:r,alphaChr:s,nbImage:o,ampX:l,ampY:n}),this.zOrder=100,this.autoFit=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get alphaImg(){return this.uniforms.alphaImg}set alphaImg(e){this.uniforms.alphaImg=e}get alphaChr(){return this.uniforms.alphaChr}set alphaChr(e){this.uniforms.alphaChr=e}get nbImage(){return this.uniforms.nbImage}set nbImage(e){this.uniforms.nbImage=Math.floor(e)}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get ampX(){return this.uniforms.ampX}set ampX(e){this.uniforms.ampX=e}get ampY(){return this.uniforms.ampY}set ampY(e){this.uniforms.ampY=e}}H.defaults={time:0,blend:4,alphaImg:.5,alphaChr:1,nbImage:4,ampX:.15,ampY:.15};let Z=`
precision mediump float;
precision mediump int;

uniform sampler2D uSampler;
uniform float time;
uniform float intensity;
uniform float divisor;
uniform int blend;
uniform vec2 dimensions;
uniform vec2 anchor;
uniform vec3 color;

varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

const float MU_TWOPI = 0.15915494309;
const float MU_PI5 = 1.59154943092;
const float MU_256 = 0.00390625;

vec4 blender(int blend, vec4 fColv4, vec4 sColv4)
{
    vec3 fCol = vec3(fColv4);
    vec3 sCol = vec3(sColv4);

    if ( blend <= 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol; }
    else if (blend == 13) { fCol = max(fCol,sCol)-(min(fCol,sCol)*0.5)+abs(fCol-sCol);}
    else if (blend >= 14) { fCol = fCol + sCol; }

    return vec4(fCol,fColv4.a);
}

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec2 uv = (vFilterCoord - anchor) / dimensions;

    float len = length(uv * 0.5);
   	float angle = atan(uv.x, uv.y) * MU_TWOPI;
    float beam = fract((angle) * divisor + sin((sqrt(len) * 0.2) - (time*0.5)));
    
    beam  = 2.* cos(beam * MU_PI5);
    beam *= floor(fract(angle * divisor + sin(time - (len * 1.2) * 0.2)) *256.) * MU_256;
    
    float fractburn = fract(beam);

    vec4 color1 = smoothstep(0.0, 1., (beam*(intensity*0.1) + pixel * vec4(color,1.)) / (fractburn == 0. ? fractburn+0.1 : fractburn) * 0.3 );
    vec4 result = blender(blend, pixel, color1);

    gl_FragColor = result*pixel.a;
}
`;class K extends p{constructor(t){let{time:i,color:a,divisor:r,intensity:s,blend:o,anchorX:l,anchorY:n,dimX:c,dimY:m}=Object.assign({},K.defaults,t);// using specific vertex shader and fragment shader
super(h,Z),this.uniforms.color=new Float32Array([1,.4,.1]),this.uniforms.anchor=new Float32Array([.5,-1]),this.uniforms.dimensions=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,divisor:r,intensity:s,blend:o,anchorX:l,anchorY:n,dimX:c,dimY:m}),this.zOrder=130,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get divisor(){return this.uniforms.divisor}set divisor(e){this.uniforms.divisor=e}get intensity(){return this.uniforms.intensity}set intensity(e){this.uniforms.intensity=e}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get anchorX(){return this.uniforms.anchor[0]}set anchorX(e){this.uniforms.anchor[0]=e}get anchorY(){return this.uniforms.anchor[1]}set anchorY(e){this.uniforms.anchor[1]=e}get dimX(){return this.uniforms.dimensions[0]}set dimX(e){this.uniforms.dimensions[0]=e}get dimY(){return this.uniforms.dimensions[1]}set dimY(e){this.uniforms.dimensions[1]=e}}K.defaults={time:0,color:16744464,divisor:40,intensity:.1,blend:8,anchorX:.5,anchorY:-1,dimX:1,dimY:1};let J=`
precision mediump float;
precision mediump int;

uniform sampler2D uSampler;
uniform mat3 filterMatrixInverse;
uniform float time;
uniform float intensity;
uniform float scale;
uniform int blend;
uniform bool spectral;
uniform bool alphaDiscard;
uniform vec3 color;

varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

#define PI 3.14159265359

#define NUM_OCTAVES 3

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

vec4 blenderVec3(int blend, vec4 fColv4, vec3 sCol)
{
    vec3 fCol = vec3(fColv4);
    if ( blend == 1) { fCol = fCol * sCol; }
    else if (blend == 2) { fCol = (1. - (1. - fCol) * (1. - sCol)); }
    else if (blend == 3) { fCol = min(fCol, sCol); }
    else if (blend == 4) { fCol = max(fCol, sCol); }
    else if (blend == 5) { fCol = abs(fCol - sCol); }
    else if (blend == 6) { fCol = 1. - abs(1. - fCol - sCol); }
    else if (blend == 7) { fCol = fCol + sCol - (2. * fCol * sCol); }
    else if (blend == 8) { fCol = all(lessThanEqual(fCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 9) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol) : (1. - 2. * (1. - fCol) * (1. - sCol)); }
    else if (blend == 10) { fCol = all(lessThanEqual(sCol, vec3(0.5, 0.5, 0.5))) ? (2. * fCol * sCol + fCol * fCol * (1. - 2. * sCol)) : sqrt(fCol) * (2. * sCol - 1.) + (2. * fCol) * (1. - sCol); }
    else if (blend == 11) { fCol = fCol / (1.0 - sCol + 0.00001); }
    else if (blend == 12) { fCol = 1.0 - (1.0 - fCol) / sCol + 0.00001; }
    else if (blend == 13) { fCol = max(fCol,sCol)-(min(fCol,sCol)*0.5)+abs(fCol-sCol);}
    else if (blend >= 14) { fCol = fCol + sCol; }
    
    return vec4(fCol,fColv4.a);
}

void main() {
    
    float distortion1 = fbm( 
        vec2( fbm(  vFilterCoord * 2.5 * scale + time*0.5),
              fbm( (-vFilterCoord - vec2(0.01)) * 5. * scale + time*0.3333334) )
                    );
    
    float distortion2 = fbm( 
        vec2( fbm( -vFilterCoord * 5. * scale + time*0.5),
              fbm(  (vFilterCoord + vec2(0.01)) * 2.5 * scale + time*0.3333334) )
                    );
    
    vec2 uv = vFilterCoord;
    
    uv.x += 0.8*sin(min(distortion1*0.25,distortion2*0.25));
    uv.y += 0.8*cos(min(distortion1*0.25,distortion2*0.25));
    uv *= 1. + 0.11*(cos(sqrt(max(distortion1, distortion2))+1.)*0.5);
    uv -= vec2(0.036,0.81); 

    vec2 mappedCoord = (filterMatrixInverse * vec3(uv, 1.0)).xy;
    
    vec4 pixel = texture2D(uSampler, mappedCoord);
    vec3 aColor = color;
    if (alphaDiscard) aColor.rgb *= mix(distortion1,distortion2,0.5);
    else aColor.rgb *= min(distortion1,distortion2);
    pixel.rgb += aColor*intensity;

    float a = pixel.a;

    if (spectral) pixel.a = max(distortion1,distortion2)*3.75;
    if (alphaDiscard && all(lessThanEqual(pixel.rgb,vec3(0.50)))) discard;

    gl_FragColor = blenderVec3(blend,pixel,color*0.3333334) * min(pixel.a,a);
}
`;class Q extends p{constructor(t){let{time:i,color:a,scale:r,intensity:s,blend:o,spectral:l,alphaDiscard:n}=Object.assign({},Q.defaults,t);// using specific vertex shader and fragment shader
super(h,J),this.uniforms.color=new Float32Array([.1,.45,1]),Object.assign(this,{time:i,color:a,scale:r,intensity:s,blend:o,spectral:l,alphaDiscard:n}),this.zOrder=180,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get scale(){return this.uniforms.scale}set scale(e){this.uniforms.scale=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get intensity(){return this.uniforms.intensity}set intensity(e){this.uniforms.intensity=e}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get spectral(){return this.uniforms.spectral}set spectral(e){null!=e&&"boolean"==typeof e&&(this.uniforms.spectral=e)}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}Q.defaults={time:0,color:366079,scale:1,intensity:5,blend:4,spectral:!1,alphaDiscard:!1};let ee=`
precision mediump float;

uniform sampler2D uSampler;
uniform float time;
uniform float scale;
uniform float auraIntensity;
uniform float subAuraIntensity;
uniform float threshold;
uniform int auraType;
uniform bool holes;
uniform vec2 thickness;
uniform vec4 color;
uniform vec4 inputSize;
uniform vec4 inputClamp;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const int NUM_OCTAVES = 4;
const float PI = 3.14159265358;
const float TWOPI = 6.28318530717;
const float MAX_TOTAL_ALPHA = 17.2787595915;

float rand(vec2 uv)
{
    return fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p)
{
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) 
{
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

vec4 outlining() 
{
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float maxAlpha = 0.;
    vec2 displaced;
    for (float angle = 0.; angle <= TWOPI; angle += 0.3141592653) {
        displaced.x = vTextureCoord.x + thickness.x * cos(angle);
        displaced.y = vTextureCoord.y + thickness.y * sin(angle);
        curColor = texture2D(uSampler, clamp(displaced, inputClamp.xy, inputClamp.zw));
        maxAlpha = max(maxAlpha, curColor.a);
    }
    float resultAlpha = max(maxAlpha, ownColor.a);
    return vec4((ownColor.rgb + color.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);

}

vec4 glowing() 
{
	vec2 px = inputSize.zw;

    float totalAlpha = 0.0;
    float outerStrength = 6.;

    vec2 direction;
    vec2 displaced;
    vec4 curColor;

    for (float angle = 0.0; angle < TWOPI; angle += 0.3141592653) {
       direction = vec2(cos(angle), sin(angle)) * px;

       for (float curDistance = 0.0; curDistance < 10.; curDistance++) {
           displaced = clamp(vTextureCoord + direction * 
                   (curDistance + 1.0), inputClamp.xy, inputClamp.zw);

           curColor = texture2D(uSampler, displaced);
           totalAlpha += (10. - curDistance) * curColor.a;
       }
    }
    
    curColor = texture2D(uSampler, vTextureCoord);

    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);
    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);
    float outerGlowStrength = min(1.0 - curColor.a, outerGlowAlpha);

    vec4 outerGlowColor = (outerGlowStrength * (color.rgba*0.1) );

    float resultAlpha = outerGlowAlpha;
    return vec4(color.rgb * resultAlpha, resultAlpha);
}

vec4 ripples(vec2 suv) 
{
    suv.x += time/2.;
    vec3 c1 = ( 0.0 ) * (color.rgb*10.);
    vec3 c2 = vec3(c1);
    vec3 c3 = vec3(c1);
    vec3 c4 = vec3( color.r*5., color.g*3.3333, color.b*2. );
    vec3 c5 = vec3(c3);
    vec3 c6 = vec3(c1);
    vec2 p = suv;
    float q = 2.*fbm(p + time*0.2);
    vec2 r = vec2(fbm(p + q + ( time*0.1  ) - p.x - p.y), fbm(p + p + ( time*0.1 )));
    vec3 c = color.rgb * (
        mix( c1, c2, fbm( p + r ) ) + mix( c3, c4, r.x ) - mix( c5, c6, r.y )
    );
    return vec4(c,1.);
}

vec4 noisy(vec2 suv)
{
    vec4 noiseColor;
    noiseColor.rgb = (color.rgb * noise(suv + fbm(suv) + time));
    noiseColor.a = 1.;
    return clamp(noiseColor,0.,1.);
}

void main(void) 
{

    vec4 pixel = texture2D(uSampler,vTextureCoord);

    if (pixel.a == 1.) {
        gl_FragColor =  pixel;
    } else {
        vec4 glowlevel = glowing();
        vec4 outlinelevel = outlining();
        vec4 aura;
        
        if (auraType <= 1) {
            aura = ripples(vFilterCoord*20.*scale);
        } else {
            aura = noisy(vFilterCoord*20.*scale);
        }

        vec4 effect;
        effect = ((glowlevel*subAuraIntensity)*0.1) + ((outlinelevel*auraIntensity)*0.8);

        if (effect.a >= 0.) {effect.rgb = aura.rgb*(max(effect.a,0.));}

        float intensity = effect.r + effect.g + effect.b;
	    if(intensity < threshold && effect.a != 0.) {
            if (holes) {discard;}
            effect.rgb = (color.rgb)*(effect.a*0.5);
        } 

        gl_FragColor =  pixel + effect * (1.-pixel.a);
    }
}
`;class et extends p{constructor(t){let{time:i,color:a,thickness:r,scale:s,auraIntensity:o,subAuraIntensity:l,discard:n,threshold:c,auraType:m}=Object.assign({},et.defaults,t);// using specific vertex shader and fragment shader
super(h,ee),this.uniforms.color=new Float32Array([1,.4,.1,1]),this.uniforms.thickness=new Float32Array([.01,.01]),Object.assign(this,{time:i,color:a,thickness:r,scale:s,auraIntensity:o,subAuraIntensity:l,discard:n,threshold:c,auraType:m}),this.zOrder=80,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get scale(){return this.uniforms.scale}set scale(e){this.uniforms.scale=e}get auraIntensity(){return this.uniforms.auraIntensity}set auraIntensity(e){this.uniforms.auraIntensity=e}get subAuraIntensity(){return this.uniforms.subAuraIntensity}set subAuraIntensity(e){this.uniforms.subAuraIntensity=e}get threshold(){return this.uniforms.threshold}set threshold(e){this.uniforms.threshold=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get discard(){return this.uniforms.holes}set discard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.holes=e)}get auraType(){return this.uniforms.auraType}set auraType(e){this.uniforms.auraType=Math.floor(e)}apply(e,t,i,a){this.uniforms.thickness[0]=this.thickness*this.targetPlaceable.worldTransform.a/t._frame.width,this.uniforms.thickness[1]=this.thickness*this.targetPlaceable.worldTransform.a/t._frame.height,super.apply(e,t,i,a)}}et.defaults={time:0,color:16744464,thickness:5,scale:1,auraIntensity:1,subAuraIntensity:1,discard:!1,threshold:.5,auraType:1};class ei extends PIXI.filters.PixelateFilter{constructor(t){super(),this.enabled=!1,this.animated={},this.sizeX=5,this.sizeY=5,this.zOrder=20,this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}handleTransform(){this.size.x=this.sizeX*this.targetPlaceable.worldTransform.a,this.size.y=this.sizeY*this.targetPlaceable.worldTransform.a}}let ea=`
precision mediump float;

uniform float time;
uniform float thickness;
uniform float div1;
uniform float div2;
uniform float tear;
uniform float amplitude;
uniform bool alphaDiscard;
uniform vec2 anchor;
uniform vec3 color;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265358;

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0., 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(random(b), random(b + d.yx), f.x), 
	       mix(random(b + d.xy), random(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < 2; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 spiderweb()
{
    vec2 coord = vFilterCoord.xy + anchor;

    float t = floor(time * 0.01) * 7.3962;

    vec2 sc = (coord.xy - 1.) * 0.5;
    float phi = atan(sc.y, sc.x + 1e-6);
    vec2 pc = vec2(fract(phi / (PI * 2.)), length(sc));
    
    float h_divnum = div1;
    float s_divnum = div2;
    
    float ddth = fbm(vec2(pc.x*h_divnum,pc.x*20.*pow(length(sc*0.5),2.))*3.);
    
    float h_rand = 0.3+0.0895*(0.1*cos(time)+010.9)*tear;
    float s_rand = .355*(0.2*cos(time)+1.);
    
    float l = pc.y+ cos(ddth*0.5) * (h_rand - 0.4) + ddth*(s_rand - 0.5)*0.2;
    
    float ts = 0.05;
    float a = smoothstep(abs(sin(( pc.x*PI*2.  )  * s_divnum) ),-.1,thickness * ts );
    float b = smoothstep(abs(sin(( pc.y*PI*2. + h_rand + l)  * h_divnum ) ),-.1,thickness * ts );
    float s = a*b*2.;
    float m = alphaDiscard ? 1. : 2.25;
    return vec4(color.rgb*m,2.)-vec4(s,s,s,1.);
}

void main() 
{
    vec4 pixel = texture2D(uSampler,vTextureCoord);
    vec4 result = max(spiderweb(),pixel)*pixel.a;
    if (alphaDiscard && result.rgb == vec3(0.)) discard;
    gl_FragColor = result;
}
`;class er extends p{constructor(t){let{time:i,anchorX:a,anchorY:r,color:s,thickness:o,div1:l,div2:n,tear:c,amplitude:m,alphaDiscard:u}=Object.assign({},er.defaults,t);// using specific vertex shader and fragment shader
super(h,ea),this.uniforms.anchor=new Float32Array([.5,-1]),this.uniforms.color=new Float32Array([.75,.75,.75]),Object.assign(this,{time:i,anchorX:a,anchorY:r,color:s,thickness:o,div1:l,div2:n,tear:c,amplitude:m,alphaDiscard:u}),this.zOrder=260,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get anchorX(){return this.uniforms.anchor[0]}set anchorX(e){this.uniforms.anchor[0]=.5}get anchorY(){return this.uniforms.anchor[1]}set anchorY(e){this.uniforms.anchor[1]=.5}get thickness(){return this.uniforms.thickness}set thickness(e){this.uniforms.thickness=e}get tear(){return this.uniforms.tear}set tear(e){this.uniforms.tear=e}get amplitude(){return this.uniforms.amplitude}set amplitude(e){this.uniforms.amplitude=e}get div1(){return this.uniforms.div1}set div1(e){this.uniforms.div1=e}get div2(){return this.uniforms.div2}set div2(e){this.uniforms.div2=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}er.defaults={time:0,anchorX:.5,anchorY:.5,color:12303291,thickness:1,div1:10,div2:10,tear:.54,amplitude:.8,alphaDiscard:!1};let es=`
precision mediump float;
precision mediump int;

uniform vec3 color;
uniform float time;
uniform float amplitude;
uniform float intensity;
uniform bool alphaDiscard;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

#define PI 3.14159265
#define OCTAVES 3

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float bornedCos(float minimum, float maximum)
{
    return (maximum-minimum)*(cos(2.*PI*time*0.05 + 1.)*0.5)+minimum;
}

float bornedSin(float minimum, float maximum)
{
    return (maximum-minimum)*(sin(2.*PI*time*0.05 + 1.)*0.5)+minimum;
}

float noise(vec2 n) 
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(random(b), random(b + d.yx), f.x), 
	       mix(random(b + d.xy), random(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) 
{
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < OCTAVES; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec4 ripples(vec2 suv) 
{
    suv.x += time*0.5;
    vec3 c1 = color*intensity;
    vec3 c2 = vec3(0.);
    vec3 c3 = vec3(c1);
    vec3 c4 = vec3(color.r*3.333, color.g*3.333, color.b*3.333);
    vec3 c5 = vec3(c3);
    vec3 c6 = vec3(c1);
    vec2 p = suv;
    float q = 2. * fbm(p + time * 2.);
    vec2 r = vec2(fbm(p + q + ( time  ) - p.x - p.y), fbm(p + p + ( time )));
    r.x += bornedCos(-0.3,-0.2);
    r.y += 200.*bornedSin(-1.9,1.9);
    
    vec3 c = color * (
        mix( c1, c2, fbm( p + r ) ) + mix( c3, c4, r.x ) - mix( c5, c6, r.y )
    );
    return vec4(c,1.);
}

void main() {

    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec4 result = max(ripples(15.* vFilterCoord),pixel);
    if (alphaDiscard && all(lessThanEqual(result.rgb,vec3(0.40)))) discard;
    gl_FragColor = result*pixel.a;
}
`;class eo extends p{constructor(t){let{time:i,color:a,amplitude:r,intensity:s,alphaDiscard:o,_octaves:l}=Object.assign({},eo.defaults,t);"number"!=typeof l&&(l=eo.defaults._octave),// using specific vertex shader and fragment shader
super(h,es.replace("#define OCTAVES 3",`#define OCTAVES ${l}`)),this.uniforms.color=new Float32Array([.75,.75,.75]),Object.assign(this,{time:i,color:a,amplitude:r,intensity:s,alphaDiscard:o}),this.zOrder=250,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get amplitude(){return this.uniforms.amplitude}set amplitude(e){this.uniforms.amplitude=e}get intensity(){return this.uniforms.intensity}set intensity(e){this.uniforms.intensity=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}eo.defaults={time:0,color:12303291,amplitude:1,intensity:.001,alphaDiscard:!1,_octave:3};let el=`
precision mediump float;

uniform float time;
uniform float scale;
uniform float distortion;
uniform bool alphaDiscard;
uniform vec3 color;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float PI = 3.14159265358;

float rand(vec2 c)
{
	return fract( sin( dot( c.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

vec2 rand2(vec2 st)
{
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(cos(st)*43758.5453123);
}

vec3 toGray(vec3 color)
{
  float average = (color.r + color.g + color.b)*0.3333333;
  return vec3(average, average, average);
}

vec3 colorize(vec3 grayscale, vec3 color)
{
    return (grayscale * color);
}

float noise (vec2 st) 
{
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( rand2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( rand2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( rand2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( rand2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float circle(vec2 pos, float radius, float glow)
{
    float sdf = length(pos);
    sdf = smoothstep(radius-0.700,radius,sdf);
    float circles = 1.0 - smoothstep(0.0,1.0,sdf*1.280);
    float glows = exp(-sdf*4.496) * glow * (3.0 - circles);
    return circles+glows;
}

vec4 globes()
{
    vec2 st = (vFilterCoord - 0.5);
    st *= scale;
    vec2 uv = st;
    float noisest = noise(vec2(uv.x - time,uv.y - time));
    uv += noisest*distortion;
    uv -= vec2( noise(vec2(time)*0.2)*4.0,-time*0.01);
    
    vec3 color = vec3(0.);
    
    
    vec2 pos = fract(uv)-0.5;
    vec2 id = floor(uv);

    
    for(int y = -1; y <= 1; y++){
        for(int x = -1; x <= 1; x++){
            vec2 neighbour = vec2(x,y);
            vec2 rand2 = rand2(id+neighbour);
            float a = noise(rand2+time*2.8);
            vec2 offset = 0.5*(sin(time + rand2*5.28))*2.2;
            float size = rand(id+neighbour)*0.75 + a*0.15;
            color += circle(pos-neighbour+offset,size,size*1.400)*0.143 * vec3(rand2.x*7.884,7.2,rand2.y*6.832);
        }
    }
    
    return vec4(color,1.0);
}

void main() {
    vec4 pixel = texture2D(uSampler,vTextureCoord);

    vec4 tinyGlobes = vec4(colorize(toGray(globes().rgb*1.5),color*1.5),1.);

    bool belowThreshold = all(lessThanEqual(tinyGlobes.rgb,vec3(0.6)));
    if (alphaDiscard && belowThreshold) discard;
    else if (belowThreshold) tinyGlobes = pixel;

    gl_FragColor = max(tinyGlobes,pixel)*pixel.a;
}
`;class en extends p{constructor(t){let{time:i,color:a,scale:r,distortion:s,alphaDiscard:o}=Object.assign({},en.defaults,t);// using specific vertex shader and fragment shader
super(h,el),this.uniforms.color=new Float32Array([.75,.75,.75]),Object.assign(this,{time:i,color:a,scale:r,distortion:s,alphaDiscard:o}),this.zOrder=270,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get scale(){return this.uniforms.scale}set scale(e){this.uniforms.scale=e}get distortion(){return this.uniforms.distortion}set distortion(e){this.uniforms.distortion=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}}en.defaults={time:0,color:11153488,scale:20,distortion:.25,alphaDiscard:!1};let ec=`
precision mediump float;

uniform float rotation;
uniform float twRadius;
uniform float twAngle;
uniform float bpRadius;
uniform float bpStrength;
uniform vec2 scale;
uniform vec2 translation;
uniform vec2 pivot;
uniform vec4 inputClamp;
uniform sampler2D uSampler;
uniform mat3 filterMatrixInverse;

varying vec2 vFilterCoord;

const float PI = 3.1415927;

vec2 morphing(in vec2 uv) {
    float dist = length(uv);

    // twist effect
    if (dist < twRadius) {
        float ratioDist = (twRadius - dist) / twRadius;
        float angleMod = ratioDist * ratioDist * twAngle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    }

    // bulge pinch effect
    if (dist < bpRadius) {
        float percent = dist / bpRadius;
        if (bpStrength > 0.) {
            uv *= mix(1.0, smoothstep(0., bpRadius / dist, percent), bpStrength * 0.75);
        } else {
            uv *= mix(1.0, pow(percent, 1.0 + bpStrength * 0.75) * bpRadius / dist, 1.0 - percent);
        }
    }

    return uv;
}

vec2 transform(in vec2 uv) {
    float angle = -(PI * rotation * 0.005555555555);
    uv -= pivot;
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    uv *= mat2(scale.x, 0.0, 0.0, scale.y);
    uv = morphing(uv);
    uv += pivot;

    return uv;
}

void main() {
    vec2 uv = vFilterCoord + translation;
    uv = transform(uv);
    vec2 mappedCoord = (filterMatrixInverse * vec3(uv, 1.0)).xy;
    vec4 pixel = texture2D(uSampler,clamp(mappedCoord, inputClamp.xy, inputClamp.zw));
    gl_FragColor = pixel;
}
`;class em extends p{constructor(t){let{rotation:i,twRadiusPercent:a,twAngle:r,twRotation:s,bpRadiusPercent:o,bpStrength:l,scale:n,scaleX:c,scaleY:m,pivotX:u,pivotY:d,translationX:p,translationY:f}=Object.assign({},em.defaults,t);super(h,ec),this.uniforms.scale=new Float32Array([1,1]),this.uniforms.pivot=new Float32Array([.5,.5]),this.uniforms.translation=new Float32Array([0,0]),Object.assign(this,{rotation:i,twRadiusPercent:a,twAngle:r,twRotation:s,bpRadiusPercent:o,bpStrength:l,scale:n,scaleX:c,scaleY:m,pivotX:u,pivotY:d,translationX:p,translationY:f}),this.zOrder=1e3,this.autoFit=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get rotation(){return this.uniforms.rotation}set rotation(e){this.uniforms.rotation=e}get twRadiusPercent(){return 200*this.uniforms.twRadius}set twRadiusPercent(e){this.uniforms.twRadius=e/200}get twAngle(){return this.uniforms.twAngle}set twAngle(e){this.uniforms.twAngle=e}get twRotation(){return this.uniforms.twAngle*(180/Math.PI)}set twRotation(e){this.uniforms.twAngle=e*(Math.PI/180)}get bpRadiusPercent(){return 200*this.uniforms.bpRadius}set bpRadiusPercent(e){this.uniforms.bpRadius=e/200}get bpStrength(){return this.uniforms.bpStrength}set bpStrength(e){this.uniforms.bpStrength=e}get scale(){// a little hack (we get only x)
return this.uniforms.scale[0]}set scale(e){this.uniforms.scale[1]=this.uniforms.scale[0]=e}get scaleX(){return this.uniforms.scale[0]}set scaleX(e){this.uniforms.scale[0]=e}get scaleY(){return this.uniforms.scale[1]}set scaleY(e){this.uniforms.scale[1]=e}get pivotX(){return this.uniforms.pivot[0]}set pivotX(e){this.uniforms.pivot[0]=e}get pivotY(){return this.uniforms.pivot[1]}set pivotY(e){this.uniforms.pivot[1]=e}get translationX(){return this.uniforms.translation[0]}set translationX(e){this.uniforms.translation[0]=e}get translationY(){return this.uniforms.translation[1]}set translationY(e){this.uniforms.translation[1]=e}}em.defaults={rotation:0,twRadiusPercent:0,twAngle:0,bpRadiusPercent:0,bpStrength:0,scaleX:1,scaleY:1,pivotX:.5,pivotY:.5,translationX:0,translationY:0};let eu=`
precision mediump float;

uniform float time;
uniform float seed;
uniform float spread;
uniform float splashFactor;
uniform int blend;
uniform vec2 dimensions;
uniform vec2 anchor;
uniform vec3 color;
uniform bool cut;
uniform bool textureAlphaBlend;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

float random(vec2 n) 
{ 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec4 blender(int blend, vec4 fCol, vec4 sCol)
{
    if ( blend == 1) { fCol.rgb = fCol.rgb * sCol.rgb; }
    else if (blend == 2) { fCol.rgb = (1. - (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 3) { fCol.rgb = min(fCol.rgb, sCol.rgb); }
    else if (blend == 4) { fCol.rgb = max(fCol.rgb, sCol.rgb); }
    else if (blend == 5) { fCol.rgb = abs(fCol.rgb - sCol.rgb); }
    else if (blend == 6) { fCol.rgb = 1. - abs(1. - fCol.rgb - sCol.rgb); }
    else if (blend == 7) { fCol.rgb = fCol.rgb + sCol.rgb - (2. * fCol.rgb * sCol.rgb); }
    else if (blend == 8) { fCol.rgb = all(lessThanEqual(fCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb) : (1. - 2. * (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 9) { fCol.rgb = all(lessThanEqual(sCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb) : (1. - 2. * (1. - fCol.rgb) * (1. - sCol.rgb)); }
    else if (blend == 10) { fCol.rgb = all(lessThanEqual(sCol.rgb, vec3(0.5, 0.5, 0.5))) ? (2. * fCol.rgb * sCol.rgb + fCol.rgb * fCol.rgb * (1. - 2. * sCol.rgb)) : sqrt(fCol.rgb) * (2. * sCol.rgb - 1.) + (2. * fCol.rgb) * (1. - sCol.rgb); }
    else if (blend == 11) { fCol.rgb = fCol.rgb / (1.0 - sCol.rgb); }
    else if (blend == 12) { fCol.rgb = 1.0 - (1.0 - fCol.rgb) / (sCol.rgb)+0.001; }
    else if (blend == 13) { fCol.rgb = fCol.rgb + sCol.rgb; }
    else if (blend == 14) { fCol.rgb = (max(fCol.rgb,sCol.rgb)-(min(fCol.rgb,sCol.rgb)))+abs(fCol.rgb-sCol.rgb);}
    else { fCol.rgb = clamp(fCol.rgb + sCol.rgb,0.,1.); }

    fCol.a = max(fCol.a,sCol.a);
    return fCol;
}

vec3 splash(vec2 g)
{
	vec2 uv = (12.*(2.*g-1.)*.2) / dimensions;

    float a = abs(atan(uv.x,uv.y) * splashFactor);   
	vec3 iuv = vec3(uv.x,uv.y,a);

	float cseed = sin(1.+fract(abs(random(vec2(seed*0.9854,seed*0.3541)))));
    vec3 uvw = iuv;

	iuv = 1. - abs(1. - mod(uvw - time*0.1, 2.));
	
    float initLen = length(iuv);
    float nLen = initLen;
    float tot = 0.;
    
    for (int i=0; i < 12; i++) 
	{
		iuv = abs(iuv) / (initLen*initLen) - cseed;
		nLen = length(iuv);
		tot += abs(nLen-initLen);
		initLen = nLen;
    }
    
    float fc = tot + 1.0;
	fc = 1.-smoothstep(fc, fc+1.9, spread/dot(uv,uv));
	
	return vec3(1.-fc)*color;
}

void main() {
    vec4 pixel = texture2D(uSampler,vTextureCoord);
    vec3 splashed = splash(vFilterCoord - anchor);

    if (splashed == vec3(0.0))
    {
        if (pixel.a > 0. && !cut)
        {
            gl_FragColor = pixel;
            return;
        }
        else if (cut) discard;
    }

    vec4 splashed4 = vec4(splashed,1.);
    vec4 blendResult = mix(blender(blend, pixel, splashed4),splashed4,1.-pixel.a);
    gl_FragColor = (textureAlphaBlend ? blendResult * pixel.a : blendResult);
}
`;class ed extends p{constructor(t){let{time:i,seed:a,spread:r,splashFactor:s,color:o,dimX:l,dimY:n,blend:c,cut:m,textureAlphaBlend:u,anchorX:d,anchorY:p}=Object.assign({},ed.defaults,t);// using specific vertex shader and fragment shader
super(h,eu),this.uniforms.color=new Float32Array([1,.05,.05]),this.uniforms.dimensions=new Float32Array([1,1]),this.uniforms.anchor=new Float32Array([0,0]),Object.assign(this,{time:i,seed:a,spread:r,splashFactor:s,color:o,dimX:l,dimY:n,blend:c,cut:m,textureAlphaBlend:u,anchorX:d,anchorY:p}),this.zOrder=5,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get seed(){return this.uniforms.seed}set seed(e){this.uniforms.seed=e}get spread(){return this.uniforms.spread}set spread(e){this.uniforms.spread=e}get splashFactor(){return this.uniforms.splashFactor}set splashFactor(e){this.uniforms.splashFactor=e}get dimX(){return this.uniforms.dimensions[0]}set dimX(e){this.uniforms.dimensions[0]=e}get dimY(){return this.uniforms.dimensions[1]}set dimY(e){this.uniforms.dimensions[1]=e}get anchorY(){return this.uniforms.anchor[1]+.5}set anchorY(e){this.uniforms.anchor[1]=e-.5}get anchorX(){return this.uniforms.anchor[0]+.5}set anchorX(e){this.uniforms.anchor[0]=e-.5}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get cut(){return this.uniforms.cut}set cut(e){null!=e&&"boolean"==typeof e&&(this.uniforms.cut=e)}get textureAlphaBlend(){return this.uniforms.textureAlphaBlend}set textureAlphaBlend(e){null!=e&&"boolean"==typeof e&&(this.uniforms.textureAlphaBlend=e)}}ed.defaults={time:2e3*Math.random(),color:15729925,seed:.1,spread:5,splashFactor:2,dimX:1,dimY:1,blend:8,cut:!1,textureAlphaBlend:!1,anchorX:.5,anchorY:.5};let ep=`#version 300 es
precision mediump float;

uniform float progress;
uniform float magnify;
uniform int type;
uniform vec4 inputClamp;
uniform vec4 inputClampTarget;
uniform sampler2D uSampler;
uniform sampler2D uSamplerTarget;
uniform mat3 filterMatrixInverse;

in vec2 vTextureCoord;
in vec2 vTextureCoordExtra;
in vec2 vFilterCoord;

out vec4 outputColor;

const float PI = 3.14159265358;

float getClip(vec2 uv) {
    return step(3.5,
       step(inputClampTarget.x, uv.x) +
       step(inputClampTarget.y, uv.y) +
       step(uv.x, inputClampTarget.z) +
       step(uv.y, inputClampTarget.w));
}

vec4 getFromColor(vec2 uv) {
    return texture(uSampler,clamp(uv,inputClamp.xy,inputClamp.zw));
}

vec4 getToColor(vec2 uv) {
    return texture(uSamplerTarget,clamp(uv,inputClampTarget.xy,inputClampTarget.zw))*getClip(uv);
}

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 offset(float progress, float x, float theta, float str) {
    float shifty = str*progress*cos(10.0*(progress+x));
    return vec2(0, shifty);
}

vec2 roffset(float progress, float x, float theta, float str) {
    float shifty = (1.-progress)*str*progress*cos(10.0*(progress+x));
    return vec2(0, shifty);
}

float noise(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy * progress, vec2(a, b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 morph(vec2 uv, vec2 uvt) {
    vec4 ca = getFromColor(uv);
    vec4 cb = getToColor(uvt);
    vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);
    vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);
    vec2 oc = mix(oa,ob,0.5)*0.1;
    float w0 = progress;
    float w1 = 1.0-w0;
    vec2 sourceMappedCoord = (filterMatrixInverse * vec3(vFilterCoord+(oc*0.4)*w0, 1.0)).xy;
    vec4 fromcol = getFromColor(sourceMappedCoord);
    vec4 tocol = getToColor(uvt-oc*w1);
    float a = mix(ca.a, cb.a, progress);
    return mix(fromcol, tocol, progress)*a;
}

vec4 waterdrop(vec2 uv, vec2 uvt) {
    vec2 dirt = uvt - vec2(.5);
    float distt = length(dirt);
    if (distt > progress) {
        return mix(getFromColor(uv), getToColor(uvt), progress);
    } else {
        vec2 shiftuvt = dirt * sin(distt * 60. - progress * 20.);
        vec2 fuv = (filterMatrixInverse * vec3(vFilterCoord + (shiftuvt*(1.-progress)), 1.0)).xy;
        return mix(getFromColor(fuv), getToColor(uvt + (shiftuvt*(1.-progress))), progress);
    }
}

vec4 dreamy(vec2 uv, vec2 uvt) {
    return mix(getFromColor(uv + offset(progress, uv.x, 0.0, 0.03)), 
               getToColor(uvt + offset(1.0-progress, uvt.x, 3.14, 0.03)), 
               progress);
}

vec2 swirluv(vec2 uv) {
    vec2 xy = 2.* uv - 1.;
    float fdist = length(xy);
    if (fdist > 1.) return uv;
    uv -= vec2( 0.5, 0.5 );
    float dist = length(uv);
    if ( dist < 1. ) {
	    float pct = (1. - dist);
	    float a = ( progress <= 0.5 ) ? mix( 0.0, 1.0, progress*2. ) : mix( 1.0, 0.0, (progress-0.5)*2. );
	    float t = pct * pct * a * 5.0 * 3.14159;
	    float s = sin( t );
	    float c = cos( t );
	    uv = vec2(dot(uv,vec2(c,-s)),dot(uv,vec2(s,c)));
    }
    uv += vec2(0.5,0.5);
    return uv;
}

vec4 swirl(vec2 uv, vec2 uvt) {
    vec2 suvfrom = swirluv(vFilterCoord);
    vec2 suvto = swirluv(uvt);
    vec2 sourceMappedCoord = (filterMatrixInverse * vec3(suvfrom, 1.0)).xy;
    vec4 fscol = getFromColor(sourceMappedCoord);
    vec4 ftcol = getToColor(suvto);
    return mix( fscol, ftcol, progress );
}

vec4 crosswarp(vec2 uv, vec2 uvt) {
    float x = progress;
    x = smoothstep(.0,1.0,(x*2.0+uv.x-1.0));
    vec4 rawfscol = getFromColor(uv);
    vec4 fscol = getFromColor((uv-.5)*(1.-x)+.5);
    vec4 ftcol = getToColor(uvt);
    return mix(fscol, ftcol, x)*mix(rawfscol.a,ftcol.a,progress);
}

vec4 tvnoise(vec2 uv, vec2 uvt) {
    vec4 noise = vec4(vec3(noise(uv)), 1.);
    vec4 fscol = getFromColor(uv);
    vec4 ftcol = getToColor(uvt);
    float alphamix = mix(fscol.a, ftcol.a, pow(clamp(progress,0.,1.), 0.6));
    if (progress <= 0.30) {
        return mix(fscol, noise*alphamix, pow(clamp(progress,0.,1.),0.3-progress));
    } else if (progress >= 0.70) {
        return mix(noise*alphamix, ftcol, pow(clamp(progress-0.7,0.,1.),1.-progress));
    } else {
        return noise*alphamix;
    }
}

vec4 hologram(vec2 uv, vec2 uvt) {
    float cosProg = 0.5*(cos(2.*PI*progress)+1.);
    vec4 fscol = getFromColor(uv + roffset(progress, uvt.x, 0., 0.12));
    vec4 ftcol = getToColor(uvt + roffset(progress, uvt.x, 0., 0.6));
  
    float scintensity = max(max(fscol.r,fscol.g),fscol.b);
    float tcintensity = max(max(ftcol.r,ftcol.g),ftcol.b);

    vec4 tscol = vec4(0.,fscol.g*3.,0.,1.)*scintensity;
    vec4 ttcol = vec4(ftcol.r*3.,0.,0.,1.)*tcintensity;
    
    vec4 iscol = vec4(0.,fscol.g*3.,fscol.b*3.,1.)*scintensity;
    vec4 itcol = vec4(ftcol.r*3.,0.,ftcol.b*3.,1.)*tcintensity;
    
    vec4 smix = mix(mix(fscol,tscol,progress),iscol,1.-cosProg);
    vec4 tmix = mix(mix(ftcol,ttcol,1.-progress),itcol,1.-cosProg);;

    return mix(smix, 
               tmix, 
               progress);
}

vec4 wind(vec2 uv, vec2 uvt) {
    float r = rand(vec2(0, uv.y));
    float m = smoothstep(0.0, -0.25, uv.x*0.75 + 0.25*r - (progress * 1.25));
    return mix(
        getFromColor(uv),
        getToColor(uvt),
        m
    );
}

vec4 transition(vec2 uv, vec2 uvt) {
    return mix(
        getFromColor(uv),
        getToColor(uvt),
        progress
    );
}

void main() {
    vec4 result;
    float scale = 1./magnify;
    vec2 uvExtra = vTextureCoordExtra;
    uvExtra -= vec2(0.5);
    uvExtra *= mat2(scale,0.,0.,scale);
    uvExtra += vec2(0.5);

    // shortcut to prevent a lot of computation if progress is equal to 0 or 1
    if (progress == 1.) {
        outputColor = getToColor(uvExtra);
        return;
    }

    if (progress == 0.) {
        outputColor = getFromColor(vTextureCoord);
        return;
    }

    if (type <= 1 || type >= 10) {
        result = transition(vTextureCoord, uvExtra);
    } else if (type == 2) {
        result = dreamy(vTextureCoord, uvExtra);
    } else if (type == 3) {
        result = swirl(vTextureCoord, uvExtra);
    } else if (type == 4) {
        result = waterdrop(vTextureCoord, uvExtra);
    } else if (type == 5) {
        result = tvnoise(vTextureCoord, uvExtra);
    } else if (type == 6) {
        result = morph(vTextureCoord, uvExtra);
    } else if (type == 7) {
        result = crosswarp(vTextureCoord, uvExtra);
    } else if (type == 8) {
        result = wind(vTextureCoord, uvExtra);
    } else if (type == 9) {
        result = hologram(vTextureCoord, uvExtra);
    } 
   
    outputColor = result;
}
`,ef=`#version 300 es
precision mediump float;

in vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;
uniform mat3 targetUVMatrix;

out vec2 vTextureCoord;
out vec2 vTextureCoordExtra;
out vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	vTextureCoordExtra = (targetUVMatrix * vec3(vTextureCoord, 1.0)).xy;
    vFilterCoord = (filterMatrix * vec3(vTextureCoord, 1.0)).xy;
}
`;class eh extends p{constructor(t){let{imagePath:i,progress:a,magnify:r,type:s}=Object.assign({},eh.defaults,t),o=new PIXI.Matrix;// using specific vertex shader and fragment shader
super(ef,ep),// vertex uniforms
this.uniforms.targetUVMatrix=o,// fragment uniforms
this.uniforms.inputClampTarget=new Float32Array([0,0,0,0]),// to store sprite matrix from the filter manager (and send to vertex)
this.targetSpriteMatrix=o,Object.assign(this,{imagePath:ts(i),progress:a,magnify:r,type:s}),this.zOrder=1,this.autoFit=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}setTMParams(e){super.setTMParams(e),!this.dummy&&"imagePath"in e&&this.assignTexture()}get progress(){return 100*this.uniforms.progress}set progress(e){this.uniforms.progress=Math.min(Math.max(.01*e,0),1)}get magnify(){return this.uniforms.magnify}set magnify(e){this.uniforms.magnify=Math.min(Math.max(e,.1),100)}get type(){return this.uniforms.type}set type(e){this.uniforms.type=Math.floor(e)}get uSamplerTarget(){return this.uniforms.uSamplerTarget}set uSamplerTarget(e){this.uniforms.uSamplerTarget=e}_setTargetSpriteSize(){let e=this.targetSprite,t=this.placeableImg._texture.baseTexture.realWidth/e.texture.baseTexture.realWidth;e.width=e.texture.baseTexture.realWidth*t,e.height=e.texture.baseTexture.realHeight*t,e.anchor.set(.5)}assignTexture(){if(this.hasOwnProperty("imagePath")){let e=PIXI.Texture.from(this.imagePath),t=new PIXI.Sprite(e);t.renderable=!1,this.targetSprite=t,e.valid?this._setTargetSpriteSize():e.on("update",()=>{this._setTargetSpriteSize()}),this.uSamplerTarget=t._texture,this.placeableImg.addChild(t)}}// override
apply(e,t,i,a){let r=this.targetSprite,s=r._texture;s.valid&&(s.uvMatrix||(s.uvMatrix=new PIXI.TextureMatrix(s,0)),s.uvMatrix.update(),this.uniforms.uSamplerTarget=s,this.uniforms.targetUVMatrix=e.calculateSpriteMatrix(this.targetSpriteMatrix,r).prepend(s.uvMatrix.mapCoord),this.uniforms.inputClampTarget=s.uvMatrix.uClampFrame),super.apply(e,t,i,a)}// override
destroy(){super.destroy(),this.placeableImg&&this.placeableImg.removeChild(this.targetSprite),this.targetSprite.destroy({children:!0,texture:!1,baseTexture:!1})}}eh.defaults={progress:0,magnify:1,type:1};let eg=`
precision mediump float;

uniform float time;
uniform float amplitude;
uniform float dispersion;
uniform float discardThreshold;
uniform int blend;
uniform bool alphaDiscard;
uniform bool chromatic;
uniform bool inlay;
uniform vec2 scale;
uniform vec3 color;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

const float MU_3 = 0.333333333334;

float rand(vec2 n) { 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float maxRgbIntensity(vec3 col) {
    return max(max(col.r,col.g),col.b);
}

float colorIntensity(vec3 col) {
    return clamp((col.r + col.g + col.b)*MU_3,0.,1.);
}

vec3 blendLinearDual(vec3 base, vec3 blend, float intensity) {
    if (intensity < dispersion) {
        return mix(base,blend,pow(abs((1.-dispersion)),clamp(10.*dispersion,1.,3.)));
    } 
    return mix(blend,mix(blend,base,1.-pow(intensity*dispersion,0.5)),1.-pow(intensity,4.));
}

vec3 blendScreen(vec3 base, vec3 blend, float intensity) {
    return vec3(1.)
            -((1.-base*(intensity+dispersion))
            *(1.-blend*clamp(pow(intensity,dispersion),0.,1.)));
}

float blendScreenPure(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreenPure(vec3 base, vec3 blend) {
	return vec3(blendScreenPure(base.r,blend.r),blendScreenPure(base.g,blend.g),blendScreenPure(base.b,blend.b));
}

vec3 blendMix(vec3 base, vec3 blend) {
	return mix(blendLinearDual(base, blend, smoothstep(0.35,0.6,1.-colorIntensity(blend))),
	           blendScreen(base, blend, smoothstep(0.,1.,1.-colorIntensity(blend))),
	           smoothstep(0.,1.,colorIntensity((base+blend)*0.5)));
}

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec4 blender(int blend, vec3 scol, vec3 tcol) {
    if (blend <= 1) {
        scol = mix(scol, tcol, smoothstep(dispersion, 1., maxRgbIntensity(tcol)));
    } else if (blend == 2) {
        scol = blendLinearDual(scol, tcol, maxRgbIntensity(tcol));
    } else if (blend == 3) {
        scol = blendLinearDual(scol, tcol, colorIntensity(tcol));
    } else if (blend == 4) {
        scol = blendScreen(scol, tcol, maxRgbIntensity(tcol));
    } else if (blend == 5) {
        scol = blendScreen(scol, tcol, colorIntensity(tcol));
    } else if (blend == 6) {
        scol = blendVividLight(scol,tcol);
    } else if (blend == 7) {
        scol = blendColorDodge(scol,tcol);
    } else if (blend == 8) {
        scol = blendColorBurn(scol,tcol);
    } else if (blend == 9) {
        scol = blendScreen(scol, blendVividLight(scol,tcol), colorIntensity(tcol));
    } else if (blend == 10) {
        scol = blendScreen(scol, blendColorDodge(scol,tcol), colorIntensity(tcol));
    } else if (blend == 11) {
        scol = blendLinearDual(blendVividLight(scol,tcol), tcol, maxRgbIntensity(tcol));
    } else if (blend == 12) {
        scol = blendMix(scol,tcol);
    } else if (blend == 13) {
        scol = blendScreenPure(scol,tcol);
    } else if (blend >= 14) {
        scol = blendScreenPure(scol,tcol*0.5);
    }

    return vec4(scol,1.);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), 
	       mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
	float total = 0.0, amp = amplitude;
	for (int i = 0; i < 5; i++) {
		total += noise(n) * amp;
		n += n;
		amp *= 0.5;
	}
	return total;
}

vec3 fire(in vec4 pixel) {
    vec3 c1,c2,c3,c4;

    if (chromatic) {
        c1 = vec3(0.00, 0.50, 0.50);
    	c2 = vec3(0.60, 0.35, 0.70);
    	c3 = vec3(0.20, 0.90, 1.00);
    	c4 = vec3(0.90, 1.00, 0.60); 
    } else if ( any(greaterThan(color,vec3(0.))) ) {
        c1 = vec3(0.10*color);
    	c2 = vec3(0.85*color);
    	c3 = vec3(0.35*color);
    	c4 = vec3(color);
    } else {
        c1 = color1;
        c2 = color2;
        c3 = color3;
        c4 = color4;
    }

	const vec3 c5 = vec3(0.1);
	const vec3 c6 = vec3(0.9);
	const vec2 pivot = vec2(0.5);
	
    vec2 uv = vFilterCoord;
    uv -= pivot;
	vec2 p = uv * mat2(8.*scale.x,0.0,0.0,8.*scale.y);
	uv += pivot;

    vec2 r;
	vec3 c;
	float t = time*0.1;
	float q = fbm(p - t);

	if (inlay) {
	    float sat = pixel.r + pixel.g + pixel.b;
	    float sat4 = sat*4.;
	    r = vec2(fbm(p + q + t - p.x - p.y - sat), fbm(p + q - t + sat4));
	    c = mix(c1, c2, fbm(p + r + sat4)) + mix(c3, c4, 1.4-pixel.rgb) - mix(c5, c6, r.y);
	} else {
	    r = vec2(fbm(p + q + time - p.x - p.y), fbm(p + q - t));
	    c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
	}
	
	return clamp(c,0.,1.);
}

void main() {
    vec4 pixel = texture2D(uSampler, vTextureCoord);
    if (pixel.a==0.) {
       gl_FragColor = pixel;
       return;
    }

    vec3 fire = fire(pixel);
    if (alphaDiscard && all(lessThanEqual(fire,vec3(discardThreshold))))  {
        discard;
    }

    vec4 result = blender(blend, pixel.rgb, fire);

	gl_FragColor = result*pixel.a;
}
`;class ev extends p{constructor(t){let{time:i,color:a,color1:r,color2:s,color3:o,color4:l,amplitude:n,dispersion:c,blend:m,scaleX:u,scaleY:d,alphaDiscard:p,discardThreshold:f,chromatic:g,inlay:v}=Object.assign({},ev.defaults,t);// using specific vertex shader and fragment shader
super(h,eg),this.uniforms.color=new Float32Array([1,1,1]),this.uniforms.color1=new Float32Array([1,1,1]),this.uniforms.color2=new Float32Array([1,1,1]),this.uniforms.color3=new Float32Array([1,1,1]),this.uniforms.color4=new Float32Array([1,1,1]),this.uniforms.scale=new Float32Array([1,1]),Object.assign(this,{time:i,color:a,color1:r,color2:s,color3:o,color4:l,amplitude:n,dispersion:c,blend:m,scaleX:u,scaleY:d,alphaDiscard:p,discardThreshold:f,chromatic:g,inlay:v}),this.zOrder=145,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get time(){return this.uniforms.time}set time(e){this.uniforms.time=e}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get color1(){return PIXI.utils.rgb2hex(this.uniforms.color1)}set color1(e){new PIXI.Color(e).toRgbArray(this.uniforms.color1)}get color2(){return PIXI.utils.rgb2hex(this.uniforms.color2)}set color2(e){new PIXI.Color(e).toRgbArray(this.uniforms.color2)}get color3(){return PIXI.utils.rgb2hex(this.uniforms.color3)}set color3(e){new PIXI.Color(e).toRgbArray(this.uniforms.color3)}get color4(){return PIXI.utils.rgb2hex(this.uniforms.color4)}set color4(e){new PIXI.Color(e).toRgbArray(this.uniforms.color4)}get amplitude(){return this.uniforms.amplitude}set amplitude(e){this.uniforms.amplitude=e}get dispersion(){return this.uniforms.dispersion}set dispersion(e){this.uniforms.dispersion=e}get blend(){return this.uniforms.blend}set blend(e){this.uniforms.blend=Math.floor(e)}get scaleX(){return this.uniforms.scale[0]}set scaleX(e){this.uniforms.scale[0]=e}get scaleY(){return this.uniforms.scale[1]}set scaleY(e){this.uniforms.scale[1]=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}get discardThreshold(){return this.uniforms.discardThreshold}set discardThreshold(e){this.uniforms.discardThreshold=e}get chromatic(){return this.uniforms.chromatic}set chromatic(e){null!=e&&"boolean"==typeof e&&(this.uniforms.chromatic=e)}get inlay(){return this.uniforms.inlay}set inlay(e){null!=e&&"boolean"==typeof e&&(this.uniforms.inlay=e)}}ev.defaults={time:0,color:0,color1:2424832,color2:11665408,color3:3342336,color4:16770304,amplitude:1,dispersion:.25,blend:2,scaleX:1,scaleY:1,discardThreshold:.1,alphaDiscard:!1,chromatic:!1,inlay:!1};let eb=`#version 300 es
precision mediump float;

uniform float rotation;
uniform float twRadius;
uniform float twAngle;
uniform float bpRadius;
uniform float bpStrength;
uniform float alpha;
uniform bool alphaDiscard;

uniform bool inverse;
uniform bool top;
uniform bool colorize;
uniform bool repeat;

uniform vec2 scale;
uniform vec2 translation;

uniform vec3 color;

uniform vec4 inputClamp;
uniform vec4 inputClampTarget;

uniform sampler2D uSampler;
uniform sampler2D uSamplerTarget;

in vec2 vTextureCoord;
in vec2 vTextureCoordExtra;
in vec2 vFilterCoord;
in mat3 vTargetUVMatrix;

out vec4 outputColor;

const float PI = 3.14159265358;

float getClip(in vec2 uv) {
    return step(3.5,
       step(inputClampTarget.x, uv.x) +
       step(inputClampTarget.y, uv.y) +
       step(uv.x, inputClampTarget.z) +
       step(uv.y, inputClampTarget.w));
}

vec2 morphing(in vec2 uv) {
    float dist = length(uv);

    // twist effect
    if (dist < twRadius) {
        float ratioDist = (twRadius - dist) / twRadius;
        float angleMod = ratioDist * ratioDist * twAngle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    }

    // bulge pinch effect
    if (dist < bpRadius) {
        float percent = dist / bpRadius;
        if (bpStrength > 0.) {
            uv *= mix(1.0, smoothstep(0., bpRadius / dist, percent), bpStrength * 0.75);
        } else {
            uv *= mix(1.0, pow(percent, 1.0 + bpStrength * 0.75) * bpRadius / dist, 1.0 - percent);
        }
    }

    return uv;
}

vec4 colorization(in vec4 col) {
    vec3 wcol = col.rgb;
    if (inverse) {
        wcol = (vec3(1.0) - wcol) * col.a;
    }
    float avg = (wcol.r + wcol.g + wcol.b) / 3.0;
    return vec4(vec3(color * avg), col.a);
}

vec2 transform(in vec2 uv) {
    float angle = -(PI * rotation * 0.005555555555);
    uv -= 0.5;
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    uv *= mat2(1.0 / scale.x, 0.0, 0.0, 1.0 / scale.y);
    uv = morphing(uv);
    uv += 0.5;

    return uv;
}

vec4 getFromColor(in vec2 uv) {
    return texture(uSampler, clamp(uv, inputClamp.xy, inputClamp.zw));
}

vec4 getToColor(in vec2 uv) {
    return texture(uSamplerTarget, clamp(uv, inputClampTarget.xy, inputClampTarget.zw)) * getClip(uv);
}

vec4 getToColorFract(in vec2 uv) {
    return textureGrad(uSamplerTarget, fract(uv), dFdx(uv), dFdy(uv));
}

void main() {

    // UV transformations
    vec2 uvTex = transform(vTextureCoordExtra);

    // get samplers color
    vec4 icolor = getFromColor(vTextureCoord);

    vec4 tcolor;
    if(repeat) {
        tcolor = getToColorFract(uvTex + translation);
    } else {
        tcolor = getToColor(uvTex + translation);
    }

    tcolor.a *= alpha;
    if(alphaDiscard) tcolor = mix(tcolor, icolor, 1.0 - icolor.a);

    // colorize if necessary
    if (colorize) {
        tcolor = colorization(tcolor);
    }

    vec3 fcolor = tcolor.rgb;
    if(top && icolor.a > 0.) fcolor = mix(tcolor.rgb, icolor.rgb, 1.0 - tcolor.a);
    else if(!top) fcolor = mix(icolor.rgb, tcolor.rgb, 1.0 - icolor.a);
   
    outputColor = vec4(fcolor, max(tcolor.a, icolor.a));
}
`;class ey extends p{tex=null;constructor(t){let{imagePath:i,color:a,colorize:r,inverse:s,alpha:o,alphaDiscard:l,repeat:n,top:c,rotation:m,twRadiusPercent:u,twAngle:d,twRotation:p,bpRadiusPercent:f,bpStrength:h,scale:g,scaleX:v,scaleY:b,translationX:y,translationY:x,play:T,loop:C,maintainAspectRatio:w,maintainScale:I}=Object.assign({},ey.defaults,t),P=new PIXI.Matrix;// using specific vertex shader and fragment shader
super(ef,eb),// vertex uniforms
this.uniforms.targetUVMatrix=P,// fragment uniforms
this.uniforms.inputClampTarget=new Float32Array([0,0,0,0]),this.uniforms.color=new Float32Array([0,0,0]),this.uniforms.scale=new Float32Array([1,1]),this.uniforms.translation=new Float32Array([0,0]),// to store sprite matrix from the filter manager (and send to vertex)
this.targetSpriteMatrix=P,Object.assign(this,{imagePath:ts(i),color:a,colorize:r,inverse:s,alpha:o,alphaDiscard:l,repeat:n,top:c,rotation:m,twRadiusPercent:u,twAngle:d,twRotation:p,bpRadiusPercent:f,bpStrength:h,scale:g,scaleX:v,scaleY:b,translationX:y,translationY:x,play:T,loop:C,maintainAspectRatio:w,maintainScale:I}),this.zOrder=0,this.autoFit=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}setTMParams(e){super.setTMParams(e),!this.dummy&&"imagePath"in e&&this.assignTexture()}_play=!0;_loop=!0;_maintainAspectRatio=!1;_maintainScale=!1;get play(){return this._play}set play(e){null!=e&&"boolean"==typeof e&&(this._play=e,this._playVideo(this._play))}get loop(){return this._loop}set loop(e){null!=e&&"boolean"==typeof e&&(this._loop=e,this._playVideo(this._play))}get maintainAspectRatio(){return this._maintainAspectRatio}set maintainAspectRatio(e){null!=e&&"boolean"==typeof e&&(this._maintainAspectRatio=e)}get maintainScale(){return this._maintainScale}set maintainScale(e){null!=e&&"boolean"==typeof e&&(this._maintainScale=e)}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get colorize(){return this.uniforms.colorize}set colorize(e){null!=e&&"boolean"==typeof e&&(this.uniforms.colorize=e)}get inverse(){return this.uniforms.inverse}set inverse(e){null!=e&&"boolean"==typeof e&&(this.uniforms.inverse=e)}get alpha(){return this.uniforms.alpha}set alpha(e){this.uniforms.alpha=e}get alphaDiscard(){return this.uniforms.alphaDiscard}set alphaDiscard(e){null!=e&&"boolean"==typeof e&&(this.uniforms.alphaDiscard=e)}get repeat(){return this.uniforms.repeat}set repeat(e){null!=e&&"boolean"==typeof e&&(this.uniforms.repeat=e)}get top(){return this.uniforms.top}set top(e){null!=e&&"boolean"==typeof e&&(this.uniforms.top=e)}get rotation(){return this.uniforms.rotation}set rotation(e){this.uniforms.rotation=e}get twRadiusPercent(){return 200*this.uniforms.twRadius}set twRadiusPercent(e){this.uniforms.twRadius=e/200}get twAngle(){return this.uniforms.twAngle}set twAngle(e){this.uniforms.twAngle=e}get twRotation(){return this.uniforms.twAngle*(180/Math.PI)}set twRotation(e){this.uniforms.twAngle=e*(Math.PI/180)}get bpRadiusPercent(){return 200*this.uniforms.bpRadius}set bpRadiusPercent(e){this.uniforms.bpRadius=e/200}get bpStrength(){return this.uniforms.bpStrength}set bpStrength(e){this.uniforms.bpStrength=e}get scale(){// a little hack (we get only x)
return this.uniforms.scale[0]}set scale(e){this.uniforms.scale[1]=this.uniforms.scale[0]=e}get scaleX(){return this.uniforms.scale[0]}set scaleX(e){this.uniforms.scale[0]=e}get scaleY(){return this.uniforms.scale[1]}set scaleY(e){this.uniforms.scale[1]=e}get translationX(){return this.uniforms.translation[0]}set translationX(e){this.uniforms.translation[0]=e}get translationY(){return this.uniforms.translation[1]}set translationY(e){this.uniforms.translation[1]=e}get uSamplerTarget(){return this.uniforms.uSamplerTarget}set uSamplerTarget(e){this.uniforms.uSamplerTarget=e}async _playVideo(e){// Play if baseTexture resource is a video
if(this.tex){let t=getProperty(this.tex,"baseTexture.resource.source");t&&"VIDEO"===t.tagName&&(isNaN(t.duration)&&await new Promise(e=>{t.onloadedmetadata=()=>e()}),e?game.video.play(t,{loop:this._loop,volume:0}):game.video.stop(t))}}assignTexture(){if(this.hasOwnProperty("imagePath")){this.targetSprite&&!this.targetSprite.destroyed&&this.targetSprite.destroy({children:!0,texture:!1,baseTexture:!1}),this.tex=PIXI.Texture.from(this.imagePath);let e=new PIXI.Sprite(this.tex);e.renderable=!1,this.placeableImg._texture?(e.width=this.placeableImg._texture.baseTexture.realWidth,e.height=this.placeableImg._texture.baseTexture.realHeight,e.anchor.set(.5)):(e.width=this.placeableImg.width,e.height=this.placeableImg.height),this.targetSprite=e,this.uSamplerTarget=e._texture,this.placeableImg.addChild(e),this._playVideo(this._play)}}// override
apply(e,t,i,a){let r=this.targetSprite,s=r._texture;if(s.valid){if(s.uvMatrix||(s.uvMatrix=new PIXI.TextureMatrix(s,0)),s.uvMatrix.update(),this.uniforms.uSamplerTarget=s,this.maintainScale){let e=r.parent.scale;r.scale.set(1/e.x,1/e.y)}let t=r.worldTransform;if(this.maintainAspectRatio){let e=Math.min(t.a,t.d);t.set(e,t.b,t.c,e,t.tx,t.ty)}this.uniforms.targetUVMatrix=e.calculateSpriteMatrix(this.targetSpriteMatrix,r),this.uniforms.inputClampTarget=s.uvMatrix.uClampFrame}super.apply(e,t,i,a)}// override
destroy(){super.destroy(),this.targetSprite.destroyed||this.targetSprite.destroy({children:!0,texture:!1,baseTexture:!1})}}ey.defaults={color:0,colorize:!1,inverse:!1,alpha:1,alphaDiscard:!1,repeat:!1,top:!1,rotation:0,twRadiusPercent:0,twAngle:0,bpRadiusPercent:0,bpStrength:0,scaleX:1,scaleY:1,translationX:0,translationY:0,play:!0,loop:!0,maintainAspectRatio:!1,maintainScale:!1};let ex=`#version 300 es
precision mediump float;

uniform float rotation;
uniform float twRadius;
uniform float twAngle;
uniform float bpRadius;
uniform float bpStrength;
uniform float alpha;

uniform bool inverse;
uniform bool top;
uniform bool colorize;
uniform bool repeat;

uniform vec2 scale;
uniform vec2 translation;

uniform vec3 color;

uniform vec4 inputClamp;
uniform vec4 inputClampTarget;

uniform sampler2D uSampler;
uniform sampler2D uSamplerTarget;

in vec2 vTextureCoord;
in vec2 vTextureCoordExtra;
in vec2 vFilterCoord;
in mat3 vTargetUVMatrix;

out vec4 outputColor;

const float PI = 3.14159265358;

float getClip(in vec2 uv) {
    return step(3.5,
       step(inputClampTarget.x, uv.x) +
       step(inputClampTarget.y, uv.y) +
       step(uv.x, inputClampTarget.z) +
       step(uv.y, inputClampTarget.w));
}

vec2 morphing(in vec2 uv) {
    float dist = length(uv);

    // twist effect
    if (dist < twRadius) {
        float ratioDist = (twRadius - dist) / twRadius;
        float angleMod = ratioDist * ratioDist * twAngle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    }

    // bulge pinch effect
    if (dist < bpRadius) {
        float percent = dist / bpRadius;
        if (bpStrength > 0.) {
            uv *= mix(1.0, smoothstep(0., bpRadius / dist, percent), bpStrength * 0.75);
        } else {
            uv *= mix(1.0, pow(percent, 1.0 + bpStrength * 0.75) * bpRadius / dist, 1.0 - percent);
        }
    }

    return uv;
}

vec4 colorization(in vec4 col) {
    vec3 wcol = col.rgb;
    if (inverse) {
        wcol = (vec3(1.0) - wcol) * col.a;
    }
    float avg = (wcol.r + wcol.g + wcol.b) / 3.0;
    return vec4(vec3(color * avg), col.a);
}

vec2 transform(in vec2 uv) {
    float angle = -(PI * rotation * 0.005555555555);
    uv -= 0.5;
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    uv *= mat2(1.0 / scale.x, 0.0, 0.0, 1.0 / scale.y);
    uv = morphing(uv);
    uv += 0.5;

    return uv;
}

vec4 getFromColor(in vec2 uv) {
    return texture(uSampler, clamp(uv, inputClamp.xy, inputClamp.zw));
}

vec4 getToColor(in vec2 uv) {
    return texture(uSamplerTarget, clamp(uv, inputClampTarget.xy, inputClampTarget.zw)) * getClip(uv);
}

vec4 getToColorFract(in vec2 uv) {
    return textureGrad(uSamplerTarget, fract(uv), dFdx(uv), dFdy(uv));
}

void main() {

    // UV transformations
    vec2 uvTex = transform(vTextureCoordExtra);

    // get samplers color
    vec4 icolor = getFromColor(vTextureCoord);

    vec4 tcolor;
    if(repeat) {
        tcolor = getToColorFract(uvTex + translation);
    } else {
        tcolor = getToColor(uvTex + translation);
    }

    icolor *= (tcolor.a * alpha);
    outputColor = icolor;
}
`;class eT extends p{tex=null;constructor(t){let{imagePath:i,color:a,colorize:r,inverse:s,alpha:o,repeat:l,top:n,rotation:c,twRadiusPercent:m,twAngle:u,twRotation:d,bpRadiusPercent:p,bpStrength:f,scale:h,scaleX:g,scaleY:v,translationX:b,translationY:y,play:x,loop:T,maintainAspectRatio:C,maintainScale:w}=Object.assign({},eT.defaults,t),I=new PIXI.Matrix;// using specific vertex shader and fragment shader
super(ef,ex),// vertex uniforms
this.uniforms.targetUVMatrix=I,// fragment uniforms
this.uniforms.inputClampTarget=new Float32Array([0,0,0,0]),this.uniforms.color=new Float32Array([0,0,0]),this.uniforms.scale=new Float32Array([1,1]),this.uniforms.translation=new Float32Array([0,0]),// to store sprite matrix from the filter manager (and send to vertex)
this.targetSpriteMatrix=I,Object.assign(this,{imagePath:ts(i),color:a,colorize:r,inverse:s,alpha:o,repeat:l,top:n,rotation:c,twRadiusPercent:m,twAngle:u,twRotation:d,bpRadiusPercent:p,bpStrength:f,scale:h,scaleX:g,scaleY:v,translationX:b,translationY:y,play:x,loop:T,maintainAspectRatio:C,maintainScale:w}),this.zOrder=0,this.autoFit=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}setTMParams(e){super.setTMParams(e),!this.dummy&&"imagePath"in e&&this.assignTexture()}_play=!0;_loop=!0;_maintainAspectRatio=!1;_maintainScale=!1;get play(){return this._play}set play(e){null!=e&&"boolean"==typeof e&&(this._play=e,this._playVideo(this._play))}get loop(){return this._loop}set loop(e){null!=e&&"boolean"==typeof e&&(this._loop=e,this._playVideo(this._play))}get maintainAspectRatio(){return this._maintainAspectRatio}set maintainAspectRatio(e){null!=e&&"boolean"==typeof e&&(this._maintainAspectRatio=e)}get maintainScale(){return this._maintainScale}set maintainScale(e){null!=e&&"boolean"==typeof e&&(this._maintainScale=e)}get color(){return PIXI.utils.rgb2hex(this.uniforms.color)}set color(e){new PIXI.Color(e).toRgbArray(this.uniforms.color)}get colorize(){return this.uniforms.colorize}set colorize(e){null!=e&&"boolean"==typeof e&&(this.uniforms.colorize=e)}get inverse(){return this.uniforms.inverse}set inverse(e){null!=e&&"boolean"==typeof e&&(this.uniforms.inverse=e)}get alpha(){return this.uniforms.alpha}set alpha(e){this.uniforms.alpha=e}get repeat(){return this.uniforms.repeat}set repeat(e){null!=e&&"boolean"==typeof e&&(this.uniforms.repeat=e)}get top(){return this.uniforms.top}set top(e){null!=e&&"boolean"==typeof e&&(this.uniforms.top=e)}get rotation(){return this.uniforms.rotation}set rotation(e){this.uniforms.rotation=e}get twRadiusPercent(){return 200*this.uniforms.twRadius}set twRadiusPercent(e){this.uniforms.twRadius=e/200}get twAngle(){return this.uniforms.twAngle}set twAngle(e){this.uniforms.twAngle=e}get twRotation(){return this.uniforms.twAngle*(180/Math.PI)}set twRotation(e){this.uniforms.twAngle=e*(Math.PI/180)}get bpRadiusPercent(){return 200*this.uniforms.bpRadius}set bpRadiusPercent(e){this.uniforms.bpRadius=e/200}get bpStrength(){return this.uniforms.bpStrength}set bpStrength(e){this.uniforms.bpStrength=e}get scale(){// a little hack (we get only x)
return this.uniforms.scale[0]}set scale(e){this.uniforms.scale[1]=this.uniforms.scale[0]=e}get scaleX(){return this.uniforms.scale[0]}set scaleX(e){this.uniforms.scale[0]=e}get scaleY(){return this.uniforms.scale[1]}set scaleY(e){this.uniforms.scale[1]=e}get translationX(){return this.uniforms.translation[0]}set translationX(e){this.uniforms.translation[0]=e}get translationY(){return this.uniforms.translation[1]}set translationY(e){this.uniforms.translation[1]=e}get uSamplerTarget(){return this.uniforms.uSamplerTarget}set uSamplerTarget(e){this.uniforms.uSamplerTarget=e}async _playVideo(e){// Play if baseTexture resource is a video
if(this.tex){let t=getProperty(this.tex,"baseTexture.resource.source");t&&"VIDEO"===t.tagName&&(isNaN(t.duration)&&await new Promise(e=>{t.onloadedmetadata=()=>e()}),e?game.video.play(t,{loop:this._loop,volume:0}):game.video.stop(t))}}assignTexture(){if(this.hasOwnProperty("imagePath")){this.targetSprite&&!this.targetSprite.destroyed&&this.targetSprite.destroy({children:!0,texture:!1,baseTexture:!1}),this.tex=PIXI.Texture.from(this.imagePath);let e=new PIXI.Sprite(this.tex);e.renderable=!1,this.placeableImg._texture?(e.width=this.placeableImg._texture.baseTexture.realWidth,e.height=this.placeableImg._texture.baseTexture.realHeight,e.anchor.set(.5)):(e.width=this.placeableImg.width,e.height=this.placeableImg.height),this.targetSprite=e,this.uSamplerTarget=e._texture,this.placeableImg.addChild(e),this._playVideo(this._play)}}// override
apply(e,t,i,a){let r=this.targetSprite,s=r._texture;if(s.valid){if(s.uvMatrix||(s.uvMatrix=new PIXI.TextureMatrix(s,0)),s.uvMatrix.update(),this.uniforms.uSamplerTarget=s,this.maintainScale){let e=r.parent.scale;r.scale.set(1/e.x,1/e.y)}let t=r.worldTransform;if(this.maintainAspectRatio){let e=Math.min(t.a,t.d);t.set(e,t.b,t.c,e,t.tx,t.ty)}this.uniforms.targetUVMatrix=e.calculateSpriteMatrix(this.targetSpriteMatrix,r),this.uniforms.inputClampTarget=s.uvMatrix.uClampFrame}super.apply(e,t,i,a)}// override
destroy(){super.destroy(),this.targetSprite.destroyed||this.targetSprite.destroy({children:!0,texture:!1,baseTexture:!1})}}eT.defaults={color:0,colorize:!1,inverse:!1,alpha:1,repeat:!1,top:!1,rotation:0,twRadiusPercent:0,twAngle:0,bpRadiusPercent:0,bpStrength:0,scaleX:1,scaleY:1,translationX:0,translationY:0,play:!0,loop:!0,maintainAspectRatio:!1,maintainScale:!1};class eC extends PIXI.filters.ColorReplaceFilter{constructor(t){super(),this.originalColor=[1,0,0],this.newColor=[0,1,0],this.epsilon=.7,this.zOrder=100,this.animating={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}let ew=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 tint;
void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float lesser = min(color.g,color.b);
    float bigger = max(color.g,color.b);
    if ((bigger - lesser < 0.1) && (color.r > 1.5 * bigger)) {
        float primary = color.r;
        float range = primary - lesser;
        color.r = lesser + range * tint.r;
        color.g = lesser + range * tint.g;
        color.b = lesser + range * tint.b;
    }
    gl_FragColor = color;
}`,eI={MAIN:"tmfx-main",TEMPLATE:"tmfx-template"};var eP=[];let eM=[{filterType:"bevel",filterId:"bevel",rotation:0,thickness:5,lightColor:16711680,lightAlpha:.8,shadowColor:65280,shadowAlpha:.5,animated:{rotation:{active:!0,clockWise:!0,loopDuration:1600,animType:"syncRotation"}}}];var eF={};eF.name="bevel",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"adjustment",filterId:"adjustment",saturation:1.5,brightness:1.5,contrast:2,gamma:2,red:4,green:.25,blue:.25,alpha:1,animated:{alpha:{active:!0,loopDuration:5e3,animType:"syncCosOscillation",val1:.15,val2:1}}}],(eF={}).name="adjustment",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"shadow",filterId:"dropshadow",rotation:35,blur:2,quality:5,distance:20,alpha:.7,padding:10,shadowOnly:!1,color:0,animated:{blur:{active:!0,loopDuration:1500,animType:"syncCosOscillation",val1:2,val2:3},rotation:{active:!0,loopDuration:150,animType:"syncSinOscillation",val1:33,val2:35}}}],(eF={}).name="dropshadow",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"outline",filterId:"outline",padding:10,color:15622197,thickness:1,quality:5,animated:{thickness:{active:!0,loopDuration:800,animType:"syncCosOscillation",val1:1,val2:6}}}],(eF={}).name="outline",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"glow",filterId:"glow",outerStrength:7,innerStrength:0,color:24576,quality:.5,padding:10,animated:{color:{active:!0,loopDuration:3e3,animType:"colorOscillation",val1:12288,val2:65280}}}],(eF={}).name="glow",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"xbloom",filterId:"bloom",threshold:.35,bloomScale:0,brightness:1,blur:.1,padding:10,quality:15,blendMode:0,animated:{bloomScale:{active:!0,loopDuration:2e3,animType:"syncCosOscillation",val1:0,val2:2.1},threshold:{active:!1,loopDuration:1e3,animType:"syncCosOscillation",val1:0,val2:1.9}}}],(eF={}).name="bloom",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"distortion",filterId:"distortion",maskPath:"modules/tokenmagic/fx/assets/distortion-1.png",maskSpriteScaleX:5,maskSpriteScaleY:5,padding:20,animated:{maskSpriteX:{active:!0,speed:.05,animType:"move"},maskSpriteY:{active:!0,speed:.07,animType:"move"}}}],(eF={}).name="distortion",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"oldfilm",filterId:"oldfilm",sepia:.6,noise:.2,noiseSize:1,scratch:.8,scratchDensity:.5,scratchWidth:1.2,vignetting:.9,vignettingAlpha:.6,vignettingBlur:.2,animated:{seed:{active:!0,animType:"randomNumber",val1:0,val2:1},vignetting:{active:!0,animType:"syncCosOscillation",loopDuration:2e3,val1:.2,val2:.4}}},{filterType:"outline",filterId:"oldfilm",color:0,thickness:0}],(eF={}).name="oldfilm",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"twist",filterId:"twist",radiusPercent:120,angle:0,animated:{angle:{active:!0,animType:"sinOscillation",loopDuration:1e4,val1:-.6*Math.PI,val2:.6*Math.PI}}}],(eF={}).name="twist",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"bulgepinch",filterId:"bulge",padding:150,strength:0,zIndex:2,radiusPercent:200,animated:{strength:{active:!0,animType:"cosOscillation",loopDuration:2e3,val1:0,val2:.45}}}],(eF={}).name="bulge",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"blur",filterId:"blur",padding:10,quality:4,blur:0,blurX:0,blurY:0,animated:{blurX:{active:!0,animType:"syncCosOscillation",loopDuration:500,val1:0,val2:6},blurY:{active:!0,animType:"syncCosOscillation",loopDuration:750,val1:0,val2:6}}}],(eF={}).name="blur",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zoomblur",filterId:"zoomblur",strength:.15,innerRadiusPercent:65,radiusPercent:100,padding:30,animated:{innerRadiusPercent:{active:!0,animType:"sinOscillation",loopDuration:500,val1:65,val2:75}}}],(eF={}).name="zoomblur",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"shockwave",filterId:"shockwave",time:0,amplitude:8,wavelength:75,radius:500,brightness:1.5,speed:25,padding:0,animated:{time:{animType:"cosOscillation",active:!0,loopDuration:1800,val1:0,val2:10}}}],(eF={}).name="shockwave",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zapshadow",filterId:"zapshadow",alphaTolerance:.45}],(eF={}).name="zapshadow",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"ray",filterId:"rays",time:0,color:13598720,alpha:.5,divisor:32,anchorX:0,anchorY:0,animated:{time:{active:!0,speed:5e-4,animType:"move"}}}],(eF={}).name="rays",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"fog",filterId:"fog",color:0,density:.65,time:0,dimX:1,dimY:1,animated:{time:{active:!0,speed:2.2,animType:"move"}}}],(eF={}).name="fog",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"fumes",filterId:"fumes",color:8421504,time:0,blend:8,animated:{time:{active:!0,speed:.001,animType:"move"}}}],(eF={}).name="fumes",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"electric",filterId:"electric",color:16777215,time:0,blend:1,intensity:5,animated:{time:{active:!0,speed:.002,animType:"move"}}}],(eF={}).name="electric",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"fire",filterId:"fire",intensity:1,color:16777215,amplitude:1,time:0,blend:2,fireBlend:1,animated:{time:{active:!0,speed:-.0024,animType:"move"},intensity:{active:!0,loopDuration:15e3,val1:.8,val2:2,animType:"syncCosOscillation"},amplitude:{active:!0,loopDuration:4400,val1:1,val2:1.4,animType:"syncCosOscillation"}}}],(eF={}).name="fire",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"wave",filterId:"waves",time:0,anchorX:.5,anchorY:.5,strength:.015,frequency:120,color:16777215,maxIntensity:2.5,minIntensity:.9,padding:10,animated:{time:{active:!0,speed:.0085,animType:"move"},anchorX:{active:!1,val1:.15,val2:.85,animType:"syncChaoticOscillation",loopDuration:2e4},anchorY:{active:!1,val1:.15,val2:.85,animType:"syncSinOscillation",loopDuration:2e4}}}],(eF={}).name="waves",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"flood",filterId:"flood",time:0,color:8379,billowy:.43,tintIntensity:.72,glint:.31,scale:70,padding:10,animated:{time:{active:!0,speed:6e-4,animType:"move"}}}],(eF={}).name="flood",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"smoke",filterId:"smoke",color:5282269,time:0,blend:2,dimX:.1,dimY:1,animated:{time:{active:!0,speed:.009,animType:"move"}}}],(eF={}).name="smoke",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"images",filterId:"images",time:0,nbImage:4,alphaImg:1,alphaChr:0,blend:4,ampX:.1,ampY:.1,animated:{time:{active:!0,speed:.001,animType:"move"}}}],(eF={}).name="images",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"images",filterId:"chaos-images",time:0,nbImage:4,alphaImg:1,alphaChr:0,blend:4,ampX:.1,ampY:.1,padding:80,animated:{time:{active:!0,speed:.001,animType:"move"},ampX:{active:!0,val1:0,val2:.3,chaosFactor:.03,animType:"syncChaoticOscillation",loopDuration:2e3},ampY:{active:!0,val1:0,val2:.3,chaosFactor:.04,animType:"syncChaoticOscillation",loopDuration:1650},alphaChr:{active:!0,animType:"randomNumberPerLoop",val1:0,val2:1,loopDuration:250},alphaImg:{active:!0,animType:"randomNumberPerLoop",val1:.8,val2:1,loopDuration:250},nbImage:{active:!0,val1:1,val2:9,animType:"syncSinOscillation",loopDuration:1400}}}],(eF={}).name="chaos-images",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"images",filterId:"spectral-images",time:0,blend:4,nbImage:4,padding:100,alphaImg:.5,alphaChr:0,ampX:.1,ampY:.1,animated:{time:{speed:.001,animType:"move"},ampX:{val1:0,val2:.22,animType:"syncCosOscillation",loopDuration:2500},ampY:{val1:0,val2:.24,animType:"syncCosOscillation",loopDuration:2500,pauseBetweenDuration:2500},alphaChr:{val1:1,val2:0,animType:"syncCosOscillation",loopDuration:2500},alphaImg:{val1:.2,val2:.8,animType:"syncSinOscillation",loopDuration:2500}}}],(eF={}).name="spectral-images",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"hexa-field",shieldType:2,gridPadding:1.5,color:13369548,time:0,blend:3,intensity:1,lightAlpha:.5,lightSize:.5,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="hexa-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"fire-field",shieldType:1,gridPadding:2,color:15041872,time:0,blend:2,intensity:1.15,lightAlpha:2,lightSize:.7,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="fire-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"smoke-field",shieldType:3,gridPadding:1.5,color:6343792,time:0,blend:2,intensity:.9,lightAlpha:1,lightSize:.7,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="smoke-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"earth-field",shieldType:4,gridPadding:2,color:12292208,time:0,blend:1,intensity:1.25,lightAlpha:1,lightSize:.7,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="earth-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"earth-field-top",shieldType:5,gridPadding:3,color:11184810,time:0,blend:5,intensity:1.9,lightAlpha:1,lightSize:.7,scale:1,radius:1,zIndex:5,chromatic:!0,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="earth-field-top",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"air-field",shieldType:6,gridPadding:1.2,color:7377066,time:0,blend:14,intensity:1,lightAlpha:1,lightSize:.7,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="air-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"magic-field",shieldType:7,gridPadding:1,color:16777215,time:0,blend:10,intensity:.8,lightAlpha:1,lightSize:.45,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="magic-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"chromatic-field",shieldType:8,gridPadding:2,color:11184810,time:0,blend:0,intensity:1,lightAlpha:0,lightSize:0,scale:1,radius:1,chromatic:!0,animated:{time:{active:!0,speed:.0045,animType:"move"}}}],(eF={}).name="chromatic-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"water-field",shieldType:9,gridPadding:1.2,color:2145262,time:0,blend:4,intensity:1,lightAlpha:.7,lightSize:.5,scale:.6,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0015,animType:"move"}}}],(eF={}).name="water-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"evil-field",shieldType:9,gridPadding:2,color:16723984,time:0,blend:5,intensity:1,lightAlpha:4,lightSize:.8,scale:.5,radius:1,chromatic:!1,animated:{time:{active:!0,speed:.0012,animType:"move"},lightSize:{val1:.4,val2:1.5,animType:"syncCosOscillation",loopDuration:5e3}}}],(eF={}).name="evil-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"grid-field",shieldType:11,gridPadding:2,color:52428,time:0,blend:2,intensity:1,lightAlpha:1,lightSize:.3,scale:.5,radius:1,chromatic:!1,animated:{time:{active:!0,speed:9e-4,animType:"move"}}}],(eF={}).name="grid-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"warp-field",shieldType:12,gridPadding:2,color:16777215,time:0,blend:2,intensity:1,lightAlpha:.8,lightSize:.5,scale:.9,radius:1,chromatic:!1,animated:{time:{active:!0,speed:9e-4,animType:"move"}}}],(eF={}).name="warp-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"field",filterId:"color-field",shieldType:13,gridPadding:2,color:52224,time:0,blend:14,intensity:1,lightAlpha:0,lightSize:0,scale:1,radius:1,chromatic:!1,animated:{time:{active:!0,speed:9e-4,animType:"move"}}}],(eF={}).name="color-field",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"xray",filterId:"sunburst",time:0,color:16759552,blend:9,dimX:1,dimY:1,anchorX:0,anchorY:0,divisor:36,intensity:4,animated:{time:{active:!0,speed:.0012,animType:"move"},anchorX:{animType:"syncCosOscillation",loopDuration:6e3,val1:.4,val2:.6}}}],(eF={}).name="sunburst",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"xray",filterId:"clover",time:0,color:65280,blend:9,dimX:.05,dimY:.05,anchorX:.5,anchorY:.5,divisor:4,intensity:1,animated:{time:{active:!0,speed:.0012,animType:"move"},anchorX:{animType:"syncCosOscillation",loopDuration:6e3,val1:.4,val2:.6},anchorY:{animType:"syncSinOscillation",loopDuration:6e3,val1:.4,val2:.6}}}],(eF={}).name="clover",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"xray",filterId:"scan",time:0,color:16777215,blend:5,dimX:20,dimY:20,anchorX:.5,anchorY:0,divisor:8,intensity:1,animated:{time:{active:!0,speed:5e-4,animType:"move"}}}],(eF={}).name="scan",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"xray",filterId:"blue-rays",time:0,color:1061119,blend:9,dimX:1,dimY:1,anchorX:0,anchorY:0,divisor:24,intensity:1,animated:{time:{active:!0,speed:2e-4,animType:"move"},anchorX:{animType:"syncCosOscillation",loopDuration:18e3,val1:.05,val2:.95},anchorY:{animType:"syncSinOscillation",loopDuration:18e3,val1:.05,val2:.95}}}],(eF={}).name="blue-rays",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"liquid",filterId:"spectral-body",color:2140910,time:0,blend:8,intensity:4,spectral:!0,scale:.9,animated:{time:{active:!0,speed:.001,animType:"move"},color:{active:!0,loopDuration:6e3,animType:"colorOscillation",val1:16777215,val2:43775}}}],(eF={}).name="spectral-body",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"liquid",filterId:"mantle-of-madness",color:37119,time:0,blend:5,intensity:1e-4,spectral:!1,scale:7,animated:{time:{active:!0,speed:.0015,animType:"move"},intensity:{active:!0,animType:"syncCosOscillation",loopDuration:3e4,val1:1e-4,val2:4},scale:{active:!0,animType:"syncCosOscillation",loopDuration:3e4,val1:7,val2:1}}}],(eF={}).name="mantle-of-madness",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"wave",filterId:"drift-in-plans",time:0,anchorX:.5,anchorY:.5,strength:.035,frequency:80,color:16777215,maxIntensity:1.5,minIntensity:.5,padding:10,animated:{time:{active:!0,speed:.0085,animType:"move"},anchorX:{active:!0,val1:.35,val2:.65,animType:"syncCosOscillation",loopDuration:1e4},anchorY:{active:!0,val1:.35,val2:.65,animType:"syncSinOscillation",loopDuration:1e4}}},{filterType:"liquid",filterId:"drift-in-plans",color:16711680,time:0,blend:6,intensity:5,spectral:!1,scale:2.5,animated:{time:{active:!0,speed:.0018,animType:"move"},color:{active:!0,loopDuration:9e3,animType:"colorOscillation",val1:16711680,val2:16777215}}}],(eF={}).name="drift-in-plans",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zapshadow",filterId:"fire-aura",alphaTolerance:.5},{filterType:"xglow",filterId:"fire-aura",auraType:2,color:9449488,thickness:9.8,scale:4,time:0,auraIntensity:2,subAuraIntensity:1.5,threshold:.4,discard:!0,animated:{time:{active:!0,speed:.0027,animType:"move"},thickness:{active:!0,loopDuration:3e3,animType:"cosOscillation",val1:2,val2:5}}}],(eF={}).name="fire-aura",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zapshadow",filterId:"glacial-aura",alphaTolerance:.5},{filterType:"xglow",filterId:"glacial-aura",auraType:1,color:5282269,thickness:4.5,scale:3,time:0,auraIntensity:.8,subAuraIntensity:.25,threshold:.5,discard:!1,animated:{time:{active:!0,speed:.0018,animType:"move"},thickness:{val1:2,val2:4.7,animType:"cosOscillation",loopDuration:3e3},subAuraIntensity:{val1:.45,val2:.65,animType:"cosOscillation",loopDuration:6e3},auraIntensity:{val1:.9,val2:2.2,animType:"cosOscillation",loopDuration:3e3}}}],(eF={}).name="glacial-aura",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zapshadow",filterId:"anti-aura",alphaTolerance:.5},{filterType:"xglow",filterId:"anti-aura",auraType:2,color:328965,thickness:2.7,scale:7,time:0,auraIntensity:5,subAuraIntensity:2,threshold:.08,discard:!1,animated:{time:{active:!0,speed:.0012,animType:"move"},auraIntensity:{active:!0,loopDuration:3e3,animType:"syncCosOscillation",val1:5,val2:0},subAuraIntensity:{active:!0,loopDuration:3e3,animType:"syncCosOscillation",val1:2,val2:0},color:{active:!0,loopDuration:6e3,animType:"syncColorOscillation",val1:328965,val2:2097152},threshold:{active:!0,loopDuration:1500,animType:"syncCosOscillation",val1:.02,val2:.5}}}],(eF={}).name="anti-aura",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"fire",filterId:"pure-fire-aura",intensity:1,color:16777215,amplitude:1,time:0,blend:2,fireBlend:1,animated:{time:{active:!0,speed:-.0024,animType:"move"},intensity:{active:!0,loopDuration:15e3,val1:.8,val2:2,animType:"syncCosOscillation"},amplitude:{active:!0,loopDuration:4400,val1:1,val2:1.4,animType:"syncCosOscillation"}}},{filterType:"zapshadow",filterId:"pure-fire-aura",alphaTolerance:.5},{filterType:"xglow",filterId:"pure-fire-aura",auraType:2,color:9449488,thickness:9.8,scale:4,time:0,auraIntensity:2,subAuraIntensity:1.5,threshold:.4,discard:!0,animated:{time:{active:!0,speed:.0027,animType:"move"},thickness:{active:!0,loopDuration:3e3,animType:"cosOscillation",val1:2,val2:5}}}],(eF={}).name="pure-fire-aura",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zapshadow",filterId:"pure-fire-aura-2",alphaTolerance:.5},{filterType:"xglow",filterId:"pure-fire-aura-2",auraType:2,color:9449488,thickness:9.8,scale:4,time:0,auraIntensity:1,subAuraIntensity:.3,threshold:.5,discard:!0,animated:{time:{active:!0,speed:.0027,animType:"move"},thickness:{active:!0,loopDuration:3e3,animType:"cosOscillation",val1:2,val2:3.6}}},{filterType:"fire",filterId:"pure-fire-aura-2",intensity:1,color:16777215,amplitude:1,time:0,blend:2,fireBlend:1,animated:{time:{active:!0,speed:-.0024,animType:"move"},intensity:{active:!0,loopDuration:15e3,val1:.8,val2:3,animType:"syncCosOscillation"},amplitude:{active:!0,loopDuration:4400,val1:1,val2:1.6,animType:"syncCosOscillation"}}}],(eF={}).name="pure-fire-aura-2",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"zapshadow",filterId:"pure-ice-aura",alphaTolerance:.5},{filterType:"xglow",filterId:"pure-ice-aura",auraType:1,color:5282269,thickness:4.5,scale:10,time:0,auraIntensity:.25,subAuraIntensity:1,threshold:.5,discard:!1,animated:{time:{active:!0,speed:.0018,animType:"move"},thickness:{val1:2,val2:3.3,animType:"cosOscillation",loopDuration:3e3},subAuraIntensity:{val1:.45,val2:.65,animType:"cosOscillation",loopDuration:6e3},auraIntensity:{val1:.9,val2:2.2,animType:"cosOscillation",loopDuration:3e3}}},{filterType:"smoke",filterId:"pure-ice-aura",color:8441087,time:0,blend:2,dimX:.3,dimY:1,animated:{time:{active:!0,speed:-.006,animType:"move"},dimX:{val1:.4,val2:.2,animType:"cosOscillation",loopDuration:3e3}}}],(eF={}).name="pure-ice-aura",eF.library=eI.MAIN,eF.params=eM,eP.push(eF),eM=[{filterType:"pixel",filterId:"pixelate",sizeX:2.5,sizeY:2.5}],(eF={}).name="pixelate",eF.library=eI.MAIN,eF.params=eM,eP.push(eF);var ek=[];// white : **electric , **waves, ***xrays, **liquid (normal), (clover)
// black : **liquid (protoplasm), **smoke, **rays, outline, **fumes, **fog, **flood, **fire
// no texture : **glow, **bulge, **blur, **bloom
eM=[{filterType:"flood",filterId:"Watery Surface",time:0,color:8379,billowy:.43,tintIntensity:.72,glint:.31,scale:70,padding:10,animated:{time:{active:!0,speed:6e-4,animType:"move"}}}],(eF={}).name="Watery Surface",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"liquid",filterId:"Protoplasm",color:2140910,time:0,blend:8,intensity:4,spectral:!0,scale:1.4,animated:{time:{active:!0,speed:.001,animType:"move"}}}],(eF={}).name="Protoplasm",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"liquid",filterId:"Watery Surface 2",color:2140910,time:0,blend:8,intensity:4,spectral:!1,scale:1.4,animated:{time:{active:!0,speed:.001,animType:"move"}}}],(eF={}).name="Watery Surface 2",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"smoke",filterId:"Smoky Area",color:11184810,time:0,blend:2,dimX:1,dimY:1,animated:{time:{active:!0,speed:.002,animType:"move"}}}],(eF={}).name="Smoky Area",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"electric",filterId:"Shock",color:16777215,time:0,blend:1,intensity:5,animated:{time:{active:!0,speed:.002,animType:"move"}}}],(eF={}).name="Shock",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"xray",filterId:"Annihilating Rays",time:0,color:16759552,blend:9,dimX:1,dimY:1,anchorX:0,anchorY:0,divisor:6,intensity:4,animated:{time:{active:!0,speed:.0012,animType:"move"}}}],(eF={}).name="Annihilating Rays",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"ray",filterId:"Classic Rays",time:0,color:13598720,alpha:.5,divisor:32,anchorX:0,anchorY:0,animated:{time:{active:!0,speed:5e-4,animType:"move"}}}],(eF={}).name="Classic Rays",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"fumes",filterId:"Smoke Filaments",color:8421504,time:0,blend:8,animated:{time:{active:!0,speed:.001,animType:"move"}}}],(eF={}).name="Smoke Filaments",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"fire",filterId:"Flames",intensity:1.5,color:16777215,amplitude:1.3,time:0,blend:2,fireBlend:1,animated:{time:{active:!0,speed:-.0016,animType:"move"}}}],(eF={}).name="Flames",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"xfog",filterId:"Thick Fog",autoFit:!1,color:3182847,time:0,animated:{time:{active:!0,speed:6e-4,animType:"move"}}}],(eF={}).name="Thick Fog",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-vstrong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"glow",filterId:"Glowing Outline",outerStrength:5.5,innerStrength:0,color:24576,quality:.5,padding:10,animated:{outerStrength:{active:!0,loopDuration:3e3,animType:"syncCosOscillation",val1:5.5,val2:1.5}}}],(eF={}).name="Glowing Outline",eF.library=eI.TEMPLATE,eF.params=eM,ek.push(eF),eM=[{filterType:"wave",filterId:"Waves",time:0,anchorX:.5,anchorY:.5,strength:.015,frequency:120,color:16777215,maxIntensity:2.5,minIntensity:.9,padding:10,animated:{time:{active:!0,speed:.0085,animType:"move"}}}],(eF={}).name="Waves",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"wave",filterId:"Waves 2",time:0,anchorX:.5,anchorY:.5,strength:.014,frequency:400,color:16777215,maxIntensity:2.4,minIntensity:.8,padding:10,animated:{time:{active:!0,speed:.0385,animType:"move"}}}],(eF={}).name="Waves 2",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"wave",filterId:"Waves 3",time:0,anchorX:.5,anchorY:.5,strength:.017,frequency:35,color:16777215,maxIntensity:2.6,minIntensity:.9,padding:20,animated:{time:{active:!0,speed:.0085,animType:"move"}}}],(eF={}).name="Waves 3",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"xglow",filterId:"Zone : Fire",auraType:1,color:9449488,scale:1.5,time:0,auraIntensity:1.8,subAuraIntensity:.25,threshold:.6,discard:!1,animated:{time:{active:!0,speed:.0027,animType:"move"},thickness:{active:!0,loopDuration:3e3,animType:"cosOscillation",val1:2,val2:5}}},{filterType:"fire",filterId:"Zone : Fire",intensity:1.5,color:16777215,amplitude:1,time:0,blend:2,fireBlend:1,animated:{time:{active:!0,speed:-.0015,animType:"move"}}}],(eF={}).name="Zone : Fire",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"xglow",filterId:"Zone : Electricity",auraType:2,color:3158064,scale:1.5,time:0,auraIntensity:1,subAuraIntensity:.9,threshold:0,discard:!0,animated:{time:{active:!0,speed:.0027,animType:"move"},thickness:{active:!0,loopDuration:3e3,animType:"cosOscillation",val1:1,val2:2}}},{filterType:"electric",filterId:"Zone : Electricity",color:16777215,time:0,blend:1,intensity:5,animated:{time:{active:!0,speed:.002,animType:"move"}}}],(eF={}).name="Zone : Electricity",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"xglow",filterId:"Zone : Blizzard",auraType:1,color:5282269,thickness:4.5,scale:5,time:0,auraIntensity:.25,subAuraIntensity:1,threshold:.5,discard:!1,animated:{time:{active:!0,speed:.0018,animType:"move"},thickness:{val1:2,val2:3.3,animType:"cosOscillation",loopDuration:3e3},subAuraIntensity:{val1:.05,val2:.1,animType:"cosOscillation",loopDuration:6e3},auraIntensity:{val1:.9,val2:2.2,animType:"cosOscillation",loopDuration:3e3}}},{filterType:"smoke",filterId:"Zone : Blizzard",color:8441087,time:0,blend:2,dimY:1,animated:{time:{active:!0,speed:-.005,animType:"move"},dimX:{val1:.4,val2:.2,animType:"cosOscillation",loopDuration:3e3}}}],(eF={}).name="Zone : Blizzard",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"bulgepinch",filterId:"Bulging Out",padding:150,strength:0,radiusPercent:200,animated:{strength:{active:!0,animType:"cosOscillation",loopDuration:2e3,val1:0,val2:.45}}}],(eF={}).name="Bulging Out",eF.library=eI.TEMPLATE,eF.params=eM,ek.push(eF),eM=[{filterType:"blur",filterId:"Blurred Texture",padding:25,quality:4,blur:0,blurX:0,blurY:0,animated:{blurX:{active:!0,animType:"syncCosOscillation",loopDuration:500,val1:0,val2:6},blurY:{active:!0,animType:"syncCosOscillation",loopDuration:750,val1:0,val2:6}}}],(eF={}).name="Blurred Texture",eF.library=eI.TEMPLATE,eF.params=eM,ek.push(eF),eM=[{filterType:"xbloom",filterId:"Bloomed Texture",threshold:.35,bloomScale:0,brightness:1,blur:.1,padding:10,quality:15,blendMode:0,animated:{bloomScale:{active:!0,loopDuration:2e3,animType:"syncCosOscillation",val1:0,val2:2.1},threshold:{active:!1,loopDuration:1e3,animType:"syncCosOscillation",val1:0,val2:1.9}}}],(eF={}).name="Bloomed Texture",eF.library=eI.TEMPLATE,eF.params=eM,ek.push(eF),eM=[{filterType:"liquid",filterId:"Wild Magic",color:16711680,time:0,blend:6,intensity:5,spectral:!1,scale:2.5,animated:{time:{active:!0,speed:.0018,animType:"move"}}},{filterType:"wave",filterId:"Wild Magic",time:0,anchorX:.5,anchorY:.5,strength:.014,frequency:10,color:16777215,maxIntensity:1.3,minIntensity:.6,padding:10,animated:{time:{active:!0,speed:.0065,animType:"move"}}}],(eF={}).name="Wild Magic",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"web",filterId:"Spider Web 1",anchorX:.5,anchorY:.5,color:16777215,thickness:2,div2:5,time:98.8,animated:{time:{active:!0,loopDuration:5e3,animType:"cosOscillation",val1:98.8,val2:99.7}}}],(eF={}).name="Spider Web 1",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"web",filterId:"Spider Web 2",anchorX:.5,anchorY:.5,color:13421772,animated:{time:{active:!0,speed:5e-4,animType:"move"}}},{filterType:"liquid",filterId:"Spider Web 2",color:16711680,time:0,blend:4,intensity:8,spectral:!1,scale:.2,animated:{time:{active:!0,speed:5e-4,animType:"move"}}}],(eF={}).name="Spider Web 2",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF),eM=[{filterType:"web",filterId:"Spider Web 3",anchorX:.5,anchorY:.5,color:13421772,time:100},{filterType:"liquid",filterId:"Spider Web 3",color:16711680,time:0,blend:1,intensity:4,spectral:!0,scale:.2,animated:{time:{active:!0,speed:5e-4,animType:"move"}}}],(eF={}).name="Spider Web 3",eF.library=eI.TEMPLATE,eF.defaultTexture="modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png",eF.params=eM,ek.push(eF);var eS=eP.concat(ek);let eA=tu(),eO={ARCHAIC:"",V030:"0.3.0",V040:"0.4.0",V040b:"0.4.0b",V041:"0.4.1",V043:"0.4.3"};async function e_(){if(e6()){var e;try{e=game.settings.get("tokenmagic","migration")}catch(t){e=eO.ARCHAIC}e<eO.V030&&await eX(),e<eO.V040&&await ez(),e<eO.V040b&&await eD(),e<eO.V041&&await eE(),e<eO.V043&&await eR()}}// migrating to the new presets data
async function eX(){var e=game.settings.get("tokenmagic","presets");if(null!=e){ti("Migration 0.3.0 - Launching presets data migration...");let t=!1;for(let i of e)i.hasOwnProperty("library")?i.library!==eI.TEMPLATE||t||(t=!0,ti("Migration 0.3.0 - Found template presets. Templates will not be added.")):(i.library=eI.MAIN,ti(`Migration 0.3.0 - Adding ${i.name} to ${eI.MAIN}`));t||ti("Migration 0.3.0 - Merging templates presets.");let i=t?e:e.concat(ek);try{await game.settings.set("tokenmagic","presets",i),await game.settings.set("tokenmagic","migration",eO.V030),ti("Migration 0.3.0 - Migration successful!")}catch(e){tr("Migration 0.3.0 - Migration failed."),tr(e)}}}async function ez(){var e=game.settings.get("tokenmagic","presets");if(null!=e){// Adding zOrder for the template presets only
// Does not break visuals
for(let t of(ti("Migration 0.4.0 - Launching presets data migration..."),e))if(t.library===eI.TEMPLATE){ti(`Migration 0.4.0 - Checking template preset ${t.name}...`);let e=1;for(let i of t.params)!i.hasOwnProperty("zOrder")&&(i.zOrder=e,ti(`Migration 0.4.0 - Updating ${i.filterType} in ${t.name}...`),e++)}try{await game.settings.set("tokenmagic","presets",e),ti("Migration 0.4.0 - Importing new template presets..."),await eA.importPresetLibraryFromPath("modules/tokenmagic/import/TMFX-update-presets-v040.json",{overwrite:!1}),await game.settings.set("tokenmagic","migration",eO.V040),ti("Migration 0.4.0 - Migration successful!")}catch(e){tr("Migration 0.4.0 - Migration failed."),tr(e)}}}async function eD(){var e=game.settings.get("tokenmagic","presets");if(null!=e){ti("Migration 0.4.0b - Launching presets data migration...");try{await game.settings.set("tokenmagic","presets",e),ti("Migration 0.4.0b - updating template presets..."),await eA.importPresetLibraryFromPath("modules/tokenmagic/import/TMFX-update-presets-v040b.json",{overwrite:!0}),await game.settings.set("tokenmagic","migration",eO.V040b),ti("Migration 0.4.0b - Migration successful!")}catch(e){tr("Migration 0.4.0b - Migration failed."),tr(e)}}}async function eE(){var e=game.settings.get("tokenmagic","presets");if(null!=e){ti("Migration 0.4.1 - Launching presets data migration...");try{await game.settings.set("tokenmagic","presets",e),ti("Migration 0.4.1 - updating template presets..."),await eA.importPresetLibraryFromPath("modules/tokenmagic/import/TMFX-update-presets-v041.json",{overwrite:!0}),await game.settings.set("tokenmagic","migration",eO.V041),ti("Migration 0.4.1 - Migration successful!")}catch(e){tr("Migration 0.4.1 - Migration failed."),tr(e)}}}async function eR(){var e=game.settings.get("tokenmagic","presets");if(null!=e){ti("Migration 0.4.3 - Launching presets data migration...");try{await game.settings.set("tokenmagic","presets",e),ti("Migration 0.4.3 - updating template presets..."),await eA.importPresetLibraryFromPath("modules/tokenmagic/import/TMFX-update-presets-v043.json",{overwrite:!0}),await game.settings.set("tokenmagic","migration",eO.V043),ti("Migration 0.4.3 - Migration successful!")}catch(e){tr("Migration 0.4.3 - Migration failed."),tr(e)}}}class eY extends PIXI.filters.CRTFilter{constructor(t){super(),this.curvature=1,this.lineWidth=1,this.lineContrast=.25,this.verticalLine=!1,this.noise=.08,this.noiseSize=1,this.seed=0,this.vignetting=0,this.zOrder=320,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}}class eL extends PIXI.filters.RGBSplitFilter{constructor(t){super(),this.red=new Float32Array([-10,0]),this.green=new Float32Array([0,10]),this.blue=new Float32Array([0,0]),this.zOrder=340,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get redX(){return this.uniforms.red[0]}set redX(e){this.uniforms.red[0]=e}get redY(){return this.uniforms.red[1]}set redY(e){this.uniforms.red[1]=e}get greenX(){return this.uniforms.green[0]}set greenX(e){this.uniforms.green[0]=e}get greenY(){return this.uniforms.green[1]}set greenY(e){this.uniforms.green[1]=e}get blueX(){return this.uniforms.blue[0]}set blueX(e){this.uniforms.blue[0]=e}get blueY(){return this.uniforms.blue[1]}set blueY(e){this.uniforms.blue[1]=e}}function ej(e,i){let a={tokenmagic:{options:{}}};e.preset&&""!==e.preset&&e.preset!==t&&(a.tokenmagic.options.tmfxPreset=e.preset),e.texture&&""!==e.texture&&(a.tokenmagic.options.tmfxTexture=e.texture),e.tint&&""!==e.tint&&(a.tokenmagic.options.tmfxTint=e.tint),a.tokenmagic.options.tmfxTextureAlpha=e.opacity,i.document.updateSource({flags:{tokenmagic:a.tokenmagic}})}function eq(e,...i){let[a]=i,r=e(...i);if(!r||r.hasOwnProperty("tmfxPreset"))return r;let s=game.settings.get("tokenmagic","autoTemplateSettings");return s.overrides&&function(e=[],t,i){let a=e.find(e=>e.target.toLowerCase()===t.name.toLowerCase());return!!a&&(ej(a,i),!0)}(Object.values(s.overrides),a,r)||function(e={},i,a){let r,s;if(i.hasDamage){// some items/spells have multiple damage types
// this loop looks over all the types until it finds one with a valid fx preset
for(let[o,l]of i.data.data.damage.parts)if((r=(s=e[l]||{})[a.data.t])&&r.preset!==t)break;r&&ej(mergeObject(r,{opacity:s.opacity,tint:s.tint},!0,!0),a)}}(s.categories,a,r),r}let eN=new class{static get defaultConfiguration(){let e={categories:{},overrides:{0:{target:"Stinking Cloud",opacity:.5,tint:"#00a80b",preset:"Smoky Area",texture:null},1:{target:"Web",opacity:.5,tint:"#808080",preset:"Spider Web 2",texture:null}}};return Object.keys(CONFIG.DND5E.damageTypes).forEach(i=>{if(void 0==e.categories[i]){let t={opacity:.5,tint:null};switch(i.toLowerCase()){case"acid":t.tint="#2d8000",t.opacity=.6;break;case"cold":t.tint="#47b3ff";break;case"necrotic":t.tint="#502673";break;case"poison":t.tint="#00a80b";break;case"psychic":t.tint="#8000ff";break;case"thunder":t.tint="#0060ff"}e.categories[i]=t}Object.keys(CONFIG.MeasuredTemplate.types).forEach(a=>{let r={preset:t,texture:null};switch(i.toLowerCase()){case"acid":r.preset="Watery Surface 2";break;case"cold":r.preset="Thick Fog";break;case"fire":r.preset="Flames";break;case"force":r.preset="Waves 3";break;case"lightning":r.preset="Shock";break;case"necrotic":r.preset="Smoke Filaments";break;case"poison":r.preset="Smoky Area";break;case"psychic":r.preset="Classic Rays";break;case"radiant":r.preset="Annihilating Rays";break;case"thunder":r.preset="Waves"}e.categories[i][a]=r})}),e}constructor(){this._enabled=!1}get enabled(){return this._enabled}configure(e=!1){if("dnd5e"===game.system.id){if(e){if(!this._enabled){if(game.modules.get("lib-wrapper")?.active)libWrapper.register("tokenmagic","game.dnd5e.canvas.AbilityTemplate.fromItem",eq,"WRAPPER");else{let e=game.dnd5e.canvas.AbilityTemplate.fromItem;game.dnd5e.canvas.AbilityTemplate.fromItem=function(){return eq.call(this,e.bind(this),...arguments)}}}}else this._enabled&&(game.modules.get("lib-wrapper")?.active?libWrapper.unregister("tokenmagic","game.dnd5e.canvas.AbilityTemplate.fromItem"):window.location.reload());this._enabled=e}}getData(){return{hasAutoTemplates:!0,dmgTypes:CONFIG.DND5E.damageTypes,templateTypes:CONFIG.MeasuredTemplate.types}}};function eV(e,i){let a={tokenmagic:{options:{}}};e.preset&&""!==e.preset&&e.preset!==t&&(a.tokenmagic.options.tmfxPreset=e.preset),e.texture&&""!==e.texture&&(a.tokenmagic.options.tmfxTexture=e.texture),e.tint&&""!==e.tint&&(a.tokenmagic.options.tmfxTint=e.tint),a.tokenmagic.options.tmfxTextureAlpha=e.opacity,i.updateSource({flags:{tokenmagic:a.tokenmagic}})}let eB=new class{static get defaultConfiguration(){let e={categories:{},overrides:{0:{target:"Stinking Cloud",opacity:.5,tint:"#00a80b",preset:"Smoky Area",texture:null},1:{target:"Sanguine Mist",opacity:.6,tint:"#c41212",preset:"Smoky Area"},2:{target:"Web",opacity:.5,tint:"#808080",preset:"Spider Web 2",texture:null},3:{target:"Incendiary Aura",opacity:.2,tint:"#b12910",preset:"Smoke Filaments",texture:null}}};return Object.keys(CONFIG.PF2E.damageTraits).forEach(i=>{if(void 0==e.categories[i]){let t={opacity:.5,tint:null};switch(i.toLowerCase()){case"acid":t.tint="#2d8000",t.opacity=.6;break;case"cold":t.tint="#47b3ff";break;case"electricity":case"fire":case"force":case"positive":break;case"mental":t.tint="#8000ff";break;case"negative":t.tint="#502673";break;case"poison":t.tint="#00a80b";break;case"sonic":t.tint="#0060ff"}e.categories[i]=t}Object.keys(CONFIG.MeasuredTemplate.types).forEach(a=>{let r={preset:t,texture:null};switch(i.toLowerCase()){case"acid":r.preset="Watery Surface 2";break;case"cold":r.preset="Thick Fog";break;case"electricity":r.preset="Shock";break;case"fire":r.preset="Flames";break;case"force":r.preset="Waves 3";break;case"mental":r.preset="Classic Rays";break;case"negative":r.preset="Smoke Filaments";break;case"poison":r.preset="Smoky Area";break;case"positive":r.preset="Annihilating Rays";break;case"sonic":r.preset="Waves"}e.categories[i][a]=r})}),e}constructor(){this._enabled=!1}configure(e=!1){"pf2e"===game.system.id&&(this._enabled=e)}get enabled(){return this._enabled}set enabled(e){}getData(){return{hasAutoTemplates:!0,dmgTypes:CONFIG.PF2E.damageTraits,templateTypes:CONFIG.MeasuredTemplate.types}}preCreateMeasuredTemplate(e){if(e.hasOwnProperty("tmfxPreset"))return e;let i=e.flags?.pf2e?.origin,a=game.settings.get("tokenmagic","autoTemplateSettings");return a.overrides&&function(e=[],t,i){let{name:a,slug:r}=t,s=e.find(e=>e.target.toLowerCase()===a?.toLowerCase());return!!s&&(eV(s,i),!0)}(Object.values(a.overrides),i,e)||function(e={},i,a){let r,s;if(!i.traits?.length)return 0;// some templates may have multiple traits
// this loop looks over all of them until it finds one with a valid fx preset
for(let o of i.traits)if((r=(s=e[o.toLowerCase()]||{})[a.t])&&r.preset!==t)break;r&&eV(mergeObject(r,{opacity:s.opacity,tint:s.tint},!0,!0),a)}(a.categories,i,e),e}};function eW(e,i){let a={tokenmagic:{options:{}}};e.preset&&""!==e.preset&&e.preset!==t&&(a.tokenmagic.options.tmfxPreset=e.preset),e.texture&&""!==e.texture&&(a.tokenmagic.options.tmfxTexture=e.texture),e.tint&&""!==e.tint&&(a.tokenmagic.options.tmfxTint=e.tint),a.tokenmagic.options.tmfxTextureAlpha=e.opacity,mergeObject(i,{"flags.tokenmagic":a.tokenmagic})}let e$=new class{static get defaultConfiguration(){let e={categories:{},overrides:{0:{target:"Игни",opacity:.5,tint:"#00a80b",preset:"Flames",texture:null}}};return Object.keys(CONFIG.witcher.meleeSkills).forEach(i=>{if(void 0==e.categories[i]){let t={opacity:.5,tint:null};switch(i.toLowerCase()){case"brawling":t.tint="#2d8000",t.opacity=.6;break;case"melee":t.tint="#47b3ff";break;case"small blades":t.tint="#502673";break;case"staff/spear":t.tint="#00a80b";break;case"swordsmanship":t.tint="#8000ff";break;case"athletics":t.tint="#0060ff"}e.categories[i]=t}Object.keys(CONFIG.MeasuredTemplate.types).forEach(a=>{let r={preset:t,texture:null};switch(i.toLowerCase()){case"acid":r.preset="slashing";break;case"cold":r.preset="bludgeoning";break;case"fire":r.preset="piercing";break;case"force":r.preset="elemental"}e.categories[i][a]=r})}),e}constructor(){this._enabled=!1}get enabled(){return this._enabled}configure(e=!1){"TheWitcherTRPG"===game.system.id&&(this._enabled=e)}getData(){return{hasAutoTemplates:!0,meleeSkills:CONFIG.witcher.meleeSkills,templateTypes:CONFIG.MeasuredTemplate.types}}preCreateMeasuredTemplate(e){if(e.hasOwnProperty("tmfxPreset"))return e;let i=game.settings.get("tokenmagic","autoTemplateSettings");i.overrides&&function(e=[],t){let i=t.flags.witcher?.origin?.name,a=e.find(e=>e.target.toLowerCase()===i?.toLowerCase());return!!a&&(eW(a,t),!0)}(Object.values(i.overrides),e)||function(e={},i){let a,r;let s=i.flags.witcher?.origin?.traits??[];for(let o of s)if((a=(r=e[o]||{})[i.t])&&a.preset!==t)break;a&&eW(mergeObject(a,{opacity:r.opacity,tint:r.tint},!0,!0),i)}(i.categories,e)}},eG=tu();class eU extends FormApplication{constructor(e={},t){super(e,t)}/** @override */static get defaultOptions(){return{...super.defaultOptions,template:"modules/tokenmagic/templates/settings/settings.html",height:"auto",title:game.i18n.localize("TMFX.settings.autoTemplateSettings.dialog.title"),width:600,classes:["tokenmagic","settings"],tabs:[{navSelector:".tabs",contentSelector:"form",initial:"name"}],submitOnClose:!1}}static init(){let e={key:"autoTemplateSettings",config:{name:game.i18n.localize("TMFX.settings.autoTemplateSettings.button.name"),label:game.i18n.localize("TMFX.settings.autoTemplateSettings.button.label"),hint:game.i18n.localize("TMFX.settings.autoTemplateSettings.button.hint"),type:eU,restricted:!0}},t={key:"autoTemplateSettings",config:{name:game.i18n.localize("TMFX.settings.autoTemplateSettings.name"),hint:game.i18n.localize("TMFX.settings.autoTemplateSettings.hint"),scope:"world",config:!1,default:{},type:Object}},i=this.getSystemTemplates(),a=!!i;i&&(game.settings.registerMenu("tokenmagic",e.key,e.config),game.settings.register("tokenmagic",t.key,mergeObject(t.config,{default:i.constructor.defaultConfiguration},!0,!0))),game.settings.register("tokenmagic","autoTemplateEnabled",{name:game.i18n.localize("TMFX.settings.autoTemplateEnabled.name"),hint:game.i18n.localize("TMFX.settings.autoTemplateEnabled.hint"),scope:"world",config:a,default:a,type:Boolean,onChange:e=>eU.configureAutoTemplate(e)}),game.settings.register("tokenmagic","defaultTemplateOnHover",{name:game.i18n.localize("TMFX.settings.defaultTemplateOnHover.name"),hint:game.i18n.localize("TMFX.settings.defaultTemplateOnHover.hint"),scope:"world",config:!0,default:a,type:Boolean,onChange:()=>window.location.reload()}),game.settings.register("tokenmagic","autohideTemplateElements",{name:game.i18n.localize("TMFX.settings.autohideTemplateElements.name"),hint:game.i18n.localize("TMFX.settings.autohideTemplateElements.hint"),scope:"world",config:!0,default:!0,type:Boolean,onChange:()=>window.location.reload()}),game.settings.register("tokenmagic","useAdditivePadding",{name:game.i18n.localize("TMFX.settings.useMaxPadding.name"),hint:game.i18n.localize("TMFX.settings.useMaxPadding.hint"),scope:"world",config:!0,default:!1,type:Boolean}),game.settings.register("tokenmagic","minPadding",{name:game.i18n.localize("TMFX.settings.minPadding.name"),hint:game.i18n.localize("TMFX.settings.minPadding.hint"),scope:"world",config:!0,default:50,type:Number}),game.settings.register("tokenmagic","fxPlayerPermission",{name:game.i18n.localize("TMFX.settings.fxPlayerPermission.name"),hint:game.i18n.localize("TMFX.settings.fxPlayerPermission.hint"),scope:"world",config:!0,default:!1,type:Boolean}),game.settings.register("tokenmagic","importOverwrite",{name:game.i18n.localize("TMFX.settings.importOverwrite.name"),hint:game.i18n.localize("TMFX.settings.importOverwrite.hint"),scope:"world",config:!0,default:!1,type:Boolean}),game.settings.register("tokenmagic","useZOrder",{name:game.i18n.localize("TMFX.settings.useZOrder.name"),hint:game.i18n.localize("TMFX.settings.useZOrder.hint"),scope:"world",config:!0,default:!1,type:Boolean}),game.settings.register("tokenmagic","disableAnimations",{name:game.i18n.localize("TMFX.settings.disableAnimations.name"),hint:game.i18n.localize("TMFX.settings.disableAnimations.hint"),scope:"client",config:!0,default:!1,type:Boolean,onChange:()=>window.location.reload()}),game.settings.register("tokenmagic","disableCaching",{name:game.i18n.localize("TMFX.settings.disableCaching.name"),hint:game.i18n.localize("TMFX.settings.disableCaching.hint"),scope:"client",config:!0,default:!0,type:Boolean}),game.settings.register("tokenmagic","disableVideo",{name:game.i18n.localize("TMFX.settings.disableVideo.name"),hint:game.i18n.localize("TMFX.settings.disableVideo.hint"),scope:"world",config:!0,default:!1,type:Boolean,onChange:()=>window.location.reload()}),game.settings.register("tokenmagic","presets",{name:"Token Magic FX presets",hint:"Token Magic FX presets",scope:"world",config:!1,default:eP,type:Object}),game.settings.register("tokenmagic","migration",{name:"TMFX Data Version",hint:"TMFX Data Version",scope:"world",config:!1,default:eO.ARCHAIC,type:String}),loadTemplates(["modules/tokenmagic/templates/settings/settings.html","modules/tokenmagic/templates/settings/dnd5e/categories.html","modules/tokenmagic/templates/settings/dnd5e/overrides.html","modules/tokenmagic/templates/settings/pf2e/categories.html","modules/tokenmagic/templates/settings/pf2e/overrides.html","modules/tokenmagic/templates/settings/TheWitcherTRPG/categories.html","modules/tokenmagic/templates/settings/TheWitcherTRPG/overrides.html"])}static configureAutoTemplate(e=!1){this.getSystemTemplates()?.configure(e)}static getSystemTemplates(){switch(game.system.id){case"dnd5e":return eN;case"pf2e":return eB;case"TheWitcherTRPG":return e$;default:return null}}getSettingsData(){let e={autoTemplateEnable:game.settings.get("tokenmagic","autoTemplateEnabled")};return eU.getSystemTemplates()&&(e.autoTemplateSettings=game.settings.get("tokenmagic","autoTemplateSettings")),e}/** @override */getData(){let e=super.getData();e.hasAutoTemplates=!1,e.emptyPreset=t;let i=eU.getSystemTemplates();return i&&mergeObject(e,i.getData()),e.presets=eG.getPresets(eI.TEMPLATE).sort(function(e,t){return e.name<t.name?-1:e.name>t.name?1:0}),e.system={id:game.system.id,title:game.system.title},e.settings=this.getSettingsData(),e.submitText=game.i18n.localize("TMFX.save"),e}/** @override */async _updateObject(e,t){let i=expandObject(t);for(let[e,t]of Object.entries(i)){if("autoTemplateSettings"===e&&t.overrides){let e={};Object.values(t.overrides).forEach((t,i)=>e[i]=t),t.overrides=e}await game.settings.set("tokenmagic",e,t)}}/** @override */activateListeners(e){super.activateListeners(e),e.find("button.add-override").click(this._onAddOverride.bind(this)),e.find("button.remove-override").click(this._onRemoveOverride.bind(this))}async _onAddOverride(e){e.preventDefault();let i=0,a=e.target.closest("div.tab").querySelectorAll("div.override-entry"),r=a[a.length-1];r&&(i=r.dataset.idx+1);let s={};s[`autoTemplateSettings.overrides.${i}.target`]="",s[`autoTemplateSettings.overrides.${i}.opacity`]=.5,s[`autoTemplateSettings.overrides.${i}.tint`]=null,s[`autoTemplateSettings.overrides.${i}.preset`]=t,s[`autoTemplateSettings.overrides.${i}.texture`]=null,await this._onSubmit(e,{updateData:s,preventClose:!0}),this.render()}async _onRemoveOverride(e){e.preventDefault();let t=e.target.dataset.idx,i=e.target.closest(`div[data-idx="${t}"]`);if(!i)return!0;i.remove(),await this._onSubmit(e,{preventClose:!0}),this.render()}}Hooks.once("init",()=>{let e,i,a,r;// Extracted from https://github.com/leapfrogtechnology/just-handlebars-helpers/
Handlebars.registerHelper("concat",function(...e){return"object"==typeof e[e.length-1]&&e.pop(),e.join("")}),eU.init(),eU.configureAutoTemplate(game.settings.get("tokenmagic","autoTemplateEnabled"));let s=async function(e,...i){let a,r;let[s]=i,o=s.texture??"",l=!!s.texture,n=s.flags?.tokenmagic?.options??null;if(n||(a=s["flags.tokenmagic.templateData.preset"]),r=!!a,l&&(s.texture=ts(s.texture)),null==n){if(r&&a!==t){let e=eG._getPresetTemplateDefaultTexture(a);null!=e&&(""===o||o.startsWith("modules/tokenmagic/fx/assets/templates/"))&&(s.texture=e)}else l&&o.startsWith("modules/tokenmagic/fx/assets/templates/")&&r&&a===t&&(s.texture="")}return await e(...i)},o=async function(e,...t){this.document.texture&&(this.document.texture=ts(this.document.texture));let i=await e(...t);return this.template.alpha=this.document.getFlag("tokenmagic","templateData")?.opacity??1,i};if(!e8()){let t=Math.toRadians;i="WRAPPER",e=function(e,...t){let[i]=t;return i?.refreshShape&&(i.refreshShape=this.template&&!this.template._destroyed),e(...t)},/* ------------------------------------------------------------------------------------ */r="OVERRIDE",/**
		 *
		 * @return {wmtRefreshTemplate}
		 */a=function(){let e=this.template.clear();if(!this.isVisible)return;// Fill Color or Texture
if(// Draw the Template outline
e.lineStyle(this._borderThickness,this.borderColor,.75).beginFill(0,0),this.texture){let i=PIXI.Matrix.IDENTITY;// rectangle
if(this.shape.width&&this.shape.height)i.scale(this.shape.width/this.texture.width,this.shape.height/this.texture.height);else if(this.shape.radius)i.scale(2*this.shape.radius/this.texture.height,2*this.shape.radius/this.texture.width),// Circle center is texture start...
i.translate(-this.shape.radius,-this.shape.radius);else if("ray"===this.document.t){let e=canvas.dimensions,a=this.document.width*e.size/e.distance,r=this.document.distance*e.size/e.distance;i.scale(r/this.texture.width,a/this.texture.height),i.translate(0,-(.5*a)),i.rotate(t(this.document.direction))}else{// cone
let e=canvas.dimensions,{direction:a,distance:r,angle:s}=this.document;r*=e.size/e.distance,a=Math.toRadians(a);let o=this.document.distance*e.size/e.distance;r/=Math.cos(Math.toRadians(s/2));// Get the cone shape as a polygon
let l=[-(s/2),s/2].map(e=>Ray.fromAngle(0,0,a+Math.toRadians(e),r+1)),n=Math.sqrt((l[0].B.x-l[1].B.x)*(l[0].B.x-l[1].B.x)+(l[0].B.y-l[1].B.y)*(l[0].B.y-l[1].B.y));i.scale(o/this.texture.width,n/this.texture.height),i.translate(0,-n/2),i.rotate(t(this.document.direction))}e.beginTextureFill({texture:this.texture,matrix:i,alpha:1});let a=getProperty(this.texture,"baseTexture.resource.source");a&&"VIDEO"===a.tagName&&(a.loop=!0,a.muted=!0,game.video.play(a))}else e.beginFill(0,0);// Draw the shape
e.drawShape(this.shape),// Draw origin and destination points
e.lineStyle(this._borderThickness,0).beginFill(0,.5).drawCircle(0,0,6).drawCircle(this.ray.dx,this.ray.dy,6),// Update visibility
this.controlIcon.visible=!!this.layer.active,this.controlIcon.border.visible=!!this.hover;let i=this.document.getFlag("tokenmagic","templateData")?.opacity??1;return e.alpha=this.hover?i/1.25:i,this};/* ------------------------------------------------------------------------------------ */}if(game.settings.get("tokenmagic","autohideTemplateElements")){/**
		 *
		 * @param wrapped
		 * @param args
		 * @return {*}
		 */let t=function(e,...t){// Save texture and border thickness
let i=this.texture,a=this._borderThickness;(this._original||this.parent===canvas.templates.preview)&&(this.texture=null),this.texture&&""!==this.texture&&!this._hover&&(this._borderThickness=0);let r=e(...t);// Restore texture and border thickness
this.texture=i,this._borderThickness=a;{// Show the origin/destination points and ruler text only on hover or while creating but not while moving
let e=this._original??this,t=!this._original&&(this._hover||this.parent===canvas.templates.preview);if(!t&&e.template?.geometry){// Hide origin and destination points, i.e., hide everything except the template shape
for(let t of e.template.geometry.graphicsData)t.shape!==e.shape&&(t.fillStyle.visible=!1,t.lineStyle.visible=!1);e.template.geometry.invalidate()}e.ruler&&(e.ruler.renderable=t),e.controlIcon&&(e.controlIcon.renderable=e.owner),e.handle&&(e.handle.renderable=e.owner)}return r};/* ------------------------------------------------------------------------------------ */if(e){let i=e;e=function(){return t.call(this,i.bind(this),...arguments)}}else i="WRAPPER",e=t}if(game.settings.get("tokenmagic","defaultTemplateOnHover")&&Hooks.on("canvasReady",()=>{canvas.stage.on("mousemove",e=>{let{x:t,y:i}=e.data.getLocalPosition(canvas.templates);for(let e of canvas.templates.placeables){let a=canvas.grid.getHighlightLayer(`MeasuredTemplate.${e.id}`),r=e.document.getFlag("tokenmagic","templateData")?.opacity??1;if(e.texture&&""!==e.texture){let{x:s,y:o}=e.center,l=e.shape?.contains(t-s,i-o);a.renderable=l,e.template.alpha=(l?.5:1)*r}else a.renderable=!0,e.template.alpha=r}})}),game.modules.get("lib-wrapper")?.active)libWrapper.register("tokenmagic","MeasuredTemplateDocument.prototype.update",s,"WRAPPER"),libWrapper.register("tokenmagic","MeasuredTemplate.prototype._draw",o,"WRAPPER"),e&&libWrapper.register("tokenmagic","MeasuredTemplate.prototype._applyRenderFlags",e,i),a&&libWrapper.register("tokenmagic","MeasuredTemplate.prototype._refreshTemplate",a,r);else{let t=MeasuredTemplateDocument.prototype.update;MeasuredTemplateDocument.prototype.update=function(){return s.call(this,t.bind(this),...arguments)};let l=MeasuredTemplate.prototype._draw;if(MeasuredTemplate.prototype._draw=function(){return o.call(this,l.bind(this),...arguments)},e){if(i&&"OVERRIDE"!==i){let t=MeasuredTemplate.prototype._applyRenderFlags;MeasuredTemplate.prototype._applyRenderFlags=function(){return e.call(this,t.bind(this),...arguments)}}else MeasuredTemplate.prototype._applyRenderFlags=e}if(a){if(r&&"OVERRIDE"!==r){let e=MeasuredTemplate.prototype._refreshTemplate;MeasuredTemplate.prototype._refreshTemplate=function(){return a.call(this,e.bind(this),...arguments)}}else MeasuredTemplate.prototype._refreshTemplate=a}}});/*

It's getting messy here !
I will fix it in a future version
(+ duplicated code to factorize and code to improve)

*/let eH="module.tokenmagic",eZ={adjustment:a,ascii:r,dot:o,distortion:l,crt:eY,oldfilm:n,glow:c,outline:m,bevel:u,xbloom:s,shadow:class extends g{constructor(t){super(),this.enabled=!1,this.rotation=45,this.distance=5,this.color=0,this.alpha=.5,this.shadowOnly=!1,this.blur=2,this.quality=3,this.padding=10,this.zOrder=110,this.animated={},this.resolution=game.settings.get("core","pixelRatioResolutionScaling")?window.devicePixelRatio:PIXI.settings.FILTER_RESOLUTION,this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams()),this.autoFit=!1}},twist:v,zoomblur:b,blur:class extends y{constructor(t){super(),this.enabled=!1,this.blur=2,this.quality=4,this.zOrder=290,this.repeatEdgePixels=!1,this.animated={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get blur(){return this.strengthX}set blur(e){this.strengthX=this.strengthY=e}get blurX(){return this.strengthX}set blurX(e){this.strengthX=e}get blurY(){return this.strengthY}set blurY(e){this.strengthY=e}calculatePadding(){let e=this.targetPlaceable.worldTransform.a;this.blurXFilter.blur=e*this.strengthX,this.blurYFilter.blur=e*this.strengthY,this.updatePadding(),super.calculatePadding()}},bulgepinch:I,zapshadow:M,ray:k,fog:A,xfog:_,electric:z,wave:E,shockwave:w,fire:Y,fumes:j,smoke:B,flood:N,images:H,field:G,xray:K,liquid:Q,xglow:et,pixel:ei,web:er,ripples:eo,globes:en,transform:em,splash:ed,polymorph:eh,xfire:ev,sprite:ey,spriteMask:eT,replaceColor:eC,ddTint:class extends p{constructor(t){super(h,ew),this.tint=[1,0,0],this.zOrder=100,this.animating={},this.setTMParams(t),this.dummy||(this.anime=new e(this),this.normalizeTMParams())}get tint(){return this.uniforms.tint}set tint(e){this.uniforms.tint=e}},rgbSplit:eL},eK={TOKEN:Token.embeddedName,TILE:Tile.embeddedName,TEMPLATE:MeasuredTemplate.embeddedName,DRAWING:Drawing.embeddedName,NOT_SUPPORTED:null};function eJ(e){return game.i18n.localize(e)}async function eQ(e,t){let i=JSON.stringify(e,null,4),a=document.createElement("a"),r=new Blob([i],{type:"plain/text"});a.href=URL.createObjectURL(r),a.download=t+".json",a.click(),URL.revokeObjectURL(a.href)}let e0={SET_FLAG:"TMFXSetFlag",SET_ANIME_FLAG:"TMFXSetAnimeFlag"};function e1(e,t,i){let a={tmAction:i,tmPlaceableId:e.id,tmPlaceableType:e._TMFXgetPlaceableType(),tmFlag:t,tmViewedScene:game.user.viewedScene};game.socket.emit(eH,a,e=>{})}function e2(e){return game.modules.has(e)&&!0===game.modules.get(e).active}function e3(){return game.settings.get("tokenmagic","minPadding")}function e5(){return game.settings.get("tokenmagic","useAdditivePadding")}function e4(){return game.settings.get("tokenmagic","disableCaching")}function e8(){return game.settings.get("tokenmagic","disableVideo")}function e6(){let e=game.users.find(e=>e.isGM&&e.active);return e&&game.user===e}function e7(){return game.settings.get("tokenmagic","fxPlayerPermission")&&!e6()}function e9(){canvas.app.renderer.filter.useMaxPadding=!e5()}function te(){return game.settings.get("tokenmagic","useZOrder")}function tt(){return game.settings.get("tokenmagic","disableAnimations")}function ti(e){console.log("%cTokenMagic %c| "+e,"color:#4BC470","color:#B3B3B3")}function ta(e){console.warn("TokenMagic | "+e)}function tr(e){console.error("TokenMagic | "+e)}function ts(e){/*
      /prefix/...               =>   ...
      /modules/tokenmagic/...   =>   modules/tokenmagic/...
  */if(e){let t="/modules/tokenmagic",i=new URL(e,window.location.href);if(i.origin===window.location.origin){let a="/";try{ROUTE_PREFIX&&(a=new URL(ROUTE_PREFIX,window.location.origin).pathname)}catch(e){}e=i.pathname,"/"===a?e=e.slice(1):e.startsWith(a)&&(e.length===a.length||"/"===e[a.length])?e=e.slice(a.length+1):e.startsWith(t)&&(e.length===t.length||"/"===e[t.length])&&(e=e.slice(1))}else e=i.href}return e}function to(){let e=[canvas.tokens,canvas.tiles,canvas.drawings];return e.some(e=>e===canvas.activeLayer)&&canvas.activeLayer.placeables.filter(e=>!0===e.controlled)||[]}function tl(){return canvas.tokens.placeables.filter(e=>e.isTargeted)}function tn(e,t){let i=null;function a(e,t){let i=null;return null!=e&&e.length>0&&(i=e.find(e=>e.id===t)),i}switch(t){case eK.TOKEN:i=a(canvas.tokens.placeables,e);break;case eK.TILE:i=a(canvas.tiles.placeables,e);break;case eK.TEMPLATE:i=a(canvas.templates.placeables,e);break;case eK.DRAWING:i=a(canvas.drawings.placeables,e)}return i}/**
 * Randomizes params using 'randomized' field.
 * 'randomized' is an object consisting of keys named after params to be randomized, which map either
 * to arrays or ranges which will be used to generate a random value.
 * e.g.
 * {
 *  param1: ['foo1', 'foo2', 'foo3'],
 *  param2: { list: ['foo1', 'foo2', 'foo3'], link: 'param5'},
 *  param3: { val1: 0, val2: 1, step: 0.1},
 *  param4: { val1: 0, val2: 10, step: 1, link: 'param6'},
 * }
 * 'link' will assign the same generated value to one other param.
 */function tc(e){if(!e.randomized.hasOwnProperty("active")||e.randomized.active)for(let[t,i]of Object.entries(e.randomized)){let a;if(Array.isArray(i)||i.hasOwnProperty("list")){let e=i.list??i;a=e[Math.floor(Math.random()*e.length)]}else{let e=Math.min(i.val1,i.val2),t=Math.max(i.val1,i.val2),r=i.step??1,s=(t-e+(Number.isInteger(r)?1:0))/r;a=Math.floor(Math.random()*s)*r+e}setProperty(e,t,a),i.hasOwnProperty("link")&&setProperty(e,i.link,a)}}function tm(e,...t){return t.forEach(t=>{Object.keys(t).forEach(i=>{let a=t[i],r=e[i];a instanceof Array?e[i]=[...a]:e[i]=r&&a&&"object"==typeof r&&"object"==typeof a?tm(r,a):a})}),e}function tu(){let t=new PIXI.Container;async function i(e,t=!1){Array.isArray(e)||(e=T(e));let i=to();if(null!=i&&i.length>0)for(let a of i)await o(a,e,t)}async function a(e){Array.isArray(e)||(e=T(e));let t=to();if(null!=t&&t.length>0)for(let i of t)await l(i,e)}async function r(e){Array.isArray(e)||(e=T(e));let t=tl();if(null!=t&&t.length>0)for(let i of t)await l(i,e)}async function s(e,t=!1){Array.isArray(e)||(e=T(e));let i=tl();if(null!=i&&i.length>0)for(let a of i)await o(a,e,t)}async function o(e,t,i=!1){if(Array.isArray(t)||(t=T(t)),!(t instanceof Array&&t.length>0)||null==e)return;let a=i?null:e.document.getFlag("tokenmagic","filters"),r=[];for(let i of t){if(!i.hasOwnProperty("filterType")||!eZ.hasOwnProperty(i.filterType))return;i.hasOwnProperty("rank")||(i.rank=e._TMFXgetMaxFilterRank()),i.hasOwnProperty("filterId")&&null!=i.filterId||(i.filterId=randomID()),i.hasOwnProperty("enabled")&&"boolean"==typeof i.enabled||(i.enabled=!0),i.hasOwnProperty("randomized")&&tc(i),i.placeableId=e.id,i.filterInternalId=randomID(),i.filterOwner=game.data.userId,i.placeableType=e._TMFXgetPlaceableType(),i.updateId=randomID(),r.push({tmFilters:{tmFilterId:i.filterId,tmFilterInternalId:i.filterInternalId,tmFilterType:i.filterType,tmFilterOwner:i.filterOwner,tmParams:i}})}null!=a&&(r=a.concat(r)),await e._TMFXsetFlag(r)}async function l(e,t){let i;if(!t instanceof Array||t.length<1)return;let a=e.document.getFlag("tokenmagic","filters"),r=[];a&&a.forEach(e=>{r.push(duplicate(e))});let s=[];for(let a of t)if(i=!1,a.updateId=randomID(),a.hasOwnProperty("randomized")&&tc(a),r.forEach(e=>{e.tmFilters.tmFilterId===a.filterId&&e.tmFilters.tmFilterType===a.filterType&&e.tmFilters.hasOwnProperty("tmParams")&&(tm(e.tmFilters.tmParams,a),i=!0)}),!i){if(!a.hasOwnProperty("filterType")||!eZ.hasOwnProperty(a.filterType))return;a.hasOwnProperty("rank")||(a.rank=e._TMFXgetMaxFilterRank()),a.hasOwnProperty("filterId")&&null!=a.filterId||(a.filterId=randomID()),a.hasOwnProperty("enabled")&&"boolean"==typeof a.enabled||(a.enabled=!0),a.placeableId=e.id,a.filterInternalId=randomID(),a.filterOwner=game.data.userId,a.placeableType=e._TMFXgetPlaceableType(),s.push({tmFilters:{tmFilterId:a.filterId,tmFilterInternalId:a.filterInternalId,tmFilterType:a.filterType,tmFilterOwner:a.filterOwner,tmParams:a}})}s.length>0&&(r=s.concat(r)),await e._TMFXsetFlag(r)}async function n(e,t){if(!(t instanceof Array)||t.length<1)return;let i=e.document.getFlag("tokenmagic","filters");if(null==i||!(i instanceof Array)||i.length<1)return;// nothing to update...
let a=[];for(let e of(i.forEach(e=>{a.push(duplicate(e))}),t))e.updateId=randomID(),e.hasOwnProperty("randomized")&&tc(e),a.forEach(t=>{t.tmFilters.tmFilterId===e.filterId&&t.tmFilters.tmFilterType===e.filterType&&t.tmFilters.hasOwnProperty("tmParams")&&tm(t.tmFilters.tmParams,e)});await e._TMFXsetFlag(a)}// Deleting filters on targeted tokens
async function c(e=null){let t=tl();if(null!=t&&t.length>0)for(let i of t)await u(i,e)}// Deleting filters on selected placeable(s)
async function m(e=null){let t=to();if(null!=t&&t.length>0)for(let i of t)await u(i,e)}// Deleting all filters on a placeable in parameter
async function u(e,t=null){if(null!=e){if(null==t)await e._TMFXunsetFlag(),await e._TMFXunsetAnimeFlag();else if("string"==typeof t){let i=e.document.getFlag("tokenmagic","filters");if(null==i||!(i instanceof Array)||i.length<1)return;// nothing to delete...
let a=[];if(i.forEach(e=>{e.tmFilters.tmFilterId!==t&&a.push(duplicate(e))}),a.length>0?await e._TMFXsetFlag(a):await e._TMFXunsetFlag(),null==(i=e.document.getFlag("tokenmagic","animeInfo"))||!(i instanceof Array)||i.length<1)return;// nothing to delete...
a=[],i.forEach(e=>{e.tmFilterId!==t&&a.push(duplicate(e))}),a.length>0?await e._TMFXsetAnimeFlag(a):await e._TMFXunsetAnimeFlag()}}}function d(e){let t=e=>e.includes(game.user.name)||e.includes(game.user.id);return!(e.users?.include?.length&&!t(e.users.include)||e.users?.exclude?.length&&t(e.users?.exclude))}function p(e,t,i){if(null==e||null==t||!(e instanceof PlaceableObject))return null;if(null==i||!(i instanceof Array)||i.length<1)return!1;let a=i.find(e=>e.tmFilters.tmFilterId===t);return void 0!==a}function f(e,t,i=!1){if(null==t||null==e)return;// Assign all filters to the placeable
let a=e.document.getFlag("tokenmagic","animeInfo");for(let r of t)i&&function(e,t){if(e.hasOwnProperty("animated")&&t&&!(t.length<=0))for(let i of Object.keys(e.animated))for(let a of t.values())a.tmFilterId===e.filterId&&a.tmFilterInternalId===e.filterInternalId&&a.tmFilterEffect===i&&(e.animated[i].active=!1,e[i]=a.tmFilterEffectValue,"halfCosOscillation"===e.animated[i].animType&&e.animated[i].val1!==a.tmFilterEffectValue&&(e.animated[i].val2=e.animated[i].val1,e.animated[i].val1=a.tmFilterEffectValue))}(r.tmFilters.tmParams,a),h(e,r)}function h(e,t){if(null==t||!d(t.tmFilters.tmParams))return;let i=duplicate(t);i.tmFilters.tmParams.placeableId=e.id,i.tmFilters.tmParams.placeableType=e._TMFXgetPlaceableType(),function(e,t){e._TMFXsetRawFilters(t)}(e,new eZ[i.tmFilters.tmFilterType](i.tmFilters.tmParams))}function g(e,t=!1){let i=e._TMFXgetPlaceableType();if(i===eK.TEMPLATE){let t=e.document.getFlag("tokenmagic","templateData");null!=t&&(e.document.tmfxTextureAlpha=e._TMFXgetSprite().alpha=t.opacity,e.document.tmfxTint=t.tint)}let a=e.document.getFlag("tokenmagic","filters");null!=a&&(i===eK.TEMPLATE&&(e.document.tmfxPreset=a[0].tmFilters.tmFilterId),f(e,a,t)),e.loadingRequest=!1}async function v(e,t={}){if(t.hasOwnProperty("overwrite")||(t.overwrite=game.settings.get("tokenmagic","importOverwrite")),///////////////////////////////////////////////
// Checking the imported object format
ti("import -> checking import file format..."),!(e instanceof Array)||e.length<1)return tr("import -> file format check KO !"),tr(eJ("TMFX.preset.import.format.failure")),!1;ti("import -> file format check OK !");// check object format end
/////////////////////////////////////////////////
let i=!0;for(let t of(///////////////////////////////////////////////
// Checking the imported content
ti("import -> checking import file content..."),e))if(t.hasOwnProperty("name")&&"string"==typeof t.name&&t.hasOwnProperty("params")&&t.params instanceof Array){for(let e of t.params)if(!(e.hasOwnProperty("filterType")&&eZ.hasOwnProperty(e.filterType))){i=!1;break}if(!i)break}else{i=!1;break}if(!i)return tr("import -> file content check KO !"),tr(eJ("TMFX.preset.import.format.failure")),!1;// check content end
/////////////////////////////////////////////////
// The preset libray must be replaced ?
if(ti("import -> file content check OK !"),t.hasOwnProperty("replaceLibrary")&&t.replaceLibrary)return await game.settings.set("tokenmagic","presets",e),ti("import -> preset library replaced"),ti(eJ("TMFX.preset.import.success")),!0;let a=game.settings.get("tokenmagic","presets"),r=0;for(let i of e){let e=a.find(e=>e.name===i.name);if(null==e)ti("import -> add: "+i.name),a.push(i),r++;else if(t.hasOwnProperty("overwrite")&&t.overwrite){let t=a.indexOf(e);t>-1&&(ti("import -> overwrite: "+i.name),a[t]=i,r++)}else ta("import -> ignored: "+i.name+" -> already exists")}return await game.settings.set("tokenmagic","presets",a),ti("import -> "+r+" preset(s) added to the library"),ti(eJ("TMFX.preset.import.success")),!0}async function b(e,t={}){return(///////////////////////////////////////////////
// Checking the imported object format
ti("import -> checking import file format..."),e instanceof Object)?(ti("import -> file format check OK !"),// check object format end
/////////////////////////////////////////////////
await game.settings.set("tokenmagic","autoTemplateSettings",e),ti("import -> automatic template settings replaced"),ti(eJ("TMFX.preset.import.success")),!0):(tr("import -> file format check KO !"),tr(eJ("TMFX.preset.import.format.failure")),!1)}async function y(e,t={}){try{let i=await fetch(e),a=await i.json();return await v(a,t)}catch(e){return tr(e.message),tr(eJ("TMFX.preset.import.failure")),!1}}async function x(e,t={}){try{let i=await fetch(e),a=await i.json();return await b(a,t)}catch(e){return tr(e.message),tr(eJ("TMFX.preset.import.failure")),!1}}function T(e){let t=null,i=null,a=e instanceof Object,{name:r,library:s,...o}=a?e:{};if(a?(e.hasOwnProperty("name")&&(t=e.name),e.hasOwnProperty("library")&&(i=e.library)):t=e,(null==i||"string"!=typeof i)&&(i=eI.MAIN),"string"!=typeof t)return;let l=game.settings.get("tokenmagic","presets");if(null==l||"object"!=typeof l)return;let n=l.find(e=>e.name===t&&e.library===i);if(null!=n&&n.hasOwnProperty("params")&&n.params instanceof Array){for(let[e,t]of Object.entries(o))//log(`getPreset ${filterProp}: ${filterPropVal}`);
for(let i of n.params)i.hasOwnProperty(e)&&(i[e]=t);return deepClone(n.params)}}return{addFilters:o,addFiltersOnSelected:i,addFiltersOnTargeted:s,addUpdateFilters:l,addUpdateFiltersOnSelected:a,addUpdateFiltersOnTargeted:r,deleteFilters:u,deleteFiltersOnSelected:m,deleteFiltersOnTargeted:c,updateFilters:async function(t){if(null==params||!params.hasOwnProperty("filterId"))return;let i=new Set,a=e.getAnimeMap();if(!(a.size<=0)&&(a.forEach((e,a)=>{t.some(t=>t.filterId===e.puppet.filterId)&&i.add(e.puppet.placeableId)}),!(i.size<=0)))for(let e of i){// we must browse the collection of placeables whatever their types
// we have just a filterId.
let i=tn(e,eK.TOKEN);null==i&&(i=tn(e,eK.TEMPLATE)),null==i&&(i=tn(e,eK.TILE)),null==i&&(i=tn(e,eK.DRAWING)),null!=i&&i instanceof PlaceableObject&&await n(i,t)}},updateFiltersOnSelected:async function(e){let t=to();if(null!=t&&!(t.length<1)&&("string"==typeof e&&(e=T(e)),e instanceof Array&&!(e.length<1)))for(let i of t)await n(i,e)},updateFiltersOnTargeted:async function(e){let t=tl();if(null!=t&&!(t.length<1)&&("string"==typeof e&&(e=T(e)),e instanceof Array&&!(e.length<1)))for(let i of t)await n(i,e)},updateFiltersByPlaceable:n,hasFilterType:function(e,t){if(null==e||null==t||!(e instanceof PlaceableObject))return null;let i=e.document.getFlag("tokenmagic","filters");if(null==i||!(i instanceof Array)||i.length<1)return!1;let a=i.find(e=>e.tmFilters.tmFilterType===t);return void 0!==a},hasFilterId:function(e,t){if(null==e||!(e instanceof PlaceableObject))return null;let i=e.document.getFlag("tokenmagic","filters");return p(e,t,i)},importTemplateSettings:async function(){new FilePicker({type:"json",current:"modules/tokenmagic/import",callback:x}).browse()},importTemplateSettingsFromPath:x,exportTemplateSettings:function(e="tmfx-template-settings"){let t=game.settings.get("tokenmagic","autoTemplateSettings");if(null==t||"object"!=typeof t)return!1;eQ(t,e)},exportPresetLibrary:function(e="tmfx-presets"){let t=game.settings.get("tokenmagic","presets");if(null==t||"object"!=typeof t)return!1;eQ(t,e)},importPresetLibrary:async function(){new FilePicker({type:"json",current:"modules/tokenmagic/import",callback:y}).browse()},importPresetLibraryFromURL:async function(e,t={}){try{$.getJSON(e,async function(e){return await v(e,t)})}catch(e){return tr(e.message),tr(eJ("TMFX.preset.import.failure")),!1}},importPresetLibraryFromPath:y,resetPresetLibrary:async function(){if(game.user.isGM&&confirm(eJ("TMFX.preset.reset.message")))try{await game.settings.set("tokenmagic","presets",eS),ui.notifications.info(eJ("TMFX.preset.reset.success"))}catch(e){tr(e.message)}},getPresets:function(e=eI.MAIN){let t=game.settings.get("tokenmagic","presets");return null==t||"object"!=typeof t?[]:t.filter(t=>t.library===e)},getPreset:T,addPreset:async function(e,t,i=!1){if(!game.user.isGM)return i||ui.notifications.warn(eJ("TMFX.preset.add.permission.failure")),!1;let a=null,r=null,s=null;if(e instanceof Object?(e.hasOwnProperty("name")&&(a=e.name),e.hasOwnProperty("library")&&(r=e.library),e.hasOwnProperty("defaultTexture")&&(s=ts(e.defaultTexture))):a=e,(null==r||"string"!=typeof r)&&(r=eI.MAIN),"string"!=typeof s&&(s=null),"string"!=typeof a&&!(t instanceof Array))return i||ui.notifications.error(eJ("TMFX.preset.add.params.failure")),!1;for(let e of t)e.filterId=a;let o=game.settings.get("tokenmagic","presets"),l={};l.name=a,l.library=r,l.params=t,null!=s&&(l.defaultTexture=s);let n=!0;if(null==o)o=[l];else{let e=o.find(e=>e.name===a&&e.library===r);null==e?o.push(l):(i||ui.notifications.warn(eJ("TMFX.preset.add.duplicate.failure")),n=!1)}if(n)try{await game.settings.set("tokenmagic","presets",o),i||ui.notifications.info(eJ("TMFX.preset.add.success"))}catch(e){i||ui.notifications.error(e.message),console.error(e),n=!1}return n},deletePreset:async function(e,t=!1){if(!game.user.isGM)return t||ui.notifications.warn(eJ("TMFX.preset.delete.permission.failure")),!1;let i=null,a=null;if(e instanceof Object?(e.hasOwnProperty("name")&&(i=e.name),e.hasOwnProperty("library")&&(a=e.library)):i=e,(null==a||"string"!=typeof a)&&(a=eI.MAIN),"string"!=typeof i)return t||ui.notifications.error(eJ("TMFX.preset.delete.params.failure")),!1;let r=game.settings.get("tokenmagic","presets");if(null==r)return t||ui.notifications.warn(eJ("TMFX.preset.delete.empty.failure")),!1;let s=!0,o=r.find(e=>e.name===i&&e.library===a);if(null==o)t||ui.notifications.warn(eJ("TMFX.preset.delete.notfound.failure")),s=!1;else{let e=r.indexOf(o);if(e>-1){r.splice(e,1);try{await game.settings.set("tokenmagic","presets",r),t||ui.notifications.info(eJ("TMFX.preset.delete.success"))}catch(e){t||ui.notifications.error(e.message),console.error(e),s=!1}}}return s},getControlledPlaceables:to,getTargetedTokens:tl,getPlaceableById:tn,_assignFilters:f,_loadFilters:function(e,t=!0){null!=e&&e.slice().reverse().forEach(e=>{g(e,t)})},_clearImgFiltersByPlaceable:function(e,t=null){if(null==e)return;let i=null!=t&&"string"==typeof t,a=e._TMFXgetSprite();null!=a&&(!function(e){if(e instanceof Array)for(let a of e.filter(e=>i?e.hasOwnProperty("filterId")&&e.filterId===t:e.hasOwnProperty("filterId")))a.enabled=!1,a.destroy()}(a.filters),a.filters=function(e){if(e instanceof Array){let a=e.filter(e=>i?!(e.hasOwnProperty("filterId")&&e.filterId===t):!e.hasOwnProperty("filterId"));return 0===a.length?null:a}return e}(a.filters))},_getAnimeMap:e.getAnimeMap,_updateFilters:function(t,i,a){if(!(i.hasOwnProperty("flags")&&i.flags.hasOwnProperty("tokenmagic")&&(i.flags.tokenmagic.hasOwnProperty("filters")||i.flags.tokenmagic.hasOwnProperty("-=filters")))||null==t||!t.hasOwnProperty("_id"))return;let r=tn(t._id,a);if(null==r)return;// Shortcut when all filters are deleted
if(i.flags.tokenmagic.hasOwnProperty("-=filters")){e.removeAnimation(t._id),this._clearImgFiltersByPlaceable(r);return}let s=r.document.getFlag("tokenmagic","filters");if(null!=s){// CROSS-RESEARCH between the anime map and tokenmagic flags to add, delete or update filters on this placeable
// we begin by detecting deleted filters
for(let i of e.getAnimeMap().values())if(i.puppet.placeableId===r.id){// is the animation present in the tokenmagic flags for this placeable ?
// and is it applicable to the current user?
let a=!1;s.forEach(e=>{i.puppet.filterId===e.tmFilters.tmFilterId&&i.puppet.filterInternalId===e.tmFilters.tmFilterInternalId&&i.puppet.placeableId===e.tmFilters.tmParams.placeableId&&d(e.tmFilters.tmParams)&&(a=!0)}),a||(e.removeAnimationByFilterId(t._id,i.puppet.filterId),this._clearImgFiltersByPlaceable(r,i.puppet.filterId))}// we test each tokenmagic filter flag in the placeable
s.forEach(t=>{if(t.tmFilters.hasOwnProperty("tmParams")){// we get the puppets in anime corresponding to this placeable
let i=e.getPuppetsByParams(t.tmFilters.tmParams);if(i.length>0)for(let e of i)// we update if needed
!function e(t,i){function a(e){return null!=e&&"object"==typeof e}let r=Object.keys(t);for(let s of r){let r=t[s],o=i[s],l=a(r)&&a(o);if(l&&!e(r,o)||(l||"loops"!==s||null!==r||(r=1/0),!l&&r!==o))return!1}return!0}(t.tmFilters.tmParams,e)&&(!e.hasOwnProperty("updateId")||e.hasOwnProperty("updateId")&&e.updateId!==t.tmFilters.tmParams.updateId)&&(e.setTMParams(duplicate(t.tmFilters.tmParams)),e.normalizeTMParams());else h(r,t)}})}},_updateTemplateData:function(e,t,i){if(!t.hasOwnProperty("flags")||!t.flags.hasOwnProperty("tokenmagic")||null==e||!e.hasOwnProperty("_id"))return;let a=tn(e._id,i);if(null==a)return;let r=a.document.getFlag("tokenmagic","templateData");null!=r&&(a._TMFXgetSprite().alpha=r.opacity)},_singleLoadFilters:g,_cachedContainer:t,_checkFilterId:p,_getPresetTemplateDefaultTexture:function(e,t=eI.TEMPLATE){let i=game.settings.get("tokenmagic","presets"),a=i.find(i=>i.name===e&&i.library===t);return null!=a&&a.hasOwnProperty("defaultTexture")?ts(a.defaultTexture):null}}}let td=tu();async function tp(){// Caching filters to prevent freezing on first-time loading (shader compilation time)
// https://www.html5gamedevs.com/topic/43652-shader-compile-performance/
let e={enabled:!0,dummy:!0};td._cachedContainer.filters=[];let t=Object.keys(eZ);for(let i of t)e.filterType=i,ti(`Caching ${i}`),td._cachedContainer.filters.push(new eZ[i](e));ti("Compiling shaders...");let i=new PIXI.RenderTexture.create({width:4,height:4});// A call to render triggers the compilation of all the shaders bound to the filters.
canvas.app.renderer.render(td._cachedContainer,{renderTexture:i}),ti("Shaders compiled for the GPU and ready!")}async function tf(e,t=0){let i;e.loadingRequest=!0,setTimeout(()=>{setTimeout(()=>{clearTimeout(i)},2e3),function e(t){i=setTimeout(()=>{if(null==t)return;let i=t._TMFXcheckSprite();if(null==i){t.loadingRequest=!1;return}i?td._singleLoadFilters(t):e(t)},35)}(e)},t)}function th(e,t,i){if("circle"===i||"rect"===i)return{x:.5,y:.5};// Compute emanation anchor point from the orthonormal bounding rect containing the polygon.
// Not complete (to rework later), but ok with cardinal and half-cardinal directions
let a=e*Math.PI/180,r=t*Math.PI/180,s=Math.cos(a-r/2),o=-Math.sin(a-r/2),l=Math.cos(a+r/2),n=-Math.sin(a+r/2),c=0,m=1;return s<0&&l<0?c=1:(s<0||l<0)&&(c=(Math.sin(-a-Math.PI/2)+1)/2),o<0&&n<0?m=0:(o<0||n<0)&&(m=(Math.cos(-a-Math.PI/2)+1)/2),{x:c,y:m}}function tg(e,i){e8()||(i[0].querySelector(".file-picker").dataset.type="imagevideo");let a=e.object;isNewerVersion(game.version,"0.8")&&(a=a.object);let r=a.template.alpha,s="",o=t,l=a.document.getFlag("tokenmagic","templateData");null!=l&&l instanceof Object&&(r=a.document.tmfxTextureAlpha=l.opacity,s=a.document.tmfxTint=l.tint?PIXI.utils.hex2string(l.tint):"",void 0!==l.preset&&(o=l.preset));let n=a.document.getFlag("tokenmagic","filters"),c=td.getPresets(eI.TEMPLATE);n&&n instanceof Array&&n.length>=1&&(o=n[0].tmFilters.tmFilterId);// forming our injected html
let m="",u="";m+=`<option value="${t}"></option>`,c.sort(function(e,t){return e.name<t.name?-1:e.name>t.name?1:0}).forEach(e=>{u=e.name===o?" selected":"",m+=`<option value="${e.name}"${u}>${e.name}</option>`});let d=`
    <div class="form-group">
        <label>${eJ("TMFX.template.opacity")}</label>
        <div class="form-fields">
            <input type="range" name="flags.tokenmagic.templateData.opacity" value="${r}" min="0.0" max="1.0" step="0.05" data-dtype="Number"/>
            <span class="range-value">${r}</span>
        </div>
    </div>

    <div class="form-group">
        <label>${eJ("TMFX.template.fx")}</label>
        <select class="tmfx" name="flags.tokenmagic.templateData.preset" data-dtype="String">
        ${m}
        </select>
    </div>

    <div class="form-group">
        <label>${eJ("TMFX.template.tint")}</label>
        <div class="form-fields">
            <input class="color" type="text" name="flags.tokenmagic.templateData.tint" value="${s}"/>
            <input type="color" value="${s}" data-edit="flags.tokenmagic.templateData.tint"/>
        </div>
    </div>
    `,p=i.find(".form-group");p.last().after(d),$(i).css({"min-height":"525px"})}/* -------------------------------------------- *//*  Setup Management                            *//* -------------------------------------------- */Hooks.on("ready",()=>{ti("Hook -> ready"),e_(),function(){// Activate the listener only for the One
let e=game.users.find(e=>e.isGM&&e.active);e&&game.user!==e||// Listener the listening
game.socket.on(eH,async e=>{if(null!=e&&e.hasOwnProperty("tmAction"))switch(e.tmAction){case e0.SET_FLAG:await t("filters");break;case e0.SET_ANIME_FLAG:await t("animeInfo")}async function t(t){// getting the scene coming from the socket
let i,a=game.scenes.get(e.tmViewedScene);null!=a&&((i=null==e.tmFlag?{[`flags.tokenmagic.-=${t}`]:null}:{[`flags.tokenmagic.${t}`]:e.tmFlag})._id=e.tmPlaceableId,// updating the placeable in the scene
await a.updateEmbeddedDocuments(e.tmPlaceableType,[i]))}})}(),window.TokenMagic=td,!game.modules.get("lib-wrapper")?.active&&game.user.isGM&&ui.notifications.warn("The 'Token Magic FX' module recommends to install and activate the 'libWrapper' module."),Hooks.on("renderMeasuredTemplateConfig",tg)}),/* -------------------------------------------- *//*  Canvas Management                           *//* -------------------------------------------- */Hooks.once("canvasInit",e=>{e4()||(ti("Init -> canvasInit -> caching shaders"),tp())}),/* -------------------------------------------- */Hooks.on("canvasInit",t=>{ti("Hook -> canvasInit"),e9(),e.deactivateAnimation(),e.resetAnimation()}),/* -------------------------------------------- */Hooks.on("canvasReady",t=>{if(ti("Hook -> canvasReady"),window.hasOwnProperty("TokenMagic")||(window.TokenMagic=td),null==t)return;let i=t.tokens.placeables;td._loadFilters(i);let a=t.tiles.placeables;td._loadFilters(a);let r=t.drawings.placeables;td._loadFilters(r);let s=t.templates.placeables;td._loadFilters(s),e.activateAnimation()}),/* -------------------------------------------- *//*  Scenes Management                           *//* -------------------------------------------- */Hooks.on("deleteScene",t=>{t.id===game.user.viewedScene&&(e.deactivateAnimation(),e.resetAnimation())}),/* -------------------------------------------- *//*  Settings Management                         *//* -------------------------------------------- */Hooks.on("closeSettingsConfig",()=>{e9()}),/* -------------------------------------------- *//*  Tokens Management                           *//* -------------------------------------------- */Hooks.on("createToken",e=>{e.parent.id===game.user.viewedScene&&e.flags?.tokenmagic?.filters&&tf(tn(e._id,eK.TOKEN),250)}),/* -------------------------------------------- */Hooks.on("deleteToken",(t,i)=>{null!=i&&i._id&&e.removeAnimation(i._id)}),/* -------------------------------------------- */Hooks.on("updateToken",(t,i)=>{if(t.parent.id===game.user.viewedScene){if(["img","tint","height","width","name"].some(e=>e in i)){let i=tn(t._id,eK.TOKEN);e.removeAnimation(t._id),td._clearImgFiltersByPlaceable(i),tf(i,250)}else td._updateFilters(t,i,eK.TOKEN)}}),/* -------------------------------------------- *//*  Tiles Management                            *//* -------------------------------------------- */Hooks.on("createTile",e=>{if(e.parent.id===game.user.viewedScene&&e.flags?.tokenmagic?.filters){let t=tn(e._id,eK.TILE);tf(t,250)}}),/* -------------------------------------------- */Hooks.on("deleteTile",(t,i)=>{null!=i&&i._id&&e.removeAnimation(i._id)}),/* -------------------------------------------- */Hooks.on("updateTile",(t,i)=>{if(t.parent.id===game.user.viewedScene){if(i.texture?.src||i.overhead){let i=tn(t._id,eK.TILE);e.removeAnimation(t._id),td._clearImgFiltersByPlaceable(i),tf(i,250)}else td._updateFilters(t,i,eK.TILE)}}),/* -------------------------------------------- *//*  Drawings Management                         *//* -------------------------------------------- */Hooks.on("createDrawing",e=>{e.parent.id===game.user.viewedScene&&e.flags?.tokenmagic?.filters&&tf(tn(e._id,eK.DRAWING),250)}),/* -------------------------------------------- */Hooks.on("deleteDrawing",(t,i)=>{null!=i&&i._id&&e.removeAnimation(i._id)}),/* -------------------------------------------- */Hooks.on("updateDrawing",(t,i)=>{if(t.parent.id===game.user.viewedScene){if(!i.flags?.tokenmagic||i.x||i.y){let i=tn(t._id,eK.DRAWING);e.removeAnimation(t._id),td._clearImgFiltersByPlaceable(i),tf(i,250)}else td._updateFilters(t,i,eK.DRAWING)}}),/* -------------------------------------------- *//*  Measured Templates Management               *//* -------------------------------------------- */Hooks.on("createMeasuredTemplate",e=>{let t=e.parent;null!=t&&t.id===game.user.viewedScene&&e.flags?.tokenmagic?.filters&&tf(tn(e._id,eK.TEMPLATE),250)}),/* -------------------------------------------- */Hooks.on("deleteMeasuredTemplate",(t,i)=>{null!=i&&i._id&&e.removeAnimation(i._id)}),/* -------------------------------------------- */Hooks.on("updateMeasuredTemplate",(t,i)=>{if(t.parent.id!==game.user.viewedScene)return;let a=tn(t._id,eK.TEMPLATE);a&&(i.texture?(e.removeAnimation(t._id),td._clearImgFiltersByPlaceable(a),tf(a,250)):a.loadingRequest||(td._updateFilters(t,i,eK.TEMPLATE),td._updateTemplateData(t,i,eK.TEMPLATE)))}),/* -------------------------------------------- */Hooks.on("preUpdateMeasuredTemplate",async(e,i)=>{let a=canvas.templates.get(e._id),r=i.flags?.tokenmagic?.templateData?.tint!==void 0?i.flags.tokenmagic.templateData.tint:e.flags?.tokenmagic?.tint!==void 0?e.flags.tokenmagic.tint:"",s=i.flags?.tokenmagic?.templateData?.preset!==void 0,o=i.flags?.tokenmagic?.templateData?.tint!==void 0,l=i.hasOwnProperty("direction"),n=i.hasOwnProperty("angle"),c=i.hasOwnProperty("t");if(o&&(i.flags.tokenmagic.templateData.tint=""!==r?Color.from(r).valueOf():null),s||o||l||c||n){let o=i.flags?.tokenmagic?.templateData?.preset!==void 0?i.flags.tokenmagic.templateData.preset:e.flags?.tokenmagic?.templateData?.preset!==void 0?e.flags.tokenmagic.templateData.preset:void 0!==e.tmfxPreset?e.tmfxPreset:t;if(o!==t){let t=th(i.direction?i.direction:e.direction?e.direction:0,i.angle?i.angle:e.angle?e.angle:0,i.t?i.t:e.t?e.t:"ITSBAD"),l={name:o,library:eI.TEMPLATE,anchorX:t.x,anchorY:t.y};r&&""!==r&&(l.color=Color.from(r).valueOf());let n=td.getPreset(l);null!=n&&(s?await a.TMFXaddFilters(n,!0):await a.TMFXaddUpdateFilters(n))}else await a.TMFXdeleteFilters()}}),/* -------------------------------------------- */Hooks.on("preCreateMeasuredTemplate",e=>{// Do nothing if we're on a 3D Canvas scene
if(game.Levels3DPreview?._active)return;// Apply auto-preset if needed
let i=eU.getSystemTemplates();i?.enabled&&i.preCreateMeasuredTemplate?.(e);let a=e.flags,r=!1,s=!1,o=!1,l=!1;if(a&&e.flags.tokenmagic?.options){let t=e.flags.tokenmagic.options;t.tmfxPreset&&(e.tmfxPreset=t.tmfxPreset,r=!0),t.tmfxTint&&(e.tmfxTint=t.tmfxTint,s=!0),t.tmfxTextureAlpha&&(e.tmfxTextureAlpha=t.tmfxTextureAlpha,o=!0),t.tmfxTexture&&(e.texture=t.tmfxTexture,e.updateSource({texture:t.tmfxTexture}))}else l=!0;let n=e.texture&&""!==e.texture,c=[];if(a&&l){// the measured template comes with tokenmagic flags ? It is a copy ! We do nothing.
if(e.flags.tokenmagic)return;e.flags=mergeObject(e.flags,{tokenmagic:{filters:null,templateData:null,options:null}},!0,!0)}s&&"number"!=typeof e.tmfxTint&&(e.tmfxTint=Color.from(e.tmfxTint).valueOf());let m=null;// FX to add ?
if(r){// Compute shader anchor point
let t=th(e.direction,e.angle,e.t),i={name:e.tmfxPreset,library:eI.TEMPLATE,anchorX:t.x,anchorY:t.y};// Adding tint if needed
s&&(i.color=e.tmfxTint);// Retrieving the preset
let a=td.getPreset(i);if(null!=a&&a instanceof Array){let t=td._getPresetTemplateDefaultTexture(i.name);null==t||n||e.updateSource({texture:t});let r=!0;// Constructing the filter flag parameters
for(let e of a){if(!e.filterType||!eZ.hasOwnProperty(e.filterType)||!e.filterId){// one invalid ? all rejected.
r=!1;break}e.enabled&&"boolean"==typeof e.enabled||(e.enabled=!0),e.placeableId=null,e.filterInternalId=randomID(),e.filterOwner=game.data.userId,e.placeableType=eK.TEMPLATE,c.push({tmFilters:{tmFilterId:e.filterId,tmFilterInternalId:e.filterInternalId,tmFilterType:e.filterType,tmFilterOwner:e.filterOwner,tmParams:e}})}r&&(m=c)}}else e.tmfxPreset=t;o||(e.tmfxTextureAlpha=1),s||(e.tmfxTint=null);let u={templateData:{opacity:e.tmfxTextureAlpha,tint:e.tmfxTint},filters:m,options:null};e.updateSource({flags:{tokenmagic:u}})});export{eZ as FilterType,eK as PlaceableType,e0 as SocketAction,e1 as broadcast,e2 as isActiveModule,e3 as getMinPadding,e5 as isAdditivePaddingConfig,e4 as isFilterCachingDisabled,e8 as isVideoDisabled,e6 as isTheOne,e7 as mustBroadCast,e9 as autosetPaddingMode,te as isZOrderConfig,tt as isAnimationDisabled,ti as log,ta as warn,tr as error,ts as fixPath,to as getControlledPlaceables,tl as getTargetedTokens,tn as getPlaceableById,tm as objectAssign,tu as TokenMagic,td as Magic};//# sourceMappingURL=bundle.js.map

//# sourceMappingURL=bundle.js.map
