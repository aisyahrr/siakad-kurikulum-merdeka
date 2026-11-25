<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassStudent;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class AcademicMasterSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tahun Akademik
        $activeYear = AcademicYear::firstOrCreate(
            ['name' => '2024/2025', 'semester' => 'Ganjil'],
            ['is_active' => true]
        );

        AcademicYear::firstOrCreate(
            ['name' => '2024/2025', 'semester' => 'Genap'],
            ['is_active' => false]
        );

        // 2. Mata Pelajaran
        $subjects = [
            ['code' => 'MAT-P', 'name' => 'Matematika Peminatan', 'category' => 'Pilihan MIPA', 'hours_per_week' => 4, 'kktp' => 70],
            ['code' => 'MAT-W', 'name' => 'Matematika Wajib', 'category' => 'Wajib', 'hours_per_week' => 3, 'kktp' => 70],
            ['code' => 'FIS-L', 'name' => 'Fisika Lanjutan', 'category' => 'Pilihan MIPA', 'hours_per_week' => 4, 'kktp' => 70],
            ['code' => 'BIO-S', 'name' => 'Biologi Sel', 'category' => 'Pilihan MIPA', 'hours_per_week' => 4, 'kktp' => 70],
            ['code' => 'KIM-O', 'name' => 'Kimia Organik', 'category' => 'Pilihan MIPA', 'hours_per_week' => 4, 'kktp' => 70],
            ['code' => 'BIND-1', 'name' => 'Bahasa Indonesia', 'category' => 'Wajib', 'hours_per_week' => 3, 'kktp' => 70],
            ['code' => 'BING-1', 'name' => 'Bahasa Inggris', 'category' => 'Wajib', 'hours_per_week' => 3, 'kktp' => 70],
            ['code' => 'INF-1', 'name' => 'Informatika', 'category' => 'Muatan Lokal', 'hours_per_week' => 3, 'kktp' => 70],
        ];

        foreach ($subjects as $subj) {
            Subject::firstOrCreate(['code' => $subj['code']], $subj);
        }

        // 3. Guru & Profil Guru
        $guruUser = User::where('email', 'guru@siakad.test')->first();
        if ($guruUser) {
            Teacher::firstOrCreate(
                ['user_id' => $guruUser->id],
                [
                    'nip' => '198507152010011005',
                    'nidn' => '0415078501',
                    'gender' => 'L',
                    'phone' => '081234567890',
                    'main_subject' => 'Matematika Peminatan',
                    'teaching_hours' => 24,
                    'employment_status' => 'PNS',
                ]
            );
        }

        $waliUser = User::where('email', 'walikelas@siakad.test')->first();
        $waliTeacher = null;
        if ($waliUser) {
            $waliTeacher = Teacher::firstOrCreate(
                ['user_id' => $waliUser->id],
                [
                    'nip' => '198203202008012004',
                    'nidn' => '0420038202',
                    'gender' => 'P',
                    'phone' => '081298765432',
                    'main_subject' => 'Fisika Lanjutan',
                    'teaching_hours' => 24,
                    'employment_status' => 'PNS',
                ]
            );
        }

        // 4. Kelas
        $kelas12 = SchoolClass::firstOrCreate(
            ['name' => 'XII MIPA 1'],
            [
                'grade_level' => 'XII',
                'wali_kelas_id' => $waliTeacher?->id,
                'peminatan' => 'Matematika & Sains',
                'capacity' => 36,
            ]
        );

        SchoolClass::firstOrCreate(
            ['name' => 'XI MIPA 2'],
            [
                'grade_level' => 'XI',
                'wali_kelas_id' => null,
                'peminatan' => 'Matematika & Sains',
                'capacity' => 36,
            ]
        );

        SchoolClass::firstOrCreate(
            ['name' => 'X-A'],
            [
                'grade_level' => 'X',
                'wali_kelas_id' => null,
                'peminatan' => 'Umum Terintegrasi',
                'capacity' => 36,
            ]
        );

        // 5. Siswa & Profil Siswa
        $siswaUser = User::where('email', 'siswa@siakad.test')->first();
        $ortuUser = User::where('email', 'orangtua@siakad.test')->first();

        if ($siswaUser) {
            $student = Student::firstOrCreate(
                ['user_id' => $siswaUser->id],
                [
                    'parent_user_id' => $ortuUser?->id,
                    'nisn' => '0046928172',
                    'nis' => '20240123',
                    'gender' => 'P',
                    'birth_place' => 'Jakarta',
                    'birth_date' => '2007-05-14',
                    'phone' => '082111223344',
                    'address' => 'Jl. Merdeka No. 45, Jakarta',
                    'entry_year' => '2024',
                    'status' => 'Aktif',
                ]
            );

            // 6. Hubungkan Siswa ke Rombel Kelas Aktif
            ClassStudent::firstOrCreate(
                [
                    'student_id' => $student->id,
                    'academic_year_id' => $activeYear->id,
                ],
                [
                    'class_id' => $kelas12->id,
                ]
            );

            // 7. Jadwal Mengajar (Schedules)
            $matP = Subject::where('code', 'MAT-P')->first();
            $guruTeacher = Teacher::where('user_id', $guruUser?->id)->first();

            if ($guruTeacher && $matP) {
                \App\Models\Schedule::firstOrCreate(
                    [
                        'teacher_id' => $guruTeacher->id,
                        'school_class_id' => $kelas12->id,
                        'subject_id' => $matP->id,
                        'day' => 'Senin',
                    ],
                    [
                        'academic_year_id' => $activeYear->id,
                        'start_time' => '07:30:00',
                        'end_time' => '09:00:00',
                        'room' => 'Ruang Lab Komputer 2',
                        'topic' => 'Kalkulus Integral & Diferensial Multivariabel',
                        'sks' => 3,
                    ]
                );

                // 8. Pertemuan (Meetings)
                $meeting = \App\Models\Meeting::firstOrCreate(
                    [
                        'teacher_id' => $guruTeacher->id,
                        'school_class_id' => $kelas12->id,
                        'subject_id' => $matP->id,
                        'session_no' => 1,
                    ],
                    [
                        'title' => 'Pengenalan Kalkulus Lanjutan',
                        'summary' => 'Konsep dasar turunan fungsi aljabar dan trigonometri.',
                        'date' => now()->toDateString(),
                        'status' => 'Terbit',
                    ]
                );

                // 9. Sesi Presensi & Presensi Siswa
                $session = \App\Models\AttendanceSession::firstOrCreate(
                    [
                        'teacher_id' => $guruTeacher->id,
                        'school_class_id' => $kelas12->id,
                        'subject_id' => $matP->id,
                        'date' => now()->toDateString(),
                    ],
                    [
                        'meeting_id' => $meeting->id,
                        'title' => 'Pertemuan 1',
                    ]
                );

                \App\Models\Attendance::firstOrCreate(
                    [
                        'attendance_session_id' => $session->id,
                        'student_id' => $student->id,
                    ],
                    [
                        'status' => 'Hadir',
                        'check_in_time' => '07:15:00',
                        'note' => 'Hadir tepat waktu',
                    ]
                );

                // 10. Komponen Asesmen & Nilai Kurikulum Merdeka
                $tp = \App\Models\AssessmentComponent::firstOrCreate(
                    [
                        'school_class_id' => $kelas12->id,
                        'subject_id' => $matP->id,
                        'teacher_id' => $guruTeacher->id,
                        'name' => 'TP 1: Kalkulus Diferensial & Integral',
                    ],
                    [
                        'academic_year_id' => $activeYear->id,
                        'type' => 'Formatif',
                        'weight' => 40,
                        'kktp' => 70.00,
                    ]
                );

                \App\Models\Grade::firstOrCreate(
                    [
                        'school_class_id' => $kelas12->id,
                        'subject_id' => $matP->id,
                        'student_id' => $student->id,
                    ],
                    [
                        'academic_year_id' => $activeYear->id,
                        'teacher_id' => $guruTeacher->id,
                        'assessment_component_id' => $tp->id,
                        'assignment_score' => 92,
                        'midterm_score' => 88,
                        'final_score' => 90,
                        'overall_score' => 90,
                        'letter_grade' => 'A',
                        'competency_achieved' => 'Sangat mahir dalam pemecahan masalah turunan dan aplikasi integral tentu.',
                        'competency_improved' => 'Tingkatkan ketelitian dalam penyelesaian parsial multi variabel.',
                    ]
                );

                // 11. Kuis Online CBT
                $quiz = \App\Models\Quiz::firstOrCreate(
                    [
                        'teacher_id' => $guruTeacher->id,
                        'school_class_id' => $kelas12->id,
                        'subject_id' => $matP->id,
                        'title' => 'Kuis Diferensial & Aturan Rantai',
                    ],
                    [
                        'type' => 'Kuis Formatif',
                        'duration' => 45,
                        'status' => 'Terbit',
                        'start_time' => now(),
                        'end_time' => now()->addDays(3),
                    ]
                );

                $question = \App\Models\QuizQuestion::firstOrCreate(
                    [
                        'quiz_id' => $quiz->id,
                        'question_text' => 'Tentukan turunan pertama f(x) = (3x^2 + 5)^4 terhadap x!',
                    ],
                    [
                        'type' => 'mcq',
                        'points' => 10,
                    ]
                );

                $optCorrect = \App\Models\QuizOption::firstOrCreate(
                    [
                        'quiz_question_id' => $question->id,
                        'option_text' => '24x(3x^2 + 5)^3',
                    ],
                    [
                        'is_correct' => true,
                    ]
                );

                \App\Models\QuizOption::firstOrCreate(
                    [
                        'quiz_question_id' => $question->id,
                        'option_text' => '12x(3x^2 + 5)^3',
                    ],
                    [
                        'is_correct' => false,
                    ]
                );

                $sub = \App\Models\QuizSubmission::firstOrCreate(
                    [
                        'quiz_id' => $quiz->id,
                        'student_id' => $student->id,
                    ],
                    [
                        'mcq_score' => 50,
                        'essay_score' => 40,
                        'total_score' => 45,
                        'is_graded' => true,
                        'feedback' => 'Pemahaman konsep rantai turunan sudah sangat baik.',
                        'submitted_at' => now(),
                    ]
                );

                \App\Models\StudentAnswer::firstOrCreate(
                    [
                        'quiz_submission_id' => $sub->id,
                        'quiz_question_id' => $question->id,
                    ],
                    [
                        'quiz_option_id' => $optCorrect->id,
                        'score' => 10,
                    ]
                );

                // 12. Bimbingan Konseling Wali Kelas
                if ($waliTeacher) {
                    \App\Models\Bimbingan::firstOrCreate(
                        [
                            'teacher_id' => $waliTeacher->id,
                            'student_id' => $student->id,
                            'school_class_id' => $kelas12->id,
                        ],
                        [
                            'category' => 'Akademik',
                            'date' => now()->subDays(5)->toDateString(),
                            'issue' => 'Konsultasi persiapan pemilihan program studi perguruan tinggi (SNBP/SNBT).',
                            'action_plan' => 'Penyusunan portofolio capaian prestasi dan pemetaan nilai rapor semester 1-5.',
                            'parent_contacted' => true,
                            'status' => 'Dalam Pemantauan',
                        ]
                    );

                    // 13. Rapor Semester Digital
                    \App\Models\ReportCard::firstOrCreate(
                        [
                            'academic_year_id' => $activeYear->id,
                            'student_id' => $student->id,
                        ],
                        [
                            'school_class_id' => $kelas12->id,
                            'homeroom_teacher_id' => $waliTeacher->id,
                            'gpa' => 90.0,
                            'rank' => 1,
                            'sick_count' => 0,
                            'permission_count' => 1,
                            'absent_count' => 0,
                            'notes' => 'Pertahankan prestasi akademik yang sangat membanggakan dan terus kembangkan bakat kepemimpinan.',
                            'status' => 'Terbit',
                        ]
                    );

                    // 14. Tagihan SPP Siswa
                    \App\Models\Payment::firstOrCreate(
                        [
                            'student_id' => $student->id,
                            'title' => 'SPP Bulan Oktober 2026',
                        ],
                        [
                            'amount' => 450000,
                            'status' => 'lunas',
                            'due_date' => now()->subDays(10)->toDateString(),
                            'paid_date' => now()->subDays(12)->toDateString(),
                        ]
                    );

                    \App\Models\Payment::firstOrCreate(
                        [
                            'student_id' => $student->id,
                            'title' => 'SPP Bulan November 2026',
                        ],
                        [
                            'amount' => 450000,
                            'status' => 'pending',
                            'due_date' => now()->addDays(15)->toDateString(),
                        ]
                    );

                    // 15. Pengumuman Sekolah & Rombel
                    $adminUser = \App\Models\User::where('role', 'admin')->first();

                    \App\Models\Announcement::firstOrCreate(
                        [
                            'title' => 'Jadwal & Panduan Pelaksanaan Ujian Akhir Semester (SAS)',
                        ],
                        [
                            'author_id' => $adminUser?->id,
                            'target_role' => 'all',
                            'category' => 'Ujian & Penilaian',
                            'content' => 'Diberitahukan kepada seluruh peserta didik dan wali murid bahwa Sumatif Akhir Semester akan dilaksanakan mulai 25 November berbasis sistem CBT.',
                            'reference_code' => 'SURAT EDARAN NO. 412/SMAN1/AKAD/2026',
                            'badge_text' => '! PENTING • SAS',
                            'is_pinned' => true,
                            'is_active' => true,
                            'published_at' => now()->subDays(2),
                        ]
                    );

                    \App\Models\Announcement::firstOrCreate(
                        [
                            'title' => 'Undangan Rapat Evaluasi Capaian Belajar Tengah Semester (STS)',
                        ],
                        [
                            'author_id' => $waliTeacher->user_id,
                            'school_class_id' => $kelas12->id,
                            'target_role' => 'orang-tua',
                            'category' => 'Akademik',
                            'content' => 'Yth. Bapak/Ibu Orang Tua/Wali Murid kelas XII MIPA 1, kami mengundang kehadiran Bapak/Ibu pada rapat koordinasi capaian KKTP.',
                            'reference_code' => 'RAPAT-ORTU-XII-MIPA1',
                            'badge_text' => 'PERTEMUAN ORTU',
                            'is_pinned' => true,
                            'is_active' => true,
                            'published_at' => now()->subDays(1),
                        ]
                    );

                    \App\Models\Announcement::firstOrCreate(
                        [
                            'title' => 'Sosialisasi SNBP & Pendampingan PDSS Siswa Eligible',
                        ],
                        [
                            'author_id' => $waliTeacher->user_id,
                            'school_class_id' => $kelas12->id,
                            'target_role' => 'siswa',
                            'category' => 'Kegiatan Siswa',
                            'content' => 'Siswa kelas XII dengan kriteria eligible diwajibkan mengikuti asistensi pendaftaran portal SNBP.',
                            'reference_code' => 'BK-SNBP-2026',
                            'badge_text' => 'PRESTASI & BEASISWA',
                            'is_pinned' => false,
                            'is_active' => true,
                            'published_at' => now()->subDays(3),
                        ]
                    );
                }
            }
        }

        // 9. Presensi Guru (data demo 5 hari terakhir)
        $teachers = Teacher::all();
        $statuses = ['Hadir', 'Hadir', 'Hadir', 'Izin', 'Sakit'];

        foreach ($teachers as $teacher) {
            foreach (range(4, 0) as $daysAgo) {
                $date = now()->subDays($daysAgo)->toDateString();

                \App\Models\TeacherAttendance::firstOrCreate(
                    ['teacher_id' => $teacher->id, 'date' => $date],
                    ['status' => $statuses[array_rand($statuses)]]
                );
            }
        }
    }
}
