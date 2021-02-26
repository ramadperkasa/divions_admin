<template>
     <v-toolbar flat color="primary" dark>
          <v-toolbar-title>
            <v-icon small left>mdi-pencil</v-icon>
            {{ isEdit ? 'Edit' : 'Tambah' }} Data
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
</template>

<script>
    export default {
      props : ['isEdit'],
        methods: {
            closeDialog () {
                this.$emit('close')
            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>
