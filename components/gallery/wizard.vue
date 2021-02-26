<template>
  <v-card :loading="loading" :disabled="loading">
    <v-stepper class="mt-2" non-linear v-model="page">
      <v-stepper-header>
        <v-stepper-step complete editable step="1">
          Setting Gallery
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="2">
          Detail Image gallery
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <page1></page1>
          <action></action>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="2">
          <page2></page2>
          <action></action>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import action from '~/components/gallery/action'
import page1 from '~/components/gallery/page1'
import page2 from '~/components/gallery/page2'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: ['loading'],
  computed: {
    page: {
      get() {
        return this.$store.state.gallery.step
      },
      set(page) {
        this.$store.commit('gallery/setStep', page)
      }
    }
  },
  components: {
    action,
    page1,
    page2,
  }
}
</script>

<style lang="stylus" scoped></style>
