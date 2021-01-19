export type IdokepCurrentResponse = {
    img: string,
    value: number,
}

async function fetchApi(endpoint: string, data: any, method: 'POST' | 'GET' = 'POST') {
    const resp = await fetch(window.claudeApiUrl + endpoint, {
        method: method,
        headers: {
            'Content-type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined,
    })

    return await resp.json();
}

export class Idokep {
    async current(city: string): Promise<IdokepCurrentResponse> {
        return fetchApi(`idokep/current/${city}`, null, 'GET')
    }
}


export class Claude {
    idokep: Idokep

    constructor() {
        this.idokep = new Idokep();
    }
}

export const claudeApi = new Claude();
