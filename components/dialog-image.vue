<template>
  <v-dialog v-model="model" scrollable width="65%">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-folder-image</v-icon>Lihat Image
        <v-spacer></v-spacer>
        <v-btn icon @click="model = !model">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <video
          width="100%"
          height="100%"
          v-if="type == 1"
          controls
          :src="src"
          :type="type"
        >Browser kamu ga support untuk menjalankan video ini</video>
        <iframe
          width="100%"
          height="475"
          v-else-if="type == 2"
          :src="`https://www.youtube.com/embed/`+src.replace(env,'')"
          frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <v-img
          width="100%"
          height="100%"
          :src="src"
          v-else
          :lazy-src="src"
          aspect-ratio="1"
          class="grey lighten-2"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-card-text>
      <v-card-actions></v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      env: process.env.API_URL
    }
  },
  computed: {
    model: {
      get() {
        return this.$store.state.modelDialogItem
      },
      set(model) {
        this.$store.commit('setModelDialogItem', model)
      }
    },
    src: {
      get() {
        return this.$store.state.src
      },
      set(value) {
        this.$store.commit('setSrc', value)
      }
    },
    type: {
      get() {
        return this.$store.state.type
      },
      set(value) {
        this.$store.commit('setType', value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
