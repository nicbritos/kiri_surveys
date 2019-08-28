<template>
  <div class="google-login">
    <div class="form-separador">
      <div
        :class="{ line: true, dark: theme == 'dark', light: theme == 'light' }"
      ></div>
      <span>o</span>
      <div
        :class="{ line: true, dark: theme == 'dark', light: theme == 'light' }"
      ></div>
    </div>
    <div class="google-btn__container">
      <v-btn class="google-btn grey lighten-4 black--text" @click="googleLogin"
        ><img class="google-logo" src="@/assets/google-logo.svg" alt="" />
        CONECTARME CON GOOGLE</v-btn
      >
    </div>
  </div>
</template>

<script>
import database from "@/database";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["theme"])
  },
  methods: {
    googleLogin() {
      database.prepareGoogleSignIn().then(() => {
        this.$store.state.loading = true;
        this.$router.push("/");
      });
    }
  }
};
</script>

<style lang="scss">
.google {
  &-login {
    padding: 16px;
  }

  &-btn__container {
    display: flex;
    //align-items: center;
    flex-direction: column;
    margin-bottom: 0.75em;

    &-btn {
      margin: 0 18px 2em 0;
    }
  }

  &-logo {
    width: 24px;
    margin-right: 18px;
  }
}

.form-separador {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1em;

  & .line {
    flex-grow: 1;
    height: 1px;

    &.dark {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &.light {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  & span {
    padding: 0 15px;
  }
}
</style>
