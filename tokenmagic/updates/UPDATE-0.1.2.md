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