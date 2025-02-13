<template>
  <div class="flex justify-center min-h-screen pt-5">
    <UContainer class="w-full max-w-4xl px-4">
      <UInput v-model="task" :placeholder="randomPlaceholder" :ui="{ trailing: 'pe-1' }" class="w-full" size="xl"
        @keyup.enter="addTask">
        <template v-if="task?.length" #trailing>
          <UButton color="primary" variant="link" size="xl" icon="i-lucide-square-plus" aria-label="Add Task"
            @click="addTask" />
        </template>
      </UInput>

      <USeparator size="xl" icon="i-simple-icons:hive" class="pt-5 pb-5" />
      <TaskList :tasks="tasks" @update:tasks="updateTaskList" />
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { TaskList } from '#components'

const task = ref('')
const tasks = ref<{ 
  id: number; 
  taskTitle: string; 
  description: string; 
  completed: boolean; 
}[]>([])

// Define an array of placeholders
const placeholders = [
  'Save the world… or just add a task.',
  'What’s your next adventure?',
  'Time to conquer the to-do list!',
  'Mission: Complete this task.',
  'Don’t forget to do something... eventually.',
  'What’s your master plan for today?',
  'Time to unleash your productivity powers.',
  'Add a task and pretend you have it all together.',
  'To-do list: The legend continues...',
  'What’s the next challenge, Captain?',
  'Make today the day you actually finish something!',
  'Plotting world domination... one task at a time.',
  'Add your task before it vanishes into thin air!',
  'Today’s to-do: Survive and thrive.',
  'Don’t just sit there, add a task!'
];

// Generate a random placeholder when the component is mounted
const randomPlaceholder = ref('')

// On mounted, pick a random placeholder from the list
onMounted(() => {
  randomPlaceholder.value = placeholders[Math.floor(Math.random() * placeholders.length)];

  const savedTasks = localStorage.getItem('HiveTasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('HiveTasks', JSON.stringify(tasks.value));
};

// Add a new task
const addTask = () => {
  if (!task.value.trim()) return;

  const newTask = { 
    id: Date.now(), 
    taskTitle: task.value, 
    description: 'No description provided.', // Default description (optional)
    completed: false // Default to not completed
  };

  tasks.value.push(newTask);
  saveTasks();
  task.value = '';
};

// Update tasks when TaskDetails emits updated task list
const updateTaskList = (updatedTasks: any[]) => {
  tasks.value = updatedTasks;
  saveTasks(); // Save the updated task list to localStorage
};
</script>

<style></style>
