import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/es5/util/colors";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  iconfont: "md",
  theme: {
    primary: colors.red.darken1, // #E53935
    secondary: "#37474F", // #FFCDD2
    accent: colors.indigo.base, // #3F51B5
    blue: colors.blue.darken1,
    lightblue: colors.blue.lighten4,
    grey4: colors.grey.darken4
  }
});
