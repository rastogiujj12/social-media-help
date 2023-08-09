<template>
  <section> 
        <b-steps
            :animated="true"
            :rounded="true"
            :has-navigation="true"
            position="is-right"
          >
            <b-step-item step="1" label="Account" :clickable="true">
                <h1 class="title has-text-centered">Account</h1>
                <div class="container">
                  <b-field label="Email">
                    <b-input
                      placeholder="Email"
                      rounded
                      required
                      icon="account"
                      v-model="email"
                      type="email"
                    ></b-input>
                  </b-field>

                  <b-field label="Password">
                    <b-input
                      type="password"
                      required
                      placeholder="Password"
                      rounded
                      icon="lock"
                      v-model="password"
                      password-reveal
                    ></b-input>
                  </b-field>
                  <b-field label="Confirm Password">
                    <b-input
                      type="password"
                      required
                      placeholder="Password"
                      rounded
                      icon="lock"
                      v-model="confirmPassword"
                      password-reveal
                    ></b-input>
                  </b-field>
                </div>
            </b-step-item>

            <b-step-item step="2" label="Profile" :clickable="true">
                <h1 class="title has-text-centered">Profile</h1>
                <div class="container">
                  <b-field grouped >
                    <b-field label="First Name">
                      <b-input
                        placeholder="First"
                        rounded
                        required
                        v-model="firstName"
                        type="text"
                      ></b-input>
                    </b-field>
                    <b-field label="Last Name">
                      <b-input
                        placeholder="Last"
                        rounded
                        required
                        v-model="lastName"
                        type="text"
                      ></b-input>
                    </b-field>
                  </b-field>
                   <b-field grouped >
                     <b-field label="Subdomain">
                      <b-input
                        placeholder="video"
                        rounded
                        required
                        v-model="subdomain"
                        type="text"
                      ></b-input>
                    </b-field> 
                    <b-field label="Domain">
                        <b-input
                        placeholder="example.com"
                        rounded
                        required
                        v-model="domain"
                        type="text"
                      ></b-input>
                    </b-field>
                  </b-field>
                   <b-message type="is-info" has-icon>
                     Subdomain is used for the easy intergration of the tool. The subdomain you entered will be used for all the videos. If you do not know what is a subdomain please refer to <a href="https://www.namecheap.com/blog/what-is-a-subdomain-dp/" target="_blank">this blog</a>
                  </b-message>
                </div>
            </b-step-item>

            <b-step-item :step="3" label="Finish" :clickable="true" disabled>
                <h1 class="title has-text-centered">Finish</h1>
                <div class="container">
                  <b-message type="is-success" has-icon>
                    Setting up is almost finished, Just head over to your domain registrar and add an "A record" for the Subdomain you entered in the previous step, and point it this IP address 13.52.83.102. <br/>
                    Here is how you can do that in most popular domain registrars <br/>
                    <ul>
                      <li><a href="https://in.godaddy.com/help/create-a-subdomain-4080" target="_blank">GoDaddy</a></li>
                      <li><a href="https://www.bluehost.com/help/article/subdomains" target="_blank">Bluehost</a></li>
                      <li><a href="https://www.hostgator.com/help/article/changing-mx-a-cname-records-plesk-10" target="_blank">HostGator</a></li>
                    </ul>
                  </b-message>
                  <b-button class="loginBtn" rounded outlined expanded type="is-success" @click="onSubmit">
                    <p class="has-text-weight-bold">Submit</p>
                  </b-button>
                </div>
            </b-step-item>
        </b-steps>
    </section>
</template>

<script>
import ValidationService from "../../Services/ValidationService";
import errors from "../../Constants/errors";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      domain:'',
      subdomain:''
    };
  },
  created() {
    this.$store.dispatch("changeTitle", "SIGN UP");
  },
  methods: {
    validateInputs() {
      const errorsArray = [];

      if (
        this.email &&
        this.password &&
        this.confirmPassword &&
        this.firstName &&
        this.lastName &&
        this.domain &&
        this.subdomain 
      ) {
        if (this.password !== this.confirmPassword) {
          errorsArray.push(errors.password);
        }
        if (!ValidationService.validateEmail(this.email)) {
          errorsArray.push(errors.email);
        }
      } else {
        errorsArray.push(errors.general);
      }

      if (errorsArray.length) {
        return { success: false, errors: true, errorsArray };
      }
      return { success: true, errors: false, errorsArray };
    },

    onSubmit() {
      const status = this.validateInputs();

      if (status.success) {
        const formData = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          domain: this.domain,
          subdomain: this.subdomain
        };
        this.$store.dispatch("signup", formData);
      } else {
        this.dangerToast(status.errorsArray.join(" , "));
      }
    },
    dangerToast(message) {
      this.$buefy.toast.open({
        duration: 2000,
        message,
        position: "is-top",
        type: "is-danger",
      });
    },
  },
};
</script>

<style scoped>
#signup {
  padding: 10px;
  background: var(--primary-color);
  min-height: calc(100% - 50px);
}
.container{
  max-width: 500px;
}
.label{
  color:white;
}
</style>
