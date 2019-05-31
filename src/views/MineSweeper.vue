<template>
  <div>
    <Field v-bind:size="10"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Field from '@/components/Field.vue';

@Component({
  components: {
    Field
  },
})
export default class MineSweeper extends Vue {


}
</script>
