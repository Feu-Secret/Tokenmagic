# Token Magic FX - Update v0.5.2.1-beta

*Fixed Issues :*
- Filters could blur placeables with zoom in/out at web-browser level
- Some filters were generating artifacts (repeating edge pixels) when positionned at the canvas border, with visible and invisible parts.

# Token Magic FX - Update v0.5.2-beta

*Added/Changed :*
- TMFX Now supports the Japanese language. Many thanks to BrotherSharper and Touge!

*Fixed Issues :*
- Removed furnace compatibility mode, which was causing issues (only for FVTT 0.8.x and +)
- Drop Shadow has been reworked and now take into account the zoom level.

# Token Magic FX - Update v0.5.1-beta

*Added/Changed :*
- ======> Compatibility with FVTT 0.8.6 - Anniversary Edition! <======
- You can export/import data from/to the "Automatic Template Settings" (useful to share settings between worlds)
- A reworked README, focused on documentation and useful online resources.

*Fixed Issues :*
- The `Automatic Framerate` client option now works correctly : "You can release the Kraken with your 144hz screen!"

# Token Magic FX - Update v0.5.0-beta

First of all, I want to thank dev7355608 for his incredible contribution to this release!
Long live to dev7355608!

*New filter :*
- Sprite filter (beta) : to link sprites and manipulate them (color, translation, rotation, etc.)
- The token magic compendium has been updated with 3 new sprite filter macro

*Added/Changed :*
- An effect selector macro has been added to the token magic compendium, it works in tandem with any TMFX compendium (many thanks to Bruno Calado!)
- New automatic framerate setting to "release the kraken!"
- New automatically hide template effects setting that hides the border of textured templates.
- New sticky property. If set to true, the filter effect rotates with the target.
- The anchor point (anchorX/anchorY) isn't changed by other filters anymore.
- Default template on hover now shows the grid highlight when hovering over the template and not only when hovering over the control icon on the template layer.
- LibWrapper compatibility.
- The Korean language support : many thanks to KLO!
- The Chinese language support : many thanks to Zeteticl!
- Updated PIXI community filters
- A lot of framework improvements!

*Fixed Issues :*
- Filters were not working properly if the target was rotated.
- Distortion and Blur filters were not working properly when zooming in/out.
- Token Magic was not working if a route prefix was set.
- Some filters were not working properly on some MacOs and Linux distributions. 
- And a lot of other small fixes!

# Token Magic FX - Update v0.4.4-alpha (Mess edition PART I)

*News :*
- Integration of Mess Moerill's Supersuit(e) (for templates) part I :
  - Video support in templates :
    - You can set webm, mp4, etc. as video texture.
    - You can define videos in the automatic spell templates options (for dd5 only).
  - Texture autoresize :
    - The choosen texture is resized to fit the template.
- TMFX now supports the Spanish language! 

Many thanks to Lozalojo (Spanish translation) and Moerill (video) for this release!

*Fixed Issues :*
- Template effect tint was badly formatted during an automatic template creation.

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

# Token Magic FX - Update v0.4.2-alpha

*Improvements :*
- Force Field Filters, with new properties:
    - hideRadius : To create rings.
    - alphaDiscard and discardThreshold : To add local transparency, based on a threshold related to color intensity.
    - New properties to move the ambient light : combined with the above properties, you can create disks.
    - New example macros have been added to the compendium. Check them and play with the values.

*Fixed Issues :*
- A problem with template effects could arise when changing texture (depending of the texture load time)
- Incorrect interpretation of the "clockwise" animation property by the "Transform" filter
- A problem with the "Fumes" filter, which initialized twice.
- The size of the Force Field filters could be altered by the padding of other filters.
- The force field filters could not be stacked correctly.
- Possibility for the animation loop to attach itself several times to the pixi ticker (which could lead to severe performance problems)

*Need contributors :*
- To translate in several languages. Currently, TMFX supports English and French.
- To create user interface (which can be complex). Because html is my weakness.
- To allow auto-templates on other game systems than DD5.
- Or simply by sending me your macros, presets or others, so that I can share them with the community!
- And thank again to sPOiDar, who was the first to join the project with an awesome contribution.

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

# Token Magic FX - Update v0.4.0-alpha

*New Features :*
- DnD5e Automatic templates support (contributions are welcome for other systems!)
    - Configure your auto-templates by damage type and template shape.
    - Create overrides for specific spells or items.
    - Choose color, opacity, special effect, and an optional texture.
- Added an option to activate zOrder property on filters
    - If used, the zOrder determines the order in which the FX are applied (see documentation)
- Added a client option to desactivate FX animations
- Added a new blend mode for the force field/shield/aura filters
    - blend: 14 put your tokens or tiles on top of the effect (interesting for auras)

*New presets for templates :*
- A lot of new effects to use for your templates
    - Fairy fireflies, Ripples, Living Fluid, Fire Rays, two new Spiderweb, and much more!

*New FX :*
- Solar Ripples filter
    - To create new kinds of fire, ripples, and other effects
- Globes filter
    - To add a fairy touch
- Macro examples with the new FX have been added to the TMFX compendium.
 
*Fixed issues :*
- The XFog shader has been reworked due to performance issues.

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

# Token Magic FX - Update v0.2.2b-alpha

*Fixed issues :*
- Compatibility problem with furnace module drawings tools.

# Token Magic FX - Update v0.2.2-alpha

*Added :*
- You can now add FX on drawings. the operating principles are the same as with tokens and tiles.
- Some optimizations in the shaders

# Token Magic FX - Update v0.2.1-alpha

*Added :*
- An option to allow non-GM players to add, modify or delete FX on tokens which they do not own.
- Mirror-images filter overhaul with new properties : 
    - number of images
    - alpha properties on images and character
    - movement amplitude along the X and Y axis.
    - 2 new macro in the portfolio (with an emphasis on new properties)
- Library of stored FX presets :
    - comes with a default library (the same as in the portfolio)
    - functions to add or delete presets in your library
    - functions to export presets from your library into a json file
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

# Token Magic FX - Update v0.2.0-alpha

*Added :*
- A copy of a token also copies the FX
- FX are now stored on prototype tokens (if you update your prototype with a FXified Token)
- An option panel is now available :
    - You can desactivate additive padding in favor of max padding
    - You can set a minimum padding for all applied FX

*New FX :*
- An advanced Ray filter (with better quality than cosmic ray filter)
    - blending options
- Another liquid filter (complementary with the flood filter)
    - blending options
    - spectral property
- A gleaming glow filter
    - two glow types
    - adjustable FX scale
    - adjustable thickness
    - and lot more options to create magical glows.

The new filters have been added to the TokenMagic macro compendium.

*Fixed issues :*
- autoDestroy property did not work properly (the effect was restored when reloading the scene)
- Freezing when updating image, dimensions or tint of a token.
- Freezing when updating image of a tile.
- An effect without animated properties could not be updated normally.
- The global animated property could not be unset (can be unset now with `animated: null`)

# Token Magic FX - Update v0.1.3d-alpha

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
- Freezing when a scene is updated
- Crash when a scene with animated tokens or tiles is deleted (with active players/GM in the scene)
- autoDestroy and autoDisable properties not working properly.

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


