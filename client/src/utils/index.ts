import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Vuex from 'vuex';
import axiosInstance from '@/api/base';


Vue.use(VueRouter)
Vue.use(Vuex);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login/Login.vue"),
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "sign-up" */ "../views/SignUp/SignUp.vue"),
  },
  {
    path: "/confirmInterview/:confirmToken",
    name: "InterviewConfirm",
    component: () =>
      import(
        /* webpackChunkName: "calendar" */ "../views/InterviewStatus/InterviewStatus.vue"
      ),
    props: true,
  },
  {
    path: "/cancelInterview/:cancelToken",
    name: "InterviewCancel",
    component: () =>
      import(
        /* webpackChunkName: "calendar" */ "../views/InterviewStatus/InterviewStatus.vue"
      ),
    props: true,
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: () =>
      import(
        /* webpackChunkName: "calendar" */ "../views/Calendar/Calendar.vue"
      ),
  },
  {
    path: "*",
    redirect: "/calendar",
  },
];

export const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
  });

  router.beforeEach((to, from, next) => {
    const usernameLogged = store.state?.user?.username;
    if (
      usernameLogged &&
      (to.name !== "Calendar") && (to.name !== "InterviewCancel")
    ) {
      next({
        name: "Calendar",
      });
    } else {
      next();
    }
  });

axiosInstance.interceptors.request.use((request) => {
  if(store.state?.user?.token) {
    request.headers['Authorization'] = 'Bearer ' + store.state.user.token;
  }
  return request;
});


axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if(error.response.status == 401 && error.response.data.tokenInvalid) {
      store.commit("clearUser");
    }
    return Promise.reject(error);
})

export const store = new Vuex.Store({
    state: {
        user: JSON.parse(localStorage.getItem('user') || "null")
    },
    mutations: {
        setUser(state, user) {
          state.user = user;
          localStorage.setItem("user", JSON.stringify(user));
          router.push({ path: `/calendar` });
        },
        clearUser(state) {
          state.user = null;
          localStorage.removeItem("user");
          router.push({ path: "/login" });
        }
    }
});
