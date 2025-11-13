# Contributing to GhostChat

Thank you for your interest in contributing! GhostChat is a privacy-focused P2P chat app, and we welcome contributions that align with our mission.

## Code of Conduct

- Be respectful and inclusive
- Focus on privacy and security
- Keep code minimal and maintainable
- No tracking, analytics, or telemetry

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/yourusername/ghostchat/issues)
2. Create new issue with:
   - Browser and version
   - Network type (WiFi, mobile, corporate)
   - Steps to reproduce
   - Expected vs actual behavior
   - Diagnostics test results

### Suggesting Features

1. Check [ROADMAP.md](ROADMAP.md) for planned features
2. Open issue with:
   - Use case description
   - Privacy implications
   - Implementation approach
   - Alternatives considered

### Pull Requests

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes following coding standards
4. Test thoroughly
5. Commit: `git commit -m "Add feature: description"`
6. Push: `git push origin feature/your-feature`
7. Open pull request

## Development Setup

```bash
git clone https://github.com/yourusername/ghostchat.git
cd ghostchat
npm install
npm run dev
```

## Coding Standards

### TypeScript

- Use strict types (no `any`)
- Prefer interfaces over types
- Use const assertions

### React

- Functional components only
- Hooks over class components
- Keep components small

### Privacy

- No localStorage for messages (memory only)
- No tracking or analytics
- No external dependencies that track users

### Code Style

- Minimal implementation
- Self-documenting code
- Comments only for complex logic
- No ASCII art or decorative comments

See [.amazonq/rules/coding-standards.md](.amazonq/rules/coding-standards.md) for details.

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Build test
npm run build
```

## Areas Needing Help

### High Priority

- [ ] Improve connection success rates
- [ ] Better error messages
- [ ] Cross-browser testing
- [ ] Mobile optimizations

### Medium Priority

- [ ] Documentation improvements
- [ ] Accessibility enhancements
- [ ] Performance optimizations
- [ ] UI/UX polish

### Low Priority

- [ ] Additional languages
- [ ] Theme customization
- [ ] Advanced features

## Privacy Guidelines

All contributions must:

- ✅ Keep messages in memory only
- ✅ Auto-clear on tab close
- ✅ No persistent storage
- ✅ No tracking or analytics
- ✅ No external API calls (except signaling)
- ❌ No localStorage for messages
- ❌ No cookies
- ❌ No user accounts
- ❌ No telemetry

## Security Guidelines

- Validate all user input
- Sanitize messages
- Rate limit actions
- Use CSP headers
- No eval() or unsafe code
- Review dependencies for vulnerabilities

## Documentation

Update documentation when:

- Adding new features
- Changing behavior
- Fixing bugs
- Updating dependencies

Files to update:
- README.md (user-facing changes)
- CHANGELOG.md (all changes)
- ROADMAP.md (completed tasks)
- Relevant guides (QUICKSTART, TROUBLESHOOTING, etc.)

## Commit Messages

Format: `Type: Description`

Types:
- `Feature:` New functionality
- `Fix:` Bug fixes
- `Docs:` Documentation only
- `Style:` Code formatting
- `Refactor:` Code restructuring
- `Test:` Test additions/changes
- `Chore:` Maintenance tasks

Examples:
```
Feature: Add QR code sharing
Fix: Connection retry logic
Docs: Update troubleshooting guide
```

## Review Process

1. Automated checks run (build, tests, linting)
2. Code review by maintainers
3. Privacy/security review
4. Merge to master
5. Auto-deploy via CI/CD

## Questions?

- Open discussion in GitHub Discussions
- Check existing documentation
- Review [README.md](README.md) FAQ

## License

By contributing, you agree your contributions will be licensed under MIT License.

---

Thank you for helping make GhostChat better! 🎉
