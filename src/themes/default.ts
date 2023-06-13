import { extendTheme } from "@chakra-ui/react"


const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

// 2. Call `extendTheme` and pass your custom values
export default extendTheme({
    config,
    colors: {
        brand: {
            100: "#f7fafc",
            // ...
            900: "#1a202c",
        },
    },
})
