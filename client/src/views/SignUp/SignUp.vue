<template>
  <div>
    <b-form class="sign-up-form" @submit="onSubmit">
      <b-form-group
        id="user_name"
        label="Name:"
        label-for="name-input">
        <b-form-input
          id="name-input"
          v-model="credentials.name"
          type="text"
          placeholder="Enter name"
          required>
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="user_surname"
        label="Surname:"
        label-for="surname-input">
        <b-form-input
          id="surname-input"
          v-model="credentials.surname"
          type="text"
          placeholder="Enter surname"
          required>
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="username"
        label="Username:"
        label-for="username-input"
        invalid-feedback="Your username have to be at least 6 alphanumeric characters">
        <b-form-input
          id="username-input"
          @input="credentials.username = credentials.username.toLowerCase()"
          v-model="credentials.username"
          type="text"
          placeholder="Enter username"
          required
          :state=validateUsername>
        </b-form-input>
      </b-form-group>

      <b-form-group
        id="email"
        label="Email:"
        label-for="email-input"
        invalid-feedback="The email is not valid">
        <b-form-input
          id="email-input"
          @input="credentials.email = credentials.email.toLowerCase()"
          v-model="credentials.email"
          type="text"
          placeholder="Enter email"
          required
          :state=validateEmail>
        </b-form-input>
      </b-form-group>

      <b-form-group 
        id="password" 
        label="Password:" 
        label-for="password-input" 
        invalid-feedback="Your password have to be at least 6 characters length">
        <b-form-input
          id="password-confirmation-input"
          type="password"
          v-model="credentials.password"
          placeholder="Enter password"
          required
          :state=validatePassword>
        </b-form-input>
      </b-form-group>

      <b-form-group 
        id="password" 
        label="Confirmation Password:" 
        label-for="confirm-password-input"
        invalid-feedback="Your password and confirmation password must match">
        <b-form-input
          id="password-input"
          type="password"
          v-model="passwordConfirmation"
          placeholder="Re-enter password"
          required
          :state=matchPasswords>
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Create Account</b-button>
    </b-form>
    <notifications group="auth" position="bottom center"/>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>