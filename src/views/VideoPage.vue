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
                            <div class="bg-green-500 p-5 rounded-b-lg" v-else>
                                <h5 class="m-0">Welcome {{ labelDetected }}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="mt-12 text-center flex gap-x-3 items-center justify-center">
                    <button @click="$router.push({name: 'Home'})" class="btn btn-ghost text-white">
                        <Icon icon="mdi:lock-pattern" class="text-2xl mr-3"/>
                        MANUAL LOCK
                        <Icon icon="solar:lock-password-unlocked-bold-duotone" class="text-2xl ml-3"/>
                    </button>
                    </div>
                </div>
                <div v-if="hasDetected" id="success" class="animate__animated animate__fadeIn relative z-30 text-white text-center">
                    <div :key="countSuccessed">
                        <Icon icon="solar:shield-check-bold-duotone" class="text-success inline-block text-8xl"/>
                        <h3>Hello, Welome {{  labelDetected  }}</h3>
                        <div class="radial-progress bg-black/40 transition-all text-primary-content mt-6" :style="{'--value': remainingTime * (100 / timer), '--thickness': '2px'}">{{ remainingTime }} s</div>
                        <div class="mt-3">
                            <button @click="onLeaving()" class="btn btn-ghost text-white">Setting Parameter</button>
                        </div>
                    </div>
                </div>
                <input type="checkbox" v-model="error_show" id="modal-action" class="modal-toggle" />
                <div class="modal">
                    <div class="modal-box text-white bg-black/60 backdrop-blur-lg w-11/12 max-w-lg text-center">
                        <Icon icon="iconamoon:sign-times-circle-fill" class="text-6xl mt-3 mr-3 text-red-500 inline-block"/>
                        <h3 class="font-bold text-lg">{{ error_message }}</h3>
                        <div class="modal-action">
                            <button @click="closeModalError()" class="btn w-full">Close</button>
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
import { IonContent, IonPage } from '@ionic/vue'
import { Icon } from '@iconify/vue'
import { ref as firebaseRef, set, onValue } from "firebase/database"
import { db } from "@/firebase"
import { onBeforeRouteLeave } from 'vue-router'
import { useRouter } from 'vue-router'

const input = document.getElementById('inputVideo') as HTMLVideoElement;
export default {
    components: {
        Icon,
        IonContent,
        IonPage,
    },
    setup() {
        const videoEl = ref<HTMLVideoElement | null>(null)
        const canvas = ref<HTMLCanvasElement | null>(null);
        const labels = ['ninno', 'tarum', 'dewa', 'gusnaidi', 'viki', 'abu']
        const labelDetected = ref("unknown")
        const hasDetected = ref(false)
        const leaving = ref(false)
        const countSuccessed = ref(0)
        const timer = ref(0)
        const remainingTime = ref(10)
        const loadModels = async () => {
            await faceapi.nets.ssdMobilenetv1.load('/')
            await faceapi.nets.faceLandmark68Net.load('/')
            await faceapi.nets.faceRecognitionNet.load('/')
        }
        const timerId = ref<number | undefined>(undefined);
        const faceLock: HTMLElement | null = document.getElementById("faceLock")
        const router = useRouter()
        const startVideo = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                if(videoEl.value) videoEl.value.srcObject = stream
            }
        }
        const error_message = ref("")
        const error_show = ref(false)

        onBeforeRouteLeave(() => {
            leaving.value = true
            if(videoEl.value && videoEl.value.srcObject) {
                const tracks = (videoEl.value.srcObject as MediaStream).getTracks()
                tracks.forEach(track => track.stop())
                videoEl.value.srcObject = null
            }
        })

        function onLeaving() {
            leaving.value = true
            window.location.href = '/home'
        }

        const getLabeledFaceDescriptors = async () => {
            if (leaving.value) return
            if (hasDetected.value) return
            return Promise.all(
                labels.map(async label => {
                    const imgUrl = `/datasets/${label}/1.jpg`
                    const img = await faceapi.fetchImage(imgUrl)
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                    if (detections) return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor])
                })
            )
        }

        const recognizeFaces = async () => {
            if (leaving.value) return
            if (hasDetected.value) return
            if (!videoEl.value?.videoWidth || !videoEl.value?.videoHeight) return;
            const labeledFaceDescriptors = await getLabeledFaceDescriptors()
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
            if (!videoEl.value) {
                console.error('Video element is null');
                return;
            }
            const detections = await faceapi.detectAllFaces(videoEl.value).withFaceLandmarks().withFaceDescriptors()
            if(videoEl.value && canvas.value) {
                const dims = faceapi.matchDimensions(canvas.value, videoEl.value, true)
                const resizedDetections = faceapi.resizeResults(detections, dims)
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
                if (canvas.value) {
                    const context = canvas.value.getContext('2d');
                    if (context) context.clearRect(0, 0, canvas.value.width, canvas.value.height);
                }
                results.forEach((bestMatch, i) => {
                    const box = resizedDetections[i].detection.box
                    if (canvas.value) {
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
                    } else {
                        console.error('Canvas is null');
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
                autoCloseDoor()
            }, (remainingTime.value * 1000))
        }

        function successState() {
            countSuccessed.value += 1
            const openRef = firebaseRef(db, "open")
            const methodRef = firebaseRef(db, "method")
            set(openRef, true)
            set(methodRef, "Face ID")
        }

        function autoCloseDoor() {
            const openRef = firebaseRef(db, "open")
            const methodRef = firebaseRef(db, "method")
            set(openRef, false)
            set(methodRef, "Face ID")
        }

        const onPlay = async (): Promise<void> => {
            if(videoEl.value?.paused || videoEl.value?.ended) {
                setTimeout(() => onPlay())
                return
            }
            await recognizeFaces()
            setTimeout(() => onPlay())
        }

        function getData() {
            const timerValue = firebaseRef(db, 'timer')
            onValue(timerValue, (snapshot) => {
                const data = snapshot.val()
                remainingTime.value = parseInt(data) / 1000
                timerId.value = undefined
                timer.value = parseInt(data) / 1000
            })
            const errorMessageValue = firebaseRef(db, 'error/message')
            onValue(errorMessageValue, (snapshot) => {
                const data = snapshot.val()
                error_message.value = data
            })
            const errorValue = firebaseRef(db, 'error/show')
            onValue(errorValue, (snapshot) => {
                const data = snapshot.val()
                error_show.value = data
            })
        }   
        
        function closeModalError() {
            error_show.value = false
            const errorMessageValue = firebaseRef(db, 'error/show')
            set(errorMessageValue, false)
        }

        onMounted(async () => {
            leaving.value = false
            await nextTick()
            await getData()
            await loadModels()
            await startVideo()
        })

        return { videoEl, canvas, error_show, closeModalError, error_message,  onPlay, onLeaving, leaving, labelDetected, hasDetected, countSuccessed, timer, remainingTime }
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