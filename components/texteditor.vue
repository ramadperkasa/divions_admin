<template>
  <div>
    <trumbowyg
      :placeholder="label"
      id="my-editor"
      ref="trumbowyg"
      v-model="isi"
      :config="config"
    ></trumbowyg>
    <dialog-upload
      :media="true"
      v-model="dialog"
      @upload="value => changeImage(value)"
      @close="dialog = false"
    ></dialog-upload>
  </div>
</template>

<script>
import DialogUpload from '~/components/dialog-upload.vue'
export default {
  props: {
    value: {},
    label: {
      type: String,
      default: 'Konten'
    },
    isText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      config: {
        plugins: {
          resizimg: {
            minSize: 64,
            step: 16
          }
        },
        autogrow: true,
        removeformatPasted: true,
        btnsAdd: ['foreColor', 'backColor'],
        btnsDef: {
          bankImage: {
            fn: () => (this.dialog = true),
            text: 'Insert Image from Media',
            ico: 'insertImage'
          },
          image: {
            dropdown: ['bankImage', 'insertImage'],
            ico: 'insertImage'
          }
        },
        btns: this.showButton(),
        semantic: {
          div: 'div'
        }
      }
    }
  },
  methods: {
    changeImage(value) {
      if (value) {
        $('#my-editor').trumbowyg('execCmd', {
          cmd: 'insertImage',
          param: process.env.API_URL + value,
          forceCss: false,
          skipTrumbowyg: true
        })
      }
    },
    showButton() {
      if (this.isText) {
        return [
          ['undo', 'redo'],
          ['strong', 'em', 'del'],
          ['superscript', 'subscript'],
          ['fontsize', 'formatting', 'removeformat', 'lineheight'],
          ['foreColor', 'backColor'],
          ['fullscreen']
        ]
      } else {
        return [
          ['viewHTML'],
          ['undo', 'redo'],
          ['table'],
          ['strong', 'em', 'del'],
          ['superscript', 'subscript'],
          ['link'],
          ['image'],
          ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
          ['unorderedList', 'orderedList'],
          ['horizontalRule'],
          ['fontsize', 'formatting', 'removeformat', 'lineheight'],
          ['foreColor', 'backColor'],
          ['fullscreen']
        ]
      }
    }
  },
  computed: {
    isi: {
      get() {
        return this.value
      },
      set(model) {
        this.$emit('input', model)
      }
    }
  },
  components: {
    'dialog-upload': DialogUpload
  }
}
</script>
<style>
.trumbowyg-box,
.trumbowyg-editor {
  min-height: 150px;
}
</style>
