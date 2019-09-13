<template
  ><a :href="'mailto:' + email">{{ email }}</a></template
>

<script>
export default {
  name: "Email",
  props: {
    email: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped></style>
