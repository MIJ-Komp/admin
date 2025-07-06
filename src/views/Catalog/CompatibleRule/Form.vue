<template>
   <MIJForm
      :formData="formData"
      :createAction="doCreate"
      :updateAction="doUpdate"
      :showCancel="showCancel"
      @cancel="$emit('cancel')"
   >
      <b-row>
         <b-col cols="12">
            <SelectModuleBox v-model="form.componentTypeCode" :module="$module.componentType" optionValue="code" label="Main Component Type" />
         </b-col>
      </b-row>
      <div class="flex-row mt-3 pb-3" style="border-bottom: 1px solid #dedede;">
         <b-col>Compatible Rules:</b-col>
         <Button @click.prevent="addRule()" label="Add Compatibility Rule" style="height: 30px; width: 200px !important;"/>
      </div>
      <div class="p-2 rule-container">
         <b-row class="mt-3 rule-item" v-for="rule in form.rules">
           <i @click="removeRule(rule)" class="fa fa-trash del-rule"/>
            <b-col lg="3" md="6" cols="12" class="mt-2">
               <SelectBox ref="mainSpecKey" label="Main Component Spec" v-model="rule.mainSpecKey" :dataSource="groupSpecs" optionGroupLabel="groupId" optionGroupChildren="items" optionLabel="label" optionValue="value" labelType="out" />
            </b-col>
           <b-col lg="3" md="6" cols="12" class="mt-2">
               <SelectModuleBox v-model="rule.componentTypeCode" optionValue="code" :module="$module.componentType" label="Compare With Component" />
            </b-col>
            <b-col lg="3" md="6" cols="12" class="mt-2">
               <SelectBox ref="ruleSpecKey" label="Compare Spec" v-model="rule.specKey" :dataSource="groupSpecs" optionGroupLabel="groupId" optionGroupChildren="items" optionLabel="label" optionValue="value" labelType="out" />
            </b-col>
            <b-col lg="3" md="6" cols="12" class="mt-2">
               <SelectBox v-model="rule.condition" label="Comparison Rule" :dataSource="Object.keys($constant.conditionRule).map(condition=>{ return {label:$constant.conditionRule[condition], value: condition}})" optionLabel="label" optionValue="value" labelType="out" />
            </b-col>
         </b-row>
      </div>
   </MIJForm>
</template>
<script>
import module from "../../../constant/module";
import { mapActions } from "vuex";
export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   created() {
      const groupedSpecKeys = this.$constant.specKeys.reduce((acc, curr) => {
         if (!acc[curr.groupId]) {
         acc[curr.groupId] = [];
         }
         acc[curr.groupId].push(curr);
         return acc;
      }, {});
      this.groupSpecs = Object.entries(groupedSpecKeys).map(([groupId, items]) => ({
         groupId,
         items
      }));
   },
   methods: {
      addRule(){
         this.form.rules.push(
            { 
               componentTypeCode: null, 
               specKey: null, 
               condition: null 
            },
         )
      },
      removeRule(rule){
         this.form.rules = this.form.rules.filter(data=> data != rule)
      },
      doCreate() {
         return this.create(this.form);
      },
      doUpdate() {
         return this.update(this.form);
      },
      ...mapActions(module.compatibleRule.name, ["create", "getById", "update"]),
   },
   
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.componentType,
         },
         form: {
            componentTypeCode: "Motherboard",
            rules: [
               { 
                  componentTypeCode: "CPU", 
                  mainSpecKey: "processor_socket", 
                  specKey: "processor_socket", 
                  condition: "equals" 
               },
               { 
                  componentTypeCode: "CPU", 
                  specKey: "generation", 
                  condition: "one_of" 
               },
               { 
                  componentTypeCode: "RAM", 
                  specKey: "ram_type", 
                  condition: "equals" 
               },
               { 
                  componentTypeCode: "RAM", 
                  specKey: "ram_speed", 
                  condition: "max" },
               { 
                  componentTypeCode: "RAM", 
                  specKey: "capacity", 
                  condition: "max" 
               },
               { 
                  componentTypeCode: "RAM", 
                  specKey: "module_count", 
                  condition: "max" 
               },
               { 
                  componentTypeCode: "GPU", 
                  specKey: "pci_version", 
                  condition: "max" 
               },
               { 
                  componentTypeCode: "Case", 
                  specKey: "supported_form_factors", 
                  condition: "one_of" 
               },
               { 
                  componentTypeCode: "Storage", 
                  specKey: "interface", 
                  condition: "one_of" 
               }
            ]
         },
         groupSpecs:[]
      };
   },
   async mounted() {
      // // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
      }
      else if(this.$route.meta.formMode == this.$constant.formMode.create){
         // this.form.rules=[
         //    {
         //       componentTypeCode:null,
         //       specKey:null,
         //       condition: null,

         //    }
         // ]
      }
   },
};
</script>

<style>
.rule-container{
   height: 57vh;
   overflow: auto;
}
.rule-item{
   position: relative;
   padding: 8px;
   border: 1px solid #dedede;
   border-radius: 8px;
   margin: 0 !important;
   box-shadow: 2px 2px 8px -1px var(--grey-600);
}
.del-rule{
   position: absolute;
   left: -12px;
   top: -8px;
   width: 6px !important;
   height: 6px !important;
   cursor: pointer;
}
</style>
