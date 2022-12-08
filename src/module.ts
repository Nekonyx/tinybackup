export const $module = Symbol('module')

export abstract class Module {
  public readonly [$module] = true

  abstract init(): Promise<void>
}
