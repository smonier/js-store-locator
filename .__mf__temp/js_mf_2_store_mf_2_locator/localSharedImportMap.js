
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "prop-types": async () => {
          let pkg = await import("__mf__virtual/js_mf_2_store_mf_2_locator__prebuild__prop_mf_2_types__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "prop-types": {
            name: "prop-types",
            version: "15.8.1",
            scope: ["default"],
            loaded: false,
            from: "js-store-locator",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"prop-types"}' must be provided by host`);
              }
              usedShared["prop-types"].loaded = true
              const {"prop-types": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^15.8.1",
              
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      