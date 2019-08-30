<template>
  <v-card hover style="cursor: default" class="mx-auto" max-width="344">
    <v-card-text v-ripple style="cursor: pointer" @click="goToRoute">
      <div>Endpoint</div>
      <p class="display-1 text--primary">
        {{ value }}
      </p>
      <div class="text--primary">{{ description }}<br /></div>
      <div class="text--secondary">{{ workshopsQuantityString }}</div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary">
        Edit
      </v-btn>
      <v-btn text color="red">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Endpoint",
  props: {
    value: String,
    description: String,
    quantity: Number,
    endpointId: String
  },
  computed: {
    workshopsQuantityString() {
      return (
        (this.quantity == 0 ? "No" : this.quantity) +
        (this.quantity == 1 ? " workshop" : " workshops")
      );
    }
  },
  methods: {
    goToRoute() {
      this.$router.push(this.getRoute());
    },
    getRoute() {
      return this.$router.currentRoute.path + "/" + this.endpointId;
    }
  }
};
</script>

<style scoped></style>
