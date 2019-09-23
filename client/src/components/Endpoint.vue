<template>
  <v-card hover style="cursor: default" class="mx-auto" max-width="344">
    <v-img
      v-ripple
      style="cursor: pointer"
      @click="goToRoute"
      class="white--text"
      src="@/assets/endpoint_back_blue.png"
    >
      <v-card-title class="align-end fill-height">{{ value }}</v-card-title>
    </v-img>
    <v-card-text v-ripple style="cursor: pointer" @click="goToRoute">
      <div class="text--primary">{{ description }}<br /></div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-checkbox
        color="primary"
        @change="onChange($event)"
        :input-value="selected"
        hide-details
        dense
        class="ml-2 mt-n1"
      >
      </v-checkbox>
      <v-spacer></v-spacer>
      <v-btn text color="primary">
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Endpoint",
  model: {
    event: "update"
  },
  props: {
    value: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    endpointId: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    goToRoute() {
      this.$router.push(this.getRoute());
    },
    getRoute() {
      return this.$router.currentRoute.path + "/" + this.endpointId;
    },
    onChange(value) {
      this.$emit("update", value);
    }
  }
};
</script>

<style scoped></style>
