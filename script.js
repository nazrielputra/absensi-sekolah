document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('attendance-form');
    const listContainer = document.getElementById('list-container');
    const attendanceStatus = document.getElementById('attendance-status');
    const keteranganGroup = document.getElementById('keterangan-group');
    const keteranganTextarea = document.getElementById('keterangan');
    const currentTimeElement = document.getElementById('current-time');
    const notificationPopup = document.getElementById('notification-popup');
    const summaryContainer = document.getElementById('attendance-summary');

    const updateTime = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        currentTimeElement.textContent = now.toLocaleDateString('id-ID', options);
    };

    setInterval(updateTime, 1000);
    updateTime();

    attendanceStatus.addEventListener('change', () => {
        if (attendanceStatus.value === 'Izin') {
            keteranganGroup.style.display = 'block';
            keteranganTextarea.required = true;
        } else {
            keteranganGroup.style.display = 'none';
            keteranganTextarea.required = false;
        }
    });
    
    const getAttendanceData = () => {
        const data = localStorage.getItem('attendanceData');
        return data ? JSON.parse(data) : [];
    };

    const saveAttendanceData = (data) => {
        localStorage.setItem('attendanceData', JSON.stringify(data));
    };

    const renderAttendanceList = () => {
        const attendanceData = getAttendanceData();
        listContainer.innerHTML = '';
        
        attendanceData.forEach(item => {
            const listItem = document.createElement('li');
            const statusClass = `status-${item.status.toLowerCase()}`;
            const keteranganInfo = item.keterangan ? `<br><small>Keterangan: ${item.keterangan}</small>` : '';
            
            listItem.innerHTML = `
                <span>
                    <strong>${item.name}</strong><br>
                    Kelas ${item.class} - Jurusan ${item.major}<br>
                    <small>Waktu: ${item.timestamp}</small>
                </span>
                <span class="${statusClass}">${item.status} ${keteranganInfo}</span>
            `;
            listContainer.appendChild(listItem);
        });
    };

    // Fungsi baru untuk rekapitulasi absensi
    const renderAttendanceSummary = () => {
        const attendanceData = getAttendanceData();
        const counts = { Hadir: 0, Sakit: 0, Izin: 0, Alpa: 0 };
        
        // Hitung jumlah setiap status
        attendanceData.forEach(item => {
            if (counts.hasOwnProperty(item.status)) {
                counts[item.status]++;
            }
        });
        
        // Buat HTML untuk menampilkan rekapitulasi
        let summaryHTML = '<h4>Rekapitulasi Kehadiran</h4>';
        summaryHTML += `<div class="summary-item"><span class="status-hadir">Hadir:</span> <span>${counts.Hadir}</span></div>`;
        summaryHTML += `<div class="summary-item"><span class="status-sakit">Sakit:</span> <span>${counts.Sakit}</span></div>`;
        summaryHTML += `<div class="summary-item"><span class="status-izin">Izin:</span> <span>${counts.Izin}</span></div>`;
        summaryHTML += `<div class="summary-item"><span class="status-alpa">Alpa:</span> <span>${counts.Alpa}</span></div>`;

        summaryContainer.innerHTML = summaryHTML;
    };


    const showNotification = () => {
        notificationPopup.style.display = 'block';
        setTimeout(() => {
            notificationPopup.style.display = 'none';
        }, 2000);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const studentName = document.getElementById('student-name').value;
        const studentClass = document.getElementById('student-class').value;
        const studentMajor = document.getElementById('student-major').value;
        const attendanceStatusValue = attendanceStatus.value;
        const keteranganValue = keteranganTextarea.value;
        
        if (attendanceStatusValue === 'Izin' && !keteranganValue.trim()) {
            alert('Silakan isi kolom keterangan izin.');
            keteranganTextarea.focus();
            return;
        }

        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        
        const newAttendance = {
            name: studentName,
            class: studentClass,
            major: studentMajor,
            status: attendanceStatusValue,
            keterangan: keteranganValue,
            timestamp: now.toLocaleDateString('id-ID', options)
        };
        
        const attendanceData = getAttendanceData();
        attendanceData.push(newAttendance);
        saveAttendanceData(attendanceData);
        
        renderAttendanceList();
        renderAttendanceSummary(); // Panggil fungsi rekapitulasi
        
        form.reset();
        keteranganGroup.style.display = 'none';
        showNotification();
    });

    // Panggil kedua fungsi saat halaman dimuat
    renderAttendanceList();
    renderAttendanceSummary();
});
