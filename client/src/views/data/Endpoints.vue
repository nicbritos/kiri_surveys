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

    <v-container fluid dense>
      <v-row dense class="mt-n4">
        <v-col>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="auto" :hidden="selectedItems.length === 0">
          <v-btn class="error" @click="deleteSelectedOpen"
          >DELETE SELECTED</v-btn
          >
        </v-col>
      </v-row>
      <v-row dense class="mb-n8">
        <v-col>
          <v-select
                  dense
                  chips
                  label="Add Filters"
                  multiple
                  solo
                  :items="filterChips"
                  clearable
                  deletable-chips
                  @change="chipFilterAdded"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-container>


    <v-container fluid>
      <v-row>
        <v-col cols="4" v-for="item in filteredItems" :key="item.id">
          <Endpoint
            :value="item.n"
            :description="item.d"
            :quantity="item.q"
            :endpointId="item.id"
            :selected="selectedItems.includes(item)"
            @update="processSelection(item, $event)"
          ></Endpoint>
        </v-col>
      </v-row>
    </v-container> </v-container
></template>

<script>
import Endpoint from "@/components/Endpoint";
export default {
  name: "Endpoints",
  components: { Endpoint },
  data() {
    return {
      search: "",
      items: [],
      selectedItems: []
    };
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(endpoint => {
        return endpoint.n.toUpperCase().match(this.search.trim().toUpperCase());
      });
    }
  },
  async created() {
    this.$store.state.loading = true;

    await this.$store.state.dataStore.loadEndpoints();
    this.items = this.$store.state.dataStore.getEndpoints();

    this.$store.state.loading = false;
  },
  methods: {
    processSelection(item, isSelected) {
      if (isSelected) this.selectedItems.push(item);
      else this.selectedItems = this.selectedItems.filter(i => i !== item);
    }
  }
};
</script>

<style scoped></style>
