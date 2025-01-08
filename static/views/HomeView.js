const HomeView = {
  name: "HomeView",
  template: `
    <div>
      <header class="bg-success text-white text-center py-3">
          <h1>Welcome to Eat Fresh</h1>
      </header>

      <section class="container mt-4">
          <div class="text-center">
              <h2>Explore a World of Freshness</h2>
              <p class="lead">Discover a wide range of fresh and quality groceries delivered to your doorstep.</p>
              <p class="lead">Start your shopping journey now!</p>
              
              <!-- Visit Now Button with Tooltip -->
              <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Please login or register to continue.">
                  Visit Now
              </button>

              <!-- Login and Register Buttons -->
              <div class="mt-3">
                  <a class="btn btn-outline-dark btn-sm" @click="login">Login</a>
                  <a class="btn btn-outline-dark btn-sm" @click="register">Register</a>
              </div>
          </div>
      </section>
    </div>
  `,
  methods: {
    login() {
      if (this.$route.path !== "/app/login") {
        this.$router.push("/app/login");
      }
    },
    register() {
      if (this.$route.path !== "/app/register") {
        this.$router.push("/app/register");
      }
    },
  },
  mounted() {},
};
export default HomeView;
