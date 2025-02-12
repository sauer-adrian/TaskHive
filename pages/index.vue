<template>
  <div>
    <UButton label="Show toast" color="neutral" variant="outline" @click="showToastFun" />
  </div>
</template>

<script lang="ts" setup>
const { showToast } = useToastNotification();



function showToastFun() {
  showToast("Die Excel-Datei enthält keine gültigen Datenzeilen.", "warning");
}

</script>

<style>

</style>