export type Key = string | number;

export type Props = Record<string, any>;

export type Component<P = any, S = any> = {
  props: P;
  state: S;
  setState(next: S | ((s: S) => S)): void;
};

export type Host<P = any, S = any> = Component<P, S> & Record<string, any>;

export type ComponentSpec<P = any, S = any> = {
  displayName?: string;
  initialState?: S | ((props: P) => S);
  render(this: Host<P, S>): unknown;
  onBeforeMount?(this: Host<P, S>): void;
  onMount?(this: Host<P, S>): void;
  onUpdate?(this: Host<P, S>): void;
  onDestroy?(this: Host<P, S>): void;
  _beforeMount?(this: Host<P, S>): void;
  _didMount?(this: Host<P, S>): void;
  _didUpdate?(this: Host<P, S>): void;
  [key: string]: any;
};

export const FRAGMENT = Symbol.for("svenjs.fragment");
export const SPEC = Symbol.for("svenjs.spec");
export const TEXT = "#text";

export type VNode = {
  type: string | ComponentSpec | typeof FRAGMENT;
  props: Props;
  children: VNode[];
  key: Key | undefined;
  _dom?: Node | null;
  _end?: Node | null;
  _instance?: Instance | null;
};

export type Instance = Component & {
  type: ComponentSpec;
  render: () => unknown;
  _vnode: VNode | null;
  _parent: Node | null;
  _mounted: boolean;
  _destroyed: boolean;
  _rendering: boolean;
  _placeholder: Comment | null;
  _svg: boolean;
  [key: string]: any;
};

/** Callable so TypeScript accepts `<App />` on a spec object. */
export type SvenComponent<P = any, S = any> = ComponentSpec<P, S> & {
  (props?: P): VNode;
};

export namespace JSX {
  export type Element = VNode;
  export interface IntrinsicAttributes {
    key?: Key;
  }
  export interface ElementChildrenAttribute {
    children: {};
  }
  export interface IntrinsicElements {
    [elemName: string]: Props;
  }
}
