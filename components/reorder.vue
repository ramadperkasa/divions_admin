<template>
  <v-edit-dialog
    v-if="manage('edit-')"
    :return-value.sync="model"
    large
    persistent
    @save="store(id, model)"
  >
    <div>{{ model }}</div>
    <template v-slot:input>
      <div class="mt-4 title">Urutkan</div>
    </template>
    <template v-slot:input>
      <v-text-field
        v-model="model"
        label="Urutkan"
        single-line
        counter
        autofocus
        type="number"
        @keydown.enter="store(id, model)"
      ></v-text-field>
    </template>
  </v-edit-dialog>
  <div v-else>{{ model }}</div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  props: ['props'],
  data() {
    return {
      model: this.props.item.reorder ? this.props.item.reorder : '',
      id: this.props.item.id
    }
  },
  methods: {
    ...mapActions(['reorder']),
     manage(params){

      if(this.$auth.user.all_permissions != null){
        var data = this.$auth.user.all_permissions.includes(params+this.$route.name)
      }
      else{
        var data = false
      }
      return data
    },
    store(id, model) {
      const data = {
        id,
        reorder: model
      }
      this.reorder(data)
    }
  },
  computed: {
    ...mapState({
      admin: state => state.admin
    })
  },
}
</script>

<style lang="stylus" scoped></style>
