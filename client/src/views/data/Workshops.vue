<template>
  <v-container grid-list-md>
    <v-dialog v-model="dialogs.items.new" max-width="700px">
      <v-card>
        <v-img
          class="white--text"
          src="@/assets/workshop_back_blue.png"
          position="top center"
          max-height="300"
        >
        </v-img>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">New Workshop</h1>
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
              <v-col cols="auto">
                <v-menu class="mr-4">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="ma-0 pa-0"
                      color="primary"
                      text
                      v-on="on"
                      v-blur
                    >
                      Pick a date
                    </v-btn>
                  </template>
                  <v-date-picker
                    v-model="newItem.d"
                    label="Date"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="auto">
                <div class="mt-2 text--primary" v-if="newItem.d != null">
                  {{ getDateString(newItem.d) }}
                </div>
                <div class="mt-2 text--secondary" v-else>
                  {{ getDateString(newItem.d) }}
                </div>
              </v-col>
              <v-col cols="auto" v-if="newItem.d != null">
                <v-btn
                  class="ma-0 pa-0"
                  color="primary"
                  icon
                  v-blur
                  @click="newItem.d = null"
                >
                  <v-icon>
                    clear
                  </v-icon>
                </v-btn>
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
        <v-img
          class="white--text"
          src="@/assets/workshop_back_blue.png"
          position="top center"
          max-height="300"
        >
        </v-img>

        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">Edit Workshop</h1>
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
              <v-col cols="auto">
                <v-menu class="mr-4">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="ma-0 pa-0"
                      color="primary"
                      text
                      v-on="on"
                      v-blur
                    >
                      Pick a date
                    </v-btn>
                  </template>
                  <v-date-picker
                    v-model="editedItemCopy.d"
                    label="Date"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="auto">
                <div class="mt-2 text--primary" v-if="editedItemCopy.d != null">
                  {{ getDateString(editedItemCopy.d) }}
                </div>
                <div class="mt-2 text--secondary" v-else>
                  {{ getDateString(editedItemCopy.d) }}
                </div>
              </v-col>
              <v-col cols="auto" v-if="editedItemCopy.d != null">
                <v-btn
                  class="ma-0 pa-0"
                  color="primary"
                  icon
                  v-blur
                  @click="editedItemCopy.d = null"
                >
                  <v-icon>
                    clear
                  </v-icon>
                </v-btn>
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
            Workshop{{ selectedItems.length > 1 ? "s" : "" }}?</span
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

      <v-btn
        color="primary"
        dark
        class="ml-3 mb-2"
        v-on="on"
        v-blur
        @click="newItemOpen"
        >NEW WORKSHOP</v-btn
      >
    </v-toolbar>

    <v-container fluid dense v-if="selectedItems.length !== 0">
      <v-row dense class="mt-n4 mb-n7">
        <v-col>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="auto">
          <v-btn class="primary" @click="exportSelectedOpen"
            >EXPORT SELECTED</v-btn
          >
        </v-col>
        <v-col cols="auto">
          <v-btn class="error" @click="deleteSelectedOpen"
            >DELETE SELECTED</v-btn
          >
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row>
        <v-col cols="4" v-for="item in filteredItems" :key="item.id">
          <Workshop
            :value="item.n"
            :date="item.d"
            :workshopId="item.id"
            :selected="selectedItems.includes(item)"
            @update="processSelection(item, $event)"
            @edit="editItemOpen(item)"
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
import moment from "moment";

export default {
  name: "Workshops",
  components: { Workshop, Breadcrumbs, NoItemsComponent },
  data() {
    return {
      search: "",
      items: [],
      newItem: {},
      editedItemCopy: {},
      defaultItem: {
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
      breadcrumbs: [Object.assign({}, routes.breadcrumbs.endpoints)]
    };
  },
  async mounted() {
    this.$store.state.loading = true;

    let endpoint = await this.$store.state.dataStore.getEndpointByID(
      this.$router.currentRoute.params.eid
    );
    if (endpoint != null) {
      let workshops = await this.$store.state.dataStore.getWorkshops(
        endpoint.id
      );
      if (workshops == null) {
        this.items = [];
      }
      this.items = workshops;
    }

    let thisBreadcrumb = Object.assign({}, routes.breadcrumbs.sample);
    thisBreadcrumb.disabled = true;
    thisBreadcrumb.text = endpoint.n;
    this.breadcrumbs.push(thisBreadcrumb);

    this.$store.state.loading = false;
  },
  computed: {
    filteredItems() {
      return this.items.filter(workshop => {
        return workshop.n.toUpperCase().match(this.search.trim().toUpperCase());
      });
    }
  },
  methods: {
    newItemOpen() {
      this.newItem = Object.assign({}, this.defaultItem);
      this.openDialog(this.dialogs.items, "new");
    },
    newItemClose() {
      // Save to DB
      this.closeDialog(this.dialogs.items, "new");
    },

    editItemOpen(item) {
      this.editedItemCopy = Object.assign({}, item);
      this.editedItemCopy.d = moment(
        new Date(item.d.y, item.d.m, item.d.d)
      ).format("YYYY-MM-DD");
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

    getDateString(date) {
      if (date == null) return "Date not set";
      // moment.locale("en");
      return moment(date).format("dddd, MMMM Do YYYY");
    },

    processSelection(item, isSelected) {
      if (isSelected) this.selectedItems.push(item);
      else this.selectedItems = this.selectedItems.filter(i => i !== item);
    }
  }
};
</script>

<style scoped></style>
