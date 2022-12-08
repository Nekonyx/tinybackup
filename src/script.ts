export const $script = Symbol('script')

export abstract class Script {
  public readonly [$script] = true
}
