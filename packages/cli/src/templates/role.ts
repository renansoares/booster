export const template = `
@Role({
    auth: {
        // Do not specify (or use an empty array) if you don't want to allow sign-ups
        signUpMethods: ['email'],
    }
})
export class {{{name}}} {}
`