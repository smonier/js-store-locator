
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@jahia/ui-extender": async () => {
          let pkg = await import("__mf__virtual/_mf_0_smonier_mf_1_js_mf_2_store_mf_2_locator__prebuild___mf_0_jahia_mf_1_ui_mf_2_extender__prebuild__.js");
            return pkg;
        }
      ,
        "prop-types": async () => {
          let pkg = await import("__mf__virtual/_mf_0_smonier_mf_1_js_mf_2_store_mf_2_locator__prebuild__prop_mf_2_types__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/_mf_0_smonier_mf_1_js_mf_2_store_mf_2_locator__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/_mf_0_smonier_mf_1_js_mf_2_store_mf_2_locator__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@jahia/ui-extender": {
            name: "@jahia/ui-extender",
            version: "1.2.0",
            scope: ["default"],
            loaded: false,
            from: "@smonier/js-store-locator",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@jahia/ui-extender"}' must be provided by host`);
              }
              usedShared["@jahia/ui-extender"].loaded = true
              const {"@jahia/ui-extender": pkgDynamicImport} = importMap
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
              requiredVersion: "^1.2.0",
              
            }
          }
        ,
          "prop-types": {
            name: "prop-types",
            version: "15.8.1",
            scope: ["default"],
            loaded: false,
            from: "@smonier/js-store-locator",
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
        ,
          "react": {
            name: "react",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "@smonier/js-store-locator",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
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
              requiredVersion: "^18.3.1",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "@smonier/js-store-locator",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
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
              requiredVersion: "^18.3.1",
              
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      