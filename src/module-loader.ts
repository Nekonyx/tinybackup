import { readdirSync } from 'fs'
import { resolve } from 'path'

import { $module, Module } from './module'

export class ModuleLoader {
  /**
   * It's a public property that is readonly and it's an array of modules.
   */
  public readonly modules: Module[] = []

  /**
   * It's a private property that is readonly and it's the path to the modules folder.
   */
  private readonly path = resolve(process.cwd(), 'modules')

  /**
   * The constructor function is a special function that is called when an object is created
   */
  public constructor() {
    //
  }

  /**
   * It loads all the modules in the modules folder
   */
  public async autoLoad(): Promise<void> {
    const items = readdirSync(this.path, {
      encoding: 'utf8',
      withFileTypes: true
    })

    for (const item of items) {
      if (item.isFile() && !item.name.endsWith('.js')) {
        continue
      }

      try {
        const module = await this.load(resolve(this.path, item.name))

        this.modules.push(module)
      } catch (error) {
        console.error(`can't load module ${item}:`, error)
      }
    }
  }

  /**
   * It loads a module from a path, and then initializes it
   * @param {string} path - string - The path to the module.
   * @returns A promise that resolves to a module.
   */
  public async load(path: string): Promise<Module> {
    let module: Module | null = null
    const data = await import(path)

    if (this.isModule(data)) {
      module = data
    } else {
      for (const value of Object.values(data)) {
        if (this.isModule(value)) {
          module = data
        }
      }
    }

    if (!module) {
      throw new Error('module not found')
    }

    console.log(`initializing module ${module.constructor.name}`)
    await module.init()

    return module
  }

  /**
   * If the target is an object or function and it has a required property, then it's a module
   * @param {any} target - any
   * @returns A boolean value.
   */
  private isModule(target: any): target is Module {
    return (
      (typeof target === 'object' || typeof target === 'function') &&
      target[$module]
    )
  }
}
