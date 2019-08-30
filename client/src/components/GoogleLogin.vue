<template>
  <div class="google-login">
    <div class="form-separador">
      <div class="line"></div>
      <span>o</span>
      <div class="line"></div>
    </div>
    <div class="google-btn__container">
      <v-btn class="google-btn" @click="googleLogin" v-blur
        ><img class="google-logo" src="@/assets/google-logo.svg" alt="" />
        CONECTARME CON GOOGLE</v-btn
      >
    </div>
  </div>
</template>

<script>
import database from "@/database";

export default {
  methods: {
    googleLogin() {
      database.prepareGoogleSignIn();
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
    justify-content: center;
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
    background-color: rgba(0, 0, 0, 0.2);
  }

  & span {
    padding: 0 15px;
  }
}
</style>
