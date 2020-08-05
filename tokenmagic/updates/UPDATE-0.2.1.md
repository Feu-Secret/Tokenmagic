# Token Magic FX - Update v0.2.1-alpha

*Added :*
- An option to allow non-GM players to add, modify or delete FX on tokens which they do not own.
- Mirror-images filter overhaul with new properties : 
    - number of images
    - alpha of the images and the main character
    - movement amplitude along the X and Y axis.
    - 2 new macro in the portfolio (with an emphasis on new properties)
- Library of stored FX presets :
    - comes with a default library (the same as in the portfolio)
    - functions to add or delete presets
    - functions to export presets library into a json file
    - functions to import presets into your library (local or URL)
- Added smooth edges on Force Field filter

*New FX :*
- A pixelate filter (sample added in the portfolio)

*Fixed issues :*
- Added the v0.2.0 missing macros in the portfolio.
    - X-rays, liquid and x-glow macros
- Force field filter had a brightness and contrast problem. 
    - The colors are now more vivid.
    - You may have to review your macros by adjusting color intensity.
    - The Force field macros have been rewritten.
- Corrected some performances issues in the shaders
- Some animations could freeze with a large video or texture (animated tokens, etc.)

*Thanks :*
- special thanks to @tposney 

## Managing Presets

*Added new functions :*

To add a preset in your library :
```javascript
(async) TokenMagic.addPreset(<presetName>,<params>,optional <silent>)

// Example
// You don't need to add a filterId when creating a preset. The filterId is created with the preset name.
// In the example below, the filterId will be equal to "FunnyGlow"
// If your preset is composed of multiple filter types, all the filterId will share the preset name
let params =
           [{
               filterType: "glow",
               filterId: "funnyAlternateGlow",
               color: Math.floor(Math.random() * 16777215)
           }];
TokenMagic.addPreset("FunnyGlow",params);
```
To delete a preset in your library :
```javascript
(async) TokenMagic.deletePreset(<presetName>,optional <silent>);
```
To get a preset from your library :
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

*A new option in the module option panel allow overwrite of duplicates (by preset name) on import.
By default, duplicates are ignored.*

### Functions updates

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

### Default presets library content

```javascript
0: {name: "bevel", params: Array(1)}
1: {name: "adjustment", params: Array(1)}
2: {name: "dropshadow", params: Array(1)}
3: {name: "outline", params: Array(1)}
4: {name: "glow", params: Array(1)}
5: {name: "bloom", params: Array(1)}
6: {name: "distortion", params: Array(1)}
7: {name: "oldfilm", params: Array(2)}
8: {name: "twist", params: Array(1)}
9: {name: "bulge", params: Array(1)}
10: {name: "blur", params: Array(1)}
11: {name: "zoomblur", params: Array(1)}
12: {name: "shockwave", params: Array(1)}
13: {name: "zapshadow", params: Array(1)}
14: {name: "rays", params: Array(1)}
15: {name: "fog", params: Array(1)}
16: {name: "fumes", params: Array(1)}
17: {name: "electric", params: Array(1)}
18: {name: "fire", params: Array(1)}
19: {name: "waves", params: Array(1)}
20: {name: "flood", params: Array(1)}
21: {name: "smoke", params: Array(1)}
22: {name: "images", params: Array(1)}
23: {name: "chaos-images", params: Array(1)}
24: {name: "spectral-images", params: Array(1)}
25: {name: "hexa-field", params: Array(1)}
26: {name: "fire-field", params: Array(1)}
27: {name: "smoke-field", params: Array(1)}
28: {name: "earth-field", params: Array(1)}
29: {name: "earth-field-top", params: Array(1)}
30: {name: "air-field", params: Array(1)}
31: {name: "magic-field", params: Array(1)}
32: {name: "chromatic-field", params: Array(1)}
33: {name: "water-field", params: Array(1)}
34: {name: "evil-field", params: Array(1)}
35: {name: "grid-field", params: Array(1)}
36: {name: "warp-field", params: Array(1)}
37: {name: "color-field", params: Array(1)}
38: {name: "sunburst", params: Array(1)}
39: {name: "clover", params: Array(1)}
40: {name: "scan", params: Array(1)}
41: {name: "blue-rays", params: Array(1)}
42: {name: "spectral-body", params: Array(1)}
43: {name: "mantle-of-madness", params: Array(1)}
44: {name: "drift-in-plans", params: Array(2)}
45: {name: "fire-aura", params: Array(2)}
46: {name: "glacial-aura", params: Array(2)}
47: {name: "anti-aura", params: Array(2)}
48: {name: "pure-fire-aura", params: Array(3)}
49: {name: "pure-fire-aura-2", params: Array(3)}
50: {name: "pure-ice-aura", params: Array(3)}
```