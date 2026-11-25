<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrator',
                'username' => 'admin',
                'email' => 'admin@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'identifier' => 'NIP. 198001012000031001',
                'is_active' => true,
            ],
            [
                'name' => 'Guru Demo',
                'username' => 'guru',
                'email' => 'guru@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'identifier' => 'NIP. 198507152010011005',
                'is_active' => true,
            ],
            [
                'name' => 'Wali Kelas Demo',
                'username' => 'walikelas',
                'email' => 'walikelas@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'wali-kelas',
                'identifier' => 'NIP. 198203202008012004',
                'is_active' => true,
            ],
            [
                'name' => 'Siswa Demo',
                'username' => 'siswa',
                'email' => 'siswa@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'identifier' => 'NISN. 0046928172',
                'is_active' => true,
            ],
            [
                'name' => 'Orang Tua Demo',
                'username' => 'orangtua',
                'email' => 'orangtua@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'orang-tua',
                'identifier' => 'Wali dari Siswa Demo',
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}