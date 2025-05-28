# CI Pipeline Documentation

## Overview

This repository uses an intelligent CI/CD pipeline that automatically manages GitHub Issues for pipeline failures. The system avoids creating duplicate issues and provides a centralized tracking mechanism for CI problems.

## Pipeline Stages

### Stage 1: Code Quality Check

- **ESLint**: Code style and quality validation
- **TypeScript**: Type checking and compilation
- **Prettier**: Code formatting verification

### Stage 2: Container Build

- **Next.js Build**: Application compilation and optimization
- **Dependencies**: Package installation and validation

### Stage 3: Integration Tests

- **End-to-End Tests**: Full application flow testing
- **API Integration**: Backend service integration tests

### Stage 4: Unit Tests

- **Component Tests**: React component unit tests
- **Utility Tests**: Helper function and utility tests

## Smart Issue Management

### How It Works

The pipeline includes two intelligent jobs that manage GitHub Issues automatically:

#### 🔍 Stage 5: Smart GitHub Issue Management

**Triggers**: When any pipeline stage fails
**Behavior**:

1. **Search for existing issues** with labels matching:

   - `ci-pipeline`
   - `{branch-name}` (e.g., `main`, `develop`)
   - `{workflow-name}` (e.g., `CI Pipeline - Secure Dash Client`)

2. **If existing issue found**:

   - Adds a detailed comment with current failure status
   - Includes links to workflow run and commit
   - Shows comparison table of all stage results
   - Provides quick action links

3. **If no existing issue found**:
   - Creates a new comprehensive issue
   - Uses professional template with all relevant information
   - Assigns to the person who triggered the pipeline
   - Applies appropriate labels for tracking

#### ✅ Stage 6: Close Resolved Issues

**Triggers**: When all pipeline stages pass
**Behavior**:

1. **Search for open issues** with matching labels
2. **For each found issue**:
   - Adds a success comment with resolution details
   - Automatically closes the issue with "completed" status
   - Includes celebration emoji and links to successful run

### Issue Labels

The system uses the following labels for organization:

- `ci-pipeline`: Identifies CI-related issues
- `secure-dash-client`: Project identifier
- `{branch-name}`: Branch where failure occurred
- `{event-name}`: Trigger event (push, pull_request)
- `{workflow-name}`: Specific workflow identifier

### Benefits

1. **No Spam**: Prevents multiple issues for the same failing pipeline
2. **Centralized Tracking**: All failures for a branch/workflow in one place
3. **Automatic Resolution**: Issues close automatically when fixed
4. **Rich Context**: Detailed information about each failure
5. **Quick Actions**: Direct links to logs, commits, and branches
6. **Professional Appearance**: Clean, organized issue format

## Issue Templates

### Main Issue Template

Located at `.github/ISSUE_TEMPLATES/ci-pipeline-template.md`

- Comprehensive pipeline status overview
- Execution details with links
- Stage-by-stage breakdown
- Action required section with troubleshooting tips

### Comment Template

Located at `.github/ISSUE_TEMPLATES/ci-pipeline-comment-template.md`

- Concise update format for existing issues
- Current status comparison
- Quick action links
- Automatic closure notice

## Configuration

### Required Permissions

The workflow requires the following GitHub token permissions:

- `issues: write` - Create, update, and close issues
- `contents: read` - Access repository content

### Environment Variables

All necessary variables are automatically provided by GitHub Actions:

- `github.token` - Authentication token
- `github.repository` - Repository identifier
- `github.ref_name` - Branch name
- `github.workflow` - Workflow name
- `github.actor` - User who triggered the workflow

## Troubleshooting

### Common Issues

1. **Issues not being created**

   - Check that `issues: write` permission is granted
   - Verify the workflow is running on failure conditions

2. **Duplicate issues still appearing**

   - Ensure labels are consistent across runs
   - Check that search query is finding existing issues

3. **Issues not closing automatically**
   - Verify the success condition logic
   - Check that the close job has proper permissions

### Debugging

To debug the issue management system:

1. Check the workflow run logs for the "Smart GitHub Issue Management" job
2. Look for the search query output and results
3. Verify API responses in the curl command outputs
4. Check issue labels match the expected pattern

## Customization

### Modifying Templates

Edit the template files in `.github/ISSUE_TEMPLATES/` to customize:

- Issue format and content
- Comment structure
- Links and quick actions
- Styling and emojis

### Adjusting Search Logic

Modify the search query in the workflow to change:

- Label matching criteria
- Issue state filtering
- Repository scope

### Adding New Stages

When adding new pipeline stages:

1. Update the template variables
2. Add new status checks to the condition logic
3. Include new stage information in templates

## Best Practices

1. **Keep labels consistent** across all workflow runs
2. **Use descriptive branch names** for better issue organization
3. **Review and close issues manually** if automatic closure fails
4. **Monitor issue creation patterns** to identify recurring problems
5. **Update templates regularly** to improve information quality
