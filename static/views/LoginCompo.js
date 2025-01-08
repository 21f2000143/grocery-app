const LoginCompo = {
  name: "LoginCompo",
  template: `
  <div class="row justify-content-center m-3">
  <div class="card bg-light" style="width: 18rem;">
  <div class="card-body">
  <div class="d-flex justify-content-end">
    <!-- Cross button to close the card -->
    <button type="button" class="btn-close" aria-label="Close" @click="closeCard"></button>
  </div>
  <h5 class="card-title">Sign In</h5>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" v-model="email" class="form-control" id="exampleInputEmail1">
          <div v-if="message" class="alert alert-warning">
            {{message}}
          </div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" v-model="password" class="form-control" id="exampleInputPassword1">
        </div>
        <button type="submit" class="btn btn-outline-primary">Login</button>
      </form>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      email: "",
      name: "",
      password: "",
      role: "",
      remember: "",
      message: "",
    };
  },
  methods: {
    closeCard() {
      if (this.$route.path != "/app") {
        this.$router.push("/app");
      }
    },
    submitForm() {
      fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          remember: this.remember,
        }),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json(); // Return the promise for the next then block
          } else if (response.status == 404) {
            this.message = "Wrong credentials";
          } else if (response.status == 409) {
            this.message = "User already exists";
          } else if (response.status == 500) {
            this.message = "Internal server error";
          }
        })
        .then((data) => {
          if (data && data.resource.role) {
            localStorage.setItem("token", data.resource.access_token);
            if (data.resource.role === "admin") {
              this.$store.commit("setAuthenticatedUser", data.resource);
              if (this.$route.path !== "/app/admin") {
                this.$router.push("/app/admin");
              }
            } else if (data.resource.role === "user") {
              this.$store.commit("setAuthenticatedUser", data.resource);
              if (this.$route.path !== "/app/user") {
                this.$router.push("/app/user");
              }
            } else if (data.resource.role === "manager") {
              this.$store.commit("setAuthenticatedUser", data.resource);
              if (this.$route.path !== "/app/manager") {
                this.$router.push("/app/manager");
              }
            } else {
              if (this.$route.path !== "/app") {
                this.$router.push("/app");
              }
            }
          }
          console.log("Server response:", data);
        })
        .catch((error) => {
          console.error("Error sending data:", error);
        });
    },
  },
};
export default LoginCompo;
