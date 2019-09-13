import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import "vuetify/src/styles/main.sass";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md"
  },
  theme: {
    themes: {
      light: {
        primary: colors.blue.darken1, // #1E88E5
        secondary: "#37474F",
        accent: colors.indigo.base,
        blue: colors.blue.darken1,
        lightblue: colors.blue.lighten4,
        grey4: colors.grey.darken4
      }
    }
  }
});
