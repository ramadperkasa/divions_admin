<template>
  <v-container fluid :fill-height="!$device.isMobile" height="100%">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" class="pr-10" v-if="!$device.isMobile">
        <img src="/graphic1.svg" />
      </v-col>
      <v-col cols="12" md="1" v-if="!$device.isMobile">
        <div class="vl"></div>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="custom-login-form" elevation="2" :disabled="isLoading">
          <v-progress-linear
            :active="isLoading"
            :indeterminate="isLoading"
            absolute
            top
            color="blue darken-1"
          ></v-progress-linear>

          <v-container class="pa-10">
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="12">
                <v-alert color="primary accent-4" dark class="title">
                  <v-icon class="mr-2">mdi-textbox-password</v-icon>Atur Ulang Kata Sandi
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-subheader
                  class="mb-5 pa-1"
                >Masukan password / katasandi untuk ditetapkan ke akun anda, pastikan kata sandi yang dipilih kombinasi angka huruf dan simbol.</v-subheader>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Kata Sandi"
                  dense
                  v-model="form.password"
                  :error="errors.password"
                  :error-messages="errors.password ? errors.password[0] : ''"
                  :type="show.password ? 'text' : 'password'"
                  :append-icon="show.password ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="show.password = !show.password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Konfirmasi Kata Sandi"
                  dense
                  v-model="form.c_password"
                  :error="errors.c_password"
                  :error-messages="errors.c_password ? errors.c_password[0] : ''"
                  :type="show.c_password ? 'text' : 'password'"
                  :append-icon="show.c_password ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="show.c_password = !show.c_password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-5">
                <v-btn color="primary" :disabled="isLoading" @click="simpan()" outlined block>Simpan</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card elevation="2" class="mt-5 custom-login-form" :disabled="isLoading ">
          <v-container class="pa-5">
            <v-row align="center" jusitfy="center" no-gutters>
              <v-col cols="12">
                <center>
                  <nuxt-link to="/login" style="text-decoration: none">
                    <v-icon class="mr-2">mdi-arrow-left-circle</v-icon>Kembali ke halaman masuk
                  </nuxt-link>
                </center>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  auth: "guest",
  layout: "blank",
  data() {
    return {
      form: {
        password: "",
        c_password: "",
        token: ""
      },
      show: {
        password: false,
        c_password: false
      },
      isLoading: false,
      status: "",
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "password",
        username: "",
        password: "",
        provider: "users"
      }
    };
  },

  created() {
    this.form.token = this.$route.query.t;
  },

  methods: {
    ...mapMutations(["setErrors"]),
    ...mapMutations("snackbar", ["setSnackbar", "setText"]),
    ...mapActions(["login"]),

    simpan() {
      this.isLoading = true;

      this.$axios
        .post("api/web/admin/reset-password", this.form)
        .then(response => {
          const status = response.data.status;
          this.status = status;

          if (status == 1) {
            this.data.username = response.data.email;
            this.data.password = this.form.password;
            this.userLogin();
          } else {
            this.setText(
              "Terjadi suatu kesalahan! Silahkan coba beberapa saat lagi"
            );
          }
        })
        .catch(error => {
          if (error.response.status == 422) {
            this.setErrors(error.response.data.errors);
          } else {
            this.setErrors({});
            this.setText(error.response.status);
          }
        })
        .finally(() => {
          if (this.status != 1) {
            this.isLoading = false;
            this.setSnackbar(true);
          }
        });
    },

    async userLogin() {
      this.isLoading = true;
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.data
        });

        this.$auth.$storage.setCookie(
          "auth_newsportal",
          "Bearer" + response.data.access_token,
          false
        );

        this.$router.push("/berita");
      } catch (err) {
        if (err.response.status == 400) {
          this.setText(
            "Nama pengguna atau kata sandi yang anda masukkan salah"
          );
        } else {
          this.setText(err.response.status);
        }

        this.isLoading = false;
        this.setSnackbar(true);
      }
    }
  },

  computed: {
    ...mapState({
      errors: state => state.errors
    })
  }
};
</script>
