# API Documentation - TOEFL Verification Backend

API dokumentasi untuk sistem verifikasi sertifikat TOEFL berbasis blockchain.

**Base URL**: `/api`

---

## Table of Contents

- [Authentication](#authentication)
- [Services](#services)
- [Schedules](#schedules)
- [Enrollments](#enrollments)
- [Users](#users)
- [Verifications](#verifications)
- [Utilities](#utilities)

---

## Authentication

### Register User

Mendaftarkan user baru ke sistem.

| Attribute    | Value                     |
| ------------ | ------------------------- |
| **Endpoint** | `POST /api/auth/register` |
| **Auth**     | No                        |

**Request Body:**

```json
{
  "address": "string (required) - Alamat wallet",
  "username": "string (required, min 3 chars) - Username",
  "email": "string (required, valid email) - Email",
  "roleToken": "string (optional) - Token untuk role khusus"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* user data */
  },
  "message": "registrasi berhasil"
}
```

---

### Login User

Login ke sistem menggunakan wallet address.

| Attribute    | Value                  |
| ------------ | ---------------------- |
| **Endpoint** | `POST /api/auth/login` |
| **Auth**     | No                     |

**Request Body:**

```json
{
  "address": "string (required) - Alamat wallet"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* user data with token */
  },
  "message": "login berhasil"
}
```

---

### Get Profile

Mendapatkan profil user yang sedang login.

| Attribute    | Value                   |
| ------------ | ----------------------- |
| **Endpoint** | `GET /api/auth/profile` |
| **Auth**     | Yes (User)              |

**Response:**

```json
{
  "status": true,
  "data": {
    /* user profile */
  },
  "message": "profile berhasil ditemukan"
}
```

---

## Services

### Get All Services

Mendapatkan daftar semua layanan tes.

| Attribute    | Value               |
| ------------ | ------------------- |
| **Endpoint** | `GET /api/services` |
| **Auth**     | No                  |

**Query Parameters:**

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `page`    | number | No       | Halaman data            |
| `limit`   | number | No       | Jumlah data per halaman |

**Response:**

```json
{
  "status": true,
  "data": [
    {
      "name": "string",
      "description": "string",
      "price": "number",
      "notes": "string | null"
    }
  ],
  "message": "berhasil mendapatkan daftar layanan"
}
```

---

### Create Service

Membuat layanan tes baru.

| Attribute    | Value                |
| ------------ | -------------------- |
| **Endpoint** | `POST /api/services` |
| **Auth**     | Yes (Admin)          |

**Request Body:**

```json
{
  "name": "string (required) - Nama layanan",
  "description": "string (required) - Deskripsi layanan",
  "price": "number (required, min 0) - Harga layanan",
  "notes": "string (optional) - Catatan tambahan"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* created service */
  },
  "message": "layanan berhasil dibuat"
}
```

---

### Update Service

Memperbarui layanan yang sudah ada.

| Attribute    | Value                            |
| ------------ | -------------------------------- |
| **Endpoint** | `PATCH /api/services/:serviceId` |
| **Auth**     | Yes (Admin)                      |

**Path Parameters:**

| Parameter   | Type   | Description |
| ----------- | ------ | ----------- |
| `serviceId` | string | ID layanan  |

**Request Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "notes": "string (optional)"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* updated service */
  },
  "message": "layanan berhasil diperbarui"
}
```

---

### Delete Service

Menghapus layanan.

| Attribute    | Value                             |
| ------------ | --------------------------------- |
| **Endpoint** | `DELETE /api/services/:serviceId` |
| **Auth**     | No                                |

**Path Parameters:**

| Parameter   | Type   | Description |
| ----------- | ------ | ----------- |
| `serviceId` | string | ID layanan  |

**Response:**

```json
{
  "status": true,
  "data": {
    /* deleted service */
  },
  "message": "layanan berhasil dihapus"
}
```

---

## Schedules

### Get All Schedules (Public)

Mendapatkan jadwal tes yang tersedia untuk publik.

| Attribute    | Value                |
| ------------ | -------------------- |
| **Endpoint** | `GET /api/schedules` |
| **Auth**     | No                   |

**Query Parameters:**

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `page`    | number | No       | Halaman data            |
| `limit`   | number | No       | Jumlah data per halaman |

**Response:**

```json
{
  "status": true,
  "data": [
    {
      "scheduleId": "string",
      "serviceId": "string",
      "serviceName": "string",
      "scheduleDate": "date",
      "startTime": "date",
      "endTime": "date",
      "status": "string",
      "capacity": "number",
      "quota": "number",
      "registrants": "number"
    }
  ],
  "pagination": {
    "current": "number",
    "total": "number",
    "totalPages": "number"
  },
  "message": "jadwal berhasil ditemukan"
}
```

---

### Get All Schedules (Admin)

Mendapatkan semua jadwal tes untuk admin (termasuk yang terhapus).

| Attribute    | Value                      |
| ------------ | -------------------------- |
| **Endpoint** | `GET /api/schedules/admin` |
| **Auth**     | Yes (Admin)                |

**Query Parameters:**

| Parameter        | Type    | Required | Description                   |
| ---------------- | ------- | -------- | ----------------------------- |
| `page`           | number  | No       | Halaman data                  |
| `limit`          | number  | No       | Jumlah data per halaman       |
| `includeDeleted` | boolean | No       | Tampilkan jadwal yang dihapus |

**Response:**

```json
{
  "status": true,
  "data": [
    /* schedules array */
  ],
  "pagination": {
    /* pagination info */
  },
  "message": "jadwal berhasil ditemukan"
}
```

---

### Create Schedule

Membuat jadwal tes baru.

| Attribute    | Value                 |
| ------------ | --------------------- |
| **Endpoint** | `POST /api/schedules` |
| **Auth**     | Yes (Admin)           |

**Request Body:**

```json
{
  "scheduleDate": "string (required) - Tanggal tes",
  "startTime": "string (required) - Waktu mulai",
  "endTime": "string (required) - Waktu selesai",
  "capacity": "number (optional) - Kapasitas peserta"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* created schedule */
  },
  "message": "jadwal berhasil dibuat"
}
```

---

### Update Schedule

Memperbarui jadwal tes.

| Attribute    | Value                                     |
| ------------ | ----------------------------------------- |
| **Endpoint** | `PATCH /api/schedules/:scheduleId/update` |
| **Auth**     | Yes (Admin)                               |

**Path Parameters:**

| Parameter    | Type   | Description |
| ------------ | ------ | ----------- |
| `scheduleId` | string | ID jadwal   |

**Request Body:**

```json
{
  "scheduleDate": "string (optional)",
  "startTime": "string (optional)",
  "endTime": "string (optional)",
  "capacity": "number (optional)"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* updated schedule */
  },
  "message": "jadwal berhasil diperbarui"
}
```

---

### Delete Schedule

Menghapus jadwal tes (soft delete).

| Attribute    | Value                                     |
| ------------ | ----------------------------------------- |
| **Endpoint** | `PATCH /api/schedules/:scheduleId/delete` |
| **Auth**     | Yes (Admin)                               |

**Path Parameters:**

| Parameter    | Type   | Description |
| ------------ | ------ | ----------- |
| `scheduleId` | string | ID jadwal   |

**Response:**

```json
{
  "status": true,
  "data": {
    /* deleted schedule */
  },
  "message": "jadwal berhasil dihapus"
}
```

---

## Enrollments

### Register to Schedule

Peserta mendaftar ke jadwal tes tertentu.

| Attribute    | Value                               |
| ------------ | ----------------------------------- |
| **Endpoint** | `POST /api/enrollments/:scheduleId` |
| **Auth**     | Yes (Peserta)                       |

**Path Parameters:**

| Parameter    | Type   | Description            |
| ------------ | ------ | ---------------------- |
| `scheduleId` | string | ID jadwal yang dipilih |

**Request Body (multipart/form-data):**

| Field         | Type   | Required | Description                                 |
| ------------- | ------ | -------- | ------------------------------------------- |
| `file`        | file   | Yes      | Bukti pembayaran (JPG, PNG, WebP, max 10MB) |
| `paymentDate` | date   | Yes      | Tanggal pembayaran                          |
| `fullName`    | string | Yes      | Nama lengkap peserta                        |
| `birthDate`   | date   | Yes      | Tanggal lahir                               |
| `gender`      | string | Yes      | Jenis kelamin                               |
| `email`       | string | Yes      | Email peserta                               |
| `phoneNumber` | number | Yes      | Nomor telepon                               |
| `nim`         | string | Yes      | Nomor Induk Mahasiswa                       |
| `faculty`     | string | Yes      | Fakultas                                    |
| `major`       | string | Yes      | Jurusan                                     |

**Response:**

```json
{
  "status": true,
  "data": {
    /* enrollment data */
  },
  "message": "pendaftaran berhasil"
}
```

---

### Get All Enrollments

Mendapatkan semua pendaftaran (admin only).

| Attribute    | Value                  |
| ------------ | ---------------------- |
| **Endpoint** | `GET /api/enrollments` |
| **Auth**     | Yes (Admin)            |

**Query Parameters:**

| Parameter   | Type   | Required | Description                |
| ----------- | ------ | -------- | -------------------------- |
| `page`      | number | No       | Halaman data               |
| `limit`     | number | No       | Jumlah data per halaman    |
| `status`    | string | No       | Filter berdasarkan status  |
| `serviceId` | string | No       | Filter berdasarkan layanan |

**Response:**

```json
{
  "status": true,
  "data": [
    /* enrollments array */
  ],
  "pagination": {
    "current": "number",
    "total": "number",
    "totalPages": "number"
  },
  "message": "data berhasil diambil"
}
```

---

### Get Schedule Participants

Mendapatkan daftar peserta untuk jadwal tertentu.

| Attribute    | Value                              |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /api/enrollments/:scheduleId` |
| **Auth**     | Yes (Admin)                        |

**Path Parameters:**

| Parameter    | Type   | Description |
| ------------ | ------ | ----------- |
| `scheduleId` | string | ID jadwal   |

**Query Parameters:**

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| `page`    | number | No       | Halaman data            |
| `limit`   | number | No       | Jumlah data per halaman |

**Response:**

```json
{
  "status": true,
  "data": [
    /* participants array */
  ],
  "pagination": {
    /* pagination info */
  },
  "message": "data berhasil diambil"
}
```

---

### Approval Enrollment

Admin melakukan approval/rejection pendaftaran peserta.

| Attribute    | Value                                       |
| ------------ | ------------------------------------------- |
| **Endpoint** | `PATCH /api/enrollments/:enrollId/approval` |
| **Auth**     | Yes (Admin)                                 |

**Path Parameters:**

| Parameter  | Type   | Description    |
| ---------- | ------ | -------------- |
| `enrollId` | string | ID pendaftaran |

**Request Body:**

```json
{
  "status": "string (required) - 'APPROVED' atau 'REJECTED'"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* updated enrollment */
  },
  "message": "dynamic message based on action"
}
```

---

### Submit Score

Admin menginput nilai tes peserta.

| Attribute    | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| **Endpoint** | `PATCH /api/enrollments/:enrollId/:participantId/submit-score` |
| **Auth**     | Yes (Admin)                                                    |

**Path Parameters:**

| Parameter       | Type   | Description    |
| --------------- | ------ | -------------- |
| `enrollId`      | string | ID pendaftaran |
| `participantId` | string | ID peserta     |

**Request Body:**

```json
{
  "listening": "number (required) - Nilai listening",
  "reading": "number (required) - Nilai reading",
  "structure": "number (required) - Nilai structure"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    "cid": "string - Content ID dari IPFS",
    "hash": "string - Hash sertifikat"
  },
  "message": "berhasil mendapatkan cid dan hash"
}
```

---

### Blockchain Success

Konfirmasi bahwa transaksi blockchain berhasil.

| Attribute    | Value                                                                |
| ------------ | -------------------------------------------------------------------- |
| **Endpoint** | `PATCH /api/enrollments/:enrollId/:participantId/blockchain-success` |
| **Auth**     | Yes (Admin)                                                          |

**Path Parameters:**

| Parameter       | Type   | Description    |
| --------------- | ------ | -------------- |
| `enrollId`      | string | ID pendaftaran |
| `participantId` | string | ID peserta     |

**Request Body:**

```json
{
  "hash": "string (required) - Transaction hash dari blockchain"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* updated data */
  },
  "message": "berhasil mendapatkan cid dan hash"
}
```

---

## Users

### Get User Activity

Mendapatkan aktivitas/riwayat pendaftaran user.

| Attribute    | Value                     |
| ------------ | ------------------------- |
| **Endpoint** | `GET /api/users/activity` |
| **Auth**     | Yes (Peserta)             |

**Response:**

```json
{
  "status": true,
  "data": [
    /* activity/enrollment history */
  ],
  "message": "berhasil mendapatkan aktivitas"
}
```

---

## Verifications

### Verify Certificate

Memverifikasi keaslian sertifikat menggunakan CID.

| Attribute    | Value                    |
| ------------ | ------------------------ |
| **Endpoint** | `GET /api/verifications` |
| **Auth**     | No                       |

**Request Body:**

```json
{
  "cid": "string (required) - Content ID sertifikat"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    /* certificate data */
  },
  "message": "berhasil mendapatkan data"
}
```

---

## Utilities

### Bit Difference Rate (Avalanche Effect)

Menghitung perbedaan bit antara dua hash (avalanche effect testing).

| Attribute    | Value          |
| ------------ | -------------- |
| **Endpoint** | `GET /api/bdr` |
| **Auth**     | No             |

**Request Body:**

```json
{
  "h0": "string (required) - Hash pertama",
  "h1": "string (required) - Hash kedua"
}
```

**Response:**

```json
{
  "diffBits": "number - Jumlah bit yang berbeda",
  "totalBits": "number - Total bit yang dibandingkan",
  "percentage": "number - Persentase perbedaan",
  "fixPercentage": "string - Persentase dengan format fixed"
}
```

---

## Response Format

### Success Response

```json
{
  "status": true,
  "data": {
    /* response data */
  },
  "message": "string"
}
```

### Pagination Response

```json
{
  "status": true,
  "data": [
    /* array of data */
  ],
  "pagination": {
    "current": "number",
    "total": "number",
    "totalPages": "number"
  },
  "message": "string"
}
```

### Error Response

```json
{
  "status": false,
  "message": "error message",
  "error": {
    /* error details */
  }
}
```

---

## Authentication

API ini menggunakan JWT token untuk autentikasi. Sertakan token di header:

```
Authorization: Bearer <token>
```

## Roles

| Role      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `ADMIN`   | Administrator sistem, dapat mengelola jadwal, approval, dan input nilai |
| `PESERTA` | Peserta tes, dapat mendaftar ke jadwal dan melihat aktivitas            |

---

_Dokumentasi ini dibuat secara otomatis dari kode sumber API._
