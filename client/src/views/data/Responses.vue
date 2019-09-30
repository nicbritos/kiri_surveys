<template>
  <v-container grid-list-md>
    <Breadcrumbs :items="breadcrumbs"></Breadcrumbs>
    <v-dialog persistent v-model="dialogs.responses.new" max-width="700px">
      <v-card>
        <v-img
          class="white--text"
          src="@/assets/response_blue.png"
          position="top center"
          max-height="300"
        >
        </v-img>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">New Response</h1>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-stepper
          vertical
          class="elevation-0"
          v-model="newResponseData.stepper"
        >
          <template>
            <v-stepper-step
              step="1"
              :rules="[
                () => newResponseData.stepper !== 1 || !newResponseData.error
              ]"
              :complete="newResponseData.stepper > 1 && !newResponseData.error"
            >
              Select Person
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-row>
                <v-col>
                  <v-combobox
                    v-model="newResponse.p"
                    :items="getPersonIds"
                    label="Select or write a new Person ID"
                    item-value="p"
                    clearable
                    id="person-id"
                    menu-props="offsetY, offsetOverflow"
                    no-data-text="Person Not Found. Add as new"
                    :error="newResponseData.error"
                    :error-messages="newResponseData.errorMessages"
                    @input="
                      () => {
                        newResponse.p = cleanPersonIdString(newResponse.p);
                        validatePersonId(newResponse.p);
                      }
                    "
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="newResponseData.stepper++"
                    :disabled="newResponseData.error || newResponse.p == null"
                    >Continue</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step
              step="2"
              :rules="[
                () => newResponseData.stepper !== 2 || !newResponseData.error
              ]"
              :complete="newResponseData.stepper > 2 && !newResponseData.error"
            >
              Select Question
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-row>
                <v-col>
                  <v-autocomplete
                    v-model="newResponse.q"
                    :items="questions"
                    item-value="id"
                    item-text="n"
                    label="Select a Question"
                    clearable
                    id="question-id"
                    menu-props="offsetY, offsetOverflow"
                    no-data-text="No Question found"
                    :error="newResponseData.error"
                    :error-messages="newResponseData.errorMessages"
                    @input="validateQuestion(newResponse.q)"
                  ></v-autocomplete>
                </v-col> </v-row
              ><v-row>
                <v-col>
                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="
                      () => {
                        newResponseData.stepper--;
                        newResponseData.error = false;
                        newResponseData.errorMessages = [];
                      }
                    "
                    >Back</v-btn
                  >
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="newResponseData.stepper++"
                    :disabled="newResponseData.error || newResponse.q == null"
                    >Continue</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step
              step="3"
              :rules="[
                () => newResponseData.stepper !== 3 || !newResponseData.error
              ]"
              :complete="newResponseData.stepper > 3 && !newResponseData.error"
            >
              Response
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-row>
                <v-col>
                  <v-combobox
                    v-if="
                      () => {
                        let question = getQuestion(newResponse.q);
                        return question == null ? false : question.m;
                      }
                    "
                    v-model="newResponse.r"
                    :items="getQuestionValues(newResponse.q)"
                    item-value="v"
                    item-text="d"
                    label="Select a Response"
                    clearable
                    id="question-id"
                    menu-props="offsetY, offsetOverflow"
                    no-data-text="No Question found"
                    :error="newResponseData.error"
                    :error-messages="newResponseData.errorMessages"
                    @input="validateQuestion(newResponse.q)"
                  >
                  </v-combobox>
                  <v-text-field
                    v-else
                    v-model="newResponse.r"
                    label="Write a Response"
                    clearable
                    :error="newResponseData.error"
                    :error-messages="newResponseData.errorMessages"
                    @change="validateResponse(newResponse.r)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-spacer></v-spacer>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    text
                    v-blur
                    color="primary"
                    @click="
                      () => {
                        newResponseData.stepper--;
                        newResponse.r = null;
                        newResponseData.error = false;
                        newResponseData.errorMessages = [];
                      }
                    "
                    :disabled="newResponseData.error"
                    >Back</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-content>
          </template>
        </v-stepper>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog(dialogs.responses, 'new')"
            v-blur
            >Cancel</v-btn
          >
          <v-btn
            :disabled="
              newResponseData.stepper < 3 ||
                newResponseData.error ||
                newResponse.r == null
            "
            color="blue darken-1"
            text
            @click="newResponseClose"
            v-blur
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="dialogs.responses.edit" max-width="700px">
      <v-card>
        <v-img
          class="white--text"
          src="@/assets/response_blue.png"
          position="top center"
          max-height="300"
        >
        </v-img>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 style="color: black">Edit Response</h1>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="editedResponseCopy.name"
                  label="Name"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-tooltip bottom :open-on-hover="editedResponseCopy.answered">
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <v-checkbox
                        v-model="editedResponseCopy.measurable"
                        label="Measurable"
                        color="primary"
                        :disabled="editedResponseCopy.answered"
                      ></v-checkbox>
                    </div>
                  </template>
                  <span
                    >Cannot change Response type if it has already been
                    answered</span
                  >
                </v-tooltip>
              </v-col>

              <v-col>
                <v-checkbox
                  v-model="editedResponseCopy.feedback"
                  label="Feedback"
                  color="primary"
                ></v-checkbox>
              </v-col>

              <v-col>
                <v-checkbox
                  v-model="editedResponseCopy.answered"
                  label="Answered"
                  :disabled="true"
                  color="primary"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDialog(dialogs.responses, 'edit')"
            v-blur
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="editResponseClose" v-blur
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="dialogs.selected.delete" max-width="700px">
      <v-card>
        <v-card-text>
          <v-card-title>
            <span class="headline"
              >Are you sure you want to delete
              <span class="red--text">{{ selectedResponses.length }}</span>
              responses?</span
            >
          </v-card-title>
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
    <v-dialog persistent v-model="dialogs.responses.delete" max-width="700px">
      <v-card>
        <v-card-text>
          <v-card-title>
            <span class="headline"
              >Are you sure you want to delete
              <span class="red--text">{{ deletingResponse.name }}</span
              >?</span
            >
          </v-card-title>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            v-blur
            @click="closeDialog(dialogs.responses, 'delete')"
          >
            CANCEL
          </v-btn>
          <v-btn text color="error" v-blur @click="deleteResponseClose">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-toolbar flat style="background-color: transparent">
      <v-toolbar-title>
        <h2>
          Responses
        </h2>
      </v-toolbar-title>
      <v-text-field
        hide-details
        prepend-icon="search"
        single-line
        class="ml-3"
        placeholder="Start typing to Search"
        v-model="filters.search"
        clearable
      ></v-text-field>
      <v-btn
        @click="newResponseOpen"
        color="primary"
        class="ml-3 mb-2"
        v-on="on"
        v-blur
        >NEW RESPONSE</v-btn
      >
    </v-toolbar>

    <v-container fluid dense>
      <v-row dense class="mt-n4">
        <v-col>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="auto" :hidden="selectedResponses.length === 0">
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
            menu-props="offsetY"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-container>

    <v-data-table
      v-model="selectedResponses"
      :headers="personResponseHeaders"
      :items="items"
      show-fist-last-page
      item-key="p"
      no-data-text="No Responses created so far."
      no-results-text="No Responses found."
      show-select
      must-sort
      calculate-widths
      show-expand
      class="elevation-1 ml-4 mr-4"
      :sort-by="['p']"
    >
      <template v-slot:item.actions="props">
        <v-btn
          small
          class="ml-n1"
          icon
          v-blur
          @click="editResponseOpen(props.item)"
        >
          <v-icon color="primary">
            edit
          </v-icon>
        </v-btn>

        <v-btn small icon v-blur @click="deleteResponseOpen(props.item)">
          <v-icon color="error" v-on="on">
            delete
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:expanded-item="props">
        <td :colspan="4 * personResponseHeaders.length" class="pa-0">
          <v-data-table
            :headers="responseHeaders"
            :items="props.item.r"
            :search="filters.search"
            :header-props="props.item"
            item-key="id"
            no-data-text="No Responses created so far."
            no-results-text="No Responses found."
            must-sort
            show-select
            class="elevation-2"
            :sort-by="['q']"
          >
            <template v-slot:item.q="{ item }">
              {{ getQuestion(item.q).n }}
            </template>

            <template v-slot:item.f="{ item }">
              <v-checkbox
                primary
                hide-details
                :input-value="getQuestion(item.q).f"
                :disabled="true"
                class="mb-4"
              ></v-checkbox>
            </template>

            <template v-slot:item.m="{ item }">
              <v-checkbox
                primary
                hide-details
                :input-value="getQuestion(item.q).t === 'c'"
                :disabled="true"
                class="mb-4"
              ></v-checkbox>
            </template>

            <template v-slot:item.v="{ item }">
              <div
                v-if="
                  item.v == null ||
                    (typeof item.v === 'string' && item.v.length === 0)
                "
                class="text--secondary"
              >
                N/A
              </div>
              <v-tooltip left v-else-if="getQuestion(item.q).t === 'c'">
                <template v-slot:activator="{ on }">
                  <div v-on="on">{{ item.v }}</div>
                </template>
                <span> {{ getQuestionValueDescription(item.q, item.v) }}</span>
              </v-tooltip>
              <div v-else>
                {{ item.v }}
              </div>
            </template>

            <template v-slot:item.actions="props">
              <v-btn
                small
                icon
                v-blur
                text
                class="ml-n1"
                @click="editValueOpen(item, props.item)"
              >
                <v-icon color="primary">
                  edit
                </v-icon>
              </v-btn>
              <v-btn
                :disabled="props.item.a"
                small
                icon
                v-blur
                flat
                @click="deleteValueOpen(item, props.item)"
              >
                <v-icon color="error" v-on="on">
                  delete
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
// import { required, integer, minLength, maxLength } from "vuelidate/lib/validators";
import Breadcrumbs from "@/components/Breadcrumbs";
import routes from "@/router/routes";

export default {
  components: { Breadcrumbs },
  data: () => ({
    snackbar: false,
    breadcrumbs: [Object.assign({}, routes.breadcrumbs.endpoints)],
    shown: true,
    items: [],
    questions: [],
    filters: {
      search: "",
      type: undefined
    },
    dialogs: {
      responses: {
        new: false,
        edit: false,
        delete: false
      },
      selected: {
        delete: false
      }
    },
    newResponse: {},
    newResponseData: {},
    editedResponseCopy: {},
    deletingResponse: {},
    defaultResponse: {
      name: "",
      measurable: false,
      feedback: false,
      answered: false
    },
    defaultResponseData: {
      stepper: 1,
      personIdError: false,
      errorMessages: []
    },
    selectedResponses: [],
    filterChips: [
      {
        text: "PRE",
        value: "e",
        disabled: false
      },
      {
        text: "POST",
        value: "o",
        disabled: false
      },
      {
        text: "Measurable",
        value: "m",
        disabled: false
      },
      {
        text: "Non measurable",
        value: "nm",
        disabled: false
      },
      {
        text: "Feedback",
        value: "f",
        disabled: false
      },
      {
        text: "Non feedback",
        value: "nf",
        disabled: false
      }
    ]
  }),
  computed: {
    getPersonIds() {
      let items = [];
      for (let person of this.items) {
        let item = {};
        item.text = item.p = person.p;
        items.push(item);
      }
      return items;
    },

    personResponseHeaders() {
      return [
        {
          text: "Person",
          value: "p",
          sortable: true
        }
      ];
    },
    responseHeaders() {
      return [
        {
          text: "Question",
          value: "q",
          sortable: true
        },
        {
          text: "Answer",
          value: "v",
          sortable: false
        },
        {
          text: "Type",
          value: "t",
          sortable: true,
          width: "77",
          filter: value => {
            if (this.filters.type == null) return true;
            return value.toUpperCase().match(this.filters.type);
          }
        },
        {
          text: "Feedback",
          value: "f",
          sortable: false,
          width: "1",
          filter: value => {
            if (this.filters.feedback == null) return true;
            return value === this.filters.feedback;
          }
        },
        {
          text: "Measurable",
          value: "m",
          sortable: false,
          width: "1",
          filter: value => {
            if (this.filters.measurable == null) return true;
            return value === this.filters.measurable;
          }
        },
        { text: "Actions", value: "actions", width: "110", sortable: false }
      ];
    },

    responseNameErrors() {
      const errors = [];
      // if (!newResponse)
      // if (!this.defaultValue.value.$dirty) return errors;
      // !this.defaultValue.value.required && errors.push("Este campo es obligatorio");
      return errors;
    }
  },
  async mounted() {
    this.$store.state.loading = true;

    await this.$store.state.dataStore._loadQuestions();
    this.questions = await this.$store.state.dataStore.getQuestions();
    let endpointId = this.$router.currentRoute.params.eid;
    let endpointBreadcrumb = Object.assign({}, routes.breadcrumbs.sample);
    endpointBreadcrumb.text = (await this.$store.state.dataStore.getEndpointByID(
      endpointId
    )).n;
    endpointBreadcrumb.disabled = false;
    endpointBreadcrumb.to = routes.router.endpoints.path + "/" + endpointId;
    this.breadcrumbs.push(endpointBreadcrumb);

    let workshopId = this.$router.currentRoute.params.wid;
    let workshopBreadcrumb = Object.assign({}, routes.breadcrumbs.sample);
    workshopBreadcrumb.text = (await this.$store.state.dataStore.getWorkshopByID(
      endpointId,
      workshopId
    )).n;
    this.breadcrumbs.push(workshopBreadcrumb);

    let responses = await this.$store.state.dataStore.getResponses(
      endpointId,
      workshopId
    );
    this.$store.state.loading = false;
    if (responses == null) return; // TODO: Specify error

    this.items = responses;
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
    newResponseOpen() {
      this.newResponse = Object.assign({}, this.defaultResponse);
      this.newResponseData = Object.assign({}, this.defaultResponseData);
      this.openDialog(this.dialogs.responses, "new");
    },
    newResponseClose() {
      // Save to DB
      this.closeDialog(this.dialogs.responses, "new");
    },

    editResponseOpen(item) {
      this.editedResponseCopy = Object.assign({}, item);
      this.openDialog(this.dialogs.responses, "edit");
    },
    editResponseClose() {
      // Save to DB
      this.closeDialog(this.dialogs.responses, "edit");
    },

    deleteSelectedOpen() {
      this.openDialog(this.dialogs.selected, "delete");
    },
    deleteResponseOpen(item) {
      this.deletingResponse = item;
      this.openDialog(this.dialogs.responses, "delete");
    },
    deleteSelectedClose() {
      this.selectedResponses = [];
      this.closeDialog(this.dialogs.selected, "delete");
    },
    deleteResponseClose() {
      // Save to DB
      this.closeDialog(this.dialogs.responses, "delete");
    },

    chipFilterAdded(items) {
      var otherWasSelected = false;
      if (items.indexOf("e") !== -1) {
        if (!this.filterChips[1].disabled) this.filterChips[1].disabled = true;
        if (this.filters.type !== "PRE") this.filters.type = "PRE";
        otherWasSelected = true;
      } else {
        if (this.filterChips[1].disabled) this.filterChips[1].disabled = false;
      }
      if (items.indexOf("o") !== -1) {
        if (!this.filterChips[0].disabled) this.filterChips[0].disabled = true;
        if (this.filters.type !== "POST") this.filters.type = "POST";
      } else {
        if (this.filterChips[0].disabled) this.filterChips[0].disabled = false;
        if (!otherWasSelected && this.filters.type !== undefined)
          this.filters.type = undefined;
      }

      otherWasSelected = false;
      if (items.indexOf("m") !== -1) {
        if (!this.filterChips[3].disabled) this.filterChips[3].disabled = true;
        if (!this.filters.measurable) this.filters.measurable = true;
        otherWasSelected = true;
      } else {
        if (this.filterChips[3].disabled) this.filterChips[3].disabled = false;
      }
      if (items.indexOf("nm") !== -1) {
        if (!this.filterChips[2].disabled) this.filterChips[2].disabled = true;
        if (this.filters.measurable !== false) this.filters.measurable = false;
      } else {
        if (this.filterChips[2].disabled) this.filterChips[2].disabled = false;
        if (!otherWasSelected && this.filters.measurable !== undefined)
          this.filters.measurable = undefined;
      }

      otherWasSelected = false;
      if (items.indexOf("f") !== -1) {
        if (!this.filterChips[5].disabled) this.filterChips[5].disabled = true;
        if (!this.filters.feedback) this.filters.feedback = true;
        otherWasSelected = true;
      } else {
        if (this.filterChips[5].disabled) this.filterChips[5].disabled = false;
      }
      if (items.indexOf("nf") !== -1) {
        if (!this.filterChips[4].disabled) this.filterChips[4].disabled = true;
        if (this.filters.feedback !== false) this.filters.feedback = false;
      } else {
        if (this.filterChips[4].disabled) this.filterChips[4].disabled = false;
        if (!otherWasSelected && this.filters.feedback !== undefined)
          this.filters.feedback = undefined;
      }
    },

    openDialog(item, type) {
      if (item == null || type == null || item[type] == null) return;
      if (!item[type]) item[type] = true;
    },
    closeDialog(item, type) {
      if (item == null || type == null || item[type] == null) return;
      if (item[type]) item[type] = false;
    },

    getQuestion(questionId) {
      return this.$store.state.dataStore.getQuestionByID(questionId);
    },
    getQuestionValues(questionId) {
      let question = this.getQuestion(questionId);
      if (question == null) return null;
      return question.v;
    },
    getQuestionValueDescription(questionId, value) {
      return this.$store.state.dataStore.getQuestionValueDescriptionByID(
        questionId,
        value
      );
    },

    cleanPersonIdString(personId) {
      if (typeof personId !== "string") return personId;
      return personId
        .trim()
        .replace(/\s\s+/g, " ")
        .toUpperCase();
    },
    validatePersonId(personId) {
      let messages = [];
      if (personId == null) {
        messages.push("No Person ID specified");
      } else {
        if (typeof personId !== "string" && typeof personId !== "object") {
          messages.push("Invalid input type");
        } else {
          personId = this.cleanPersonIdString(personId);

          if (personId.length === 0) {
            messages.push("No Person ID specified");
          } else {
            if (!/^[\x20-\x7E]*$/.test(personId))
              messages.push("There are invalid characters");
          }
        }
      }
      this.newResponseData.errorMessages = messages;
      this.newResponseData.error = messages.length > 0;
    },
    validateQuestion(question) {
      let messages = [];
      if (question == null) {
        messages.push("Please, select a Question");
      }
      this.newResponseData.errorMessages = messages;
      this.newResponseData.error = messages.length > 0;
    },
    validateResponse(response) {
      let messages = [];

      if (typeof response !== "string")
        messages.push("Please, write a response");

      response = response.trim().replace(/\s\s+/g, " ");
      if (response.length === 0) messages.push("Please, write a response");

      this.newResponseData.errorMessages = messages;
      this.newResponseData.error = messages.length > 0;
    }
  }
};
</script>
