<template>
  <v-container grid-list-md fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registro</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="submitForm" id="register">
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
              <v-text-field
                v-model="displayName"
                prepend-icon="person"
                name="displayName"
                label="Nombre"
                hint="Ej: María Rodriguez"
                type="text"
                maxlength="40"
                @change="$v.displayName.$touch()"
                @blur="$v.displayName.$touch()"
                :error-messages="displayNameErrors"
              ></v-text-field>
              <v-text-field
                v-model="password"
                @click:append="show = !show"
                prepend-icon="lock"
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :type="show ? 'text' : 'password'"
                name="password"
                label="Contraseña"
                id="password"
                :hint="passwordStrength"
                :loading="focus"
                @focus="focus = true"
                @blur="written ? '' : (focus = false)"
                @change="$v.password.$touch()"
                :error-messages="passwordErrors"
              >
                <template v-slot:progress>
                  <v-progress-linear
                    v-if="focus"
                    :value="progress"
                    :color="color"
                    height="3"
                  ></v-progress-linear>
                </template>
              </v-text-field>
              <v-text-field
                v-model="passwordVerify"
                @click:append="show = !show"
                prepend-icon="lock"
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :type="show ? 'text' : 'password'"
                name="passwordVerify"
                label="Repetir contraseña"
                @change="$v.passwordVerify.$touch()"
                @blur="$v.passwordVerify.$touch()"
                :error-messages="passwordVerifyErrors"
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
                >Ya tengo una cuenta</router-link
              ><br />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
              :disabled="loading"
              type="submit"
              color="primary"
              form="register"
              v-blur
            >
              <v-icon left>person_add</v-icon>
              REGISTRARME
            </v-btn>
          </v-card-actions>
          <SocialLogin />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SocialLogin from "@/components/SocialLogin";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import database from "@/data/database";

export default {
  components: {
    SocialLogin
  },
  data: () => ({
    show: false,
    email: "",
    displayName: "",
    password: "",
    passwordVerify: "",
    loading: false,
    focus: false
  }),
  validations: {
    email: { required, email },
    displayName: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(40)
    },
    password: { required, minLength: minLength(6) },
    passwordVerify: { required, sameAs: sameAs("password") }
  },
  methods: {
    submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.loading = true;
      database
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.loading = false;
          this.$router.push("/login");
        }).catch(reason => {
        this.loading = false;
          console.error(reason);
      });
    }
  },
  computed: {
    ...mapGetters(["theme"]),
    progress() {
      return Math.min(100, this.password.length * 7);
    },
    color() {
      return ["error", "warning", "success"][Math.floor(this.progress / 40)];
    },
    passwordStrength() {
      return this.color == "success"
        ? "Nivel de seguridad alto"
        : this.color == "warning"
        ? "Nivel de seguridad medio"
        : "Debe tener 6 caracteres como mínimo";
    },
    written() {
      return this.password.length > 0;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Debe ser un correo válido");
      !this.$v.email.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    displayNameErrors() {
      const errors = [];
      if (!this.$v.displayName.$dirty) return errors;
      !this.$v.displayName.minLength &&
        errors.push("Debe tener 4 caracteres como mínimo");
      !this.$v.displayName.maxLength &&
        errors.push("Debe tener 40 caracteres como máximo");
      !this.$v.displayName.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Debe tener 6 caracteres como mínimo");
      !this.$v.password.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    passwordVerifyErrors() {
      const errors = [];
      if (!this.$v.passwordVerify.$dirty) return errors;
      !this.$v.passwordVerify.sameAs &&
        errors.push("Las contraseñas deben coincidir");
      !this.$v.passwordVerify.required &&
        errors.push("Este campo es obligatorio");
      return errors;
    }
  }
};
</script>
