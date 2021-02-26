<template>
  <v-dialog v-model="showDialogDestroy" persistent max-width="400">
    <v-card>
      <v-card-title class="headline">Konfirmasi</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="2"><v-icon large class="vc">mdi-information</v-icon></v-col>
          <v-col cols="10"
            ><span>Anda yakin untuk menghapus <strong>{{$store.state.tableItems.length}}</strong> data yang anda seleksi ? <br> Jika data yang anda pilih memiliki keterkaitan maka data akan terhapus </span></v-col
          >
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          :disabled="isLoading"
          :loading="isLoading"
          @click="setDialogDestroys(false)"
          >Tidak</v-btn
        >

        <v-btn
          color="primary"
          text
          :disabled="isLoading"
          :loading="isLoading"
          @click="destroysData()"
          >Ya</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  methods: {
    ...mapActions(['destroysData']),
    ...mapMutations(['setDialogDestroys'])
  },

  computed: {
    ...mapState({
      showDialogDestroy: state => state.showDialogDestroys,
      isLoading: state => state.isLoadingDestroys
    })
  }
}
</script>
<style>
.vc {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>

