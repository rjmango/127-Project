<template>
    <div class="page-container">
      <section class="header-section">
        <div class="top-row">
          <div class="logo-container">
            <div class="logo"></div>
          </div>
          <div class="options-container">
            <div class="option" :class="{ active: activeOption === 'friends' }" @click="setActiveOption('friends')">
              <div class="option-text">FRIENDS</div>
            </div>
            <div class="option" :class="{ active: activeOption === 'following' }" @click="setActiveOption('following')">
              <div class="option-text">FOLLOWING</div>
            </div>
            <div class="search-container" @click="setActiveOption('all')">
              <input type="text" id="search-input" class="search-text" placeholder="Search for users." @input="filterFriends">
            </div>
          </div>
        </div>
        <section class="content-section">
          <div class="progress-bar"></div>
          <section class="f-list">
            <div class="friend-list">
              <div class="no-user-label" v-if="filteredUsers.length === 0">
                <div class="no-friend-label" v-if="activeOption === 'friends'">
                  {{this.$store.getters.isAuthenticated ? "NO FRIENDS FOUND" : "USER NOT LOGGED IN"}}
                </div>
                <div class="no-following-label" v-if="activeOption === 'following'">
                  {{this.$store.getters.isAuthenticated ? "NO USERS FOLLOWING" : "USER NOT LOGGED IN"}}
                </div>
                <div class="no-search-label" v-if="activeOption === 'all'">
                  {{this.$store.getters.isAuthenticated ? "NO USERS FOUND." : "USER NOT LOGGED IN"}}
                </div>
              </div>
              <div class="friend-entry" v-for="user in filteredUsers" :key="user.username">
                <div class="friend-details">
                  <div class="avatar" aria-hidden="true">
                    <img src="@/assets/profile-picture.png" alt="profile picture" width = "100%" @click="this.$router.push(`/user/${user.userID}`)">
                  </div>
                  <div class="friend-info">
                    <div class="friend-name">{{ user.name }}</div>
                    <div class="friend-username">@{{ user.username }}</div>
                        <button class="friend-status" 
                            :class="{ 'not-followed': user.status === 'Follow', 'followed': user.status !== 'Follow' }" 
                            @click="toggleFollowStatus(user)"
                            :data-status="user.status">
                            {{ user.status }}
                        </button>
                    </div>
                  <button class="friend-img"
                    :aria-label="`User ${user.name} Profile Picture`"
                    :style="`background-image: url(${this.q_url});`"
                    :disabled="user.status === 'Follow'"
                    @click="sendMessage(user)">
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </div>
    <!-- POP UP -->
    <AskUser 
      :sendToName = "this.sendToName"
      :sendToUsername = "this.sendToUsername"
      :sendToID = "this.sendToID"
      :togglePopup = "() => togglePopup()"
      v-if = "askPopup">
    </AskUser>
  </template>
  
  <script>
  import { reactive } from "vue"
  import { ref } from "vue"
  import axios from "axios"
  import AskUser from "@/components/AskUser.vue"
  export default {
    name: "UserFriends",
    components: {
      AskUser
    },
    setup(){
      const askPopup = ref(false);
      const togglePopup = () => { 
        askPopup.value = !askPopup.value;
      }
      return{
        askPopup,
        togglePopup
      }
    },
    data() {
      return {
        sendToName: ref(''),
        sendToUsername: ref(''),
        sendToID: ref(''),
        q_url: "https://cdn.builder.io/api/v1/image/assets/TEMP/c2b084211b6e4cf15fcec1ecc899ff8bdaeb6f023dc55af7624eeaaa7d659d42?apiKey=3f4d82fc1ffa4baaa04974051c41001c&",
        activeOption: ref('friends'),
        friends: reactive([]),
        following: reactive([]),
        notFollowedYet: reactive([]),
        searchQuery: ref(''),
      };
    },
    computed: {
      filteredUsers() {
        let users = [];
        if (this.activeOption === 'all') {
          users = [...this.following, ...this.notFollowedYet];
          return users.filter(user => {
            return user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                   user.username.toLowerCase().includes(this.searchQuery.toLowerCase());
          });
        } else if (this.activeOption === 'friends') {
          users = this.friends;
        } else if (this.activeOption === 'following') {
          users = this.following;
        }
        return users
      }
    },
    methods: {
      setActiveOption(option) {
        this.activeOption = option;
      },
      filterFriends(event) {
        this.searchQuery = event.target.value;
      },
      toggleFollowStatus(user) {
        if (user.status === 'Follow') {
          user.status = 'Following';
          this.following.push(user);
          this.notFollowedYet = this.notFollowedYet.filter( element => element.name !== user.name);

          axios.post("http://localhost:3000/follow", {follows: user.userID}, {withCredentials: true}).then( async (results) => {
            console.log(results);
          }).catch((error) => {
            console.log(error);
          });

        } else if (user.status === 'Following') {
          user.status = 'Follow';
          this.notFollowedYet.push(user);
          this.following = this.following.filter( element => element.name !== user.name);
          
          axios.post("http://localhost:3000/unfollow", {follows: user.userID}, {withCredentials: true}).then( async (results) => {
            console.log(results);
          }).catch((error) => {
            console.log(error);
          });
          
        }
        console.log(this.following);
        console.log(this.notFollowedYet);
      },
      sendMessage(user){
        this.sendToName = user.name;
        this.sendToUsername = user.username;
        this.sendToID = user.userID;
        this.askPopup = !this.askPopup;
      },
    },
    mounted(){axios.get('http://localhost:3000/friends', { withCredentials: true }).then( async (result) => {
      result.data.friends.forEach(element => {
        this.friends.push({
          userID: element.userID,
          name: element.name,
          username: element.username,
          status: "Friends"
          });
      });
      result.data.following.forEach(element => {
        this.following.push({
          userID: element.userID,
          name: element.name,
          username: element.username,
          status: "Following"
          });
      });
      result.data.others.forEach(element => {
        this.notFollowedYet.push({
            userID: element.userID,
            name: element.name,
            username: element.username,
            status: "Follow"
          });
        });
      }).catch((error) => {
        console.log(error);
      });
    },
  };
  </script>
  
<!-- ------------------------------------------------------------------------------------- -->

  <style scoped>
  /* Add style for active option */
  .active-option {
    background-color: #4b729e;
  }
  
  .page-container {
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: 80px 60px;    
  }
  @media (max-width: 991px) {
    .page-container {
      padding: 0 20px;
    }
  }
  
  .header-section {
    border-radius: 0 0 20px 20px;
    background-color: #18243d;
    display: flex;
    width: 1060px;
    flex-direction: column;
    padding: 21px 26px 80px;
  }
  @media (max-width: 991px) {
    .header-section {
      padding: 0 20px;
    }
  }
  
  .top-row {
    display: flex;
    width: 100%;
    gap: 20px;
    line-height: 150%;
    justify-content: space-between;
  }
  @media (max-width: 991px) {
    .top-row {
      flex-wrap: wrap;
    }
  }
  
  .logo-container {
    display: flex;
    gap: 8px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
  
  .options-container {
    display: flex;
    gap: 20px;
  }
  @media (max-width: 991px) {
    .options-container {
      flex-direction: column;
      align-items: stretch;
    }
  }
  
  .option {
    display: flex;
    align-items: center;
    background-color: #4b729e;
    color: #39395c;
    padding: 12px 20px;
    border-radius: 21px;
    font-family: Inter, sans-serif;
    cursor: pointer;
  }
  
  .option-text {
    margin: 0;
  }
  
  .active {
    background-color: #458E7D; /* Highlighted color for the active option */
    color: #ffffff; /* Text color for the active option */
  }
  
  .inactive {
    background-color: #eaeaea; /* Background color for the inactive option */
    color: #bdc4d2; /* Text color for the inactive option */
  }
  
  .search-container {
    display: flex;
    align-items: center;
    background-color: #eaeaea;
    color: #bdc4d2;
    padding: 12px 20px;
    border-radius: 21px;
    font-family: Inter, sans-serif;
    font-weight: 500;
    font-size: 20px;
    height: 10px;
    margin-top: 10px;
  }
  .search-text {
    margin: 0;
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
  }
  
  .content-section {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    margin: 20px auto;
  }
  
  .progress-bar {
    background-color: #7ec1ff;
    height: 5px;
  }
  
  .search-section {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  
  .f-list {
    margin-top: 10px;
    height: 500px;
    overflow-x: hidden;
  }
  
  .friend-list {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping to multiple rows */
    margin-top: 20px;
  }
  
  .friend-entry {
    display: flex;
    justify-content: center;
    flex: 0 0 calc(33.33% - 0px); /* Set the width of each friend entry to one-third minus spacing */
    margin-right: 0px; /*Add spacing between friend entries*/
    margin-bottom: 20px; /* Add spacing between rows */
    max-width: calc(33.33% - 0px); /* Set maximum width for each friend entry */
  }
  
  @media (max-width: 991px) {
    .friend-entry {
      flex: 0 0 calc(50% - 20px); /* For smaller screens, set width to one-half minus spacing */
      max-width: calc(50% - 20px); /* Set maximum width for smaller screens */
    }
  }
  
  .friend-details {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    background-color: #79aea2;
    border-radius: 20px;
    height: 80px;
    width: 290px;
  }
  .avatar {
    width: 66px;
    height: 66px;
    background-color: rgba(217, 217, 217, 1);
    border-radius: 10px;
    margin-left: 5px;
  }
  .friend-info {
    display: flex;
    flex-direction: column;
    margin: 5px 5px 7px;
  }
  .friend-name {
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 20px;
  }
  .friend-username {
    font-family: Inter, sans-serif;
  }
  .friend-status {
    font-family: Inter, sans-serif;
    text-align: center;
    border-radius: 10px;
    padding: 4px 44px;
    margin-top: 4px;
    border: none;
    position: relative;
    overflow: hidden;
  }
  
  .followed{
    background-color: #b0d6cd;
    color: #e0fff8;
  }
  
  .not-followed {
    background-color: #31454e; /* Darker color for not followed users */
    color: #ffffff; /* Text color for not followed users */
  }
  
  
  .friend-status::before {
    content: 'Unfollow';
    background-color: #458E7D;
    color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 28px; /* Adjust this value to center the text vertically */
    border-radius: 10px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .friend-status:hover::before {
    opacity: 1;
  }
  .friend-status[data-status='Follow']::before {
    opacity: 0;
  }
  .friend-img {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    border: none;
    cursor: pointer;
  }
  .container {
    display: flex;
    margin: 12px 0;
  }
  @media (max-width: 991px) {
    .container {
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
  }
  .no-user-label{
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 60px;
    font-style: bold;
  }
  </style>