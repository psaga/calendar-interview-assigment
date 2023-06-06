<template>
  <div>
    <div v-if="loading">
      <b-spinner variant="warning"></b-spinner>
    </div>
    <div v-else>
      <h3>{{ message }}</h3>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>