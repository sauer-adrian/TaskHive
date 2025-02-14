<template>
  <USlideover :overlay="false" :open="open" @update:open="emit('update:open', $event)" title="Edit Task">
    <template #body>
      <div class="space-y-4">
        <!-- Task Title Input -->
        <div class="flex gap-2 items-center w-full">
          <UInput v-model="editableTask.taskTitle" icon="i-simple-icons:hive" variant="ghost" placeholder="Enter task title..." size="lg" class="w-full"/>
          <UCheckbox size="xl" v-model="editableTask.completed" />
        </div>
        
        <!-- Task Note Input -->
        <UTextarea :rows="5" v-model="editableTask.note" placeholder="Add Note..." size="xl" class="w-full" />

        <!-- List Selection -->
        <USelect 
          size="xl" 
          placeholder="Select List" 
          trailing-icon="i-lucide-arrow-down" 
          icon="i-lucide-list" 
          :items="listItems" 
          v-model="editableTask.listId"
          class="w-full" 
        />

        <!-- Due Date Selection -->
        <USelect 
          size="xl" 
          placeholder="Due Date" 
          trailing-icon="i-lucide-arrow-down" 
          icon="i-lucide-calendar-days" 
          :items="dateItems" 
          v-model="selectedDueDate"
          @update:modelValue="updateDueDate"
          class="w-full" 
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton label="Delete" color="error" variant="outline" icon="i-lucide-trash" @click="deleteTask" />
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
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

// Props & Emits
const props = defineProps<{ 
  open: boolean; 
  task: { id: number; taskTitle: string; note: string; completed: boolean; dueDate?: string; listId?: number } | null;
  tasks: { id: number; taskTitle: string; note: string; completed: boolean; dueDate?: string; listId?: number }[]; // Add tasks prop here
}>()

const emit = defineEmits(['update:tasks', 'update:open'])

// Date Formatting
const df = new DateFormatter('en-US', { dateStyle: 'medium' })

// Date Selection Items
const dateItems = ref([
  [
    { label: 'Today', value: 'today', icon: 'i-lucide-calendar' },
    { label: 'Tomorrow', value: 'tomorrow', icon: 'i-lucide-calendar-fold' },
    { label: 'Next Week', value: 'next_week', icon: 'i-lucide-calendar-arrow-down' }
  ],
  [
    { label: 'Select Date', value: 'select_date', icon: 'i-lucide-calendar-days' }
  ]
])

// Fetch Lists from Storage
const getLists = () => {
  if (typeof window !== 'undefined') { // Ensure localStorage is accessible
    const storedLists = localStorage.getItem('HiveTaskLists');
    return storedLists ? JSON.parse(storedLists) : [];
  }
  return []; // Return empty array if running on server
};

// List Selection Items
const listItems = computed(() => {
  return getLists().map(list => ({ label: list.name, value: list.listId, icon: list.icon || 'i-lucide-folder' }))
})

// Editable Task State
const editableTask = ref<{ id: number; taskTitle: string; note: string; completed: boolean; dueDate?: string | null; listId?: number } | null>(null);

watch(() => props.task, (newTask) => {
  editableTask.value = newTask ? { ...newTask } : null;
}, { immediate: true });

// Date State
const selectedDueDate = ref(props.task?.dueDate ? new Date(props.task.dueDate) : null)
const showDatePicker = ref(false)

// Watch for Task Changes
watch(() => props.task, (newTask) => {
  if (newTask) {
    editableTask.value = { ...newTask }
    selectedDueDate.value = newTask.dueDate ? new Date(newTask.dueDate) : null
  }
}, { immediate: true })

// Update Due Date
const updateDueDate = (option) => {
  const today = new Date()
  if (option === 'today') {
    selectedDueDate.value = today
    showDatePicker.value = false
  } else if (option === 'tomorrow') {
    selectedDueDate.value = new Date(today.setDate(today.getDate() + 1))
    showDatePicker.value = false
  } else if (option === 'next_week') {
    selectedDueDate.value = new Date(today.setDate(today.getDate() + 7))
    showDatePicker.value = false
  } else {
    showDatePicker.value = true
  }
}

// Save Task Changes
const saveChanges = () => {
  if (!editableTask.value) return; // Prevents error if editableTask is null

  emit('update:tasks', { ...editableTask.value });
  emit('update:open', false);
}

// Delete Task
const deleteTask = () => {
  if (!props.tasks || !Array.isArray(props.tasks)) {
    console.error('Invalid task list');
    return;
  }

  // Ensure editableTask is not null and filter out the task by ID
  if (editableTask.value) {
    const updatedTasks = props.tasks.filter(task => task.id !== editableTask.value.id);
    
    // Emit the updated tasks list
    emit('update:tasks', updatedTasks);  
    
    // Save the updated task list to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('HiveTasks', JSON.stringify(updatedTasks)); 
    }
  }
  emit('update:open', false);  // Close the modal
};

</script>
