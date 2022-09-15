import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const config: Config.InitialOptions = {
	watch: false,
	// testEnvironment: 'jsdom',
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths, {
			prefix: '<rootDir>/',
		}),
	},
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
}

export default config
