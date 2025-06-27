<template>
  <MIJForm :formData="formData" :createAction="doCreate" :updateAction="doUpdate" :showCancel="showCancel" @cancel="$emit('cancel')">
    <!-- Basic Inputs -->
    <b-row>
      <b-col cols="12">
        <FileInput label="Photo" v-model="form.pictureId" :multiple="true" />
      </b-col>
      <b-col cols="9" class="mt-3">
        <TextBox label="Nama Produk" type="name" v-model="form.name" />
      </b-col>
      <b-col cols="3" class="mt-3">
        <Switch label="Active?" v-model="form.isActive" />
      </b-col>
      <b-col cols="12" class="mt-3">
        <SelectModuleBox :module="$module.productCategory" label="Product Category" v-model="form.productCategoryId" />
      </b-col>
      <b-col cols="12" class="mt-3">
        <TextEditor :required="false" label="Deskripsi" v-model="form.description" />
      </b-col>
    </b-row>

    <!-- Variants -->
    <div class="mt-3">
      <div style="display: flex; justify-content: space-between">
        <div>Variants :</div>
        <Button @click.prevent="" class="p-2" label="Import variant" style="width: 200px !important" />
      </div>

      <div
        class="ms-3 mt-3 variant-container"
        v-for="(variant, i) in form.productVariantOptions"
        :key="variant.id"
        style="position: relative"
      >
        <TextBox style="width: 300px" :label="`Variant ${i + 1}`" placeholder="Color, Size, etc.." v-model="variant.name" />
        <i @click="removeVariant(variant.id)" class="fa fa-times del-variant" />

        <div class="mt-3">Option :</div>
        <b-row class="ms-2">
          <b-col
            class="mt-2"
            cols="12"
            lg="3"
            md="4"
            sm="4"
            v-for="(option, j) in getVariantOptionValues(variant.id)"
            :key="option.id"
            style="position: relative"
          >
            <TextBox placeholder="Red, Green, XL..." v-model="option.name" />
            <i
              v-if="j !== 0 || getVariantOptionValues(variant.id).length > 1"
              @click="removeOption(option.id)"
              style="top: -6px; right: 6px"
              class="fa fa-times del-variant-values"
            />
          </b-col>
          <b-col cols="6" lg="3" md="4" sm="4" class="flex-row addVariantButton mt-2" >
            <Button class="ps-4 pe-4" @click.prevent="addMoreVariantOption(variant.id)" iconFa="fa fa-plus" buttonType="secondary" label="Add more" style="margin-right: 20px" />
          </b-col>
        </b-row>
      </div>

      <b-col cols="12" lg="3" md="3" class="flex-row addVariantButton mt-3 ms-2">
        <Button class="ps-4 pe-4" @click.prevent="addMoreVariant()" iconFa="fa fa-plus" buttonType="secondary" label="variant" style="margin-right: 20px" />
      </b-col>
    </div>

    <!-- Specs -->
    <div style="border-top: 1px solid #dedede" class="mt-3 mb-3 pt-3 pb-3">
      <div>Specs :</div>
      <b-row class="ms-2">
        <b-col
          cols="12"
          lg="3"
          md="4"
          sm="4"
          class="mt-3"
          v-for="spec in form.specs"
          :key="spec.id"
          style="position: relative"
        >
          <SelectBox v-model="spec.specKey" :dataSource="$constant.specKeys.filter(a => !form.specs.map(data => data.specKey).includes(a.value) || a.value === spec.specKey)" optionLabel="label" optionValue="value" labelType="out" />
          <i @click="removeSpecs(spec.id)" class="fa fa-times del-variant-values" style="top: -6px; right: 6px" />
        </b-col>
        <b-col
          cols="6"
          lg="3"
          md="4"
          sm="4"
          class="flex-row addVariantButton mt-3"
          v-if="form.specs.length === 0 || (form.specs.at(-1)?.specKey && $constant.specKeys.filter(a => !form.specs.map(data => data.specKey).includes(a.value)).length > 0)"
        >
          <Button class="ps-4 pe-4" @click.prevent="addMoreSpecs()" iconFa="fa fa-plus" buttonType="secondary" label="Spec" style="margin-right: 20px" />
        </b-col>
      </b-row>
    </div>

    <!-- SKU Table -->
    <div class="mt-4">
      <div>SKU:</div>
      <div class="table-container">
         <div class="mt-2 pb-3" style="width: fit-content; border-bottom: 1px solid #dedede;">
            <table class="custom-table mt-3" id="skuModel">
               <tbody>
                  <tr>
                     <template v-for="(variant, i) in form.productVariantOptions" :key="variant.id">
                        <td v-if="variant.name?.trim() && getVariantOptionValues(variant.id).filter(data=> data.name?.trim()).length > 0" style="place-items: center;">
                           <div>{{ variant.name }}</div>
                           <div style="font-size: 10px;">(variant {{ i+1 }})</div>
                           </td>
                     </template>
                     <template v-for="spec in form.specs" :key="spec.id">
                        <td v-if="spec.specKey?.trim()"><input type="text" :placeholder="`input ${spec.specKey}`" :value="getDefaultSpec(spec.specKey)?.specValue" @change="updateDefaultSpec(spec.specKey, $event.target.value)"/></td>
                     </template>
                     <td><input placeholder="Input Price" v-model="defaultSku.price"></td>
                     <td><input placeholder="Input Quantity" v-model="defaultSku.quantity"></td>
                     <td><input placeholder="Input Alert" v-model="defaultSku.quantityAlert"></td>
                     <td><input placeholder="Input Kode" v-model="defaultSku.code"></td>
                     <td><input placeholder="Input SKU Name" v-model="defaultSku.name"></td>
                  </tr>
               </tbody>

            </table>
            
            <Button class="mt-2 pt-1 pb-1 ps-4 pe-4" @click.prevent="applyToAllSku" buttonType="secondary" label="👇 Apply to All 👇" style="width: 170px !important;"/>
         </div>
        <table class="custom-table mt-3">
          <thead>
            <tr>
              <template v-for="(variant, i) in form.productVariantOptions" :key="variant.id">
                <td v-if="variant.name?.trim() && getVariantOptionValues(variant.id).filter(data=> data.name?.trim()).length > 0" style="place-items: center;">
                  <div>{{ variant.name }}</div>
                  <div style="font-size: 10px;">(variant {{ i+1 }})</div>
                  </td>
              </template>
              <template v-for="spec in form.specs" :key="spec.id">
                <td v-if="spec.specKey?.trim()">{{ spec.specKey }}</td>
              </template>
              <td>Price</td>
              <td>Quantity</td>
              <td>Alert</td>
              <td>Kode</td>
              <td>SKU Name</td>
            </tr>
          </thead>
          <tbody id="variantTableBody">
            <tr v-for="(combo, rowIndex) in variantCombinations" :key="rowIndex">
               <template v-for="(item, colIndex) in combo">
                  <td v-if="rowspanMap[`${rowIndex}-${colIndex}`] > 0"
                     :rowspan="rowspanMap[`${rowIndex}-${colIndex}`]">
                     {{ item.name }}
                  </td>
               </template>
               <template v-for="(spec, specIndex) in form.specs" :key="spec.id">
                <td v-if="spec.specKey?.trim()">
                  <input type="text" placeholder="input..."
                     :value="getProductSpec(combo, spec.specKey)?.specValue"
                     @change="updateProductSpec(combo, spec.specKey, $event.target.value)"/>
                </td>
              </template>
               <!-- tambahkan kolom input lainnya di sini -->
                <td><input placeholder="Input Price" :value="getSku(combo)?.price"
                     @change="updateSku(combo, 'price', $event.target.value)"></td>
               <td><input placeholder="Input Quantity" :value="getSku(combo)?.quantity"
                     @change="updateSku(combo, 'quantity', $event.target.value)"></td>
               <td><input placeholder="Input Quantity Alert" :value="getSku(combo)?.quantityAlert"
                     @change="updateSku(combo, 'quantityAlert', $event.target.value)"></td>
               <td><input placeholder="Input Kode" :value="getSku(combo)?.code"
                     @change="updateSku(combo, 'code', $event.target.value)"></td>
               <td><input placeholder="Input SKU Name" :value="getSku(combo)?.name"
                     @change="updateSku(combo, 'name', $event.target.value)"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MIJForm>
</template>

<script>
import { mapActions } from 'vuex';
import module from '../../../constant/module';

export default {
  props: {
    showCancel: { type: Boolean, default: false },
  },
  data() {
    return {
      formData: { module: this.$module.product },
      form: {
        name: null,
        description: null,
        pictureId: [],
        productVariantOptions: [],
        productVariantOptionValues: [],
        productSkus: [],
        productSkuVariants: [],
        specs: [],
      },
      defaultSku:{
         price: null,
         quantity: null,
         quantityAlert: null,
         code: null,
         name: null,
         productSpecs:[]
      },
      combinationData:[]
    };
  },
  computed: {
    variantCombinations() {
      const groupedValues = this.form.productVariantOptions
        .filter((v) => v.name?.trim() && this.getVariantOptionValues(v.id).filter(data=> data.name?.trim()).length > 0)
        .map((v) => this.getVariantOptionValues(v.id).filter(data=> data.name?.trim())
      );
      const combine = (arr) => {
        if (arr.length === 0) return [[]];
        const [first, ...rest] = arr;
        const restComb = combine(rest);
        return first.flatMap((f) => restComb.map((r) => [f, ...r]));
      };
      return combine(groupedValues);
    },
    rowspanMap() {
      return this.getRowspanMap();
   }
  },
  watch:{
   variantCombinations: {
      handler(newVal) {
         this.combinationData = newVal.map((combo) => {
         const exist = this.combinationData.find(
            (data) => JSON.stringify(data.skuCom) === JSON.stringify(combo)
         );
         return {
            price: exist?.price ?? null,
            quantity: exist?.quantity ?? null,
            quantityAlert: exist?.quantityAlert ?? null,
            code: exist?.code ?? null,
            name: exist?.name ?? null,
            skuCom: combo,
            productSpecs: this.form.specs.map(data=> {
               var existSpec = exist?.productSpecs?.find(ps=> ps.specKey == data.specKey)
               return {
                  id: existSpec?.id ??  this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.productSpecs.map(ps => ps.id))),
                  specKey : existSpec?.specKey ?? data.specKey,
                  specValue : existSpec?.specValue ?? null,
               }
         })
         };
         });
      },
      immediate: true,
      deep: true
   }
  },
  methods: {
   doCreate(){
      console.log(this.form)
      console.log(this.combinationData)
      return Promise.reject("Please Choose Icon");
   },
   applyToAllSku(){
      this.combinationData.forEach(data=>{
         data.price =  this.defaultSku.price || data.price
         data.quantity =  this.defaultSku.quantity || data.quantity
         data.quantityAlert =  this.defaultSku.quantityAlert || data.quantityAlert
         data.code =  this.defaultSku.code || data.code
         data.name =  this.defaultSku.name || data.name
         data.productSpecs= this.form.specs.map(formSpec=> {
               var existDefaultSpec = this.getDefaultSpec(formSpec.specKey)
               var existSpec = data?.productSpecs?.find(ps=> ps.specKey == formSpec.specKey)

               if(!existSpec){
                  existSpec = {
                     id: this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.productSpecs.map(ps => ps.id))),
                     specKey : formSpec.specKey,
                     specValue : null,
                  }
               }
               if(existDefaultSpec?.specValue){
                  existSpec.specValue = existDefaultSpec?.specValue
               }

               return existSpec
            })
      })
   },
   getSku(combo) {
    return this.combinationData.find(data => JSON.stringify(data.skuCom) === JSON.stringify(combo));
  },
  updateSku(combo, key, value) {
    const sku = this.getSku(combo);
    if (sku) {
      sku[key] = value;
    }
  },
  getProductSpec(combo, specKey){
      var sku = this.getSku(combo)
      if(sku) return sku.productSpecs.find(data=> data.specKey == specKey)
      return null;
  },
  updateProductSpec(combo, specKey, value){
    const sku = this.getSku(combo);
    if (sku) {
      var specIndex = sku.productSpecs.findIndex(data=> data.specKey == specKey)
      if(specIndex >= 0){
         sku.productSpecs[specIndex].specValue = value
      }
      else{
         sku.productSpecs.push({
            id: this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.productSpecs.map(ps => ps.id))),
            specKey : specKey,
            specValue : value,
         })
      }
      console.log(this.getSku(combo))
    }
  },
  getDefaultSpec(specKey){
      return this.defaultSku.productSpecs.find(data=> data.specKey == specKey)
  },
  updateDefaultSpec(specKey, value){
   var defaultSpec = this.getDefaultSpec(specKey);
    if (defaultSpec) {
      defaultSpec.specValue = value;
    }
    else{
      this.defaultSku.productSpecs.push({specKey: specKey, specValue: value})
    }
  },

   getRowspanMap() {
      const map = {};
      const keys = this.form.productVariantOptions.map(v => v.id);
      const rows = this.variantCombinations;

      keys.forEach((key, colIndex) => {
         let prev = null;
         let count = 1;
         let prevRow = 0;
         let prevColumn = 0;

         rows.forEach((row, rowIndex) => {
            const current = row[colIndex]?.id;
            if (current === prev) {
               count++;
               map[`${rowIndex}-${colIndex}`] = 0;
               map[`${prevRow}-${prevColumn}`] = count;
            } else {
               count = 1;
               map[`${rowIndex}-${colIndex}`] = 1;
               prev = current;
               prevRow = rowIndex;
               prevColumn = colIndex;
            }
         });
      });

      return map;
   },

    getVariantOptionValues(id) {
      return this.form.productVariantOptionValues.filter((d) => d.productVariantOptionId === id);
    },
    addMoreVariant() {
      const id = this.$helper.GenerateUUID(this.form.productVariantOptions.map((d) => d.id));
      this.form.productVariantOptions.push({ id, name: '' });
      this.addMoreVariantOption(id);
    },
    addMoreVariantOption(variantId) {
      const newValId = this.$helper.GenerateUUID(this.form.productVariantOptionValues.map((d) => d.id));
      this.form.productVariantOptionValues.push({ id: newValId, name: '', productVariantOptionId: variantId });
    },
    removeVariant(id) {
      this.form.productVariantOptions = this.form.productVariantOptions.filter((d) => d.id !== id);
    },
    removeOption(id) {
      this.form.productVariantOptionValues = this.form.productVariantOptionValues.filter((d) => d.id !== id);
    },
    addMoreSpecs() {
      this.form.specs.push({ id: this.$helper.GenerateUUID(this.form.specs.map((d) => d.id)), specKey: null });
    },
    removeSpecs(id) {
      this.form.specs = this.form.specs.filter((d) => d.id !== id);
    },
    ...mapActions(module.product.name, ['create', 'getById', 'update']),
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