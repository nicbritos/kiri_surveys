<template>
  <v-container grid-list-md fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Inicio de sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
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
              <v-text-field
                v-model="password"
                @click:append="show = !show"
                prepend-icon="lock"
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :type="show ? 'text' : 'password'"
                name="password"
                label="Contraseña"
                id="password"
                @change="$v.password.$touch()"
                @blur="$v.password.$touch()"
                :error-messages="passwordErrors"
              >
              </v-text-field>
            </v-form>
            <div class="account-actions mt-1">
              <router-link
                to="/recovery"
                :class="{
                  'no-underline': true,
                  'blue--text': true,
                  'text--darken-1': theme == 'light',
                  'text--lighten-2': theme == 'dark'
                }"
                >Olvidé mi contraseña</router-link
              ><br />
              <router-link
                to="/register"
                :class="{
                  'no-underline': true,
                  'blue--text': true,
                  'text--darken-1': theme == 'light',
                  'text--lighten-2': theme == 'dark'
                }"
                >No tengo una cuenta</router-link
              >
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading"
              :disabled="loading"
              type="submit"
              color="primary"
              form="login"
              v-blur
            >
              <v-icon left>exit_to_app</v-icon>
              CONECTARME
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
import { required, email, minLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import database from "@/data/database";

export default {
  components: {
    SocialLogin
  },
  data: () => ({
    show: false,
    email: "",
    password: "",
    loading: false,
    invalidCredentials: false
  }),
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) }
  },
  computed: {
    ...mapGetters(["theme"]),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (this.invalidCredentials) {
        errors.push("Invalid email and/or password");
        return errors;
      }
      !this.$v.email.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (this.invalidCredentials) {
        errors.push("Invalid email and/or password");
        return errors;
      }
      !this.$v.password.required && errors.push("Este campo es obligatorio");
      return errors;
    }
  },
  methods: {
    async submitForm() {
      this.$v.$touch();
      this.invalidCredentials = false;
      if (this.$v.$invalid) return;

      this.loading = true;
      database
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.loading = false;
          this.$router.push("/");
        })
        .catch(err => {
          this.loading = false;
          if (err.code === "auth/wrong-password") {
            this.invalidCredentials = true;
            this.$v.$touch();
          } else {
            console.log(err);
          }
        });
    }
  }
};
</script>

<style lang="scss">
a.no-underline {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
