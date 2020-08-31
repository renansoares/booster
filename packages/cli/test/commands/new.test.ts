import * as fs from 'fs-extra'
import { expect } from '@boostercloud/cli/test/expect'
import Role from '../../src/commands/new/role'
import { IConfig } from '@oclif/config'
import { stub } from 'sinon'
import * as ProjectChecker from '../../src/services/project-checker'
import { templates } from '../../src/templates'
import Mustache = require('mustache')
import ErrnoException = NodeJS.ErrnoException

describe('new', (): void => {
  describe('role', (): void => {
    const rolesPath = './src/roles.ts'
    const adminRole = new Role(['Admin'], {} as IConfig)
    const consoleError = stub(console, 'error')
    const mustacheUserView = Mustache.render(templates.roles, { name: 'User' })
    const mustacheAdminView = Mustache.render(templates.roles, { name: 'Admin' })
    stub(ProjectChecker, 'checkItIsABoosterProject').returnsThis()

    afterEach(() => {
      if (fs.existsSync(rolesPath)) {
        fs.unlink(rolesPath, (err: ErrnoException) => console.log(err))
      }
      consoleError.reset()
    })

    const expectRolesFileContentToMatch = (mustacheView: string): void => {
      fs.readFile(rolesPath)
        .then((content: Buffer) => {
          expect(mustacheView).to.equal(content.toString())
        })
        .catch((err: Error) => console.log(err))
    }
    it('creates a default role', async (): Promise<void> => {
      await adminRole.run()
      expect(fs.existsSync(rolesPath)).to.be.true
      expectRolesFileContentToMatch(mustacheAdminView)
    })
    it('appends the new role to the roles.ts file if another one exists', async (): Promise<void> => {
      await fs.writeFile(rolesPath, mustacheUserView)
      expect(fs.existsSync(rolesPath)).to.be.true
      await adminRole.run()
      expectRolesFileContentToMatch(mustacheUserView + mustacheAdminView)
    })
    it('throws an error if the role name is not provided', async (): Promise<void> => {
      const invalidRole = new Role([''], {} as IConfig)
      await invalidRole.run()
      expect(consoleError).to.have.been.calledOnce
      expect(consoleError.args[0][0]).to.be.equal(
        "You haven't provided a role name, but it is required. Run with --help for usage instructions"
      )
      expect(fs.existsSync(rolesPath)).to.be.false
    })
    it('throws an error if the role already exists', async () => {
      await fs.writeFile(rolesPath, mustacheAdminView)
      expect(fs.existsSync(rolesPath)).to.be.true
      await adminRole.run()
      expect(consoleError).to.have.been.calledOnce
      expect(consoleError.args[0][0]).to.match(/\s{0}(Error: Admin role already exists)\s/)
    })
  })
})
