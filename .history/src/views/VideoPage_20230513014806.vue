<template>
    <div>
      <div class="center-content page-container">
        <div>
          <div class="row center-content" v-if="isLoading">
            <input disabled :value="statusText" type="text" class="bold" />
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
          </div>
          <div class="row center-content">
            <video ref="videoEl" autoplay muted></video>
          </div>
          <div class="row">
            <label for="prediction">Prediction:</label>
            <input disabled :value="prediction" type="text" class="bold" />
          </div>
          <div class="row">
            <label for="time">Time:</label>
            <input disabled :value="time" type="text" class="bold" />
          </div>
          <div class="row">
            <label for="fps">Estimated Fps:</label>
            <input disabled :value="fps" type="text" class="bold" />
          </div>
          <div class="row">
            <button class="waves-effect waves-light btn" @click="toggleStop">
              {{ stopButtonText }}
            </button>
            <button class="waves-effect waves-light btn" @click="slower">
              <i class="material-icons left">-</i> Slower
            </button>
            <button class="waves-effect waves-light btn" @click="faster">
              <i class="material-icons left">+</i> Faster
            </button>
          </div>
          <div class="row">
            <label for="interval">Interval:</label>
            <input disabled :value="interval" type="text" class="bold" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, computed } from "vue";
  import * as faceapi from "face-api.js";
  
  export default {
    setup() {
      const videoEl = ref<HTMLVideoElement | null>(null);
      const isLoading = ref(true);
      const statusText = ref("Loading model file...");
      const prediction = ref("-");
      const time = ref("-");
      const fps = ref("-");
      const interval = ref(2000);
      const stopButtonText = ref("Stop");
  
      let isStop = false;
      let faceMatcher: any = null;
      let timeout: any = null;
      const names = ["ninno", "tarum", "viki", "gusnaidi", "abu", "dewa"];
  
      async function run() {
        try {
            await faceapi.loadSsdMobilenetv1Model("/");
            await faceapi.loadFaceRecognitionModel("/");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/")
            faceMatcher = await createFaceMatcher(names, 1);
            isLoading.value = false;
    
            await runFaceRecognition();
        } catch (err) {
            console.error(err);
        }
    }

  
      onMounted(() => {
        run();
      });
  
      function toggleStop() {
        clearTimeout(timeout);
        isStop = !isStop;
        stopButtonText.value = isStop ? "Continue" : "Stop";
        statusText.value = isStop ? "stopped" : "running face recognition:";
        if (!isStop) {
          runFaceRecognition();
        }
      }
  
    function slower() {
        interval.value = Math.min(interval.value + 100, 2000);
    }

    function faster() {
        interval.value = Math.max(interval.value - 100, 0);
    }

    async function createFaceMatcher(names: string[], numImagesPerClass: number) {
      const labeledFaceDescriptors = await Promise.all(
        names.map(async (name) => {
          const descriptors = [];
          for (let i = 1; i <= numImagesPerClass; i++) {
            const img = await faceapi.fetchImage(`datasets/${name}/${i}.jpg`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptors.push(detections?.descriptor);
          }
          return new faceapi.LabeledFaceDescriptors(name, descriptors);
        })
      );
      return new faceapi.FaceMatcher(labeledFaceDescriptors);
    }

    async function runFaceRecognition() {
      if (videoEl.value) {
        const ts = Date.now();
        const detections = await faceapi.detectSingleFace(videoEl.value).withFaceLandmarks().withFaceDescriptor();
        time.value = `${Date.now() - ts} ms`;
        fps.value = `${faceapi.utils.round(1000 / (Date.now() - ts))}`;

        const bestMatch = faceMatcher.findBestMatch(detections?.descriptor);
        prediction.value = bestMatch.toString();

        timeout = setTimeout(runFaceRecognition, interval.value);
      }
    }

    return {
      videoEl,
      isLoading,
      statusText,
      prediction,
      time,
      fps,
      interval,
      stopButtonText,
      toggleStop,
      slower,
      faster
    };
  },
};
</script>
  