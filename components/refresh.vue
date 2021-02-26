<template>
  <div>
    <v-divider class="ml-1 mr-1" inset vertical></v-divider>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon @click="update()">
          <v-icon v-if="$attrs.value">mdi-spin mdi-refresh</v-icon>
          <v-icon v-else>mdi-refresh</v-icon>
        </v-btn>
      </template>
      <span>Refresh</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  methods: {
    update () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="stylus" scoped></style>
