<template>
    <section class="question-section">
      <div class="profile-container">
        <img loading="lazy" src="@/assets/q-bg.png" class="profile-image" alt="Profile Image" />
        <div class="profile-info">
          <div class="profile-header">
            <div class="profile-avatar"></div>
            <div class="profile-details">
              <h2 class="profile-name">{{ sendToName }}</h2>
              <p class="profile-username">@{{ sendToUsername }}</p>
            </div>
          </div>
          <button @click="() => togglePopup()" class="close-button">
            <img loading="lazy" src="@/assets/close-button.png" class="close-image" alt="Close" />
          </button>
        </div>
        <form class="question-form" @submit.prevent="handleSubmit">
          <label for="questionInput" class="visually-hidden">Got a question for {{ sendToName }}? </label>
          <textarea id="questionInput" class="question-input" :placeholder="'Got a question for ' + sendToName + '?'"
            aria-label="Got a question for {{ sendToName }}?" v-model="question"></textarea>
          <button type="submit" class="submit-button">SEND</button>
        </form>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
      name: "AskUser",
      props: {
        sendToName: {
          type: String,
          required: true
        },
        sendToUsername: {
          type: String,
          required: true
        },
        sendToID: {
          type: String,
          required: true
        },
        togglePopup: {
          type: Function,
          required: true
        }
      },
    data() {
      return {
        question: '',
      };
    },
    methods: {
      handleSubmit() {
      if(this.question === ''){
        alert("INVALID QUESTION. MUST FILL UP FORM BEFORE SUBMITTING");
        return;
      }
      const entry = {
        name: this.$props.sendToName,
        username: this.$props.sendToUsername,
        userID: this.$props.sendToID,
        content: this.question
      }
      axios.post('http://localhost:3000/question', entry, {withCredentials: true}).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
      this.question = '';
      alert(`Question sent to user ${this.$props.sendToName}`);
      this.$props.togglePopup();
      },
    },
  };
  </script>
  
  <style scoped>
  .question-section {
    z-index: 999999;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.17);
    line-height: 150%;
    padding: 51px 60px;
  }
  @media (max-width: 991px) {
    .question-section {
      padding: 0 20px;
    }
  }
  .profile-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 599px;
    width: 593px;
    max-width: 100%;
    padding: 16px 14px 29px;
    position: relative;
  }
  .profile-image {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  .profile-info {
    position: relative;
    display: flex;
    width: 100%;
    align-items: flex-start;
    gap: 20px;
    justify-content: space-between;
    padding: 0 1px;
    white-space: nowrap;
  }
  @media (max-width: 991px) {
    .profile-info {
      flex-wrap: wrap;
      white-space: normal;
    }
  }
  .profile-header {
    display: flex;
    margin-top: 18px;
    gap: 6px;
  }
  @media (max-width: 991px) {
    .profile-header {
      white-space: normal;
    }
  }
  .profile-avatar {
    border-radius: 17px;
    background-color: rgba(249, 240, 240, 1);
    width: 66px;
    height: 66px;
  }
  .profile-details {
    border-radius: 10px;
    background-color: #3d5a50;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    min-width: 120px;
    max-width: 300px;
    text-overflow: ellipsis;
    height: 70px;
    padding-left: 5px;
    padding-right: 10px;
  }
  @media (max-width: 991px) {
    .profile-details {
      white-space: normal;
    }
  }
  .profile-name {
    color: #fff;
    font: 700 24px 'Inter', sans-serif;
    margin-left: 5px;
    margin-top: 5px;
  }
  .profile-username {
    color: #90b7ae;
    margin-top: -15px;
    margin-left: 5px;
    font: 600 16px 'Inter', sans-serif;
  
  }
  .close-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  .close-image {
    aspect-ratio: 1;
    object-fit: contain;
    width: 40px;
  }
  .question-form {
    position: relative;
    border-radius: 20px;
    background-color: #f9f0f0;
    margin-top: 16px;
    color: #000000;
    padding: 25px 17px;
    font: 500 20px 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: start;
    height: 425px;
  }
  @media (max-width: 991px) {
    .question-form {
      padding: 16px;
    }
  }
  .question-input {
    width: 100%;
    border: none;
    background: transparent;
    resize: none;
    font: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
    height: 400px;
    outline: none;
  }
  .submit-button {
    border-radius: 20px;
    background-color: #4a514e;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    padding: 16px 18px;
    font: 700 24px 'Inter', sans-serif;
    cursor: pointer;
    align-self: flex-end;
    border: none;
    transition: background-color 0.3s ease; /* Add transition for smooth color change */
    height: 60px;
  }
  
  .submit-button:hover {
    background-color: #6b7370; /* Lighter color on hover */
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  </style>