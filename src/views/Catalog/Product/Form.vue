<template>
  <MIJForm :formData="formData" :createAction="doCreate" :updateAction="doUpdate" :showCancel="showCancel" @cancel="$emit('cancel')">
    <!-- Basic Info Section -->
    <div class="card p-2 mb-4">
      <h5 class="mb-3">Informasi Dasar</h5>
      <b-row>
        <b-col cols="12" md="6">
          <Switch class="mb-2" label="Tampilkan hanya di Marketplace?" v-model="form.isShowOnlyInMarketPlace" />
          <TextBox class="mb-2"label="Nama Produk" type="name" v-model="form.name" />
          <SelectModuleBox v-if="form.productType != $constant.productType.group" class="mb-2" :required="false" :module="$module.componentType" label="Tipe Komponen" v-model="form.componentTypeId" />
          <SelectModuleBox class="mb-2" :module="$module.productCategory" label="Kategori Produk" v-model="form.productCategoryId" />
          <SelectModuleBox class="mb-2" :required="false" :module="$module.brand" label="Brand" v-model="form.brandId" />
          <TextBox class="mb-2" :required="false" placeholder="https://www.youtube.com/watch?v=ID_VIDEO" label="URL Youtube (Hanya ID video)" type="url" v-model="form.videoUrl" />
          <TextBox class="mb-2" :required="false" label="Tags" placeholder="Pisahkan dengan koma (,)" type="text" v-model="form.tags" />

        </b-col>
        <b-col cols="12" md="6" class="mb-3">
          <FileInput v-model="form.imageIds" :multiple="true" style="width: 100% !important;"/>
        </b-col>
        <b-col cols="12" class="mt-3">
          <TextEditor :required="false" label="Deskripsi" v-model="form.description" />
        </b-col>
      </b-row>
    </div>

    <!-- Variants Section -->
    <div class="card p-2 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Varian Produk</h5>
        <!-- <Button @click.prevent="" class="p-2" label="Import Varian" style="width: 200px !important" /> -->
      </div>

      <div v-for="(variant, i) in form.productVariantOptions" :key="variant.id" class="variant-section mb-4">
        <div class="d-flex align-items-center gap-1">
          <TextBox style="width: 300px" :label="`Varian ${i + 1}`" placeholder="Warna, Ukuran, dll..." v-model="variant.name" />
          <Button style="height: 30px !important; width: fit-content !important;" @click="removeVariant(variant.id)" buttonType="danger" class="mt-4 p-2 mb-2" iconFa="fa fa-times" />
        </div>

        <div class="mt-1">Opsi:</div>
        <b-row class="ms-2">
          <b-col v-for="(option, j) in getVariantOptionValues(variant.id)" :key="option.id" class="mt-2 p-1" cols="12" lg="3" md="4" sm="4">
            <div class="d-flex gap-1">
              <TextBox  placeholder="Merah, Hijau, XL..." v-model="option.name" />
              <Button v-if="j !== 0 || getVariantOptionValues(variant.id).length > 1" @click="removeOption(option.id)" buttonType="danger" iconFa="fa fa-times" class="p-1 mb-2" style="height: 30px !important; width: fit-content !important;"/>
            </div>
          </b-col>
          <b-col cols="auto" class="mt-2 p-1">
            <Button style="height: 30px;" @click.prevent="addMoreVariantOption(variant.id)" buttonType="secondary" class="ps-3 pe-3" label="Tambah Opsi" />
          </b-col>
        </b-row>
      </div>

      <div style="display: flex; justify-content: end;">
        <Button class="p-2 ps-4 pe-4" style="width: fit-content !important;" @click.prevent="addMoreVariant()" iconFa="fa fa-plus"  label="Tambah Varian" />
      </div>
    </div>

    <!-- SKU Section -->
    <div class="card p-2">
      <h5 class="mb-4">Pengaturan SKU</h5>
      
      <!-- Bulk Editor -->
      <div class="mb-4 pb-3 border-bottom">
        <div class="mt-2 pb-3 bulk-sku-container" style="overflow: auto; border-bottom: 1px solid #dedede;">
          <div @click="showBulk = !showBulk" style="cursor: pointer; background: white;" class="pe-2 ps-2">Bulk SKU Editor: <span class="ms-2 fs-4"><i :class="!showBulk ? 'fa fa-angle-down' : 'fa fa-angle-up'"></i></span></div>
           
          <table class="custom-table mt-3 p-2" id="skuModel" v-if="showBulk">
              <thead>
              <tr>
                <template v-for="(variant, i) in form.productVariantOptions" :key="variant.id">
                  <td v-if="variant.name?.trim() && getVariantOptionValues(variant.id).filter(data=> data.name?.trim()).length > 0" style="place-items: center;">
                    <div>{{ variant.name }}</div>
                    <div style="font-size: 10px;">(variant {{ i+1 }})</div>
                    </td>
                </template>
                <td v-if="form.productType == $constant.productType.group">Product Items</td>
                <td>SKU</td>
                
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
                        <div class="flex-row jc-spaceBetween mb-2" v-for="(product, index) in defaultSku?.productGroupItems">
                          <select @change="changeDefaultSkuProductgroupItems(index)" :value="product.productId" v-model="product.productId" style="width: 200px !important" placeholder="Select Product">
                            <option :value="null">Select Product</option>
                            <option :value="p.id" v-for="p in getProductFiltered(defaultSku?.productGroupItems.map(data=> data.productId), product.productId)">{{ p.name }}</option>
                          </select>
                          <select v-if="product.productId" :value="product.productSkuId" v-model="product.productSkuId" style="width: 200px !important" placeholder="Pilih variasi">
                            <option :value="sku.id" v-for="sku in getProductById(product.productId)?.productSkus">{{ getSkuName(sku) }}</option>
                          </select>
                          <div class="flex-row">
                            <input v-model="product.qty" placeholder="Qty" type="number" style="width: 80px; border: 1px solid #dedede;" class="mx-1"/>
                            <i @click.stop.prevent="delDefaultSkuProductGroupItems(index)" class="text-danger fa fa-trash text-center" style="cursor: pointer; height: 30px; font-size: 18px; align-content: center;"></i>
                          </div>
                        </div>
                        <Button @click.stop.prevent="addProductGroupItemsSku" class="p-2" label="add product items"/>
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
            <div v-if="showBulk" class="p-2">
              <Button  class="mt-2 pt-1 pb-1 ps-4 pe-4" @click.prevent="applyToAllSku" buttonType="secondary" label="👇 Apply to All 👇" style="width: 170px !important;"/>
            </div>
          </div>
        <div class="mt-2">SKU:</div>
         <div class="pb-3" style="overflow: auto; border-bottom: 1px solid #dedede;">
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
                      <select @change="changeProductgroupItems(combo, index)" :value="product.productId" v-model="product.productId" style="width: 200px !important" placeholder="Pilih Produk">
                        <option :value="null">pilih produk</option>
                        <option :value="p.id" v-for="p in getProductFiltered(getSku(combo)?.productGroupItems.map(data=> data.productId), product.productId)">{{ p.name }}</option>
                      </select>
                      <select v-if="product.productId" :value="product.productSkuId" v-model="product.productSkuId" style="width: 200px !important" placeholder="Pilih variasi">
                        <option :value="sku.id" v-for="sku in getProductById(product.productId)?.productSkus">{{ getSkuName(sku) }}</option>
                      </select>
                      <div class="flex-row">
                        <input v-model="product.qty" placeholder="Qty" type="number" style="width: 80px; border: 1px solid #dedede;" class="mx-1"/>
                        <i @click.stop.prevent="delProductGroupItems(combo, index)" class="text-danger fa fa-trash text-center" style="cursor: pointer; height: 30px; font-size: 18px; align-content: center;"></i>
                      </div>
                    </div>
                    <Button @click.stop.prevent="addProductGroupItems(combo)" class="p-2" label="add product items"/>
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
      showBulk: false,
      formData: { module: this.$module.product },
      form: {
        name: null,
        description: null,
        imageIds: [],
        brandId: null,
        isActive: true,
        productCategoryId: null,
        componentTypeId: null,
        isShowOnlyInMarketPlace: false,
        productVariantOptions: [],
        productVariantOptionValues: [],
        productSkus: [],
        productSkuVariants: [],
        specs: [],
        tags: [],
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
      tmpCombinationData:[],
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
      this.form.brandId = this.form.brand?.id || null
      this.form.componentTypeId = this.form.componentType?.id || null
      this.form.productType = this.form.productType?.name

      this.tmpCombinationData = JSON.parse(JSON.stringify(this.form.productSkus))

      if(this.form.productSkus.length > 0 && this.form.productSkus[0].componentSpecs.length > 0){
        this.form.specs = this.form.productSkus[0].componentSpecs
        this.selectedSpecs = this.form.specs.map(data=> data.specKey)
        this.updateFormSpecs()
      }
      setTimeout(() => {
        console.log(this.form)
        console.log(this.combinationData)
      }, 2000);
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
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log(newVal)
         if(this.tmpCombinationData.length > 0){
          this.combinationData = this.tmpCombinationData.map((data, index) => {
              return {
                ...data,
                skuCom: newVal[index] || [] // Tambahkan skuCom dari variantCombinations baru
              }
          });

          this.tmpCombinationData = []
         }
         else{
          this.combinationData = newVal.map((combo, index) => {
            const exist = this.combinationData.find(
                (data) => JSON.stringify(data.skuCom??[]) === JSON.stringify(combo)
            );
            console.log(combo)
            return {
                id: exist?.id ?? this.$helper.GenerateUUID(this.combinationData.map(cm => cm.id)),
                price: exist?.price ?? null,
                stock: exist?.stock ?? null,
                stockAlert: exist?.stockAlert ?? null,
                name: exist?.name ?? `Variasi ${index + 1}`,
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
          }
        console.log(this.combinationData)
      },
   }
  },
  methods: {
    getSkuName(sku){
      const product = this.getProductById(sku.productId)

      if(!product?.productSkuVariants || product?.productSkuVariants.length <=0){
        return sku.name
      }
      return product?.productSkuVariants?.filter(data=> data.productSkuId == sku.id)
            .map(ps=> product.productVariantOptionValues.find(p=> p.id == ps.productVariantOptionValueId)?.name)
            .join('/')
    },
    changeDefaultSkuProductgroupItems(index){
      if (this.defaultSku.productGroupItems) {
          const currentProduct = this.getProductById(this.defaultSku.productGroupItems[index]?.productId)
          if(currentProduct && currentProduct.productSkus.length >= 1){
            this.defaultSku.productGroupItems[index].productSkuId = currentProduct.productSkus[0].id;
          }
      }
    },
    changeProductgroupItems(combo, index){
      const sku = this.getSku(combo);

      if (sku && sku.productGroupItems) {
          const currentProduct = this.getProductById(sku.productGroupItems[index]?.productId)
          if(currentProduct && currentProduct.productSkus.length >= 1){
            sku.productGroupItems[index].productSkuId = currentProduct.productSkus[0].id;
          }
      }
    },
    getProductById(id){
      return this.allProducts.find(data=> data.id == id)
    },
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
    delDefaultSkuProductGroupItems(index){
      if (this.defaultSku.productGroupItems[index]) {
          this.defaultSku.productGroupItems.splice(index, 1);
      }
    },
    checkProductGroupItems(combo, productId){
      const sku = this.getSku(combo);
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
          productSkuId: null,
          qty: 1
        })
      }
    },
    addProductGroupItemsSku(){
      return this.defaultSku.productGroupItems.push({
          productId: null,
          qty: 1
        })
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
      params.brandId = params.brandId && params.brandId.length > 0 && params.brandId != "" ? params.brandId : null
      
      if(params.productType == this.$constant.productType.group){
        params.componentTypeId = null
        // params.productCategoryId = null
        params.componentSpecs = []
      }
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
         data.productGroupItems =  this.defaultSku.productGroupItems.length <= 0 ? data.productGroupItems :
                      this.defaultSku.productGroupItems.map(data=>{
                        return {
                            id: this.$helper.GenerateUUID(this.combinationData.flatMap(cm => cm.productGroupItems.map(ps => ps.id))),
                            productId : data.productId,
                            productSkuId : data.productSkuId,
                            qty: data.qty
                        }
                      })
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
<style scoped>
.bulk-sku-container{
  background: #dedede;
  border: 1px solid #dedede;
  border-radius: 8px;
  /* padding: 8px; */
  
  
}
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.variant-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th,
.custom-table td {
  padding: 12px;
  border: 1px solid #dee2e6;
}

.custom-table thead {
  background: #f8f9fa;
}

.custom-table tbody tr:hover {
  background: #f8f9fa;
}

.flex-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>