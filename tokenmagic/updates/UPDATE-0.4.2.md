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


