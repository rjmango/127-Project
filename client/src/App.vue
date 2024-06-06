<template>
  <nav v-if="!$route.meta.hideNavbar">
    <section>
      <router-link to="/home">Home</router-link> |
      <router-link to="/questions">Questions</router-link> |
      <router-link to="/friends">Friends</router-link>
    </section>
    <div style = "padding: 0px 20px;">
      <button id="button" @click="this.logout" v-if="isAuthenticated"> LOGOUT </button>
      <button id="button" @click="this.$router.push('/')" v-if="!isAuthenticated"> LOGIN </button>
    </div >
  </nav>
  <router-view/>
</template>

<script>
import axios from 'axios'
import { useStore } from 'vuex'

export default {
  name: 'App',
  computed: { 
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  data(){
    const store = useStore();
    const logout = () => {
      axios.get('http://localhost:3000/logout', { withCredentials: true }).then( async (result) => {
        console.log(result.data);
        this.$router.push('/');
        await store.dispatch("setAuth", false);
      }).catch((error) => {
        console.log(error);
      });
    }
    return{
      logout
    }
  },
  mounted(){
    axios.get('http://localhost:3000/user', { withCredentials: true }).then( async (result) => {
        console.log(result.data);
        this.$store.dispatch("setAuth", true);
      }).catch((error) => {
        console.log(error);
      });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
}

nav {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1112px;
  height: 80px;
  background-color: #1c2a4a;
  z-index: 9999;
}

nav a {
  font-weight: bold;
  color: #ffffff;
}

nav a.router-link-exact-active {
  color: #42b983; 
}
#button {
    background-color: #5891bb; /* Default background color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 80px; 
    height: 30px; 
    transition: background-color 0.3s;
  }
  
  #button:hover {
    background-color: #556b2f; /* Dark sage green color on hover */
  }
</style>