/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                formex: {
                    orange: '#FF5722',  // El naranja principal
                    lime: '#D4F34A',    // El verde lima de acento
                    dark: '#1a1a1a',    // Negro suave para textos
                    light: '#f8f9fa',   // Fondo claro
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Fuente moderna
            },
            backgroundImage: {
                'hero-pattern': "radial-gradient(#FF5722 0.5px, transparent 0.5px)",
            }
        },
    },
    plugins: [],
}