<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <v-row justify="center">

      <v-avatar color="grey lighten-4" :tile="false" :size="100">
        <h1>{{ getInitials() }}</h1>
      </v-avatar>
      <p class="display-1 text--primary">
        {{ name }}
      </p>
      <div class="text--primary">{{ email }}<br /></div>
      <div class="text--secondary">Tier level: {{ tier }}</div>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary">
        Edit
      </v-btn>
      <v-btn text color="red">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "User",
  props: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    tier: {
      type: Number,
      required: true
    }
  },
  computed: {},
  methods: {
    getInitials() {
      let matches = this.name.match(/\b(\w)/g);
      if (matches.length < 2) {
        return this.name.substring(0, 2).toUpperCase();
      }
      return matches
        .slice(0, 2)
        .join("")
        .toUpperCase(); // JSON
    }
  }
};
</script>

<style scoped></style>
