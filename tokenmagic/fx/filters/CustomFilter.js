const _tempRect = new PIXI.Rectangle();

export class CustomFilter extends PIXI.Filter {
    constructor(...args) {
        super(...args);

        this.uniforms.filterMatrix = new PIXI.Matrix();
    }

    apply(filterManager, input, output, clear) {
        const { sourceFrame, destinationFrame, target } = filterManager.activeState;

        const filterMatrix = this.uniforms.filterMatrix.set(
            destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);

        const worldTransform = PIXI.Matrix.TEMP_MATRIX;

        if (this.sticky) {
            worldTransform.copyFrom(target.transform.worldTransform);
        } else {
            const transform = target.transform;
            worldTransform.a = transform.scale.x;
            worldTransform.b = 0;
            worldTransform.c = 0;
            worldTransform.d = transform.scale.y;
            worldTransform.tx = transform.position.x - transform.pivot.x * transform.scale.x;
            worldTransform.ty = transform.position.y - transform.pivot.y * transform.scale.y;
            worldTransform.prepend(target.parent.transform.worldTransform);
        }

        worldTransform.invert();

        filterMatrix.prepend(worldTransform);

        const localBounds = target.getLocalBounds(_tempRect).pad(
            Math.hypot(worldTransform.a, worldTransform.b) * this.boundsPadding.x,
            Math.hypot(worldTransform.c, worldTransform.d) * this.boundsPadding.y
        );

        filterMatrix.translate(-localBounds.x, -localBounds.y);
        filterMatrix.scale(1.0 / localBounds.width, 1.0 / localBounds.height);

        filterManager.applyFilter(this, input, output, clear);
    }
}