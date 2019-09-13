<template>
  <h4 class="no-bold" v-if="!isSearch">Add a new {{ type }}</h4>
  <h4 class="no-bold" v-else>No results found</h4>
</template>

<script>
export default {
  name: "NoItemsComponent",
  props: {
    type: {
      type: String,
      required: true
    },
    isSearch: {
      type: Boolean,
      required: false
    }
  }
};
</script>

<style scoped>
.no-bold {
  font-weight: normal;
}
</style>
