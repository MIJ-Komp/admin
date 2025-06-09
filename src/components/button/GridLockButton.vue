<template>
   <div class="grid-lock-button-container" :id="uniqueId">
      <button class="lock-button" :id="uniqueId2">
         {{ params.item.data.TTLockName ?? "Select Lock" }}
      </button>
   </div>
</template>

<script>
export default {
   data() {
      return {
         uniqueId: "button-" + Math.ceil(Math.random() * 1000000),
         uniqueId2: "lock-button-" + Math.ceil(Math.random() * 1000000),
      };
   },
   mounted() {
      setTimeout(() => {
         if (this.params.contexts && this.params.contexts.length > 0) {
            var action = document.getElementById(this.uniqueId);
            action.addEventListener("click", () => {
               this.params.contexts
                  .find((c) => c.isLock)
                  .action(this.params.item.data);
            });
         }
      }, 10);
   },
};
</script>
<style>
.lock-button {
   color: var(--blue-400);
}
</style>
