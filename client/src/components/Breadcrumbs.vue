<template>
  <v-breadcrumbs class="pl-4 pb-0" large :items="items">
    <template v-slot:divider>
      <v-icon>chevron_right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: "Workshop",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    responsesQuantityString() {
      return (
        (this.quantity == 0 ? "No" : this.quantity) +
        (this.quantity == 1 ? " response" : " responses")
      );
    }
  },
  methods: {
    goToRoute() {
      this.$router.push(this.getRoute());
    },
    getRoute() {
      return this.$router.currentRoute.path + "/" + this.workshopId;
    }
  }
};
</script>

<style scoped></style>
