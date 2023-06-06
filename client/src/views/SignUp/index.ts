import { Component, Vue } from 'vue-property-decorator';
import { signUp } from '@/api/user';
import { Mutation } from 'vuex-class';

@Component({
  name: "SignUp",
})
export default class SignUp extends Vue {
  @Mutation("setUser") setUser!: (store: UserStore | null) => void;
  @Mutation("clearUser") clearUser!: () => void;

  credentials: Credentials = {} as Credentials;
  passwordConfirmation = null;

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    try {
      const user = await signUp(this.credentials);
      this.setUser(user);
    } catch (err) {
      if(err.response?.data?.message) {
        this.$notify({
          type: "error",
          duration: 2000,
          text: err.response.data.message
        });
      }
    }
  }

  get validateUsername(): boolean | null {
    if (!this.credentials.username) return null;
    return this.credentials.username && this.credentials.username.match(/[a-z0-9]{6,25}/g)? true : false;
  }

  get validatePassword(): boolean | null {
    if (!this.credentials.password) return null;
    return this.credentials.password?.length >= 6? true : false;
  }

  get validateEmail(): boolean | null {
    if (!this.credentials.email) return null;
    return this.credentials.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)? true : false;
  }

  get matchPasswords(): boolean | null {
    if (!this.passwordConfirmation) return null;
    return this.credentials.password?.length >= 6 && this.credentials.password == this.passwordConfirmation? true : false;
  }
}