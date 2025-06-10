<template>
   <MIJForm :formData="formData" :showCancel="showCancel"
   @cancel="$emit('cancel')"> </MIJForm>
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
            module: this.$module.deviceGateway,
         },
      };
   },
   mounted() {
      // console.log(this.$route)
   },
};
</script>
