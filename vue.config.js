const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  outputDir: 'dist',
  assetsDir: './',
  indexPath: 'index.html',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'https://votre-nom-de-domaine.vercel.app' : 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
