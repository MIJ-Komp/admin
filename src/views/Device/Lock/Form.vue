<template>
   <ChForm :formData="formData" :showCancel="showCancel"
   @cancel="$emit('cancel')"> </ChForm>
</template>
<script>
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   created() {},
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.deviceLock,
         },
      };
   },
   mounted() {
      // console.log(this.$route)
   },
};
</script>
