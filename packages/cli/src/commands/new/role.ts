import * as Oclif from '@oclif/command'
import { HasName, ImportDeclaration, joinParsers, parseFields, parseName } from '../../services/generator/target'
import { Script } from '../../common/script'
import Brand from '../../common/brand'
import * as path from 'path'
import { checkItIsABoosterProject } from '../../services/project-checker'
import { generate } from '../../services/generator'
import { templates } from '../../templates'
import * as fs from 'fs'

export default class Role extends Oclif.Command {
  public static description = 'create a new role'
  public static flags = {
    help: Oclif.flags.help({ char: 'h' }),
    fields: Oclif.flags.string({
      char: 's',
      description: 'self sign up options',
      options: ['email', 'phone'],
      multiple: true,
    }),
  }
  public static args = [{ name: 'roleName' }]

  public async run(): Promise<void> {
    return this.runWithErrors().catch(console.error)
  }

  private async runWithErrors(): Promise<void> {
    const { args, flags } = this.parse(Role)
    const fields = flags.fields || []
    if (!args.roleName)
      return Promise.reject(
        "You haven't provided a role name, but it is required. Run with --help for usage instructions"
      )
    return run(args.roleName, fields)
  }
}

const rolesDir = './src/roles.ts'
type RoleInfo = HasName

const run = async (roleName: string, rawFields: Array<string>): Promise<void> =>
  Script.init(`boost ${Brand.energize('new:role')} ${roleName} 🚧`, joinParsers(parseName(roleName), parseFields(rawFields)))
    .step('Verifying project', checkItIsABoosterProject)
    .step('Checking that role does not exist', checkRoleDoesNotExist)
    .step('Creating new role', generateRole)
    .info('Role generated!')
    .done()

function generateImports(): Array<ImportDeclaration> {
  return [
    {
      packagePath: '@boostercloud/framework-core',
      commaSeparatedComponents: 'Role',
    },
  ]
}

const checkRoleDoesNotExist = (info: RoleInfo): Promise<void> => {
  if (fs.existsSync(rolesDir)) {
    const rolesContent = fs.readFileSync(rolesDir, 'utf-8')
    if (rolesContent && rolesContent.includes(`export class ${info.name}`)) {
      throw new Error(`${info.name} role already exists`)
    }
  }
  return Promise.resolve()
}

const generateRole = (info: RoleInfo): Promise<void> =>
  generate({
    name: 'roles',
    extension: '.ts',
    placementDir: path.join('src'),
    template: templates.roles,
    info: {
      imports: generateImports(),
      ...info,
    },
    append: true,
  })
