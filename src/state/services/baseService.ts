// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { invoke } from '@tauri-apps/api'

export enum BackendPrefix {
    URL = 'touri://'
}

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseService = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BackendPrefix.URL,
        fetchFn: async (input: RequestInfo) => {
            let response = new Response("")
            if (typeof input == "string") {
                return response
            }
            let command = input.url.split(BackendPrefix.URL)[1]
            let args = await input.json()
            console.log(`invoking touri command ${command} input body, ${JSON.stringify(args)}`);
            try {

                let result: any = await invoke(command, { ...args })
                console.log({ result });
                return new Response(JSON.stringify(result), { status: 200, statusText: "ok" })
            } catch (error) {

                console.log(error);
                return new Response(JSON.stringify(error), { status: 403, statusText: `${error}` })
            }


        }
    }),
    tagTypes: ["Products", "Users"],
    endpoints: () => ({}),
    reducerPath: "touri"
})