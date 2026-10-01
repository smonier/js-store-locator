# js-store-locator Changelog

## 1.1.0 (2026-10-01)

### Accessibility (RGAA 4.1.2, WCAG 2.1 AA)
- The map is a named region with the store list as its equivalent; markers are buttons named after the store and work with the keyboard; the details take the focus, and Escape or the close button return it to the control that opened them.
- Search with a visible label, results announced, accents ignored.
- Opening hours as a table; open or closed shown as text and a symbol, not by colour alone.
- Readable without JavaScript: the list renders on the server and each store links to its own page.
- Store pages get a full-page view with the store name as their heading.
- At 320 px the panes stack; named controls with 44 px targets and a visible focus ring.

### Theming and translation
- Every colour is a `--jsstoreloc-*` custom property, so a host theme can map it, including dark mode; the panel's colour scheme can follow the host.
- Every visitor-facing text and the content-manager previews are translated (EN, FR).

### Robustness
- The map stylesheet is served from the module.
- Store data is rendered as text; website links accept http and https (`www.` addresses included); telephone links are built from the number as entered, without the national "(0)" or an extension.
- Opening hours are parsed strictly.
- The list refreshes when stores or their images change.

### Build
- `yarn build` builds the views, the island and the UI extension; `yarn dev` builds the UI extension once, then watches.
- Unit tests (Vitest) for opening hours, search and links, run in CI.

Requires Jahia 8.2 and javascript-modules-engine 1.x.


## 1.0.0 (2025-11-20)

First version: a store locator with a map, a searchable list of stores and store details (`jsstorelocnt:storeLocatorApp`, `jsstorelocnt:store`).
