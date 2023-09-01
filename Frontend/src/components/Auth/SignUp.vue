<template>
  <div class="page">
    <div class="signup">
      <h2>Collabcaddy</h2>
      <b-form id="signup-form" @submit="onSubmit">
        <b-form-group
            label="Name"
            label-for="name-input"
        > 
          <div class="d-flex">
            <b-form-input
                id="first-name-input"
                class="name"
                v-model="firstName"
                type="text"
                :required="true"
                placeholder="First name"
            ></b-form-input>
            <b-form-input
                id="last-name-input"
                class="name"
                v-model="lastName"
                type="text"
                :required="true"
                placeholder="Last name"
            ></b-form-input>
            </div>
        </b-form-group>
        <b-form-group
            label="Email"
            label-for="email-input"
        >
            <b-form-input
                id="email-input"
                v-model="email"
                type="email"
                :required="true"
                placeholder="Email"
            ></b-form-input>
        </b-form-group>
        <b-form-group label="Password" label-for="password">
            <b-form-input
                id="password-input"
                type="password"
                v-model="password"
                :required="true"
                placeholder="Password"
                :state="passwordValidation"
            ></b-form-input>
        </b-form-group>
        <b-form-group label="Re-enter Password" label-for="password">
            <b-form-input
                id="password-input-2"
                type="password"
                v-model="password2"
                :required="true"
                placeholder="Password"
                :state="passwordValidation"
            ></b-form-input>
        </b-form-group>
        <b-button type="submit" class="btn btn-primary w-100" variant="primary" block>
            Sign up
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import { 
  BModal, 
  BButton,
  BFormGroup,
  BFormInput,
  BForm,
  BDropdown,
  BDropdownItem,
  BToast
} from "bootstrap-vue";
export default {
  components: {
      BModal,
      BButton,
      BFormGroup,
      BFormInput,
      BForm,
      BDropdown,
      BDropdownItem,
      BToast
  },
  data() {
      return {
        firstName: null,
        lastName:null,
        email: null,
        password: null,
        password2: null,
        loggedIn: false,
      };
  },
  computed: {
      userId() {
          return this.$store.getters.getUserId;
      },
  },
  methods: {
      onSubmit(event) {
        event.preventDefault()
          // this.$router.push('/dashboard')
          // console.log("on submit")
          if (this.firstName && this.lastName && this.email && this.password && this.password2) {
            // console.log("all values found")
              if(this.password!=this.password2){
                // console.log("password same as password 2")
                this.$bvToast.toast(`Password do not match, please try again`, {
                    autoHideDelay: 5000,
                    solid: true,
                });
                return;
              }
              this.$store.dispatch("signup", {
                  firstName:this.firstName, 
                  lastName:this.lastName,
                  email: this.email,
                  password: this.password,
              });
              // this.$bvModal.hide("loginModal")
          }
      },
      // openLogin() {
      //   this.$bvModal.show("loginModal");
      // },
      // logout(){
      //     this.$store.dispatch("logout")
      // }
  },
  computed:{
    passwordValidation(){
      if(!this.password || !this.password2) return true
      else return this.password == this.password2 
    }
  },
};
</script>

<style scoped>

h2{
  text-align: center;
}
.page{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.signup{
  width:35%;
  max-width: 500px;
}
.name{
  width:50%;
}
#login {
  max-width: 100%;
  min-height: calc(100% - 50px);
  background: var(--primary-color);
}
.loginBtn {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}
.logo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.logo img {
  background: white;
}
.tab-buttons {
  width: 47%;
  margin-top: 24px;
  margin-bottom: 8px;
}

.forgot-password {
  color: var(--secondary-color);
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 0px;
  margin-bottom: 16px;
}
.footer-class {
  /* margin-top: 10%; */
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  /* -webkit-box-orient: vertical; */
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
}
#form {
  max-width: 500px;
  margin: auto;
}
/* #pentagon {
  position: relative;
  width: 54px;
  box-sizing: content-box;
  border-width: 50px 18px 0;
  border-style: solid;
  border-color: red transparent;
}
#pentagon:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  top: -85px;
  left: -18px;
  border-width: 0 45px 35px;
  border-style: solid;
  border-color: transparent transparent red;
} */
/* .profile {
  position: absolute;
  right: 20px;
  top: 20px;
} */
</style>