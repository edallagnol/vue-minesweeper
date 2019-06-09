<template>
  <div>
    <h3>Time {{time}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { differenceInSeconds } from 'date-fns';

@Component
export default class Timer extends Vue {
    private time = 0;
    private interval?: number;

    public start() {
        this.stop();

        const startTime = new Date();

        this.interval = setInterval(() => {
            this.time = differenceInSeconds(new Date(), startTime);
        }, 1000);
    }


    public stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval  = undefined;
        }
    }


    public reset() {
        this.stop();
        this.time = 0;
    }

    private beforeDestroy() {
        stop();
    }
}
</script>