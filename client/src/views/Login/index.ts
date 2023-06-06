import { Component, Vue } from 'vue-property-decorator';
import { login } from '@/api/user';
import { Mutation } from "vuex-class";

@Component({
  name: "Login",
})
export default class Login extends Vue {
  @Mutation("setUser") setUser!: (store: UserStore | null) => void;

  form: Credentials = {} as Credentials;

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    try {
      const user = await login(this.form);
      this.setUser(user);
    } catch (err) {
      if (err.response?.data?.message) {
        this.$notify({
          type: "error",
          duration: 2000,
          text: err.response.data.message
        });
      }
    }
  }
}