<template>
  <v-breadcrumbs class="pl-4 pb-0" large :items="items">
    <template v-slot:divider>
      <v-icon>chevron_right</v-icon>
    </template>

    <v-breadcrumbs-item
            slot="item"
            slot-scope="{ item }"
            exact
            :to="item.to">
      {{ item.text }}
    </v-breadcrumbs-item>
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
  }
};
</script>

<style scoped></style>
