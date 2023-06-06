import { Component, Vue } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component({
  name: "App",
})
export default class App extends Vue {
  @State("user") user!: UserStore;
  @Mutation("clearUser") clearUser!: () => void;
  
  logout(event: Event): void {
    event?.preventDefault();
    this.clearUser();
  }
}