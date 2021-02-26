import * as deployer from './deploy'
import * as postDeployer from './postDeploy'
import * as nuker from './nuke'

// Re-exported in this way to allow replacing (mocking) them in tests
export const deploy = deployer.deploy
export const postDeploy = postDeployer.postDeploy
export const nuke = nuker.nuke
