<template>
  <v-container fluid>
    <v-card>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Kelola Akun Anda</v-toolbar-title>
      </v-toolbar>
      <v-card outlined>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="3">
              <v-img
                v-if="form.foto == '' || form.foto == null"
                src="https://image.flaticon.com/icons/svg/2919/2919863.svg
                  "
              ></v-img>
              <v-img
                v-else
                :src="
                    form.foto.length < 350
                      ? env + form.foto
                      : form.foto
                  "
              ></v-img>

              <v-btn @click.prevent="file" block text color="info" class="mt-2">
                <v-icon left>mdi-account-edit</v-icon> Ubah Foto Profil
              </v-btn>
              <input
                type="file"
                style="display: none;"
                accept="image/*"
                ref="fileInput"
                @change="fileSelected"
              />
            </v-col>
            <v-col cols="9">
              <v-col cols="12">
                <v-text-field outlined label="Nama Pengguna" dense v-model="form.nama"></v-text-field>
                <v-text-field outlined label="Nama Alias" dense v-model="form.nama_singkat" hint="Nama ini yang dipakai di aplikasi"></v-text-field>
                <v-text-field outlined label="Email Pengguna" dense v-model="form.email"></v-text-field>
                <v-row>
                  <v-col cols="4">
                    <v-text-field outlined label="Facebook URL" dense v-model="form.facebook"></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field outlined label="Twitter URL" dense v-model="form.twitter"></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field outlined label="Instagram URL" dense v-model="form.instagram"></v-text-field>
                  </v-col>
                </v-row>

                <v-textarea outlined label="Deskripsi Pengguna" dense v-model="form.deskripsi"></v-textarea>
              </v-col>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="isLoading" :disabled="isLoading" @click="store()">
            <v-icon left>mdi-content-save</v-icon>Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
    <v-dialog v-model="dialog.crop.model" width="800" persistent>
      <v-card>
        <v-card-title>
          Potong Foto
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog.crop.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <vue-croppie
            ref="croppieRef"
            :enableOrientation="true"
            :boundary="{ width: 450, height: 450 }"
          ></vue-croppie>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="crop()">
            <v-icon left>mdi-crop</v-icon>Potong Foto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  layout: 'default',
  data() {
    return {
      env: process.env.API_URL,
      dialog: {
        crop: {
          model: false
        }
      },
      step: '1',
      steps: '4',
      isLoading: false,
      form: {
        nama: this.$auth.user ? this.$auth.user.nama : '',
        nama_singkat: this.$auth.user ? this.$auth.user.nama_singkat : '',
        facebook: this.$auth.user ? this.$auth.user.facebook : '',
        foto: this.$auth.user ? this.$auth.user.foto : '',
        twitter: this.$auth.user ? this.$auth.user.twitter : '',
        instagram: this.$auth.user ? this.$auth.user.instagram : '',
        email: this.$auth.user ? this.$auth.user.email : '',
        deskripsi: this.$auth.user ? this.$auth.user.deskripsi : ''
      },
      show: {
        oldPassword: false,
        password: false,
        cPassword: false
      }
    }
  },

  methods: {
    crop() {
      let options = {
        size: { width: 450, height: 450 },
        format: 'png'
      }
      this.$refs.croppieRef.result(options, output => {
        this.form.foto = this.croppieImage = output
      })
      this.dialog.crop.model = false
    },
    file() {
      this.$refs.fileInput.click()
    },
    fileSelected(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      this.dialog.crop.model = true
      setTimeout(() => {
        var reader = new FileReader()
        reader.onload = e => {
          this.$refs.croppieRef.bind({
            url: e.target.result
          })
        }
        reader.readAsDataURL(files[0])
      }, 300)

      const input = this.$refs.fileInput
      input.type = 'text'
      input.type = 'file'
    },
    store() {
      this.isLoading = true
      this.$axios
        .post('/api/web/admins/kelola', this.form)
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
