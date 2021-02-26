import colors from 'vuetify/es5/util/colors'
const webpack = require('webpack')
const jQueryPath = 'jquery/dist/jquery.js'
const env = require('dotenv').config()

export default {
  mode: 'universal',
  env: env.parsed,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        property: 'fb:pages',
        content: '331865743815422'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [{
      src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',
      type: 'text/javascript'
    }, ],
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/logoweb.png'
    }]
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/oauth/token',
            method: 'post',
            propertyName: 'access_token'
          },
          logout: {
            url: '/api/web/admins/logout',
            method: 'get'
          },
          user: {
            url: '/api/web/admins',
            method: 'get',
            propertyName: false
          },
          tokenRequired: true,
          tokenType: 'bearer',
          autoFetchUser: true
        }
      },
      brand: {
        _schema: '~schemes/brand.js',
        endpoints: {
          login: {
            url: '/oauth/token',
            method: 'post',
            propertyName: 'access_token'
          },
          logout: {
            url: '/api/web/admins/logout',
            method: 'get'
          },
          user: {
            url: '/api/web/admins',
            method: 'get',
            propertyName: false
          },
          tokenRequired: true,
          tokenType: 'bearer',
          autoFetchUser: true
        }
      },
      facebook: {
        endpoints: {
          login: {
            url: 'http://localhost:8000/oauth/facebook',
            method: 'get',
            propertyName: 'access_token'
          },
          logout: {
            url: '/api/web/admins/logout',
            method: 'get'
          },
          user: {
            url: '/api/web/admins',
            method: 'get',
            propertyName: false
          },
          tokenRequired: true,
          tokenType: 'bearer',
          autoFetchUser: true
        }
      }
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    name: 'circle',
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [{
    src: '@/assets/css/custom.css',
    lang: 'css'
  }],
  /*
   ** Plugins to load before mounting the App
   */

  plugins: [{
      src: '~/plugins/tiptap-vuetify',
      ssr: false
    },
    {
      src: '~/plugins/croppie.js',
      ssr: false
    },
    {
      src: '~/plugins/croppa.js',
      ssr: false
    },
    {
      src: '~/plugins/localcomponent.js',
      ssr: false
    },
    {
      src: '~/plugins/trumbowyg.js',
      ssr: false
    },
    {
      src: '~/plugins/dropzone.js',
      ssr: false
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/device',
    '@nuxtjs/auth'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseUrl: env.API_URL,
    timeout: 10000
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        primary: '#363FA0',
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    vendor: ['jquery'],
    transpile: ['@nuxtjs/auth'],
    plugins: [
      new webpack.ProvidePlugin({
        Vue: ['vue/dist/vue.esm.js', 'default'],
        jQuery: jQueryPath,
        $: jQueryPath,
        'window.jQuery': jQueryPath,
        '_': 'lodash'
      })
    ]
  },
  router: {
    middleware: ['auth']
  }
}
