<template
  ><v-container grid-list-md>
    <v-card>
      <v-card-title>
        <h2>
          About
        </h2>
      </v-card-title>
      <v-card-text>
        This website allows managing data from surveys made on workshops about
        Sensitization about Climate Change.
      </v-card-text>
      <v-card-text></v-card-text>
      <v-card-text>
        Current version: 0.1.0b
      </v-card-text>
      <v-card-text>
        Created by: Nicolas Ignacio Britos. Contact at:
        <Email email="nicbritos@hotmail.com"></Email>
        or
        <Email email="nbritos@itba.edu.ar"></Email>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Email from "@/components/Email";
export default {
  name: "About",
  components: { Email },
  data: () => ({
    snackbar: false,
    loading: false
  })
};
</script>
