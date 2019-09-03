<template>
  <v-container grid-list-md>
    <v-breadcrumbs class="pl-4 pb-0" large :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
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
        clearable
      ></v-text-field>

      <v-btn color="primary" dark class="ml-3 mb-2" v-on="on" v-blur
        >NEW WORKSHOP</v-btn
      >
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
import Workshop from "@/components/Workshop";
import routes from "@/router/routes";

export default {
  name: "Workshops",
  components: { Workshop },
  data() {
    return {
      items: [],
      search: "",
      breadcrumbs: [Object.assign({}, routes.breadcrumbs.endpoints)]
    };
  },
  created() {
    let endpointId = this.$router.currentRoute.params.eid;
    let text;
    if (this.$store.state.workshops[endpointId] == null) {
      this.$store.state.workshops[endpointId] = [];
      text = "";
    } else {
      text = this.$store.state.__database__.endpoints[endpointId].name;
    }

    this.breadcrumbs.push({
      href: this.$router.currentRoute.path,
      text: text,
      disabled: true
    });
    this.items = this.$store.state.workshops[endpointId];
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(endpoint => {
        return endpoint.name
          .toUpperCase()
          .match(this.search.trim().toUpperCase());
      });
    }
  }
};
</script>

<style scoped></style>
