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
          <div :key="mode" id="lock-content" class="relative md:w-1/2 sm:w-3/4 z-30 animate__animated animate__fadeInUp">
            <div id="pin" class="max-w-md mx-auto z-20 relative">
              <div class="grid grid-cols-1 items-center justify-items-center">
                <div>
                  <div class="flex items-center justify-center gap-x-3">
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
              <div class="w-full bg-black/40 rounded-2xl backdrop-blur mx-auto mt-6 p-8 space-y-4">
                <div v-for="row in 3" :key="row" class="grid grid-cols-3 items-center justify-items-center">
                  <div v-for="num in 3" :key="num">
                    <button @click="fillPin(3 * (row - 1) + num)" class="btn bg-black/30 border-1 border-white w-16 h-16 rounded-full text-xl">{{ 3 * (row - 1) + num }}</button>
                  </div>
                </div>
                <div class="grid grid-cols-3 items-center justify-items-center">
                  <div></div>
                  <div><button @click="fillPin(0)" class="btn bg-black/30 border-1 border-white w-16 h-16 rounded-full text-xl">0</button></div>
                  <div><button @click="deleteLastChar()" class="btn bg-black/30 border-1 border-white w-16 h-16 rounded-full text-xl">
                    <Icon icon="icon-park-twotone:delete-key" class="text-3xl"/>
                  </button></div>
                </div>
              </div>
              <div class="mt-12 text-center flex gap-x-3 items-center justify-center">
                <button @click="$router.push({name: 'Video'})" class="btn btn-ghost text-white">
                  <Icon icon="solar:face-scan-square-bold-duotone" class="text-2xl mr-3"/>
                  FACE ID
                </button>
                <button @click="changeMode('pattern')" class="btn btn-ghost text-white">
                  <Icon icon="mdi:lock-pattern" class="text-2xl mr-3"/>
                  PATTERN LOCK
                </button>
              </div>
            </div>
            <div id="pattern" class="absolute max-w-md mx-auto bottom-0 opacity-0 z-10">
              <div class="grid grid-cols-1 items-center justify-items-center">
                <div>
                  <div class="flex items-center gap-x-3">
                    <Icon icon="mdi:lock-pattern" class="text-white text-3xl" />
                    <h3 class="text-white">PATTERN LOCK</h3>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-center bg-black/40 rounded-2xl backdrop-blur mx-auto mt-6 p-6">
                <div class="grid grid-cols-3 w-72 gap-x-0 gap-y-0 items-center justify-items-center">
                  <div @click="clickPattern(row)" 
                      @mousemove="mouseMovePattern($event ,row)" 
                      @mouseenter="mouseEnterPattern(row)" 
                      @mouseleave="mouseLeavePattern(row)" 
                      v-for="row in 9" 
                      :key="row" 
                      class="text-white text-center w-24 h-24 btn btn-ghost rounded-full">
                    <div :class="{'w-4 h-4 bg-primary border-0': pattern.value.find(item => item == row)}" 
                        class="w-3 h-3 rounded-full transition-all border-2 border-white hover:border-0 hover:bg-primary"></div>
                  </div>
                </div>
              </div>
              <div class="mt-12 text-center flex gap-x-3 items-center justify-center">
                <button @click="$router.push({name: 'Video'})" class="btn btn-ghost text-white">
                  <Icon icon="solar:face-scan-square-bold-duotone" class="text-2xl mr-3"/>
                  FACE ID
                </button>
                <button @click="changeMode('pin')" class="btn btn-ghost text-white">
                  <Icon icon="solar:lock-password-unlocked-bold-duotone" class="text-2xl mr-3"/>
                  PIN LOCK
                </button>
              </div>
            </div>
            <div v-if="correct" id="success" class="animate__animated animate__fadeIn relative z-30 text-white text-center">
              <div :key="count_success">
                <Icon icon="solar:shield-check-bold-duotone" class="text-success inline-block text-8xl"/>
                <h3>Hello, Welome Buddy</h3>
                <div class="radial-progress bg-black/40 transition-all text-primary-content mt-6" :style="{'--value': (mode === 'pin' ? remainingTime : remainingTime1) * (100 / timer), '--thickness': '2px'}">{{ (mode === 'pin' ? remainingTime : remainingTime1) }} s</div>
                <div class="mt-3">
                  <button @click="$router.push({name: 'Setting'})" class="btn btn-ghost text-white">Setting Parameter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
import { defineComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { ref as firebaseRef, set, onValue } from "firebase/database"
import { db } from "@/firebase"

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
      count_success: 0,
      loaded: false,
      pin: '',
      pattern: {
        correct_value: [1, 2, 3, 6, 9] as number[],
        value: [] as number[],
        timeoutId: null as ReturnType<typeof setTimeout> | null
      },
      pin_correct_value: 12345,
      mode: 'pin',
      correct: false,
      remainingTime: 10,
      timer: 10,
      timerId: undefined as number | undefined,
      remainingTime1: 10,
      timerId1: undefined as number | undefined,
    }
  },
  mounted() {
    this.valueRefRTDB()
    this.checkRealTimeData()
    const has_load = localStorage.getItem('has_load')
    if(!has_load) {
      localStorage.setItem('has_load', "1")
      this.runLoading()
      document.getElementById('lock-content')?.classList.add('hidden')
    } else document.getElementById('loading')?.classList.add('hidden')
  },
  methods: {
    valueRefRTDB() {
      const timerValue = firebaseRef(db, 'timer')
      onValue(timerValue, (snapshot) => {
          const data = snapshot.val()
          this.remainingTime = parseInt(data) / 1000
          this.remainingTime1 = parseInt(data) / 1000
          this.timer = parseInt(data) / 1000
      })

      const pinValue = firebaseRef(db, 'app/pin')
      onValue(pinValue, (snapshot) => {
          const data = snapshot.val()
          this.pin_correct_value = parseInt(data)
      })

      const patternValue = firebaseRef(db, 'app/pattern')
      onValue(patternValue, (snapshot) => {
          const data = snapshot.val()
          const array = data.split(',')
          const numberArray = array.map(Number)
          this.pattern.correct_value = numberArray
          console.log(this.pattern.correct_value)
      })
    },
    checkRealTimeData() {
      const pattern_content: HTMLElement | null = document.getElementById('pattern')
      const pin_input: HTMLElement | null = document.getElementById('pin_input')
      const pin_content: HTMLElement | null = document.getElementById('pin')
      const openRef = firebaseRef(db, 'open')
      onValue(openRef, (snapshot) => {
        const data = snapshot.val()
        if(data) {
          if(this.mode == 'pin') {
            pin_input?.classList.add('animate__animated', 'animate__shakeY', 'border', 'border-success')
            pin_content?.classList.add('animate__animated', 'animate__fadeOut')
            setTimeout(() => {
              pin_content?.classList.add('hidden')
              this.correct = true
              this.startTimer()
            }, 1000)
          } else if(this.mode == 'pattern') {
            pattern_content?.classList.add('animate__animated', 'animate__fadeOut')
            setTimeout(() => {
              pattern_content?.classList.add('hidden')
              this.remainingTime1 = 10
              this.correct = true
              this.startTimer()
            }, 1000)
          }
        }
      })
    },
    successState(method: string, open: boolean) {
      this.count_success += 1
      const openRef = firebaseRef(db, "open")
      const methodRef = firebaseRef(db, "method")
      set(openRef, open)
      set(methodRef, method)
    },
    clickPattern(row: number) {
      if(!this.pattern.value.find(item => item == row)) {
        this.pattern.value.push(row)
      }
    },
    mouseEnterPattern(row: number) {
      const pattern_content: HTMLElement | null = document.getElementById('pattern')
      if(this.pattern.timeoutId) clearTimeout(this.pattern.timeoutId)
      if(!this.pattern.value.find(item => item == row)) {
        this.pattern.value.push(row)
      }
      if(this.pattern.value.length == this.pattern.correct_value.length) {
        for (let i=0; i<this.pattern.value.length; i++) {
          if(this.pattern.value[i] == this.pattern.correct_value[i]) {
            console.log('correct')
            this.successState("Pattern Lock", true)
            pattern_content?.classList.add('animate__animated', 'animate__fadeOut')
            setTimeout(() => {
              pattern_content?.classList.add('hidden')
              this.remainingTime1 = 10
              this.correct = true
              this.startTimer()
            }, 1000)
          }
        }
      }
    },
    mouseMovePattern(event: any ,row: number) {
      console.log(`X: ${event.clientX}, Y: ${event.clientY}`);
    },
    mouseLeavePattern(row: number) {
      this.pattern.timeoutId = setTimeout(() => {
        if(this.pattern.value.length !== this.pattern.correct_value.length) this.pattern.value = [] as number[]
        for (let i=0; i<this.pattern.value.length; i++) {
          if(this.pattern.value[i] !== this.pattern.correct_value[i]) this.pattern.value = [] as number[]
        }
      }, 3000)
    },
    fillPin(value: number) {
      const pin_input: HTMLElement | null = document.getElementById('pin_input')
      const pin_content: HTMLElement | null = document.getElementById('pin')
      pin_input?.classList.remove('animate__animated', 'animate__shakeX', 'animate__shakeY', 'border', 'border-red-500', 'border-success')
      if(!this.correct) this.pin += value.toString()
      // if(this.pin.length >= 5) {
        if(this.pin === this.pin_correct_value.toString()) {
          console.log('correct')
          this.successState("Pin Lock", true)
          pin_input?.classList.add('animate__animated', 'animate__shakeY', 'border', 'border-success')
          pin_content?.classList.add('animate__animated', 'animate__fadeOut')
          setTimeout(() => {
            pin_content?.classList.add('hidden')
            this.correct = true
            this.startTimer()
          }, 1000)
        // }
        // else {
        //   console.log('incorrect')
        //   pin_input?.classList.add('animate__animated', 'animate__shakeX', 'border', 'border-red-500')
        //   this.pin = '' 
        // }
      }
    },
    changeMode(value: string) {
      this.mode = value
      const pin_content: HTMLElement | null = document.getElementById('pin')
      const pattern_content: HTMLElement | null = document.getElementById('pattern')
      if(value == 'pattern') {
        pin_content?.classList.add('w-full', 'animate__animated', 'animate__fadeOutDown', 'bottom-0')
        setTimeout(() => {
          pattern_content?.classList.remove('hidden')
          pin_content?.classList.add('hidden')
          pattern_content?.classList.remove('absolute', 'bottom-0', 'opacity-0', 'animate__animated', 'animate__fadeOutDown')
          pattern_content?.classList.add('animate__animated', 'animate__fadeInUp')
        }, 1500);
      } else if(value == 'pin') {
        pattern_content?.classList.add('absolute', 'w-full', 'animate__animated', 'animate__fadeOutDown', 'bottom-0')
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
      if(this.mode == 'pin') {
        this.timerId = window.setInterval(() => {
          this.remainingTime -= 1;
          if (this.remainingTime <= 0) {
            window.clearInterval(this.timerId);
            this.timerId = undefined;
            this.remainingTime = 0;
          }
        }, 1000);
      } else if(this.mode == 'pattern') {
        this.timerId1 = window.setInterval(() => {
          this.remainingTime1 -= 1;
          if (this.remainingTime1 <= 0) {
            window.clearInterval(this.timerId1);
            this.timerId1 = undefined;
            this.remainingTime1 = 0;
          }
        }, 1000);
      }
      setTimeout(() => {
        this.pin = ''
        this.pattern.value = [] as number[]
        this.correct = false
        const pin_input: HTMLElement | null = document.getElementById('pin_input')
        const pin_content: HTMLElement | null = document.getElementById('pin')
        const pattern_content: HTMLElement | null = document.getElementById('pattern')
        pin_input?.classList.remove('animate__animated', 'animate__shakeY', 'border', 'border-success')
        if(this.mode == 'pin') {
          // this.successState("Pin Lock", false)
          pin_content?.classList.remove('animate__animated', 'animate__fadeOut')
          pin_content?.classList.remove('hidden')
          pin_content?.classList.add('animate__animated', 'animate__fadeInUp')
        }
        if(this.mode == 'pattern') {
          // this.successState("Pattern Lock", false)
          pattern_content?.classList.remove('animate__animated', 'animate__fadeOut')
          pattern_content?.classList.remove('hidden')
          pattern_content?.classList.add('animate__animated', 'animate__fadeInUp')
        }
      }, (this.remainingTime * 1000))
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
