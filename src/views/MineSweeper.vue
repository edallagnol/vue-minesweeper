<template>
  <div>
    <div class="score columns">
      <h3 class="column">
      <Timer ref="timer" class="subtitle"/>
      </h3>
      <h3 class="column subtitle">Remaining {{remainingBombs}}</h3>
    </div>
    <div>
      <Field v-bind:size="20"
      v-bind:mines="60"
      v-bind:key="key"
      v-on:update:remainingBombs="remainingBombs = $event"
      v-on:finish="finish($event)"
      class="field"/>
    </div>
    <div class="action-buttons columns">
      <div class="column">
        <button v-on:click="restart()" class="reset button is-warning">RESET</button>
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Field from '@/components/Field.vue';
import Timer from '@/components/Timer.vue';

@Component({
  components: {
    Field,
    Timer,
  },
})
export default class MineSweeper extends Vue {
  public readonly $refs!: {
    timer: Timer;
  };
  private remainingBombs = 60;
  private key = 1;

  private mounted() {
    this.start();
  }

  private start() {
    this.$refs.timer.start();
  }

  private restart() {
    this.$refs.timer.reset();
    this.key++;
    this.start();
  }

  private finish(won: boolean) {
    this.$refs.timer.stop();
  }

}
</script>

<style scoped>
.score {
  text-align: center;
}

.action-buttons{
  text-align: center;
}

.field {
  margin: 10px auto 10px;
}
</style>