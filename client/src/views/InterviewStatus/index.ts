import { Component, Vue, Prop } from 'vue-property-decorator';
import { confirmInterview, cancelInterviewToken } from "@/api/slot";

@Component({
  name: "InterviewStatus",
})
export default class Calendar extends Vue {
  loading = true;
  message = "";

  @Prop() private confirmToken!: string;
  @Prop() private cancelToken!: string;

  async created(): Promise<void> {
    try {
      if(this.confirmToken) {
        await confirmInterview(this.confirmToken);
        this.message = 'Interview confirmed succesfully!';
      } else if(this.cancelToken) {
        await cancelInterviewToken(this.cancelToken);
        this.message = "Interview cancelled succesfully!";
      }
    } catch(err) {
      if(err.response.data?.message) {
        this.message = err.response.data?.message;
      }
    }
    this.loading = false;
  }
}