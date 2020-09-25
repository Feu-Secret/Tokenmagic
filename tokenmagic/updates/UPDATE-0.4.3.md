# Token Magic FX - Update v0.4.3-alpha

*News :*
- Polymorph effect :
    - Allow image transition between a source image (token, tile, etc.) and a target image of your choice.
    - 9 types of transition are provided :
      - Morphing, waterdrop, waving, twisting, take off/put on your disguise!, tvnoise, hologram, wind and basic alpha transition.
    - Properties to reduce or enlarge the target image.
- XFire effect :
    - A fire filter with advanced properties, designed to be easily colorizable.
    - specific blend modes that do not alter the visual quality of the filter depending on the brightness and intensity of the source image.
    - An advanced mode allows you to choose up to 4 colors to compose your perfect fire.
    - An inlay mode to create new effects, like superfrost or superheat.
    - A chromatic mode.
    - Adjustable scale on the x and y axis.
- New macros have been added to the TMFX compendium (+ new presets for main library and templates)
- Added two new `animType` :
    - `halfCosOscillation` and `halfSinOscillation` :
      - The half of the given oscillation in one loop.
      - A tutorial is provided in the following macro : "36 - T01 - Turn into Mystery Man (polymorph)"

*Updates :*
- Rank your effects :
    - The order in which you put your filters is important.
    - A new property called `rank` allow you to force the ordering of filters on a given target.
      - Filters with lowest rank are executed first, etc.
      - If you do not specify a rank, TMFX will automatically assign rank within its reserved range (10000 to 20000).
      - This system is the default mode and an alternative to the zOrder option, you can use either.
- Transform filter :
    - The twist and bulge/pinch filters have been reengineered and put in the transform filter : 
      - with better performance and the elimination of flicker.
- Updated PIXI libs 

*Deprecated :*
- Twist and Bulge/Pinch effects : 
    - Use transform effect instead, which is more efficient.
- Shockwave effect :
    - Use wave effect instead, which is more efficient and versatile.
- Deprecated effects will no longer be maintained and will be removed from TMFX v1.0.0-beta (you have time.)
- Consider migrating your personal macros.
- Macros in the TMFX compendium have been migrated, with detailed examples.

*Fixed Issues :*
- Sometimes, a filter update could fail or update the wrong filter.
- Due to gaps between frames, when an animation loop terminated, an animated property might have a slight deviation from its termination value.






