const _tempRect = new PIXI.Rectangle();

export class CustomFilter extends PIXI.Filter {
	constructor(...args) {
		super(...args);

		if (!this.uniforms.filterMatrix || !this.uniforms.filterMatrixInverse)
			this.uniforms.filterMatrix = new PIXI.Matrix();

		if (!this.uniforms.filterMatrixInverse) this.uniforms.filterMatrixInverse = new PIXI.Matrix();
	}

	apply(filterManager, input, output, clear) {
		const filterMatrix = this.uniforms.filterMatrix;

		if (filterMatrix) {
			const { sourceFrame, destinationFrame, target } = filterManager.activeState;

			filterMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);

			const worldTransform = PIXI.Matrix.TEMP_MATRIX;

			const localBounds = target.getLocalBounds(_tempRect);

			if (this.sticky) {
				worldTransform.copyFrom(target.transform.worldTransform);
				worldTransform.invert();

				const rotation = target.transform.rotation;
				const sin = Math.sin(rotation);
				const cos = Math.cos(rotation);
				const scaleX = Math.hypot(
					cos * worldTransform.a + sin * worldTransform.c,
					cos * worldTransform.b + sin * worldTransform.d
				);
				const scaleY = Math.hypot(
					-sin * worldTransform.a + cos * worldTransform.c,
					-sin * worldTransform.b + cos * worldTransform.d
				);

				localBounds.pad(scaleX * this.boundsPadding.x, scaleY * this.boundsPadding.y);
			} else {
				const transform = target.transform;
				worldTransform.a = transform.scale.x;
				worldTransform.b = 0;
				worldTransform.c = 0;
				worldTransform.d = transform.scale.y;
				worldTransform.tx = transform.position.x - transform.pivot.x * transform.scale.x;
				worldTransform.ty = transform.position.y - transform.pivot.y * transform.scale.y;
				worldTransform.prepend(target.parent.transform.worldTransform);
				worldTransform.invert();

				const scaleX = Math.hypot(worldTransform.a, worldTransform.b);
				const scaleY = Math.hypot(worldTransform.c, worldTransform.d);

				localBounds.pad(scaleX * this.boundsPadding.x, scaleY * this.boundsPadding.y);
			}

			filterMatrix.prepend(worldTransform);
			filterMatrix.translate(-localBounds.x, -localBounds.y);
			filterMatrix.scale(1.0 / localBounds.width, 1.0 / localBounds.height);

			const filterMatrixInverse = this.uniforms.filterMatrixInverse;

			if (filterMatrixInverse) {
				filterMatrixInverse.copyFrom(filterMatrix);
				filterMatrixInverse.invert();
			}
		}

		filterManager.applyFilter(this, input, output, clear);
	}
}
