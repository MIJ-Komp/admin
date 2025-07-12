<template>
  <MIJForm 
    :formData="formData" 
    :createAction="doCreate" :updateAction="doUpdate" :showCancel="showCancel" @cancel="$emit('cancel')">
    <!-- Basic Inputs -->
    <b-row>
      <b-col cols="12">
        <FileInput label="Photo" v-model="form.imageIds" :multiple="true" />
      </b-col>
      <b-col lg="8" md="8" cols="12" class="mt-3">
        <TextBox label="Nama Produk" type="name" v-model="form.name" />
      </b-col>
      <b-col lg="4" md="4" cols="12" style="align-self: center;" class="mt-3">
        <Switch label="show Only in Marketplace?" v-model="form.isShowOnlyInMarketPlace" />
      </b-col>

      <b-col lg="4" md="6" cols="12" class="mt-3">
        <SelectModuleBox :required="false" :module="$module.brand" label="Brand" v-model="form.brandId" />
      </b-col>
      <b-col lg="4" md="6" cols="12" class="mt-3" v-if="form.productType != $constant.productType.group">
        <SelectModuleBox :required="false" :module="$module.componentType" label="Component Type" v-model="form.componentTypeId" />
      </b-col>
      <b-col lg="4" md="6" cols="12" class="mt-3">
        <SelectModuleBox :required="false" :module="$module.productCategory" label="Product Category" v-model="form.productCategoryId" />
      </b-col>

       <b-col lg="6" md="6" cols="12" class="mt-3">
        <TextBox :required="false" label="Youtube Url" type="name" v-model="form.videoUrl" />
      </b-col>
      <b-col lg="6" md="6" cols="12" class="mt-3">
        <TextBox :required="false" label="Tags" type="name" v-model="form.tags" />
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
    <!-- <div style="border-top: 1px solid #dedede" class="mt-3 mb-3 pt-3 pb-3" v-if="form.productType != $constant.productType.group">
      <SelectBox :required="false" label="Spec" @change="updateFormSpecs()" v-model="selectedSpecs" :multiSelect="true" :editable="true" :dataSource="groupSpecs" optionGroupLabel="groupId" optionGroupChildren="items" optionLabel="label" optionValue="value" labelType="out" /> -->

      <!-- <b-row class="ms-2">
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
      </b-row> -->
    <!-- </div> -->

    <!-- SKU Table -->
    <div class="mt-4">
      <div class="table-container">
        <div>Bulk SKU Editor:</div>
         <div class="mt-2 pb-3" style="width: fit-content; border-bottom: 1px solid #dedede;">
            <table class="custom-table mt-3" id="skuModel">
              <thead>
              <tr>
                <template v-for="(variant, i) in form.productVariantOptions" :key="variant.id">
                  <td v-if="variant.name?.trim() && getVariantOptionValues(variant.id).filter(data=> data.name?.trim()).length > 0" style="place-items: center;">
                    <div>{{ variant.name }}</div>
                    <div style="font-size: 10px;">(variant {{ i+1 }})</div>
                    </td>
                </template>
                <td v-if="form.productType == $constant.productType.group">Product Items</td>
                <td>SKU Name</td>
                
                <td v-if="form.specs.filter(data=> data).length > 0">Spec</td>
                <td>Price</td>
                <td>Stock</td>
                <td>Stock Alert</td>
                <!-- <td>Kode</td> -->
              </tr>
            </thead>
               <tbody>
                  <tr>
                    <template v-for="(variant, i) in form.productVariantOptions" :key="variant.id">
                        <td v-if="variant.name?.trim() && getVariantOptionValues(variant.id).filter(data=> data.name?.trim()).length > 0" style="place-items: center;">
                           <div>{{ variant.name }}</div>
                           <div style="font-size: 10px;">(variant {{ i+1 }})</div>
                           </td>
                     </template>

                    <td style="min-width: 250px !important;" v-if="form.productType == $constant.productType.group">
                      <div>
                        <div class="d-flex" v-for="product in defaultSku?.productGroupItems">
                          <SelecModuleBox v-model="product.productId" style="max-width: calc(100% - 12px);"/>
                          <Button buttonType="danger" iconFa="fa fa-trash" class="p-1" style="width: 12px !important;"/>
                        </div>
                        <Button @click="addProductGroupItems" class="p-1" label="add product items"/>
                      </div>
                    </td>
                     <td><input placeholder="Input SKU Name" v-model="defaultSku.name"></td>
                     
                     <td style="width: auto;" v-if="form.specs.filter(data=> data).length > 0">
                        <template v-for="(spec, specIndex) in form.specs" :key="spec.id">
                        <div class="flex-row mb-2" v-if="spec.specKey?.trim()">
                          <div style="text-wrap-mode: nowrap; min-width: 50%;">{{ spec.label }}</div> 
                          <input type="text" :placeholder="`input..`" :value="getDefaultSpec(spec.specKey)?.specValue" @change="updateDefaultSpec(spec.specKey, $event.target.value)"/>                        </div>
                        </template>
                      </td>
                     <td><input placeholder="Input Price" type="number" v-model="defaultSku.price"></td>
                     <td><input placeholder="Input Stock" v-model="defaultSku.stock"></td>
                     <td><input placeholder="Input Stock Alert" v-model="defaultSku.stockAlert"></td>
                     <!-- <td><input placeholder="Input Kode" v-model="defaultSku.code"></td> -->
                  </tr>
               </tbody>

            </table>
            <Button class="mt-2 pt-1 pb-1 ps-4 pe-4" @click.prevent="applyToAllSku" buttonType="secondary" label="👇 Apply to All 👇" style="width: 170px !important;"/>
         </div>
        <div>SKU:</div>
        <table class="custom-table mt-3">
          <thead>
            <tr>
              <template v-for="(variant, i) in form.productVariantOptions" :key="variant.id">
                <td v-if="variant.name?.trim() && getVariantOptionValues(variant.id).filter(data=> data.name?.trim()).length > 0" style="place-items: center;">
                  <div>{{ variant.name }}</div>
                  <div style="font-size: 10px;">(variant {{ i+1 }})</div>
                  </td>
              </template>
              <td v-if="form.productType == $constant.productType.group">Product Items</td>
              <td>SKU Name</td>
              <td v-if="form.specs.filter(data=> data).length > 0">Spec</td>
              <td>Price</td>
              <td>Stock</td>
              <td>Stock Alert</td>
              <!-- <td>Kode</td> -->
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
              <td style="min-width: 300px !important;" v-if="form.productType == $constant.productType.group">
                <div>
                  <div class="flex-row jc-spaceBetween mb-2" v-for="(product, index) in getSku(combo)?.productGroupItems">
                    <select :value="product.productId" v-model="product.productId" style="width: 200px !important" placeholder="Select Product">
                      <option :value="null">Select Product</option>
                      <option :value="p.id" v-for="p in getProductFiltered(getSku(combo)?.productGroupItems.map(data=> data.productId), product.productId)">{{ p.name }}</option>
                    </select>
                    <input v-model="product.qty" placeholder="Qty" type="number" style="width: 80px; border: 1px solid #dedede;" class="mx-1"/>
                    <i @click.stop.prevent="delProductGroupItems(combo, index)" class="text-danger fa fa-trash text-center" style="cursor: pointer; height: 30px; font-size: 18px; align-content: center;"></i>
                  </div>
                  <Button @click.stop.prevent="addProductGroupItems(combo)" class="p-1" label="add product items"/>
                </div>
              </td>
                <td>
                  <input placeholder="Input SKU Name" :value="getSku(combo)?.name"
                     @change="updateSku(combo, 'name', $event.target.value)">
                </td>
               
                <td style="width: auto;" v-if="form.specs.filter(data=> data).length > 0">
                  <template v-for="(spec, specIndex) in form.specs" :key="spec.id">
                  <div class="flex-row mb-2" v-if="spec.specKey?.trim()">
                    <div style="text-wrap-mode: nowrap; min-width: 50%;">{{ spec.label }}</div> 
                    <input type="text" placeholder="input..." class="ms-2"
                      :value="getProductSpec(combo, spec.specKey)?.specValue"
                      @change="updateProductSpec(combo, spec.specKey, $event.target.value)"/>
                  </div>
                  </template>
                </td>
               <!-- tambahkan kolom input lainnya di sini -->
                <td><input type="number" placeholder="Input Price" :value="getSku(combo)?.price"
                     @change="updateSku(combo, 'price', $event.target.value)"></td>
               <td><input placeholder="Input Stock" :value="getSku(combo)?.stock"
                     @change="updateSku(combo, 'stock', $event.target.value)"></td>
               <td><input placeholder="Input Stock Alert" :value="getSku(combo)?.stockAlert"
                     @change="updateSku(combo, 'stockAlert', $event.target.value)"></td>
               <!-- <td><input placeholder="Input Kode" :value="getSku(combo)?.code" -->
                     <!-- @change="updateSku(combo, 'code', $event.target.value)"></td> -->
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
        imageIds: [],
        brandId: null,
        isActive: true,
        isShowOnlyInMarketPlace: false,
        productVariantOptions: [],
        productVariantOptionValues: [],
        productSkus: [],
        productSkuVariants: [],
        specs: [],
        productType: this.$constant.productType.single
      },
      defaultSku:{
         price: null,
         stock: null,
         stockAlert: null,
         name: null,
         componentSpecs:[],
         productGroupItems: []
      },
      combinationData:[],
      allProducts: [],
      groupSpecs:[],
      selectedSpecs:[],
      productGroupItems:[]
    };
  },
  async mounted(){
    // const groupedSpecKeys = this.$constant.specKeys.reduce((acc, curr) => {
    //   if (!acc[curr.groupId]) {
    //     acc[curr.groupId] = [];
    //   }
    //   acc[curr.groupId].push(curr);
    //   return acc;
    // }, {});
    // this.groupSpecs = Object.entries(groupedSpecKeys).map(([groupId, items]) => ({
    //   groupId,
    //   items
    // }));

    this.allProducts = await this.getAll()

    if (this.$route.meta.formMode == this.$constant.formMode.create) {
      this.form.id =  this.$helper.GenerateUUID(this.allProducts.map(p => p.id))
    }
    else if (this.$route.meta.formMode == this.$constant.formMode.update) {
      const tmpForm = await this.getById(this.$route.params.id);
      this.form = Object.assign(this.form, tmpForm);
      this.form.productCategoryId = this.form.productCategory?.id
      this.form.brandId = this.form.brand?.id
      this.form.componentTypeId = this.form.componentType?.id
      this.form.productType = this.form.productType?.name

      this.combinationData = this.form.productSkus

      if(this.form.productSkus.length > 0 && this.form.productSkus[0].componentSpecs.length > 0)
        this.form.specs = this.form.productSkus[0].componentSpecs
        this.selectedSpecs = this.form.specs.map(data=> data.specKey)
        this.updateFormSpecs()
      }

    if(this.$route.meta.module.name == module.productBundle.name){
      this.form.productType = this.$constant.productType.group
      this.formData= { module: this.$module.productBundle }
    }
    else if(this.$route.meta.module.name == module.product.name){
      this.form.productType = this.$constant.productType.single
      this.formData= { module: this.$module.product }
    }
  },
  computed: {
    variantCombinations() {
      let groupedValues = this.form.productVariantOptions
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
  'form.componentTypeId':{
      async handler(newVal) {
        if(!newVal){
          this.selectedSpecs = []
          this.updateFormSpecs()
          return
        }
        const componentType = await  this.getComponentTypeById(newVal)
        this.selectedSpecs = this.$constant.specKeys.filter(data=> data.groupId.toLowerCase() == componentType.code.toLowerCase()).map(data=> data.value)
        this.updateFormSpecs()
      }
  },
   variantCombinations: {
      handler(newVal) {
        console.log(newVal)
         this.combinationData = newVal.map((combo) => {
         const exist = this.combinationData.find(
            (data) => JSON.stringify(data.skuCom??[]) === JSON.stringify(combo)
         );
         return {
            id: exist?.id ?? this.$helper.GenerateUUID(this.combinationData.map(cm => cm.id)),
            price: exist?.price ?? null,
            stock: exist?.stock ?? null,
            stockAlert: exist?.stockAlert ?? null,
            name: exist?.name ?? null,
            skuCom: combo,
            productGroupItems: exist?.productGroupItems ?? [],
            componentSpecs: this.form.specs.map(data=> {
               var existSpec = exist?.componentSpecs?.find(ps=> ps.specKey == data.specKey)
               return {
                  id: existSpec?.id ??  this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.componentSpecs.map(ps => ps.id))),
                  specKey : existSpec?.specKey ?? data.specKey,
                  specValue : existSpec?.specValue ?? null,
               }
         })
         };
         });
        console.log(this.combinationData)
      },
      immediate: true,
      deep: true
   }
  },
  methods: {
    getProductFiltered(selectedId, currentId){
        return this.allProducts
              .filter(data=> data.id == currentId || !selectedId.find(id => id && id == data.id))
    },
    delProductGroupItems(combo, index){
      const sku = this.getSku(combo);

      if (sku && sku.productGroupItems && sku.productGroupItems.length > 0) {
          sku.productGroupItems.splice(index, 1);
      }
    },
    checkProductGroupItems(combo, productId){
      console.log(combo)
      console.log(productId)
      const sku = this.getSku(combo);
      console.log(sku)
      if (sku) {
        if(!sku.productGroupItems) sku.productGroupItems = []
        const currentProduct = sku.productGroupItems.find(data=> data.productId == productId)
        console.log(currentProduct)
        if(currentProduct){
          currentProduct.productId = null
          this.$showToast.error("Product items tidak boleh duplicate")
        }
      }
    },
    addProductGroupItems(combo){
      const sku = this.getSku(combo);
      if (sku) {
        if(!sku.productGroupItems) sku.productGroupItems = []
        sku.productGroupItems.push({
          id: this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.productGroupItems.map(ps => ps.id))),
          productId: null,
          productSkuId: sku.id,
          qty: 1
        })
      }
    },
    updateFormSpecs(){
      this.form.specs = 
        this.selectedSpecs.map(spec=>
          { 
            return{
              id: this.form.specs.find(data=> data.specKey == spec)?.id ?? this.$helper.GenerateUUID(this.form.specs.map((d) => d.id)),
              specKey: spec,
              label: this.$constant.specKeys.find(data=> data.value == spec)?.label
            }
          }
        )
    },
    generateModelRequest(){
      var params = JSON.parse(JSON.stringify(this.form))
      params.productSkus = JSON.parse(JSON.stringify(this.combinationData))



      params.productSkuVariants= []
      params.productSkus.forEach(sku => {
          sku.price = parseInt(sku?.price??0)
          sku.stock = parseInt(sku?.stock??0)
          sku.stockAlert = parseInt(sku?.stockAlert??0)
          sku.isActive = true;

          sku.skuCom.forEach(skuCom => {
            params.productSkuVariants.push({
              id : this.$helper.GenerateUUID(params.productSkuVariants.map(psv=> psv.id)),
              productSkuId : sku.id,
              productVariantOptionId: skuCom.productVariantOptionId,
              productVariantOptionValueId: skuCom.id,
            })
          });
      });

      console.log(params)
      return params
    },
   doCreate(){
      var params = this.generateModelRequest()
      return this.create(params);
   },
   doUpdate(){
      var params = this.generateModelRequest()
      return this.update(params);
   },
   applyToAllSku(){
      this.combinationData.forEach(data=>{
         data.price =  this.defaultSku.price || data.price
         data.stock =  this.defaultSku.stock || data.stock
         data.stockAlert =  this.defaultSku.stockAlert || data.stockAlert
         data.name =  this.defaultSku.name || data.name
         data.productGroupItems =  this.defaultSku.productGroupItems.length > 0 ? this.defaultSku.productGroupItems : data.productGroupItems
         data.componentSpecs= this.form.specs.map(formSpec=> {
               var existDefaultSpec = this.getDefaultSpec(formSpec.specKey)
               var existSpec = data?.componentSpecs?.find(ps=> ps.specKey == formSpec.specKey)

               if(!existSpec){
                  existSpec = {
                     id: this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.componentSpecs.map(ps => ps.id))),
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
      if(sku) return sku.componentSpecs.find(data=> data.specKey == specKey)
      return null;
  },
  updateProductSpec(combo, specKey, value){
    const sku = this.getSku(combo);
    if (sku) {
      var specIndex = sku.componentSpecs.findIndex(data=> data.specKey == specKey)
      if(specIndex >= 0){
         sku.componentSpecs[specIndex].specValue = value
      }
      else{
         sku.componentSpecs.push({
            id: this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.componentSpecs.map(ps => ps.id))),
            specKey : specKey,
            specValue : value,
         })
      }
    }
  },
  getDefaultSpec(specKey){
      return this.defaultSku.componentSpecs.find(data=> data.specKey == specKey)
  },
  updateDefaultSpec(specKey, value){
   var defaultSpec = this.getDefaultSpec(specKey);
    if (defaultSpec) {
      defaultSpec.specValue = value;
    }
    else{
      this.defaultSku.componentSpecs.push({specKey: specKey, specValue: value})
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
    addMoreVariant(isDefault) {
      const id = this.$helper.GenerateUUID(this.form.productVariantOptions.map((d) => d.id));
      this.form.productVariantOptions.push({ id: isDefault??id, name: '' });
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
    ...mapActions(module.product.name, ['create', 'getById', 'update', 'getAll']),
    ...mapActions(module.componentType.name, {getComponentTypeById :'getById'}),
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
tr input{
  padding: 2px;
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
</style>