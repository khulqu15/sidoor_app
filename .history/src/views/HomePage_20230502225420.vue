<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="min-h-screen w-full relative">
        <div class="absolute w-full h-full z-20 bg-black/70"></div>
        <img src="/assets/wallpaper.jpg" class="absolute h-full object-cover object-center" alt="wallpaper">
        <div class="grid grid-cols-1 items-center min-h-screen justify-items-center">
          <div id="loading" class="relative z-30 text-white w-full text-center py-12 transition-all rounded-2xl">
            <div id="hello" class="animate__animated animate__fadeInDown text-4xl font-bold">Hello, I'm Sidoor</div>
            <div id="smart_door" class="text-2xl font-bold hidden">Secure your home door with <br> our advanced technology</div>
            <div id="enjoy_it" class="text-3xl font-bold hidden">Enjoy convenience and security <br> at your fingertips</div>
          </div>
          <div id="lock-content" class="relative w-1/2 z-30">
            <div id="pin">
              <div class="grid grid-cols-1 items-center justify-items-center">
                <div>
                  <div class="flex items-center gap-x-3">
                    <Icon icon="solar:lock-password-unlocked-bold-duotone" class="text-white text-3xl" />
                    <h3 class="text-white">PIN LOCK</h3>
                  </div>
                  <div class="w-50">
                    <input 
                      type="password" 
                      placeholder="•••••"
                      maxlength="5"
                      :readonly="true"
                      class="input w-full bg-black/30 mt-4 backdrop-blur border border-white text-white tracking-widest w-44 h-20 text-7xl pb-3"/>
                  </div>
                </div>
              </div>
              <div class="w-full bg-black/40 rounded-2xl backdrop-blur mx-auto mt-6 p-8 space-y-6">
                <div class="grid grid-cols-3 items-center justify-items-center">
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">1</button></div>
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">2</button></div>
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">3</button></div>
                </div>
                <div class="grid grid-cols-3 items-center justify-items-center">
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">4</button></div>
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">5</button></div>
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">6</button></div>
                </div>
                <div class="grid grid-cols-3 items-center justify-items-center">
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">7</button></div>
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">8</button></div>
                  <div><button class="btn bg-black/30 border-1 border-white w-20 h-20 rounded-full text-xl">9</button></div>
                </div>
              </div>
            </div>
            <div id="pattern"></div>
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
      loaded: false
    }
  },
  mounted() {
    const has_load = localStorage.getItem('has_load')
    if(!has_load) {
      localStorage.setItem('has_load', "1")
      this.runLoading()
    } else document.getElementById('loading')?.classList.add('hidden')
  },
  methods: {
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
