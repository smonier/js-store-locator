import type { JCRNodeWrapper } from "org.jahia.services.content";

/** Node types that hold content without rendering a heading of their own. */
const UNTITLED_PARENTS = [
  "jnt:page",
  "jnt:area",
  "jnt:contentFolder",
  "jnt:folder",
  "jnt:virtualsite",
];

/**
 * Level of a component's own heading. Under a titled container (a section that renders its title
 * as a heading, such as a free zone), the component starts one level below it; elsewhere (a page
 * area, a folder) it starts at h2.
 */
export const headingLevelFor = (node: JCRNodeWrapper): number => {
  try {
    const parent = node.getParent() as JCRNodeWrapper;
    const titledContainer =
      !UNTITLED_PARENTS.some((type) => parent.isNodeType(type)) &&
      parent.hasProperty("jcr:title") &&
      parent.getProperty("jcr:title").getString().trim() !== "";
    return titledContainer ? 3 : 2;
  } catch {
    return 2;
  }
};
