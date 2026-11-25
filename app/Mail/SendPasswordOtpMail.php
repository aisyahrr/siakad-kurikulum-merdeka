<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendPasswordOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;

    /**
     * Create a new message instance.
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kode OTP Reset Password - SIAKAD UNPAM',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: sans-serif; padding: 20px; background-color: #f4f6f9;'>
                    <div style='max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e1e8ed;'>
                        <h2 style='color: #17345b; text-align: center; margin-top: 0;'>SIAKAD UNPAM</h2>
                        <p style='color: #5a6a72;'>Halo,</p>
                        <p style='color: #5a6a72;'>Kami menerima permintaan reset password untuk akun Anda. Gunakan kode OTP di bawah ini untuk memverifikasi permintaan Anda:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <span style='display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #17345b; background: #e9eef3; padding: 12px 24px; border-radius: 12px;'>{$this->otp}</span>
                        </div>
                        <p style='color: #5a6a72; font-size: 13px;'>Kode OTP ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.</p>
                        <hr style='border: none; border-top: 1px solid #eee; margin: 25px 0;' />
                        <p style='color: #8899a6; font-size: 11px; text-align: center;'>Jika Anda tidak meminta reset password, silakan abaikan email ini.</p>
                    </div>
                </div>
            ",
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
