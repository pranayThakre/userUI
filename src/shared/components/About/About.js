import React from 'react';
import './About.css';
import Avatar from '../UIElements/Avatar';
import { FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const About = () => {
  return (
    <div className="about-section">
      <Avatar
        image="/pranay.jpeg"
        alt="Pranay Thakre"
        width="15rem"
        height="15rem"
      />
      <h2 className="center creator-name">Pranay Thakre</h2>
      <p>
        Welcome to ShotShare! <span style={{ 'font-size': '1.5rem' }}>📸</span>
        This is your go-to spot for sharing all the cool places you've visited.
        Connect with others, discover new destinations, and let everyone see the
        world through your eyes. Whether you're a weekend traveler or a seasoned
        explorer, we love seeing every spot you've been to. Join us in building
        a vibrant community of adventure lovers and place sharers!
      </p>
      <div className="contact-details">
        <p className="contact-icon">
          <MdEmail size="1.5rem" color="#D44638" />
          <a href="mailto:pranaythakre.iitkgp@gmail.com">
            pranaythakre.iitkgp@gmail.com
          </a>
        </p>
        <p className="contact-icon">
          <FaLinkedin size="1.5rem" color="#0a66c2" />
          <a href="https://www.linkedin.com/in/pranaythakre">pranaythakre</a>
        </p>
      </div>
    </div>
  );
};

export default About;
