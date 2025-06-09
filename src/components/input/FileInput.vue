<template>
   <div class="d-flex flex-column" :style="{ width: width }" style="max-width: 100%;">
      <div v-if="label" class="font-button mb-3">{{ label }}</div>
      <div
         class="upload-area"
         @dragover="dragOver"
         @dragleave="dragLeave"
         @drop="handleFiles"
         ref="uploadArea"
      >
         <div
            class="content-container"
            id="uploadfile"
            v-if="multiple || fileList.length == 0"
         >
            <div class="font-body">
               Drag & Drop your image here (.jpg, .png)
            </div>
            <div class="font-body mb-2 mt-2">or</div>
            <div class="button" @click="browse()">Browse files</div>
            <input
               type="file"
               ref="fileInput"
               id="fileElem"
               @change="handleFileInputChange"
               multiple
               accept="image/*"
               style="display: none"
            />
            <!-- capture="camera" -->
         </div>
         <div v-if="!multiple && fileList.length > 0" class="preview-container">
            <img
               v-if="fileList[0].preview"
               :src="fileList[0].preview"
               alt="Image Preview"
               class="single-preview-img"
               @click="preview(fileList[0])"
            />
            <i class="fa fa-trash text-danger" @click="remove(fileList[0])" />
         </div>
      </div>
      <div v-if="multiple">
         <div ref="fileList" class="file-preview-container">
            <!-- Loop through fileList and display image previews -->
            <div
               v-for="(file, index) in fileList"
               :key="index"
               class="file-preview"
            >
               <img
                  v-if="file.preview"
                  @click="preview(file)"
                  :src="file.preview"
                  alt="Image Preview"
                  class="preview-img"
               />
               <img
                  :src="$assets.icons.xmark"
                  class="remove-icon"
                  @click="remove(file)"
               />
               <!-- <span>{{ file.name }}</span> -->
            </div>
         </div>
      </div>

      <Dialog
         class="file-dialog"
         v-if="previewModal"
         v-model:visible="previewModal"
         :pcCloseButton="true"
         modal
         :header="selectedFile.name"
         :style="{ width: '50vw', minHeight: '22vh' }"
         :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
         <img :src="selectedFile.preview" />
      </Dialog>
   </div>
</template>

<script>
import Dialog from "primevue/dialog";
import constant from '../../constant/constant';

import { mapActions } from "vuex";
import module from "../../constant/module";
export default {
   components: { Dialog },
   watch: {
      previewModal: {
         immediate: true,
         handler(newVal) {
            if (!newVal) this.selectedFile = null;
         },
      },
      modelValue: {
         immediate: true,
         handler(newVal) {
            if (newVal && this.currentId != newVal){
               setTimeout(() => {
                  this.currentId = newVal;
               }, 100);
            }
         },
      },
      value: {
         handler() {
            setTimeout(() => {
               this.currentId = this.value.map((v) => v.ImageId);

               this.fileList = this.value.map((v) => ({
                  id: v.ImageId,
                  name: v.Image.FileName,
                  preview: v.Image ? `${constant.apiURL}/images/${v.Image.FileName}` : `${constant.apiURL}/image/${v.ImageId}`,
               }));
            }, 100);
         },
      },
      currentId: {
         async handler() {
            this.$emit("update:modelValue", this.currentId);
            if(!this.multiple && this.currentId && !this.newFile){
                  setTimeout(() => {
                     this.fileList = [
                        {
                           // id: v.ImageId,
                           // name: v.Image.FileName,
                           preview: `${constant.apiURL}/image/${this.currentId}`,
                        }
                     ]
                  }, 100);
               }
         },
      },
   },
   props: {
      multiple: { type: Boolean, default: false },
      modelValue: { default: null },
      value: { type: Array, default: () => [] },
      width: { type: String, default: "400px" },
      label: { type: String, default: null },
   },
   data() {
      return {
         fileList: [],
         selectedFile: null,
         previewModal: false,
         currentId: null,
         newFile: false
      };
   },
   methods: {
      ...mapActions(module.data.name, ["uploadImage", "getImage"]),
      preview(image) {
         this.selectedFile = image;
         this.previewModal = true;
      },
      browse() {
         this.$refs.fileInput.click();
      },
      async remove(image) {
         var confirm = await this.$dialog.Confirmation.confirm({
            title: "Hapus Gambar",
            message: "Apakah Anda ingin menghapus gambar ini?",
         });
         if (confirm) {
            this.fileList = this.fileList.filter((data) => data != image);
            if (this.multiple) {
               this.currentId.splice(
                  this.currentId.findIndex((id) => id == image.id),
                  1
               );
            } else {
               this.currentId = null;
            }
         }
      },
      handleFiles(event) {
         event.preventDefault();

         this.$refs.uploadArea.classList.remove("hover");
         // If files are dropped, event.dataTransfer.files, if files are selected through browse, event.target.files
         const files = event.dataTransfer
            ? event.dataTransfer.files
            : event.target.files;
         if (!this.multiple) {
            this.fileList = [];
         }
         // Loop through files and create previews
         // this.processFiles(files);
      },
      // Handle files selected through file input
      handleFileInputChange(event) {
         const files = event.target.files;
         this.processFiles(files);
      },

      // Process files to generate previews
      async processFiles(files) {
         console.log(files)
         const imageId = await this.uploadImage(files);
         if (this.multiple) {
            if (!this.currentId) {
               this.currentId = [];
            }
            this.currentId.push(...imageId);
         } else {
            this.currentId = imageId[0];
         }

         this.newFile = true
         Array.from(files).forEach((file, i) => {
            if (file.type.startsWith("image/")) {
               const previewUrl = URL.createObjectURL(file);
               this.fileList.push({
                  id: imageId[i],
                  name: file.name,
                  preview: previewUrl,
               });
            }
         });
      },
      dragOver(event) {
         event.preventDefault();
         this.$refs.uploadArea.classList.add("hover");
      },
      dragLeave(event) {
         event.preventDefault();
         this.$refs.uploadArea.classList.remove("hover");
      },
   },
};
</script>
<style>
.upload-area.hover {
   background: var(--blue-100);
}
.upload-area .font-body {
   color: #1e1e1e;
}

.upload-area .button:hover,
.preview-container i:hover {
   transform: scale(1.05);
}
.upload-area .button {
   background: var(--grey-50);
   color: var(--blue-500);
   border: 1px solid var(--blue-500);
   font-size: 14px;
   border-radius: 8px;
   padding: 10px 16px;
   cursor: pointer;
}
.upload-area .content-container {
   width: 400px;
   display: flex;
   flex-direction: column;
   align-self: center;
   align-items: center;
}
.upload-area {
   border: 1px dashed var(--grey-800);
   padding: 10px;
   text-align: center;
   width: 400px;
   background-color: white;
   border-radius: 10px;
   height: 200px;
   display: flex;
   flex-direction: column;
   position: relative;

   justify-content: center;
}

/* .upload-area:hover {
    background-color: #e9f5ff;
} */

#fileList {
   margin-top: 15px;
}

.file-preview-container {
   display: flex;
   flex-wrap: wrap;
   gap: 10px;
   margin-top: 15px;
}

.file-preview {
   cursor: pointer;
   display: flex;
   flex-direction: column;
   align-items: center;
   max-width: 120px;
   position: relative;
   box-sizing: border-box;
}
.single-preview-img {
   max-height: 180px;
   height: auto;
   object-fit: cover;
   cursor: pointer;
}
.preview-container {
   display: flex;
   justify-content: center;
   box-sizing: border-box;
}

.preview-img {
   min-width: 120px;
   max-width: 120px;
   min-height: 120px;
   max-height: 120px;
   border-radius: 8px;
   object-fit: cover;
   box-sizing: border-box;
   border: 1px solid gray;
}
.preview-container i {
   position: absolute;
   right: 10px;
   bottom: 10px;
   padding: 10px;
   border: 1px solid var(--red-500);
   border-radius: 4px;
   background: white;
   cursor: pointer;
}
.file-dialog .p-dialog-content {
   align-self: center !important;
}
.remove-icon {
   padding: 4px;
   background-color: white;
   position: absolute;
   right: 8px;
   top: 8px;
   border-radius: 4px;
   width: 24px;
   height: 24px;
}
</style>
