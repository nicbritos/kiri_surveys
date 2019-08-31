<template>
  <v-card hover style="cursor: default" class="mx-auto" max-width="344">
    <v-card-text v-ripple style="cursor: pointer" @click="goToRoute">
      <div>Workshop</div>
      <p class="display-1 text--primary">
        {{ value }}
      </p>
      <div class="text--primary">
        {{ date != null ? date : "No date set" }}<br />
      </div>
      <div class="text--secondary">{{ responsesQuantityString }}</div>
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
  name: "Workshop",
  props: {
    value: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    },
    workshopId: {
      type: String,
      required: true
    }
  },
  computed: {
    responsesQuantityString() {
      return (
        (this.quantity == 0 ? "No" : this.quantity) +
        (this.quantity == 1 ? " response" : " responses")
      );
    }
  },
  methods: {
    goToRoute() {
      this.$router.push(this.getRoute());
    },
    getRoute() {
      return this.$router.currentRoute.path + "/" + this.workshopId;
    }
  }
};
</script>

<style scoped></style>
