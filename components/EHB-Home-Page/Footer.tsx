import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', url: '/about' },
      { name: 'Careers', url: '/careers' },
      { name: 'Contact Us', url: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'GoSellr', url: '/gosellr' },
      { name: 'AI Marketplace', url: '/ehb-ai-market-place' },
      { name: 'Franchise', url: '/ehb-franchise' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', url: '/help' },
      { name: 'Terms of Service', url: '/terms' },
      { name: 'Privacy Policy', url: '/privacy' },
    ],
  },
];

const socialLinks = [
  { icon: <FiFacebook />, url: 'https://facebook.com' },
  { icon: <FiTwitter />, url: 'https://twitter.com' },
  { icon: <FiInstagram />, url: 'https://instagram.com' },
  { icon: <FiLinkedin />, url: 'https://linkedin.com' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EHB Technologies</h3>
            <p className="text-gray-400">Empowering global digital services and solutions.</p>
          </div>
          {footerLinks.map(section => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} EHB Technologies. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
