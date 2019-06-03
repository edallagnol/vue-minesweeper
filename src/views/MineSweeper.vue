<template>
  <div>
    <div class="row">
      <Timer ref="timer" class="item"/>
      <h3 class="item">Remaining {{remainingBombs}}</h3>
    </div>
    <div >
      <Field v-bind:size="20"
      v-bind:mines="60"
      v-on:update:remainingBombs="remainingBombs = $event"
      class="field"/>
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
  private remainingBombs: number = 60;

  private mounted() {
    this.start();
  }

  private start() {
    this.$refs.timer.start();
  }

}
</script>

<style scoped>
.field {
  margin: auto;
}
.row {
  display: flex;
  flex-direction: row;
}
.item {
  flex: 1
}
</style>