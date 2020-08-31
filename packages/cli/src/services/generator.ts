import * as path from 'path'
import * as fs from 'fs-extra'
import * as Mustache from 'mustache'
import { Target } from './generator/target'

export async function generate<TInfo>(target: Target<TInfo>): Promise<void> {
  const rendered = Mustache.render(target.template, target.info)
  const renderPath = path.join(process.cwd(), target.placementDir, `${target.name}${target.extension}`)

  if (target.append && fs.existsSync(renderPath)) {
    await fs.appendFile(renderPath, rendered)
  } else {
    await fs.outputFile(renderPath, rendered)
  }
}
