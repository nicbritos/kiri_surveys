<template>
  <v-container grid-list-md>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <h2>
          Workshops
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
          <Workshop
            :value="item.name"
            :date="item.date"
            :quantity="item.quantity"
            :workshopId="item.id"
          ></Workshop>
        </v-col>
      </v-row>
    </v-container> </v-container
></template>

<script>
import Workshop from "../../components/Workshop";
export default {
  name: "Workshops",
  components: { Workshop },
  data() {
    return {
      items: [],
      search: ""
    };
  },
  created() {
    let endpointId = this.$router.currentRoute.params.eid;
    if (this.$store.state.workshops[endpointId] == null)
      this.$store.state.workshops[endpointId] = [];

    this.items = this.$store.state.workshops[endpointId];
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
