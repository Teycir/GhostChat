# Contributing to GhostChat

Thank you for your interest in contributing to GhostChat! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:

- Clear description of the feature
- Use case and benefits
- Any implementation ideas

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Coding Standards

Please follow the coding standards in `.amazonq/rules/coding-standards.md`:

- No unicode or emoji in code files (only in markdown)
- Use ASCII characters only in source code
- Write minimal, concise code
- Follow TDD: create isolated modules, test, then integrate
- Use TypeScript strict types
- Functional React components only
- Keep components small and focused

## Development Setup

```bash
# Clone your fork
git clone https://github.com/Teycir/GhostChat.git
cd GhostChat

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
npm run test:e2e
```

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test P2P functionality with multiple browser tabs

## Code Review

All submissions require review. We'll provide feedback and may request changes before merging.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or reach out to [teycir@pxdmail.net](mailto:teycir@pxdmail.net)
