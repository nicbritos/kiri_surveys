<template>
  <v-card class="mx-auto" max-width="544" height="100%">
    <v-row justify="center">
      <v-progress-circular color="primary" :value="100" :size="35">
        <v-avatar color="grey lighten-4" :tile="false" :size="31">
          <h5 class="text--secondary">{{ getInitials() }}</h5>
        </v-avatar></v-progress-circular
      >
    </v-row>
    <div class="display-1 text-center align-center">
        {{ name }}
    </div>
    <v-card-text>
      <v-row justify="center">
        <Email :email="email"></Email>
      </v-row>
      <v-row justify="center">
        <div class="text--secondary">Tier level: {{ tier }}</div>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
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
import Email from "@/components/Email";

export default {
  name: "User",
  components: {
    Email
  },
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
