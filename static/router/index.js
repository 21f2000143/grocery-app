import HomeView from "../views/HomeView.js";
import store from "../store/index.js";
import UserApp from "../views/UserApp.js";
import AdminApp from "../views/AdminApp.js";
import ManagerApp from "../views/ManagerApp.js";
import RegisterCompo from "../views/RegisterCompo.js";
import LoginCompo from "../views/LoginCompo.js";
import CreateCatCompo from "../components/CreateCatCompo.js";
import NotFound from "../components/NotFound.js";
import CreateProCompo from "../components/CreateProCompo.js";
import EditCatCompo from "../components/EditCatCompo.js";
import EditProCompo from "../components/EditProCompo.js";
import ProductCompo from "../components/ProductCompo.js";
import ProductUserCompo from "../components/ProductUserCompo.js";
import ManagersCompo from "../components/ManagersCompo.js";
import NotifiCompo from "../components/NotifiCompo.js";
import NotifiManCompo from "../components/NotifiManCompo.js";
import ReportCompo from "../components/ReportCompo.js";
import CartCompo from "../components/CartCompo.js";
import OrderCompo from "../components/OrderCompo.js";
import sendWarning from "../components/sendWarning.js";

async function isAuthenticated() {
  try {
    const response = await fetch("http://127.0.0.1:5000/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log(data, "categories fetched");
      store.commit("setAuthenticatedUser", data.resource);
      return true;
    } else {
      const data = await response.json();
      console.log(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    { path: "/app", component: HomeView },
    { path: "/app/login", component: LoginCompo },
    { path: "/app/register", component: RegisterCompo },
    // Catch-all route for undefined paths
    {
      path: "/:pathMatch(.*)*", // Use '*' for Vue Router 3
      name: "NotFound",
      component: NotFound,
    },

    {
      path: "/app/admin",
      component: AdminApp,
      children: [
        { path: "/app/admin", component: ProductCompo },
        { path: "/app/admin/cat/create", component: CreateCatCompo },
        { path: "/app/admin/cat/edit/:id", component: EditCatCompo },
        { path: "/app/admin/pro/create", component: CreateProCompo },
        { path: "/app/admin/pro/edit/:id", component: EditProCompo },
        { path: "/app/admin/managers", component: ManagersCompo },
        { path: "/app/admin/notifications", component: NotifiCompo },
        { path: "/app/admin/report", component: ReportCompo },
        { path: "/app/admin/warning", component: sendWarning },
      ],
    },
    {
      path: "/app/manager",
      component: ManagerApp,
      children: [
        { path: "/app/manager", component: ProductCompo },
        { path: "/app/manager/cat/create", component: CreateCatCompo },
        { path: "/app/manager/cat/edit/:id", component: EditCatCompo },
        { path: "/app/manager/pro/create", component: CreateProCompo },
        { path: "/app/manager/pro/edit/:id", component: EditProCompo },
        { path: "/app/manager/notifications", component: NotifiManCompo },
        { path: "/app/manager/report", component: ReportCompo },
      ],
    },
    {
      path: "/app/user",
      component: UserApp,
      children: [
        { path: "/app/user", component: ProductUserCompo },
        { path: "/app/user/CartCompo", component: CartCompo },
        { path: "/app/user/your/orders", component: OrderCompo },
        { path: "/app/user/pro/create", component: CreateProCompo },
        { path: "/app/user/pro/edit", component: EditProCompo },
        { path: "/app/user/notifications", component: NotifiCompo },
        { path: "/app/user/report", component: ReportCompo },
      ],
    },
  ],
});

// Adding Vue Router Guard
router.beforeEach((to, from, next) => {
  if (to.path == "/app/login") {
    next();
  } else if (to.path == "/app") {
    next();
  } else if (to.path == "/app/register") {
    next();
  } else if (!localStorage.getItem("token") || !isAuthenticated()) {
    // when both conditions are True
    next({ path: "/app/login" });
  } else {
    next();
  }
});
export default router;
