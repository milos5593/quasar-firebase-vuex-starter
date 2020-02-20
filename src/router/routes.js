const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        meta: { authorize: [] },
        component: () => import("pages/Index.vue")
      },
      {
        path: "admin",
        name: "admin",
        meta: { authorize: ["admin"] },
        component: () => import("pages/Admin.vue")
      },
      {
        path: "manager",
        name: "manager",
        meta: { authorize: ["manager"] },
        component: () => import("pages/Manager.vue")
      }
    ]
  },
  {
    path: "/auth",
    component: () => import("layouts/Auth.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("pages/auth/Login.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
