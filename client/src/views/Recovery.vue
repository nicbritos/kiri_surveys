<template>
  <v-container grid-list-md fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title
              ><v-icon>lock_open</v-icon> Recuperar contraseña</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <p class="subheading mb-0">
              Enviaremos un correo a tu dirección en el que, siguiendo los
              pasos, podrás recuperar tu contraseña
            </p>
            <v-form @submit.prevent="submitForm" id="login">
              <v-text-field
                v-model="email"
                prepend-icon="alternate_email"
                name="email"
                label="Correo electrónico"
                type="text"
                @change="$v.email.$touch()"
                @blur="$v.email.$touch()"
                :error-messages="emailErrors"
              ></v-text-field>
            </v-form>
            <div class="account-actions mt-1">
              <router-link
                to="/login"
                :class="{
                  'no-underline': true,
                  'blue--text': true,
                  'text--darken-1': theme == 'light',
                  'text--lighten-2': theme == 'dark'
                }"
                >Iniciar sesión</router-link
              ><br />
            </div>
          </v-card-text>
          <v-card-actions class="pb-3">
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
              :disabled="loading"
              type="submit"
              color="primary"
              form="login"
            >
              <v-icon left>outlined_flag</v-icon>
              RECUPERAR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  data: () => ({
    email: ""
  }),
  validations: {
    email: { required, email }
  },
  computed: {
    ...mapGetters(["theme"]),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Debe ser un correo válido");
      !this.$v.email.required && errors.push("Este campo es obligatorio");
      return errors;
    }
  },
  methods: {
    submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      //this.loading = true;
    }
  }
};
</script>
