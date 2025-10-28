# Codacy Integration Guide

This document explains how Codacy is integrated with the Telephone Directory project and how to use it for code quality analysis.

## GitHub Actions Integration

The project includes a GitHub Actions workflow that automatically runs Codacy analysis on every push and pull request to the main branch. The workflow is defined in `.github/workflows/codacy-analysis.yml`.

### Features
- Automatic code quality analysis on every push
- Security scanning with Trivy
- Results uploaded to Codacy dashboard
- Code scanning alerts in GitHub

## Local Development Integration

### Pre-commit Hook
A pre-commit hook is available to run Codacy analysis before committing changes:
1. The hook is located at `.git/hooks/pre-commit`
2. It analyzes staged files before allowing a commit
3. If issues are found, the commit is blocked until they are fixed

To set up the pre-commit hook on Windows:
```powershell
# Run the setup script
.\setup-precommit.ps1
```

### NPM Scripts
The following npm scripts are available for Codacy integration:

1. `npm run codacy:analyze` - Run Codacy analysis on the entire project
2. `npm run codacy:install` - Install the Codacy CLI globally

## Configuration Files

### Codacy Configuration
- `.codacy.yml` - Main Codacy configuration file
- Defines enabled tools: ESLint, Lizard, PMD, Semgrep, Trivy
- Specifies excluded paths (node_modules, .next, etc.)

### GitHub Actions Workflow
- `.github/workflows/codacy-analysis.yml` - CI/CD workflow for Codacy analysis

## Usage

### Running Analysis Locally
```bash
# Run Codacy analysis on the entire project
npm run codacy:analyze

# Install Codacy CLI (if not already installed)
npm run codacy:install
```

### Continuous Integration
The GitHub Actions workflow automatically runs on:
- Every push to main/master branch
- Every pull request to main/master branch
- Daily at 2 AM UTC (scheduled runs)

## Tools Used

1. **ESLint** - JavaScript/TypeScript linting
2. **Lizard** - Code complexity analysis
3. **PMD** - Static code analysis for multiple languages
4. **Semgrep** - Lightweight static analysis engine
5. **Trivy** - Security vulnerability scanner

## Customization

### Adding New Tools
To add new tools to the Codacy analysis:
1. Update the `.codacy.yml` file
2. Add the tool to the `tools` section
3. Configure any tool-specific settings

### Excluding Paths
To exclude additional paths from analysis:
1. Update the `.codacy.yml` file
2. Add the paths to the `exclude_paths` section

### Adjusting Analysis Settings
To adjust analysis settings:
1. Modify the configuration files in the `tools-configs` directory
2. Update tool-specific configuration files as needed

## Troubleshooting

### Codacy CLI Not Found
If you get an error that the Codacy CLI is not found:
```bash
npm run codacy:install
```

### Analysis Fails
If the analysis fails:
1. Check the error output for specific issues
2. Fix the identified issues in your code
3. Re-run the analysis

### GitHub Actions Failures
If GitHub Actions fail:
1. Check the workflow logs for error details
2. Ensure the `CODACY_PROJECT_TOKEN` secret is set in GitHub
3. Verify the repository is properly configured in Codacy

## Best Practices

1. **Run analysis locally** before pushing changes
2. **Address all issues** identified by Codacy before merging
3. **Regular review** of Codacy dashboard for trends and patterns
4. **Keep tools updated** to benefit from latest analysis capabilities