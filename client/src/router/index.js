import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import QuestionView from '@/views/QuestionView.vue'
import FriendsView from '@/views/FriendsView.vue'
import UserView from '@/views/UserView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta:{
      hideNavbar: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta:{
      hideNavbar: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta:{
      userLogged: true
    }
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
  },
  {
    path: '/questions',
    name: 'questions',
    component: QuestionView
  },
  {
    path: '/friends',
    name: 'friends',
    component: FriendsView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
