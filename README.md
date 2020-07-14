# Token Magic FX - Update v0.1.3-alpha

## FX

*Added :*
- Force Field/Aura/Shield Filters
    - Ultra customizable (intensity, blend modes, lights, color, grid padding, etc.)
    - 12 filter types + 1 simple aura.
    - Usables by both Scifi, fantasy and modern universes.
    - The simple aura can be used to "bind" other filters
- Mirror image Filter
    - A simple 4 pass mirroring, with moving images.

The new filters have been added to the TokenMagic macro compendium.

*Fixed issues :*
- The padding property value is now multiplied by the zoom factor.
- Some internal improvements and refactoring.

# Token Magic FX - Update v0.1.2-alpha

## FX

*Added :*
- Smoke Filter
    - A high quality "fog/smoke/fume" filter who support blend modes.
- Flood Filter
    - Ideal to simulate reflective surfaces on small or large areas.
    - A lot of customizable properties (see compendium)

The new filters have been added to the TokenMagic macro compendium

*Fixed issues :*
- The blend modes performed their calculations using all channels, including the alpha channel, which was not correct. Now they only use RGB channels. Impacted filters are Fumes, Fire and Electricity in some special properties configuration. Check your effects.
- Some effects were distorted if part of the image was in an invisible area of the screen (especially the edges).

## Filters handling

- All `delete` API functions now support an optional parameter : `filterId`. They will restrict deletion only on filters which match the filterId passed in parameter.
```javascript
// Example
TokenMagic.deleteFiltersOnTargeted("poisonSmoke_1");
TokenMagic.deleteFiltersOnSelected("mySuperSpookyGlow");
// Etc...
```

- Added new properties for filters creation and update.
	- `autoDisable` : When this property is set to `true` the filter is automatically disabled when each animation become inactive (number of loops reached).
	- `autoDestroy` : The same as autoDisable, but the filter is destroyed.
	- Note : if you set `loops` with `Infinity` (default value if the property is not present), you will never trigger the autoDestroy or autoDisable. But you can prepare your filter with an auto keyword and then, later, update the `loops` properties with finite values to start the countdown.
	
```javascript
// autoDestroy example
let params =
[{
    filterType: "glow",
    filterId: "mySuperSpookyGlow",
    autoDestroy: true,
    outerStrength: 4,
    padding: 10,
    animated:
    {
        color: 
        {
            active: true, 
            loopDuration: 3000,
            loops: 5,
            animType: "colorOscillation", 
            val1:0x003000,
            val2:0x00FF00
        }
    }
}];
TokenMagic.addFiltersOnSelected(params);
```
## Compatibility

Fine with Foundry VTT 0.6.5

# Token Magic FX - Update v0.1.1-alpha

## FX

*Added :*
- Fumes Filter
- Fire Filter
- Electric Filter
- Waves Filter

*Improvements and modifications :*
- Fog Filter : 
Better performances and better blending with alpha channel. Corrected an issue with the intensity property : the value range from 0 (no fog), to 1 (opaque fog). You may need to update your macros.
- Cosmic Ray Filter : 
Better performances and better blending with alpha channel. Added anchor properties (anchorX, anchorY)
- Distortion Filter :
The path to the assets has changed. You may need to update your macros.

The new filters have been added to the TokenMagic macro compendium. The distortion, cosmic ray and fog macros have been updated.


## Filters handling

Added new functions for a better handling of filters :

Adding filters to targeted tokens
```javascript
(async) TokenMagic.addFiltersOnTargeted(<array of filters params>)
```
Deleting all filters of targeted tokens
```javascript
(async) TokenMagic.deleteFiltersOnTargeted()
```
Updating all matching filters with new values
```javascript
(async) TokenMagic.updateFilters(<array of update params>)
```
The update params are exactly on the same model when you use them to create filters, but you put only the properties you want to change. However, you need to put the`filterId`. All filters matching the filterId will be updated. You can restrain the updates to targets, selections, or even by placeable :
```javascript
(async) TokenMagic.updateFiltersOnSelected(<array of update params>)
(async) TokenMagic.updateFiltersOnTargeted(<array of update params>)
(async) TokenMagic.updateFilterByPlaceable(<params>, <placeable>)
```
Below an example with a glow filter :
```javascript
let params =
[{
    filterType: "glow",
    filterId: "mySuperSpookyGlow",
    distance: 10,
    outerStrength: 8,
    innerStrength: 0,
    color: 0x003000,
    quality: 0.5,
    padding: 10,
    animated:
    {
        color: 
        {
           active: true, 
           loopDuration: 3000, 
           animType: "colorOscillation", 
           val1:0x003000, 
           val2:0x00FF00
        }
    }
}];
TokenMagic.addFiltersOnSelected(params);
```
I need to update the `outerStrength` and the animated color properties, `val1` and `val2` of `"mySuperSpookyGlow"` on all targeted tokens :
```javascript
let params =
[{
    filterId: "mySuperSpookyGlow",
    outerStrength: 6,
    animated:
    {
        color: 
        {
           val1:0x300030, 
           val2:0xFF3000
        }
    }
}];
TokenMagic.updateFiltersOnTargeted(params);
```
Easy ! Later, I want to disable `"mySuperSpookyGlow"` on all the selected tokens.
```javascript
// disabling is not destroying. The filter is still here, but dormant. When disabled, a filter no longer consumes CPU or GPU cycles. (you can enable a disabled filter with enabled: true)
// Concerning the animations, you can put active:false to stop it or active:true to resume it. It's better to stop an animation by putting loops:1 (if loops is a possible animation property). In loops, you can put Infinity (loops: Infinity)
let params =
[{
    filterId: "mySuperSpookyGlow",
    enabled: false
}];
TokenMagic.updateFiltersOnSelected(params);
```
## Technical updates
The custom filters are now using a custom vertex shader, to allow better controls on filter local coordinates (vs normalized coordinates) :
- vec2 vFilterCoord  : Now store the pixel local coordinates.
- vec2 vTextureCoord : Only used to retrieve a pixel in a sampler.

#### THANK YOU FOR USING TOKEN MAGIC FX !

**SecretFire**

Discord : SecretFire#4843

# TokenMagic

TokenMagic is a module for Foundry VTT that allows you to add graphic effects to tokens and tiles. These FX can be animated. This alpha version can only be used via macros. A graphical interface will be added later. But do not panic, tokenmagic comes with a compendium of macros for each effect, easily modifiable to suit your needs. I advise you to go there and play with the values.

## FX effects

TokenMagic can apply the following effects:
Bloom, distortion, old film effect, glow, outline, bevel, shadow drop, shadow zap, twist, blur, zoom blur, shockwave, bulge, pinch, inner rays, inner fog and color adjustment (transparency, contrast, brightness, color balance, etc.)
All properties linked to these effects can be animated and many more FX are in preparation ...

## Macro example

```
let params =
    [{
        filterType: "glow",
        filterId: "tokenmagic-example",
        distance: 10,
        outerStrength: 3,
        color: 0x003000,
        padding: 25,
        animated:
        {
            color:
            {
                active: true,
                loopDuration: 3000,
                animType: "colorOscillation",
                val1: 0x003000,
                val2: 0x00FF00
            }
        }
    },
    {
        filterType: "shadow",
        rotation: 35,
        blur: 2,
        quality: 10,
        distance: 20,
        alpha: 0.7,
        padding: 5,
        color: 0x000000,
        animated:
        {
            blur:
            {
                active: true,
                loopDuration: 500,
                animType: "syncCosOscillation",
                val1: 2,
                val2: 4
            }
        }
    }];
TokenMagic.addFiltersOnSelected(params);
```
The `filterType` allows you to specify the type of filter you want to apply: in this case, this is a Glow effect.

Each filter is identified by a `filterId`, you can specify it. Otherwise, a random one will be automatically assigned by the module.

`distance`, `outerStrength` and `color` are attributes specific to the filter (see the macro portfolio in the compendium. Documentation will come soon)

`Padding` is a property applicable to all filters. It allows you to increase the size of the container so that the effects do not spill over an invisible part. Padding is applied on all sides. The padding is additive: if you apply three filters to a placeable and you have a padding of 40 for each, you will have a final padding of 120. This must be taken into account.

You want to apply filters to all selected tokens or tiles in the UI ? Use :
`TokenMagic.addFiltersOnSelected(<array of filters params>)` 

You want to apply the filters to a placeable passed in parameter (token or tile for the moment) ? Use :
`TokenMagic.addFilters(<placeable>, <array of filters params>)`

To remove filters :
`TokenMagic.deleteFiltersOnSelected()`
`TokenMagic.deleteFilters(<placeable>)`

## Animations
The `animated` keyword means that you want to start the animation of a filter property, it contains its own keywords. In the above example, it is the color property that we want to animate with an animation of type `"colorOscillation"`. The cycle duration is 3000 ms and the value limits are `val1` and `val2`.

```
animated :
{
	<property to animate> :
      {
         active: <true|false(default:false)> // the filter is active ?
         loopDuration: <duration of the loop in ms(default:3000)>,
         loops: <number of loops before inactivity(default:Infinity)>,
         animType: <"animation keyword">,
         val1: <value limit 1>, // used for a lot of things (oscillation, random gen, etc.)
         val2: <value limit 2>, // used for a lot of things (oscillation, random gen, etc.)
         wantInteger: <true|false(default:false)>  // used for random generation
         speed: <value> // used with « move » animType
         chaosFactor: <value between 0 and 1(default:0.25)> // used to create chaos
         pauseBetweenDuration: <pause between each loop(default:0)>
         syncShift: <value between 0 and 1(default:0)> // used to alter synchronicity 
      }
	  <,<other properties to animate>…>
}
```

### The animation keywords

**Keywords:** `"cosOscillation"` `"sinOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `pauseBetweenDuration` `loops` `syncShift`
A smooth transition between two values, val1 and val2, with a return to val2 that take loopDuration milliseconds before repetition. Theses oscillations have their own synchronization. cosOscillation begin at val1, while sinOscillation begin at half-range.

**Keywords:** `"syncCosOscillation"` `"syncSinOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `pauseBetweenDuration` `loops` `syncShift`
Same as above, but the transitions are globally synchronized. A syncShift can be applied to alter the global synchronization for this effect (0.25 for half). Since the transitions are synchronized, the value of the property can begin anywhere between val1 and val2.

**Keywords:** `"chaoticOscillation"` `"syncChaoticOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2` `chaosFactor`
**Optional properties:** `pauseBetweenDuration` `loops` `syncShift`
The same as cosOscillation, but with a chaos factor. The oscillation is freaky. chaosFactor go from 0 (no chaos, huh?) to 1 (total chaos, you call that an oscillation?). A syncChaoticOscillation also exists if youd dare to synchronize chaos.

**Keywords:** `"colorOscillation"` `"syncColorOscillation"`
**Mandatory properties:** `active`  `loopDuration` `val1` `val2`
**Optional properties:** `pauseBetweenDuration` `loops` `syncShift`
Same as cosOscillation or syncCosOscillation, but specific to colors. The transition is correctly applied to each component of the RGB value. Instead, you can use a cosOscillation, but the transition is not very nice (for colors).

**Keywords:** `"rotation"` `"syncRotation"`
**Mandatory properties:** `active` `loopDuration`
**Optional properties:** `pauseBetweenDuration` `loops` `syncShift` `clockwise`
You need to rotate something? it's for you. A full turn in loopDuration. You can set a counter-clockwise rotation with `clockwise: false`. You want to synchronize all your rotations? Use syncRotation. You need to rotate 45 ° and return to 0 ° and vice versa? Use a cosOscillation.

**Keywords:** `"randomNumber"`
**Mandatory properties:** `active` `val1`  `val2`
**Optional properties:** `wantInteger`
generate a random number per frame, between val1 and val2. You need Integers? Use `wantInteger: true`

**Keywords:** `"randomNumberPerLoop"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `pauseBetweenDuration` `wantInteger` `loops` 
generate a random number at the end of a complete loop, between val1 and val2. You need Integers? Use `wantInteger: true`

**Keywords:** `"randomColorPerLoop"`
**Mandatory properties:** `active` `loopDuration`
**Optional properties:** `pauseBetweenDuration` `loops` 
generate a random color per complete loop.

**Keywords:** `"move"`
**Mandatory properties:** `active` `speed`
increment a property value by his speed, in pixel / ms.

## For developers
If you want to use TokenMagic in your modules, know that you are welcome. I await your feedback and I will listen to your needs. While waiting for a more mature version, consider putting an option "experimental functionality"...

## Contributions
Contributors are welcome: UI specialists and GLSL fragment shader programmers would be appreciated, and anyone wishing to get involved in this project. Contact me on Github or Discord.

## Important notes
TokenMagic is in alpha version, this means that bugs and other unwanted effects will occur from time to time. You can help me track them by posting issues in Github and taking care to give me all the information I need to reproduce them. Thank you !

## Acknowledgements
**Atropos** for the jewel that is Foundry, and the whole community for its support.

## Donations
For those who wish to make a donation : [paypal](https://www.paypal.me/silentFire "paypal")

My most sincere thanks.


