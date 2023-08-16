<template>
    <div class="profile">
        <div v-if="user">
            <b-dropdown id="dropdown-1" :text="`${user.name.first} ${user.name.last}`" class="m-md-2">
                <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-dropdown>

        </div>
        <div v-else>
            <button @click="openLogin" class="btn btn-primary" form="form">
                Login
            </button>
            <!-- TODO logout -->
        </div>

        <b-modal id="loginModal" title="Login"> 
          <b-form id="loginForm" @submit.stop.prevent="onSubmit">
                <b-form-group
                    label="Email"
                    label-for="email-input"
                >
                    <b-form-input
                        id="email-input"
                        v-model="email"
                        type="email"
                        :required="true"
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Password" label-for="password">
                    <b-form-input
                        id="password-input"
                        type="password"
                        v-model="password"
                        :required="true"
                    ></b-form-input>
                </b-form-group>
            </b-form>
            <template #modal-footer="{ cancel }">
              <button class="btn btn-danger" @click="cancel">
                  Cancel
              </button>
              <button type="submit" class="btn btn-primary" form="loginForm">
                  OK
              </button>
            </template>
        </b-modal>
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
    BDropdownItem
  } from "bootstrap-vue";
export default {
    components: {
        BModal,
        BButton,
        BFormGroup,
        BFormInput,
        BForm,
        BDropdown,
        BDropdownItem
    },
    data() {
        return {
            email: "",
            password: "",
            loggedIn: false,
        };
    },
    computed: {
        userId() {
            return this.$store.getters.getUserId;
        },
    },
    methods: {
        onSubmit() {
            // this.$router.push('/dashboard')
            if (this.email && this.password) {
                // const formData = {
                //     email: this.email,
                //     password: this.password,
                // };
                this.$store.dispatch("login", {
                    email: this.email,
                    password: this.password,
                });
                this.$bvModal.hide("loginModal")
            }
        },
        openLogin() {
          this.$bvModal.show("loginModal");
        },
        logout(){
            this.$store.dispatch("logout")
        }
    },
    computed:{
      user(){
        return this.$store.getters.userData || false;
      }
    },
};
</script>

<style scoped>
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
.profile {
    position: absolute;
    right: 20px;
    top: 20px;
}
</style>