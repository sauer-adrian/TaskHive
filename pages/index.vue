<template>
  <div class="flex justify-center min-h-screen pt-5">
    <UContainer class="w-full max-w-4xl px-4">
      <!-- Use TaskCreation component -->
      <TaskCreation @add-task="addTask" />

      <USeparator size="xl" icon="i-simple-icons:hive" class="pt-5 pb-5" />
      <TaskList :tasks="tasks" @update:tasks="updateTaskList" />
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { TaskList, TaskCreation } from '#components';

const tasks = ref<{ 
  id: number; 
  taskTitle: string; 
  note: string; 
  completed: boolean;
  listId: number;
  dueDate: Date | null; 
}[]>([]);

// Load saved tasks from localStorage
onMounted(() => {
  const savedTasks = localStorage.getItem('HiveTasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks).map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null, // Ensure dueDate is a Date
    }));
  }
});

// Watch the tasks and auto-save to localStorage whenever tasks change
watch(tasks, (newTasks) => {
  localStorage.setItem('HiveTasks', JSON.stringify(newTasks));
}, { deep: true });

// Add a new task to the tasks list
const addTask = (newTask: { id: number; taskTitle: string; note: string; completed: boolean; listId: number; dueDate: Date | null }) => {
  tasks.value.push(newTask);
};

// Update tasks when TaskDetails emits updated task list
const updateTaskList = (updatedTasks: any[]) => {
  tasks.value = updatedTasks;
};
</script>
