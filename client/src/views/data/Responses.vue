<template>
  <v-container grid-list-md>
    <v-row>
      <v-card-title>
        <h2>
          Responses
        </h2>
      </v-card-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" dark class="mb-2" v-on="on" v-blur
        >NEW RESPONSE</v-btn
      >
    </v-row>
    <v-toolbar>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }"> </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.name"
                    label="Name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-checkbox
                    v-model="editedItem.feedback"
                    label="Feedback"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-checkbox
                    v-model="editedItem.measurable"
                    label="Measurable"
                    disabled="editedItem.answered"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-checkbox
                    v-model="editedItem.answered"
                    label="Answered"
                    disabled="true"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close" v-blur
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="save" v-blur>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table
      v-model="this.$store.state.questions.selected"
      :headers="headers"
      :items="items"
      item-key="name"
      no-data-text="No Questions created so far."
      no-results-text="No Questions found."
      show-select
      show-expand
      must-sort
    >
      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-btn icon v-blur v-if="!isExpanded && item.measurable"
          ><v-icon @click="expand(true)">expand_more</v-icon></v-btn
        >
        <v-btn icon v-blur v-if="isExpanded && item.measurable"
          ><v-icon @click="expand(false)">expand_less</v-icon></v-btn
        >
      </template>
      <template v-slot:items="props">
        <tr>
          <td>{{ props.item.name }}</td>
          <td>
            <v-checkbox
              primary
              hide-details
              :input-value="props.item.feedback"
              :disabled="true"
            ></v-checkbox>
          </td>
          <td>
            <v-checkbox
              primary
              hide-details
              :input-value="props.item.measurable"
              :disabled="true"
            ></v-checkbox>
          </td>
          <td>
            <v-checkbox
              primary
              hide-details
              :input-value="props.item.answered"
              :disabled="true"
            ></v-checkbox>
          </td>
          <td>
            <v-icon class="mr-2" @click="editItem(props.item)">
              edit
            </v-icon>
            <!-- TODO: Sacar dialog box del loop. -->
            <v-dialog v-model="deleteDialog" max-width="300px">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" @click="setDialog(props.item)">
                  delete
                </v-icon>
              </template>

              <v-card>
                <v-card-title>
                  <span class="headline"
                    >Are you sure you want to delete
                    <span class="red--text">{{ deletingItem.name }}</span
                    >?</span
                  >
                </v-card-title>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close" v-blur
                    >CANCEL</v-btn
                  >
                  <v-btn color="error" text @click="deleteItem" v-blur
                    >DELETE</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </template>

      <template v-slot:expanded-item="props">
        <td :colspan="4 * headers.length">
          <v-sheet>
            <v-data-table
              :headers="questionValueHeaders"
              :items="props.item.values"
              item-key="value"
              no-data-text="No Values created so far."
              must-sort
              disable-pagination
              items-per-page="-1"
              class="elevation-1 mb-5"
            >
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.item.value }}</td>
                  <td>{{ props.item.description }}</td>
                  <td>
                    <v-icon class="mr-2" @click="editItem(props.item)">
                      edit
                    </v-icon>
                    <!-- TODO: Sacar dialog box del loop. -->
                    <v-dialog v-model="deleteDialog" max-width="300px">
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" @click="setDialog(props.item)">
                          delete
                        </v-icon>
                      </template>

                      <v-card>
                        <v-card-title>
                          <span class="headline"
                            >Are you sure you want to delete
                            <span class="red--text">{{
                              deletingItem.value +
                                ": " +
                                defaultItem.description
                            }}</span
                            >?</span
                          >
                        </v-card-title>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                            v-blur
                            >CANCEL</v-btn
                          >
                          <v-btn color="error" text @click="deleteItem" v-blur
                            >DELETE</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-sheet>
        </td>
      </template>
    </v-data-table>

    <hr class="mb-5" />
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: "",
    shown: true,
    snackbar: false,
    dialog: false,
    deleteDialog: false,
    deletingItem: {},
    editedIndex: -1,
    editedItem: {
      name: "",
      measurable: false,
      feedback: false
    },
    defaultItem: {
      name: "",
      measurable: false,
      feedback: false
    }
  }),
  computed: {
    questionValueHeaders() {
      return this.$store.state.questionValues.headers;
    },
    headers() {
      return this.$store.state.questions.headers;
    },
    items() {
      return this.$store.state.questions.items;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Question" : "Edit Question";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    deleteDialog(val) {
      val || this.close();
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.questions.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem() {
      const index = this.questions.indexOf(this.deletingItem);

      this.questions.splice(index, 1);
      this.close();
    },

    setDialog(item) {
      this.deletingItem = item;
    },

    close() {
      this.dialog = false;
      this.deleteDialog = false;
      setTimeout(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.questions[this.editedIndex], this.editedItem);
      } else {
        this.questions.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
