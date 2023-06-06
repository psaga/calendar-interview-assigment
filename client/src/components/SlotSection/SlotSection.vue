<template>
  <div v-if="user" class="slot">
    <div v-if="isEmptySlot()" class="slot enable-slot" @click="setSlotAvailable()">
      Set Enable
    </div>
    <div v-if="isAvailableSlot()" class="slot disable-slot" @click="setSlotDisable()">
      Set Disable
    </div>
    <div v-if="isCandidateSlot()" class="slot candidate-slot" @click="modalShowCandidateDetails = true">
      {{ (slotTime.slot.candidate.name + ' ' + slotTime.slot.candidate.surname) | cutCandidateName }}
    </div>
    <b-modal v-model="modalShowCandidateDetails" v-if="modalShowCandidateDetails" id="modal-show-candidate-details" centered v-bind:title="modalInterviewTitle()" cancel-title="Cancel Interview" @cancel="onCancel()" cancel-variant='danger'>
      <div>Name: {{ slotTime.slot.candidate.name }} {{ slotTime.slot.candidate.surname }}</div>
      <div>Email: {{ slotTime.slot.candidate.email }}</div>
    </b-modal>
  </div>
  <div v-else class="slot">
    <div v-if="isSchedulableSlot()" class="slot candidate-slot" @click="showInterviewers()">
      Schedule
    </div>
    <b-modal v-model="modalScheduleInterview" id="modal-schedule-interview" centered v-bind:title="modalInterviewTitle()" @ok="onSubmit">
      <b-form ref="form" class="candidate-form" @submit.stop.prevent="onSubmit">
        <b-form-group
          id="candidate-name"
          label="Name:"
          label-for="candidate-name-input">
          <b-form-input
            id="candidate-name-input"
            v-model="candidate.name"
            type="text"
            required
            name="candidate-name-input"
            placeholder="Enter surname"
            @blur="checkValue($event.target)">
          </b-form-input>
        </b-form-group>

        <b-form-group id="candidate-surname" label="Surname:" label-for="candidate-surname-input">
          <b-form-input
            id="candidate-surname-input"
            type="text"
            v-model="candidate.surname"
            placeholder="Enter surname"
            required
            @blur="checkValue($event.target)">
          </b-form-input>
        </b-form-group>

         <b-form-group id="candidate-email" label="Email:" label-for="candidate-email-input">
          <b-form-input
            id="candidate-email-input"
            type="email"
            v-model="candidate.email"
            placeholder="Enter Email"
            required
            @blur="checkValue($event.target)">
          </b-form-input>
        </b-form-group>
        <b-form-group label="Select interviewer" label-for="candidate-interviewer">
          <b-form-select v-model="interviewerSelected" name="candidate-interviewer" class="form-control">
            <b-form-select-option v-for="interviewer in slotTime.slots.filter(s => !s.candidate)" 
              v-bind:key="interviewer.user._id" 
              v-bind:value="interviewer.user._id">{{interviewer.user.name}} {{interviewer.user.surname}}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        </b-form>
    </b-modal>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./styles.scss"></style>