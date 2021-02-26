<template>
  <v-container fluid :fill-height="!$device.isMobile" height="100%">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" class="pr-10" v-if="!$device.isMobile">
        <img src="/images/verification-account.png" width="100%" />
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

          <v-container class="pa-5">
            <v-row align="center" justify="center" no-gutters class="pa-2">
              <v-col cols="12">
                <v-alert color="primary" dark class="title">
                  <v-icon class="mr-2">mdi-shield-check</v-icon>Verifikasi Akun
                </v-alert>
              </v-col>
              <v-col cols="12">
                <p
                  class="text-left"
                >Untuk dapat menggunakan akun baru, diharuskan melakukan verifikasi akun. Kode verifikasi sudah kami kirim ke alamat email anda, silahkan cek email untuk melihat kode verifikasi.</p>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  class="verifiy-code-input centered-input"
                  v-mask="mask"
                  v-model="kode"
                  label="Kode Verifikasi"
                  placeholder="* * * * * *"
                  :disabled="isLoading"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="4">
                <center>Atau</center>
              </v-col>
              <v-col cols="4">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" class="pt-5 text-center">
                <div v-if="!isCountDown && !isLoading">
                  Belum mendapatkan email?
                  <a @click="resend()" style="text-decoration: none">
                    Kirim Ulang
                    <v-icon>mdi-email-sync-outline</v-icon>
                  </a>
                </div>
                <div v-else-if="!isCountDown && isLoading">Harap tunggu...</div>
                <div v-else>
                  Silahkan tunggu
                  <b class="red--text">{{ countDown }} detik</b> untuk mengirim ulang.
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card class="custom-login-form mt-5" elevation="2" :disabled="isLoading">
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
import { mask } from "vue-the-mask";

export default {
  auth: "guest",
  directives: { mask },
  layout: "blank",
  data() {
    return {
      countDown: 60,
      isCountDown: false,
      isLoading: false,
      kode: "",
      mask: "# # # # # #",
      status: 1
    };
  },

  methods: {
    ...mapMutations("snackbar", ["setSnackbar", "setText"]),

    resend() {
      this.isLoading = true;
      this.$axios
        .post("api/web/web/perusahaan/reset-password/resend", {
          token_resend: this.$route.query.t
        })
        .then(response => {
          if (response.data.status) {
            this.setText("Verifikasi berhasil dikirim ulang!");
          } else {
            this.setText("Verifikasi gagal dikirim ulang!");
          }
        })
        .catch(error => {
          this.setText(error.response.status);
        })
        .finally(() => {
          this.setSnackbar(true);
          this.isCountDown = true;
          this.isLoading = false;
          this.countDownTimer();
        });
    },

    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      } else {
        this.isCountDown = false;
        this.countDown = 60;
      }
    },

    verifikasi() {
      this.isLoading = true;

      this.$axios
        .post("api/web/perusahaan/reset-password/verifikasi", {
          token_resend: this.$route.query.t,
          code: this.kode
        })
        .then(response => {
          const status = response.data.status;
          this.status = status;

          if (status == 1) {
            this.$router.push({
              path: "/pulihkan/atur-ulang",
              query: {
                t: this.$route.query.t
              }
            });
          } else if (status == 2) {
            this.setText("Kode verifikasi tidak sesuai");
          } else {
            this.setText(
              "Terjadi suatu kesalahan! Silahkan coba beberapa saat lagi"
            );
          }
        })
        .catch(error => {
          if (error.response) {
            this.setText(error.response.status);
            this.setSnackbar(true);
          }
        })
        .finally(() => {
          this.isLoading = false;

          if (this.status != 1) {
            this.setSnackbar(true);
          }
        });
    }
  },

  watch: {
    kode(newValue) {
      if (newValue.length == 11) {
        this.verifikasi();
      }
    }
  }
};
</script>

<style>
.centered-input input {
  text-align: center;
}
</style>

