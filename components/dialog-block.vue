<template>
  <v-dialog v-model="model" scrollable persistent max-width="90%">
    <v-card>
      <dialog-header :isEdit="false" @close="model = false"></dialog-header>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Judul *"
              v-model="form.title"
              :error="errors.title ? true : false"
              :error-messages="errors.title ? errors.title[0] : ''"
              outlined
              dense
            ></v-text-field>
            <texteditor v-model="form.content"></texteditor>
            <small class="error--text">
              {{ errors.content ? errors.content[0] : '' }}
            </small>
            <texteditor
              v-if="Array.isArray($store.state.app.lang)"
              v-model="form.content_en"
            ></texteditor>
            <small class="error--text">
              {{ errors.content_en ? errors.content_en[0] : '' }}
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
        >
          <v-icon>mdi-arrow-left</v-icon>Kembali</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submit()"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan
        </v-btn>
        <v-btn
          color="primary"
          class="ma-2"
          :disabled="loading"
          :loading="loading"
          @click="submitNew()"
        >
          <v-icon>mdi-content-save-move-outline</v-icon>&nbsp;Simpan Baru
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Texteditor from '~/components/texteditor.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      form: {
        title: '',
        content: '',
        content_en: ''
      }
    }
  },
  components: {
    Texteditor
  },
  watch: {
    model(newValue) {
      if (newValue == true) {
        this.$store.commit('block/setClearForm')
      }
    },

    isErrors(newValue) {
      if (!newValue) {
        this.$store.commit('block/setIsErrors', '')
      }
    }
  },
  methods: {
    ...mapActions('block', ['storeData']),
    ...mapMutations('block', ['setLoading']),
    submit() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        var result = this.storeData(this.form)
        result
          .then(() => {
            let self = this
            Object.keys(this.form).forEach(function(key) {
              self.form[key] = ''
            })
            this.$emit('update')
            this.model = false
          })
          .finally(() => {})
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
    ...mapState('block', {
      errors: state => state.errors,
      isErrors: state => state.isErrors
    }),
    model: {
      get() {
        return this.$store.state.block.model
      },
      set(model) {
        this.$store.commit('block/setModel', model)
      }
    },
    title: {
      get() {
        return this.$store.state.block.form.title
      },
      set(model) {
        this.$store.commit('block/setTitle', model)
      }
    },
    content: {
      get() {
        return this.$store.state.block.form.content
      },
      set(model) {
        this.$store.commit('block/setContent', model)
      }
    },
    loading: {
      get() {
        return this.$store.state.block.loading
      },
      set(loading) {
        this.$store.commit('block/setloading', loading)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
