export type Cls<Out = {}> = (new (...args: any[]) => Out)

export type Mixin<Consumer, Additions> = (cls: Cls<Consumer>) => Cls<Additions>

/**
 * Apply multiple mixins to a class in the given order
 * 
 * Can also supply a normal class as the first argument, in
 * which case every subsequent mixin will extend
 */
export function use<AI, AO, BI, BO>(...mixins: [Mixin<AI, AO>, Mixin<BI, BO>]): Cls<AO & BO>
export function use<AI, AO, BI, BO, CI, CO>(...mixins: [Mixin<AI, AO>, Mixin<BI, BO>, Mixin<CI, CO>]): Cls<AO & BO & CO>
export function use<BC, AI, AO, BI, BO>(base: Cls<BC>, ...mixins: [Mixin<AI, AO>, Mixin<BI, BO>]): Cls<BC & AO & BO>
export function use(baseOrMixin: any, ...otherMixins: any[]) {
  if (isClass(baseOrMixin)) {
    return otherMixins.reduce((cls, m) => m(cls), baseOrMixin)
  }

  return [baseOrMixin, ...otherMixins].reduce((cls, m) => m(cls), class {})
}

function isClass(v: unknown) {
  return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}