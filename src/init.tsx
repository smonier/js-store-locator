import { registry } from "@jahia/ui-extender";
import { OpeningHoursSelector } from "./components/OpeningHoursSelector/OpeningHoursSelector";

export default function () {
  registry.add("callback", "OpeningHoursSelector", {
    targets: ["jahiaApp-init:20"],
    showOnNodeTypes: ["jsstorelocnt:store"],
    callback: () => {
      registry.add("selectorType", "OpeningHoursSelector", {
        cmp: OpeningHoursSelector,
        supportMultiple: false,
      });
      console.log("%c OpeningHoursSelector is activated", "color: #3c8cba");
    },
  });
}
