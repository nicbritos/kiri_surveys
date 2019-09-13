<template>
  <v-container grid-list-md>
    <Breadcrumbs :items="breadcrumbs"></Breadcrumbs>
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
            :value="item.n"
            :date="item.d"
            :quantity="item.q"
            :workshopId="item.id"
          ></Workshop>
        </v-col>
        <v-col v-if="filteredItems.length === 0">
          <v-row align="center" justify="center">
            <NoItemsComponent
              type="Workshop"
              :isSearch="search !== ''"
            ></NoItemsComponent>
          </v-row>
        </v-col>
      </v-row>
    </v-container> </v-container
></template>

<script>
import NoItemsComponent from "@/components/NoItemsComponent";
import Breadcrumbs from "@/components/Breadcrumbs";
import Workshop from "@/components/Workshop";
import routes from "@/router/routes";

export default {
  name: "Workshops",
  components: { Workshop, Breadcrumbs, NoItemsComponent },
  data() {
    return {
      search: "",
      breadcrumbs: [Object.assign({}, routes.breadcrumbs.endpoints)]
    };
  },
  async created() {
    this.$store.state.loading = true;

    await this.$store.state.dataStore.loadEndpoints();
    let endpoint = this.$store.state.dataStore.getEndpointByID(
      this.$router.currentRoute.params.eid
    );
    await this.$store.state.dataStore.loadWorkshops(endpoint.id);

    let thisBreadcrumb = Object.assign({}, routes.breadcrumbs.sample);
    thisBreadcrumb.disabled = true;
    thisBreadcrumb.text = endpoint.n;
    this.breadcrumbs.push(thisBreadcrumb);

    this.$store.state.loading = false;
  },
  computed: {
    filteredItems() {
      return this.items.filter(workshop => {
        return workshop.n
          .toUpperCase()
          .match(this.search.trim().toUpperCase());
      });
    },
    items() {
      let endpoint = this.$store.state.dataStore.getEndpointByID(
        this.$router.currentRoute.params.eid
      );

      if (endpoint != null) {
        let workshops = this.$store.state.dataStore.getWorkshops(endpoint.id);
        if (workshops == null) {
          return [];
        }
        return workshops;
      }

      return [];
    }
  }
};
</script>

<style scoped></style>
