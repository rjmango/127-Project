<template>
    <section class="profile-section">
      <section class="profile-card">
        <section class="profile-header">
          <img loading="lazy" src="@/assets/profile-header.png" alt="Profile background" class="profile-background" />
          <section class="profile-info">
            <section class="profile-details">
              <section class="profile-picture">
                <img loading="lazy" src="@/assets/profile-picture.png" alt="Profile picture" class="profile-image" />
              </section>
              <section class="profile-stats">
                
                <!-- Editable Username -->
                <h2 class="profile-username" v-if="!editMode">{{ firstName }} {{ lastName }}</h2>
              <div class="profile-username-container">
                  <input type="text" v-model="firstName" class="profile-username-edit" v-if="editMode" placeholder="First Name"/>
                  <input type="text" v-model="lastName" class="profile-username-edit" v-if="editMode" placeholder="Last Name"/>
                </div>
                
                <p class="profile-handle">{{userData.Username ? "@" + userData.Username : "Log in to continue"}}</p>
                <div class = "profile-buttons">
                <section class="stats-container">
                  <section class="stat">
                    <p class="stat-number">{{ this.$store.getters.isAuthenticated ? this.userQuestions.length : '- -' }}</p>
                    <p class="stat-label">Answers</p>
                  </section>
                  <section class="stat">
                    <p class="stat-number">{{ this.$store.getters.isAuthenticated ? userData.Followers : '- -' }}</p>
                    <p class="stat-label">Followers</p>
                  </section>
                  <section class="stat">
                    <p class="stat-number">{{ this.$store.getters.isAuthenticated? userData.Following : '- -' }}</p>
                    <p class="stat-label">Following</p>
                  </section> 
                </section>
                  <button class="edit-profile-btn" @click="toggleEditProfile" v-if="this.$store.getters.isAuthenticated && this.$route.meta.userLogged">Edit Profile</button>
                  <button class="delete-profile-btn" @click="deleteProfile" v-if="this.$store.getters.isAuthenticated && this.$route.meta.userLogged">Delete Profile</button>
                </div>
              </section>
            </section>
          </section>
        </section>

        <div v-if="emptyQuestions" class ="placeholder">
        {{ this.$store.getters.isAuthenticated ? "NO QUESTIONS FOR USER" : "USER NOT LOGGED IN"}}
        </div>

        <!-- Question Section -->
        <section class="container" v-for="question in userQuestions" :key="question.AnswerID">
      <header class="header-name">
        <h1 class="question">Anonymous asked:
          <div class="header-question">{{ question.Question_content }}</div>
        </h1>
        <figure class="profile-pic" alt="">
          <img class="sender-profile" src = "@/assets/sender-profile.jpg"/>
        </figure>
      </header>
  
      <article class="post-name">
      <figure class="user-pic" alt="">
        <img class="user-profile" src = "@/assets/profile-picture.png"/>
      </figure>
      <h2 class="answer">{{ firstName }} {{ lastName }}
        <div class="post-answer"> {{ question.Answer_content }} </div>
      </h2>
      </article>
  
  
      <section class="post-details">
        <div class="image-stats">
          <div class="image-container">
            <img src="@/assets/heart.svg" alt="Image description" class="image" />
            <span class="stat">{{ question.Likes }}</span>
          </div>
                      
          <div class="image-container">
            <img src="@/assets/comment-logo.svg" alt="Image description" class="image" />
            <span class="stat">0</span>
          </div>
        </div>
        <time datetime="yyyy-mm-dd" class="date">{{ question.Date_answered }}</time>
      </section>
  
      <hr class="divider" />
      <textarea v-if="this.$store.getters.isAuthenticated" class="comment-box" placeholder="Share your thoughts."></textarea>
    </section>
    
      </section>
      
    </section>
    
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: "UserProfile",
    data() {
      return {
        refreshed: false,
        userData: "",
        userQuestions: [],
        editMode: false,
        firstName:"Log in",
        lastName: "to continue"
      };
    },
    methods: {
      toggleEditProfile() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        document.querySelector('.edit-profile-btn').innerText = 'Save Changes';
      } else {
        const edited = {
          firstName: this.firstName,
          lastName: this.lastName
        };
        axios.post("http://localhost:3000/edit", edited, {withCredentials: true}).then( result => {
          console.log(result.data);
        }).catch(error => {
          console.error(error)
        });
        document.querySelector('.edit-profile-btn').innerText = 'Edit Profile';
      }
    },
      deleteProfile() {
        axios.delete('http://localhost:3000/user', { withCredentials: true }).then( async (result) => {
          console.log(result.data);
          this.$router.push('/');
          await this.$store.dispatch("setAuth", false);
        }).catch((error) => {
          console.log(error);
        });
        alert("Profile deleted!");
      }
    },
    computed:{
      emptyQuestions(){
        return this.userQuestions.length === 0;
      }
    },
    mounted(){
        // if(!this.refreshed){
        //   this.$router.go();
        //   this.refreshed = !this.refreshed
        // }
        if(this.$route.meta.userLogged){
          axios.get("http://localhost:3000/user", {withCredentials: true}).then((result) => {
              console.log(result.data);
              this.userData = result.data;
              this.firstName = result.data.First_Name
              this.lastName = result.data.Last_Name
          }).catch((error) => {
              console.log(error)
          });
          axios.get("http://localhost:3000/answers", {withCredentials: true}).then((result) => {
              console.log(result.data);
              this.userQuestions = result.data;
          }).catch((error) => {
              console.log(error)
          })
        }else{
          const id = this.$route.params.id;
          axios.get(`http://localhost:3000/user/${id}`, {withCredentials: true}).then((result) => {
              console.log(result.data);
              this.userData = result.data;
              this.firstName = result.data.First_Name
              this.lastName = result.data.Last_Name
          }).catch(() => {
              alert("User not found")
              this.$router.push('/home');
          });
          axios.get(`http://localhost:3000/answers/${id}`, {withCredentials: true}).then((result) => {
              console.log(result.data);
              this.userQuestions = result.data;
          }).catch((error) => {
              console.log(error)
          })
        }
    }
  };
  
  
  </script>
  
  <style scoped>
  
  .profile-section {
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    padding: 0 60px;
  }
  @media (max-width: 991px) {
    .profile-section {
      padding: 0 20px;
    }
  }
  .profile-card {
    border-radius: 0 0 20px 20px;
    background-color: #18243d;
    display: flex;
    width: 1112px;
    min-height: 85vh; /* Adjust height as necessary */
    flex-direction: column;
    overflow-y: visible;
    overflow-x: hidden;
  }
  
  
  @media (max-width: 991px) {
    .profile-card {
      max-width: 100%;
    }
  }
  .profile-header {
    position: relative;
    max-width: 1512px;
  }
  .profile-background {
    position: absolute;
    inset: 0;
    height: 200px;
    width: 1113px;
    object-fit: cover;
  }
  .profile-info {
    position: relative;
    margin: 20px 0;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
  }
  .profile-details {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  @media (max-width: 991px) {
    .profile-details {
      flex-direction: column;
      align-items: center;
    }
  }
  .profile-picture {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .profile-image {
    margin-top:px;
    width: 175px;
    height: 175px;
    aspect-ratio: 1;
    object-fit: cover;
  }
  .profile-stats {
    text-align: left;
    flex: 4;
    display: flex;
    flex-direction: column;
    gap:1px;
    margin-left:-10px;
  }
  .profile-username {
    color: #fff;
    margin-top: 20px;
  }
  .profile-handle {
    color: #fff;
    margin-top: -20px;
  }
  .stats-container {
    display: flex;
    justify-content: space-between;
    background-color: rgba(0, 14, 41, 1);
    padding: 10px 20px;
    border-radius: 17px;
    margin-top:-10px;
    width: 200px;
    height: 70px;
    gap: 10px;
  }
  @media (max-width: 991px) {
    .stats-container {
      flex-direction: column;
      align-items: center;
      padding: 10px;
    }
  }
  .stat {
    text-align: center;
  }
  .stat-number {
    margin-top:10px;
    color: #9bc2b9;
    font: 600 20px Inter, sans-serif;
  }
  .stat-label {
    color: #4d7a6f;
    font: 500 14px Inter, sans-serif;
    margin-top: -10px;
  }
  
  .container {
    border-radius: 32px;
    background-color: #000e29;
    display: flex;
    max-width: 738px;
    width: 730px;
    flex-direction: column;
    font-weight: 600;
    line-height: 150%;
    padding: 24px 23px 12px;
    margin-left: 160px;
    margin-bottom: 15px;
  }
  @media (max-width: 991px) {
    .container {
      padding-left: 20px;
    }
  }
  .header-name {
    display: flex;
    gap: 9px;
    color: #BCE3FF;
    text-align: right;
    font-size: 19px;
  }
  @media (max-width: 991px) {
    .header {
      max-width: 100%;
      flex-wrap: wrap;
      white-space: initial;
    }
  }
  .question {
    font-family: Inter, sans-serif;
    border-radius: 21px;
    background-color: #5891bb;
    align-items: end;
    flex-grow: 1;
    width: fit-content;
    margin-right: -30px;
    padding: 13px 10px 50px;
  }
  @media (max-width: 991px) {
    .question {
      max-width: 100%;
      padding-left: 20px;
      white-space: initial;
      font: 500 20px Inter, sans-serif;
    }
  }
  .answer {
    font-family: Inter, sans-serif;
    border-radius: 21px;
    background-color: #89C0B3;
    align-items: end;
    flex-grow: 1;
    width: fit-content;
    margin-left: -30px;
    padding: 13px 10px 50px;
  }
  @media (max-width: 991px) {
    .answer {
      max-width: 100%;
      padding-left: 20px;
      white-space: initial;
      font: 500 20px Inter, sans-serif;
    }
  }
  .profile-pic {
    border-radius: 10px;
    background-color: #d9d9d9;
    align-self: start;
    width: 60px;
    height: 60px;
    margin-right:-1px;
  }
  .post-name {
    display: flex;
    margin-top: 10px;
    gap: 10px;
    color: #C7F5EA;
    font-size: 13px;
    white-space: nowrap;
    text-align: left;
    margin-left:-1px;
  }
  @media (max-width: 991px) {
    .post {
      max-width: 100%;
      flex-wrap: wrap;
      white-space: initial;
    }
  }
  .user-pic {
    border-radius: 10px;
    background-color: #d9d9d9;
    align-self: start;
    width: 60px;
    height: 60px;
    margin-left: -1px;
  }
  .post-details {
    display: flex;
    margin-top: 5px;
    width: 100%;
    gap: 20px;
    color: #aeaeae;
    font-weight: 500;
    white-space: nowrap;
  }
  @media (max-width: 991px) {
    .post-details {
      max-width: 100%;
      flex-wrap: wrap;
      white-space: initial;
    }
  }
  .image-stats {
    display: flex;
    gap: 19px;
    flex: 1;
  }
  @media (max-width: 991px) {
    .image-stats {
      white-space: initial;
    }
  }
  .image-container {
    align-self: start;
    display: flex;
    gap: 3px;
  }
  @media (max-width: 991px) {
    .image-container {
      white-space: initial;
    }
  }
  .image {
    aspect-ratio: 0.96;
    object-fit: auto;
    object-position: center;
    width: 23px;
    fill: #d9d9d9;
  }
  .stat {
    font-family: Inter, sans-serif;
    margin: auto 0;
  }
  .date {
    text-align: right;
    font-family: Inter, sans-serif;
    margin: auto 0;
  }
  .divider {
    border-color: rgba(255, 255, 255, 1);
    border-style: solid;
    border-width: 1px;
    width: 725px;
    background-color: #fff;
    height: 1px;
  }
  @media (max-width: 991px) {
    .divider {
      max-width: 100%;
    }
  }
  .comment-box {
    border-radius: 21px;
    background-color: #18243d;
    margin-top: 12px;
    align-items: start;
    color: #3f4b64;
    text-align: left;
    justify-content: center;
    padding: 11px 16px;
    font: 500 20px Inter, sans-serif;
    height: 30px;
  }
  @media (max-width: 991px) {
    .comment-box {
      max-width: 100%;
      padding-right: 20px;
    }
  }
  
  .profile-buttons{
    display: flex;
  }
  
  .profile-username-container {
    display: flex;
  }
  
  .edit-profile-btn {
    background-color: #5891bb; /* Default background color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    margin-left: 400px;
    width: 100px;
    height: 30px;
    transition: background-color 0.3s;
    margin-top: 45px; /* Smooth transition for hover effect */
  }
  
  .edit-profile-btn:hover {
    background-color: #556b2f; /* Dark sage green color on hover */
  }
  
  .edit-profile-btn.edit-mode {
    background-color: #556b2f; /* Dark sage green color when in edit mode */
  }
  
  .edit-mode .edit-profile-btn:hover {
    background-color: #556b2f; /* Dark sage green color on hover when in edit mode */
  }
  
  .profile-username-edit {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100px;
    padding: 5px;
    font-size: 16px;
    border-radius: 5px;
  }
  
  .delete-profile-btn {
    background-color: #454EA3; /* Adjust color as needed */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px; /* Adjust spacing as needed */
    width: 100px; /* Adjust width as needed */
    height: 30px; /* Adjust height as needed */
    margin-top: 45px;
  }
  .header-question{
    font-size: 15px;
    color: #000
  }
  .post-answer{
    font-size: 15px;
    color: #000
  }
  .placeholder{
  height: 45vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  padding: 30px
  }

  .sender-profile{
    width: 100%;
    height: 100%;
    border-radius: 10%;
  }
  .user-profile{
    width: 100%;
    height: 100%;
  }
  </style>