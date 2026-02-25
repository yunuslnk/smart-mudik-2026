import { test, expect } from '@playwright/test';

test('mudik registration flow simulation', async ({ page }) => {
    // 1. Buka halaman formulir pendaftaran
    await page.goto('http://localhost:20261/mudik-form');

    // 2. Verifikasi judul halaman
    await expect(page.locator('h1')).containText('Daftar Mudik 2026');

    // 3. Isi Tanggal (Contoh: 10 April 2026)
    await page.fill('input[type="date"]', '2026-04-10');

    // 4. Pilih Provinsi Asal (Trigger cascading dropdown)
    // Misal: DKI JAKARTA
    await page.selectOption('select:near(:text("Provinsi Asal"))', { label: 'DKI JAKARTA' });

    // 5. Tunggu dropdown Kota Asal terisi (cascading)
    const kotaAsalSelect = page.locator('select:near(:text("Kota/Kabupaten Asal"))');
    await expect(kotaAsalSelect).not.toBeDisabled();
    await kotaAsalSelect.selectOption({ label: 'KOTA ADM. JAKARTA PUSAT' });

    // 6. Pilih Jenis Kendaraan
    await page.selectOption('select:near(:text("Kendaraan"))', { label: 'Mobil' });

    // 7. Simulasikan pengiriman form
    const submitButton = page.locator('button:has-text("Daftar Sekarang")');
    await expect(submitButton).toBeEnabled();

    // Catatan: Dalam tes asli, kita bisa klik button ini.
    // Untuk contoh, kita hanya memverifikasi elemen-elemen siap digunakan.
    console.log('Skenario pengisian form pendaftaran berhasil divalidasi!');
});
