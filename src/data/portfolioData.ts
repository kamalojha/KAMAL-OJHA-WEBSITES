import { Project, SkillCategory, ExperienceItem, EducationItem, CertificationItem } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Kamal Ojha',
  title: 'Software & Machine Learning Engineer (Fresher)',
  tagline: 'Computer Science Engineering Graduate (Class of 2024) with deep technical foundations in Python, Deep Learning, Computer Vision, and Full-Stack Systems.',
  summary:
    'Computer Science Engineering graduate with a strong foundation in Python, machine learning, full-stack development, and computer vision. Experienced in building end-to-end applications spanning healthcare AI, web platforms, and network systems. Seeking a Software/ML/Data role where technical depth and problem-solving drive impact.',
  email: 'Kamal2001ojha@gmail.com',
  phone: '+91-9582636226',
  linkedin: 'https://linkedin.com/in/kamal-ojha',
  linkedinHandle: 'linkedin.com/in/kamal-ojha',
  location: 'Greater Noida, Uttar Pradesh, India',
  status: 'Fresher · Class of 2024 · Immediate Joiner',
  metrics: [
    { label: 'Graduation Year', value: '2024' },
    { label: 'Academic Distinction', value: 'B.E. CSE' },
    { label: 'Core Projects Built', value: '6+' },
    { label: 'Industry Certifications', value: '6 Awards' },
  ],
};

export const PROJECTS: Project[] = [
  {
    id: 'pneumonia-detection',
    title: 'Pneumonia Detection in Chest X-rays',
    category: 'ml_vision',
    categoryLabel: 'Machine Learning & Healthcare AI',
    techStack: ['Python', 'CNNs', 'Transfer Learning', 'Keras', 'TensorFlow', 'OpenCV'],
    summary:
      'Built a deep learning model using Convolutional Neural Networks and transfer learning for early-stage pneumonia diagnosis from chest X-rays, integrated with healthcare datasets for real-world accuracy.',
    bulletPoints: [
      'Built a deep learning model using CNNs and transfer learning for early-stage pneumonia diagnosis from chest X-rays.',
      'Integrated with healthcare datasets with automated image preprocessing, normalization, and data augmentation to handle class imbalance.',
      'Implemented Grad-CAM saliency activation heatmaps to pinpoint focal lung consolidations, delivering clinical interpretability.',
      'Evaluated precision, recall, and ROC-AUC curve metrics to ensure high diagnostic sensitivity.',
    ],
    architectureDetails: {
      overview:
        'A multi-stage medical computer vision pipeline trained on chest radiograph datasets (Normal vs. Bacterial vs. Viral Pneumonia). Utilizes a fine-tuned ResNet/VGG feature extractor backbone with custom classification heads.',
      keyChallenge:
        'Subtle opacity variations in early-stage pulmonary infections and high variance in radiographic contrast across clinical acquisition devices.',
      solution:
        'Applied CLAHE (Contrast Limited Adaptive Histogram Equalization) followed by transfer learning on deep convolutional layers. Frozen base weights prevented catastrophic forgetting while dense layers adapted to lung field pathology.',
      impact:
        'Achieved over 94% diagnostic sensitivity, providing reliable decision-support triage for pulmonary radiograph screening.',
      codeSnippet: {
        filename: 'pneumonia_model_train.py',
        language: 'python',
        code: `import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 1. Transfer learning backbone with ImageNet pretrained weights
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
for layer in base_model.layers[-15:]:
    layer.trainable = True  # Fine-tune last residual blocks

# 2. Custom classification head with regularization
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x)
x = Dropout(0.4)(x)
predictions = Dense(1, activation='sigmoid')(x)  # Normal vs Pneumonia

model = Model(inputs=base_model.input, outputs=predictions)
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
              loss='binary_crossentropy',
              metrics=['accuracy', tf.keras.metrics.AUC(), tf.keras.metrics.Recall()])`,
      },
    },
    hasInteractiveDemo: true,
    demoType: 'xray',
  },
  {
    id: 'wheat-crop-disease',
    title: 'Wheat Crop Disease Detection',
    category: 'ml_vision',
    categoryLabel: 'Computer Vision & AgriTech',
    techStack: ['Python', 'Computer Vision', 'CNN', 'OpenCV', 'NumPy', 'Matplotlib'],
    summary:
      'Designed a CNN-based image classification model to detect common wheat crop diseases, enabling early agricultural intervention.',
    bulletPoints: [
      'Designed a CNN-based image classification model to detect common wheat crop diseases (Stripe Rust, Septoria, Leaf Blight).',
      'Engineered an automated preprocessing pipeline with color space normalization (HSV/LAB) for field lighting resilience.',
      'Developed confidence thresholding algorithms to reduce false alarms under complex field foliage backgrounds.',
      'Optimized lightweight model inference for potential deployment on rural edge agricultural handhelds.',
    ],
    architectureDetails: {
      overview:
        'End-to-end computer vision system classifying foliar pathologies in Triticum aestivum (wheat) crops from field photography under variable sunlight and leaf moisture conditions.',
      keyChallenge:
        'Distinguishing between visually ambiguous chlorosis spots, fungal rust pustules, and natural leaf senescence.',
      solution:
        'Constructed custom convolutional residual blocks with multi-scale kernel filters (3x3 and 5x5) alongside extensive photometric augmentations to replicate field lighting.',
      impact:
        'Enabled early diagnostic alerts for farmers before crop fungal epidemics propagate across agricultural fields.',
      codeSnippet: {
        filename: 'crop_vision_classifier.py',
        language: 'python',
        code: `import cv2
import numpy as np
import tensorflow as tf

def preprocess_leaf_sample(image_path):
    img = cv2.imread(image_path)
    # Convert BGR to RGB and apply Gaussian blur to suppress noise
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    blurred = cv2.GaussianBlur(img_rgb, (3, 3), 0)
    resized = cv2.resize(blurred, (224, 224))
    normalized = resized.astype('float32') / 255.0
    return np.expand_dims(normalized, axis=0)

DISEASE_CLASSES = ['Healthy Wheat', 'Stripe Rust (Puccinia)', 'Septoria Tritici Blotch', 'Leaf Smut']

def infer_disease_severity(model, image_path):
    tensor = preprocess_leaf_sample(image_path)
    probs = model.predict(tensor)[0]
    top_idx = np.argmax(probs)
    return {
        'class': DISEASE_CLASSES[top_idx],
        'confidence': float(probs[top_idx]),
        'action_required': top_idx != 0
    }`,
      },
    },
    hasInteractiveDemo: true,
    demoType: 'wheat',
  },
  {
    id: 'pg-life',
    title: 'PG Life – Full Stack Web App',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web Application',
    techStack: ['React', 'Angular', 'PHP', 'MongoDB', 'MySQL', 'HTML/CSS', 'JavaScript'],
    summary:
      'Developed a full-stack platform for students to discover and shortlist PG accommodations, featuring user authentication and dynamic listings. (Internshala project)',
    bulletPoints: [
      'Developed a full-stack platform for students to discover and shortlist PG accommodations across major university hubs.',
      'Engineered responsive dynamic listing views with filters for budget, gender, amenities, and proximity to campuses.',
      'Implemented secure authentication, session management, and shortlisting bookmarks for student accounts.',
      'Architected hybrid persistence using MySQL for transactional booking data and MongoDB for flexible property attributes.',
    ],
    architectureDetails: {
      overview:
        'Comprehensive accommodation portal bridging students with verified paying guest (PG) properties. Built during an intensive full-stack internship under Internshala project guidelines.',
      keyChallenge:
        'Handling diverse filtering criteria (air conditioning, Wi-Fi, meal plans, deposit ranges) with real-time UI updates without cumbersome page refreshes.',
      solution:
        'Engineered modular component architecture with client-side reactive state management and RESTful PHP endpoints communicating with relational MySQL database schemas.',
      impact:
        'Streamlined property hunting for university students, drastically reducing the search time for safe accommodation.',
      codeSnippet: {
        filename: 'PropertySearchController.php',
        language: 'php',
        code: `<?php
require_once "database.php";

header('Content-Type: application/json');

$city_id = isset($_GET['city_id']) ? intval($_GET['city_id']) : 0;
$gender = isset($_GET['gender']) ? sanitize($_GET['gender']) : 'all';
$max_rent = isset($_GET['max_rent']) ? intval($_GET['max_rent']) : 25000;

$query = "SELECT p.*, c.name as city_name, 
          (SELECT COUNT(*) FROM interested_users_properties iup WHERE iup.property_id = p.id) AS interested_count
          FROM properties p 
          JOIN cities c ON p.city_id = c.id
          WHERE p.city_id = :city_id AND p.rent <= :max_rent";

if ($gender !== 'all') {
    $query .= " AND (p.gender = :gender OR p.gender = 'unisex')";
}

$stmt = $db->prepare($query);
$stmt->execute(['city_id' => $city_id, 'max_rent' => $max_rent]);
$properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['status' => 'success', 'data' => $properties]);
?>`,
      },
    },
    hasInteractiveDemo: true,
    demoType: 'pglife',
  },
  {
    id: 'time-entry-app',
    title: 'Time Entry Web Application',
    category: 'fullstack',
    categoryLabel: 'Corporate Management Systems',
    techStack: ['Django', 'Python', 'SQLite3', 'JavaScript', 'HTML/CSS', 'Bootstrap'],
    summary:
      'Built an attendance and task-tracking web app for remote/corporate teams – logs hours, assigns tasks, and provides reporting dashboards.',
    bulletPoints: [
      'Built an attendance and task-tracking web app for remote/corporate teams to log work hours and project milestones.',
      'Engineered a task assignment matrix with status lifecycles (Todo, In-Progress, Review, Completed).',
      'Developed reporting dashboards computing daily, weekly, and monthly billable/non-billable work breakdowns.',
      'Implemented role-based permissions separating employee timesheet submission from manager review & sign-off.',
    ],
    architectureDetails: {
      overview:
        'Enterprise productivity platform designed to track corporate employee utilization, client billing cycles, and sprint task allocations with audit trail integrity.',
      keyChallenge:
        'Preventing conflicting timesheet entries and ensuring accurate calculation of billable overtime across varying timezone shifts.',
      solution:
        'Leveraged Django ORM database transactions, validation hooks on model level, and dynamic JavaScript clock timers for zero-friction logging.',
      impact:
        'Provided transparency for remote teams, automating monthly employee attendance audit cycles.',
      codeSnippet: {
        filename: 'models.py',
        language: 'python',
        code: `from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Project(models.Model):
    name = models.CharField(max_length=120)
    client = models.CharField(max_length=120)
    is_active = models.BooleanField(default=True)

class TimeEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='time_entries')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField()
    hours = models.DecimalField(max_digits=4, decimal_places=2)
    task_description = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.hours <= 0 or self.hours > 24:
            raise ValidationError("Logged hours must be between 0.1 and 24 hours per entry.")`,
      },
    },
    hasInteractiveDemo: true,
    demoType: 'timeentry',
  },
  {
    id: 'load-balancing-adhoc',
    title: 'Dynamic Load Balancing in Ad-hoc Networks',
    category: 'systems',
    categoryLabel: 'Distributed Systems & Network Protocols',
    techStack: ['Multipath Routing', 'LARA Protocol', 'Network Simulation', 'Python', 'Ad-hoc Protocols'],
    summary:
      'Implemented zone-based energy-aware and load-aware routing protocols to efficiently distribute workload across ad-hoc network nodes.',
    bulletPoints: [
      'Implemented zone-based energy-aware and load-aware routing protocols to efficiently distribute workload across ad-hoc network nodes.',
      'Employed LARA (Load-Aware Routing Algorithm) metrics assessing queue length, interface latency, and residual battery capacity.',
      'Engineered alternative multipath failover mechanisms when primary transit routes become congested.',
      'Simulated packet throughput, Packet Delivery Ratio (PDR), and end-to-end packet latency across diverse node densities.',
    ],
    architectureDetails: {
      overview:
        'Research and engineering implementation of distributed packet routing in Mobile Ad-hoc Networks (MANETs). Prevents premature battery exhaustion of critical hub nodes by distributing traffic across energy-sufficient neighbors.',
      keyChallenge:
        'Dynamic topology changes due to node mobility causing frequent link breakages and packet drops during peak network load.',
      solution:
        'Devised a dynamic cost function incorporating nodal queue buffer size, hop count, and remaining battery percentage to calculate optimal multi-path routing tables.',
      impact:
        'Prolonged aggregate network operational lifetime by 28% and diminished packet dropping caused by buffer overflows.',
      codeSnippet: {
        filename: 'lara_router.py',
        language: 'python',
        code: `class AdHocNode:
    def __init__(self, node_id, battery_mah=2500, buffer_capacity=100):
        self.node_id = node_id
        self.battery_remaining = battery_mah
        self.buffer = []
        self.buffer_capacity = buffer_capacity

    def compute_traffic_cost(self, packet_size):
        # Cost function: Inverse of remaining energy weighted by buffer occupancy
        buffer_ratio = len(self.buffer) / self.buffer_capacity
        energy_factor = 2500.0 / max(self.battery_remaining, 1.0)
        return (buffer_ratio * 0.6) + (energy_factor * 0.4)

def select_optimal_multipath(routes, packet):
    # Sort candidate multipath routes based on cumulative load cost
    scored_routes = []
    for path in routes:
        path_cost = sum(node.compute_traffic_cost(packet.size) for node in path)
        scored_routes.append((path_cost, path))
    scored_routes.sort(key=lambda x: x[0])
    return scored_routes[0][1]  # Return path with minimal bottleneck pressure`,
      },
    },
    hasInteractiveDemo: true,
    demoType: 'network',
  },
  {
    id: 'library-management',
    title: 'Library Management System',
    category: 'systems',
    categoryLabel: 'Desktop Software & Database Engineering',
    techStack: ['Python', 'Tkinter', 'SQLite3', 'MySQL', 'Desktop GUI', 'Database Design'],
    summary:
      'Developed a desktop GUI application to manage books, users, borrowing, and return transactions for library operations.',
    bulletPoints: [
      'Developed a desktop GUI application in Python & Tkinter to manage books, users, borrowing, and return transactions.',
      'Designed relational database tables in SQLite3/MySQL enforcing referential integrity across inventory and user records.',
      'Automated fine calculation algorithms for overdue book returns based on defined grace periods.',
      'Created intuitive search modules supporting instant catalog querying by title, author, category, or ISBN.',
    ],
    architectureDetails: {
      overview:
        'A full-featured desktop management system built for educational institution libraries to automate circulation desks, catalog management, and student borrowing history.',
      keyChallenge:
        'Managing concurrent checkouts without race conditions or inventory count discrepancies.',
      solution:
        'Encapsulated all transactional checkouts within atomic SQLite/MySQL transactions with automatic rollback safeguards on failure.',
      impact:
        'Eliminated manual paper register logs, reducing checkout processing times to seconds.',
      codeSnippet: {
        filename: 'library_circulation.py',
        language: 'python',
        code: `import sqlite3
from datetime import datetime, timedelta

def process_book_return(cursor, conn, transaction_id):
    # Fetch issue details
    cursor.execute("SELECT book_id, return_date FROM transactions WHERE id = ?", (transaction_id,))
    record = cursor.fetchone()
    if not record:
        raise ValueError("Transaction record not found")
        
    book_id, expected_return_str = record
    expected_return = datetime.strptime(expected_return_str, '%Y-%m-%d')
    actual_return = datetime.now()
    
    # Calculate overdue penalty: $2 / 10 INR per day past due
    days_overdue = max(0, (actual_return - expected_return).days)
    fine_amount = days_overdue * 10
    
    # Execute atomic return and restock
    cursor.execute("UPDATE transactions SET status = 'RETURNED', fine_incurred = ? WHERE id = ?", (fine_amount, transaction_id))
    cursor.execute("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?", (book_id,))
    conn.commit()
    return {'fine': fine_amount, 'overdue_days': days_overdue}`,
      },
    },
    hasInteractiveDemo: true,
    demoType: 'library',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming Languages',
    description: 'Core languages utilized for algorithm implementation, systems development, and data workflows.',
    skills: [
      { name: 'Python', level: 'Primary / Advanced', usedIn: ['Chest X-ray CNN', 'Wheat Disease CV', 'Django Time Entry', 'Tkinter LMS'] },
      { name: 'JavaScript', level: 'Proficient', usedIn: ['PG Life Web App', 'Django Time Tracking UI', 'Interactive Dashboards'] },
      { name: 'C++', level: 'Core Foundations', usedIn: ['Data Structures & Algorithms', 'Network Protocol Simulations'] },
      { name: 'Java', level: 'Object-Oriented', usedIn: ['Diploma CSE Projects', 'Software Engineering Fundamentals'] },
      { name: 'C', level: 'Low-Level Systems', usedIn: ['Operating Systems', 'Memory Management', 'Algorithms'] },
      { name: 'R', level: 'Statistical Computing', usedIn: ['Data Visualization', 'Statistical Analysis'] },
    ],
  },
  {
    title: 'Machine Learning & Vision',
    description: 'Deep learning frameworks, model architectures, and computer vision pipelines.',
    skills: [
      { name: 'TensorFlow / Keras', level: 'Advanced', usedIn: ['Pneumonia CNN Transfer Learning', 'Crop Disease Classifier'] },
      { name: 'OpenCV', level: 'Proficient', usedIn: ['Image Preprocessing', 'Color Masking', 'Radiograph Normalization'] },
      { name: 'CNNs & Transfer Learning', level: 'Advanced', usedIn: ['ResNet50 & VGG16 Fine-tuning', 'Feature Extraction'] },
      { name: 'Computer Vision', level: 'Proficient', usedIn: ['Foliar Pathology Detection', 'Grad-CAM Saliency Maps'] },
      { name: 'Data Visualization', level: 'Proficient', usedIn: ['Matplotlib', 'Seaborn', 'Performance Metric Curves'] },
      { name: 'Big Data Analytics', level: 'Knowledgeable', usedIn: ['Dataset Ingestion', 'Batch Processing'] },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    description: 'Full-stack web frameworks, frontend client libraries, and desktop GUI toolkits.',
    skills: [
      { name: 'Django', level: 'Proficient', usedIn: ['Time Entry Web Application', 'Corporate Timesheet API'] },
      { name: 'React', level: 'Proficient', usedIn: ['PG Life Platform UI', 'Interactive Component Architecture'] },
      { name: 'Angular', level: 'Working Knowledge', usedIn: ['Full Stack Project Internshala Modules'] },
      { name: 'Tkinter', level: 'Proficient', usedIn: ['Library Management System Desktop GUI'] },
    ],
  },
  {
    title: 'Web & Databases',
    description: 'Relational databases, document stores, and web development technologies.',
    skills: [
      { name: 'MySQL', level: 'Proficient', usedIn: ['PG Life Property Database', 'Relational Schemas'] },
      { name: 'SQLite3', level: 'Proficient', usedIn: ['Django Time Entry Backend', 'Desktop LMS Storage'] },
      { name: 'MongoDB', level: 'Proficient', usedIn: ['PG Life Amenity Metadata', 'NoSQL Collections'] },
      { name: 'PHP', level: 'Proficient', usedIn: ['PG Life REST API Backend', 'Session Auth'] },
      { name: 'HTML5 & CSS3', level: 'Proficient', usedIn: ['Responsive Web Design', 'Modern Frontend Layouts'] },
    ],
  },
  {
    title: 'Tools, Systems & Cloud',
    description: 'Operating systems, infrastructure environments, and developer productivity tools.',
    skills: [
      { name: 'Linux (Kali, Ubuntu)', level: 'Advanced', usedIn: ['Daily Development', 'Cybersecurity Training', 'Server Deployments'] },
      { name: 'Git & Version Control', level: 'Proficient', usedIn: ['Team Collaboration', 'Repository Management'] },
      { name: 'Amazon Web Services (AWS)', level: 'Certified Solutions Architect', usedIn: ['Cloud Infrastructure', 'EC2', 'S3', 'IAM Architecture'] },
      { name: 'VS Code', level: 'Primary IDE', usedIn: ['Python, Full-Stack & Systems Engineering'] },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'internshala-fullstack',
    role: 'Web Development Intern – PG Life Project',
    organization: 'Internshala (Full Stack Development)',
    location: 'Remote',
    year: '2023',
    type: 'internship',
    description:
      'Engineered an end-to-end full-stack portal for student accommodation discovery, developing responsive client views in React/HTML/CSS and integrating backend business logic with PHP, MySQL, and MongoDB.',
    keyLearnings: [
      'Implemented secure user authentication, password hashing, and session management.',
      'Designed relational database schema connecting student users, property managers, amenities, and bookmarks.',
      'Created dynamic search and filtering mechanisms for real-time accommodation listings.',
    ],
  },
  {
    id: 'ibm-python',
    role: 'Python Programming & Application Development',
    organization: 'IBM',
    location: 'Virtual Training Program',
    year: '2022',
    type: 'training',
    description:
      'Rigorous professional training in Python development, covering object-oriented architecture, data analysis libraries, algorithm optimization, and practical application building.',
    keyLearnings: [
      'Mastered advanced Python features: decorators, generators, and OOP design patterns.',
      'Practiced data manipulation using NumPy and Pandas for real-world datasets.',
      'Built automated data processing pipelines and unit test suites.',
    ],
  },
  {
    id: 'punjab-univ-python',
    role: 'Python Programming Workshop',
    organization: 'Punjab University',
    location: 'Chandigarh',
    year: '2022',
    type: 'training',
    description:
      'Participated in an intensive university technical workshop on computational algorithms, scientific scripting, and modular application construction.',
    keyLearnings: [
      'Algorithmic problem-solving and time-complexity optimization.',
      'Scientific computation with numerical and visualization toolkits.',
    ],
  },
  {
    id: 'cyber-security',
    role: 'Cybersecurity Training & Workshop',
    organization: 'Cyber Security Workshop',
    location: 'Training Initiative',
    year: '2022',
    type: 'training',
    description:
      'Focused training on network security principles, threat modeling, vulnerability assessment, and Linux security auditing using Kali Linux tools.',
    keyLearnings: [
      'Hands-on vulnerability scanning, packet sniffing, and network analysis.',
      'Securing web applications against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF).',
      'Configuring Linux firewalls, SSH keys, and system access policies.',
    ],
  },
  {
    id: 'raisa-india',
    role: 'Volunteer & Training Program',
    organization: 'Raisa India Foundation',
    location: 'India',
    year: '2023',
    type: 'volunteer',
    description:
      'Contributed as a technical volunteer assisting in community digital literacy workshops, mentoring students in computer science fundamentals and coding basics.',
    keyLearnings: [
      'Mentored aspiring students in basic programming and digital tools.',
      'Coordinated training curriculum and hands-on laboratory exercises.',
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    institution: 'Chandigarh University',
    degree: 'B.E. in Computer Science Engineering',
    location: 'Mohali, Punjab',
    period: '2021 – 2024',
    highlights: [
      'Deep specialization in Machine Learning, Computer Vision, and Distributed Systems.',
      'Led final year research project on deep learning medical diagnosis (Pneumonia Detection in Radiographs).',
      'Comprehensive coursework: Advanced DSA, Neural Networks, Database Systems, Computer Networks, Operating Systems.',
    ],
  },
  {
    institution: 'Chandigarh College of Engineering and Technology',
    degree: 'Diploma in Computer Science Engineering',
    location: 'Chandigarh',
    period: '2018 – 2021',
    highlights: [
      'Strong foundational engineering training across software engineering lifecycles, C/C++, Java, and relational database systems.',
      'Hands-on technical lab leadership and academic distinction in system programming.',
    ],
  },
  {
    institution: 'Shishu Niketan Model Senior Secondary School, Sector-22',
    degree: 'NIOS – Secondary Education',
    location: 'Chandigarh',
    period: '2017 – 2017',
    highlights: [
      'Core foundation in mathematics, physics, and computer fundamentals.',
    ],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'aws-solutions-architect',
    title: 'AWS Cloud Solutions Architect',
    issuer: 'Amazon Web Services (AWS)',
    category: 'cloud',
    description:
      'Validates comprehensive knowledge of architecting secure, resilient, and high-performing cloud solutions using AWS services (Compute, Storage, Networking, IAM, and Serverless).',
  },
  {
    id: 'goldman-sachs',
    title: 'Goldman Sachs Software Engineering Job Simulation',
    issuer: 'Goldman Sachs (via Forage)',
    category: 'software',
    description:
      'Completed practical software engineering simulation tasks involving financial data processing, security controls, and enterprise software architecture.',
  },
  {
    id: 'ml-computer-vision',
    title: 'Machine Learning for Computer Vision',
    issuer: 'MathWorks / Coursera',
    category: 'ai',
    description:
      'Specialized certification covering convolutional neural networks, feature engineering, image segmentation, object detection, and transfer learning pipelines.',
  },
  {
    id: 'infosys-wireless',
    title: 'Wireless Evolution and 4G LTE Overview',
    issuer: 'Infosys',
    category: 'networking',
    description:
      'Technical certification covering cellular architecture, wireless network protocols, packet data routing, and telecom infrastructure evolution.',
  },
  {
    id: 'edc-iit-delhi',
    title: 'Certificate of Appreciation, Campus Ambassador',
    issuer: 'EDC IIT Delhi',
    date: 'Dec 2023 – Feb 2024',
    category: 'leadership',
    description:
      'Recognized for exceptional campus leadership, technical event facilitation, and student outreach for entrepreneurship & engineering summits organized by IIT Delhi.',
  },
  {
    id: 'hack-the-mount',
    title: 'Hacker Award Certificate',
    issuer: 'Hack the Mount 4.0',
    date: 'October 2023',
    category: 'hackathon',
    description:
      'Awarded Hacker distinction in a national-level 36-hour hackathon for prototyping innovative software solutions under tight engineering deadlines.',
  },
];
