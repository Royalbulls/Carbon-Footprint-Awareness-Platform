# Carbon Footprint Awareness Platform

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.0+-000000?style=flat&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Security](#security)
- [Testing](#testing)
- [Accessibility](#accessibility)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## 🌍 Project Overview

The **Carbon Footprint Awareness Platform** is an AI-powered sustainability solution designed to empower individuals to understand, measure, and reduce their environmental impact. By leveraging advanced carbon footprint analysis, real-time emissions tracking, and AI-driven sustainability recommendations, this platform enables users to make informed decisions about their daily activities and contribute to a more sustainable future.

### Key Highlights

- **Comprehensive Carbon Tracking**: Monitor your environmental impact across multiple activities
- **AI-Powered Insights**: Get personalized sustainability recommendations using Google Gemini API
- **Real-Time Analytics**: Track emissions data with interactive dashboards
- **Sustainability Goals**: Set and monitor environmental improvement targets
- **Professional Reports**: Generate and export detailed sustainability reports

### Links

- **📱 Live Demo**: [Carbon Footprint Platform](https://carbon-footprint-awareness-platform-326440519773.asia-east1.run.app) *(Update with your live URL)*
- **📚 Repository**: [GitHub - Carbon-Footprint-Awareness-Platform](https://github.com/Royalbulls/Carbon-Footprint-Awareness-Platform)

## 🎯 Problem Statement

Many individuals are unaware of how their daily activities contribute to carbon emissions and lack actionable insights to reduce their environmental footprint. This creates a gap between environmental awareness and sustainable behavior change.

### The Challenge

- **Lack of Awareness**: Users don't understand the carbon impact of their daily decisions
- **Complex Data**: Environmental metrics are difficult to interpret and act upon
- **No Personalization**: Generic sustainability advice doesn't resonate with individual lifestyles
- **Missing Accountability**: Without tracking mechanisms, progress toward sustainability goals is unmeasurable

### Our Solution

The Carbon Footprint Awareness Platform provides:

✅ **Easy Carbon Calculation** - Intuitive tools to measure your environmental impact  
✅ **Detailed Analysis** - Breakdown of emissions across transport, electricity, and waste  
✅ **AI Recommendations** - Personalized sustainability action plans powered by AI  
✅ **Progress Tracking** - Visual dashboards to monitor improvement over time  
✅ **Actionable Insights** - Specific, measurable steps to reduce carbon footprint  

## ✨ Features

### 1. **Carbon Footprint Calculator**
- Monthly CO₂ estimation based on user activities
- Annual CO₂ projection with trend analysis
- Sustainability scoring system
- Comparative environmental impact insights

### 2. **Transport Emissions Analysis**
Track emissions from multiple transportation modes:
- 🚗 Car travel
- 🚌 Public buses
- 🚄 Train journeys
- ✈️ Flight travel
- 🚇 Metro/subway usage
- 🚴 Bicycle tracking (carbon offset)

### 3. **Electricity Consumption Analysis**
- Real-time kWh tracking and monitoring
- Carbon estimation based on regional grid mix
- Energy usage patterns and insights
- Consumption optimization recommendations

### 4. **Waste Impact Assessment**
Measure environmental impact of waste generation:
- ♻️ Plastic waste tracking
- 📄 Paper consumption
- 🏺 Glass disposal
- 🔧 Metal waste
- 🌱 Organic waste composting

### 5. **AI Sustainability Advisor**
- Personalized sustainability recommendations powered by Google Gemini API
- Identification of reduction opportunities
- Custom sustainability action plans
- Real-time AI chat for environmental questions

### 6. **Personalized Recommendations**
- Activity-based suggestion engine
- Priority-ranked reduction opportunities
- Seasonal sustainability tips
- Behavioral change guidance

### 7. **Progress Dashboard**
- Real-time emission tracking visualization
- Goal monitoring and achievement tracking
- Sustainability trends and historical analysis
- Comparative metrics and benchmarking

### 8. **Sustainability Report Export**
- Comprehensive PDF report generation
- Monthly and annual projections
- Detailed breakdown by emission category
- Downloadable sustainability certificates

## 🛠️ Technology Stack

### Frontend
- **React** (18.0+) - Modern UI library for dynamic user interfaces
- **TypeScript** (5.0+) - Type-safe JavaScript for robust code
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Responsive Web Design** - Mobile-first approach

### Backend
- **Node.js** (18.0+) - Server-side JavaScript runtime
- **Express.js** (4.0+) - Minimalist web framework for API development
- **REST API** - RESTful architecture for client-server communication

### AI & Machine Learning
- **Google Gemini API** - Advanced AI model for sustainability recommendations
- **Natural Language Processing** - Understanding user queries and providing intelligent responses

### Development Tools
- **npm** - Package management
- **Git** - Version control

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Carbon Calculator │ Analytics │ Reports │ Dashboard │  │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────┘
                                  │ REST API
                ┌─────────────────┴──────────────────┐
                │                                    │
┌───────────────▼──────────────┐    ┌──────────────▼─────────┐
│   Backend (Express.js)        │    │  Google Gemini API     │
│ ┌────────────────────────────┐│    │ (AI Recommendations)   │
│ │ Routes & Controllers       ││    └────────────────────────┘
│ │ - Carbon Calculations      ││
│ │ - Emissions Analysis       ││
│ │ - Report Generation        ││
│ │ - AI Integration           ││
│ └────────────────────────────┘│
└───────────────────────────────┘
         │
         │ Data Processing
         │
┌────────▼──────────┐
│  Data Models      │
│  & Business Logic │
└───────────────────┘
```

## 🔒 Security

### Environment Variables
- All sensitive credentials stored in `.env` files
- API keys never hardcoded in source code
- Environment-based configuration management
- Secure credential rotation support

### Input Validation
- Client-side form validation with TypeScript
- Server-side input sanitization on all endpoints
- Protection against SQL injection and XSS attacks
- Data type validation and constraint checking

### Secure API Communication
- HTTPS/TLS encryption for all communications
- Secure headers implementation
- CORS policy configuration
- Rate limiting on API endpoints
- Request authentication and authorization

### Best Practices
- No sensitive data in logs or error messages
- Regular security dependency updates
- Secure storage of user data (if applicable)
- API key scoping and least privilege access

## 🧪 Testing

The platform is comprehensively tested to ensure reliability and accuracy:

### Carbon Calculation Testing
- ✅ Monthly CO₂ estimation accuracy
- ✅ Annual projection calculations
- ✅ Sustainability score computation
- ✅ Edge case handling

### Emissions Analysis Testing
- ✅ Transport mode calculations (car, bus, train, flight, metro)
- ✅ Distance-based emission formulas
- ✅ Multi-modal journey tracking
- ✅ Data accuracy validation

### Dashboard Testing
- ✅ Data visualization rendering
- ✅ Real-time chart updates
- ✅ Interactive component functionality
- ✅ Data filtering and sorting

### Report Generation Testing
- ✅ PDF export functionality
- ✅ Report formatting and layout
- ✅ Data accuracy in reports
- ✅ File download mechanisms

### Mobile Responsiveness Testing
- ✅ Responsive design on all screen sizes
- ✅ Touch interaction compatibility
- ✅ Performance on mobile devices
- ✅ Image and asset optimization

## ♿ Accessibility

The platform is designed with inclusive user experience in mind:

### Mobile Responsive Design
- **Fluid Layouts** - Adapts seamlessly to all device sizes
- **Touch-Friendly Interfaces** - Adequate spacing for mobile interactions
- **Fast Loading** - Optimized performance on slower connections
- **Adaptive Images** - Responsive image loading

### Keyboard Navigation
- **Tab Navigation** - Fully navigable using keyboard
- **Focus Indicators** - Clear visual focus states
- **Keyboard Shortcuts** - Common shortcuts for power users
- **No Keyboard Traps** - Easy navigation without mouse

### Accessible Forms
- **Label Association** - All inputs properly labeled
- **Error Messages** - Clear, actionable error guidance
- **Form Validation** - Real-time feedback
- **Help Text** - Contextual assistance for form fields

### High Contrast Support
- **Color Contrast** - WCAG AA compliant text contrast ratios
- **Dark Mode Support** - Optional dark theme
- **Large Text Support** - Zoom and text resizing compatibility
- **Focus Visibility** - High-contrast focus indicators

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Royalbulls/Carbon-Footprint-Awareness-Platform.git
cd Carbon-Footprint-Awareness-Platform
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API Configuration
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Backend Configuration (if applicable)
NODE_ENV=development
PORT=5000
```

To obtain a **Google Gemini API Key**:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

## 🚀 Running the Application

### Development Mode

```bash
# Start the development server with hot reload
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

### Production Build

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🔮 Future Enhancements

### Planned Features

1. **User Accounts & Authentication**
   - User registration and login
   - Profile management
   - Personal data persistence

2. **Historical Data Tracking**
   - Month-over-month comparison
   - Year-over-year analysis
   - Trend predictions

3. **Carbon Offset Marketplace**
   - Verified carbon offset projects
   - Purchase offset credits
   - Impact verification

4. **Renewable Energy Integration**
   - Solar panel tracking
   - Renewable energy recommendations
   - Grid mix analysis by region

5. **Multi-Language Support**
   - Internationalization (i18n)
   - Support for 10+ languages
   - Localized sustainability tips

6. **Advanced Analytics**
   - Machine learning predictions
   - Peer benchmarking
   - Anomaly detection

7. **Social Features**
   - Community challenges
   - Leaderboards
   - Achievement sharing

8. **API Integrations**
   - Smart home device integration
   - Transportation app APIs
   - Energy provider connections

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Krishna Vishwakarma**

- **Position**: Founder & CEO
- **Organization**: Royal Bulls Advisory Pvt. Ltd.
- **GitHub**: [@Royalbulls](https://github.com/Royalbulls)
- **LinkedIn**: https://www.linkedin.com/in/krishna-vishwakarma-6561582b6
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌱 Making a Difference

Every small action counts. By using this platform, you're taking a step toward understanding and reducing your carbon footprint. Together, we can build a more sustainable future for generations to come.

**Questions or Feedback?**  
Feel free to open an issue on [GitHub](https://github.com/Royalbulls/Carbon-Footprint-Awareness-Platform/issues) or reach out to us directly.

---

<div align="center">

**Built with ❤️ for a sustainable planet**

[⬆ Back to top](#carbon-footprint-awareness-platform)

</div>
