/**
 * 
 * @file router
 * @auther naruto
 */

 export default class VueRouter {
  constructor(options) {
    // 记录路由配置项
    this.routes = options.routes;
    this.history = new History();
    this.history.listen(newHash => {
      this.vm.$forceUpdate();
    })
  }

  push(path) {
    this.history.push(path);
  }

  static install(Vue, options) {

    Vue.mixin({
      created() {
        // 组件自查
        if(this.$options.router) {
          // 把自己挂在router上，方便调用
          this.$options.router.vm = this;
          this.$router = this.$options.router;
        } else {
          this.$router = this.$parent.$router;
        }
      }
    })
    
    Vue.component('router-view', {
      functional: true,
      render(createElement, {props, children, parent}) {
        const currentHash = location.hash;
        const router = parent.$router
        // 匹配当前路径下面对应的route
        const currentRoute =  matcher(currentHash, router.routes);
        // 拿到当前路径下应该对应的component
        return createElement(currentRoute.component)
      }
    })

    Vue.component('router-link', {
      render(createElement) {
        return createElement('span', {
          on: {
            click: this.clicking
          }
        }, this.$slots.default)
      },

      methods: {
        clicking() {
          window.history.back();
        }
      }
    })
  }
 }

 const matcher = (path, routesConfig) => {
  return routesConfig
    .find(route => {
      return route.path === path.replace(/^\#/, '')
    });
 }

class History {
  // 监听hash change变化
  listen(callback) {
    window.addEventListener('hashchange', () => {
      callback && callback(window.location.hash)
    })
  }
  // $router.push 功能实现
  push(path) {
    window.location.hash = '#' + path
  }
}