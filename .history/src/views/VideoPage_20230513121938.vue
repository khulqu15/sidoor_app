<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen bg-base-100 relative">
                <div style="position: relative; width: 500px" class="margin">
                    <img id="person1" src="/datasets/test.jpg" style="width: 500px;" />
                    <canvas id="overlay"></canvas>
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
    let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
    fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, input)
    faceapi.matchDimensions(canvas, input)
    // faceapi.draw.drawDetections(canvas, fullFaceDescriptions)
    // faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions)

    const labels = ['ninno', 'tarum', 'dewa', 'gusnaidi', 'viki', 'abu']
    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            for(let i=1; i<10; i++) {
                const imgUrl = `/datasets/${label}/${i}.jpg`
                const img = await faceapi.fetchImage(imgUrl)
                const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                if(!fullFaceDescriptions) throw new Error(`no faces detected for ${label}`)
                const faceDescriptors = [fullFaceDescription?.descriptor]
                return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
            }
        })
    )
    const maxDescriptorDistance = 0.6
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
    const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
    results.forEach((bestMatch, i) => {
        const box = fullFaceDescriptions[i].detection.box
        const text = bestMatch.toString()
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(canvas)
    })
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
  right: 0;
  bottom: 0;
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