import { ref, shallowRef } from "@vue/reactivity";
import { Text } from "./main";

export function defineAsyncComponent(options) {
  if (typeof options === "function") {
    options = {
      loader: options,
    };
  }
  const { loader } = options;
  let InnerComp = null;

  return {
    name: "AsyncComponentWrapper",
    setup() {
      const loaded = ref(false);
      const timeout = ref(false);
      const error = shallowRef(null);
      const loading = ref(false);

      let loadingTimer = null;
      if (options.delay) {
        loadingTimer = setTimeout(() => {
          loaded.value = true;
        }, options.delay);
      } else {
        loading.value = true;
      }
      
      let retries = 0;
      function load() {
        return loader().catch(err => {
          if (options.onError) {
            return new Promise((resolve, reject) => {
              const retry = () => {
                resolve(load())
                retries ++
              }

              const fail = () => reject(err)
              options.onError(retry, fail, retries)
            })
          } else {
            throw err
          }
        })
      }
      
      load()
        .then((c) => {
          InnerComp = c;
          loaded.value = true;
        })
        .catch((e) => {
          error.value = e;
        })
        .finally(() => {
          loading.value = false;
          clearTimeout(loadingTimer);
        });

      let timer = null;
      if (options.timeout) {
        timer = setTimeout(() => {
          timeout.value = true;
          const err = new Error(
            `Async component timed out after ${options.timeout}ms`
          );
          error.value = err;
        }, options.timeout);
      }

      // TODO implement onUnmounted
      // eslint-disable-next-line no-undef
      onUnmounted(() => clearTimeout(timer));

      const placeholder = { type: Text, children: "" };

      return () => {
        if (loaded.value) {
          return { type: InnerComp };
        } else if (timeout.value && options.errorComponent) {
          return {
            type: options.errorComponent,
            props: { error: error.value },
          };
        } else if (loading.value && options.loadingComponent) {
          return {
            type: options.loadingComponent,
          };
        } else {
          return placeholder;
        }
      };
    },
  };
}
