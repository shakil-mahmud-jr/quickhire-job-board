require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/Job');
const Application = require('../models/Application');

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'New York, NY',
    category: 'Engineering',
    type: 'Full-time',
    description:
      'We are looking for a Senior Frontend Developer to join our growing engineering team. You will work on building and maintaining high-quality web applications used by millions of users. You will collaborate closely with designers, backend engineers, and product managers to deliver exceptional user experiences.\n\nYou will be responsible for writing clean, maintainable code, conducting code reviews, mentoring junior developers, and contributing to architectural decisions.',
    requirements:
      '• 5+ years of experience with React.js\n• Strong proficiency in TypeScript\n• Experience with Next.js and server-side rendering\n• Familiarity with REST APIs and GraphQL\n• Strong understanding of web performance optimization\n• Experience with testing frameworks (Jest, Cypress)\n• Excellent communication skills',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff',
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Remote',
    category: 'Design',
    type: 'Full-time',
    description:
      'Creative Studio is seeking a talented UI/UX Designer who is passionate about creating intuitive, visually stunning digital experiences. You will be the creative force behind our product design, from early wireframes to final pixel-perfect mockups.\n\nThis role requires someone who can balance both user empathy and business goals while maintaining a strong aesthetic eye.',
    requirements:
      '• 3+ years of UI/UX design experience\n• Proficiency in Figma and Adobe XD\n• Strong portfolio demonstrating end-to-end design work\n• Experience with user research and usability testing\n• Understanding of front-end capabilities and constraints\n• Strong communication and presentation skills',
    salary: { min: 80000, max: 110000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=Creative+Studio&background=ec4899&color=fff',
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'DataFlow Systems',
    location: 'San Francisco, CA',
    category: 'Engineering',
    type: 'Full-time',
    description:
      'DataFlow Systems is hiring a Backend Engineer to help us build the infrastructure powering our real-time data platform. You will design and implement scalable APIs, microservices, and data pipelines that process billions of events daily.\n\nYou will work in a fast-paced environment where your contributions will have an immediate impact on our customers.',
    requirements:
      '• 4+ years of Node.js experience\n• Deep understanding of REST API design\n• Experience with MongoDB and PostgreSQL\n• Knowledge of message queues (Kafka, RabbitMQ)\n• Familiarity with Docker and Kubernetes\n• Experience with AWS or GCP cloud services',
    salary: { min: 130000, max: 170000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=DataFlow&background=0ea5e9&color=fff',
  },
  {
    title: 'Digital Marketing Specialist',
    company: 'GrowthHive',
    location: 'Austin, TX',
    category: 'Marketing',
    type: 'Full-time',
    description:
      'GrowthHive is looking for a data-driven Digital Marketing Specialist to own and execute our multi-channel marketing strategy. You will manage campaigns across SEO, SEM, social media, email, and content marketing to drive user acquisition and brand awareness.',
    requirements:
      '• 3+ years of digital marketing experience\n• Proficiency with Google Ads and Meta Ads\n• Experience with SEO tools (Ahrefs, SEMrush)\n• Strong analytical skills and proficiency with Google Analytics\n• Experience with email marketing platforms (HubSpot, Mailchimp)\n• Excellent written communication skills',
    salary: { min: 60000, max: 85000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=GrowthHive&background=f59e0b&color=fff',
  },
  {
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'Seattle, WA',
    category: 'Product',
    type: 'Full-time',
    description:
      'InnovateLab is seeking an experienced Product Manager to lead the development of our flagship SaaS product. You will define the product vision, gather and prioritize requirements, and work cross-functionally to deliver features that delight our customers.\n\nThe ideal candidate has a blend of technical knowledge and business acumen with a passion for solving customer problems.',
    requirements:
      '• 4+ years of product management experience\n• Experience with Agile/Scrum methodologies\n• Strong analytical and data interpretation skills\n• Excellent stakeholder communication and management\n• Experience writing detailed PRDs and user stories\n• Technical background or understanding of software development',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=InnovateLab&background=10b981&color=fff',
  },
  {
    title: 'Data Analyst',
    company: 'InsightMetrics',
    location: 'Chicago, IL',
    category: 'Data',
    type: 'Full-time',
    description:
      'InsightMetrics is hiring a Data Analyst to transform raw data into actionable insights that drive business decisions. You will build dashboards, perform ad-hoc analysis, and work closely with stakeholders across the company to answer critical business questions.',
    requirements:
      '• 2+ years of data analysis experience\n• Proficiency in SQL and Python (Pandas, NumPy)\n• Experience with BI tools (Tableau, Looker, or Power BI)\n• Strong statistical analysis skills\n• Experience with A/B testing and experimentation\n• Excellent data storytelling and presentation skills',
    salary: { min: 75000, max: 100000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=InsightMetrics&background=8b5cf6&color=fff',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudBase',
    location: 'Remote',
    category: 'Engineering',
    type: 'Contract',
    description:
      'CloudBase is seeking a skilled DevOps Engineer to help us modernize our infrastructure and deployment pipelines. You will implement CI/CD workflows, manage our cloud infrastructure on AWS, and work to improve system reliability and performance.',
    requirements:
      '• 3+ years of DevOps/SRE experience\n• Strong knowledge of AWS services (EC2, ECS, Lambda, RDS, S3)\n• Experience with Terraform or CloudFormation\n• Proficiency with Docker and Kubernetes\n• Experience setting up CI/CD pipelines (GitHub Actions, Jenkins)\n• Strong scripting skills (Bash, Python)',
    salary: { min: 90000, max: 130000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=CloudBase&background=64748b&color=fff',
  },
  {
    title: 'Customer Support Lead',
    company: 'HelpDesk Pro',
    location: 'Miami, FL',
    category: 'Customer Support',
    type: 'Full-time',
    description:
      'HelpDesk Pro is looking for a Customer Support Lead to manage our support team and ensure exceptional customer experiences. You will oversee day-to-day support operations, handle escalations, analyze support metrics, and work with the product team to resolve recurring issues.',
    requirements:
      '• 3+ years of customer support experience, 1+ year in a lead role\n• Experience with support platforms (Zendesk, Intercom, Freshdesk)\n• Strong written and verbal communication skills\n• Ability to analyze support data and create reports\n• Team management and coaching experience\n• Passion for customer success',
    salary: { min: 55000, max: 75000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=HelpDesk+Pro&background=f97316&color=fff',
  },
  {
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Boston, MA',
    category: 'Engineering',
    type: 'Full-time',
    description:
      'MobileFirst is seeking a React Native Developer to build and maintain our cross-platform mobile application. You will work on new features, optimize performance, and ensure a seamless experience across iOS and Android platforms.',
    requirements:
      '• 3+ years of React Native experience\n• Strong understanding of JavaScript and TypeScript\n• Experience with native modules and bridging\n• Familiarity with App Store and Google Play submission processes\n• Experience with Redux or Zustand for state management\n• Knowledge of mobile UI/UX best practices',
    salary: { min: 100000, max: 140000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=MobileFirst&background=06b6d4&color=fff',
  },
  {
    title: 'HR Manager',
    company: 'PeopleFirst Corp',
    location: 'Denver, CO',
    category: 'Human Resources',
    type: 'Full-time',
    description:
      'PeopleFirst Corp is hiring an HR Manager to lead our people operations as we scale from 50 to 200 employees. You will oversee recruitment, onboarding, performance management, employee relations, and compliance, ensuring we attract and retain top talent.',
    requirements:
      '• 5+ years of HR experience\n• SHRM or PHR certification preferred\n• Experience with HRIS systems (Workday, BambooHR)\n• Strong knowledge of employment law and compliance\n• Excellent interpersonal and conflict resolution skills\n• Experience managing full-cycle recruitment',
    salary: { min: 85000, max: 115000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=PeopleFirst&background=84cc16&color=fff',
  },
  {
    title: 'Graphic Designer (Intern)',
    company: 'PixelWorks Agency',
    location: 'Los Angeles, CA',
    category: 'Design',
    type: 'Internship',
    description:
      'PixelWorks Agency is offering an exciting internship opportunity for an aspiring Graphic Designer. You will assist senior designers on real client projects, create social media assets, and develop your design skills in a fast-paced agency environment.',
    requirements:
      '• Currently enrolled in or recently graduated from a design program\n• Proficiency in Adobe Creative Suite (Illustrator, Photoshop, InDesign)\n• Basic understanding of Figma\n• A portfolio showcasing your design work\n• Strong attention to detail\n• Eagerness to learn and grow',
    salary: { min: 18, max: 22, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=PixelWorks&background=e11d48&color=fff',
  },
  {
    title: 'Financial Analyst',
    company: 'Capital Ventures',
    location: 'New York, NY',
    category: 'Finance',
    type: 'Full-time',
    description:
      'Capital Ventures is seeking a Financial Analyst to support our investment team with financial modeling, valuation analysis, and market research. You will play a key role in evaluating investment opportunities and preparing reports for senior stakeholders.',
    requirements:
      '• 2+ years of financial analysis experience\n• Strong proficiency in Excel and financial modeling\n• Experience with DCF, comparable company analysis, and LBO modeling\n• CFA Level 1 or 2 preferred\n• Strong analytical and quantitative skills\n• Excellent written and verbal communication',
    salary: { min: 90000, max: 125000, currency: 'USD' },
    companyLogo: 'https://ui-avatars.com/api/?name=Capital+Ventures&background=0369a1&color=fff',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    await Promise.all([Job.deleteMany({}), Application.deleteMany({})]);
    console.log('🗑️  Cleared existing jobs and applications');

    // Insert seed jobs
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${createdJobs.length} sample jobs`);

    // Create a few sample applications
    const sampleApplications = [
      {
        job: createdJobs[0]._id,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        resumeLink: 'https://linkedin.com/in/alicejohnson',
        coverNote: 'I am very excited about this opportunity at TechCorp. I have 6 years of React experience and have shipped multiple large-scale applications. I believe I would be a great fit for your team.',
      },
      {
        job: createdJobs[0]._id,
        name: 'Bob Smith',
        email: 'bob@example.com',
        resumeLink: 'https://github.com/bobsmith',
        coverNote: 'Having worked as a senior frontend developer for 5 years, I am confident I can contribute significantly to your team. My expertise in performance optimization aligns perfectly with your requirements.',
      },
      {
        job: createdJobs[1]._id,
        name: 'Carol White',
        email: 'carol@example.com',
        resumeLink: 'https://behance.net/carolwhite',
        coverNote: 'I am a passionate UI/UX designer with a strong portfolio in SaaS products. I would love to bring my user-centered design approach to Creative Studio.',
      },
    ];

    await Application.insertMany(sampleApplications);
    console.log(`✅ Inserted ${sampleApplications.length} sample applications`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────────────');
    console.log('You can now start the server with: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
