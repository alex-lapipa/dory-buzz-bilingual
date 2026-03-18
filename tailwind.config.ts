import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				md: '2rem',
				lg: '2.5rem',
				xl: '3rem'
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		screens: {
			xs: '375px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		extend: {
			fontFamily: {
				'saira': ['Saira', 'sans-serif'],
				'sans': ['Saira', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'guest-message': {
					DEFAULT: 'hsl(var(--guest-message))',
					foreground: 'hsl(var(--guest-message-foreground))'
				},
				'mochi-message': {
					DEFAULT: 'hsl(var(--mochi-message))',
					foreground: 'hsl(var(--mochi-message-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bee-bounce': {
					'0%, 20%, 50%, 80%, 100%': {
						transform: 'translateY(0)'
					},
					'40%': {
						transform: 'translateY(-10px)'
					},
					'60%': {
						transform: 'translateY(-5px)'
					}
				},
			'flower-sway': {
				'0%, 100%': {
					transform: 'rotate(-2deg)'
				},
				'50%': {
					transform: 'rotate(2deg)'
				}
			},
			'wing-flutter': {
				'0%, 100%': { transform: 'scaleX(1) rotate(0deg)' },
				'25%': { transform: 'scaleX(0.85) rotate(-3deg)' },
				'50%': { transform: 'scaleX(1.05) rotate(2deg)' },
				'75%': { transform: 'scaleX(0.9) rotate(-2deg)' }
			},
			'petal-open': {
				'0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
				'50%': { transform: 'scale(1.12) rotate(5deg)', opacity: '0.85' },
				'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
			},
			'leaf-sway': {
				'0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
				'25%': { transform: 'rotate(-4deg) translateX(-1px)' },
				'75%': { transform: 'rotate(4deg) translateX(1px)' }
			},
			'bee-flutter': {
				'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
				'33%': { transform: 'translateY(-2px) rotate(-3deg)' },
				'66%': { transform: 'translateY(1px) rotate(2deg)' }
			},
			'pollen-drift': {
				'0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
				'50%': { transform: 'translateY(-3px) scale(1.1)', opacity: '0.7' }
			},
			'butterfly-hover': {
				'0%, 100%': { transform: 'rotate(0deg) scale(1)' },
				'25%': { transform: 'rotate(-6deg) scale(1.05)' },
				'50%': { transform: 'rotate(0deg) scale(0.97)' },
				'75%': { transform: 'rotate(6deg) scale(1.05)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'bee-bounce': 'bee-bounce 2s infinite',
			'flower-sway': 'flower-sway 3s ease-in-out infinite',
			'wing-flutter': 'wing-flutter 0.4s ease-in-out',
			'petal-open': 'petal-open 0.6s ease-in-out',
			'leaf-sway': 'leaf-sway 0.5s ease-in-out',
			'bee-flutter': 'bee-flutter 0.5s ease-in-out',
			'pollen-drift': 'pollen-drift 0.6s ease-in-out',
			'butterfly-hover': 'butterfly-hover 0.6s ease-in-out'
		},
			backgroundImage: {
				'gradient-bee': 'var(--gradient-bee)',
				'gradient-flower': 'var(--gradient-flower)',
				'gradient-nature': 'var(--gradient-nature)'
			},
			boxShadow: {
				'honey': 'var(--shadow-honey)',
				'flower': 'var(--shadow-flower)'
			},
			fontSize: {
				// Mobile-first responsive font sizes for better readability
				'xs': ['0.875rem', { lineHeight: '1.25rem' }],  // Larger on mobile
				'sm': ['1rem', { lineHeight: '1.5rem' }],       // Larger on mobile
				'base': ['1.125rem', { lineHeight: '1.75rem' }], // Larger base size
				'lg': ['1.25rem', { lineHeight: '1.875rem' }],
				'xl': ['1.5rem', { lineHeight: '2.25rem' }],
				'2xl': ['1.875rem', { lineHeight: '2.5rem' }],
				'3xl': ['2.25rem', { lineHeight: '2.75rem' }],
				'4xl': ['2.75rem', { lineHeight: '3.25rem' }],
				'5xl': ['3.25rem', { lineHeight: '3.75rem' }],
				'6xl': ['3.75rem', { lineHeight: '4.25rem' }],
				'7xl': ['4.5rem', { lineHeight: '5rem' }],
				'8xl': ['6rem', { lineHeight: '6.5rem' }],
				'9xl': ['8rem', { lineHeight: '8.5rem' }],
				// Responsive sizes that scale with device
				'responsive-xs': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.5' }],
				'responsive-sm': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.5' }],
				'responsive-base': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.6' }],
				'responsive-lg': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '1.6' }],
				'responsive-xl': ['clamp(1.5rem, 5vw, 2rem)', { lineHeight: '1.4' }],
				'responsive-2xl': ['clamp(1.875rem, 6vw, 2.5rem)', { lineHeight: '1.3' }],
				'responsive-3xl': ['clamp(2.25rem, 7vw, 3rem)', { lineHeight: '1.2' }],
				'responsive-4xl': ['clamp(2.75rem, 8vw, 4rem)', { lineHeight: '1.1' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				// Mobile-first spacing scale using CSS variables
				'mobile-xs': 'var(--spacing-xs)',
				'mobile-sm': 'var(--spacing-sm)',
				'mobile-md': 'var(--spacing-md)',
				'mobile-lg': 'var(--spacing-lg)',
				'mobile-xl': 'var(--spacing-xl)',
				'mobile-2xl': 'var(--spacing-2xl)',
				'mobile-3xl': 'var(--spacing-3xl)',
				'mobile-4xl': 'var(--spacing-4xl)',
				'mobile-5xl': 'var(--spacing-5xl)',
				'mobile-6xl': 'var(--spacing-6xl)',
				// Header heights
				'header-mobile': 'var(--header-height-mobile)',
				'header-tablet': 'var(--header-height-tablet)',
				'header-desktop': 'var(--header-height-desktop)',
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'bounce': 'var(--transition-bounce)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
