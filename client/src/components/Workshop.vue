<template>
  <v-card hover style="cursor: default" class="mx-auto" max-width="344">
    <v-img
      v-ripple
      style="cursor: pointer"
      @click="goToRoute"
      class="white--text"
      src="@/assets/workshop_back_blue.png"
    >
      <v-card-title class="align-end fill-height">{{ value }}</v-card-title>
    </v-img>

    <v-card-text v-ripple style="cursor: pointer" @click="goToRoute">
      <div class="text--primary">{{ dateString }}<br /></div>
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
import moment from "moment";

export default {
  name: "Workshop",
  model: {
    event: "update"
  },
  props: {
    value: {
      type: String,
      required: true
    },
    date: {
      type: Object,
      required: false
    },
    workshopId: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dateString() {
      if (this.date == null) return "No date set";
      // moment.locale("en");
      return moment(new Date(this.date.y, this.date.m, this.date.d)).format(
        "dddd, MMMM Do YYYY"
      );
    }
  },
  methods: {
    goToRoute() {
      this.$router.push(this.getRoute());
    },
    getRoute() {
      return this.$router.currentRoute.path + "/" + this.workshopId;
    },
    onChange(value) {
      this.$emit("update", value);
    }
  }
};
</script>

<style scoped></style>
