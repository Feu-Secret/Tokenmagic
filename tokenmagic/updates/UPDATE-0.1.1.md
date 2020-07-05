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
discord : SecretFire#4843