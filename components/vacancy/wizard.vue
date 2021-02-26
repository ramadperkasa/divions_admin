<template>
  <v-card :loading="loading" :disabled="loading">
    <v-stepper class="mt-2" non-linear v-model="page">
      <v-stepper-header>
        <v-stepper-step
          complete
          editable
          step="1"
          :rules="[() => (error == 1 ? false : true)]"
        >
          Pengaturan Vacancy
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          v-if="Array.isArray($store.state.app.lang)"
          editable
          step="2"
          :rules="[() => (error == 2 ? false : true)]"
        >
          Pengaturan Vacancy Inggris
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          editable
          :step="Array.isArray($store.state.app.lang) ? 3 : 2"
          :rules="[() => (error == 2 ? false : true)]"
        >
          Informasi Lainnya
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content class="content--dense" step="1">
          <v-card>
            <page1></page1>
            <action></action>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items v-if="Array.isArray($store.state.app.lang)">
        <v-stepper-content class="content--dense" step="2">
          <v-card>
            <page-en></page-en>
            <action></action>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content
          class="content--dense"
          :step="Array.isArray($store.state.app.lang) ? 3 : 2"
        >
          <v-card>
            <page2></page2>
            <action></action>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import action from '~/components/vacancy/action'
import page1 from '~/components/vacancy/page1'
import page2 from '~/components/vacancy/page2'
import pageEn from '~/components/vacancy/pageEn'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: ['loading'],
  data() {
    return {
      error: ''
    }
  },
  watch: {
    errors(newValue, oldValue) {
      let stopLoop = false
      let page1 = ['judul', 'sinopsis', 'isi_berita']
      let page2 = ['id_kategori', 'meta_tag', 'cover_image']

      let result = new Promise(resolve => {
        var vm = this
        $.each(newValue, function(key) {
          if (!stopLoop) {
            if (vm.checkError(page1, key)) {
              resolve(1)
              stopLoop = true
            } else if (vm.checkError(page2, key)) {
              resolve(2)
              stopLoop = true
            } else {
              resolve(2)
              stopLoop = true
            }
          }
        })
      })

      result.then(response => {
        this.error = response
        this.page = response
      })
    }
  },
  methods: {
    checkError(array, value) {
      return array.some(function(val) {
        return value == val
      })
    }
  },
  computed: {
    ...mapState({
      errors: state => state.errors
    }),
    page: {
      get() {
        return this.$store.state.vacancy.step
      },
      set(page) {
        this.$store.commit('vacancy/setStep', page)
      }
    }
  },
  components: {
    action,
    page1,
    page2,
    pageEn
  }
}
</script>

<style lang="stylus" scoped></style>
