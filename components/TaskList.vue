<template>
  <div class="space-y-5">
    <div v-if="tasks.length === 0" class="text-gray-500 text-center p-5">
      No tasks yet. Add one above!
    </div>

    <div 
      v-for="task in tasks" 
      :key="task.id"
      class="flex justify-between items-center p-3 border rounded border-yellow-200 cursor-pointer"
      @click="openTaskDetails(task)"
    >
      <span :class="{'line-through text-gray-400': task.completed}">
        {{ task.taskTitle }}
      </span>
      
      <UCheckbox 
        size="xl" 
        :model-value="task.completed"
        @update:model-value="toggleTaskCompletion(task.id)" 
        @click.stop
      />
    </div>
  </div>

  <TaskDetails
    v-model:open="isSlideoverOpen" 
    :task="selectedTask" 
    @update:tasks="emitUpdatedTasks" 
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TaskDetails } from '#components'

const props = defineProps<{ 
  tasks: { id: number; taskTitle: string; description: string; completed: boolean }[] 
}>()

const emit = defineEmits(['update:tasks'])

const isSlideoverOpen = ref(false)
const selectedTask = ref(null)

const openTaskDetails = (task: any) => {
  selectedTask.value = task
  isSlideoverOpen.value = true
}

const toggleTaskCompletion = (id: number) => {
  const updatedTasks = props.tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  localStorage.setItem('HiveTasks', JSON.stringify(updatedTasks));
  emit('update:tasks', updatedTasks); // Emit the updated tasks list
};

// Emit the updated tasks list to parent when task details change
const emitUpdatedTasks = (updatedTasks: any[]) => {
  emit('update:tasks', updatedTasks); // Emit the updated task list to parent component
};
</script>
