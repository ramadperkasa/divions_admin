<template>
  <v-app>
    <div
      class="fb-like"
      data-share="true"
      data-width="450"
      data-show-faces="true"
    ></div>
    <v-navigation-drawer
      class="back-app-drawer"
      v-model="drawer"
      fixed
      app
      :expand-on-hover="minibar"
      :right="rightmenu"
      :mini-variant="minibar"
    >
      <v-list>
        <v-list-item
          class="back-app-drawer-header"
          style="background-color:#2a327c !important; border-bottom: 4px solid #fbcc36 !important; margin-bottom: 20px !important;padding-left: 8px !important"
          two-line
        >
          <v-list-item-avatar>
            <img
              :src="
                $auth.user.foto
                  ? env + $auth.user.foto
                  : 'https://randomuser.me/api/portraits/men/81.jpg'
              "
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ $auth.user.nama }}</v-list-item-title>
            <v-list-item-subtitle>{{ $auth.user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list class="mb-5">
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-office-building</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ brand_name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense nav>
        <div v-for="item in items" :key="item.title">
          <div v-if="item.items.length > 0">
            <v-list-group
              v-if="authenticate(item.name)"
              class="back-app-drawer-list"
              :prepend-icon="item.icon"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>
              <template v-for="subItem in item.items">
                <v-list-item
                  v-if="manage(subItem.name)"
                  :key="subItem.title"
                  :to="subItem.to.replace('{uuid}', $store.state.app.app)"
                  router
                >
                  <v-list-item-title v-text="subItem.title"></v-list-item-title>
                  <v-list-item-action>
                    <v-icon v-text="subItem.icon"></v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-group>
          </div>
          <div v-else>
            <v-list-item
              v-if="manage(item.name)"
              :to="item.to.replace('{uuid}', $store.state.app.app)"
              router
              exact
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </div>
        </div>
        <div class="apps-logo">
          <!-- <img class="apps-logo-img" src="/images/logosolidbodas.png" aspect-ratio="1" width="95%" /> -->
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="back-app-toolbar" fixed app>
      <v-btn v-if="drawer == true" icon @click.stop="minibar = !minibar">
        <v-icon v-if="minibar == false">mdi-chevron-left</v-icon>
        <v-icon v-if="minibar == true">mdi-chevron-right</v-icon>
      </v-btn>
      <v-divider
        v-if="drawer == true"
        class="ml-1 mr-1"
        inset
        vertical
      ></v-divider>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="$store.state.title" />
      <template>
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="$router.push('/')">
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

      <v-spacer></v-spacer>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-menu
        class="back-app-toolbar-menu"
        bottom
        :offset-y="true"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account-cog-outline</v-icon>
          </v-btn>
        </template>

        <v-list class="back-app-toolbar-menu" dense>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img
                :src="
                  $auth.user.foto
                    ? env + $auth.user.foto
                    : 'https://randomuser.me/api/portraits/men/81.jpg'
                "
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ $auth.user.nama }}</v-list-item-title>
              <v-list-item-subtitle>{{
                $auth.user.email
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            v-if="manage(item.name)"
            @click="
              $router.push(item.to.replace('{uuid}', $store.state.app.app))
            "
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="rightmenu = !rightmenu">
            <v-list-item-action>
              <v-icon v-if="rightmenu == true">mdi-backburger</v-icon>
              <v-icon v-if="rightmenu == false">mdi-forwardburger</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                v-if="rightmenu == false"
                v-text="'Right Menu'"
              />
              <v-list-item-title
                v-if="rightmenu == true"
                v-text="'Left Menu'"
              />
            </v-list-item-content>
          </v-list-item>
          <a :href="um" target="_blank" style="text-decoration: none">
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-account-cog</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="'User Management'" />
              </v-list-item-content>
            </v-list-item>
          </a>
          <v-divider></v-divider>
          <v-list-item @click="logout()">
            <v-list-item-action>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Keluar'" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <snackbar></snackbar>
    <v-footer class="back-app-footer" :fixed="true" app>
      <span
        >&copy; Copyright 2020 - {{ new Date().getFullYear() }} - PT SUGIH
        INSTRUMENDO ABADI
      </span>
      <v-spacer></v-spacer>
      <img
        alt="DIPOINTER"
        class="opacity-5 m-0 pr-2"
        height="15"
        src="data:image/png;base64,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"
      />
      <span>Support By Dipointer - Make IT Easy</span>
    </v-footer>
    <dialog-destroy></dialog-destroy>
    <dialog-destroys></dialog-destroys>
    <dialog-image></dialog-image>
  </v-app>
</template>

<script>
import Snackbar from '~/components/alert-snackbar.vue'
import DialogImage from '~/components/dialog-image.vue'
import DialogDestroy from '~/components/alert-destroy.vue'
import DialogDestroys from '~/components/alert-destroys.vue'
export default {
  data() {
    return {
      env: process.env.API_URL,
      um: process.env.UM_URL,
      drawer: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Setting Halaman',
          to: '/brand/{uuid}/setting-beranda',
          name: [
            'read-brand-uuid-slider',
            'read-brand-uuid-setting-beranda',
            'read-brand-uuid-setting-layout'
          ],
          items: [
            {
              icon: 'mdi-view-carousel',
              title: 'Slider',
              to: '/brand/{uuid}/slider',
              name: 'read-brand-uuid-slider'
            },
            {
              icon: 'mdi-desktop-mac-dashboard',
              title: 'List Block Konten',
              to: '/brand/{uuid}/setting-beranda',
              name: 'read-brand-uuid-setting-beranda'
            },
            {
              icon: 'mdi-cog-transfer-outline',
              title: 'Setting Layout',
              to: '/brand/{uuid}/setting-layout',
              name: 'read-brand-uuid-setting-layout'
            }
          ]
        },
        {
          icon: 'mdi-contacts',
          title: 'Kontak',
          to: '/brand/{uuid}/kontak',
          name: 'read-brand-uuid-kontak',
          items: []
        },
        {
          icon: 'mdi-pot-mix',
          title: 'Product',
          to: '',
          name: ['read-brand-uuid-product', 'read-brand-uuid-product-kategori'],
          items: [
            {
              icon: 'mdi-clipboard-text-outline',
              title: 'List Product',
              to: '/brand/{uuid}/product',
              name: 'read-brand-uuid-product'
            },
            {
              icon: 'mdi-format-list-checkbox',
              title: 'Category Product',
              to: '/brand/{uuid}/product/kategori',
              name: 'read-brand-uuid-product-kategori'
            },
            {
              icon: 'mdi-format-color-fill',
              title: 'Variant Product',
              to: '/brand/{uuid}/product/warna',
              name: 'read-brand-uuid-product-warna'
            }
          ]
        },
        {
          icon: 'mdi-folder-upload-outline',
          title: 'Uploads',
          to: '',
          name: ['read-brand-uuid-uploads', 'read-brand-uuid-uploads-folder'],
          items: [
            {
              icon: 'mdi-image-multiple-outline',
              title: 'List Uploads',
              to: '/brand/{uuid}/uploads',
              name: 'read-brand-uuid-uploads'
            },
            {
              icon: 'mdi-folder-multiple-outline',
              title: 'List Folder',
              to: '/brand/{uuid}/uploads/folder',
              name: 'read-brand-uuid-uploads-folder'
            }
          ]
        }
      ],
      menuItems: [
        {
          icon: 'mdi-lock-open-alert',
          name: 'pengaturan',
          title: 'Ubah Password',
          to: '/pengaturan'
        },
        {
          icon: 'mdi-cog',
          name: 'kelola',
          title: 'Kelola Akun Anda',
          to: '/kelola'
        }
      ],
      brand_name: '',
      title: 'Dashboard',
      rightmenu: false,
      minibar: false
    }
  },

  components: {
    Snackbar,
    DialogImage,
    DialogDestroy,
    DialogDestroys
  },
  mounted() {
    this.getPermission()
    this.getNameBrand()
  },
  methods: {
    async logout() {
      let response = await this.$auth.logout()

      this.$auth.$storage.removeCookie('auth_newsportal')
    },
    getNameBrand() {
      this.$axios
        .get('/api/web/brand/get-uuid', {
          params: {
            id: this.$route.params.uuid
          }
        })
        .then(response => {
          this.brand_name = response.data.data.nama_brand
        })
    },
    getPermission(params) {
      this.$store.dispatch('getPermission', this.$route.name)
    },
    manage(params) {
      if (this.$auth.user.all_permissions != null) {
        var data = this.$auth.user.all_permissions.includes(params)
      } else {
        var data = false
      }
      return data
    },
    authenticate(value) {
      var data = this.$auth.user.all_permissions.filter(f => {
        return value.includes(f)
      })
      if (data.length > 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style>
.btn-vertical {
  height: 100px;
  width: 100px;
  text-align: center;
}
.btn-vertical:hover {
  background-color: red;
}
.bg-red {
  background-color: red;
}
</style>
