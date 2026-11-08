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
                'email' => 'admin@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Guru Demo',
                'email' => 'guru@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'guru',
            ],
            [
                'name' => 'Wali Kelas Demo',
                'email' => 'walikelas@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'wali-kelas',
            ],
            [
                'name' => 'Siswa Demo',
                'email' => 'siswa@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'siswa',
            ],
            [
                'name' => 'Orang Tua Demo',
                'email' => 'orangtua@siakad.test',
                'password' => Hash::make('password'),
                'role' => 'orangtua',
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