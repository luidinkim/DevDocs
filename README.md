# DevDocs - Documentation Platform

A modern documentation platform built with Nextra and deployed on AWS Amplify.

## 🚀 Features

- 📚 **Systematic Documentation Structure** - Organized content hierarchy
- 🔍 **Powerful Search** - Full-text search across all documentation
- 🌙 **Dark Mode Support** - Comfortable reading experience
- 🌏 **Multi-language Support** - Korean and English content
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Fast Performance** - Static site generation with Next.js

## 🛠️ Tech Stack

- **Framework**: Next.js 14 + Nextra 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: AWS Amplify
- **Version Control**: Git & GitHub

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/luidinkim/devdocs.git
cd devdocs

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
devdocs/
├── pages/           # MDX pages and content
├── components/      # React components
├── styles/         # Global styles
├── locales/        # i18n translation files
├── lib/            # Utility functions
├── public/         # Static assets
└── docs/           # Project documentation
```

## 📝 Writing Documentation

1. Create MDX files in the `pages` directory
2. Use frontmatter for metadata
3. Import and use React components in MDX
4. Follow the content guidelines in `docs/CONTENT_GUIDE.md`

## 🚀 Deployment

The project is configured for AWS Amplify deployment:

1. Connect your GitHub repository to AWS Amplify
2. Amplify will automatically detect the build settings
3. Deploy with automatic CI/CD on push to main branch

See `docs/DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📄 Documentation

- [Product Requirements](docs/PRD.md)
- [Technical Specification](docs/TECH_SPEC.md)
- [Information Architecture](docs/INFORMATION_ARCHITECTURE.md)
- [Content Guidelines](docs/CONTENT_GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

MIT License - see LICENSE file for details

## 📞 Contact

- GitHub: [github.com/yourusername/devdocs](https://github.com/yourusername/devdocs)
- Email: devdocs@example.com

---

Built with ❤️ using Nextra# Cache refresh trigger 2025년 08월  8일 금 오후  3:41:06
