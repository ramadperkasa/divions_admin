<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon >
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </template>
      <span>Ke Halaman awal</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped></style>
