<template>
  <div>
    <v-card-text>
      <div class="mb-4">
        <span class="title">Form Slider</span>
        <!-- <span class="subtitle">Pengaturan Berita</span> -->
      </div>
      <v-row>
        <v-col>
          <v-text-field
            label="Judul Slider"
            v-model="title"
            :error="errors.title ? true : false"
            :error-messages="errors.title ? errors.title[0] : ''"
            outlined
            :hint="
              $store.state.app.nForEnter
                ? $store.state.app.nForEnterText
                : undefined
            "
            dense
          ></v-text-field>
        </v-col>
        <!-- <v-col>
          <v-text-field
            label="Sub Judul Slider"
            v-model="title_sub"
            :error="errors.title_sub ? true : false"
            :error-messages="errors.title_sub ? errors.title_sub[0] : ''"
            outlined
            dense
          ></v-text-field>
        </v-col> -->
      </v-row>
      <!-- <v-textarea
        label="Deskripsi *"
        v-model="description"
        :error="errors.description ? true : false"
        :error-messages="errors.description ? errors.description[0] : ''"
        outlined
        dense
      ></v-textarea> -->

      <v-row>
        <v-col>
          <v-select
            clearable
            label="Aksi Link *"
            v-model="target"
            :items="select.target"
            :error="errors.target ? true : false"
            :error-messages="errors.target ? errors.target[0] : ''"
            outlined
            dense
          />
        </v-col>
        <v-col>
          <v-select
            label="Jenis Link *"
            v-model="tipe_link"
            :items="select.link"
            :error="errors.tipe_link ? true : false"
            :error-messages="errors.tipe_link ? errors.tipe_link[0] : ''"
            outlined
            clearable
            dense
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DialogPage from '~/components/dialog-page.vue'
export default {
  watch: {
    tipe_link(value) {
      if (value) {
        this.link = ''
      }
    }
  },

  computed: {
    ...mapState({
      selectPage: state => state.global.items.page,
      select: state => state.slider.select,
      errors: state => state.errors
    }),
    link: {
      get() {
        return this.$store.state.slider.form.link
      },
      set(value) {
        this.$store.commit('slider/setLink', value)
      }
    },
    title: {
      get() {
        return this.$store.state.slider.form.title
      },
      set(value) {
        this.$store.commit('slider/setTitle', value)
      }
    },
    title_sub: {
      get() {
        return this.$store.state.slider.form.title_sub
      },
      set(value) {
        this.$store.commit('slider/setTitleSub', value)
      }
    },
    description: {
      get() {
        return this.$store.state.slider.form.description
      },
      set(value) {
        this.$store.commit('slider/setDescription', value)
      }
    },
    target: {
      get() {
        return this.$store.state.slider.form.target
      },
      set(value) {
        this.$store.commit('slider/setTarget', value)
      }
    },
    tipe_page: {
      get() {
        return this.$store.state.slider.form.tipe_page
      },
      set(value) {
        this.$store.commit('slider/setTipePage', value)
      }
    },
    tipe_link: {
      get() {
        return this.$store.state.slider.form.tipe_link
      },
      set(value) {
        this.$store.commit('slider/setTipeLink', value)
      }
    }
  }
}
</script>
