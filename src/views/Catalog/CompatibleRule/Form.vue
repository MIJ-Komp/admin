<template>
   <div class="p-3 compatible-rule-container">
      <b-row>
         <b-col>
            <SelectModuleBox class="mb-2" :required="false" v-model="filter.sourceComponentTypeCode" placeholder="filter component type" :module="$module.componentType" optionValue="code" label="Filter Source Component Type" />
         </b-col>
          <b-col>
            <SelectModuleBox class="mb-2" :required="false" v-model="filter.targetComponentTypeCode" placeholder="filter component type" :module="$module.componentType" optionValue="code" label="Filter Target Component Type" />
         </b-col>
      </b-row>
      <table class="custom-table">
         <thead>
            <tr>
               <td>Source</td>
               <td>Compare With</td>
               <td>Condition</td>
               <td>Action</td>
            </tr>
         </thead>
         <tbody>
            <tr v-for="(rule, index) in getRules()">
               <td>
                  <SelectModuleBox :disabled="!rule.editing" class="mb-2" v-model="rule.sourceComponentTypeCode" placeholder="select component type" :module="$module.componentType" optionValue="code" label="Component Type" />
                  <SelectBox :disabled="!rule.editing" ref="mainSpecKey" label="Component Spec" v-model="rule.sourceKey" :dataSource="groupSpecs" optionGroupLabel="groupId" optionGroupChildren="items" optionLabel="label" optionValue="value" labelType="out" />
               </td>
               <td>
                  <SelectModuleBox :disabled="!rule.editing" class="mb-2" v-model="rule.targetComponentTypeCode" optionValue="code" :module="$module.componentType" label="Component Type" />
                  <SelectBox :disabled="!rule.editing" ref="ruleSpecKey" label="Component Spec" v-model="rule.targetKey" :dataSource="groupSpecs" optionGroupLabel="groupId" optionGroupChildren="items" optionLabel="label" optionValue="value" labelType="out" />
               </td>
               <td>
                  <SelectBox :disabled="!rule.editing" v-model="rule.condition" label="Rule" :dataSource="Object.keys($constant.conditionRule).map(condition=>{ return {label:$constant.conditionRule[condition], value: condition}})" optionLabel="label" optionValue="value" labelType="out" />
               </td>
               <td>
                  <Button @click="deleteRule(index)" buttonType="danger" label="delete" class="p-0 mb-1"/>
                  <Button @click="rule.editing = true" v-if="!rule.editing" label="Edit" class="p-0 mb-1"/>
                  <Button @click="refresh()" buttonType="secondary" v-if="rule.editing && rule.id" label="Cancel" class="p-0 mb-1"/>
                  <Button @click="save(rule)" label="Save" v-if="rule.editing" class="p-0 mb-1"/>
               </td>
            </tr>
         </tbody>
      </table>
      
      <Button class="mt-2" @click.prevent="addRule()" label="Add Compatibility Rule" style="height: 30px;"/>
   </div>
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


      this.refresh()
   },
   methods: {
      getRules(){
         return this.rules.filter(data=>
            (!this.filter.sourceComponentTypeCode || data.sourceComponentTypeCode == this.filter.sourceComponentTypeCode)
            && (!this.filter.targetComponentTypeCode || data.targetComponentTypeCode == this.filter.targetComponentTypeCode)
         )
      },
      async deleteRule(index) {
         if(this.rules[index].id){
            var confirm = await this.$dialog.Confirmation.confirm({
               title: "Konfirmasi",
               message: "Anda yakin akan menghapus data ini?",
            });
            if(!confirm) return
            this.delete(this.rules[index].id)
            .then((res)=>{
               this.$showToast.success('Success delete rule')
               this.refresh()
            })
            .catch((err)=>{
               this.$showToast.error('Failed to delete rule',err)
            })
         }
         else{
            this.rules.splice(index, 1);
            this.refresh()
         }
        
      },
      async refresh(){
         this.rules = await this.getAll()
      },
      async save(rule){
         if(rule.id){
            this.update(rule)
            .then(()=>{
               this.$showToast.success('Success update')
               this.refresh()
            })
            .catch((err)=>{
               this.$showToast.error('Failed to update',err)
            })
         }
         else{
            await this.create(rule)
            .then(()=>{
               this.$showToast.success('Success create new rule')
               this.refresh()
            })
            .catch((err)=>{
               this.$showToast.error('Failed to create new rule',err)
            })
         }
      },
      addRule(){
         this.rules.push(
            { 
               sourceComponentTypeCode: null, 
               targetComponentTypeCode: null, 
               sourceKey: null, 
               targetKey: null, 
               condition: null,
               editing: true 
            },
         )
      },
      removeRule(rule){
         this.rules = this.rules.filter(data=> data != rule)
      },
      doCreate() {
         return this.create(this.form);
      },
      doUpdate() {
         return this.update(this.form);
      },
      ...mapActions(module.compatibleRule.name, ["getAll","create", "getById", "update"]),
   },
   
   watch: {},
   data() {
      return {
         formData: {
            module: this.$module.componentType,
         },
         filter:{
            sourceComponentTypeCode: null,
            targetComponentTypeCode: null,
         },
         rules: [
            { 
               sourceComponentTypeCode: null, 
               targetComponentTypeCode: null, 
               sourceKey: null, 
               targetKey: null, 
               condition: null,
               editing: true 
            },
         ],
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
         // this.rules=[
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

table.custom-table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 14px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }

  table.custom-table th,
  table.custom-table td {
    padding: 12px 16px;
    border: 1px solid #ddd;
    text-align: left;
    align-content: start !important;
    overflow-wrap: break-word;
    overflow: hidden;
    width: 150px !important;
    min-width: 150px !important;
    max-width: auto !important;
  }

  table.custom-table input, table.custom-table select{
    border: 1px solid #dedede;
    border-radius: 4px;
  }

  table.custom-table th {
    background-color: #f7f7f7;
    color: #333;
    font-weight: bold;
  }

  table.custom-table tr:nth-child(even) {
    background-color: #fafafa;
  }

  table.custom-table tbody tr{
    background-color: #f1f1f1;
  }

  /* Responsive kecil */
  @media (max-width: 600px) {
    table.custom-table {
      font-size: 12px;
    }

    table.custom-table th,
    table.custom-table td {
      padding: 8px;
    }
  }

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
   background: red;
   color: white;
   right: 0;
   top: -10px;
   border-radius: 8px;
   font-size: 14px;
   width: fit-content !important;
   cursor: pointer;
}
.compatible-rule-container{
   background: white;
}
</style>
