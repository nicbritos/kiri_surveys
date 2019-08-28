<template>
  <v-container grid-list-md>
    <v-btn @click="$store.dispatch('toggleRating')"
      >Toggle rating component</v-btn
    >
    <!-- TABLE COMPONENT -->
    <h1>Table component</h1>
    <v-toolbar>
      <v-toolbar-title>Tabla CRUD</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">NUEVO ITEM</v-btn>
        </template>
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
                    label="Dessert name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.calories"
                    label="Calories"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.fat"
                    label="Fat (g)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.carbs"
                    label="Carbs (g)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.protein"
                    label="Protein (g)"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="desserts" class="elevation-1 mb-5">
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.calories }}</td>
        <td>{{ props.item.fat }}</td>
        <td>{{ props.item.carbs }}</td>
        <td>{{ props.item.protein }}</td>
        <td>
          <v-icon small class="mr-2" @click="editItem(props.item)">
            edit
          </v-icon>
          <!-- TODO: Sacar dialog box del loop. -->
          <v-dialog v-model="deleteDialog" max-width="300px">
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on" @click="setDialog(props.item)">
                delete
              </v-icon>
            </template>

            <v-card>
              <v-card-title>
                <span class="headline"
                  >¿Está seguro que desea eliminar
                  <span class="red--text">{{ deletingItem.name }}</span
                  >?</span
                >
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close"
                  >CANCELAR</v-btn
                >
                <v-btn color="error" flat @click="deleteItem">ELIMINAR</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </template>
    </v-data-table>

    <hr class="mb-5" />

    <!-- ALERT COMPONENT -->
    <h1>Alert component</h1>
    <v-layout wrap class="mb-5">
      <v-flex xs12 md6>
        <v-alert :value="true" type="success">
          ¡Enhorabuena! Se ha creado el usuario.
        </v-alert>
      </v-flex>
      <v-flex xs12 md6 v-if="shown">
        <v-alert type="info" dismissible v-model="shown">
          Esta alert es de tipo dismissible.
        </v-alert>
      </v-flex>
      <v-flex xs12 md6>
        <v-alert :value="true" type="warning">
          Tené cuidado con lo que estás haciendo wachin.
        </v-alert>
      </v-flex>
      <v-flex xs12 md6>
        <v-alert :value="true" type="error">
          No se ha encontrado un usuario con ese código.
        </v-alert>
      </v-flex>
    </v-layout>

    <hr class="mb-5" />

    <!-- SNACKBAR COMPONENT -->
    <h1>Snackbar component</h1>
    <v-btn color="primary" dark @click="snackbar = true" class="mb-5">
      Mostrar Snackbar
    </v-btn>
    <v-snackbar v-model="snackbar" top left color="success" :timeout="6000">
      <v-icon left color="white">accessibility</v-icon> Soy una snackbar
      deliciosa
      <v-btn flat icon @click="snackbar = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>

    <hr class="mb-5" />

    <!-- STEPPER COMPONENT -->
    <h1>Stepper component</h1>
    <v-stepper alt-labels v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">Tickets</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2"
          >Info. de pago</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step step="3">Resumen</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-layout class="mb-3">
            <v-flex xs12 md3>
              <v-form>
                <v-text-field
                  v-model="tickets"
                  required
                  prepend-icon="style"
                  name="tickets"
                  label="Tickets"
                  type="number"
                ></v-text-field>
                <h3>Subtotal: ${{ subTotal }}</h3>
              </v-form>
            </v-flex>
          </v-layout>

          <v-btn color="primary" @click="step = 2">
            Continuar
          </v-btn>

          <v-btn flat>Cancelar</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-layout class="mb-3">
            <v-flex xs12 md3>
              <v-text-field
                v-model="ccNumber"
                label="Número de tarjeta"
                mask="credit-card"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-btn color="primary" @click="step = 3">
            Continuar
          </v-btn>

          <v-btn flat @click="step = 1">Atrás</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <h3>Tickets: {{ tickets }}</h3>
          <h3>Tarjeta: Visa terminada en {{ lastCCDigits }}</h3>
          <h2 class="mb-3">Total: ${{ subTotal }}</h2>
          <v-btn color="primary" @click="step = 1">
            Continuar
          </v-btn>

          <v-btn flat @click="step = 2">Atrás</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
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
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    step: 0,
    tickets: 10,
    price: 160,
    ccNumber: ""
  }),
  computed: {
    headers() {
      return this.$store.state.headers;
    },
    desserts() {
      return this.$store.state.desserts;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Item" : "Editar Item";
    },
    subTotal() {
      return this.tickets * this.price;
    },
    lastCCDigits() {
      return this.ccNumber.substr(this.ccNumber.length - 4);
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
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = item;
      this.dialog = true;
    },

    deleteItem() {
      const index = this.desserts.indexOf(this.deletingItem);

      this.desserts.splice(index, 1);
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
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
