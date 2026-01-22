<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Portal Tiket Terpadu</h1>
                            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">Universitas Padjadjaran</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">Halo, {{ $name }}! 👋</h2>
                            <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                                Terima kasih telah mendaftar di Portal Tiket Terpadu UNPAD. Gunakan kode verifikasi di bawah ini untuk menyelesaikan pendaftaran Anda:
                            </p>
                            
                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px dashed #3b82f6; border-radius: 12px; padding: 32px;">
                                        <p style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Kode Verifikasi OTP</p>
                                        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; display: inline-block; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            <span style="color: #1e3a8a; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">{{ $otp }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                <tr>
                                    <td>
                                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                                            <strong>⏰ Penting:</strong> Kode ini akan kedaluwarsa dalam <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapapun.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6;">
                                Jika Anda tidak melakukan pendaftaran ini, abaikan email ini.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 13px;">
                                © {{ date('Y') }} Universitas Padjadjaran
                            </p>
                            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                                Portal Tiket Terpadu • Integrated Digital System
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
