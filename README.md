[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K24XAWE) 
![v0.5.2-beta download count](https://img.shields.io/github/downloads/Feu-Secret/tokenmagic/latest/tokenmagic.zip)
# Token Magic FX

Token Magic is a module for Foundry VTT that allows you to add graphic effects to tokens, tiles, drawings and templates. These FX can be animated. 

This beta version is partly used via macros, except for automatic templates and measurement templates. A graphical interface will be added later. But do not panic, Token Magic comes with a compendium of macros for each effect, easily modifiable to suit your needs. I advise you to go there and play with the values.

In short :
- Add special effects to tokens, tiles, drawings and templates.
- A predefined macro compendium is available (with many effects).
- Easily add effects to your measurement templates with an enhanced user interface.
- Settings to automatically add effects to templates (according to damage type or spell name) when spells or items are used
  - dd5e only for the moment (pf2e in the pipeline)
- For computer geek, an easy way to play with existing macros and create an infinite number of custom effects!
- For module developpers, a complete API to use Token Magic capabilities.

#### Various tutorials on Youtube
###### In English

- [Foundry VTT Creating Amazing Visuals: Token Magic and Custom Animations](https://www.youtube.com/watch?v=1cmRd6FadY8) by *Mr. Weaver*
- [Foundry VTT Token Magic 90+ Effects](https://www.youtube.com/watch?v=9Ihx5MrHFuY) by *Mr. Weaver*
- [Foundry VTT Makes Battles DYNAMIC - Token Magic FX Module Guide](https://www.youtube.com/watch?v=W0w6gWclQxU) by *Kobold DM*
- [8 D&D Monster Token Animations with Token Magic FX Addon Module for Foundry VTT](https://www.youtube.com/watch?v=EBYc9C-Bj0c&t=96s) by *Copper Dragon Games*
- [Using Animated Maps, Tiles, Tokens, and Spells in Foundry VTT](https://www.youtube.com/watch?v=ooqsVsyfu70&t=235s) by *Encounter Library*
- [Foundry VTT - Token Magic Featuring Disguise Self](https://www.youtube.com/watch?v=zz8uJkqoOYA&t=527s) by *Asgril's Foundry Lab*

###### In Brazilian Portuguese

- [Animações nas Magias de Dungeons and Dragons do Foundry VTT](https://www.youtube.com/watch?v=3S_mLVA_r44) by *Mestre Digital*

###### In French

- [#jdr Foundry VTT Token Magic FX](https://www.youtube.com/watch?v=heBV1vYPQaQ) by *Ceizyl*
- [#jdr #foundryvtt jeu de Rôle : Guide du débutant](https://www.youtube.com/watch?v=B0Gwvp-Ns6c&t=1s) by *Ceizyl*

If you are a streamer and want your video about TMFX to be added to these lists, contact me on Discord or Github.

## Special effects

TokenMagic can apply the following effects:
Bloom, distortion, old film effect, glow, outline, bevel, shadow drop, shadow zap, twist, blur, zoom blur, shockwave, bulge, pinch, inner rays, inner fog, color adjustment (transparency, contrast, brightness, color balance, etc.), and many more!
All properties linked to these effects can be animated.

## Measurement Template improvements

Token Magic is adding four options :
- You can choose a template texture (classic texture or webm video)
- The opacity
- A Token Magic effect (you can create your own by adding presets in the template library)
- And a tint applied to texture and special effect

![Templates Ex](images/templates-ex.png)

## Automatic Templates

You can configure automatic templates in the module option panel. You also have options to disable automatic templates and the display of the grid.

![Template Settings](images/template-settings.png)

In the template settings, you have a tab that display to automatic templates settings by categories, and another for spells and items overrides.

![Template Settings Base](images/template-settings-base.png)

![Template Settings Overrides](images/template-settings-overrides.png)

Automatic template settings are linked to a world. You can import and export the settings with the following code :

To export your template settings in a json file
```javascript
TokenMagic.exportTemplateSettings(optional <exportName>);
```

To import template settings from a json file (open a file picker dialog). ***Warning : your settings are REPLACED ! Before, you may want to save your data with the code above.***
```javascript
(async) TokenMagic.importTemplateSettings();
```

## Macros

On drawings, tiles, and Tokens. You must work with macros. You will find a lot of predefined macros in the compendium.

You can use them directly or create your own by modifying/improving them. Just think to create a copy of the Token Magic FX Compendium.

![Token Magic Compendium](images/Compendium.JPG)

## Token Magic API

Here an example of a Token Magic macro.

```js
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

`distance`, `outerStrength` and `color` are attributes specific to the filter (see the macro portfolio in the compendium)

`Padding` is a property applicable to all filters. It allows you to increase the size of the container so that the effects do not spill over an invisible part. Padding is applied on all sides. In the module option, you can decide to use the default additive padding (three filters with a padding of 40 would make a padding of 120), use a maximum padding (one filter with a padding of 10 and a filter with a padding of 20 give a padding of 20). You can also assign a minimum padding value that will be assigned each time you create an effect.

You want to apply filters to all selected tokens or tiles in the UI ? Use :
`TokenMagic.addFiltersOnSelected(<array of filters params>)` 

You want to apply the filters to a placeable passed in parameter (token, tile, drawing, template) ? Use :
`TokenMagic.addFilters(<placeable>, <array of filters params>)`

To remove filters :
`TokenMagic.deleteFiltersOnSelected()`
`TokenMagic.deleteFilters(<placeable>)`

Adding filters to targeted tokens
```javascript
(async) TokenMagic.addFiltersOnTargeted(<array of filters params>)
```
Deleting all filters of targeted tokens
```javascript
(async) TokenMagic.deleteFiltersOnTargeted()
```
The update params are exactly on the same model when you use them to create filters, but you put only the properties you want to change. However, you need to put the`filterId`. All filters matching the filterId will be updated. You can restrain the updates to targets, selections, or even by placeable :
```javascript
(async) TokenMagic.updateFiltersOnSelected(<array of update params>)
(async) TokenMagic.updateFiltersOnTargeted(<array of update params>)
(async) TokenMagic.updateFiltersByPlaceable(<array of update params>, <placeable>)
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

`delete` functions support an optional parameter : `filterId`. They will restrict deletion only on filters which match the filterId passed in parameter. Other filters will remain untouched.
```javascript
// Example
TokenMagic.deleteFiltersOnTargeted("poisonSmoke_1");
TokenMagic.deleteFiltersOnSelected("mySuperSpookyGlow");
// Etc...
```
To avoid call to deleteFilters, you can specify that you want to replace (therefore delete) possible existing filters when calling the functions below :

```javascript
TokenMagic.addFilters(<placeable>, <paramsArray>, optional <replace> = false);
```
```javascript
TokenMagic.addFiltersOnTargeted(<paramsArray>, optional <replace> = false);
```
```javascript
TokenMagic.addFiltersOnSelected(<paramsArray>, optional <replace> = false);
```
```javascript
// Example:
let params =
    [{
        filterType: "glow",
        filterId: "tokenmagic-example",
        outerStrength: 3,
        color: 0x003000,
        padding: 20
    },
    {
        filterType: "shadow",
        filterId: "tokenmagic-example",
        rotation: 35,
        blur: 2,
        quality: 10,
        distance: 20,
        alpha: 0.7,
        color: 0x000000,
    }];

// All possible existing filters will be deleted on the selected placeables before applying the new filters
// Technical precision -> it is just one call to a setFlag which add and delete the filters
TokenMagic.addFiltersOnSelected(params, true);
```

To verify if a placeable has a filter with the specified `filterType` :
```javascript
TokenMagic.hasFilterType(<placeable>,<filterType>)

// Example
...
if (TokenMagic.hasFilterType(myToken,"glow")) {
    console.log("myToken has a glow filter.");
}
...
```
To verify if a placeable has a filter with the specified `filterId` :
```javascript
TokenMagic.hasFilterId(<placeable>,<filterId>)

// Example
...
if (TokenMagic.hasFilterId(myToken,"mySuperShadow_01")) {
    console.log("myToken has my customized super shadow 1 filter.");
} 
...
```
Here are one in two functions, to add or update filter(s) on a specific placeable, selected tokens, drawings or tiles, or targeted tokens. If a filter applied on an object has a filterType and a filterId identical to those found in the parameters, the values are updated with the new ones. Otherwise a new filter is created.
```javascript
(async) TokenMagic.addUpdateFilters(<placeable>, <array of params>)
(async) TokenMagic.addUpdateFiltersOnSelected(<array of params>)
(async) TokenMagic.addUpdateFiltersOnTargeted(<array of params>)
```

You can automatically destroy or disable filters with the following properties :
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

To start an animation, you need to use the `animated` keyword property. It means that you want to start the animation of a filter property, it contains its own keywords. In the above example, it is the `color` property that we want to animate with an animation of type `"colorOscillation"`. The cycle duration is 3000 ms and the value limits are `val1` and `val2`.

```js
animated :
{
    <property to animate> :
      {
         active: <true|false(default:false)> // filter active/inactive
         loopDuration: <duration of the loop in ms(default:3000)>,
         loops: <number of loops before inactivity(default:Infinity)>,
         animType: <"animation keyword">,
         val1: <value limit 1>, // used for a lot of things (oscillation, random gen, etc.)
         val2: <value limit 2>, // used for a lot of things (oscillation, random gen, etc.)
         wantInteger: <true|false(default:false)>  // used for random generation
         speed: <value> // used with « move » animType
         chaosFactor: <value between 0 and 1(default:0.25)> // used to create chaos
         syncShift: <value between 0 and 1(default:0)> // used to alter synchronicity 
      }
    <,<other properties to animate>…>
}
```

### The animation keywords

**Keywords:** `"cosOscillation"` `"sinOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `loops` `syncShift`
A smooth transition between two values, val1 and val2, with a return to val2 that take loopDuration milliseconds before repetition. Theses oscillations have their own synchronization. cosOscillation begin at val1, while sinOscillation begin at half-range.

**Keywords:** `"syncCosOscillation"` `"syncSinOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `loops` `syncShift`
Same as above, but the transitions are globally synchronized. A syncShift can be applied to alter the global synchronization for this effect (0.25 for half). Since the transitions are synchronized, the value of the property can begin anywhere between val1 and val2.

**Keywords:** `"chaoticOscillation"` `"syncChaoticOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2` `chaosFactor`
**Optional properties:** `loops` `syncShift`
The same as cosOscillation, but with a chaos factor. The oscillation is freaky. chaosFactor go from 0 (no chaos, huh?) to 1 (total chaos, you call that an oscillation?). A syncChaoticOscillation also exists if youd dare to synchronize chaos.

**Keywords:** `"colorOscillation"` `"syncColorOscillation"`
**Mandatory properties:** `active`  `loopDuration` `val1` `val2`
**Optional properties:** `loops` `syncShift`
Same as cosOscillation or syncCosOscillation, but specific to colors. 
The transition is correctly applied to each component of the RGB value. 
Instead, you can use a cosOscillation, but the transition is not very nice (for colors).

**Keywords:** `"halfCosOscillation"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `loops` `syncShift`
A smooth transition between two values, val1 and val2. The `loopDuration` brings to val2. Theses oscillations have their own synchronization.
Useful when you want to control an alternance between val1 and val2 by using `loops`

**Keywords:** `"halfColorOscillation"`
**Mandatory properties:** `active`  `loopDuration` `val1` `val2`
**Optional properties:** `loops` `syncShift`
A smooth transition between two colors, `val1` and `val2`. The `loopDuration` brings to val2. Theses oscillations have their own synchronization.
Useful when you want to control an alternance between val1 and val2 by using `loops`

**Keywords:** `"rotation"` `"syncRotation"`
**Mandatory properties:** `active` `loopDuration`
**Optional properties:** `loops` `syncShift` `clockwise`
You need to rotate something? it's for you. A full turn in loopDuration. You can set a counter-clockwise rotation with `clockwise: false`. You want to synchronize all your rotations? Use syncRotation. You need to rotate 45 ° and return to 0 ° and vice versa? Use a cosOscillation.

**Keywords:** `"randomNumber"`
**Mandatory properties:** `active` `val1`  `val2`
**Optional properties:** `wantInteger`
generate a random number per frame, between val1 and val2. You need Integers? Use `wantInteger: true`

**Keywords:** `"randomNumberPerLoop"`
**Mandatory properties:** `active` `loopDuration` `val1` `val2`
**Optional properties:** `wantInteger` `loops` 
generate a random number at the end of a complete loop, between val1 and val2. You need Integers? Use `wantInteger: true`

**Keywords:** `"randomColorPerLoop"`
**Mandatory properties:** `active` `loopDuration`
**Optional properties:** `loops` 
generate a random color per complete loop.

**Keywords:** `"move"`
**Mandatory properties:** `active` `speed`
increment a property value by his speed, in pixel / ms.

You can control the ordering of the filters with the `zOrder` property.
If you want to work with this new property, you must activate the option in the module option panel. The `zOrder` allows the filters to be applied on a Placeable in a specific order: from the smallest `zOrder` to the highest.

A concrete example: you have applied an aura to a token, then you apply a mirror image, the aura will also be processed by the mirror image, which is probably not the desired effect. 
By assigning a `zOrder` to your effects, you can determine that the mirror image should apply before the aura.

You will find below a table with the filters and their default `zOrder`. The default `zOrder` can be overriden in the parameters of the filters.

| Filter  | default zOrder |
|---|---|
| Splash (splash) | 5 |
| Remove Shadow (zapshadow) | 10 |
| Pixelate (pixel) | 20  |
| Adjustment (adjustment) | 30 |
| Bloom (xbloom)  | 40  |
| Outline (outline) | 50 |
| Old Film (oldfilm) | 60 |
| Glow (glow) | 70 |
| Gleaming Glow (xglow) | 80  |
| Bevel (bevel) | 90  |
| Mirror Images (images)  | 100  |
| Drop Shadow (shadow) | 110 |
| Rays (ray) | 120  |
| XRays (xray) | 130 |
| BulgePinch (bulgepinch) | 140  |
| Fire (fire) | 150  |
| Electric (electric) | 160  |
| Flood (flood) | 170  |
| Liquid (liquid) | 180  |
| Fog (fog) | 190  |
| Smoke (smoke) | 200  |
| Fumes (fumes) | 210  |
| Shockwave (shockwave) | 220  |
| XFog (xfog) | 230  |
| Twist (twist) | 240  |
| Solar Ripples (ripples) | 250 |
| Spiderweb (web) | 260  |
| Globes (globes) | 270  |
| Waves  (wave) | 280  |
| Blur (blur) | 290  |
| Zoom Blur (zoomblur) | 300  |
| Transform (transform) | 1000 |
| Force Field (field) | 2000  |
| Distortion (distortion) | 4000  |

You can store your custom effects in a Token Magic library. TMFX comes with two libraries: A main library with all the presets common to drawings, tokens and tiles, and one specific to measured templates.

To add a preset in your library :
```javascript
(async) TokenMagic.addPreset(<presetName>,<params>,optional <silent>)

// Example
// You don't need to add a filterId when creating a preset. The filterId is created with the preset name.
// In the example below, the filterId will be equal to "FunnyGlow"
// silent to true if you don't want a confirmation message to appear when the preset is created
let params =
           [{
               filterType: "glow",
               color: 0x4090FF
           }];
TokenMagic.addPreset("MyCustomGlow",params);
```
To delete a preset in your main library :
```javascript
(async) TokenMagic.deletePreset(<presetName>,optional <silent>);
```
To get a preset from the main library :
```javascript
TokenMagic.getPreset(<presetName>);
```

To export your library in a json file
```javascript
TokenMagic.exportPresetLibrary(optional <exportName>);
```

To import presets into your library (open a file picker dialog)
```javascript
(async) TokenMagic.importPresetLibrary();
```

To import presets into your library from a local path
```javascript
(async) TokenMagic.importPresetLibraryFromPath(<path>);
```

To import presets into your library from an URL
```javascript
(async) TokenMagic.importPresetLibraryFromURL(<URL>);
```

To reset the preset library with the default presets (confirmation is requested)
```javascript
(async) TokenMagic.resetPresetLibrary();
```

*An option in the module settings allow overwrite of duplicates (by preset name) on import.
By default, duplicates are ignored.*

To retrieve all presets from a library (by default in the main library  : "tmfx-main"). Returns an array.
```javascript
TokenMagic.getPresets(optional <libraryName>)
```

```javascript
// Example to get the main presets
let tmfxMainPresets = TokenMagic.getPresets();
// Equivalent to TokenMagic.getPresets("tmfx-main");
```

```javascript
// Example to get the template presets
let tmfxTemplatePresets = TokenMagic.getPresets("tmfx-template");

```

You can pass an object as a parameter. The object must contain the name and optionnaly, the library and various properties.
If you don't specify a library, getPreset will look for the main library by default.

```javascript
TokenMagic.getPreset(<presetName>|<params object>);
```
```javascript
// Example 1:
// Classic method
// Search in the main library
let myFx = TokenMagic.getPreset("myFX");
```
```javascript
// Example 2:
// You want to get a "Wild Magic" preset in the template library
let pstParams =
{
    name: "Wild Magic",
    library: "tmfx-template"
};
let tmfxWildMagicPst = TokenMagic.getPreset(pstParams);
```
```javascript
// Example 3:
// You can override properties in the presets
// All filters of the preset containing the properties will be changed
// Currently does not work on nested properties, will come in a later version
let pstParams =
{
    name: "Wild Magic",
    library: "tmfx-template",
    color: 0x00FF00
};
let tmfxWildMagicPst = TokenMagic.getPreset(pstParams);
// all colors properties values returned by the preset have been changed to 0x00FF00
```
To add a preset, you can specify library in an object (same as getPreset).
Also, when you create a preset for a template (template library), you can add a default texture (used if no texture is setted for a given template)
the same when deleting a preset

```javascript
TokenMagic.addPreset(<presetName>|<object>, <params>, optional <silent>);
```
```javascript
TokenMagic.deletePreset(<presetName>|<object>, optional <silent>);
```
```javascript
// Example 1:
// Classic method
// Add in the main library
let params =
    [{
        filterType: "glow",
        color: 0x00FF00,
        outerStrength: 5
    }];
TokenMagic.addPreset("My Glow",params);
```

```javascript
// Example 2:
// using the same params, but adding to the template library with a default texture
// in silent mode
let presetDef =
{
    name: "My Glow",
    library: "tmfx-template",
    defaultTexture: "modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png"
};
TokenMagic.addPreset(presetDef, params, true);
```
```javascript
// Example 3:
// You can create your own library (for a module for example)
// I do not enforce anything, but you should add a suffix corresponding to your module (or others)
let presetDef =
{
    name: "Glowing Death",
    library: "au5e-conditions"
};
TokenMagic.addPreset(presetDef, params);
```
```javascript
// Example 4:
// deleting a preset in the template library
TokenMagic.deletePreset({name:"Glowing Death",library:"tmfx-template"});
```

You can use presets with those functions below, by replacing the params with a preset name :
```javascript
TokenMagic.addFilters
TokenMagic.addFiltersOnSelected
TokenMagic.addFiltersOnTargeted
TokenMagic.addUpdateFiltersOnSelected
TokenMagic.addUpdateFiltersOnTargeted
TokenMagic.updateFiltersOnSelected
TokenMagic.updateFiltersOnTargeted
TokenMagic.updateFiltersByPlaceable

// Example
TokenMagic.addFiltersOnTargeted("dead");
```
The Token Magic API allows templates creation.

When creating templates, you can pass parameters to add special fx, opacity and tint.
- tmfxPreset : name of the fx preset to apply on the template (from the template library)
- tmfxTint : a color **value** to apply a tint on the fx
- tmfxTextureAlpha: inner opacity factor (0 to 1)

All these new parameters are optionals.
If you do not pass a texture parameter, TMFX will apply the FX preset default texture (if present).

```javascript
MeasuredTemplate.create({
   t: "cone",
   user: game.user._id,
   x: canvas.stage.pivot.x,
   y: canvas.stage.pivot.y,
   direction: 180,
   angle: 57,
   distance: 15,
   borderColor: "#FF0000",
   fillColor: "#FF3366",
   flags :
   {
     tokenmagic:
     {
        options:
        {
           tmfxPreset: "Wild Magic",
           tmfxTint: 0x00FF90,
           tmfxTextureAlpha: 0.50
        }
     }
   }
 });
```

You have access to TMFX specific prototype functions in class PlaceableObject (Token, Tile, etc.), to facilitate coding :

```javascript
(async) <PlaceableObject>.TMFXaddFilters(<params array>)
(async) <PlaceableObject>.TMFXupdateFilters(<params array>)
(async) <PlaceableObject>.TMFXaddUpdateFilters(<params array>)
(async) <PlaceableObject>.TMFXdeleteFilters(optional <filterId>)
<PlaceableObject>.TMFXhasFilterType(<filterType>)
<PlaceableObject>.TMFXhasFilterId(<filterId>)

// Example 1 
let glowFunc = async function() {

   const tokens = canvas.tokens.placeables;

   for (const token of tokens){
       if (token.TMFXhasFilterId("funnyAlternateGlow")) {
           await token.TMFXdeleteFilters("funnyAlternateGlow");
       } else {
           let params =
           [{
               filterType: "glow",
               filterId: "funnyAlternateGlow",
               color: Math.floor(Math.random() * 16777215),
               animated: null
           }];
           await token.TMFXaddUpdateFilters(params);
       }
   }
};

glowFunc();
```

### For module developers
If you want to use TokenMagic in your modules, know that you are welcome. I await your feedback and I will listen to your needs.

### Contributions
Contributors are welcome: UI specialists and GLSL shader programmers would be appreciated, and anyone wishing to get involved in this project. 
Contact me on Github or Discord, or make a Super Surprise PR!

### Important notes
TokenMagic is in beta version, this means that bugs and other unwanted effects will occur from time to time. 
You can help me to track them by posting issues in Github and taking care to give me all the information I need to reproduce them. Thank you !

### Acknowledgements
- **Atropos** for the jewel that is Foundry, and also because he's a good man.
- **dev7355608** for his patience, his advices and his awesome contributions.
- **sPoIdAr** for the Automatic Template settings, which is WOW!
- **Moerill** for his very cool JS algorithms and for allowing me to port some functionnalities from MESS
- **Mestre Digital** for the first Token Magic video on Youtube (and in a language I haven't learned. ^^), and his cool GUI Macro.
- **Lozalojo, zimm44, drdwing, zeteticl** for providing translations for the community.
- **The whole community** for its kindness.
- **The Forgotten**, sorry for forgetting about you, you don't deserve it! 

### An advice
*The wise man knows how to `await`.*

### Donations
For those who wish to make a donation : [my paypal](https://www.paypal.me/silentFire "Paypal")

My most sincere thanks.

**SecretFire**

*Discord : SecretFire#4843*


