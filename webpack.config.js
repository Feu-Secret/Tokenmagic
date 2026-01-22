const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env) => {
	return {
		entry: './tokenmagic/module/tokenmagic.js',
		output: {
			filename: 'tokenmagic.js',
			path: path.resolve(__dirname, 'tokenmagic/module/bundle'),
			publicPath: 'modules/tokenmagic/module/bundle/',
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						keep_classnames: true,
						keep_fnames: false,
					},
				}),
			],
		},
		mode: 'production',
		watch: env?.mode === 'watch' ? true : false,
		watchOptions: {
			ignored: ['**/node_modules/', '**/scripts/libs/'],
		},
		devtool: 'source-map',
		// plugins: [new BundleAnalyzerPlugin()],
	};
};
