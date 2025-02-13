<template>
  <USlideover :overlay="false" :open="open" @update:open="emit('update:open', $event)" :title="'Edit Task'">
    <template #body>
      <div class="space-y-4">
        <!-- Task Title Input -->
        <div class="flex gap-2 items-center w-100">
          <UInput v-model="editableTask.taskTitle" placeholder="Enter task title..." size="lg" class="w-100"/>
          <UCheckbox size="xl" v-model="editableTask.completed" />
        </div>
        

        <!-- Task Description Input -->
        <UTextarea v-model="editableTask.description" placeholder="Enter task description..." size="xl" class="w-100" />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <!-- Delete Button -->
        <UButton label="Delete" color="red" variant="outline" icon="i-lucide-trash" @click="deleteTask" />

        <div class="flex gap-2">
          <UButton label="Cancel" color="neutral" @click="emit('update:open', false)" />
          <UButton label="Save" color="primary" @click="saveChanges" />
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, watch, ref } from 'vue'

const props = defineProps<{ 
  open: boolean; 
  task: { id: number; taskTitle: string; description: string; completed: boolean } | null 
}>()

const emit = defineEmits(['update:tasks', 'update:open'])

const editableTask = computed({
  get: () => ({ ...props.task }),
  set: (updatedTask) => {
    // No need to emit here, just update the task on saveChanges
  }
});

// Watch for changes in props.task and update editableTask
watch(() => props.task, (newTask) => {
  if (newTask) {
    editableTask.value = { ...newTask }
  }
}, { immediate: true })

const getTasks = () => {
  const storedTasks = localStorage.getItem('HiveTasks')
  return storedTasks ? JSON.parse(storedTasks) : []
}

// Save edited task
const saveChanges = () => {
  if (!editableTask.value.taskTitle.trim()) return

  let tasks = getTasks()
  const index = tasks.findIndex(task => task.id === editableTask.value.id)

  if (index !== -1) {
    tasks[index] = editableTask.value
    localStorage.setItem('HiveTasks', JSON.stringify(tasks))
    emit('update:tasks', tasks) // Emit the updated tasks list to parent component
  }

  emit('update:open', false) // Close Slideover after saving
}

// Delete task
const deleteTask = () => {
  let tasks = getTasks()
  tasks = tasks.filter(task => task.id !== props.task?.id)

  localStorage.setItem('HiveTasks', JSON.stringify(tasks))
  emit('update:tasks', tasks) // Emit updated tasks list to parent component

  emit('update:open', false) // Close Slideover after deleting
}
</script>
