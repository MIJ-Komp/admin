<template>
   <div class="grid-action-container" :id="uniqueId">
      <i :id="uniqueId2" />
   </div>
</template>

<script>
export default {
   data() {
      return {
         uniqueId: "button" + Math.ceil(Math.random() * 1000000),
         uniqueId2: "icon" + Math.ceil(Math.random() * 1000000),
      };
   },
   mounted() {
      this.$nextTick(()=>{
         document.getElementById(this.uniqueId2).className =
            this.params.contexts[0].Icon;

         if (this.params.contexts && this.params.contexts.length > 0) {
            var action = document.getElementById(this.uniqueId);
            action.addEventListener("click", () => {
               this.params.contexts[0].action(this.params.item.data);
            });
         }
      })
   },
};
</script>
