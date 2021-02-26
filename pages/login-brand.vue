<template>
  <v-container fluid :fill-height="!$device.isMobile" height="100%">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" class="pr-10" v-if="!$device.isMobile">
        <img src="/login.svg" width="80%" />
      </v-col>
      <v-col cols="12" md="1" v-if="!$device.isMobile">
        <div class="vl"></div>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="custom-login-form" elevation="2" :disabled="isLoading">
          <v-progress-linear
            :active="isLoading"
            :indeterminate="isLoading"
            absolute
            top
            color="primary"
          ></v-progress-linear>
          <v-container class="pa-10">
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="12">
                <v-alert color="primary" dark class="title">
                  <v-icon class="mr-2">mdi-comment-account</v-icon>Login
                  Aplikasi
                </v-alert>
                <br />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Nama Pengguna"
                  dense
                  v-model="form.username"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Kata Sandi"
                  dense
                  v-model="form.password"
                  :type="show.password ? 'text' : 'password'"
                  :append-icon="show.password ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="show.password = !show.password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-5">
                <v-btn
                  class="btn-primary"
                  @click="userLogin()"
                  :disabled="
                    isLoading || form.username == '' || form.password == ''
                  "
                  block
                  >Masuk</v-btn
                >
              </v-col>
              <!-- <v-col cols="12" class="pb-5">
                <v-btn
                  class="btn-primary"
                  @click="facebookLogin()"
                  block
                >Masuk dengan Facebook</v-btn>
              </v-col> -->
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  layout: 'blank',
  data() {
    return {
      form: {
        username: '',
        password: '',
        grant_type: 'password',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        provider: 'brands'
      },
      show: {
        password: false
      },
      isLoading: false
    }
  },

  mounted() {
    window.addEventListener('message', this.onMessage, false)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onMessage)
  },

  methods: {
    ...mapMutations(['setSnackbar', 'setText']),

    async userLogin() {
      this.isLoading = true
      try {
        let response = await this.$auth.loginWith('brand', {
          data: this.form
        })

        this.$auth.$storage.setCookie(
          'auth_dsn',
          'Bearer' + response.data.access_token,
          false
        )
      } catch (err) {
        // if (err.response.status == 400) {
        //   this.setText('Nama pengguna atau kata sandi yang anda masukkan salah')
        // } else {
        //   this.setText(err.response.status)
        // }
        // this.isLoading = false
        // this.setSnackbar(true)
      }
    },

    //  async facebookLogin() {
    //   const newWindow = openWindow('', 'message')
    //   const url = await
    // this.$axios.post('http://localhost:8000/api/oauth/facebook')
    //   .then(response => {
    //     return response.data.url
    //   })
    //   newWindow.location.href = url
    // },

    onMessage(e) {
      if (e.data.access_token) {
        this.$auth.setToken('brand', e.data.access_token)

        this.$auth.ctx.app.$axios.setHeader(
          'Authorization',
          'Bearer ' + e.data.access_token
        )

        this.$axios
          .get('/api/brand')
          .then(response => {
            this.isLoading = false
            this.$auth.setUser(response.data)
            this.$router.push('/')
          })
          .catch(error => {
            this.isLoading = false
            this.$store.commit('setText', error.response.status)
            this.$store.commit('setSnackbar', true)
          })
      }
    }
  }
}
function openWindow(url, title, options = {}) {
  if (typeof url === 'object') {
    options = url
    url = ''
  }
  options = { url, title, width: 600, height: 720, ...options }
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screen.left
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screen.top
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    window.screen.width
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    window.screen.height
  options.left = width / 2 - options.width / 2 + dualScreenLeft
  options.top = height / 2 - options.height / 2 + dualScreenTop
  const optionsStr = Object.keys(options)
    .reduce((acc, key) => {
      acc.push(`${key}=${options[key]}`)
      return acc
    }, [])
    .join(',')
  const newWindow = window.open(url, title, optionsStr)
  if (window.focus) {
    newWindow.focus()
  }
  return newWindow
}
</script>
