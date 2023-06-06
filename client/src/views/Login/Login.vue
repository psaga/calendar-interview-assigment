<template>
  <div>
    <b-form class="login-form" @submit="onSubmit">
      <b-form-group
        id="username"
        label="Username:"
        label-for="username-input">
        <b-form-input
          id="username-input"
          v-model="form.username"
          type="text"
          placeholder="Enter username"
          required>
        </b-form-input>
      </b-form-group>

      <b-form-group id="password" label="Password:" label-for="password-input">
        <b-form-input
          id="password-input"
          type="password"
          v-model="form.password"
          placeholder="Enter password"
          required>
        </b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Log In</b-button>
    </b-form>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>