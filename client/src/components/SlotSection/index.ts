import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { setSlotDisable, setSlotAvailable, scheduleInterview, cancelInterview } from "@/api/slot";

@Component({
  name: "SlotSection",
  filters: {
    capitalize: function(value: string) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    cutCandidateName: function(value: string) {
      if (value.length > 15) {
        return value.substring(0, 15) + "...";
      } else {
        return value;
      }
    },
  },
})
export default class SlotSection extends Vue {
  modalScheduleInterview = false;
  modalShowCandidateDetails = false;
  interviewerSelected = "";
  candidate: Candidate = {} as Candidate;
  nameState: boolean | null = null;
  surnameState: boolean | null = null;
  emailState: boolean | null = null;

  @Prop() private slotTime!: SlotGroup;
  @State("user") user!: UserStore;

  get isEmptySlot() {
    return (): boolean =>
      !this.slotTime.slot &&
      new Date(this.slotTime.date).getTime() >= new Date().getTime();
  }

  get isAvailableSlot() {
    return (): boolean =>
      this.slotTime.slot != undefined &&
      !this.slotTime.slot.candidate &&
      new Date(this.slotTime.date).getTime() >= new Date().getTime();
  }

  get isCandidateSlot() {
    return (): boolean => this.slotTime.slot?.candidate != undefined;
  }

  get isSchedulableSlot() {
    return (): boolean => this.slotTime.slots?.length != 0;
  }

  get modalInterviewTitle() {
    const date = this.slotTime.date;
    return (): string =>
      `Interview for ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}- ${date.getHours()}:00`;
  }

  async setSlotAvailable(): Promise<void> {
    try {
      await setSlotAvailable(this.slotTime.date);
      this.$emit("toggle-slot");
      this.$notify({
        type: "success",
        duration: 3000,
        text: "The slot is now available to schedule",
      });
    } catch (err) {
      this.$notify({
        type: "error",
        duration: 8000,
        text: err.response?.data?.error || err.message,
      });
    }
  }

  async setSlotDisable(): Promise<void> {
    try {
      if (this.slotTime.slot) {
        await setSlotDisable(this.slotTime.slot._id);
        this.$emit("toggle-slot");
        this.$notify({
          type: "success",
          duration: 3000,
          text: "The slot is now disable to schedule",
        });
      }
    } catch (err) {
      this.$notify({
        type: "error",
        duration: 8000,
        text: err.response?.data?.error || err.message,
      });
    }
  }

  checkValue(element: HTMLFormElement): void {
    element.reportValidity();
  }

  async onSubmit(): Promise<void> {
    const slot = this.slotTime.slots?.find(
      (slot) => slot.user?._id == this.interviewerSelected
    );
    if (slot) {
      try {
        await scheduleInterview(
          slot._id,
          this.candidate,
          this.interviewerSelected
        );
        this.$emit("toggle-slot");
        this.$notify({
          type: "success",
          duration: 8000,
          text:
            "Please confirm the interview, through the mail we've just sent to you.",
        });
      } catch (err) {
        this.$notify({
          type: "error",
          duration: 8000,
          text: err.response?.data?.error || err.message,
        });
      }
    }
  }

  showInterviewers(): void {
    if (this.slotTime.slots && this.slotTime.slots[0].user) {
      this.interviewerSelected = this.slotTime.slots[0].user._id;
    }
    this.modalScheduleInterview = true;
  }

  async onCancel(): Promise<void> {
    try {
      if (this.slotTime.slot) {
        await cancelInterview(this.slotTime.slot._id);
        this.$emit("toggle-slot");
        this.$notify({
          type: "success",
          duration: 3000,
          text: "Interview cancelled!",
        });
      }
    } catch (err) {
      this.$notify({
        type: "error",
        duration: 8000,
        text: err.response?.data?.error || err.message,
      });
    }
  }
}
