import type { TestProject } from 'vitest/node'

import { generateMessages } from '@/i18n/messagesCodegen'

const setup = (project: TestProject) => {
  generateMessages()

  project.onTestsRerun(() => Promise.resolve().then(() => generateMessages()))
}

export default setup
