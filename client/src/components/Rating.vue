<template>
  <transition name="slide-fade">
    <v-card elevation="12" class="ratings" v-if="ratingVisibility">
      <v-icon class="dismiss" @click="dismiss">clear</v-icon>
      <h3 class="headline mb-3">¿Qué te parece la aplicación?</h3>
      <div class="icons">
        <svg
          v-for="(icon, i) in icons"
          :key="i"
          @click="selectFace(i)"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          v-html="icon.svg"
          :style="{
            fill:
              selected - 1 == i
                ? icon.color
                : theme == 'light'
                ? '#212121'
                : 'f5f5f5'
          }"
        ></svg>
      </div>
      <transition name="slide-fade">
        <div class="input" v-if="selected">
          <v-textarea
            outline
            name="comment"
            label="Comentarios extra (opcional)"
            v-model="comment"
          ></v-textarea>
          <v-btn color="primary" @click="rate">Enviar</v-btn>
        </div>
      </transition>
    </v-card>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    icons: [
      {
        svg:
          '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"/>',
        color: "red"
      },
      {
        svg:
          '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z"/><rect x="7.9" y="14.4" width="8.3" height="1.5"/>',
        color: "orange"
      },
      {
        svg:
          '<circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-2.5c2.33 0 4.32-1.45 5.12-3.5h-1.67c-.69 1.19-1.97 2-3.45 2s-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5z"/>',
        color: "#00dc00"
      }
    ],
    selected: null,
    comment: ""
  }),
  methods: {
    selectFace(i) {
      if (this.selected - 1 == i) {
        this.selected = null;
        return;
      }

      this.selected = ++i;
    },
    rate() {
      const payload = {
        rate: this.selected,
        comment: this.comment
      };
      this.$emit("rate", payload);
    },
    dismiss() {
      this.$store.dispatch("toggleRating");
    }
  },
  computed: {
    ...mapGetters(["ratingVisibility", "theme"])
  }
};
</script>

<style lang="scss">
.ratings {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
  padding: 1.5em 1em 1.5em 1em;
  z-index: 9998;
  text-align: center;
  width: 300px;

  @media screen and (min-width: 992px) {
    right: 50px;
    transform: inherit;
    left: inherit;
    bottom: 50px;
    padding: 4em 2em 3em 2em;
    width: auto;
  }

  .dismiss {
    position: absolute;
    right: 22px;
    top: 20px;
  }

  svg {
    cursor: pointer;
    transition: fill 175ms ease;
  }

  .input {
    width: 100%;

    .v-textarea {
      margin-top: 1em;
      width: 100%;
    }

    textarea {
      resize: none;
      height: 56px;
    }

    button {
      margin-top: -10px;
    }
  }
}
</style>
