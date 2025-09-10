# Security Policy

## Supported Versions

The following versions of Mezon are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.4.x   | :white_check_mark: |
| < 1.4.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Mezon, please send an email to security@mezon.ai. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Type of vulnerability
- Steps to reproduce the issue
- Affected versions
- Any potential mitigations you've identified

## Secret Detection with GitLeaks

Mezon uses GitLeaks to detect and prevent sensitive information from being committed to the repository. This helps ensure that API keys, passwords, tokens, and other sensitive data are not accidentally exposed.

### How GitLeaks Works in Our Workflow

1. **Pre-commit Hook**: GitLeaks automatically scans staged changes before each commit.
2. **CI/CD Pipeline**: GitLeaks runs in our GitHub Actions workflow on every push and pull request.
3. **Scheduled Scans**: Weekly scans of the entire repository are performed to catch any previously missed secrets.

For more information on how to use GitLeaks in your development workflow, please refer to the [GitLeaks documentation in our developer guide](docs/developer/SECURITY.md).
