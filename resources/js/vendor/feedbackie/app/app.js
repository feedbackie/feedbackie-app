import {generateSessionId} from "../utils";
import {getCurrentTime} from "../utils";

class App {
    #loaded = null
    #session = null
    #siteId = null
    #baseUrl = null

    constructor(settings) {
        this.#loaded = getCurrentTime()
        this.#session = generateSessionId()

        this.#siteId = settings.site_id || null
        this.#baseUrl = settings.base_url || null
    }

    getSessionId() {
        return this.#session
    }

    getLoadedTime() {
        return this.#loaded
    }

    getCurrentTime() {
        return getCurrentTime()
    }

    getSiteId() {
        return this.#siteId
    }

    getBaseUrl() {
        if (this.#baseUrl.endsWith('/')) {
            return this.#baseUrl
        }

        return this.#baseUrl + "/"
    }
}

export {App}
