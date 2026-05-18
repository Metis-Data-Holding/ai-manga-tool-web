import { createSSRApp } from "vue";
import App from "./App.vue";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";
import store from "./store/index.js";
import { debounce } from "lodash";

export function createApp() {
  const app = createSSRApp(App);

  /**
   * 防抖指令
   * @param {String} event 事件类型，默认click
   * @param {Function} handler 处理函数
   * @param {Number} delay 延迟时间，默认300ms
   * @param {Boolean} immediate 是否立即执行，默认false
   * v-debounce:click="{
        handler: handleInput,
        delay: 300
      }"
   */
  app.directive("debounce", {
    mounted(el, binding) {
      const {
        event = "click",
        handler,
        delay = 300,
        immediate = false,
      } = binding.value;

      const debouncedFn = debounce(handler, delay, {
        leading: immediate,
        trailing: !immediate,
      });

      // 绑定防抖处理函数
      el.addEventListener(event, debouncedFn);

      // 存储引用以便卸载
      el._debounce = { debouncedFn, event };
    },
    unmounted(el) {
      const { debouncedFn, event } = el._debounce || {};
      if (debouncedFn) {
        el.removeEventListener(event, debouncedFn);
        delete el._debounce;
      }
    },
  });

  app.directive("hasRole", {
    mounted(el, binding, vnode) {
      const { value } = binding;
      const super_admin = "admin";
      const roles = store.getters && store.getters.roles;

      if (value && value instanceof Array && value.length > 0) {
        const roleFlag = value;

        const hasRole = roles.some((role) => {
          return super_admin === role || roleFlag.includes(role);
        });

        if (!hasRole) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error(`请设置角色权限标签值"`);
      }
    },
  });

  app.directive("hasPermission", {
    mounted(el, binding, vnode) {
      const { value } = binding;
      const all_permission = "*:*:*";
      const permissions = store.getters && store.getters.permissions;
      if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value;

        const hasPermissions = permissions.some((permission) => {
          return (
            all_permission === permission || permissionFlag.includes(permission)
          );
        });

        if (!hasPermissions) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error(`请设置操作权限标签值`);
      }
    },
  });

  app.use(store);
  app.use(VxeUITable);
  return {
    app,
  };
}
