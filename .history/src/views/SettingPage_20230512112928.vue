<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen w-full relative overflow-hidden">
                <div class="absolute w-full h-full z-20 bg-black/70"></div>
                <img src="/assets/wallpaper.jpg" class="absolute h-full w-full object-cover object-center" alt="wallpaper">
                <div class="grid text-white relative z-30 grid-cols-1 items-center min-h-screen justify-items-center p-8">
                    <div class="space-y-6 max-w-md">
                        <h3 class="mb-8 font-bold">Setting Parameter</h3>
                        <div class="space-y-3">
                            <label class="text-white" for="timer">Timer Auto Close Door (Second)</label>
                            <input v-model="timer" @keyup="saveData()" type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div class="space-y-3">
                            <label class="text-white" for="timer">Pin lock value</label>
                            <input v-model="pin" @keyup="saveData()" type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div class="space-y-3">
                            <label class="text-white" for="timer">Pattern lock value</label>
                            <input v-model="pattern" type="number" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div class="grid grid-cols-2 gap-x-4">
                            <div>
                                <button @click="recordData('finger')" class="btn bg-primary/20 border-2 border-primary text-white w-full">
                                    <Icon icon="heroicons:finger-print-20-solid" class="text-2xl mr-3"/>
                                    New Finger
                                </button>
                            </div>
                            <div>
                                <button @click="recordData('rfid')" class="btn bg-primary/20 border-2 border-primary text-white w-full">
                                    <Icon icon="tabler:nfc" class="text-2xl mr-3"/>
                                    New RFID
                                </button>
                            </div>
                        </div>
                        <div>
                            <button class="btn bg-primary w-full">Save Data</button>
                        </div>
                        <input type="checkbox" v-model="modal_checkbox" id="modal-action" class="modal-toggle" />
                        <div class="modal">
                            <div class="modal-box bg-black/60 backdrop-blur-lg w-11/12 max-w-lg text-center">
                                <h3 class="font-bold text-lg">Record Data {{ mode == 'finger' ? 'FingerPrint' : 'RFID Card' }}</h3>
                                <Icon v-if="mode == 'finger'" icon="heroicons:finger-print-20-solid" class="text-6xl mt-3 mr-3 text-primary inline-block"/>
                                <Icon v-else icon="tabler:nfc" class="text-6xl mt-3 mr-3 text-primary inline-block"/>
                                <p class="py-4">{{ mode == 'finger' ? 'Please place your finger on the fingerprint scanner.' : 'Please attach your card to the RFID / NFC reader' }}</p>
                                <div class="modal-action">
                                    <label for="modal-action" class="btn w-full">Cancel</label>
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
    data() {
        return {
            modal_checkbox: false,
            mode: 'finger',
            timer: 10,
            pin: 11223, 
            pattern: 12359, 
        }
    },
    components: {
        IonContent,
        IonPage,
        Icon
    },
    methods: {
        recordData(method: string) {
            this.mode = method
            this.modal_checkbox = true
        },
        saveData() {
            const timerRef = firebaseRef(db, 'timer')
            if(this.timer < 10) set(timerRef, 10000)
            else set(timerRef, (this.timer * 1000))

            const pinRef = firebaseRef(db, 'app/pin')
            set(pinRef, this.pin)
        }
    }
})
</script>