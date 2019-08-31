<template>
  <v-container grid-list-md>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <h2>
          Endpoints
        </h2>
      </v-toolbar-title>
      <v-text-field
        hide-details
        prepend-icon="search"
        single-line
        class="ml-3"
        placeholder="Start typing to Search"
        v-model="search"
      ></v-text-field>
      <v-btn icon v-blur v-if="search.length > 0" @click="search = ''">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-row>
        <v-col cols="4" v-for="item in filteredItems" :key="item.id">
          <Endpoint
            :value="item.name"
            :description="item.description"
            :quantity="item.quantity"
            :endpointId="item.id"
          ></Endpoint>
        </v-col>
      </v-row>
    </v-container>
  </v-container
></template>

<script>
import Endpoint from "../../components/Endpoint";
export default {
  name: "Endpoints",
  components: { Endpoint },
  data() {
    return {
      items: [],
      search: ""
    };
  },
  created() {
    this.items = this.$store.state.endpoints.items;
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(endpoint => {
        return endpoint.name.match(this.search);
      });
    }
  }
};
</script>

<style scoped></style>
