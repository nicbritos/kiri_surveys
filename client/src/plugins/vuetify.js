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
        primary: colors.red.darken1, // #E53935
        secondary: "#37474F", // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
        blue: colors.blue.darken1,
        lightblue: colors.blue.lighten4,
        grey4: colors.grey.darken4
      }
    }
  }
});
