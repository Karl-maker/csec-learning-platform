const logger = {
    debug: (message: string, content: any = "") => {
        console.debug(`${new Date().toISOString()}: ${message}`, content)
    },
    error: (message: string, content: any = "") => {
        console.error(`${new Date().toISOString()}: ${message}`, content)
    },
    info: (message: string, content: any = "") => {
        console.log(`${new Date().toISOString()}: ${message}`, content)
    },
    fatal: (message: string, content: any = "") => {
        console.error(`${new Date().toISOString()}: ${message}`, content)
    }
}

export default logger;