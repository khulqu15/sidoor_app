<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full relative overflow-hidden">
        <div class="absolute w-full h-full z-20 bg-black/70"></div>
        <img src="/assets/wallpaper.jpg" class="absolute h-full w-full object-cover object-center" alt="wallpaper">
        <div class="grid grid-cols-1 items-center min-h-screen justify-items-center">
          <div id="loading" class="relative z-30 text-white w-full text-center py-12 transition-all rounded-2xl">
            <div id="hello" class="animate__animated animate__fadeInDown text-4xl font-bold">Hello, I'm Sidoor</div>
            <div id="smart_door" class="text-2xl font-bold hidden">Secure your home door with <br> our advanced technology</div>
            <div id="enjoy_it" class="text-3xl font-bold hidden">Enjoy convenience and security <br> at your fingertips</div>
          </div>
          <div id="lock-content" class="relative md:w-1/2 sm:w-3/4 z-30 animate__animated animate__fadeInUp">
            <div id="pin" class="absolute bottom-0 opacity-0 z-10">
              <div class="grid grid-cols-1 items-center justify-items-center">
                <div>
                  <div class="flex items-center gap-x-3">
                    <Icon icon="solar:lock-password-unlocked-bold-duotone" class="text-white text-3xl" />
                    <h3 class="text-white">PIN LOCK</h3>
                  </div>
                  <div class="w-50">
                    <input 
                      v-model="pin"
                      id="pin_input"
                      type="password" 
                      maxlength="5"
                      :readonly="true"
                      class="input w-full bg-black/30 mt-4 backdrop-blur text-white tracking-widest w-44 h-20 text-7xl pb-3"/>
                  </div>
                </div>
              </div>
              <div class="w-full bg-black/40 rounded-2xl backdrop-blur mx-auto mt-6 p-8 space-y-6">
                <div v-for="row in 3" :key="row" class="grid grid-cols-3 items-center justify-items-center">
                  <div v-for="num in 3" :key="num">
                    <button @click="fillPin(3 * (row - 1) + num)" class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">{{ 3 * (row - 1) + num }}</button>
                  </div>
                </div>
                <div class="grid grid-cols-3 items-center justify-items-center">
                  <div></div>
                  <div><button @click="fillPin(0)" class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">0</button></div>
                  <div><button @click="deleteLastChar()" class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">
                    <Icon icon="icon-park-twotone:delete-key" class="text-3xl"/>
                  </button></div>
                </div>
              </div>
              <div class="mt-12 text-center">
                <button @click="changeMode('pattern')" class="btn btn-ghost text-white">
                  <Icon icon="mdi:lock-pattern" class="text-2xl mr-3"/>
                  PATTERN LOCK
                </button>
              </div>
            </div>
            <div id="pattern" class="z-20 relative">
              <div class="grid grid-cols-1 items-center justify-items-center">
                <div>
                  <div class="flex items-center gap-x-3">
                    <Icon icon="mdi:lock-pattern" class="text-white text-3xl" />
                    <h3 class="text-white">PATTERN LOCK</h3>
                  </div>
                </div>
              </div>
              <div class="w-full bg-black/40 rounded-2xl backdrop-blur mx-auto mt-6 p-6">
                <div class="grid grid-cols-3 items-center justify-items-center">
                  <div v-for="row in 9" :key="row" class="text-white text-center my-4 w-24 h-24 bg-primary rounded-full flex items-center justify-items-center">{{ row }}</div>
                </div>
              </div>
              <div class="mt-12 text-center">
                <button @click="changeMode('pin')" class="btn btn-ghost text-white">
                  <Icon icon="solar:lock-password-unlocked-bold-duotone" class="text-2xl mr-3"/>
                  PIN LOCK
                </button>
              </div>
            </div>
            <div v-if="correct" id="success" class="animate__animated animate__fadeIn relative z-30 text-white text-center">
              <Icon icon="solar:shield-check-bold-duotone" class="text-success inline-block text-8xl"/>
              <h3>Hello, Welome Buddy</h3>
              <div class="radial-progress bg-black/40 transition-all text-primary-content mt-6" :style="{'--value': remainingTime * 10, '--thickness': '2px'}">{{ remainingTime }} s</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';

export default defineComponent({
  components: {
    IonContent,
    IonPage,
    Icon
  },
  data() {
    return {
      node: {
        num: 0,
      },
      loaded: false,
      pin: '',
      pattern: {
        correct_value: [1, 2, 3, 6, 9],
        value: []
      },
      mode: 'pin',
      correct: false,
      remainingTime: 10,
      timerId: undefined as number | undefined,
    }
  },
  mounted() {
    const has_load = localStorage.getItem('has_load')
    if(!has_load) {
      localStorage.setItem('has_load', "1")
      this.runLoading()
      document.getElementById('lock-content')?.classList.add('hidden')
    } else document.getElementById('loading')?.classList.add('hidden')
  },
  methods: {
    fillPin(value: number) {
      const pin_input: HTMLElement | null = document.getElementById('pin_input')
      const pin_content: HTMLElement | null = document.getElementById('pin')
      pin_input?.classList.remove('animate__animated', 'animate__shakeX', 'animate__shakeY', 'border', 'border-red-500', 'border-success')
      if(!this.correct) this.pin += value.toString()
      if(this.pin.length >= 5) {
        if(this.pin === "11223") {
          console.log('correct')
          pin_input?.classList.add('animate__animated', 'animate__shakeY', 'border', 'border-success')
          pin_content?.classList.add('animate__animated', 'animate__fadeOut')
          setTimeout(() => {
            pin_content?.classList.add('hidden')
            this.correct = true
            this.startTimer()
          }, 1000)
        } else {
          console.log('incorrect')
          pin_input?.classList.add('animate__animated', 'animate__shakeX', 'border', 'border-red-500')
          this.pin = '' 
        }
      }
    },
    changeMode(value: string) {
      this.mode = value
      const pin_content: HTMLElement | null = document.getElementById('pin')
      const pattern_content: HTMLElement | null = document.getElementById('pattern')
      if(value == 'pattern') {
        pin_content?.classList.add('absolute', 'animate__animated', 'animate__fadeOutDown', 'bottom-0')
        setTimeout(() => {
          pattern_content?.classList.remove('hidden')
          pin_content?.classList.add('hidden')
          pattern_content?.classList.remove('absolute', 'bottom-0', 'opacity-0', 'animate__animated', 'animate__fadeOutDown')
          pattern_content?.classList.add('animate__animated', 'animate__fadeInUp')
        }, 1500);
      } else if(value == 'pin') {
        pattern_content?.classList.add('absolute', 'animate__animated', 'animate__fadeOutDown', 'bottom-0')
        setTimeout(() => {
          pin_content?.classList.remove('hidden')
          pattern_content?.classList.add('hidden')
          pin_content?.classList.remove('absolute', 'bottom-0', 'opacity-0', 'animate__animated', 'animate__fadeOutDown')
          pin_content?.classList.add('animate__animated', 'animate__fadeInUp')
        }, 1500);
      }
    },
    deleteLastChar() {
      if(!this.correct) this.pin = this.pin.slice(0, -1)
    },
    startTimer() {
      this.timerId = setInterval(() => {
        this.remainingTime -= 1;

        if (this.remainingTime <= 0) {
          clearInterval(this.timerId);
          this.timerId = undefined;
          this.remainingTime = 0;
        }
      }, 1000);
      setTimeout(() => {
        this.pin = ''
        this.correct = false
        const pin_input: HTMLElement | null = document.getElementById('pin_input')
        const pin_content: HTMLElement | null = document.getElementById('pin')
        pin_input?.classList.remove('animate__animated', 'animate__shakeY', 'border', 'border-success')
        pin_content?.classList.remove('animate__animated', 'animate__fadeOut')
        pin_content?.classList.remove('hidden')
        pin_content?.classList.add('animate__animated', 'animate__fadeInUp')
        this.remainingTime = 10
      }, 10000)
    },
    runLoading() {
      const text_hello: HTMLElement | null = document.getElementById('hello')
      const smart_door: HTMLElement | null = document.getElementById('smart_door')
      const enjoy_it: HTMLElement | null = document.getElementById('enjoy_it')
      setTimeout(() => {
        text_hello?.classList.remove('animate__animated', 'animate__fadeInDown')
        text_hello?.classList.add('animate__animated', 'animate__fadeOutDown')
      }, 3000);
      setTimeout(() => {
        smart_door?.classList.remove('hidden')
        smart_door?.classList.add('animate__animated', 'animate__fadeInLeft')
      }, 4000);
      setTimeout(() => {
        smart_door?.classList.remove('animate__animated', 'animate__fadeInLeft')
        smart_door?.classList.add('animate__animated', 'animate__fadeOutRight')
      }, 6000)
      setTimeout(() => {
        enjoy_it?.classList.remove('hidden')
        enjoy_it?.classList.add('animate__animated', 'animate__fadeInRight')
      }, 7000);
      setTimeout(() => {
        enjoy_it?.classList.remove('animate__animated', 'animate__fadeInRight')
        enjoy_it?.classList.add('animate__animated', 'animate__fadeOutLeft')
      }, 9000);
      setTimeout(() => {
        document.getElementById('loading')?.classList.add('hidden')
        document.getElementById('lock-content')?.classList.remove('hidden')
      }, 10000)
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lobster&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
* {
  font-family: 'Montserrat', sans-serif;
  /* font-family: 'Lobster', sans-serif; */
}
</style>
