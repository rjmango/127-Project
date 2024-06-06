<template>  
  <section class="inner-container">
    <div class="main-wrapper">
      <div class="content-wrapper">
        <aside class="image-column">
          <figure class="image-frame">
            <img
              loading="lazy"
              src="@/assets/signup-image.png"
              alt="Primary Image"
              class="main-image"
            />
          </figure>
        </aside>
        <section class="form-column">
          <div class="form-container">
            
            <form @submit.prevent="submit">
              <img
                loading="lazy"
                src="@/assets/splook-logo.png"
                alt="Secondary Image 1"
                class="secondary-image"
              />
              <img
                loading="lazy"
                src="@/assets/get-started.png"
                alt="Secondary Image 2"
                class="secondary-image"
              />
              <span  class="login-label"> Already have an account? <router-link to='/' class = "login-button"> Log in </router-link> </span>
              <label for="firstName" class="visually-hidden"></label>
              <input
                type="text"
                id="firstName"
                class="input-field"
                placeholder="First Name"
                aria-label="First Name"
                v-model="newData.firstName"
                required
              />
              <label for="lastName" class="visually-hidden"></label>
              <input
                type="text"
                id="lastName"
                class="input-field"
                placeholder="Last Name"
                aria-label="Last Name"
                v-model="newData.lastName"
                required
              />
              <label for="username" class="visually-hidden"></label>
              <input
                type="text"
                id="username"
                class="input-field"
                placeholder="Username"
                aria-label="Username"
                v-model="newData.username"
                required
              />
              <label for="email" class="visually-hidden"></label>
              <input
                type="email"
                id="email"
                class="input-field"
                placeholder="Email Address"
                aria-label="Email Address"
                v-model="newData.email"
                required
              />
              <label for="password" class="visually-hidden"></label>
              <input
                type="password"
                id="password"
                v-model="newData.password"
                class="input-field"
                placeholder="Password"
                aria-label="Password"
                required
              />
              <span>
                <label for="show-password" style="color: #5b6f97;">Show Password</label>
                <input type="checkbox" name="show-password" v-model="showPassword" @input="isVisible()"/>
              </span>
              <button type="submit" class="signup-button">Sign up</button>
              <div id="checkbox">
                <input type="checkbox" value="verification" v-model="newData.n" required/>
                <img
                  loading="lazy"
                  src="@/assets/privacy-policy.png"
                  alt="Footer Image"
                  class="footer-image"
                />
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive } from 'vue';
import axios from 'axios';
export default {
  data() {
    const newData = reactive({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        n: false
      })
    return {
      newData,
      showPassword: false
    };
  },
  methods: {
    isVisible(){
      const passwordInput = document.getElementById('password');
      if(!this.showPassword){
        passwordInput.type = "text";
      }else{
        passwordInput.type = "password";
      }
    },
    submit() {
      axios.post("http://localhost:3000/register", this.newData).then((createdUser) => {
              console.log(createdUser.status)
              console.log(createdUser.data);
              this.$router.push('/');
            }).catch(() => {
              alert("Username already taken");
              this.$router.push('/register')
            });
    }
  }
};
</script>

<style scoped>
.inner-container {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 19px 60px;
}
@media (max-width: 991px) {
  .inner-container {
    padding: 0 20px;
  }
}
.main-wrapper {
  border-radius: 59px;
  background-color: rgba(0, 14, 41, 1);
  width: 1172px;
  max-width: 100%;
  padding-right: 66px;
}
@media (max-width: 991px) {
  .main-wrapper {
    padding-right: 20px;
  }
}
.content-wrapper {
  display: flex;
  gap: 10px;
}
@media (max-width: 991px) {
  .content-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
}
.image-column {
  display: flex;
  flex-direction: column;
  width: 600%;
}
@media (max-width: 991px) {
  .image-column {
    width: 100%;
  }
}
.image-frame {
  border-radius: 54.379px;
  background-color: #9acebb;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding: 8px 8px;
  margin-left: 15px;
}
@media (max-width: 991px) {
  .image-frame {
    max-width: 100%;
    margin-top: 40px;
  }
}
.main-image {
  object-fit: auto;
  object-position: center;
  width: 100%;
}
@media (max-width: 991px) {
  .main-image {
    max-width: 100%;
  }
}
.form-column {
  display: flex;
  flex-direction: column;
  width: 35%;
  margin-top: 40px; /* <-- Lowered content */
}
@media (max-width: 991px) {
  .form-column {
    width: 100%;
    margin-top: 40px; /* <-- Lowered content */
  }
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #aeaeae;
  font-weight: 500;
  line-height: 150%;
  margin: auto 0;
  margin-bottom: 20px;
}
@media (max-width: 991px) {
  .form-container {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
.secondary-image {
  object-fit: auto;
  object-position: center;
  align-self: center;
  max-width: 100%;
}
.secondary-image:first-of-type {
  aspect-ratio: 3.23;
  width: 153px;
}
.secondary-image:nth-of-type(2) {
  aspect-ratio: 8.33;
  width: 357px;
}
.secondary-image:nth-of-type(3) {
  aspect-ratio: 12.5;
  width: 289px;
  margin: 0 34px;
}
.login-label{
  margin: 5px;
  color: #5b6f97;
}
.login-button{
  color: #7899d0;
  font-weight: bold;
}
.input-field {
  font-family: 'Inter', sans-serif;
  border-radius: 34px;
  background-color: #d9d9d9;
  width: 322px;
  max-width: 100%;
  margin: 10px 17px;
  padding: 16px;
}
@media (max-width: 991px) {
  .input-field {
    margin: 0 10px;
  }
}

.input-field.error-border {
  border: 2px solid red;
}

.signup-button {
  border-radius: 28.092px;
  background-color: #2f5170;
  color: #fff;
  padding: 8px 60px;
  font: 600 20px Inter, sans-serif;
  margin: 10px 17px;
  width: 322px;
  max-width: 100%;
}
@media (max-width: 991px) {
  .signup-button {
    padding: 13px 20px;
  }
}

.tertiary-image {
  aspect-ratio: 7.69;
  object-fit: auto;
  object-position: center;
  width: 322px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  align-self: center;
  margin: 9px 17px;
}
.footer-text {
  align-self: center;
  display: flex;
  gap: 2px;
  font-size: 12px;
  color: #000;
  font-weight: 400;
  white-space: nowrap;
}
@media (max-width: 991px) {
  .footer-text {
    white-space: initial;
  }
}
.footer-image {
  margin-top: 100;
  display: inline-block;
  aspect-ratio: 9.09;
  object-fit: auto;
  object-position: center;
  width: 315px;
  flex-grow: 1;
}
#checkbox {
  display: flex;
  align-items: center;
}
#checkbox input {
  display: inline-block;
  margin-right: 10px;
  width: 20px;
  height: 20px;
}
</style>
