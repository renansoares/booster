export const template = `
@Role({
    auth: {
        // Do not specify (or use an empty array) if you don't want to allow sign-ups
        signUpMethods: {{#signUpMethods}}{{.}},{{/signUpMethods}},
    }
})
export class {{{name}}} {}
`
