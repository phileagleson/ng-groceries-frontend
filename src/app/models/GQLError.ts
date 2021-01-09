interface GQLError {
  message: string
  location: [
    {
      line: number
      column: number
    }
  ]
  path: string[]
  extensions: {
    code: string
    exception: {
      stacktrace: string[]
    }
  }
}
export default GQLError
