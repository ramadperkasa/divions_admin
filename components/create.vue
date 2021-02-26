<template>
  <div>
    <template v-if="$store.state.create">
      <v-divider vertical inset></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon>mdi-tab-plus</v-icon>
          </v-btn>
        </template>
        <span>Tambah Data</span>
      </v-tooltip>
    </template>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped></style>
