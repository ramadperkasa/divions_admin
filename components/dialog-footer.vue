<template>
     <v-card-actions>
          <button-cancel></button-cancel>
          <v-spacer></v-spacer>
            <button-delete v-if="$store.state.isClickEdit" :child="child"></button-delete>
          <button-submit></button-submit>
          <button-submit-new v-if="btn_new"></button-submit-new>
        </v-card-actions>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ButtonDelete from '~/components/button-delete.vue'
import ButtonCancel from '~/components/button-cancel.vue'
import ButtonSubmit from '~/components/button-submit.vue'
import ButtonSubmitNew from '~/components/button-submit-new.vue'
    export default {
        watch: {
            isLoadingDestroy (val) {
                if(val === false){
                    this.$emit('close')
                }
            }
        },
        props : ['btn_new','child'],
        components: {
             ButtonDelete,
             ButtonCancel,
            ButtonSubmit,
            ButtonSubmitNew,
    },
    computed: {
          ...mapState({
              isLoadingDestroy: state => state.isLoadingDestroy,
          })
    },
    }
</script>

<style lang="stylus" scoped>

</style>
