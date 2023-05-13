<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <div style="position: relative" class="margin">
                    <img id="person1" src="/datasets/test.jpg" style="width: 500px;" />
                    <canvas id="overlay" willReadFrequently="true" />
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import * as faceapi from 'face-api.js'
import { onMounted } from 'vue'

onMounted(async() => {
    await faceapi.loadSsdMobilenetv1Model("/")
    await faceapi.loadFaceLandmarkModel("/")
    await faceapi.loadFaceRecognitionModel("/")
    const input = document.getElementById('person1') as HTMLImageElement;
    const canvas = document.getElementById('overlay') as HTMLCanvasElement;
    const displaySize = { width: input.width, height: input.height }
    let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
    fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, displaySize)
    faceapi.draw.drawDetections(canvas, fullFaceDescriptions)
    faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions)
})
</script>

<style>
.page-container {
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 20px;
  padding-left: 280px;
  display: inline-flex !important;
}

@media only screen and (max-width : 992px) {
  .page-container {
    padding-left: 0;
    display: flex !important;
  }
}

#navbar {
  position: absolute;
  top: 20px;
  left: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.side-by-side {
  display: flex;
  justify-content: center;
  align-items: center;
}
.side-by-side >* {
  margin: 0 5px;
}

.bold {
  font-weight: bold;
}

.margin-sm {
  margin: 5px;
}

.margin {
  margin: 20px;
}

.button-sm {
  padding: 0 10px !important;
}

.pad-sides-sm {
  padding: 0 8px !important;
}

#overlay, .overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
}

#facesContainer canvas {
  margin: 10px;
}

input[type="file"]::-webkit-file-upload-button {
    background: #26a69a;
    border: 1px solid gray;
    cursor: pointer;
    color: #fff;
    border-radius: .2em;
}
</style>