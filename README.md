@"
# 🏥 SafeCare Health Hospital - Complete Healthcare Registration System

## 📋 Project Overview
A **complete healthcare registration and appointment management system** built with Bootstrap 5 and JavaScript. This web application allows patients to register, book appointments with specialist doctors, manage appointments, and leave reviews.

## 🎯 Activity Requirements Met

### ✅ Bootstrap Components (Required)
- **Navbar** - Sticky navigation menu
- **Buttons** - Primary, Success, Danger, Outline buttons
- **Cards** - Doctor profiles and statistics display
- **Form** - Patient registration with validation
- **Tables** - Upcoming/Completed/Cancelled appointments

### ✅ Interactive Components (All 5 included)
- **Carousel** - Hospital facility image slider
- **Modal** - Hospital guidelines & review system
- **Accordion** - FAQ section
- **Alerts** - Success/Error/Warning notifications
- **Badges** - Status indicators and ratings

### ✅ JavaScript Integration
- Dynamic table population without page refresh
- Form validation (email, phone number)
- Modal show/hide with .show() method
- Event listener: show.bs.modal (required by rubric)
- Real-time UI updates on all actions

## 👨‍⚕️ Doctors Available

| Doctor | Specialty | Experience | Schedule |
|--------|-----------|------------|----------|
| Dr. Sarah Johnson | Cardiologist | 15 years | Mon/Wed/Fri 9am-5pm |
| Dr. Michael Chen | Neurologist | 12 years | Tue/Thu/Sat 10am-6pm |
| Dr. Emily Rodriguez | Pediatrician | 10 years | Mon-Fri 8am-4pm |
| Dr. James Wilson | Orthopedic | 20 years | Mon/Wed 9am-7pm |
| Dr. Lisa Patel | Dermatologist | 8 years | Tue/Thu/Fri 10am-6pm |

## 🚀 Features

### Patient Registration
- Full name, email, mobile number, Date of birth, Blood type, Emergency contact
- Real-time form validation for email and Philippine mobile numbers

### Appointment Management
- Book appointments with any doctor
- **Complete** button - Moves appointment to Completed tab
- **Cancel** button - Moves appointment to Cancelled tab
- View appointments organized by status tabs

### Review System
- Rate doctors (1-5 stars)
- Write detailed reviews
- View all patient reviews per doctor

## 💻 Technologies Used
- **HTML5** - Structure
- **CSS3** - Custom styling and animations
- **Bootstrap 5** - UI components & responsive grid
- **JavaScript (ES6)** - Dynamic functionality
- **Font Awesome** - Icons

## 📱 Responsive Design
- Fully responsive on desktop, tablet, and mobile
- Bootstrap grid system ensures proper layout
- Collapsible navbar on mobile devices

## 🎮 How to Use

1. **Register** - Fill out the patient registration form
2. **Book** - Browse doctors and click "Book Appointment"
3. **Manage** - View your appointments in the tabs
4. **Complete** - After visit, click "Complete" to move to Completed tab
5. **Review** - Leave ratings and feedback for doctors

## 🛠️ Installation & Setup

### Local Setup
```bash
git clone https://github.com/Manalili-Nics/Hospital-Registration-System.git
cd Hospital-Registration-System
open index.html
