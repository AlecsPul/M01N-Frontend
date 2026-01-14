import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="About">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Us</h1>
          <p className="hero-subtitle">Three students, one vision, endless possibilities</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="company-overview">
        <div className="content-wrapper">
          <h2>Who We Are</h2>
          <p className="overview-text">
            We are a passionate team of three students from Barcelona, brought together by our love 
            for technology and innovation. This project is our submission for a hackathon, where we're 
            pushing our limits and showcasing what we can achieve when creativity meets determination.
          </p>
          <p className="overview-text">
            As students, we believe in learning by doing. This hackathon is our opportunity to transform 
            ideas into reality, tackle real-world challenges, and prove that great things can come from 
            small, dedicated teams.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="content-wrapper">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <h3>Our Mission</h3>
              <p>
                To demonstrate that students can build innovative, impactful solutions through 
                collaboration, creativity, and cutting-edge technology. We aim to make a difference 
                in this hackathon and beyond.
              </p>
            </div>
            <div className="vision-card">
              <h3>Our Vision</h3>
              <p>
                To inspire other students and young developers to take on challenges, believe in 
                their abilities, and show the world that passion and teamwork can overcome any obstacle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="content-wrapper">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h4>Innovation</h4>
              <p>Thinking outside the box and bringing fresh perspectives to every challenge</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Teamwork</h4>
              <p>Collaborating effectively and leveraging each other's strengths</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h4>Learning</h4>
              <p>Constantly growing, improving, and embracing new technologies</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h4>Passion</h4>
              <p>Driven by enthusiasm and dedication to create something meaningful</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="content-wrapper">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            Three students from Barcelona united by code and creativity
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo"></div>
              <h4>Team Member 1</h4>
              <p className="member-role">Full Stack Developer</p>
              <p className="member-bio">
                Passionate about creating seamless user experiences and robust backend systems
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h4>Team Member 2</h4>
              <p className="member-role">Frontend Developer</p>
              <p className="member-bio">
                Specializing in modern web technologies and beautiful, responsive designs
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h4>Team Member 3</h4>
              <p className="member-role">Backend Developer</p>
              <p className="member-bio">
                Focused on building scalable solutions and optimizing performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="content-wrapper">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>3</h3>
              <p>Team Members</p>
            </div>
            <div className="stat-item">
              <h3>1</h3>
              <p>Hackathon Project</p>
            </div>
            <div className="stat-item">
              <h3>Barcelona</h3>
              <p>Based In</p>
            </div>
            <div className="stat-item">
              <h3>∞</h3>
              <p>Ideas & Dedication</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="content-wrapper">
          <h2>Want to Know More?</h2>
          <p>Follow our journey and see what we're building</p>
          <button className="cta-button">Get in Touch</button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
