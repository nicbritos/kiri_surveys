<template>
  <v-card hover style="cursor: default" v-model="model" class="mx-auto" max-width="344">
    <v-card-text v-ripple style="cursor: pointer">
      <div>Endpoint</div>
      <p class="display-1 text--primary">
        {{ value }}
      </p>
      <div class="text--primary">{{ description }}<br /></div>
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
  name: "Endpoint",
  props: {
    value: String,
    description: String
  }
};
</script>

<style scoped></style>
