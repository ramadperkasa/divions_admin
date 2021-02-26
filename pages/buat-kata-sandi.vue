<template>
  <v-container fluid :fill-height="!$device.isMobile" height="100%">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" class="pr-10" v-if="!$device.isMobile">
        <img src="graphic1.svg" />
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="2" :disabled="isLoading">
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
                <h1>Buat Kata Sandi</h1>
                <br />
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
        <v-card elevation="2" class="mt-5" :disabled="isLoading">
          <v-container class="pa-5">
            <v-row align="center" jusitfy="center" no-gutters>
              <v-col cols="12">
                <center>
                  Sudah Punya Akun?
                  <nuxt-link to="/login" style="text-decoration: none">Masuk</nuxt-link>
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
      status: ""
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
        .post("api/perusahaan/buat-kata-sandi", this.form)
        .then(response => {
          const status = response.data.status;
          this.status = status;

          if (status == 1) {
            this.login({
              username: response.data.email,
              password: this.form.password
            }).then(response => {
              if (response) {
                this.$router.push("/permohonan");
              } else {
                this.isLoading = false;
              }
            });
          } else if (status == 2) {
            this.setText("Akun sudah aktif");
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
    }
  },

  computed: {
    ...mapState({
      errors: state => state.errors
    })
  }
};
</script> 