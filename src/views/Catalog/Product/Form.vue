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
            <TextArea
               :required="false"
               label="Deskripsi"
               v-model="form.description"
            />
         </b-col>
      </b-row>
      <div class="mt-3">
         <div style="display: flex; justify-content: space-between;">
            <div>Variant :</div>
            <Button @click.prevent="" label="Duplicate from other Product" style="width: 200px !important;"/>
         </div>
         <div class="ms-3 mt-3 variant-container" v-for="(variant, i) in form.productVariantOptions" key="varian" style="position: relative;">
            <TextBox @change="getVariantData()" :label="`variant ${i+1}`" placeholder="Color, Size, etc.." v-model="variant.name"/>
            <i v-if="i != 0 || form.productVariantOptions.length > 1" @click="removeVariant(variant.id)" class="fa fa-times del-variant"/>
            
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
          <b-col cols="12" lg="4" md="4" @click="createForm" class="flex-row addVariantButton mt-3">
            <Button class="ps-4 pe-4" @click.prevent="addMoreVariant()" iconFa="fa fa-plus"  buttonType="secondary" label="Add more variant" style="margin-right: 20px;"/>
         </b-col>
      </div>
      <div class="mt-4" v-if="form.productVariantOptions.find(variant=> variant.name && variant.name.trim() != ' ' && variant.name.length>0)">

         <div>Variant List :</div>
         <table class="custom-table mt-3">
            <thead>
               <tr>
                  <template v-for="variant in form.productVariantOptions">
                     <td v-if="variant.name && variant.name.trim() != ' ' && variant.name.length>0">{{ variant.name }}</td>
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
            productSkuVariants: []
         },
         customData:null
      };
   },

   async mounted() {
      // console.log(this.$route)
      if (this.$route.meta.formMode == this.$constant.formMode.update) {
         const tmpForm = await this.getById(this.$route.params.id);
         this.form = Object.assign(this.form, tmpForm);
      }
      else{
         this.addMoreVariant()
      }
   },
   methods: {
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
         
         tableBody.innerHTML = null
         
         this.customData.forEach((combination, i) => {
            const row = document.createElement("tr");

            // Tambahkan kolom untuk varian
            combination.forEach((value, j) => {
               const cell = document.createElement("td");
               cell.textContent = value.name;
               // cell.rowSpan = combination.filter(data=> data.name == value.name).length
               
               row.appendChild(cell);
            });

            // Tambahkan kolom harga dan stok
            const priceCell = document.createElement("td");
            priceCell.innerHTML = '<input type="text" placeholder="Rp">';
            row.appendChild(priceCell);

            const stockCell = document.createElement("td");
            stockCell.innerHTML = '<input type="number" value="0">';
            row.appendChild(stockCell);

            const stockAlert = document.createElement("td");
            stockAlert.innerHTML = '<input type="number" value="0">';
            row.appendChild(stockAlert);

            const code = document.createElement("td");
            code.innerHTML = '<input type="number" value="0">';
            row.appendChild(code);

            const skuName = document.createElement("td");
            skuName.innerHTML = '<input type="number" value="0">';
            row.appendChild(skuName);

            tableBody.appendChild(row);
            });
        
         for (let index = this.form.productVariantOptions.length -1; index >= 0; index--) {
            this.mergeTableColumn(index)
         }
         return this.customData
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
