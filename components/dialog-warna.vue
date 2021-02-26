<template>
  <v-dialog v-model="model" scrollable persistent max-width="900px">
    <v-card>
      <dialog-header :isEdit="false" @close="model = false"></dialog-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="6" class="no-p">
            <v-col cols="12" class="no-p">
              <v-text-field
                label="Nama *"
                v-model="form.nama"
                :error="errors.nama ? true : false"
                :error-messages="errors.nama ? errors.nama[0] : ''"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                label="Nama Singkat *"
                counter="2"
                v-model="form.nama_singkat"
                :error="errors.nama_singkat ? true : false"
                :error-messages="
                  errors.nama_singkat ? errors.nama_singkat[0] : ''
                "
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-col>
          <v-col cols="6" class="no-p">
            <v-color-picker v-model="form.hex" hide-canvas></v-color-picker>
            <small class="error--text">
              {{ errors.hex ? errors.hex[0] : '' }}
            </small>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="model = false"
          ><v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submit"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan</v-btn
        >
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submitNew"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan Baru
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        id: '',
        nama: '',
        ishide: '',
        reorder: ''
      }
    }
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('warna/setClearForm')
        this.form.nama = ''
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('warna/setIsErrors', '')
      }
    }
  },
  methods: {
    ...mapActions('warna', ['storeData']),
    ...mapMutations('warna', ['setLoading']),
    submit() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
          this.model = false
        })
      })
    },
    submitNew() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result.then(() => {
          let self = this
          Object.keys(this.form).forEach(function(key) {
            self.form[key] = ''
          })
          this.$emit('update')
        })
      })
    }
  },
  computed: {
    ...mapState('warna', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    model: {
      get() {
        return this.$store.state.warna.model
      },
      set(model) {
        this.$store.commit('warna/setModel', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.warna.loading
      },
      set(loading) {
        this.$store.commit('warna/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
