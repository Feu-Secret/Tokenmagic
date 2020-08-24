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

## Auto-Templates

You can configure automatic templates in the module option panel. You also have options to disable automatic templates and the display of the grid.

![Template Settings](../../images/template-settings.png)

In the template settings, you have a tab that display to automatic templates settings by categories, and another for spells and items overrides.

![Template Settings Base](../../images/template-settings-base.png)
![Template Settings Overrides](../../images/template-settings-overrides.png)

## Working with the zOrder property

If you want to work with this new property, you must activate the option in the module option panel.

The zOrder allows the filters to be applied on a Placeable in a specific order: from the smallest zOrder to the highest.

A concrete example: you have applied an aura to a token, then you apply a mirror image, the aura will also be processed by the mirror image, which is probably not the desired effect. By assigning a zOrder to your effects, you can determine that the mirror image should apply before the aura.

You will find below a table with the filters and their default zOrder. The default zOrder can be overriden in the parameters of the filters. Suggestions and critics are welcome if you think that the default zOrder should be changed for specific filters.

| Filter  | default zOrder |
|---|---|
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
| Force Field (field) | 2000  |
| Distortion (distortion) | 4000  |