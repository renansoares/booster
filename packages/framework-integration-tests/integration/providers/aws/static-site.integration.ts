import { staticWebsiteURL } from './utils'
import { expect } from 'chai'
import Axios from 'axios'
import { readFileContent } from '../../helper/fileHelper'

describe('staticSite', async () => {
  let staticSiteURL: string

  before(async () => {
    staticSiteURL = await staticWebsiteURL()
  })

  describe('cloudfront distribution', () => {
    it('can be accessed and returns expected index page', async () => {
      const expectedIndexPageContent = await readFileContent('integration/fixtures/cart-demo/public/index.html')

      await Axios.get(staticSiteURL).then((response) => {
        expect(response.status).to.be.equal(200)
        expect(response.data).to.be.equal(expectedIndexPageContent)
      })
    })
  })
})
