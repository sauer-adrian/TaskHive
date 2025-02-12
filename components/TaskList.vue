<template>
  <div class="mt-4 space-y-2">
    <div
      v-for="task in tasks"
      :key="task.id"
      class="flex justify-between items-center p-3 border rounded-lg"
    >
      <span>{{ task.text }}</span>
      <UButton @click="$emit('delete', task.id)" color="red">Delete</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ tasks: { id: number; text: string }[] }>();
defineEmits(['delete']);
</script>