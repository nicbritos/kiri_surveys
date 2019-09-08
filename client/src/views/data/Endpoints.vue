<template>
  <v-container grid-list-md>
    <Breadcrumbs class="mb-4" :items="breadcrumbs"></Breadcrumbs>
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
        clearable
      ></v-text-field>


      <v-btn color="primary" dark class="ml-3 mb-2" v-on="on" v-blur
      >NEW ENDPOINT</v-btn
      >

<!--      <v-dialog v-model="dialog" max-width="500px">-->
<!--        <template v-slot:activator="{ on }"> </template>-->
<!--        <v-card>-->
<!--          <v-card-text>-->
<!--            <v-container grid-list-md>-->
<!--              <v-layout wrap>-->
<!--                <v-flex xs12 sm6 md4>-->
<!--                  <v-text-field-->
<!--                          v-model="editedItemCopy.name"-->
<!--                          label="Name"-->
<!--                  ></v-text-field>-->
<!--                </v-flex>-->
<!--                <v-flex xs12 sm6 md4>-->
<!--                  <v-checkbox-->
<!--                          v-model="editedItemCopy.feedback"-->
<!--                          label="Feedback"-->
<!--                  ></v-checkbox>-->
<!--                </v-flex>-->
<!--                <v-flex xs12 sm6 md4>-->
<!--                  <v-checkbox-->
<!--                          v-model="editedItemCopy.measurable"-->
<!--                          label="Measurable"-->
<!--                          :disabled="editedItemCopy.answered"-->
<!--                  ></v-checkbox>-->
<!--                </v-flex>-->
<!--                <v-flex xs12 sm6 md4>-->
<!--                  <v-checkbox-->
<!--                          v-model="editedItemCopy.answered"-->
<!--                          label="Answered"-->
<!--                          :disabled="true"-->
<!--                  ></v-checkbox>-->
<!--                </v-flex>-->
<!--              </v-layout>-->
<!--            </v-container>-->
<!--          </v-card-text>-->

<!--          <v-card-actions>-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn color="blue darken-1" text @click="close" v-blur-->
<!--            >Cancel</v-btn-->
<!--            >-->
<!--            <v-btn color="blue darken-1" text @click="save" v-blur>Save</v-btn>-->
<!--          </v-card-actions>-->
<!--        </v-card>-->
<!--      </v-dialog>-->
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
    </v-container> </v-container
></template>

<script>
import Endpoint from "../../components/Endpoint";
export default {
  name: "Endpoints",
  components: { Endpoint },
  data() {
    return {
      search: "",
      items: this.$store.state.dataStore.getEndpoints()
    };
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(endpoint => {
        return endpoint.name.toUpperCase().match(this.search.trim().toUpperCase());
      });
    }
  }
};
</script>

<style scoped></style>
