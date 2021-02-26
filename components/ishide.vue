<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        small
        v-on="on"
        icon
        v-if="manage('edit-')"
        @click="
          submit(item)
          hide == 1 ? (hide = 0) : (hide = 1)
        "
      >
        <v-icon small v-if="hide == 0" color="primary">mdi-eye-outline</v-icon>
        <v-icon small v-else color="danger">mdi-eye-off-outline</v-icon>
      </v-btn>
      <template v-on="on" v-else>
      <v-icon small v-if="hide == 0" color="primary">mdi-eye-outline</v-icon>
        <v-icon small v-else color="danger">mdi-eye-off-outline</v-icon>
      </template>
    </template>
    <span v-if="hide == 0">Dimunculkan</span>
    <span v-else> Disembunyikan</span>
  </v-tooltip>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: ['item'],
  data() {
    return {
      hide: this.item.ishide ? this.item.ishide : ''
    }
  },
  methods: {
    ...mapActions(['ishide']),
     manage(params){
      if(this.$auth.user.all_permissions != null){
        var data = this.$auth.user.all_permissions.includes(params+this.$route.name)
      }
      else{
        var data = false
      }
      return data
    },
    submit(item) {
      return new Promise((resolve, reject) => {
        var result = this.ishide(item.id)
      })
    }
  },
  computed: {
    ...mapState({
      ...mapState({
        admin: state => state.admin
      })
    })
  }
}
</script>

<style lang="stylus" scoped></style>
