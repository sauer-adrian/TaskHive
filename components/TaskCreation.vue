<template>
  <div>
    <UInput
      v-model="task"
      :placeholder="randomPlaceholder"
      :ui="{ trailing: 'pe-1' }"
      class="w-full"
      size="xl"
      @keyup.enter="addTask"
    >
      <template v-if="task?.length" #trailing>
        <UButton
          color="primary"
          variant="link"
          size="xl"
          icon="i-lucide-square-plus"
          aria-label="Add Task"
          @click="addTask"
        />
      </template>
    </UInput>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// Define emit for emitting events to the parent
const emit = defineEmits<{
  (event: 'add-task', newTask: { 
    id: number;
    taskTitle: string;
    note: string;
    completed: boolean;
    listId: number;
    dueDate: Date | null;
  }): void;
}>();

const task = ref('');
const randomPlaceholder = ref('');

const placeholders = [
  'Save the world… or just add a task.',
  'What’s your next adventure?',
  'Time to conquer the HiveTask’s!',
  'Mission: Complete this task.',
  'Don’t forget to do something... eventually.',
  'What’s your master plan for today?',
  'Time to unleash your productivity powers.',
  'Add a task and pretend you have it all together.',
  'HiveTask: The legend continues...',
  'What’s the next challenge, Captain?',
  'Make today the day you actually finish something!',
  'Plotting world domination... one task at a time.',
  'Add your task before it vanishes into thin air!',
  'Today’s to-do: Survive and thrive.',
  'Don’t just sit there, add a task!'
];

// Generate a random placeholder when the component is mounted
onMounted(() => {
  randomPlaceholder.value = placeholders[Math.floor(Math.random() * placeholders.length)];
});

const addTask = () => {
  if (!task.value.trim()) return;
  const newTask = { 
    id: Date.now(), 
    taskTitle: task.value, 
    note: '', 
    completed: false, 
    listId: 0, 
    dueDate: null 
  };
  emit('add-task', newTask); // Emit event to parent with the new task
  task.value = ''; // Reset task input field
};
</script>
