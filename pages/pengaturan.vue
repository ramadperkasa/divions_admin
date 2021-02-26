<template>
  <v-container fluid class="pa-10">
    <v-card>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Ubah Kata Sandi</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab>
          <v-icon left>mdi-lock</v-icon>Kata Sandi
        </v-tab>
        <v-tab-item>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="pb-10">Ganti Kata Sandi</v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Kata Sandi Lama"
                  dense
                  v-model="form.oldPassword"
                  :type="show.oldPassword ? 'text' : 'password'"
                  :append-icon="show.oldPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="show.oldPassword = !show.oldPassword"
                ></v-text-field>
                <!-- <v-text-field
                  label="Kata Sandi Lama"
                  v-model="form.oldPassword"
                  :error="errors.oldPassword ? true : false"
                  :error-messages="errors.oldPassword ? errors.oldPassword[0] : ''"
                  outlined
                  dense
                ></v-text-field>-->
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
                <!-- <v-text-field
                  label="Kata Sandi Baru"
                  v-model="form.password"
                  :error="errors.password ? true : false"
                  :error-messages="errors.password ? errors.password[0] : ''"
                  outlined
                  dense
                ></v-text-field>-->
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Kata Sandi"
                  dense
                  v-model="form.cPassword"
                  :type="show.cPassword ? 'text' : 'password'"
                  :append-icon="show.cPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="show.cPassword = !show.cPassword"
                ></v-text-field>
                <!-- <v-text-field
                  label="Konfirmasi Kata Sandi"
                  v-model="form.cPassword"
                  :error="errors.cPassword ? true : false"
                  :error-messages="errors.cPassword ? errors.cPassword[0] : ''"
                  outlined
                  dense
                ></v-text-field>-->
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="store()"
                >Simpan</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  layout: 'default',
  data() {
    return {
      step: '1',
      steps: '4',
      isLoading: false,
      form: {
        oldPassword: '',
        password: '',
        cPassword: ''
      },
      show: {
        oldPassword: false,
        password: false,
        cPassword: false
      }
    }
  },

  methods: {
    store() {
      this.isLoading = true
      this.$axios
        .get('/api/web/admins/ubah-password', {
          params: this.form
        })
        .then(response => {
          this.$store.commit('setSnackbar', true)
          this.$store.commit('setText', response.data.status)
        })
        .catch(error => {
          this.$store.commit('setSnackbar', true)
          this.$store.commit('setText', 'Terjadi Kesalahan')
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },

  computed: {
    ...mapState({
      isClick: state => state.isClick,
      isSuccess: state => state.isSuccess,
      errors: state => state.errors
    })
  }
}
</script>
