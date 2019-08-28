<template>
  <v-layout>
    <v-flex>
      <div class="qr">
        <qr-code :text="value"></qr-code>
      </div>
      <qrcode-stream @decode="onDecode"></qrcode-stream>

      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-text>
            {{ decodedMsg }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">
              CERRAR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    value: `{"message": "Hola, todo bien?"}`,
    dialog: false,
    decodedMsg: ""
  }),
  methods: {
    onDecode(string) {
      this.decodedMsg = string;
      this.dialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.qr {
  padding: 100px;
}
</style>
