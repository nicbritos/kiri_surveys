<template>
  <v-container grid-list-md>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        <h2>
          Users
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
    </v-toolbar>
    <v-container fluid>
      <v-row>
        <v-col cols="4" v-for="item in filteredItems" :key="item.id">
          <User
            :name="item.n"
            :email="item.d"
            :tier="item.t"
          ></User>
        </v-col>
      </v-row>
    </v-container> </v-container
></template>

<script>
import User from "@/components/User";
export default {
  name: "Users",
  components: { User },
  data() {
    return {
      search: "",
      items: this.$store.state.dataStore.getUsers()
    };
  },
  async created() {
    this.$store.state.loading = true;

    await this.$store.state.dataStore.loadUsers();

    this.$store.state.loading = false;
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(endpoint => {
        return endpoint.n.toUpperCase().match(this.search.trim().toUpperCase());
      });
    }
  }
};
</script>

<style scoped></style>
