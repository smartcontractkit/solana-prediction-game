import { extendTheme, theme as base, withDefaultColorScheme } from '@chakra-ui/react';

const theme = extendTheme(
    {
        styles: {
            global: {
                html: {
                    margin: '0 auto',
                    maxWidth: '1272px',
                },
                body: {
                    bg: 'gray.900',
                    color: 'gray.100',
                },
                p: {
                    fontSize: '14px',
                }
            },
        },
        colors: {
            brand: {
                'primary': 'blue.200',
                'secondary': 'blue.700',
            }
        },
        fonts: {
            heading: `Manrope, ${base.fonts.heading}`,
            body: `Inter, ${base.fonts.body}`,
        }
    },
    withDefaultColorScheme({
        colorScheme: 'brand',
    })
);

export default theme;