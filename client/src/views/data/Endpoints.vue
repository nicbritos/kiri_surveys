<template>
  <v-container grid-list-md>
    <v-dialog v-model="dialogs.items.new" max-width="700px">
      <v-card>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">New Endpoint</h1>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="newItem.n"
                  label="Name"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="newItem.d"
                  label="Description"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog(dialogs.items, 'new')"
            v-blur
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="newItemClose" v-blur
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.items.edit" max-width="700px">
      <v-card>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">Edit Endpoint</h1>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="editedItemCopy.n"
                  label="Name"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="editedItemCopy.d"
                  label="Description"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog(dialogs.items, 'edit')"
            v-blur
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="editItemClose" v-blur
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.selected.delete" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Are you sure you want to delete
            <span class="red--text">{{ selectedItems.length }}</span>
            Endpoint{{ selectedItems.length > 1 ? "s" : "" }}?</span
          >
        </v-card-title>
        <v-card-text>
          <span class="subtitle-1 red--text"
            >This action cannot be undone.</span
          >
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            v-blur
            @click="closeDialog(dialogs.selected, 'delete')"
          >
            CANCEL
          </v-btn>
          <v-btn text color="error" v-blur @click="deleteSelectedClose">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

      <v-btn
        color="primary"
        dark
        class="ml-3 mb-2"
        v-on="on"
        v-blur
        @click="newItemOpen"
        >NEW ENDPOINT</v-btn
      >
    </v-toolbar>

    <v-container fluid dense v-if="selectedItems.length !== 0">
      <v-row dense class="mt-n4 mb-n7">
        <v-col>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="auto">
          <v-btn
            v-blur
            class="primary"
            @click="exportSelectedOpen"
            :loading="loadingExport"
            >EXPORT SELECTED</v-btn
          >
        </v-col>
        <v-col cols="auto">
          <v-btn v-blur class="error" @click="deleteSelectedOpen"
            >DELETE SELECTED</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col cols="4" v-for="item in filteredItems" :key="item.id">
          <Endpoint
            :value="item.n"
            :description="item.d"
            :endpointId="item.id"
            :selected="selectedItems.includes(item)"
            @update="processSelection(item, $event)"
            @edit="editItemOpen(item)"
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
      newItem: {},
      editedItemCopy: {},
      defaultEndpoint: {
        name: "",
        description: ""
      },
      dialogs: {
        items: {
          new: false,
          edit: false
        },
        selected: {
          delete: false
        }
      },
      selectedItems: [],
      loadingExport: false
    };
  },
  computed: {
    filteredItems: function() {
      return this.items.filter(endpoint => {
        return endpoint.n.toUpperCase().match(this.search.trim().toUpperCase());
      });
    }
  },
  async mounted() {
    this.$store.state.loading = true;

    this.items = await this.$store.state.dataStore.getEndpoints();

    this.$store.state.loading = false;
  },
  methods: {
    newItemOpen() {
      this.newItem = Object.assign({}, this.defaultEndpoint);
      this.openDialog(this.dialogs.items, "new");
    },
    newItemClose() {
      // Save to DB
      this.closeDialog(this.dialogs.items, "new");
    },

    editItemOpen(item) {
      this.editedItemCopy = Object.assign({}, item);
      this.openDialog(this.dialogs.items, "edit");
    },
    editItemClose() {
      // Save to DB
      this.closeDialog(this.dialogs.items, "edit");
    },

    deleteSelectedOpen() {
      this.openDialog(this.dialogs.selected, "delete");
    },
    deleteSelectedClose() {
      this.selectedItems = [];
      this.closeDialog(this.dialogs.selected, "delete");
    },

    openDialog(item, type) {
      if (item == null || type == null || item[type] == null) return;
      if (!item[type]) item[type] = true;
    },
    closeDialog(item, type) {
      if (item == null || type == null || item[type] == null) return;
      if (item[type]) item[type] = false;
    },

    processSelection(item, isSelected) {
      if (isSelected) this.selectedItems.push(item);
      else this.selectedItems = this.selectedItems.filter(i => i !== item);
    },

    async exportSelectedOpen() {
      this.loadingExport = true;

      let endpointIds = [];
      for (let item of this.selectedItems) {
        endpointIds.push(item.id);
      }

      await this.$store.state.dataStore.exportEndpoints(
        {
          sheets: ["rdata", "graphs", "workshops"]
        },
        await this.$store.state.dataStore.getQuestions(),
        endpointIds
      );
      this.selectedItems = [];

      this.loadingExport = false;
    }
  }
};
</script>

<style scoped></style>
