# Security Guidelines

## GitLeaks Integration

Mezon uses GitLeaks to detect and prevent sensitive information from being committed to the repository. This document outlines how GitLeaks is integrated into our development workflow and how to use it effectively.

### What is GitLeaks?

GitLeaks is a SAST (Static Application Security Testing) tool that scans repositories for secrets and sensitive information. It helps prevent accidental leakage of API keys, passwords, tokens, and other sensitive data.

### How GitLeaks is Integrated

1. **Pre-commit Hook**: GitLeaks runs automatically before each commit via the pre-commit hook. It scans staged changes for potential secrets and prevents the commit if any are found.

2. **CI/CD Pipeline**: GitLeaks runs in the GitHub Actions workflow on every push and pull request to main and develop branches. It also runs weekly to scan the entire repository.

3. **Custom Rules**: We have a custom GitLeaks configuration (`.gitleaks.toml`) that defines rules for detecting various types of secrets specific to our project.

### Using GitLeaks

#### Automatic Scanning

GitLeaks will automatically scan your changes when you commit code. If it detects potential secrets, it will prevent the commit and display information about the findings.

#### Manual Scanning

You can manually scan the repository using the following commands:

```bash
# Scan the entire repository
yarn gitleaks detect

# Scan a specific directory or file
yarn gitleaks detect --source=./path/to/directory

# Scan uncommitted changes
yarn gitleaks detect --staged
```

### Handling False Positives

If GitLeaks flags something that is not actually a secret (false positive), you have several options:

1. **Modify the code**: Restructure your code to avoid patterns that look like secrets.

2. **Update the configuration**: If it's a common pattern in our codebase, update the `.gitleaks.toml` file to exclude this pattern.

3. **Add an allowlist entry**: For specific cases, you can add entries to the allowlist section in the configuration file.

### What to Do If You Accidentally Commit a Secret

If you accidentally commit a secret:

1. **Revoke the secret immediately**: Change passwords, regenerate API keys, etc.

2. **Contact the security team**: Report the incident so they can assess the risk.

3. **Remove the secret from Git history**: Work with the repository maintainers to properly remove the secret from the Git history.

### Best Practices

1. **Never hardcode secrets**: Use environment variables or secure secret management solutions.

2. **Use example files**: For configuration templates that require secrets, create example files (e.g., `.env.example`) with placeholder values.

3. **Review before committing**: Always review your changes before committing to ensure no secrets are included.

4. **Use .gitignore**: Properly configure `.gitignore` to exclude files that might contain secrets (like `.env` files).

### GitLeaks Configuration

Our GitLeaks configuration (`.gitleaks.toml`) includes rules for detecting:

- API keys
- AWS credentials
- Firebase keys
- Private keys
- Passwords in code
- Environment variables

If you need to modify the configuration, please discuss with the security team first.