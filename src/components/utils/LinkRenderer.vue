<!-- components/LinkRenderer.vue -->
<template>
    <a @click.prevent="onClick" class="link-renderer">{{ params.text }}</a>
  </template>
  
  <script>
  export default {
    props: {
      params: {
        type: Object,
        required: true,
      },
    },
    methods: {
      onClick() {
        console.log("params", this.params)
        this.$router.replace(`/${this.$constant.router.room}`.replace(':id',this.params.data.id) + '/add');

        if (this.params && this.params.action) {
          this.params.action(this.params.data); // Memanggil aksi dengan data baris yang diklik
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .link-renderer {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }
  </style>
  