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


