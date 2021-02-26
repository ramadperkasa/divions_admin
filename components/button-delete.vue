<template>
<div>
  <v-btn
    v-if="manage('delete-') && !checkChild($store.state.itemEdit)"
    class="ma-2"
    color="error"
    :disabled="isClick || isClickNew"
    :loading="isClick || isClickNew"
     @click="setDialogDestroy({ id: $store.state.itemEdit.hasOwnProperty('id') ? $store.state.itemEdit.id : '', status: true, child : null })"
  >
    <v-icon>mdi-delete-forever</v-icon> Hapus Data
  </v-btn>
  <v-btn
    v-else-if="manage('delete-') && checkChild($store.state.itemEdit)"
    class="ma-2"
    color="error"
    :disabled="isClick || isClickNew"
    :loading="isClick || isClickNew"
     @click="setDialogDestroy({ id: $store.state.itemEdit.hasOwnProperty('id') ? $store.state.itemEdit.id : '', status: true, child : child })"
  >
    <v-icon>mdi-delete-alert</v-icon> Hapus Data
  </v-btn>
</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
    props: ['child'],
  methods: {
    ...mapMutations(['setIsClickCancel','setDialogDestroy']),

    submit() {
      this.setIsClickCancel(true)
    },
     manage(params) {
      if (this.$auth.user.all_permissions != null) {
        var data = this.$auth.user.all_permissions.includes(
          params + this.$route.name
        )
      } else {
        var data = false
      }
      return data
    },
     checkChild(val){
      if(this.child ? this.child.length > 0 : false){
        for (let index = 0; index < this.child.length; index++) {
            if(val[this.child[index]] == 1){
              return true
            }
        }
        return false
      }
      else{
        return false
      }
    },
  },

  computed: {
    ...mapState({
      isClick: state => state.isClick,
      isClickNew: state => state.isClickNew
    })
  }
}
</script>
