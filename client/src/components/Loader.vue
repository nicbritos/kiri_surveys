<template>
  <transition name="fade">
    <div class="full" v-show="loading">
      <div class="overlay"></div>
      <div class="loader">
        <v-progress-circular
          :size="50"
          :width="5"
          color="white"
          indeterminate
        ></v-progress-circular>
        <!-- <p class="white--text display-1 mt-5">Cargando...</p> -->
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["loading"]
};
</script>

<style lang="scss">
.full {
  min-height: 100vh;
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  z-index: 99999;

  .overlay {
    background-color: #d32f2f;
    position: absolute;
    min-height: 100vh;
    width: 100%;
    top: 0;
    left: 0;
  }

  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
