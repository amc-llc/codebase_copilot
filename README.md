# Codebase CoPilot

AI-powered codebase understanding and improvement platform. Instantly analyze, document, test, and refactor any codebase using advanced AI models.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

- 🤖 **Multi-Provider AI Support** - Choose from IBM watsonx.ai, OpenAI, Anthropic, Google AI, or Ollama
- 📊 **Architecture Detection** - Automatically identifies patterns (Microservices, MVC, Layered, etc.)
- 📝 **Auto-Documentation** - Generates README, API docs, and architecture documentation
- 🧪 **Test Generation** - Creates comprehensive test suites for your code
- 🔧 **Refactoring Suggestions** - Identifies code quality issues and improvements
- 📈 **Production Readiness** - Complete assessment with actionable recommendations
- 🎓 **Multi-Level Explanations** - Beginner, intermediate, and senior developer modes
- 🚀 **Onboarding Guides** - Helps new developers understand your codebase quickly
- 💾 **Export Functionality** - Export results as JSON, Markdown, PDF, or CSV
- 🌓 **Dark Mode** - Beautiful UI with full dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API key from one of the supported AI providers

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/codebase-copilot.git
cd codebase-copilot

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

1. Navigate to **Settings** page
2. Select your preferred AI provider
3. Enter your API key
4. Choose a model
5. Start analyzing!

For the SaaS variant, copy `.env.example` and provide the required values before running production-style flows.

## 📖 Usage

### 1. Analyze a Codebase

**Option A: Upload Files**
- Go to the Analyze page
- Click "Upload Files" 
- Select your code files
- Choose analysis mode
- Click "Start Analysis"

**Option B: GitHub Repository**
- Go to the Analyze page
- Enter GitHub repository URL
- Optionally specify branch
- Choose analysis mode
- Click "Start Analysis"

### 2. Analysis Modes

- **Explain** - Get multi-level explanations of your codebase
- **Onboard** - Generate complete onboarding guide for new developers
- **Document** - Auto-generate comprehensive documentation
- **Test** - Create test suites for your code
- **Refactor** - Get code quality improvements and suggestions
- **Production-Ready** - Complete production readiness assessment

### 3. View Results

Results are organized in tabs:
- **Summary** - High-level overview and statistics
- **Architecture** - Detected patterns and components
- **Documentation** - Generated docs
- **Tests** - Test coverage and generated tests
- **Refactoring** - Code quality suggestions
- **Risks** - Security and performance issues

### 4. Export Results

Export your analysis in multiple formats:
- **JSON** - Complete data export
- **Markdown** - Formatted report
- **PDF** - Print-ready document
- **CSV** - Refactoring suggestions spreadsheet

## 🎯 Supported Languages

- JavaScript / TypeScript
- Python
- Java
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- Scala
- C# / .NET
- And more...

## 🤖 Supported AI Providers

### IBM watsonx.ai
- Models: Granite 13B, Granite 20B, Llama 2 70B
- Get API key: [IBM Cloud](https://cloud.ibm.com/)

### OpenAI
- Models: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- Get API key: [OpenAI Platform](https://platform.openai.com/)

### Anthropic
- Models: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- Get API key: [Anthropic Console](https://console.anthropic.com/)

### Google AI
- Models: Gemini Pro, Gemini Pro Vision
- Get API key: [Google AI Studio](https://makersuite.google.com/)

### Ollama Cloud
- Models: Llama 2, CodeLlama, Mistral, Mixtral
- Get API key: [Ollama](https://ollama.ai/)

## 🏗️ Architecture

Built with modern technologies:

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **AI Integration**: Multi-provider abstraction layer
- **State Management**: React hooks + localStorage
- **Code Analysis**: Custom parser supporting 15+ languages

## 📁 Project Structure

```
codebase_pilot/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── analyze/           # Analysis interface
│   ├── results/           # Results display
│   ├── settings/          # Settings page
│   └── demo/              # Demo examples
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── ui/               # ShadCN components
│   ├── code-viewer.tsx   # Interactive code viewer
│   ├── loading-state.tsx # Loading components
│   └── error-state.tsx   # Error handling
├── lib/                   # Core libraries
│   ├── ai/               # AI provider integrations
│   ├── analyzer/         # Analysis engines
│   ├── config/           # Configuration
│   └── utils/            # Utilities
└── types/                 # TypeScript types
```

## 🔒 Security & Privacy

- **API Keys**: Stored locally in your browser (encrypted)
- **No Server Storage**: Your code never leaves your machine
- **Open Source**: Full transparency, audit the code yourself
- **No Tracking**: No analytics or user tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [ShadCN UI](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI providers: IBM, OpenAI, Anthropic, Google, Ollama

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/codebase-copilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/codebase-copilot/discussions)
- **Documentation**: This README and in-app help

## 🗺️ Roadmap

- [ ] VS Code extension
- [ ] CLI tool
- [ ] More AI providers
- [ ] Custom model support
- [ ] Team collaboration features
- [ ] CI/CD integration
- [ ] More export formats

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**© 2026 Codebase CoPilot. All Rights Reserved. A Brand of COBRA AI Systems.**

Made with ❤️ for developers who want to understand code faster.
