<template>
  <div>
    <div class="week-control-container">
      <span class="change-month-icon" @click="previousWeek()"><b-icon-arrow-left></b-icon-arrow-left></span>
      <span class="label">{{ months[dateMonth(dayRef)] + " " +  dateYear() }}</span>
      <span class="change-month-icon" @click="nextWeek()"><b-icon-arrow-right></b-icon-arrow-right></span>
    </div>
    <div class="loader-container" v-if="loading">
      <div>
        <b-spinner variant="warning"></b-spinner>
      </div>
    </div>
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col v-for="(day, index) in weekDays" v-bind:key="day" v-bind:class="{ 'today': markToday(index) }">
          <div class="number">{{ dateNumber(index) }}</div>
          <div class="label">{{ day }}</div>
        </b-col>
      </b-row>
      <b-row v-for="hour in 24" v-bind:key="hour" class="schedule">
        <b-col class="hour-container">
          {{hour | formatHour}} 
        </b-col>
        <b-col v-for="weekD in 7" v-bind:key="weekD" class="slot-column">
          <SlotSection @toggle-slot="getSlots" v-if="!loading && ( user || slotDate(hour, weekD).getTime() >= new Date().getTime())" :slotTime="slotInfo(hour, weekD)"></SlotSection>
        </b-col>
      </b-row>
  </b-container>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" src="./styles.scss" scoped ></style>