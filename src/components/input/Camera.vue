<template>
  <div id="app" class="web-camera-container">
    <div class="camera-button" v-if="!isCameraOpen && !disabled">
        <Button @click="toggleCamera"  buttonType="secondary" label="Open Camera" iconFa="fa fa-camera"/>
    </div>
    
    <div v-show="isCameraOpen && isLoading" class="camera-loading">
      <ul class="loader-circle">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <!-- <input type="file" id="cameraInput" accept="image/*" capture="camera" > -->
    
    <div v-if="isCameraOpen" v-show="!isLoading && !disabled" class="camera-box" :class="{ 'flash' : isShotPhoto }">
      <!-- <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div> -->
      
      <!-- Video element untuk live feed -->
      <i class="fa fa-times close-camera" @click="toggleCamera"/>

      <video ref="camera" autoplay
      style="width: 100%;"
      :playsInline="true"
      :muted="true"></video>
      
      <!-- Canvas element untuk menunjukkan gambar yang diambil -->
      <canvas v-show="false" id="photoTaken" ref="canvas"></canvas>

      <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
        <Button label="Take Picture" buttonType="secondary" :isLoading="processTake" @click.prevent="takePhoto" iconFa="fa fa-camera"/>
      </div>
    </div>

    <!-- Preview Images -->
    <div v-if="photoList.length > 0" class="file-preview-container">
      <div class="file-preview" v-for="(photo, index) in photoList" :key="index">
        <img :src="photo.preview" class="preview-img" @click="preview(photo.preview)" />
        <img v-if="!disabled" :src="$assets.icons.xmark"
                  class="remove-icon"
                  @click="remove(photo)"/>
      </div>
    </div>
  </div>

  <Dialog
         class="camera-dialog"
         v-if="previewModal"
         v-model:visible="previewModal"
         :pcCloseButton="true"
         modal
         :header="selectedFile.name"
         :style="{ width: '50vw' }"
         :breakpoints="{ '1199px': '90vw' }"
      >
         <img :src="selectedFile" style="width: 100%;"/>
      </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import { mapActions } from 'vuex';
import module from '../../constant/module';

export default {
  components:{ Dialog},
  data() {
    return {
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      selectedFile: null,
      previewModal: false,
      photoList: [],  // Menyimpan daftar foto yang diambil
      currentId: [],
      processTake: false
    };
  },
  watch:{
    value:{
      immediate: true,
      handler(newVal){
        console.log(newVal)
        if(!newVal) return
        this.currentId = newVal.map((v) => Object.assign(v, {ImageId : v.ImageId ? v.ImageId : v.Image && v.Image.Id ? v.Image.Id : v}));
        setTimeout(() => {
          this.photoList = this.currentId.map(data=> ({ 
                id: data.ImageId,
                name: data.Image?.FileName,
                preview: `${this.$constant.apiURL}/image/${data.ImageId}`
            }));
        }, 100);
      }
    },
    modelValue:{
      immediate: true,
      handler(newVal){
        if(!newVal) return
        this.currentId = newVal.map((v) => Object.assign(v, {ImageId : v.ImageId ? v.ImageId : v.Image && v.Image.Id ? v.Image.Id : v}));
        setTimeout(() => {
          this.photoList = this.currentId.map(data=> ({ 
                id: data.ImageId,
                name: data.Image?.FileName,
                preview: `${this.$constant.apiURL}/image/${data.ImageId}`
            }));
        }, 100);
       
      }
    },
    previewModal: {
         immediate: true,
         handler(newVal) {
            if (!newVal) this.selectedFile = null;
         },
      },
      // currentId: {
      //    async handler(newVal) {
      //       console.log(newVal)
      //       this.$emit("update:modelValue", this.currentId);
      //    },
      // },
  },
  props:{
    modelValue:{ default: null},
    value:{type: Array, default: ()=> []},
    disabled:{type: Boolean, default: false}
  },
  beforeUnmount(){
    if (this.isCameraOpen) {
      this.stopCameraStream()
    }
  },
  methods: {
    ...mapActions(module.data.name, ["uploadImage", "getImage"]),

    updateModelValue(){
      console.log(this.currentId)
      this.$emit("update:modelValue", this.currentId.map(data=> { return {ImageId : data.ImageId}}));
    },
    async remove(image) {
         var confirm = await this.$dialog.Confirmation.confirm({
            title: "Hapus Photo",
            message: "Apakah Anda ingin menghapus photo ini?",
         });
         if (confirm) {
            // this.photoList = this.photoList.filter((data) => data != image);
            this.currentId.splice(
              this.currentId.findIndex((id) => id == image.id),
              1
            );
            this.updateModelValue()
         }
      },
    preview(image) {
         this.selectedFile = image;
         this.previewModal = true;
    },
    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },

    createCameraElement() {
      this.isLoading = true;

      const constraints = { audio: false, 
            video: {
              // width: { ideal: 1920 },  // Resolusi tinggi, misalnya 1920x1080
              // height: { ideal: 1080 },
              facingMode: { ideal: "environment" }  // Kamera belakang biasanya diatur dengan "environment"
            }
       };

      setTimeout(async () => {
        // const devices = await navigator.mediaDevices.enumerateDevices();
        //   const backCamera = devices.find(device => device.kind === 'videoinput' && device.facing === 'environment');
        //   if (backCamera) {
        //       const stream = await navigator.mediaDevices.getUserMedia({
        //           video: { deviceId: backCamera.deviceId }
        //       });
        //       this.isLoading = false;
        //       this.$refs.camera.srcObject = stream;  // Menampilkan stream video dari kamera belakang
        //   }
        //   else{
            navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
              this.isLoading = false;
              this.$refs.camera.srcObject = stream;
            })
            .catch((error) => {
              alert(error);
              this.isLoading = false;
              alert("May the browser didn't support or there is some errors.");
            });
          // }
      }, 100);

    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    },

  //   base64ToBinary(base64Str) {
  //     const fileExtension = base64Str.split(';')[0].split('/')[1]; // Mengambil tipe file (misalnya 'jpeg')

  //     const base64Data = base64Str.split(',')[1];
  //     const byteCharacters = atob(base64Data);
  //     const byteArrays = [];

  //     for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
  //         const slice = byteCharacters.slice(offset, offset + 1024);
  //         const byteNumbers = new Array(slice.length);
  //         for (let i = 0; i < slice.length; i++) {
  //             byteNumbers[i] = slice.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         byteArrays.push(byteArray);
  //     }

  //     const blob = new Blob(byteArrays, 
  //       { 
  //         type: `image/${fileExtension}`,
  //         name: `capture${this.photoList.length}.${fileExtension}`,
  //         lastModifiedDate: new Date()
  //       });
  //     return blob
  // },
    async takePhoto(event) {
      event.preventDefault();
      if(this.processTake) return
      this.processTake = true
      // if (!this.isPhotoTaken) {
      //   this.isShotPhoto = true;

      //   const FLASH_TIMEOUT = 50;
      //   setTimeout(() => {
      //     this.isShotPhoto = false;
      //   }, FLASH_TIMEOUT);
      // }

      // Ambil foto dan gambar ke canvas
      this.isPhotoTaken = true;
      const context = this.$refs.canvas.getContext('2d');

      // this.$refs.camera.onloadedmetadata = () => {
        this.$refs.canvas.width = parseFloat(this.$refs.camera.videoWidth) + 200;
        this.$refs.canvas.height = parseFloat(this.$refs.camera.videoHeight) + 200;

        context.drawImage(this.$refs.camera, 0, 0, parseFloat(this.$refs.camera.videoWidth) + 200, parseFloat(this.$refs.camera.videoHeight) + 200);

        // Menyimpan gambar ke dalam photoList
        const photoDataUrl = this.$refs.canvas.toDataURL("image/jpeg");
        const fileExtension = photoDataUrl.split(';')[0].split('/')[1]; // Mengambil tipe file (misalnya 'jpeg')

        this.$refs.canvas.toBlob(async (blob)=>{
          const file = new File([blob], `capture${this.photoList.length}.${fileExtension}`, { type: `image/${fileExtension}` });
          console.log('File yang diambil:', file);

          const imageId = await this.uploadImage([file]);
          if (!this.currentId) {
              this.currentId = [];
          }
          imageId.forEach(id => {
            this.currentId.push({ImageId:id});

            // this.photoList.push({
            //     id: id,
            //     // name: file.name,
            //     preview: `${this.$constant.apiURL}/image/${id}`,
            // });
          });

          this.updateModelValue()

          this.newFile = true
          // Array.from([file]).forEach((file, i) => {
          //       if (file.type.startsWith("image/")) {
          //         //const previewUrl = URL.createObjectURL(file);
                  
          //       }
          //   });

          // Reset video kembali setelah beberapa detik
          setTimeout(() => {
            this.isPhotoTaken = false;  // Sembunyikan canvas dan tampilkan video
            this.processTake = false
          }, 1); 
        })
      // }
    },

    downloadImage() {
      const download = document.getElementById("downloadPhoto");
      const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      download.setAttribute("href", canvas);
    },
  }
};
</script>

<style lang="scss">
.camera-dialog .p-dialog-content{
  width: 100%;
}
.close-camera{
  // border-radius: 100%;
  z-index: 10;
  cursor: pointer;
  background: white;
  position: absolute;
  font-size: 32px;
  height: 48px;
  width: 48px;
  text-align: center;
  align-content: center;
  right: 0px;
  border: 1px solid var(--grey-600);
  top: 0px;
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

.web-camera-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 14px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  border: 1px dashed var(--grey-800);
  border-radius: 4px;
  width: 100%;
  
  .camera-button {
    margin-bottom: 2rem;
  }
  
  .camera-box {    
    position: relative;
    width: 700px;
    max-width: 100%;
    align-self: center;
    .camera-shutter {
      opacity: 0;
      width: 450px;
      height: 337.5px;
      background-color: #fff;
      position: absolute;
      
      &.flash {
        opacity: 1;
      }
    }
  }
  
  .camera-shoot {
    position: absolute;
    z-index: 10;
    bottom: 10px;
    // position-area: bottom;
    opacity: 90%;
    left: calc(50% - 76px);
    
    // button {
    //   height: 60px;
    //   width: 60px;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   border-radius: 100%;
      
    //   img {
    //     height: 35px;
    //     object-fit: cover;
    //   }
    // }
  }
  
  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;
    
    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }
    
    .loader-circle {
      display: block;
      height: 14px;
      margin: 0 auto;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      position: absolute;
      width: 100%;
      padding: 0;
      
      li {
        display: block;
        float: left;
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        position: relative;
        margin: 0 0 0 4px;
        background: #999;
        animation: preload 1s infinite;
        top: -50%;
        border-radius: 100%;
        
        &:nth-child(2) {
          animation-delay: .2s;
        }
        
        &:nth-child(3) {
          animation-delay: .4s;
        }
      }
    }
  }

  .file-preview-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;

    .file-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 148px;
      position: relative;
      box-sizing: border-box;
    }

    .preview-img {
      min-width: 148px;
      max-width: 148px;
      min-height: 148px;
      max-height: 148px;
      border-radius: 8px;
      object-fit: cover;
      box-sizing: border-box;
      border: 1px solid gray;
    }
  }

  @keyframes preload {
    0% {
      opacity: 1
    }
    50% {
      opacity: .4
    }
    100% {
      opacity: 1
    }
  }
}
</style>
