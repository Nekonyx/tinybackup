import { ModuleLoader } from './module-loader'
import { ScriptLoader } from './script-loader'

async function run() {
  const moduleLoader = new ModuleLoader()
  const scriptLoader = new ScriptLoader()

  console.log('loading modules')
  await moduleLoader.autoLoad()

  console.log('loading scripts')
  await scriptLoader.autoLoad()
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((error) => {
    console.error('error:', error)
    process.exit(1)
  })
