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
            <FileInput label="Photo" v-model="form.pictureId" :multiple="true"/>
         </b-col>
         <b-col cols="9" class="mt-3">
            <TextBox
               label="Nama Produk"
               type="name"
               v-model="form.name"
            />
         </b-col>
         <b-col cols="3" class="mt-3" style="align-content: center;">
            <Switch label="Active?" v-model="form.isActive"/>
         </b-col>
         <b-col cols="12" class="mt-3">
            <SelectModuleBox :module="$module.productCategory" label="Product Category" v-model="form.productCategoryId"/>
         </b-col>
         <b-col cols="12" class="mt-3">
            <TextEditor
               :required="false"
               label="Deskripsi"
               v-model="form.description"
            />
         </b-col>
      </b-row>
      <div class="mt-3">
         <div style="display: flex; justify-content: space-between;">
            <div>Variants :</div>
            <Button @click.prevent="" class="p-2" label="Import variant" style="width: 200px !important;"/>
         </div>
         <div class="ms-3 mt-3 variant-container" v-for="(variant, i) in form.productVariantOptions" key="varian" style="position: relative;">
            <TextBox style="width:300px" @change="getVariantData()" :label="`variant ${i+1}`" placeholder="Color, Size, etc.." v-model="variant.name"/>
            <i @click="removeVariant(variant.id)" class="fa fa-times del-variant"/>
            
            <div>
               <div class="mt-3">Option :</div>
               <b-row class="ms-2">
                  <b-col cols="12" lg="3" md="4" sm="4" v-for="(option, j) in getVariantOptionValues(variant.id)" style="position: relative;">
                     <TextBox @change="getVariantData()" :label="`option ${j+1}`" placeholder="Red, Green, XL, M, S, etc..." v-model="option.name"/>
                     <i v-if="j != 0 || getVariantOptionValues(variant.id).length > 1" @click="removeOption(option.id)" class="fa fa-times del-variant-values"/>
                  </b-col>
                  <b-col cols="6" lg="3" md="4" sm="4" @click="createForm" class="flex-row addVariantButton mt-3">
                     <Button class="ps-4 pe-4" @click.prevent="addMoreVariantOption(variant.id)" iconFa="fa fa-plus"  buttonType="secondary" label="Add more" style="margin-right: 20px;"/>
                  </b-col>
               </b-row>
            </div>
         </div>
          <b-col cols="12" lg="3" md="3" @click="createForm" class="flex-row addVariantButton mt-3 ms-2">
            <Button class="ps-4 pe-4" @click.prevent="addMoreVariant()" iconFa="fa fa-plus"  buttonType="secondary" label="variant" style="margin-right: 20px;"/>
         </b-col>
      </div>
      <div style="border-top: 1px solid #dedede;" class="mt-3 mb-3 pt-3 pb-3">
         <div>Specs : </div>
         <b-row class="ms-2">
            <b-col cols="12" lg="3" md="4" sm="4" class="mt-3" v-for="spec in form.specs" style="position: relative;">
               <SelectBox @change="getVariantData()" v-model="spec.specKey" :dataSource="$constant.specKeys.filter(a=> !form.specs.map(data=> data.specKey).includes(a.value) || a.value == spec.specKey)" optionLabel="label" optionValue="value" labelType="out"/>

               <i @click="removeSpecs(spec.id)" class="fa fa-times del-variant-values" style="top: -6px; right: 6px;"/>
            </b-col>
            <b-col cols="6" lg="3" md="4" sm="4" class="flex-row addVariantButton mt-3" v-if="form.specs.length == 0 || (form.specs[form.specs.length -1]?.specKey && $constant.specKeys.filter(a=> !form.specs.map(data=> data.specKey).includes(a.value)).length > 0)">
               <Button class="ps-4 pe-4" @click.prevent="addMoreSpecs()" iconFa="fa fa-plus"  buttonType="secondary" label="Spec" style="margin-right: 20px;"/>
            </b-col>
         </b-row>
      </div>
      <div class="mt-4">
         <div>Sku :</div>
         <div class="table-container">
         <div class="mt-2 pb-3" style="width: fit-content; border-bottom: 1px solid #dedede;">
            <table class="custom-table mt-3" id="skuModel">
               <tbody>
                  <tr>
                     <template v-for="variant in form.productVariantOptions">
                        <td v-if="variant.name && variant.name.trim() != ' ' && variant.name.length>0">{{ variant.name }}</td>
                     </template>
                     <template v-for="spec in form.specs">
                        <td v-if="spec.specKey && spec.specKey.trim() != ' ' && spec.specKey.length>0">
                           <input @focus="HighlightColumn" @onblur="clearHighlight()" type="text" placeholder="input..."></td>
                     </template>
                     <td><input @focus="HighlightColumn" type="text" @blur="clearHighlight()" placeholder="input..."></td>
                     <td><input @focus="HighlightColumn" type="text" @blur="clearHighlight()" placeholder="input..."></td>
                     <td><input @focus="HighlightColumn" type="text" @blur="clearHighlight()" placeholder="input..."></td>
                     <td><input @focus="HighlightColumn" type="text" @blur="clearHighlight()" placeholder="input..."></td>
                     <td><input @focus="HighlightColumn" type="text" @blur="clearHighlight()" placeholder="input..."></td>
                  </tr>
               </tbody>

            </table>
            
            <Button class="mt-2 pt-1 pb-1 ps-4 pe-4" @click.prevent="applyToAllSku" buttonType="secondary" label="👇 Apply to All 👇" style="width: 170px !important;"/>
         </div>

         <table class="custom-table mt-3" id="table-sku">
            <thead>
               <tr>
                  <template v-for="variant in form.productVariantOptions">
                     <td v-if="variant.name && variant.name.trim() != ' ' && variant.name.length>0"><b>{{ variant.name }}</b></td>
                  </template>
                  <template v-for="spec in form.specs">
                     <td v-if="spec.specKey && spec.specKey.trim() != ' ' && spec.specKey.length>0"><b>{{ spec.specKey }}</b></td>
                  </template>
                  <td>Price</td>
                  <td>Quantity</td>
                  <td>Quantity Alert</td>
                  <td>Kode</td>
                  <td>SKU Name</td>
               </tr>
            </thead>
            <tbody id="variantTableBody"></tbody>
         </table>
         </div>
      </div>
   </MIJForm>
</template>
<script>
import { mapActions } from "vuex";
import module from "../../../constant/module";

export default {
   props: {
      showCancel: { type: Boolean, default: false },
   },
   created() {},
   watch: {},
   
   data() {
      return {
         formData: {
            module: this.$module.product,
         },
         form: {
            name: null,
            description: null,
            pictureId: null,
            productType: 'simple',
            productVariantOptions:[],
            productVariantOptionValues: [],
            productSkus: [],
            productSkuVariants: [],
            specs:[]
         },
         customHighlighIndex:null
      };
   },

   async mounted() {
      // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
      }
      else{
         // this.addMoreVariant()
      }

      this.getVariantData()

      console.log(this.form)
   },
   methods: {
      applyToAllSku(){

      },
      clearHighlight() {
         return
         const rows = document.querySelectorAll('#table-sku tr');
         rows.forEach(row => {
            const cells = row.children;
            console.log(cells)
            if (cells[this.customHighlighIndex]) {
               cells[this.customHighlighIndex].classList.remove('highlight-col');
            }
         });
         this.customHighlighIndex = null
      },
      HighlightColumn(event){
         return
         const td = event.target.closest('td');
         if (!td) return;

         // this.clearHighlight();

         const tr = td.parentElement;
         const tdList = Array.from(tr.children);
         const columnIndex = tdList.indexOf(td);
         this.customHighlighIndex = columnIndex
         const rows = document.querySelectorAll('#table-sku tr');
         rows.forEach(row => {
            const cells = row.children;
            console.log(cells)
            if (cells[columnIndex]) {
               cells[columnIndex].classList.add('highlight-col');
            }
         });
      },
      addMoreSpecs(){
         this.form.specs.push({
            id: this.$helper.GenerateUUID(this.form.specs.map(data=> data.id)),
            specKey: null,
            specValue: null,
         })
         this.getVariantData()
      },
      mergeTableColumn(columnIndex) {
         const table = document.getElementById("variantTableBody");
         let prevText = null;
         let rowspan = 1;
         let prevCell = null;

         for (let i = 0; i < table.rows.length; i++) {
            const cell = table.rows[i].cells[columnIndex];
            const text = cell.textContent;

            if (text === prevText) {
               rowspan++;
               cell.remove(); // hapus cell duplikat
               prevCell.rowSpan = rowspan; // tambah rowspan di cell sebelumnya
            } else {
               prevText = text;
               rowspan = 1;
               prevCell = cell;
            }
         }
      },
      getVariantData(){
         this.form.productVariantOptions.forEach((variant) => {
            var values = this.getVariantOptionValues(variant.id)
            
            values = values.map(option => {
               var sku = this.form.productSkuVariants.find(data=> data.productVariantOptionId == variant.id && data.productVariantOptionValueId == option.id)
               var currentSKU = this.form.productSkus.find(data=> data.id ==sku.productSkuId)
               return {...option, currentSKU}
            });
            variant.values = values;
         });

         this.customData = this.generateCombinations(this.form.productVariantOptions);
         
         // Render tabel
         const tableBody = document.getElementById("variantTableBody");
         if(!tableBody)
            return
      
         tableBody.innerHTML = ''
         
         if(this.customData.length > 0){
            this.customData.forEach((combination, i) => {
               var row = document.createElement("tr");
               // Tambahkan kolom untuk varian
               combination.forEach((value, j) => {
                  const cell = document.createElement("td");
                  cell.dataset.variantId = value.id;
                  cell.textContent = value.name;
                  // cell.rowSpan = combination.filter(data=> data.name == value.name).length
                  
                  row.appendChild(cell);
               });
               this.form.specs.filter(spec => spec.specKey).forEach(label => {
                  const cell = document.createElement("td");
                  cell.innerHTML = `<input type="text" placeholder="input...">`;
                  row.appendChild(cell);
               });

               row = this.addDefaultSkuColumn(row);
               tableBody.appendChild(row);
            });
         }
         else{
            var row = document.createElement("tr");
            this.form.specs.filter(spec => spec.specKey).forEach(label => {
               const cell = document.createElement("td");
               cell.innerHTML = `<input type="text" placeholder="input...">`;
               row.appendChild(cell);
            });
            row = this.addDefaultSkuColumn(row);
            tableBody.appendChild(row);
         }
         
         
        
         for (let index = this.form.productVariantOptions.length -1; index >= 0; index--) {
            console.log("hadeh")
            this.mergeTableColumn(index)
         }
         return this.customData
      },
      addDefaultSkuColumn(row){
         for (let index = 0; index < 5; index++) {
            const tmpCell = document.createElement("td");
            tmpCell.innerHTML = `<input type="text" placeholder="${index == 0 ?'Rp ...' :'input ...'}">`;
            row.appendChild(tmpCell)
         }
         return row
      },
      cekData(){
         console.log(this.getVariantData())
      },
      generateCombinations(options) {
         const groupedValues = options.filter(variant=> variant.name && variant.name.trim() != ' ' && variant.name.length>0).map(option => option.values);
         
         const combine = (arr) => {
            if (arr.length === 0) return [[]];
            const first = arr[0];
            const rest = combine(arr.slice(1));
            return first.flatMap(f => rest.map(r => [f, ...r]));
         };

         return combine(groupedValues);
      },
      removeVariant(variantId){
         const index = this.form.productVariantOptions.findIndex(data=> data.id == variantId)
         this.form.productVariantOptions.splice(index, 1)
         this.getVariantData()
      },
      removeSpecs(id){
         const index = this.form.specs.findIndex(data=> data.id == id)
         this.form.specs.splice(index, 1)
         this.getVariantData()
      },
      removeOption(optionId){
         const index = this.form.productVariantOptionValues.findIndex(data=> data.id == optionId)
         this.form.productVariantOptionValues.splice(index, 1)
         this.getVariantData()
      },
      addMoreVariantOption(id){
         const newProductVariantOptionValues =  
         {
            id: this.$helper.GenerateUUID(this.form.productVariantOptionValues.map(data=> data.id)),
            name: null,
            productVariantOptionId: id
         }
         this.form.productVariantOptionValues.push(newProductVariantOptionValues)

         var newProductSkus=
            {
               id: this.$helper.GenerateUUID(this.form.productSkus.map(data=> data.id)),
               isActive: true,
               name: null,
               price: 0,
               qty: 0,
               qtyAlert: 0,
               sku: null
            }
         this.form.productSkus.push(newProductSkus)

         var newProductSkuVariants = 
            {
               id: this.$helper.GenerateUUID(this.form.productSkuVariants.map(data=> data.id)),
               productSkuId: newProductSkus.id,
               productVariantOptionId: id,
               productVariantOptionValueId: newProductVariantOptionValues.id
         }

         this.form.productSkuVariants.push(newProductSkuVariants)

         this.getVariantData()
      },
      addMoreVariant(){
         var newVariant = {
               id: this.$helper.GenerateUUID(this.form.productVariantOptions.map(data=> data.id)),
               name: null
         }
         this.form.productVariantOptions.push(newVariant)
         this.addMoreVariantOption(newVariant.id)
      },
      getVariantOptionValues(varianId){
         return this.form.productVariantOptionValues.filter(data=> data.productVariantOptionId == varianId)
      },
      chooseIcon(i) {
         // // console.log(i)
         this.form.IconName = i;
      },
      doCreate() {
         if (!this.form.IconName) {
            return Promise.reject("Please Choose Icon");
         }

         return this.create(this.form);
      },
      doUpdate() {
         if (!this.form.IconName) {
            return Promise.reject("Please Choose Icon");
         }

         return this.update(this.form);
      },
      ...mapActions(module.product.name, [
         "create",
         "getById",
         "update",
      ]),
   },
};
</script>
<style>
th.highlight-col,
td.highlight-col {
  border-left: 3px solid red !important;
  border-right: 3px solid red !important;
}
.table-container{
   width: 100%;
   overflow: auto;
}
.addVariantButton button{
 height: 30px;
}
.icon-container {
   display: grid;
   gap: 16px;
   grid-template-columns: repeat(auto-fit, 58px);
   margin-top: 12px;
   padding: 10px;
}
.icon-container .icon {
   cursor: pointer;
}
.icon-container .icon:hover {
   transform: scale(1.05);
}
.icon-container .selected {
   border: 2px solid var(--blue-500);
}
.variant-container{
   background: var(--grey-400);
   border-radius: 4px;
   border: 0.5px solid var(--grey-600);
   padding: 8px;
}
thead tr{
   background: var(--primary-color);
   color: white;
}
thead tr:hover{
   background: var(--primary-color) !important;
   color: white !important;
}
.del-variant-values, .del-variant{
   background: red;
   color: white;
   border-radius: 50%;
   width: 12px;
   font-size: 10px;
   position: absolute;
   right: 10px;
   top: 10px;
   cursor: pointer;
   height: 12px;
   text-align: center;
}
.del-variant{
   top: -6px;
   right: -6px;
}

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

    overflow-wrap: break-word;
    overflow: hidden;
    width: 150px !important;
    min-width: 150px !important;
    max-width: auto !important;
  }

  table.custom-table th {
    background-color: #f7f7f7;
    color: #333;
    font-weight: bold;
  }

  table.custom-table tr:nth-child(even) {
    background-color: #fafafa;
  }

  table.custom-table tr:hover {
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
</style>
