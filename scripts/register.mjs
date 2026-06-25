import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
register('./tsResolve.mjs', pathToFileURL('./scripts/').href)
