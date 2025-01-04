const welcome = Vue.component('welcome', {
  props: ['current_user_role', 'is_authenticated'],
  template: `
    <div>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" style="font-weight: 1000; font-family: 'Poppins', sans-serif" >
          <img src="../static/logo_new1.jpg" >
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a v-if="current_user_role=='admin'" class="nav-link active" aria-current="page" href="">Home</a>
              <a v-if="current_user_role=='manager'" class="nav-link active" aria-current="page" href="">Home</a>
              <a v-if="current_user_role=='user'" class="nav-link active" aria-current="page" href="">Home</a>
            </li>
            <li class="nav-item">
              <a v-if="is_authenticated" class="nav-link" href="">Profile</a>
            </li>
            <li class="nav-item">
              <a v-if="!is_authenticated" style="cursor:pointer" class="nav-link" @click="callLogin">Login</a>
            </li>
            <li class="nav-item">
              <a v-if="!is_authenticated" style="cursor:pointer" class="nav-link"  @click="callSignup"> Sign Up</a>
            </li>
            <li class="nav-item">
              <a v-if="is_authenticated" class="nav-link" href="/logout">Logout</a>
            </li>
          </ul>

          <form @submit.prevent="onSubmit" class="d-flex">
          <div class="select">
            <select class="form-select" v-model="Search_by" >
              <option value=""> Select Search-by </option>
              <option v-for="(item, index) in catList" :key="index" :value="item">{{item}}</option>
            </select>
          </div>
            <input class="form-control me-2" type="search" v-model="query" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>

        </div>
      </div>
    </nav>
    <div class="container-fluid">
    <div class="row">
        <div v-if="message" class="alert alert-info">
            {{message}}
        </div>
        <div class="banner">
            <img class="w-100" src="/static/banner1.jpg">
        </div>
    </div>
    <div class="row">
        <div class="col-10">
            <div v-if="products.length>0">
                <h1>Product List</h1>
                <div class="product-list">
                <div v-for="product in products" :key="product.id" class="product">
                    <img :src="'/static/'+product.image" alt="Product Image">
                    <h3>{{ product.name }}</h3>
                    <p>Price: {{ product.price }}</p>
                    <button @click="addToCart(product)">Add to Cart</button>
                </div>
                </div>
            </div>
            <div v-else>
                <div class="alert alert-primary" role="alert">
                  No Product Available
                </div>
            </div>
        </div>
        <div v-show="cart.length > 0" class="col-2">
            <h1>Cart</h1>
            <div class="cart">
            <div v-for="(item, index) in cart" :key="index" class="cart-item">
                <span>{{ item.product.name }}</span>
                <span>Quantity: {{ item.quantity }}</span>
                <button @click="removeFromCart(index)">Remove</button>
            </div>
            <button type="button" class="btn btn-outline-primary">
                <span class="material-symbols-outlined" @click="checkOut">
                    shopping_cart_checkout
                </span>
            </button>
            </div>
      </div>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      products: [],
      catList: [],
      cart: [],
      message: '',
      query: '',
      Search_by: '',
    }
  },
  methods: {
    callLogin() {
      this.$emit('switch-to-login')
    },
    callSignup() {
      this.$emit('switch-to-signup')
    },
    addToCart(product) {
      const existingItem = this.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ product: product, quantity: 1 });
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    checkOut() {
      fetch('/http://127.0.0.1:5000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cart),
      })
        .then(response => {
          if (response.status == 200) {

          }
          if (response.status == 400) {

          }
        })
        .then(data => {
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    }
  },
  created: function () {
    fetch("http://127.0.0.1:5000/get/products")
      .then(response => {
        if (response.status == 200) {
          console.log("status: ", response.statusText)
        }
        return response.json()
      })
      .then(data => {
        this.products = data.products;
      }).catch((error) => {
        console.error('Error:', error);
        console.log("Error occured");
      })
  }
})

const payNow = Vue.component('paynow', {
  props: ['cart', "changeQuantityAlert"],
  template: `
    <div>
<div v-if="message" class="alert alert-success>
  {{message}}
</div>
<form @submit.prevent="onSubmit">
<div>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Product</th>
        <th scope="col">Quantity</th>
        <th scope="col">Price</th>
        <th scope="col">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in purchased" :key="index">
        <td>{{item[0]}}<input type="hidden" name="pid" :value="item[0]" class="form-control"></td>
        <td>{{item[1]}}<input type="hidden" name="pid" :value="item[1]" class="form-control"></td>
        <td>{{item[2]}}<input type="hidden" name="pr" :value="item[2]" class="form-control"></td>
        <td>{{item[3]}}<input type="hidden" name="amt" :value="item[3]" class="form-control"></td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div>
<input type="text" name="total" class="form-control" :value="'Total Amount = ' + total" readonly>
</div>
<br>
<div>
  <button class="btn btn-secondary" type="submit">Pay Now</button>
</div>
</form>
</div>
    `,
  data() {
    return {
      purchased: [],
      message: '',
      total: ''
    }
  },
  methods: {
    fetchdata() {
      fetch('http://127.0.0.1:5000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cart),
      })
        .then(response => response.json())
        .then(data => {
          this.purchased = data.purchased;
          this.total = data.total;
          this.data = data.message;
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    },
    onSubmit() {
      fetch('http://127.0.0.1:5000/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.purchased),
      })
        .then(response => response.json())
        .then(data => {
          console.log(Response.status == 200)
          if (Response.status == 200) {
            console.log("shop done");
            this.$router.push('/user')
          }
          else {
            console.log("shop not done")
            this.message = data.message;
          }
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    }
  },
  watch: {
    cart: function (newValue, oldValue) {
      this.cart = newValue;
      this.fetchdata();
    },
    changeQuantityAlert: function (newValue, oldValue) {
      this.fetchdata();
    }
  },
  created: function () {
    this.fetchdata()
  }
})
const userPage = Vue.component('userpage', {
  props: ['current_user_role', 'is_authenticated'],
  template: `
  <div>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" style="font-weight: 1000; font-family: 'Poppins', sans-serif">
        <img src="../static/logo_new1.jpg">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a v-if="is_authenticated" class="nav-link" href="">Profile</a>
          </li>
          <li class="nav-item">
            <a v-if="is_authenticated" class="nav-link" href="/logout">Logout</a>
          </li>
        </ul>

        <form @submit.prevent="onSubmit" class="d-flex">
          <div class="select">
            <select class="form-select" v-model="Search_by">
              <option value=""> Select Search-by </option>
              <option v-for="(item, index) in catList" :key="index" :value="item">{{item}}</option>
            </select>
          </div>
          <input class="form-control me-2" type="search" v-model="query" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div class="row">
      <div v-if="message" class="alert alert-info">
        {{message}}
      </div>
      <div class="banner">
        <img class="w-100" src="/static/banner1.jpg">
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <div v-if="products.length>0">
          <h1>Product List</h1>
          <div class="product-list">
            <div v-for="product in products" :key="product.id" class="product">
              <img :src="'/static/'+product.image" alt="Product Image">
              <h3>{{ product.name }}</h3>
              <p>Price: {{ product.price }}</p>
              <button v-if="product.quantity>0" @click="addToCart(product)">Add to Cart</button>
              <button v-else disabled>Not availabe</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="alert alert-primary" role="alert">
            No Product Available
          </div>
        </div>
      </div>
      <div v-show="cart.length > 0" class="col-4">
      <div v-if="limitAlert" class="alert alert-warning">
        {{limitAlert}}
      </div>
        <h1>Cart</h1>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col">Click to remove</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cart" :key="index">
                <td>{{ item.product.name }}<input type="hidden" name="pid" :value="item.product.name"
                    class="form-control"></td>
                <td>{{ item.quantity }}<input type="hidden" name="qnt" :value="item.quantity" class="form-control"></td>
                <td><button @click="removeFromCart(index)">Remove</button></td>
              </tr>
              <tr>
                <button type="button" class="btn btn-outline-primary">
                  <span class="material-symbols-outlined" @click="proceed">
                    shopping_cart_checkout
                  </span>
                </button>
              </tr>
            </tbody>
          </table>
        </div>
        <router-view :cart="cart" :changeQuantityAlert="changeQuantityAlert"></router-view>
      </div>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      products: [],
      catList: [],
      cart: [],
      message: '',
      Search_by: '',
      query: '',
      changeQuantityAlert: 0,
      limitAlert: ''
    }
  },
  methods: {
    addToCart(product) {
      const existingItem = this.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (product.quantity <= existingItem.quantity) {
          this.limitAlert = "You reached max available limit";
        }
        else {
          existingItem.quantity++;
          this.changeQuantityAlert++;
        }
      } else {
        this.cart.push({ product: product, quantity: 1 });
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    proceed() {
      this.$router.push('/user/paynow')
    }
  },
  created: function () {
    fetch("http://127.0.0.1:5000/get/products")
      .then(response => {
        if (response.status == 200) {
          console.log("status: ", response.statusText)
        }
        return response.json()
      })
      .then(data => {
        this.products = data.products;
      }).catch((error) => {
        console.error('Error:', error);
        console.log("Error occured");
      })
  }
})

const create = Vue.component('create', {
  template: `
  <div class="col-4">
  <h1>Creating Category</h1>
  <div v-if="messages" class="alert alert-success">
    {{ messages }}
  </div>
    <div class="card p-3">
      <div class="badge bg-primary">
        <div class="modal-dialog modal-dialog-centered fs-1">
          <h1>Grocery Store</h1>
        </div>
      </div>
      <form @submit.prevent="onSubmit" class="row g-3">
        <div class="row-md-6">
          <div class="input-group">
            <input type="text" v-model="name" class="form-control" placeholder="Category Name" required>
          </div>
        </div>
        <div class="row-12">
          <button class="btn btn-outline-success" type="submit">Create</button>
        </div>
      </form>
      </div>
      <div class="row-12">
        <button class="btn btn-outline-success" type="submit">Update</button>
        <button class="btn btn-outline-success me-1" type="submit">Delete</button>
      </div>
      <div class="row-12">
        <router-view></router-view>
      </div>
</div>
  `,
  data() {
    return {
      messages: '',
      name: '',
    }
  },
  methods: {
    onSubmit() {
      fetch('http://127.0.0.1:5000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "name":this.name
        }),
      })
        .then(response =>{
          if(response.status==200, "checking code 200")
          return response.json()
        })
        .then(data => {
          console.log(Response.status == 200, "checking")
          if (Response.status == 200) {
            console.log("shop done");
            this.messages=data.message
            console.log(data.message, "create success")
          }
          if(Response.status==400) {
            console.log("shop not done")
            this.messages= data.message;
          }
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    }
  }
})

const adminPage = Vue.component('adminpage', {
  props: ['current_user_role', 'is_authenticated'],
  template: `
  <div>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand">
        <button type="button" class="btn btn-primary">
          Notifications <span class="badge text-bg-secondary">4</span>
        </button>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item me-2">
            <button type="button" class="btn btn-secondary" disabled>{{'You are: '+current_user_role}}</button>
          </li>
          <li class="nav-item me-2">
            <button v-if="is_authenticated" type="button" @click="Create" class="btn btn-success">Add Category</button>
          </li>
          <li class="nav-item me-2">
            <button v-if="is_authenticated" type="button" class="btn btn-danger">Add Product</button>
          </li>
          <li class="nav-item me-2">
            <button v-if="is_authenticated" type="button" class="btn btn-warning">Profile</button>
          </li>
          <li class="nav-item">
            <a v-if="is_authenticated" class="btn btn-info" href="/logout">Logout</a>
          </li>
        </ul>

        <form @submit.prevent="onSubmit" class="d-flex">
          <div class="select">
            <select class="form-select" v-model="Search_by">
              <option value=""> Select Search-by </option>
              <option v-for="(item, index) in catList" :key="index" :value="item">{{item}}</option>
            </select>
          </div>
          <input class="form-control me-2" type="search" v-model="query" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div class="row">
      <div v-if="message" class="alert alert-info">
        {{message}}
      </div>
      <div class="banner">
        <img class="w-100" src="/static/banner1.jpg">
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <div v-if="products.length>0">
          <h1>Product List</h1>
          <div class="product-list">
            <div v-for="product in products" :key="product.id" class="product">
              <img :src="'/static/'+product.image" alt="Product Image">
              <h3>{{ product.name }}</h3>
              <p>Price: {{ product.price }}</p>
              <button v-if="product.quantity>0" @click="addToCart(product)">Add to Cart</button>
              <button v-else disabled>Not availabe</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="alert alert-primary" role="alert">
            No Product Available
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      products: [],
      catList: [],
      cart: [],
      message: '',
      Search_by: '',
      query: '',
      changeQuantityAlert: 0,
      limitAlert: ''
    }
  },
  methods: {
    Create() {
      this.$router.push('/admin/create')
    }
  },
  created: function () {
    fetch("http://127.0.0.1:5000/get/products")
      .then(response => {
        if (response.status == 200) {
          console.log("status: ", response.statusText)
        }
        return response.json()
      })
      .then(data => {
        this.products = data.products;
      }).catch((error) => {
        console.error('Error:', error);
        console.log("Error occured");
      })
  }
})

const managerPage = Vue.component('managerpage', {
  props: [],
  template: `
    <div class="row">
    <div class="row">
        <div v-if="message" class="alert alert-info">
            {{message}}
        </div>
        <div class="banner">
            <img class="w-100" src="/static/banner1.jpg">
        </div>
    </div>
    <div class="row">
        <div class="col-10">
            <div v-if="products.length>0">
                <h1>Product List</h1>
                <div class="product-list">
                <div v-for="product in products" :key="product.id" class="product">
                    <img :src="'/static/'+product.image" alt="Product Image">
                    <h3>{{ product.name }}</h3>
                    <p>Price: {{ product.price }}</p>
                    <button @click="addToCart(product)">Add to Cart</button>
                </div>
                </div>
            </div>
            <div v-else>
                <div class="alert alert-primary" role="alert">
                    No Product Available
                </div>
            </div>
        </div>
        <div v-show="cart.length > 0" class="col-2">
            <h1>Cart</h1>
            <div class="cart">
            <div v-for="(item, index) in cart" :key="index" class="cart-item">
                <span>{{ item.product.name }}</span>
                <span>Quantity: {{ item.quantity }}</span>
                <button @click="removeFromCart(index)">Remove</button>
            </div>
            <button type="button" class="btn btn-outline-primary">
                <span class="material-symbols-outlined" @click="checkOut">
                    shopping_cart_checkout
                </span>
            </button>
            </div>
        </div>
    </div>
</div>
    `,
  data() {
    return {
      products: [],
      cart: [],
      catList: [],
      message: '',
      Search_by: '',
      query: ''
    }
  },
  methods: {
    addToCart(product) {
      const existingItem = this.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ product: product, quantity: 1 });
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    checkOut() {
      fetch('/http://127.0.0.1:5000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cart),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    }
  },
  created: function () {
    fetch("http://127.0.0.1:5000/get/products")
      .then(response => {
        if (response.status == 200) {
          console.log("status: ", response.statusText)
        }
        return response.json()
      })
      .then(data => {
        this.products = data.products;
      }).catch((error) => {
        console.error('Error:', error);
        console.log("Error occured");
      })
  }
})

const login = Vue.component('login', {
  props: [],
  template: `
  <div class="row justify-content-center m-3">
  <div class="card bg-light" style="width: 18rem;">
    <div class="card-body">
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
        <div class="mb-3">
        <label for="remember">Remember Me</label> <input id="remember" name="remember" type="checkbox" v-model="remember" value="y">
        </div>
        <button type="submit" class="btn btn-outline-primary">Login</button>
      </form>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      email: '',
      name: '',
      password: '',
      role: '',
      remember: '',
      message: ''
    }
  },
  methods: {
    submitForm() {
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "email": this.email,
          "password": this.password,
          "remember": this.remember
        }),
      })
        .then(response => {
          if (response.status == 200) {
          }
          if (response.status == 404) {
            this.message = "Wrong credentials";
          }
          return response.json()
        })
        .then(data => {
          console.log('Server response:', data);
          console.log(data.role);
          this.role = data.role;
          console.log(data.role)
          if (this.role == 'admin') {
            this.calladmin();
          }
          else if (this.role == 'manager') {
            this.callmanager()
          }
          else if (this.role == 'user') {
            this.calluser()
          }
          else {
            console.log("some anonymous thing happend")
          }
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    },
    calladmin() {
      this.$emit('switch-to-admin')
    },
    callmanager() {
      this.$emit('switch-to-manager')
    },
    calluser() {
      this.$emit('switch-to-user')
    }
  },
})

const signUp = Vue.component('signup', {
  props: [],
  template: `
  <div class="row justify-content-center m-3 text-color-light">
  <div class="card bg-light" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Sign up</h5>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input type="email" v-model="email" class="form-control">
          <div v-if="message" class="alert alert-warning">
            {{message}}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Your Name</label>
          <input type="text" v-model="name" class="form-control" >
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" v-model="password" class="form-control">
        </div>
        <div class="mb-3">
          <select class=" input is-large" v-model="role" required>
            <option class="input is-large" value="user">User</option>
            <option class="input is-large" value="admin">Admin</option>
            <option class="input is-large" value="manager">Manager</option>
          </select>
        </div>
        <button type="submit" class="btn btn-outline-primary">Sign up</button>
      </form>
    </div>
  </div>
</div>
    `,
  data() {
    return {
      email: '',
      name: '',
      password: '',
      role: '',
      message: ''
    }
  },
  methods: {
    callLogin() {
      this.$emit('switch-to-login')
    },
    submitForm() {
      fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "email": this.email,
          "name": this.name,
          "password": this.password,
          "role": this.role
        }),
      })
        .then(response => {
          if (response.status == 200) {
            this.callLogin();
          }
          if (response.status == 409) {
            this.message = "User already exists";
          }
          return response.json()
        })
        .then(data => {
          console.log('Server response:', data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    }
  },
})

// Vue router
const routes = [
  { path: '/', component: welcome },
  { path: '/user', component: userPage, children: [{ path: 'paynow', component: payNow }] },
  { path: '/admin', component: adminPage, children: [{ path: 'create', component: create }] },
  { path: '/manager', component: managerPage },
  { path: '/login', component: login },
  { path: '/signup', component: signUp }
  // { path: '/admin/create/venue', component: addVenue },
  // { path: '/admin/view/venue/:id', component: venueView, children: [{ path: 'edit', component: editVenue }, { path: 'delete', component: deleteVenue }, { path: 'report', component: viewReport }] },
  // { path: '/admin/view/show/:id', component: showView, children: [{ path: 'edit', component: editShow }, { path: 'delete', component: deleteShow }] },
  // { path: '/admin/create/show', component: addShow }
];
const router = new VueRouter({
  routes // short for `routes: routes`
})


//   // creating vue store using vuex
//   const store = new Vuex.Store({
//     state: {
//       successMessage: '',
//     },
//     mutations: {
//       setSuccessMessage(state, message) {
//         state.successMessage = message;
//       },
//       clearSuccessMessage(state) {
//         state.successMessage = '';
//       },
//     },
//   })

//Vue instance: the main app
var app = new Vue({
  el: "#app",
  delimiters: ["${", "}"],
  router: router,
  // store: store,
  data: {
    current_user_role: null,
    is_authenticated: null,
    //   alertMessage: '',
    //   search_words: '',
  },
  methods: {
    get_info() {
      fetch("http://127.0.0.1:5000/info")
        .then(response => {
          if (response.status == 200) {
            console.log("status: ", response.statusText)
          }
          return response.json()
        })
        .then(data => {
          this.is_authenticated = data.is_authenticated;
          this.current_user_role = data.current_user_role;
        }).catch((error) => {
          console.error('Error:', error);
          console.log("Error occured");
        })
    },
    goLogin() {
      this.$router.push('/login')
    },
    goSignup() {
      this.$router.push('/signup')
    },
    goAdmin() {
      this.get_info()
      this.$router.push('/admin')
    },
    goManager() {
      this.get_info()
      this.$router.push('/manager')
    },
    goUser() {
      this.get_info()
      this.$router.push('/user')
    },
    // addToCart(product) {
    //     const existingItem = this.cart.find(item => item.product.id === product.id);
    //     if (existingItem) {
    //         existingItem.quantity++;
    //     } else {
    //         this.cart.push({ product: product, quantity: 1 });
    //     }
    // },
    // removeFromCart(index) {
    //     this.cart.splice(index, 1);
    // }
  },
  created: function () {
    this.get_info();
  }
})