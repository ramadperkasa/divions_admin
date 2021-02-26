<template>
  <div>
    <template v-if="$store.state.delete">
      <v-divider vertical inset></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="$attrs.value = !$attrs.value">
            <v-icon>mdi-format-list-checks</v-icon>
          </v-btn>
        </template>
        <span>Seleksi Data</span>
      </v-tooltip>
      <v-tooltip bottom v-if="$attrs.value">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            :disabled="item.length == 0"
            @click="setDialogDestroys({ item: item, status: true, multiple : true })"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
        <span>Hapus Data yang Terseleksi</span>
      </v-tooltip>
    </template>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  props:['item'],
  methods: {
     ...mapMutations([
      'setDialogDestroys',
     ])
  }
}
</script>

<style lang="stylus" scoped></style>
