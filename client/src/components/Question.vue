<template>
    <section class="profile-section">
      <section class="profile-card">
        <div class="placeholder" v-if="emptyQuestions">
          {{ this.$store.getters.isAuthenticated ? "NO QUESTIONS FOR USER" : "USER NOT LOGGED IN" }}
        </div>
        <section class="container" v-for="question in questions" :key="question.QuestionID">
          <header class="header">
            <h1 class="question">{{question.Question_content}}</h1>
            <figure class="profile-pic" alt=""></figure>
          </header>
          <section class="post-details">
            <time datetime="yyyy-mm-dd" class="date">{{question.Date_submitted}}</time>
          </section>
          
          <hr class="divider" />
          <form @submit.prevent="handleSubmit">
            <button @click="sendAnswer(question)"> SEND A REPLY</button>
          </form>
        </section>
      </section>
      
    </section>
    <AnswerUser 
      :questionID = "this.questionID"
      :senderID = "this.senderID"
      :togglePopup = "() => togglePopup()"
      v-if = "ansPopup"
    >
    </AnswerUser>
</template>

<script>
import { ref } from "vue"
import axios from 'axios'
import AnswerUser from "@/components/AnswerUser.vue"

export default{
    name: 'QuestionComponent',
    components:{
      AnswerUser
    },
    setup(){
      const ansPopup = ref(false);
      const togglePopup = () => { 
        ansPopup.value = !ansPopup.value;
      }
      return{
        ansPopup,
        togglePopup
      }
    },
    data(){
        return{
          questionID: ref(''),
          senderID: ref(''),
          questions: [],
        }
    },
    computed: {
      emptyQuestions(){
        return this.questions.length === 0
      }
    },
    methods: {
      sendAnswer(question){
        this.questionID = question.QuestionID;
        this.senderID = question.SenderID;
        this.ansPopup = !this.ansPopup;
        console.log(this.QuestionID);
        console.log(this.SenderID);
      },
    },
    mounted(){
        axios.get('http://localhost:3000/questions', {withCredentials: true}).then((results)=>{
          this.questions = results.data;
          console.log(this.questions);
        }).catch((error)=>{
          console.log(error);
        });
    }
}
</script>
<style scoped>

.profile-section {
  margin-top: 80px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  padding-left: 60px;
  padding-right: 60px;
  min-height: 100vh;
}
@media (max-width: 991px) {
  .profile-section {
    padding: 0 20px;
  }
}
.profile-card {
  padding-top: 10px;
  padding-bottom: 20px;
  border-radius: 0 0 20px 20px;
  background-color: #18243d;
  display: flex;
  width: 1112px;
  min-height: 200px;
  flex-direction: column;
}

@media (max-width: 991px) {
  .profile-card {
    max-width: 100%;
  }
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
  padding: 24px 23px 24px;
  margin-left: 160px;
  margin-bottom: 15px;
  margin-top: 15px;
}
@media (max-width: 991px) {
  .container {
    padding-left: 20px;
  }
}
.header {
  display: flex;
  gap: 9px;
  color: #345a76;
  text-align: right;
  font-size: 17px;
}
@media (max-width: 991px) {
  .header {
    max-width: 100%;
    flex-wrap: wrap;
    white-space: initial;
  }
}
.question {
  overflow-wrap: break-word;
  margin-top: 5px;
  font-family: Inter, sans-serif;
  border-radius: 21px;
  background-color: #5891bb;
  color: #000000;
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

.profile-pic {
  margin-top: 5px;
  border-radius: 10px;
  background-color: #d9d9d9;
  align-self: start;
  width: 60px;
  height: 60px;
  margin-right:-1px;
}
.post {
  display: flex;
  margin-top: 10px;
  gap: 10px;
  color: #4d7a6f;
  font-size: 12px;
  white-space: nowrap;
  text-align: left;
  margin-left:-1px;
  font-size: 12px;
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
  margin-top: -15px;
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
  width: 75%;
}
@media (max-width: 991px) {
  .comment-box {
    max-width: 100%;
    padding-right: 20px;
  }
}
.placeholder{
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  padding: 30px
}
@media (max-width: 991px) {
  .placeholder{
    max-width: 100%;
    padding-right: 20px;
  }
}

button{
  background-color: #2f5170;
  font: 20px Inter, sans-serif;
  color: #ffffff;
  height: 50px;
  border-radius: 21px;
  width: 100%;
}
</style>