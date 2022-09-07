import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	watch: false,
	// testEnvironment: 'jsdom',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
}

export default config
