<template>
  <div>
    <Field v-bind:size="20" v-bind:mines="60"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Field from '@/components/Field.vue';

@Component({
  components: {
    Field,
  },
})
export default class MineSweeper extends Vue {


}
</script>
