# Token Magic FX - Update v0.4.1-alpha (splash edition)

*Improvements :*
- Cached filters : Shaders are compiled for the GPU at startup (when entering a world). It may take a few more seconds to start a world.
    - No more freeze when you apply an effect for the first time. You can enjoy your effects instantly. 
    - A new option to desactivate cached filters at startup.

*New FX :*
- Splash filter
    - To simulate splashes, injuries and bloodbaths! 
    - Many properties to configure the perfect splash (color, anchor, spread, splash factor, etc.)  
- Transform filter
    - To enlarge, shrink, rotate, skew, translate... what you want, where you want!
    - Foundry properties are left untouched, this is a pure graphic transformation.
- Macro examples with the new FX have been added to the TMFX compendium.

*New presets for templates :*
- 3 new presets for templates : it's time to splash.

*A new collaborator :*
I would like to thank sPOiDar for his outstanding work on auto templates for dd5. He joins the list of authors.

## New filters and default zOrder

For those who use the zOrder option, you will find below the default zOrder value for splash and transform filter:

| Filter  | default zOrder |
|---|---|
| Splash (splash) | 5 |
| Transform (transform) | 1000 |