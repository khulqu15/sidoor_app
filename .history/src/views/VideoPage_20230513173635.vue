<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen w-full relative overflow-hidden grid grid-cols items-center justify-center">
                <div class="absolute w-full h-full z-20 bg-black/70"></div>
                <img src="/assets/wallpaper.jpg" class="absolute h-full w-full object-cover object-center" alt="wallpaper">
                <div ref="faceLock" id="faceLock" class="max-w-md relative z-40" :class="{'hidden': hasDetected}">
                    <div class="flex items-center justify-center gap-x-3">
                        <Icon icon="solar:face-scan-square-bold-duotone" class="text-white text-3xl" />
                        <h3 class="text-white">FACE ID LOCK</h3>
                    </div>
                    <div class="relative p-8 rounded-xl bg-black/50">
                        <video class="rounded-t-lg" ref="videoEl" id="inputVideo" @play="onPlay()" autoplay muted></video>
                        <canvas ref="canvas" id="overlay"></canvas>
                        <div class="text-white">
                            <div class="bg-red-500 p-5 rounded-b-lg" v-if="labelDetected == 'unknown' || labelDetected == null || labelDetected == undefined">
                                <h5 class="m-0">There are no recognized faces.</h5>
                            </div>
                            <div class="bg-green -500 p-5 rounded-b-lg" v-else>
                                <h5 class="m-0">Welcome {{ labelDetected }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="hasDetected" id="success" class="animate__animated animate__fadeIn relative z-30 text-white text-center">
                    <div :key="countSuccessed">
                        <Icon icon="solar:shield-check-bold-duotone" class="text-success inline-block text-8xl"/>
                        <h3>Hello, Welome {{  labelDetected  }}</h3>
                        <div class="radial-progress bg-black/40 transition-all text-primary-content mt-6" :style="{'--value': remainingTime * (100 / timer), '--thickness': '2px'}">{{ remainingTime }} s</div>
                        <div class="mt-3">
                            <button @click="$router.push({name: 'Setting'})" class="btn btn-ghost text-white">Setting Parameter</button>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as faceapi from 'face-api.js'
import { Icon } from '@iconify/vue'
import { ref as firebaseRef, set, onValue } from "firebase/database"
import { db } from "@/firebase"

const input = document.getElementById('inputVideo') as HTMLVideoElement;
export default {
    components: {
        Icon,
    },
    setup() {
        const videoEl = ref(null)
        const canvas = ref(null);
        const labels = ['ninno', 'tarum', 'dewa', 'gusnaidi', 'viki', 'abu']
        const labelDetected = ref("unknown")
        const hasDetected = ref(false)
        const countSuccessed = ref(0)
        const timer = ref(0)
        const remainingTime = ref(10)
        const loadModels = async () => {
            await faceapi.loadSsdMobilenetv1Model('/')
            await faceapi.loadFaceLandmarkModel('/')
            await faceapi.loadFaceRecognitionModel('/')
        }
        const timerId = ref<number | undefined>(undefined);
        const faceLock: HTMLElement | null = document.getElementById("faceLock")

        const startVideo = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                videoEl.value.srcObject = stream
            }
        }

        const getLabeledFaceDescriptors = async () => {
            if (hasDetected.value) return
            return Promise.all(
                labels.map(async label => {
                    const imgUrl = `/datasets/${label}/1.jpg`
                    const img = await faceapi.fetchImage(imgUrl)
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                    return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor])
                })
            )
        }

        const recognizeFaces = async () => {
            if (hasDetected.value) return
            if (!videoEl.value.videoWidth || !videoEl.value.videoHeight) return;
            const labeledFaceDescriptors = await getLabeledFaceDescriptors()
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
            const detections = await faceapi.detectAllFaces(videoEl.value).withFaceLandmarks().withFaceDescriptors()
            if(videoEl.value && canvas.value) {
                const dims = faceapi.matchDimensions(canvas.value, videoEl.value, true)
                const resizedDetections = faceapi.resizeResults(detections, dims)
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
                canvas.value.getContext('2d').clearRect(0, 0, canvas.value.width, canvas.value.height)
                results.forEach((bestMatch, i) => {
                    const box = resizedDetections[i].detection.box
                    const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() })
                    drawBox.draw(canvas.value)
                    const label = bestMatch.toString().split(" ")
                    if(labels.find(item => item == label[0])) {
                        labelDetected.value = label[0]
                        getData()
                        setTimeout(() => {
                            console.log("Test")
                            hasDetected.value = true
                            successState()
                            faceLock?.classList.add('animate__animated', 'animate__fadeOut')
                        }, 8000)
                        setTimeout(() => {
                            faceLock?.classList.add('hidden')
                            startTimer()
                        }, 9000)
                    } else {
                        labelDetected.value = "unknown"
                    }
                })
            } else {
                console.error('Video element or Canvas is null');
            }
        }

        function startTimer() {
            timerId.value = window.setInterval(() => {
                remainingTime.value -= 1
                if(remainingTime.value <= 0) {
                    window.clearInterval(timerId.value)
                    timerId.value = undefined
                    remainingTime.value = 0
                }
            }, 1000)
            setTimeout(() => {
                faceLock?.classList.remove('animate__animated', 'animate__fadeOut')
                faceLock?.classList.remove('hidden')
                faceLock?.classList.add('animate__animated', 'animate__fadeInUp')
                hasDetected.value = false
                labelDetected.value = 'unknown'
            }, (remainingTime.value * 1000))
        }

        function successState() {
            countSuccessed.value += 1
            const openRef = firebaseRef(db, "open")
            const methodRef = firebaseRef(db, "method")
            set(openRef, true)
            set(methodRef, "Face ID")
        }

        const onPlay = async () => {
            console.log("Play Video")
            if (videoEl.value.paused || videoEl.value.ended) return setTimeout(() => onPlay())
            await recognizeFaces()
            setTimeout(() => onPlay())
        }

        function getData() {
            const timerValue = firebaseRef(db, 'timer')
            onValue(timerValue, (snapshot) => {
                const data = snapshot.val()
                remainingTime.value = parseInt(data) / 1000
                timer.value = parseInt(data) / 1000
            })
        }

        onMounted(async () => {
            await nextTick()
            await getData()
            await loadModels()
            await startVideo()
        })

        return { videoEl, canvas, onPlay, labelDetected, hasDetected, countSuccessed, timer, remainingTime }
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