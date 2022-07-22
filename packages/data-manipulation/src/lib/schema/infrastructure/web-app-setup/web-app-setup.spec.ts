import { webAppSetup } from './web-app-setup';
import path from 'path';
import { WebAppSetupInput } from './web-app-setup-input';
import {
  createCodeFileComparisonStrings,
  createCodeFileExpectedWithPathMapping,
} from '../../../shared/test-util';
import { TEST_APPS_MONOREPO_OPTIONS } from '../../shared/test-util';
import { DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES } from '../../shared/constants';

describe('web-app-setup', () => {
  it('webAppSetup()', () => {
    const testDir = path.join(__dirname, 'test-assets');

    const input = createInput();
    const actual = webAppSetup(input);
    const expected = createCodeFileExpectedWithPathMapping(testDir);

    const { expectedString, actualString } = createCodeFileComparisonStrings(
      actual,
      expected
    );

    expect(actualString).toEqual(expectedString);
  });
});

function createInput(): WebAppSetupInput {
  return {
    options: {
      appsMonorepo: TEST_APPS_MONOREPO_OPTIONS,
      libModuleNames: DEFAULT_CODE_GENERATION_LIB_MODULE_NAMES,
      interfacePrefixes: {
        db: 'db',
        app: 'app',
      },
    },
  };
}
