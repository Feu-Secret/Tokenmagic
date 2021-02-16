# Token Magic FX - Update v0.3.0-alpha

*New Features :*
- Template support with an updated user interface.
    - Combo-box to choose the FX you want to apply.
    - Color picker to choose tint of the FX.
    - Slider to change opacity of the inner texture and/or FX.
    - 23 new presets, specifically designed for templates.
    - Possibility to add your own presets into the library of templates effects.
    - 100% Compatible with mess' module (and video textures !)

*New FX :*
- Spider-Web filter
    - To stick the characters of your players
- XFog filter
    - A thick and shifting fog.
- Macro examples with the new FX have been added to the TMFX compendium.
 
*Fixed issues :*
- Some critical issues in filters Shockwave and Twist (regression of v0.2.2).
- Adding filters triggered too many updates (one by filter).

![Templates Ex](../../images/templates-ex.png)

## Managing Presets

The notion of preset library has been added. Token Magic FX comes with two libraries: A main library with all the presets common to drawings, tokens and tiles, and the one where the presets for the templates are stored.

*Added new functions :*

To retrieve the presets of a library (search by default in the main library  : "tmfx-main"). Returns an array.
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
*updated functions :*

It is now possible to pass an object as parameter. The object must contain the name and optionnaly, the library and various properties.
If you don't specify a library, getPreset will look for the main library by default.

```javascript
TokenMagic.getPreset(<presetName>|<params object>);
```
```javascript
// Example 1:
// Classic method, still OK
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
// all colors properties values in the preset have been changed to 0x00FF00
```
To add a preset, you can now specify a library in an object (same as getPreset).
Also, when you create a preset for a template (template library), you can add a default texture (used if no texture is setted for a given template)
idem when deleting a preset

```javascript
TokenMagic.addPreset(<presetName>|<object>, <params>, optional <silent>);
```
```javascript
TokenMagic.deletePreset(<presetName>|<object>, optional <silent>);
```
```javascript
// Example 1:
// Classic method, still OK
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

## Managing Filters

*Creating template :*

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
   tmfxPreset: "Wild Magic",
   tmfxTint: 0x00FF90,
   tmfxTextureAlpha: 0.8
 });
```

*Removed useless functions :*

All those which worked with a single filter (AddFilter, DeleteFilter, etc.)

Sorry for that, but it was necessary.

*Those that remain :*

- addFilters
- addFiltersOnSelected
- addFiltersOnTargeted
- addUpdateFilters
- addUpdateFiltersOnSelected
- addUpdateFiltersOnTargeted
- deleteFilters
- deleteFiltersOnSelected
- deleteFiltersOnTargeted
- updateFilters
- updateFiltersOnSelected
- updateFiltersOnTargeted
- updateFiltersByPlaceable
- hasFilterType
- hasFilterId

*updated functions :*

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