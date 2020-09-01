import { restore, stub } from 'sinon'
import * as ProjectChecker from '../../src/services/project-checker'
import { test, expect } from '@oclif/test'

describe('new', (): void => {
  describe('command', (): void => {
    stub(ProjectChecker, 'checkItIsABoosterProject').returnsThis()
    afterEach(() => {
      restore()
    })
    describe('run', () => {
      context('using --help or -h flags', async () => {
        test
          .command(['new:command', '--help'])
          .stdout()
          .it('runs without errors', (ctx) => {
            expect(ctx.stdout).to.not.include('Error: EEXIT: 0')
          })
      })
    })
  })
})
