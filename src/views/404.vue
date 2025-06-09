<template>
  <div class="not-found-container h-100">
    <div class="text-center">
      <div class="text-center">
        <div style="font-size: 80px; color: var(--blue-500);" class="	far fa-frown">404</div>
      </div>
      <p class="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
    </div>
    <Button label="Dashboard" class="mt-4" @click="dashboard()"/>
  </div>
</template>
<script>

export default{
  methods: {
    dashboard(){
      this.$router.replace('/dashboard')
    }
  },
}
</script>

<style scoped>
.not-found-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  align-items: center;
}

.not-found-container .mij-button{
  width: 200px !important;
}
</style>