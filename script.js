// script.js

// انتظر حتى يتم تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الصفحة من التحديث

            const username = document.getElementById('username').value;
            const role = document.getElementById('userRole').value;

            if (username.trim() !== "") {
                console.log("جاري الدخول..."); // للتأكد أن الكود يعمل
                
                // حفظ البيانات
                localStorage.setItem('currentUser', username);
                localStorage.setItem('userRole', role);

                // الانتقال لصفحة الداش بورد
                window.location.href = 'dashboard.html'; 
            } else {
                alert("يرجى إدخال اسم المستخدم");
            }
        });
    }

    // كود تشغيل بيانات الداش بورد إذا كنا في صفحة dashboard.html
    if (window.location.pathname.includes('dashboard.html')) {
        const displayUser = document.getElementById('displayUser');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const user = localStorage.getItem('currentUser');

        if (user) {
            if (displayUser) displayUser.innerText = user;
            if (welcomeTitle) welcomeTitle.innerText = `مرحباً بك، ${user}`;
        } else {
            window.location.href = 'index.html'; // ارجع للرئيسية إذا لم يسجل دخول
        }
    }
});

// دالة الانتقال للداش بورد (التي طلبتِها لزر تسجيل الخروج)
function logout() {
    window.location.href = 'dashboard.html';
}

// بيانات وهمية للمساقات (بناءً على طلب البروبوزل)
const allCourses = [
    { id: 'CS101', name: 'مقدمة في علوم الحاسوب', hours: 3 },
    { id: 'MATH201', name: 'رياضيات هندسية', hours: 3 },
    { id: 'ENG101', name: 'لغة إنجليزية 1', hours: 2 },
    { id: 'SWE302', name: 'هندسة البرمجيات', hours: 3 },
    { id: 'DB202', name: 'قواعد بيانات MySQL', hours: 3 }
];

// مصفوفة لتخزين المواد المسجلة (Local Storage)
let registeredCourses = JSON.parse(localStorage.getItem('myRegisteredCourses')) || [];

// دالة لعرض المساقات
function displayCourses() {
    const availableBody = document.getElementById('availableCourses');
    const myCoursesBody = document.getElementById('myCourses');
    
    if (!availableBody) return; // لضمان عدم حدوث خطأ في صفحات أخرى

    availableBody.innerHTML = '';
    myCourses.innerHTML = '';

    allCourses.forEach(course => {
        // فحص إذا كانت المادة مسجلة مسبقاً
        const isRegistered = registeredCourses.some(c => c.id === course.id);
        
        availableBody.innerHTML += `
            <tr>
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.hours}</td>
                <td>
                    <button class="add-btn ${isRegistered ? 'disabled' : ''}" 
                            onclick="addCourse('${course.id}')" 
                            ${isRegistered ? 'disabled' : ''}>
                        ${isRegistered ? 'تمت الإضافة' : 'إضافة +'}
                    </button>
                </td>
            </tr>
        `;
    });

    // عرض المواد المسجلة
    registeredCourses.forEach(course => {
        myCoursesBody.innerHTML += `
            <tr>
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.hours}</td>
                <td>
                    <button class="remove-btn" onclick="removeCourse('${course.id}')">سحب -</button>
                </td>
            </tr>
        `;
    });
}

// دالة إضافة مادة
function addCourse(id) {
    const course = allCourses.find(c => c.id === id);
    if (course && !registeredCourses.some(c => c.id === id)) {
        registeredCourses.push(course);
        localStorage.setItem('myRegisteredCourses', JSON.stringify(registeredCourses));
        displayCourses();
    }
}

// دالة سحب مادة
function removeCourse(id) {
    registeredCourses = registeredCourses.filter(c => c.id !== id);
    localStorage.setItem('myRegisteredCourses', JSON.stringify(registeredCourses));
    displayCourses();
}

// دالة البحث
function searchCourses() {
    const term = document.getElementById('courseSearch').value.toLowerCase();
    const filtered = allCourses.filter(c => 
        c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term)
    );
    
    const availableBody = document.getElementById('availableCourses');
    availableBody.innerHTML = '';
    
    filtered.forEach(course => {
        const isRegistered = registeredCourses.some(c => c.id === course.id);
        availableBody.innerHTML += `
            <tr>
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.hours}</td>
                <td>
                    <button class="add-btn ${isRegistered ? 'disabled' : ''}" onclick="addCourse('${course.id}')" ${isRegistered ? 'disabled' : ''}>
                        ${isRegistered ? 'تمت الإضافة' : 'إضافة +'}
                    </button>
                </td>
            </tr>
        `;
    });
}
// إضافة مواعيد وهمية للمواد الموجودة مسبقاً في script.js
const courseTimes = {
    'CS101': { day: 'الأحد', time: '08:00 - 09:30' },
    'MATH201': { day: 'الاثنين', time: '10:00 - 11:30' },
    'ENG101': { day: 'الأحد', time: '11:00 - 12:30' },
    'SWE302': { day: 'الثلاثاء', time: '08:00 - 09:30' },
    'DB202': { day: 'الأربعاء', time: '12:00 - 01:30' }
};

function generateSchedule() {
    const scheduleBody = document.getElementById('scheduleBody');
    if (!scheduleBody) return;

    // استرجاع المواد التي سجلها الطالب من الـ LocalStorage
    const myRegisteredCourses = JSON.parse(localStorage.getItem('myRegisteredCourses')) || [];
    
    // الأوقات المقترحة للجدول
    const timeSlots = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 01:30'];
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

    scheduleBody.innerHTML = '';

    timeSlots.forEach(slot => {
        let row = `<tr><td>${slot}</td>`;
        
        days.forEach(day => {
            // ابحث إذا كان هناك مادة مسجلة في هذا اليوم وهذا الوقت
            const courseInSlot = myRegisteredCourses.find(c => 
                courseTimes[c.id] && courseTimes[c.id].day === day && courseTimes[c.id].time === slot
            );

            if (courseInSlot) {
                row += `<td><div class="course-slot"><b>${courseInSlot.name}</b><br>${courseInSlot.id}</div></td>`;
            } else {
                row += `<td><span class="empty-slot">-</span></td>`;
            }
        });

        row += `</tr>`;
        scheduleBody.innerHTML += row;
    });
}