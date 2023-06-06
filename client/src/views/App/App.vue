<template>
  <div id="app">
    <div id="nav" v-if="user">
      Hi {{user.username}} &#128075; - 
      <a href="#" @click="logout($event)">Logout</a> 
    </div>
    <div v-else id="nav">
      <router-link to="/calendar">Calendar</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/sign-up">Sign Up</router-link>
    </div>
    <router-view/>
    <notifications position="bottom center"/>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>