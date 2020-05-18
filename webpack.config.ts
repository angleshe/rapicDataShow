import Config from 'webpack-chain';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HotModuleReplacementPlugin, NamedModulesPlugin, Configuration } from 'webpack';
import StyleLintPlugin from 'stylelint-webpack-plugin';

const config: Config = new Config();

export default function (env: undefined | string): Configuration | Configuration[] {
  const isProduction = env === 'production';
  config
    .mode(isProduction ? 'production' : 'development')
    .entry('index')
    .add('./src/script/index.ts')
    .end()
    .output.path(path.resolve(__dirname, 'dist'))
    .publicPath('/')
    .filename('script/[name].bundle.js')
    .end()
    .module.rule('ts')
    .test(/\.tsx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader('babel-loader')
    .end()
    .end()
    .rule('tslint')
    .test(/\.tsx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('tslint')
    .loader('eslint-loader')
    .end()
    .end()
    .rule('sass')
    .test(/\.scss$/)
    .use('style-loader')
    .loader('style-loader')
    .end()
    .use('css-loader')
    .loader('css-loader')
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .end()
    .use('sass-loader')
    .loader('sass-loader')
    .end()
    .end()
    .end()
    .resolve.extensions.add('.ts')
    .add('.js')
    .add('.json')
    .end()
    .end()
    .devtool(isProduction ? 'hidden-source-map' : 'inline-source-map')
    .devServer.hot(true)
    .before((app, server, compiler) => {
      compiler.hooks.done.tap('done', () => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.keys((compiler as any).watchFileSystem.watcher.mtimes).some(
            (name) => path.parse(name).ext === '.html'
          )
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      });
    })
    .open(true)
    .end()
    .plugin('html')
    .use(
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['index'],
        hash: true
      })
    )
    .end()
    .plugin('stylelint')
    .use(
      new StyleLintPlugin({
        syntax: 'scss',
        configFile: path.resolve(__dirname, './.stylelintrc.js'),
        files: '**/*.scss'
      })
    )
    .end()
    .plugin('hot')
    .use(new HotModuleReplacementPlugin())
    .end()
    .plugin('name')
    .use(new NamedModulesPlugin());
  return config.toConfig();
}
