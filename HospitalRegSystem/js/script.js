/* ========================================
   SafeCare Health Hospital - Main JavaScript
   Activity 13: Bootstrap UI + JavaScript Integration
   Author: Nicole N. Manalili
   Date: April 4, 2026
   ======================================== */

// Wait for HTML to fully load before running JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DATA STORAGE ==========
    
    // Array to store registered patients
    let patients = [];
    
    // Array of doctors with their details
    let doctors = [
        { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", experience: "15 years", schedule: "Mon/Wed/Fri 9am-5pm", rating: 4.8, reviews: [] },
        { id: 2, name: "Dr. Michael Chen", specialty: "Neurologist", experience: "12 years", schedule: "Tue/Thu/Sat 10am-6pm", rating: 4.9, reviews: [] },
        { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrician", experience: "10 years", schedule: "Mon-Fri 8am-4pm", rating: 4.7, reviews: [] },
        { id: 4, name: "Dr. James Wilson", specialty: "Orthopedic", experience: "20 years", schedule: "Mon/Wed 9am-7pm", rating: 4.9, reviews: [] },
        { id: 5, name: "Dr. Lisa Patel", specialty: "Dermatologist", experience: "8 years", schedule: "Tue/Thu/Fri 10am-6pm", rating: 4.6, reviews: [] }
    ];
    
    // Array to store all appointments
    let appointments = [];
    
    // Track which patient is currently using the system
    let currentPatientId = null;
    
    // ========== HELPER FUNCTIONS ==========
    
    /**
     * Displays Bootstrap alert messages
     * @param {string} message - The message to display
     * @param {string} type - Alert type: success, danger, warning, info
     */
    function showAlert(message, type) {
        const alertPlaceholder = document.getElementById('alertPlaceholder');
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        alertPlaceholder.innerHTML = '';
        alertPlaceholder.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 4000);
    }
    
    /**
     * Generates star ratings from numerical value
     * @param {number} rating - Rating from 1-5
     * @returns {string} - String of star characters
     */
    function generateStars(rating) {
        let stars = '';
        for(let i = 1; i <= 5; i++) {
            stars += i <= rating ? '★' : '☆';
        }
        return stars;
    }
    
    // ========== DISPLAY DOCTORS ==========
    
    /**
     * Dynamically creates and displays doctor cards
     * This demonstrates DOM manipulation - injecting HTML into an empty container
     */
    function displayDoctors() {
        const container = document.getElementById('doctorsContainer');
        container.innerHTML = '';
        
        doctors.forEach(doctor => {
            // Calculate average rating from reviews
            const avgRating = doctor.reviews.length > 0 ? 
                (doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length).toFixed(1) : doctor.rating;
            
            container.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card doctor-card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${doctor.name}</h5>
                            <p class="text-primary"><strong>${doctor.specialty}</strong></p>
                            <p><i class="fas fa-clock"></i> ${doctor.schedule}</p>
                            <p><i class="fas fa-briefcase"></i> ${doctor.experience}</p>
                            <div class="rating-star">
                                ${generateStars(avgRating)} (${doctor.reviews.length} reviews)
                            </div>
                            ${currentPatientId ? 
                                `<button class="btn btn-primary btn-sm mt-2" onclick="bookAppointment(${doctor.id})">
                                    <i class="fas fa-calendar-plus"></i> Book Appointment
                                </button>` : 
                                `<button class="btn btn-secondary btn-sm mt-2" disabled>Register first to book</button>`
                            }
                            <button class="btn btn-outline-info btn-sm mt-2" data-bs-toggle="collapse" data-bs-target="#reviews${doctor.id}">
                                <i class="fas fa-comments"></i> View Reviews
                            </button>
                            <div class="collapse mt-2" id="reviews${doctor.id}">
                                <div class="card card-body bg-light">
                                    ${doctor.reviews.length > 0 ? 
                                        doctor.reviews.map(r => `<p><strong>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</strong> - ${r.comment}<br><small class="text-muted">- ${r.patientName}</small></p><hr>`).join('') : 
                                        '<em>No reviews yet. Be the first to review!</em>'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // ========== DISPLAY APPOINTMENTS ==========
    
    /**
     * Displays appointments in three tabs: Upcoming, Completed, Cancelled
     */
    function displayAppointments() {
        if(!currentPatientId) return;
        
        const patientAppointments = appointments.filter(a => a.patientId === currentPatientId);
        const upcoming = patientAppointments.filter(a => a.status === 'upcoming');
        const completed = patientAppointments.filter(a => a.status === 'completed');
        const cancelled = patientAppointments.filter(a => a.status === 'cancelled');
        
        // ----- UPCOMING TABLE (with Complete & Cancel buttons) -----
        const upcomingBody = document.getElementById('upcomingAppointments');
        upcomingBody.innerHTML = '';
        if(upcoming.length === 0) {
            upcomingBody.innerHTML = '<tr><td colspan="6" class="text-center">No upcoming appointments. Book one now!</td></tr>';
        } else {
            upcoming.forEach(app => {
                const doctor = doctors.find(d => d.id === app.doctorId);
                upcomingBody.innerHTML += `
                    <tr>
                        <td>${doctor.name}</td>
                        <td>${doctor.specialty}</td>
                        <td>${app.date}</td>
                        <td>${app.time}</td>
                        <td><span class="badge bg-warning">Pending</span></td>
                        <td>
                            <button class="btn btn-success btn-sm me-1" onclick="completeAppointment(${app.id})">
                                <i class="fas fa-check"></i> Complete
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="cancelAppointment(${app.id})">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
        
        // ----- COMPLETED TABLE (with Review button) -----
        const completedBody = document.getElementById('completedAppointments');
        completedBody.innerHTML = '';
        if(completed.length === 0) {
            completedBody.innerHTML = '<tr><td colspan="4" class="text-center">No completed appointments yet</td></tr>';
        } else {
            completed.forEach(app => {
                const doctor = doctors.find(d => d.id === app.doctorId);
                completedBody.innerHTML += `
                    <tr>
                        <td>${doctor.name}</td>
                        <td>${doctor.specialty}</td>
                        <td>${app.date}</td>
                        <td>
                            ${app.reviewed ? 
                                '<span class="badge bg-success"><i class="fas fa-star"></i> Reviewed</span>' : 
                                `<button class="btn btn-primary btn-sm" onclick="openReviewModal(${app.id}, ${doctor.id})">
                                    <i class="fas fa-edit"></i> Write Review
                                </button>`
                            }
                        </td>
                    </tr>
                `;
            });
        }
        
        // ----- CANCELLED TABLE -----
        const cancelledBody = document.getElementById('cancelledAppointments');
        cancelledBody.innerHTML = '';
        if(cancelled.length === 0) {
            cancelledBody.innerHTML = '<tr><td colspan="4" class="text-center">No cancelled appointments</td></tr>';
        } else {
            cancelled.forEach(app => {
                const doctor = doctors.find(d => d.id === app.doctorId);
                cancelledBody.innerHTML += `
                    <tr>
                        <td>${doctor.name}</td>
                        <td>${doctor.specialty}</td>
                        <td>${app.date}</td>
                        <td><span class="badge bg-secondary">Cancelled by patient</span></td>
                    </tr>
                `;
            });
        }
        
        // Update stats card
        document.getElementById('todayAppointments').innerText = upcoming.length;
    }
    
    // ========== APPOINTMENT FUNCTIONS ==========
    
    /**
     * Complete an appointment - moves from Upcoming to Completed tab
     * This is the button we added to meet all requirements
     */
    window.completeAppointment = function(appointmentId) {
        const appointment = appointments.find(a => a.id === appointmentId);
        if(appointment && confirm('Mark this appointment as completed?')) {
            appointment.status = 'completed';
            appointment.reviewed = false;
            displayAppointments();
            showAlert('✓ Appointment marked as completed! You can now leave a review.', 'success');
        }
    };
    
    /**
     * Book a new appointment with a doctor
     */
    window.bookAppointment = function(doctorId) {
        if(!currentPatientId) {
            showAlert('Please register first before booking appointments!', 'warning');
            return;
        }
        
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 3);
        const dateStr = futureDate.toISOString().split('T')[0];
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        
        const newAppointment = {
            id: Date.now(),
            patientId: currentPatientId,
            doctorId: doctorId,
            date: dateStr,
            time: randomTime,
            status: 'upcoming',
            reviewed: false
        };
        appointments.push(newAppointment);
        displayAppointments();
        showAlert(`✅ Appointment booked successfully with ${doctors.find(d => d.id === doctorId).name} on ${dateStr} at ${randomTime}`, 'success');
    };
    
    /**
     * Cancel an appointment - moves from Upcoming to Cancelled tab
     */
    window.cancelAppointment = function(appointmentId) {
        const appointment = appointments.find(a => a.id === appointmentId);
        if(appointment && confirm('Cancel this appointment?')) {
            appointment.status = 'cancelled';
            displayAppointments();
            showAlert('Appointment cancelled', 'info');
        }
    };
    
    /**
     * Open the review modal for a completed appointment
     */
    window.openReviewModal = function(appointmentId, doctorId) {
        document.getElementById('reviewAppointmentId').value = appointmentId;
        document.getElementById('reviewDoctorId').value = doctorId;
        new bootstrap.Modal(document.getElementById('reviewModal')).show();
    };
    
    // ========== REVIEW SUBMISSION ==========
    
    /**
     * Handle review submission - adds rating to doctor's reviews
     */
    document.getElementById('submitReviewBtn').addEventListener('click', function() {
        const appointmentId = parseInt(document.getElementById('reviewAppointmentId').value);
        const doctorId = parseInt(document.getElementById('reviewDoctorId').value);
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewText').value;
        
        const appointment = appointments.find(a => a.id === appointmentId);
        if(appointment) {
            appointment.reviewed = true;
            const patient = patients.find(p => p.id === currentPatientId);
            const doctor = doctors.find(d => d.id === doctorId);
            doctor.reviews.push({
                patientName: patient.fullName,
                rating: rating,
                comment: comment || 'No comment provided'
            });
            displayDoctors();
            displayAppointments();
            showAlert('Thank you for your review!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
            document.getElementById('reviewText').value = '';
        }
    });
    
    // ========== PATIENT REGISTRATION FORM ==========
    
    /**
     * Handle patient registration form submission
     * Includes validation for email and Philippine mobile number
     */
    document.getElementById('patientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const dob = document.getElementById('dob').value;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Philippine mobile number validation
        const mobileRegex = /^(\+63|0)[0-9]{10}$/;
        
        if(!fullName) {
            showAlert('Please enter your full name!', 'danger');
            return;
        }
        if(!emailRegex.test(email)) {
            showAlert('Please enter a valid email address!', 'danger');
            return;
        }
        if(!mobileRegex.test(mobile)) {
            showAlert('Please enter a valid mobile number! (e.g., 09123456789 or +639123456789)', 'danger');
            return;
        }
        if(!dob) {
            showAlert('Please enter your date of birth!', 'danger');
            return;
        }
        
        const newPatient = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            mobile: mobile,
            dob: dob,
            bloodType: document.getElementById('bloodType').value,
            emergencyContact: document.getElementById('emergencyContact').value
        };
        
        patients.push(newPatient);
        currentPatientId = newPatient.id;
        document.getElementById('patientCount').innerText = patients.length;
        
        showAlert(`🎉 Welcome ${fullName}! You can now book appointments with our doctors.`, 'success');
        displayDoctors();
        displayAppointments();
        document.getElementById('patientForm').reset();
    });
    
    // ========== LIVE ALERT BUTTON ==========
    
    /**
     * Creates a dynamic alert when Live Update button is clicked
     * Demonstrates creating Bootstrap components with JavaScript
     */
    document.getElementById('liveAlertBtn').addEventListener('click', function() {
        const cardBody = document.querySelector('.card-body');
        const existingAlert = document.querySelector('.live-alert');
        if(existingAlert) existingAlert.remove();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info alert-dismissible fade show mt-2 live-alert';
        alertDiv.innerHTML = `🕒 Live Update: Current wait time is 15 minutes. ${patients.length} patients registered today.`;
        cardBody.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    });
    
    // ========== MODAL EVENT LISTENER (REQUIRED BY RUBRIC) ==========
    
    /**
     * Bootstrap Modal Event Listener - show.bs.modal
     * This is a KEY REQUIREMENT for Activity 13
     * The event fires right before the modal opens
     */
    const modal = document.getElementById('infoModal');
    modal.addEventListener('show.bs.modal', function() {
        console.log('Guidelines modal opened at ' + new Date().toLocaleTimeString());
        const modalTitle = modal.querySelector('.modal-header h5');
        modalTitle.innerHTML = '⚠️ Updated Guidelines - ' + new Date().toLocaleDateString();
    });
    
    // Modal confirm button handler
    document.getElementById('modalConfirmBtn').addEventListener('click', function() {
        bootstrap.Modal.getInstance(modal).hide();
        showAlert('Thank you for following hospital guidelines!', 'info');
    });
    
    // ========== INITIALIZE APPLICATION ==========
    displayDoctors();
    displayAppointments();
});