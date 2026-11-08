<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => redirect('/admin'),
            'guru' => redirect('/guru'),
            'wali-kelas' => redirect('/wali-kelas'),
            'siswa' => redirect('/siswa'),
            'orang-tua' => redirect('/orangtua'),
            default => redirect('/'),
        };
    }
}
