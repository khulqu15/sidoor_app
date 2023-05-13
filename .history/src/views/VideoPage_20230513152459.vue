<template>
    <div>
        <div style="position: relative; width: 720px">
            <video ref="videoEl" style="width:720px; height:480px" width="750" height="480" id="inputVideo" @play="onPlay()" autoplay muted></video>
            <canvas ref="canvas" id="overlay"></canvas>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import * as faceapi from 'face-api.js'

const input = document.getElementById('inputVideo') as HTMLVideoElement;
const canvas = document.getElementById('inputVideo') as HTMLCanvasElement;
export default {
    setup() {
        const videoEl = ref(null)
        const labels = ['ninno', 'tarum', 'dewa', 'gusnaidi', 'viki', 'abu']

        const loadModels = async () => {
            await faceapi.loadSsdMobilenetv1Model('/')
            await faceapi.loadFaceLandmarkModel('/')
            await faceapi.loadFaceRecognitionModel('/')
        }

        const startVideo = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                videoEl.value.srcObject = stream
            }
        }

        const getLabeledFaceDescriptors = async () => {
            return Promise.all(
                labels.map(async label => {
                    const imgUrl = `/datasets/${label}/2.jpg`
                    const img = await faceapi.fetchImage(imgUrl)
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                    return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor])
                })
            )
        }

        const recognizeFaces = async () => {
            if (!videoEl.value.videoWidth || !videoEl.value.videoHeight) {
                return;
            }
            const labeledFaceDescriptors = await getLabeledFaceDescriptors()
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
            const detections = await faceapi.detectAllFaces(videoEl.value).withFaceLandmarks().withFaceDescriptors()
            const dims = faceapi.matchDimensions(canvas, input, true)
            const resizedDetections = faceapi.resizeResults(detections, dims)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            if (canvas.value) {
                canvas.value.getContext('2d').clearRect(0, 0, canvas.value.width, canvas.value.height)
                results.forEach((bestMatch, i) => {
                    const box = resizedDetections[i].detection.box
                    const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() })
                    drawBox.draw(canvas.value)
                })
            }
        }


        const onPlay = async () => {
            if (videoEl.value.paused || videoEl.value.ended) return setTimeout(() => onPlay())
            await recognizeFaces()
            setTimeout(() => onPlay())
        }

        onMounted(async () => {
            await loadModels()
            await startVideo()
        })

        return { videoEl, canvas, onPlay }
    }
}
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