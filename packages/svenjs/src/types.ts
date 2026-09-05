export type Key = string | number;

export type Props = Record<string, any>;

export type Observable = {
  subscribe(fn: (state: any) => void): () => void;
};

export type Component<P = any, S = any> = {
  props: P;
  state: S;
  setState(next: S | ((s: S) => S)): void;
  observe(store: Observable): () => void;
};

export type Host<P = any, S = any, M extends object = {}> = Component<P, S> & M;

export type ComponentSpec<P = any, S = any> = {
  displayName?: string;
  initialState?: S | ((props: P) => S);
  render(): unknown;
  onBeforeMount?(): void;
  onMount?(): void;
  onUpdate?(): void;
  onDestroy?(): void;
  _beforeMount?(): void;
  _didMount?(): void;
  _didUpdate?(): void;
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
  _dirty: boolean;
  _placeholder: Comment | null;
  _svg: boolean;
  _unsubs: Array<() => void> | null;
  [key: string]: any;
};

/** Callable so TypeScript accepts `<App />` on a spec object. */
export type SvenComponent<P = any, S = any> = ComponentSpec<P, S> & {
  (props?: P): VNode;
};

type EventHandler<E extends Event> = (event: E) => void;

export interface HTMLAttributes {
  children?: unknown;
  key?: Key;
  class?: string;
  className?: string;
  id?: string;
  style?: string | Record<string, string | number | undefined | null | false>;
  ref?: (el: any) => void;
  dangerouslySetInnerHTML?: { __html: string };
  onClick?: EventHandler<MouseEvent>;
  onDoubleClick?: EventHandler<MouseEvent>;
  onDblClick?: EventHandler<MouseEvent>;
  onInput?: EventHandler<InputEvent>;
  onChange?: EventHandler<Event>;
  onKeyDown?: EventHandler<KeyboardEvent>;
  onKeyUp?: EventHandler<KeyboardEvent>;
  onSubmit?: EventHandler<SubmitEvent>;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  [attr: string]: any;
}

export namespace JSX {
  export type Element = VNode;
  export interface IntrinsicAttributes {
    key?: Key;
  }
  export interface ElementChildrenAttribute {
    children: {};
  }
  export interface IntrinsicElements {
    [elemName: string]: HTMLAttributes;
  }
}
