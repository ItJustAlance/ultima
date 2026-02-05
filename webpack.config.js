const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	return templateFiles.map((item) => {
		const parsedPath = path.parse(item);
		const name = parsedPath.name;
		const extension = parsedPath.ext.substring(1);
		return new HtmlWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			inject: true,
			scriptLoading: "blocking",
		});
	});
}

const htmlPlugins = generateHtmlPlugins("src/html/views");

const baseConfig = {
	entry: ["./src/js/index.js", "./src/scss/style.scss"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/bundle.js",
		clean: true,
		assetModuleFilename: "assets/[name][ext]",
	},
	devtool: "source-map",
	devServer: {
		static: { directory: path.join(__dirname, "dist") },
		port: 9000,
		hot: true,
		open: true,
		watchFiles: ["src/**/*"],
	},
	
	module: {
		rules: [
			{
				test: /\.(scss|sass)$/,
				include: path.resolve(__dirname, "src/scss"),
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { sourceMap: true, url: false } },
					{ loader: "sass-loader", options: { sourceMap: true } },
				],
			},
			
			{
				test: /\.html$/,
				include: path.resolve(__dirname, "src/html/includes"),
				use: [
					{
						loader: "raw-loader",
						options: { esModule: false } // <- для импорта includes в includes
					}
				],
			},
			
			// обработка изображений, SVG в src/icons исключаем (они идут в inline-спрайт)
			{
				test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
				exclude: path.resolve(__dirname, "src/icons"),
				type: "asset",
				parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
				generator: { filename: "img/[name][ext]" },
			},
			
			// inline svg-sprite (вставляется в DOM)
			{
				test: /\.svg$/,
				include: path.resolve(__dirname, "src/icons"),
				use: [
					{
						loader: "svg-sprite-loader",
						options: {
							symbolId: "icon-[name]",
							
							// extract: false (по умолчанию) — inline в runtime
						},
					},
				],
			},
			
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: { filename: "fonts/[name][ext]" },
			},
			
			{
				test: /\.(ico|pdf)$/i,
				type: "asset/resource",
			},
		],
	},
	
	plugins: [
		new MiniCssExtractPlugin({ filename: "css/style.bundle.css" }),
		
		new CopyPlugin({
			patterns: [
				{ from: "src/fonts", to: "fonts", noErrorOnMissing: true },
				{ from: "src/favicon", to: "favicon", noErrorOnMissing: true },
				{ from: "src/img", to: "img", noErrorOnMissing: true },
				{ from: "src/uploads", to: "uploads", noErrorOnMissing: true },
			],
		}),
	].concat(htmlPlugins),
};

module.exports = (env, argv) => {
	const mode = argv && argv.mode ? argv.mode : process.env.NODE_ENV || "development";
	baseConfig.mode = mode;
	
	if (mode === "production") {
		baseConfig.devtool = "source-map";
		baseConfig.output.filename = "js/[name].js";
		baseConfig.output.assetModuleFilename = "assets/[name][ext]";
		baseConfig.optimization = {
			minimize: true,
			minimizer: [
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: ["default", { discardComments: { removeAll: true } }],
					},
				}),
				new TerserPlugin({
					extractComments: true,
					terserOptions: { compress: { drop_console: true } },
				}),
			],
			splitChunks: { chunks: "all", cacheGroups: { vendor: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" } } },
			runtimeChunk: "single",
			moduleIds: "named",
			chunkIds: "named",
		};
	} else {
		// development
		baseConfig.devtool = "eval-source-map";
		baseConfig.output.filename = "js/bundle.js";
		baseConfig.optimization = {
			minimize: false,
			splitChunks: false,
			runtimeChunk: false,
		};
	}
	
	return baseConfig;
};
