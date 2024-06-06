<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="main-section">
        <section class="image-section">
          <img loading="lazy" src="@/assets/main-display.png" alt="Main Display Image" class="main-image" />
        </section>
        <aside class="login-section">
          <form class="login-form" @submit.prevent="handleSubmit">
            <img loading="lazy" src="@/assets/splook-logo.png" alt="Login Icon" class="login-icon" />
            <img loading="lazy" src="@/assets/welcome.png" alt="Decorative Element" class="decorative-element" />
            <label for="username" class="visually-hidden">Username</label>
            <input class="input-field" type="text" id="username" placeholder="Username" aria-label="Username" v-model="userData.username" required/>
            <label for="password" class="visually-hidden">Password</label>
            <input class="input-field" type="password" id="password" placeholder="Password" aria-label="Password" v-model="userData.password" required/>
            <button type="submit" class="login-button">Log In</button>
            <span style = "color:red"> {{ loginPrompt }} </span>
            <span>
              <p>Don't have an account?
                <router-link to="/register"> <strong>  Sign up </strong> </router-link>
              </p>
            </span>
            
          </form>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 19px 60px;
}
@media (max-width: 991px) {
  .container {
    padding: 0 20px;
  }
}
.login-wrapper {
  border-radius: 48.748px;
  background-color: #000e29;
  width: 1172px;
  max-width: 100%;
  padding-right: 63px;
}
@media (max-width: 991px) {
  .login-wrapper {
    padding-right: 20px;
  }
}
.main-section {
  display: flex;
  gap: 20px;
}
@media (max-width: 991px) {
  .main-section {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
}
.image-section {
  display: flex;
  flex-direction: column;
  width: 65%;
  margin-left: 0;
}
@media (max-width: 991px) {
  .image-section {
    width: 100%;
  }
}
.main-image {
  aspect-ratio: 1.02;
  object-fit: auto;
  object-position: center;
  width: 100%;
}
@media (max-width: 991px) {
  .main-image {
    max-width: 100%;
  }
}
.login-section {
  display: flex;
  flex-direction: column;
  width: 35%;
  margin-left: 20px;
}
@media (max-width: 991px) {
  .login-section {
    width: 100%;
  }
}
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 17px;
  color: #aeaeae;
  font-weight: 500;
  text-align: center;
  line-height: 150%;
  margin: auto 0;
}
@media (max-width: 991px) {
  .login-form {
    margin-top: 40px;
  }
}
.login-icon {
  aspect-ratio: 3.13;
  object-fit: auto;
  object-position: center;
  width: 155px;
  max-width: 100%;
}
.decorative-element {
  aspect-ratio: 4;
  object-fit: auto;
  object-position: center;
  width: 301px;
  margin: 10px 27px 0;
}
.input-field {
  font-family: Inter, sans-serif;
  border-radius: 28.092px;
  background-color: #d9d9d9;
  margin-top: 10px;
  padding: 16px 27px;
  width: calc(100% - 54px);
  box-sizing: border-box;
}
@media (max-width: 991px) {
  .input-field {
    white-space: initial;
    padding: 16px 20px;
    }
}
.login-button {
  border-radius: 28.092px;
  background-color: #2f5170;
  margin-top: 29px;
  color: #fff;
  padding: 13px 60px;
  font: 600 20px Inter, sans-serif;
}
@media (max-width: 991px) {
  .login-button {
    padding: 13px 20px;
  }
}
.footer-image {
  aspect-ratio: 12.5;
  object-fit: auto;
  object-position: center;
  width: 293px;
  margin: 6px 31px 0;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>

<script>
import axios from "axios";
import { reactive } from "vue";
import { useStore } from "vuex";

// @ is an alias to /src

export default {
  name: 'LoginView',
  data(){
    const store = useStore();

    const userData = reactive({
      username: "",
      password: "",
      message: ""
    });
    
    const handleSubmit = async () => {
      axios.post("http://localhost:3000/login", userData, {withCredentials: true}).then(async (response) =>{
        if(response.status === 200){
          await store.dispatch("checkLogin", "");
          await store.dispatch("setAuth", true);
          this.$router.push("/home");
        }
      }).catch( async (error) => {
        await store.dispatch("setAuth", false);
        if (error.response.status === 404) {
          await store.dispatch("checkLogin", "Username not found");
          console.log("Login prompt: ", this.loginPrompt);
        }else if(error.response.status === 400){
          await store.dispatch("checkLogin", "Invalid password for user");
        }
      })
    }
    return{
      userData,
      handleSubmit
    }
  },
  computed:{
    loginPrompt(){
      return this.$store.state.loginPrompt;
    },
  },
  mounted(){
    axios.get("http://localhost:3000/", {withCredentials: true}).then((results) =>{
      if (results.status === 200){
        this.$router.push('/home');
      }
    }).
    catch(() => {
    })
  }
}
</script>
