# Contributing to DevDocs

Thank you for your interest in contributing to DevDocs! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Create a new issue with a clear title and description
3. Include steps to reproduce if applicable
4. Add relevant labels

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write or update tests if needed
5. Ensure all tests pass: `npm test`
6. Commit with a descriptive message
7. Push to your fork
8. Submit a pull request

### Commit Message Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

Example: `feat: Add search functionality to documentation`

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/devdocs.git
cd devdocs
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Start development server
```bash
npm run dev
```

## Code Style

- Use TypeScript for new code
- Follow existing code patterns
- Use Prettier for formatting
- Use ESLint for linting

## Documentation

When adding new features:
1. Update relevant documentation
2. Add JSDoc comments for functions
3. Update README if needed

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage

## Questions?

Feel free to open an issue or reach out via:
- GitHub Issues
- Email: devdocs@example.com

Thank you for contributing!