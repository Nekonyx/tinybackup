import { readdirSync } from 'fs'
import { resolve } from 'path'

import { $script, Script } from './script'

export class ScriptLoader {
  /**
   * It's a public property that is readonly and it's an array of scripts.
   */
  public readonly script: Script[] = []

  /**
   * It's a private property that is readonly and it's the path to the scripts folder.
   */
  private readonly path = resolve(process.cwd(), 'scripts')

  /**
   * The constructor function is a special function that is called when an object is created
   */
  public constructor() {
    //
  }

  /**
   * It loads all the scripts in the scripts folder
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
        const script = await this.load(resolve(this.path, item.name))

        this.script.push(script)
      } catch (error) {
        console.error(`can't load script ${item}:`, error)
      }
    }
  }

  /**
   * It loads a script from a path, and then initializes it
   * @param {string} path - string - The path to the script.
   * @returns A promise that resolves to a script.
   */
  public async load(path: string): Promise<Script> {
    let script: Script | null = null
    const data = await import(path)

    if (this.isScript(data)) {
      script = data
    } else {
      for (const value of Object.values(data)) {
        if (this.isScript(value)) {
          script = data
        }
      }
    }

    if (!script) {
      throw new Error('script not found')
    }

    return script
  }

  /**
   * If the target is an object or function and it has a required property, then it's a script
   * @param {any} target - any
   * @returns A boolean value.
   */
  private isScript(target: any): target is Script {
    return (
      (typeof target === 'object' || typeof target === 'function') &&
      target[$script]
    )
  }
}
