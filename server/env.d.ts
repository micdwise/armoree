declare global {
  namespace NodeJS {
    interface  ProcessEnv {
      DATABASE_SERVER: string
      DATABASE_USER: string
      DATABASE_USER_PASSWORD: string
      DATABASE: string
      DATABASE_PORT: number
      PORT: string
    }
  }
}

export {}