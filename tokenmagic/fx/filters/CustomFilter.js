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

        const worldTransform = target.worldTransform.copyTo(PIXI.Matrix.TEMP_MATRIX);
        worldTransform.invert();

        const localPadding = Math.hypot(worldTransform.a * this.localPadding, worldTransform.b * this.localPadding);
        const localBounds = target.getLocalBounds(_tempRect).pad(localPadding);

        filterMatrix.prepend(worldTransform);
        filterMatrix.translate(-localBounds.x, -localBounds.y);
        filterMatrix.scale(1.0 / localBounds.width, 1.0 / localBounds.height);

        filterManager.applyFilter(this, input, output, clear);
    }
}