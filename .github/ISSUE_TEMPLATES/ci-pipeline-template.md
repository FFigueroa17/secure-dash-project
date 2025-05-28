# CI Pipeline Execution Report

## Overview

**Pipeline Status:** {{STATUS}}  
**Workflow:** `{{WORKFLOW}}`  
**Branch/Tag:** `{{REF_NAME}}`  
**Trigger Event:** `{{EVENT_NAME}}`  
**Repository:** `{{REPO}}`  
**Initiated by:** @{{ACTOR}}

---

## Execution Details

| **Attribute**    | **Value**                                                     |
| ---------------- | ------------------------------------------------------------- |
| **Commit SHA**   | [`{{SHORT_SHA}}`](https://github.com/{{REPO}}/commit/{{SHA}}) |
| **Full SHA**     | `{{SHA}}`                                                     |
| **Workflow Run** | [View Details]({{RUN_URL}})                                   |
| **Timestamp**    | Generated automatically                                       |

---

## Pipeline Stages Status

| **Stage**   | **Job Name**       | **Status**               | **Description**                                        |
| ----------- | ------------------ | ------------------------ | ------------------------------------------------------ |
| **Stage 1** | Code Quality Check | `{{LINT_STATUS}}`        | ESLint, TypeScript validation, and Prettier formatting |
| **Stage 2** | Container Build    | `{{BUILD_STATUS}}`       | Next.js application build process                      |
| **Stage 3** | Integration Tests  | `{{INTEGRATION_STATUS}}` | End-to-end and integration test suite                  |
| **Stage 4** | Unit Tests         | `{{UNIT_STATUS}}`        | Component and utility function unit tests              |

---

## Action Required

This issue has been automatically generated due to pipeline failures. Please review the failed stages and take appropriate action:

### Next Steps:

1. **Review the workflow run details** using the link provided above
2. **Examine the failed job logs** to identify the root cause
3. **Fix the identified issues** in your code
4. **Push the fixes** to trigger a new pipeline run
5. **Close this issue** once all pipeline stages pass successfully

### Common Failure Causes:

- **Linting Issues:** Code style violations, unused variables, or formatting problems
- **Type Errors:** TypeScript compilation errors or type mismatches
- **Build Failures:** Missing dependencies, configuration errors, or compilation issues
- **Test Failures:** Broken functionality, outdated tests, or environment issues

---

## Additional Information

- **Project:** Secure Dashboard Client
- **Technology Stack:** Next.js, TypeScript, React
- **CI/CD Platform:** GitHub Actions
- **Node.js Version:** 22.x

---

_This issue was automatically created by the CI/CD pipeline. For questions or support, please contact the development team._
