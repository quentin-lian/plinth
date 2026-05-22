<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <main>
    <h1>bitfe Vue Template</h1>
    <p>Edit src/App.vue to start building.</p>
    <button type="button" @click="count++">count is {{ count }}</button>
  </main>
</template>
