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
                  <v-icon class="mr-2">mdi-lock-reset</v-icon>Pulihkan Kata Sandi
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-subheader
                  class="mb-5 pa-1"
                >Masukkan email Anda dan kami akan mengirimkan kode verifikasi untuk mengatur ulang kata sandi Anda.</v-subheader>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  :disabled="isLoading"
                  label="Email Pendaftaran"
                  dense
                  type="email"
                  v-model="form.username"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-5">
                <v-btn
                  block
                  color="primary"
                  @click="sendEmail()"
                  :disabled="isLoading || form.username == ''"
                >Kirim Email</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card elevation="2" :disabled="isLoading" class="custom-login-form mt-5">
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
import { mapMutations } from "vuex";
export default {
  auth: "guest",
  layout: "blank",
  data() {
    return {
      form: {
        username: "",
        password: "",
        grant_type: "password",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      },
      show: {
        password: false
      },
      isLoading: false
    };
  },

  methods: {
    ...mapMutations("snackbar", ["setSnackbar", "setText"]),

    sendEmail() {
      this.isLoading = true;

      this.$axios
        .post("api/web/perusahaan/reset-password/send", {
          email: this.form.username
        })
        .then(response => {
          if (response.data.status) {
            this.$router.push({
              path: "/pulihkan/verifikasi",
              query: {
                t: response.data.token
              }
            });
          } else {
            this.setSnackbar(true);
            this.setText("Email yang Anda masukkan tidak terdaftar");
          }
        })
        .catch(error => {
          this.setSnackbar(true);
          this.setText(error.response.status);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
