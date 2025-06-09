{/* <template>
  <div class="flex items-center">
    <Checkbox
      v-model="currentData"
      :inputId="uniqueCheckId"
      :name="label"
      :checked="checked"
      :disabled="disable"
      binary
      class="ch-checkbox" ></Checkbox>
    <label :for="uniqueCheckId" class="ml-2" v-if="label">
      {{ label }}
    </label>
  </div>
</template>
<script>
import Checkbox from "primevue/checkbox";
export default {
  watch: {},
  data() {
    return {
      currentData: false,
    };
  },
  props: {
    label: { type: String, required: false, default: null },
    modelValue: { type: Boolean, required: false, default: false },
    disable: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
  },
  components: { Checkbox },
  computed: {
    uniqueCheckId() {
      return `check-box-identifier-${Math.ceil(Math.random() * 1000000)}`;
    },
  },
  watch: {
    currentData: {
      handler() {
        this.$emit("update:modelValue", this.currentData);
      },
      immediate: true,
    },
    checked: {
      handler() {
        this.currentData = this.checked;
      },
    },
  },
};
</script>
<style scoped>
.ch-checkbox {
  margin-right: 16px;
}
.ch-checkbox input {
  transform: scale(3) !important;
}
</style> */}
