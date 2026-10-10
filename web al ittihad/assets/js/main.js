/**
 * MA AL-ITTIHAD TAWANGSARI - JAVASCRIPT CONTROLLER
 * NPSN: 20584241 | Trowulan - Mojokerto
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollTop();
  initPpdbForm();
  initFaqAccordion();
  initTabFilters();
  initPrintHandler();
});

/* ==========================================================================
   1. NAVIGATION & HEADER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenuDrawer');
  const mobileBackdrop = document.getElementById('mobileMenuBackdrop');
  const mobileClose = document.getElementById('mobileMenuClose');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled', 'shadow-md');
      } else {
        header.classList.remove('scrolled', 'shadow-md');
      }
    }
  });

  // Mobile drawer toggle
  function openMobileMenu() {
    if (mobileMenu && mobileBackdrop) {
      mobileMenu.classList.remove('translate-x-full');
      mobileBackdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileMenu && mobileBackdrop) {
      mobileMenu.classList.add('translate-x-full');
      mobileBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  // Close when clicking mobile nav links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* ==========================================================================
   2. STATS COUNTER ANIMATION
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 1800; // ms
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target.toLocaleString('id-ID');
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toLocaleString('id-ID');
          }
        }, stepTime);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   3. SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
      scrollBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      scrollBtn.classList.add('opacity-0', 'pointer-events-none');
      scrollBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   4. PPDB ONLINE HANDLER & WHATSAPP GENERATOR
   ========================================================================== */
const OFFICIAL_WA_NUMBER = '6285706666126'; // Admin MA Al-Ittihad Tawangsari

function initPpdbForm() {
  const form = document.getElementById('ppdbOnlineForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const nama = form.querySelector('[name="nama_lengkap"]')?.value.trim();
    const nisn = form.querySelector('[name="nisn"]')?.value.trim() || '-';
    const nik = form.querySelector('[name="nik"]')?.value.trim() || '-';
    const jenisKelamin = form.querySelector('[name="jenis_kelamin"]')?.value || 'Laki-laki';
    const asalSekolah = form.querySelector('[name="asal_sekolah"]')?.value.trim();
    const jalur = form.querySelector('[name="jalur_pendaftaran"]')?.value || 'Reguler';
    const peminatan = form.querySelector('[name="peminatan"]')?.value || 'MIPA';
    const sistemTinggal = form.querySelector('[name="sistem_tinggal"]')?.value || 'Boarding (Asrama Pesantren)';
    const namaWali = form.querySelector('[name="nama_wali"]')?.value.trim();
    const noHp = form.querySelector('[name="no_hp"]')?.value.trim();
    const alamat = form.querySelector('[name="alamat"]')?.value.trim();

    if (!nama || !asalSekolah || !namaWali || !noHp) {
      alert('Mohon lengkapi seluruh kolom formulir wajib yang bertanda bintang (*).');
      return;
    }

    // Generate Registration Code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PPDB-ALIT-${new Date().getFullYear()}-${randomSuffix}`;
    const tanggalDaftar = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const regData = {
      regCode,
      tanggalDaftar,
      nama,
      nisn,
      nik,
      jenisKelamin,
      asalSekolah,
      jalur,
      peminatan,
      sistemTinggal,
      namaWali,
      noHp,
      alamat
    };

    // Save to localStorage
    try {
      localStorage.setItem('ma_alittihad_last_reg', JSON.stringify(regData));
      const history = JSON.parse(localStorage.getItem('ma_alittihad_all_reg') || '[]');
      history.push(regData);
      localStorage.setItem('ma_alittihad_all_reg', JSON.stringify(history));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Construct WhatsApp message
    const waText = 
`*FORMULIR PENDAFTARAN PPDB ONLINE*
*MA AL-ITTIHAD TAWANGSARI - TROWULAN*
NPSN: 20584241 | Kab. Mojokerto

---------------------------------------
📋 *NO. REGISTRASI:* ${regCode}
📅 *Tanggal:* ${tanggalDaftar}
---------------------------------------

👤 *DATA CALON SISWA:*
• Nama Lengkap : *${nama}*
• Jenis Kelamin: ${jenisKelamin}
• NISN         : ${nisn}
• NIK          : ${nik}
• Asal Sekolah : ${asalSekolah}

🎓 *PILIHAN PENDIDIKAN:*
• Jalur Daftar : *${jalur}*
• Peminatan    : *${peminatan}*
• Status Hunian: *${sistemTinggal}*

👨‍👩‍👧 *DATA WALI & KONTAK:*
• Nama Wali    : ${namaWali}
• WhatsApp/HP  : ${noHp}
• Alamat       : ${alamat}

---------------------------------------
_Assalamu'alaikum Wr. Wb. Panitia PPDB MA Al-Ittihad Tawangsari, saya telah mengisi formulir online dan ingin mengonfirmasi pendaftaran saya. Mohon informasi tahapan selanjutnya. Terima kasih._`;

    const encodedWaUrl = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Show confirmation modal
    showRegistrationModal(regData, encodedWaUrl);
  });
}

function showRegistrationModal(data, waUrl) {
  let modal = document.getElementById('ppdbSuccessModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ppdbSuccessModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
      <div class="text-center">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
          <i class="fa-solid fa-circle-check text-3xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-1">Pendaftaran Berhasil Dicatat!</h3>
        <p class="text-sm text-gray-600 mb-4">Terima kasih telah memilih MA Al-Ittihad Tawangsari.</p>
        
        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 text-left text-sm">
          <div class="flex justify-between items-center mb-2 pb-2 border-b border-emerald-200/60">
            <span class="text-emerald-800 font-medium">No. Registrasi:</span>
            <span class="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">${data.regCode}</span>
          </div>
          <div class="grid grid-cols-3 gap-1 text-gray-700">
            <span class="text-gray-500">Nama:</span>
            <span class="col-span-2 font-semibold text-gray-900">${data.nama}</span>
            <span class="text-gray-500">Asal:</span>
            <span class="col-span-2">${data.asalSekolah}</span>
            <span class="text-gray-500">Jalur:</span>
            <span class="col-span-2 text-emerald-700 font-semibold">${data.jalur} (${data.peminatan})</span>
            <span class="text-gray-500">Status:</span>
            <span class="col-span-2">${data.sistemTinggal}</span>
          </div>
        </div>

        <p class="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 mb-5">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>
          <strong>Langkah Terakhir:</strong> Silakan klik tombol hijau di bawah untuk mengirim data langsung ke WhatsApp Panitia PPDB agar nomor pendaftaran resmi diaktifkan.
        </p>

        <div class="flex flex-col gap-2.5">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
             class="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5">
            <i class="fa-brands fa-whatsapp text-xl"></i>
            Kirim Konfirmasi ke WhatsApp Admin
          </a>
          
          <button type="button" onclick="window.printRegistrationCard()" 
                  class="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-6 rounded-xl border border-slate-300 transition">
            <i class="fa-solid fa-print"></i>
            Cetak Bukti Pendaftaran Sementara
          </button>

          <button type="button" onclick="document.getElementById('ppdbSuccessModal').remove()" 
                  class="text-xs text-gray-500 hover:text-gray-700 mt-2 underline">
            Tutup Jendela Ini
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

/* ==========================================================================
   5. PRINT SLIP FUNCTION
   ========================================================================== */
function initPrintHandler() {
  window.printRegistrationCard = function() {
    const dataStr = localStorage.getItem('ma_alittihad_last_reg');
    if (!dataStr) {
      alert('Belum ada data pendaftaran yang tersimpan.');
      return;
    }
    const data = JSON.parse(dataStr);

    let printContainer = document.getElementById('printRegistrationSlip');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'printRegistrationSlip';
      document.body.appendChild(printContainer);
    }

    printContainer.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 24px; border: 2px solid #064e3b; border-radius: 8px; max-width: 650px; margin: 0 auto;">
        <div style="display: flex; align-items: center; border-bottom: 2px solid #064e3b; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="assets/images/logo.svg" alt="Logo MA Al-Ittihad" style="width: 70px; height: 70px; margin-right: 16px;" />
          <div>
            <h2 style="margin: 0; color: #064e3b; font-size: 18px; text-transform: uppercase; font-weight: bold;">MADRASAH ALIYAH AL-ITTIHAD TAWANGSARI</h2>
            <p style="margin: 2px 0; font-size: 12px; color: #334155;">YPIS & Pondok Pesantren Al-Ittihad • Terakreditasi B • NPSN: 20584241</p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">Jl. Raden Wijaya No. 105, Tawangsari, Trowulan, Kab. Mojokerto • Telp/WA: 0857-0666-6126</p>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="margin: 0; font-size: 16px; text-decoration: underline; color: #0f172a;">BUKTI PENDAFTARAN PPDB ONLINE</h3>
          <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">Tahun Ajaran 2026/2027</p>
        </div>

        <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; width: 35%; font-weight: bold;">Nomor Registrasi</td>
            <td style="padding: 6px 0;">: <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #047857;">${data.regCode}</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Tanggal Pendaftaran</td>
            <td style="padding: 6px 0;">: ${data.tanggalDaftar}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Nama Lengkap Siswa</td>
            <td style="padding: 6px 0; text-transform: uppercase; font-weight: bold;">: ${data.nama}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Jenis Kelamin</td>
            <td style="padding: 6px 0;">: ${data.jenisKelamin}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">NISN / NIK</td>
            <td style="padding: 6px 0;">: ${data.nisn} / ${data.nik}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Asal Sekolah (MTs/SMP)</td>
            <td style="padding: 6px 0;">: ${data.asalSekolah}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Peminatan / Jurusan</td>
            <td style="padding: 6px 0;">: ${data.peminatan}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Jalur Pendaftaran</td>
            <td style="padding: 6px 0;">: ${data.jalur}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Status Asrama</td>
            <td style="padding: 6px 0;">: ${data.sistemTinggal}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Nama Orang Tua / Wali</td>
            <td style="padding: 6px 0;">: ${data.namaWali}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">No. WhatsApp / HP</td>
            <td style="padding: 6px 0;">: ${data.noHp}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;">Alamat Tempat Tinggal</td>
            <td style="padding: 6px 0;">: ${data.alamat}</td>
          </tr>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 12px; text-align: center;">
          <div style="width: 45%;">
            <p style="margin-bottom: 50px;">Calon Siswa / Wali,</p>
            <p style="font-weight: bold; text-decoration: underline;">( ${data.nama} )</p>
          </div>
          <div style="width: 45%;">
            <p style="margin-bottom: 50px;">Panitia PPDB MA Al-Ittihad,</p>
            <p style="font-weight: bold; text-decoration: underline;">( Panitia Penerimaan )</p>
          </div>
        </div>

        <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed #94a3b8; font-size: 11px; color: #64748b; text-align: center;">
          Harap membawa lembar bukti pendaftaran ini beserta fotokopi KK, Akta Kelahiran, dan Ijazah/SKL saat verifikasi berkas di Kantor Sekretariat MA Al-Ittihad Tawangsari.
        </div>
      </div>
    `;

    window.print();
  };
}

/* ==========================================================================
   6. FAQ ACCORDION INTERACTION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-toggle');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const content = item.nextElementSibling;
      const icon = item.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   7. TAB FILTERS (Ekstrakurikuler, Jurusan, dll)
   ========================================================================== */
function initTabFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update button state
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-emerald-700', 'text-white');
        b.classList.add('bg-white', 'text-gray-700');
      });
      btn.classList.add('active', 'bg-emerald-700', 'text-white');
      btn.classList.remove('bg-white', 'text-gray-700');

      // Filter items
      filterItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.classList.remove('hidden');
          item.classList.add('animate-fade-in');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   8. QUICK WA POPUP TEMPLATE
   ========================================================================== */
window.openQuickWa = function(topic = 'tanya') {
  let message = `Assalamu'alaikum Wr. Wb. Halo Admin MA Al-Ittihad Tawangsari, saya ingin bertanya tentang: `;
  switch(topic) {
    case 'ppdb':
      message += `Pendaftaran Peserta Didik Baru (PPDB) TA 2026/2027 dan rincian persyaratannya.`;
      break;
    case 'tahfidz':
      message += `Program Unggulan Tahfidzul Qur'an dan kurikulum pesantren Ponpes Al-Ittihad.`;
      break;
    case 'asrama':
      message += `Ketentuan santri asrama/boarding putra dan putri di Pondok Pesantren Al-Ittihad.`;
      break;
    case 'lokasi':
      message += `Petunjuk arah dan lokasi madrasah di Jl. Raden Wijaya No. 105 Tawangsari Trowulan.`;
      break;
    default:
      message += `Informasi umum seputar MA Al-Ittihad Tawangsari.`;
  }
  const url = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
