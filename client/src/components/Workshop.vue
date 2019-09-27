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
      <v-menu
        class="mr-4"
        :close-on-content-click="false"
        min-width="400"
        offset-y
        offset-overflow
      >
        <template v-slot:activator="{ on }">
          <v-badge overlap class="align-self-center">
            <template v-slot:badge>
              <span>2</span>
            </template>
            <v-btn icon color="primary" v-on="on" v-blur @click="onShare()">
              <v-icon>group</v-icon>
            </v-btn>
          </v-badge>
        </template>
        <v-select
          class="pa-0 ma-0"
          dense
          chips
          label="Add Users"
          multiple
          solo
          :items="['a', 'b']"
          clearable
          deletable-chips
          full-width
          @change="chipFilterAdded"
        >
        </v-select>
      </v-menu>
      <v-btn icon color="primary" v-blur @click="onEdit()">
        <v-icon>create</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  name: "Workshop",
  model: {
    events: ["update", "edit", "share"]
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
      if (this.date == null) return "Date not set";
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
    },
    onEdit() {
      this.$emit("edit", "");
    },
    onShare() {
      this.$emit("share", "");
    }
  }
};
</script>

<style scoped></style>
