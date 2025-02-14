<template>
  <div>
    <UTabs v-model="activeTab" :items="tabs" class="w-full">
      <template #content="{ item }">
        <div v-if="item.value === 'add_list'" class="p-4">
          <UInput v-model="newListName" placeholder="Enter list name..." class="mb-2" />
          <USelect v-model="selectedIcon" :items="iconOptions" class="w-48" />
          <UButton label="Create List" icon="i-lucide-plus" @click="addNewList" />
        </div>

        <div v-else>
          <div v-if="filteredTasks.length === 0" class="text-gray-500 text-center p-5">
            No tasks in this list. Add one above!
          </div>

          <div 
            v-for="task in filteredTasks" 
            :key="task.id"
            class="flex justify-between items-center p-3 border rounded border-yellow-200 cursor-pointer my-3"
            @click="openTaskDetails(task)"
          >
            <span :class="{ 'line-through text-gray-400': task.completed }">
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
      </template>
    </UTabs>

    <TaskDetails v-model:open="isSlideoverOpen" :task="selectedTask" :tasks="props.tasks" @update:tasks="emitUpdatedTasks" />

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, toRef } from 'vue'
import { TaskDetails } from '#components'

const props = defineProps<{ 
  tasks: { id: number; taskTitle: string; note: string; completed: boolean; myDay: boolean; listId: number; dueDate: string | null }[] 
}>();

const emit = defineEmits(['update:tasks'])

const activeTab = ref('all')
const isSlideoverOpen = ref(false)
const selectedTask = ref(null)
const newListName = ref('')
const selectedIcon = ref('i-lucide-folder')

const defaultTabs = [
  { label: 'All Tasks', value: 'all', icon: 'i-lucide-list-checks' },
  { label: 'My Day', value: 'myDay', icon: 'i-lucide-sun' }
]
const iconOptions = ref([
  { label: 'i-lucide-folder', value: 'i-lucide-folder', icon: 'i-lucide-folder' },
  { label: 'i-lucide-star', value: 'i-lucide-star', icon: 'i-lucide-star' },
  { label: 'i-lucide-inbox', value: 'i-lucide-inbox', icon: 'i-lucide-inbox' },
  { label: 'i-lucide-home', value: 'i-lucide-home', icon: 'i-lucide-home' }
])

const userLists = ref<{ listId: number; name: string; icon: string }[]>([])

const tabs = computed(() => [
  ...defaultTabs,
  ...userLists.value.map(list => ({ label: list.name, value: list.listId.toString(), icon: list.icon })),  // Ensure it's a string
  { label: 'Add New List', value: 'add_list', icon: 'i-lucide-plus' }
])

onMounted(() => {
  const savedLists = localStorage.getItem('HiveTaskLists')
  if (savedLists) {
    try {
      const parsedLists = JSON.parse(savedLists)
      if (Array.isArray(parsedLists)) {
        userLists.value = parsedLists.filter(list => list.listId && list.name && list.icon)
      }
    } catch (error) {
      console.error('Error parsing saved lists:', error)
      localStorage.removeItem('HiveTaskLists') // Reset if data is corrupted
    }
  }
})

const addNewList = () => {
  if (!newListName.value.trim()) return

  const newList = {
    listId: Date.now(), // Unique ID
    name: newListName.value.trim(),
    icon: selectedIcon.value // Now correctly saving selected icon
  }

  userLists.value.push(newList)
  localStorage.setItem('HiveTaskLists', JSON.stringify(userLists.value))

  newListName.value = ''
  selectedIcon.value = 'i-lucide-folder' // Reset selection after creating a list
}

const filteredTasks = computed(() => {
  const tabValue = Number(activeTab.value); // Ensure activeTab.value is a number for comparison
  if (activeTab.value === 'all') return props.tasks
  if (activeTab.value === 'myDay') return props.tasks.filter(task => task.myDay)
  return props.tasks.filter(task => task.listId === tabValue)  // Fix listId matching
})

const openTaskDetails = (task) => {
  if (!task || !task.id) return; // Prevent opening with null/undefined task

  selectedTask.value = JSON.parse(JSON.stringify(task)); // Deep copy to avoid direct prop mutation
  isSlideoverOpen.value = true;
};

const toggleTaskCompletion = (id: number) => {
  const updatedTasks = props.tasks.map(task => {
    if (!task || !task.id) return task; // Ensure task exists before modifying

    return task.id === id ? { ...task, completed: !task.completed } : task;
  });

  emit('update:tasks', updatedTasks);
};

const emitUpdatedTasks = (updatedTasks) => {
  if (!updatedTasks || !Array.isArray(updatedTasks)) return; // Ensure it's a valid array

  // Save the updated task list to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('HiveTasks', JSON.stringify(updatedTasks)); 
  }

  // Emit the updated tasks back to the parent (if necessary)
  emit('update:tasks', updatedTasks);
};

</script>
