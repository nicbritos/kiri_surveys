<template>
  <v-container grid-list-md>
      <v-card-title> <h2>
          Endpoints
      </h2>
      </v-card-title>
    <v-container fluid >
      <v-row >
        <v-col cols="4" v-for="item in items" :key="item.name">
<!--          <v-row >-->
            <Endpoint
              :value="item.name"
              :description="item.description"
            ></Endpoint>
<!--          </v-row>-->
        </v-col>
      </v-row> </v-container></v-container
></template>

<script>
import Endpoint from "../components/Endpoint";
export default {
  name: "Endpoints",
  components: { Endpoint },
  computed: {
    items() {
      return this.$store.state.endpoints.items;
    }
  }
};
</script>

<style scoped></style>
