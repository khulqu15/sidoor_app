<template>
    <ion-page>
        <ion-content>
            <div class="min-h-screen w-full relative overflow-hidden">
                <div class="absolute w-full h-full z-20 bg-black/70"></div>
                <img src="/assets/wallpaper.jpg" class="absolute h-full w-full object-cover object-center" alt="wallpaper">
                <div class="grid text-white relative z-30 grid-cols-1 items-center min-h-screen justify-items-center p-8">
                    <div class="space-y-6">
                        <h3 class="mb-8 font-bold">Setting Parameter</h3>
                        <div class="space-y-3">
                            <label class="text-white" for="timer">Timer Auto Close Door (Second)</label>
                            <input type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div class="space-y-3">
                            <label class="text-white" for="timer">Pin lock value</label>
                            <input type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div class="space-y-3">
                            <label class="text-white" for="timer">Pattern lock value</label>
                            <input type="number" min="10" minlength="10" class="input w-full bg-black/50 text-white" />
                        </div>
                        <div class="grid grid-cols-2 gap-x-4">
                            <div>
                                <button class="btn bg-primary/20 border-2 border-primary w-full">New Finger</button>
                            </div>
                            <div>
                                <button class="btn bg-primary/20 border-2 border-primary w-full">New RFID</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </ion-content>
    </ion-page>
</template>