import { Link } from 'react-router-dom';
import { ArrowRight, Building2, TrendingUp, Users, FileText, Bell } from 'lucide-react';
import pmAjayLogo from '../assets/pm-ajay logo.png';
import azadi75Logo from '../assets/azadi75-logo.png';
import namoImage from '../assets/namo.jpeg';
import '../styles/PMajayLanding.css';

const PMajayLanding = () => {
  // Sample data for What's New section
  const newsItems = [
    "Sanction Orders under GIA - ANDHRA PRADESH 2025-2026 (Published Date: 18 Sep 2025)",
    "Sanction Orders under GIA - CHANDIGARH 2024-2025 (Published Date: 18 Sep 2025)",
    "Sanction Orders under GIA - MAHARASHTRA 2024-2025 (Published Date: 01 Jul 2025)",
    "Sanction Orders under GIA - TAMIL NADU 2025-2026 (Published Date: 25 Jun 2025)",
    "Sanction Orders under GIA - TRIPURA 2023-2024 (Published Date: 25 Jun 2025)",
  ];

  // Components data
  const components = [
    {
      icon: Building2,
      title: "Development of SC dominated villages into 'Adarsh Gram'",
      description: "An 'Adarsh Gram' is one wherein people have access to various basic services so that the minimum needs of all the sections of the society are fully met and disparities are reduced to a minimum. These villages would have all such infrastructure facilities and its residents will have access to all such basic services that are necessary for a dignified living.",
    },
    {
      icon: TrendingUp,
      title: "Grants-in-aid to State/Districts",
      description: "The main objectives of this component are: i) To increase the income of the target population by way of comprehensive livelihood projects. ii) Improve socio-economic developmental indicators by ensuring adequate infrastructure in the SC dominated villages.",
    },
    {
      icon: Users,
      title: "Construction/Repair of Hostels",
      description: "The construction of hostels is one of the means to enable and encourage students belonging to Scheduled Castes (SC) to attain quality education. Such hostels are immensely beneficial to the students hailing from rural and remote areas of the country.",
    },
  ];

  // Statistics data
  const statistics = [
    { icon: Building2, value: "47,512", label: "No. of Villages" },
    { icon: Users, value: "45,87,438", label: "No. of Beneficiaries Covered" },
    { icon: FileText, value: "41,481", label: "No. of Works Completed" },
    { icon: Building2, value: "18,749", label: "No. of VDP Generated" },
    { icon: Building2, value: "12,472", label: "Adarsh Gram Declared" },
  ];

  return (
    <div className="pmajay-container">
      {/* Header/Navbar */}
      <header className="pmajay-header">
        <div className="header-content">
          <div className="header-left">
            <img src={pmAjayLogo} alt="PM-AJAY Logo" className="pmajay-logo" />
            <div className="header-text">
              <h1>Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)</h1>
              <p>Department of Social Justice & Empowerment, Ministry of Social Justice and Empowerment, Government of India</p>
            </div>
          </div>
          <div className="header-right">
            <img src={azadi75Logo} alt="Azadi Ka Amrit Mahotsav" className="azadi-logo" />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="pmajay-nav">
        <div className="nav-content">
          <ul className="nav-links">
            <li><Link to="/" className="active">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login" className="login-btn">Login</Link></li>
          </ul>
        </div>
      </nav>

      {/* Banner/Hero Section */}
      <section className="pmajay-banner">
        <div className="banner-slider">
          <div className="banner-slide">
            <img src={namoImage} alt="PM Narendra Modi" className="banner-image" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="pmajay-main">
        <div className="main-content">
          {/* Components Section */}
          <section className="components-section">
            <h2 className="section-title">Components</h2>
            <div className="components-grid">
              {components.map((component, index) => (
                <div key={index} className="component-card">
                  <div className="component-icon">
                    <component.icon size={32} />
                  </div>
                  <div className="component-content">
                    <h3>{component.title}</h3>
                    <p>{component.description}</p>
                    <Link to="#" className="read-more">Read More <ArrowRight size={16} /></Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What's New Section */}
          <section className="whats-new-section">
            <div className="section-header">
              <h2 className="section-title">What's New</h2>
              <Bell className="section-icon" />
            </div>
            <div className="news-list">
              {newsItems.map((item, index) => (
                <div key={index} className="news-item">
                  <div className="news-bullet"></div>
                  <p>{item}</p>
                  <ArrowRight size={16} className="news-arrow" />
                </div>
              ))}
              <Link to="/news" className="view-all">View All</Link>
            </div>
          </section>
        </div>

        {/* Statistics Section */}
        <section className="statistics-section">
          <h2 className="section-title">Adarsh Gram Under PM-AJAY</h2>
          <div className="statistics-grid">
            {statistics.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon size={32} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pmajay-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/feedback">Feedback / Suggestion / Help</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className="footer-info">
            <p>This site is designed, developed, hosted and maintained by National Informatics Centre,<br />Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment, Government of India</p>
            <p className="visitor-count">No. of visitors: 1,24,249</p>
            <p className="update-date">Page last updated on: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PMajayLanding;