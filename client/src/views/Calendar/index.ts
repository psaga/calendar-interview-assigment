import { Component, Vue } from 'vue-property-decorator';
import { getSlots } from '@/api/slot';
import SlotSection from '@/components/SlotSection/SlotSection.vue';
import { State } from 'vuex-class';

@Component({
  name: "Calendar",
  components: {
    SlotSection,
  },
  filters: {
    formatHour(hour: number) {
      if (hour < 24) {
        if (hour > 12) {
          return `${hour} PM`;
        } else {
          return `${hour} AM`;
        }
      } else {
        return "";
      }
    },
  },
})
export default class Calendar extends Vue {
  @State("user") user!: UserStore;

  loading = true;

  slots: SlotTime[] = [];

  weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  dayRef = new Date(new Date().getDate() - new Date().getDay());

  get dateMonth() {
    return (): number => this.dayRef.getMonth();
  }

  get dateNumber() {
    return (index: number): number => {
      const date = new Date();
      date.setDate(this.dayRef.getDate() + index);
      return date.getDate();
    };
  }

  get dateYear() {
    return (): number => this.dayRef.getFullYear();
  }

  get markToday() {
    return (index: number): boolean => {
      const indexDate = new Date(
        this.dayRef.getTime() + index * 24 * 60 * 60 * 1000
      );
      const today = new Date();

      if (
        indexDate.getDate() == today.getDate() &&
        indexDate.getMonth() == today.getMonth() &&
        indexDate.getFullYear() == today.getFullYear()
      ) {
        return true;
      } else {
        return false;
      }
    };
  }

  get slotDate() {
    return (hour: number, weekDay: number): Date => {
      const daySelected = new Date(
        this.dayRef.getTime() + (weekDay - 1) * 24 * 60 * 60 * 1000
      );
      return new Date(daySelected.setHours(hour, 0, 0, 0));
    }
  }
  
  get slotInfo() {
    return (hour: number, weekDay: number): SlotGroup => {
      const dateSelected = this.slotDate(hour, weekDay);
      if (this.user) {
        // Better to use find because an interviewer could have as much as 1 slot at the same time.
        const singleSlot = this.slots.find(
          (s) => new Date(s.date).getTime() == new Date(dateSelected).getTime()
        );
        return {
          date: dateSelected,
          slot: singleSlot
        };
      } else {
        const slotsFreeToSchedule = this.slots.filter(
          (s) => new Date(s.date).getTime() == new Date(dateSelected).getTime()
        );
        return {
          date: dateSelected,
          slots: slotsFreeToSchedule
        };
      }
    };
  }

  previousWeek(): void {
    const previousWeek = new Date(
      this.dayRef.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    this.dayRef = previousWeek;
    this.getSlots();
  }

  nextWeek(): void {
    const nextWeek = new Date(this.dayRef.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.dayRef = nextWeek;
    this.getSlots();
  }

  async getSlots(): Promise<void> {
    try {
      this.loading = true;
      this.slots = await getSlots(this.dayRef);
      this.loading = false;
    } catch(err) {
      if (err.response?.data?.message) {
        this.$notify({
          type: "error",
          duration: 2000,
          text: err.response.data.message
        });
      }
    }
  }

  created():void {
    this.loading = true;
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    this.dayRef = date;
  }

  mounted(): void {
    this.getSlots();
  }
}