Tentu. Berikut versi `.md` yang sudah dirapikan dan siap disimpan sebagai file Markdown.

 # Financial Health Indicator — Implementation Specification

 ## Objective

 Tambahkan fitur **Financial Health Indicator** pada Dashboard aplikasi pencatatan keuangan.

 Sistem saat ini sudah memiliki data transaksi dengan minimal field:

 - `type`: `income` atau `expense`
- `amount`
- `date`
- `category`
- `note` jika tersedia

 **Jangan mengubah struktur input transaksi yang sudah ada kecuali benar-benar diperlukan.**

 Tujuan fitur ini adalah memberikan gambaran singkat mengenai kondisi keuangan pengguna berdasarkan perbandingan pemasukan dan pengeluaran menggunakan indikator visual berupa emoji/status.

---

 ## 1\. Perhitungan Utama

 Gunakan **periode yang sedang dipilih pada Dashboard**, misalnya:

 - bulan berjalan
- bulan tertentu
- periode lain yang sudah tersedia di sistem

 Semua perhitungan harus menggunakan transaksi yang termasuk dalam periode tersebut.

 ### Total Income

```
totalIncome = SUM(amount WHERE type = "income")
```

 ### Total Expense

```
totalExpense = SUM(amount WHERE type = "expense")
```

 ### Net Balance

```
netBalance = totalIncome - totalExpense
```

 ### Interpretasi

 | Kondisi | Interpretasi |
| --- | --- |
| `netBalance > 0` | Surplus |
| `netBalance = 0` | Seimbang |
| `netBalance < 0` | Defisit |

---

 ## 2\. Expense Ratio

 Hitung persentase pemasukan yang digunakan untuk pengeluaran:

```
expenseRatio = (totalExpense / totalIncome) * 100
```

 Jika `totalIncome = 0`, jangan melakukan pembagian dengan nol.

 Gunakan:

```
expenseRatio = null
```

 atau tampilkan `-` pada UI.

 ### Contoh

```
Income  = Rp10.000.000
Expense = Rp7.000.000

expenseRatio = (7.000.000 / 10.000.000) * 100
             = 70%
```

---

 ## 3\. Financial Health Status

 Gunakan status berikut.

 ### 🟢 HEALTHY

 Kondisi:

```
totalIncome > 0
AND totalExpense < totalIncome
AND expenseRatio <= 70%
```

 Label:

```
Keuangan Sehat
```

 Artinya pengeluaran masih relatif terkendali dan terdapat surplus.

---

 ### 🟡 ATTENTION

 Kondisi:

```
totalIncome > 0
AND totalExpense < totalIncome
AND expenseRatio > 70%
AND expenseRatio <= 100%
```

 Label:

```
Perlu Perhatian
```

 Artinya masih terdapat surplus, tetapi sebagian besar pemasukan sudah digunakan.

---

 ### 🔴 DEFICIT

 Kondisi:

```
totalIncome > 0
AND totalExpense > totalIncome
```

 Label:

```
Defisit
```

 Artinya pengeluaran lebih besar daripada pemasukan.

---

 ### ⚪ NO\_DATA

 Kondisi:

```
totalIncome = 0
AND totalExpense = 0
```

 Tampilkan:

```
⚪ Belum ada data
```

---

 ### 🟠 NO\_INCOME

 Kondisi:

```
totalIncome = 0
AND totalExpense > 0
```

 Tampilkan:

```
🟠 Tidak ada pemasukan
```

 Jangan menghitung `expenseRatio` pada kondisi ini.

---

 ## 4\. Informasi Numerik

 Jangan hanya bergantung pada emoji.

 Emoji merupakan representasi visual dari status yang dihitung. Dashboard juga harus menampilkan informasi numerik sehingga pengguna dapat memahami alasan status tersebut.

 ### Contoh Healthy

```
🟢 Keuangan Sehat

Pemasukan
Rp10.000.000

Pengeluaran
Rp6.500.000

Sisa
Rp3.500.000

Pengeluaran menggunakan
65% dari pemasukan
```

 ### Contoh Deficit

```
🔴 Defisit

Pemasukan
Rp5.000.000

Pengeluaran
Rp6.500.000

Defisit
-Rp1.500.000

Pengeluaran menggunakan
130% dari pemasukan
```

---

 ## 5\. Komponen Dashboard

 Tambahkan sebuah card/widget baru pada Dashboard dengan nama:

```
Financial Health
```

 atau, jika UI aplikasi menggunakan Bahasa Indonesia:

```
Kesehatan Keuangan
```

 Card minimal harus berisi:

 - emoji/status
- label kondisi
- total pemasukan
- total pengeluaran
- sisa/defisit
- persentase pengeluaran terhadap pemasukan
- progress bar atau visualisasi sederhana

 ### Contoh Layout

```
┌─────────────────────────────────┐
│ Kesehatan Keuangan          🟢 │
│                                 │
│ Keuangan Sehat                  │
│                                 │
│ Pemasukan     Rp10.000.000      │
│ Pengeluaran   Rp 6.500.000      │
│ Sisa          Rp 3.500.000      │
│                                 │
│ Pengeluaran                     │
│ █████████████░░░░░░ 65%         │
│                                 │
│ 65% pemasukan telah digunakan   │
└─────────────────────────────────┘
```

 Card tidak perlu dibuat kompleks. Prioritaskan informasi yang mudah dipindai.

---

 ## 6\. Dynamic Emoji

 Emoji harus berubah otomatis berdasarkan status.

 Gunakan mapping:

 | Status | Emoji |
| --- | --- |
| `HEALTHY` | 🟢 |
| `ATTENTION` | 🟡 |
| `DEFICIT` | 🔴 |
| `NO_DATA` | ⚪ |
| `NO_INCOME` | 🟠 |

Jangan menyimpan emoji sebagai bagian dari data transaksi.

 Emoji harus dihitung secara dinamis berdasarkan hasil perhitungan Financial Health.

---

 ## 7\. Dynamic Color

 Gunakan warna yang konsisten dengan status:

 | Status | Warna |
| --- | --- |
| `HEALTHY` | Green |
| `ATTENTION` | Yellow / Amber |
| `DEFICIT` | Red |
| `NO_DATA` | Gray |
| `NO_INCOME` | Orange |

Gunakan warna yang konsisten dengan design system project dan tidak terlalu mencolok sehingga mengganggu keseluruhan desain Dashboard.

 Jika project sudah memiliki semantic color/token seperti:

```
success
warning
danger
muted
```

 gunakan token tersebut daripada membuat warna baru.

---

 ## 8\. Progress Bar

 Progress bar harus menggunakan `expenseRatio`.

 Contoh:

```
expenseRatio = 65
```

 Maka:

```
progress = 65%
```

 Jika pengeluaran melebihi pemasukan:

```
expenseRatio = 130
```

 Progress bar tidak boleh melebihi 100% secara visual.

 Gunakan:

```
visualProgress = MIN(expenseRatio, 100)
```

 Namun nilai sebenarnya tetap harus ditampilkan:

```
130%
```

 Dengan demikian pengguna mengetahui bahwa pengeluaran telah melebihi pemasukan.

---

 ## 9\. Pembulatan

 Untuk persentase, gunakan maksimal satu angka desimal jika diperlukan.

 Contoh:

```
65.4%
```

 Untuk kondisi sederhana, boleh dibulatkan:

```
65%
```

 Gunakan formatter mata uang yang sudah tersedia di aplikasi.

 **Jangan membuat formatter mata uang baru** jika aplikasi sudah memiliki utility/helper untuk currency formatting.

---

 ## 10\. Periode Data

 Financial Health harus mengikuti filter/periode yang sedang digunakan Dashboard.

 Contoh:

 Jika Dashboard memilih:

```
September 2026
```

 maka seluruh nilai berikut hanya boleh dihitung dari transaksi September 2026:

```
totalIncome
totalExpense
expenseRatio
netBalance
status
```

 Jika pengguna mengganti periode Dashboard, Financial Health harus ikut berubah secara otomatis.

 Pastikan filtering periode menggunakan mekanisme filtering yang sudah digunakan oleh Dashboard agar tidak terjadi perbedaan hasil antara komponen Dashboard lainnya dan Financial Health.

---

 ## 11\. Edge Cases

 ### Tidak ada transaksi

```
income = 0
expense = 0
```

 Hasil:

```
⚪ Belum ada data
```

 Dengan:

```
status = NO_DATA
expenseRatio = null
netBalance = 0
```

---

 ### Hanya ada pemasukan

```
income > 0
expense = 0
```

 Hasil:

```
🟢 Keuangan Sehat
```

 Dengan:

```
expenseRatio = 0%
netBalance = income
```

---

 ### Hanya ada pengeluaran

```
income = 0
expense > 0
```

 Hasil:

```
🟠 Tidak ada pemasukan
```

 Dengan:

```
expenseRatio = null
netBalance = -expense
```

 Jangan menghitung `expenseRatio`.

---

 ### Pengeluaran sama dengan pemasukan

```
income = expense
```

 Hasil:

```
🟡 Perlu Perhatian
```

 Dengan:

```
expenseRatio = 100%
netBalance = 0
```

---

 ### Pengeluaran lebih besar daripada pemasukan

```
expense > income
```

 Hasil:

```
🔴 Defisit
```

 Dengan:

```
netBalance < 0
expenseRatio > 100%
```

---

 ## 12\. Jangan Mengubah Data Lama

 Implementasikan fitur ini sebagai fitur tambahan.

 Jangan:

 - menghapus transaksi
- mengubah nominal transaksi
- mengubah kategori transaksi
- mengubah behavior input transaksi
- membuat duplikasi transaksi
- menyimpan hasil perhitungan sebagai transaksi baru

 Semua nilai Financial Health harus dihitung dari data transaksi yang sudah ada.

 Jika aplikasi menggunakan state management, gunakan selector, computed value, memoization, atau mekanisme sejenis yang sudah digunakan project agar perhitungan tidak dilakukan secara tidak perlu.

---

 ## 13\. Reusable Calculation Function

 Pisahkan perhitungan Financial Health dari UI.

 Buat fungsi/service/helper yang secara konseptual menghasilkan:

```
{
  totalIncome,
  totalExpense,
  netBalance,
  expenseRatio,
  status,
  emoji,
  label
}
```

 Contoh pseudocode:

```
function calculateFinancialHealth(transactions):

    totalIncome = sum(
        transaction.amount
        where transaction.type == "income"
    )

    totalExpense = sum(
        transaction.amount
        where transaction.type == "expense"
    )

    netBalance = totalIncome - totalExpense

    if totalIncome == 0 and totalExpense == 0:
        return {
            totalIncome: 0,
            totalExpense: 0,
            netBalance: 0,
            expenseRatio: null,
            status: "NO_DATA",
            emoji: "⚪",
            label: "Belum ada data"
        }

    if totalIncome == 0 and totalExpense > 0:
        return {
            totalIncome: 0,
            totalExpense,
            netBalance,
            expenseRatio: null,
            status: "NO_INCOME",
            emoji: "🟠",
            label: "Tidak ada pemasukan"
        }

    expenseRatio = (totalExpense / totalIncome) * 100

    if totalExpense > totalIncome:
        status = "DEFICIT"
        emoji = "🔴"
        label = "Defisit"

    else if expenseRatio > 70:
        status = "ATTENTION"
        emoji = "🟡"
        label = "Perlu Perhatian"

    else:
        status = "HEALTHY"
        emoji = "🟢"
        label = "Keuangan Sehat"

    return {
        totalIncome,
        totalExpense,
        netBalance,
        expenseRatio,
        status,
        emoji,
        label
    }
```

 Sesuaikan implementasi dengan:

 - bahasa pemrograman
- framework
- arsitektur
- struktur data
- state management
- utility
- design system

 yang sudah digunakan project.

---

 ## 14\. Testing

 Tambahkan unit test untuk minimal kasus berikut.

 ### Test Case 1 — Healthy 50%

```
income = 10.000.000
expense = 5.000.000
```

 Expected:

```
status = HEALTHY
expenseRatio = 50%
```

---

 ### Test Case 2 — Attention 80%

```
income = 10.000.000
expense = 8.000.000
```

 Expected:

```
status = ATTENTION
expenseRatio = 80%
```

---

 ### Test Case 3 — Attention 100%

```
income = 10.000.000
expense = 10.000.000
```

 Expected:

```
status = ATTENTION
expenseRatio = 100%
netBalance = 0
```

---

 ### Test Case 4 — Deficit 120%

```
income = 10.000.000
expense = 12.000.000
```

 Expected:

```
status = DEFICIT
expenseRatio = 120%
netBalance = -2.000.000
```

---

 ### Test Case 5 — No Data

```
income = 0
expense = 0
```

 Expected:

```
status = NO_DATA
expenseRatio = null
```

---

 ### Test Case 6 — No Income

```
income = 0
expense = 2.000.000
```

 Expected:

```
status = NO_INCOME
expenseRatio = null
netBalance = -2.000.000
```

---

 ### Test Case 7 — No Expense

```
income = 10.000.000
expense = 0
```

 Expected:

```
status = HEALTHY
expenseRatio = 0%
netBalance = 10.000.000
```

---

 ## 15\. UX Requirement

 Card harus sederhana dan dapat dipahami pengguna dalam waktu singkat.

 Prioritaskan informasi dengan urutan:

```
Emoji
→ Status
→ Sisa / Defisit
→ Pemasukan & Pengeluaran
→ Expense Ratio
```

 Tambahkan tooltip atau informasi kecil jika diperlukan:

```
Persentase pengeluaran menunjukkan berapa bagian dari pemasukan yang telah digunakan.
```

 Pastikan informasi penting tetap terlihat tanpa pengguna harus membuka tooltip.

---

 ## 16\. Important Implementation Rule

 Sebelum melakukan perubahan:

 1. Periksa struktur project.
2. Identifikasi model/schema transaksi yang sudah ada.
3. Identifikasi sumber data transaksi.
4. Identifikasi komponen Dashboard.
5. Identifikasi filter/periode Dashboard.
6. Identifikasi utility currency yang sudah tersedia.
7. Identifikasi utility date/filter yang sudah tersedia.
8. Identifikasi state management yang digunakan.
9. Identifikasi design system dan komponen UI yang sudah tersedia.
10. Gunakan komponen, utility, style system, dan state management yang sudah digunakan project.

 ### Dependency

 Jangan membuat dependency baru jika tidak diperlukan.

 ### API / Database

 Jangan mengubah API atau database schema jika fitur dapat dibuat menggunakan data transaksi yang sudah tersedia.

 ### Data

 Jangan membuat mockup atau data dummy untuk implementasi final.

 Gunakan data transaksi aktual dari sistem.

 ### Architecture

 Perhitungan Financial Health harus dipisahkan dari UI melalui function/service/helper yang reusable dan mudah dites.

 ### Performance

 Jika project menggunakan state management, selector, computed value, memoization, atau mekanisme sejenis, manfaatkan mekanisme tersebut agar perhitungan hanya dilakukan ketika data transaksi atau periode yang relevan berubah.

 ### Backward Compatibility

 Jangan mengubah:

 - struktur input transaksi
- behavior input transaksi
- nominal transaksi
- kategori transaksi
- data transaksi lama
- mekanisme penyimpanan transaksi

 kecuali benar-benar diperlukan.

---

 ## 17\. Validation Setelah Implementasi

 Setelah implementasi selesai, jalankan seluruh validation yang tersedia di project, minimal:

```
lint
typecheck
test
build
```

 Jika project tidak menyediakan salah satu command tersebut, gunakan command validation yang setara dan memang tersedia.

 Perbaiki seluruh error yang muncul akibat perubahan ini.

 Pastikan:

 - existing test tetap lulus
- test Financial Health lulus
- typecheck lulus
- lint lulus
- build berhasil
- Dashboard tetap berfungsi
- input transaksi tetap berfungsi
- transaksi lama tetap dapat digunakan
- filter periode tetap berfungsi
- Financial Health berubah ketika periode Dashboard berubah

---

 ## 18\. Acceptance Criteria

 Fitur dianggap selesai apabila seluruh kondisi berikut terpenuhi:

 - [ ] Financial Health card tersedia di Dashboard.
- [ ] Card menggunakan transaksi aktual, bukan data dummy.
- [ ] Card mengikuti periode/filter Dashboard.
- [ ] `totalIncome` dihitung dari transaksi `income`.
- [ ] `totalExpense` dihitung dari transaksi `expense`.
- [ ] `netBalance = totalIncome - totalExpense`.
- [ ] `expenseRatio` dihitung dengan benar.
- [ ] Tidak terjadi division by zero.
- [ ] `NO_DATA` ditampilkan ketika income dan expense sama-sama `0`.
- [ ] `NO_INCOME` ditampilkan ketika income `0` dan expense lebih dari `0`.
- [ ] `HEALTHY` ditampilkan ketika expense ratio `<= 70%` dan terdapat surplus.
- [ ] `ATTENTION` ditampilkan ketika expense ratio `> 70%` sampai `100%`.
- [ ] `DEFICIT` ditampilkan ketika expense lebih besar dari income.
- [ ] Emoji berubah secara dinamis berdasarkan status.
- [ ] Warna berubah secara dinamis berdasarkan status.
- [ ] Progress bar tidak pernah secara visual melebihi `100%`.
- [ ] Nilai expense ratio aktual tetap ditampilkan meskipun melebihi `100%`.
- [ ] Currency menggunakan formatter yang sudah tersedia.
- [ ] Tidak ada perubahan terhadap struktur transaksi lama.
- [ ] Tidak ada transaksi baru yang dibuat untuk menyimpan hasil perhitungan.
- [ ] Calculation logic dapat digunakan secara terpisah dari UI.
- [ ] Unit test untuk seluruh edge case utama tersedia.
- [ ] Lint berhasil.
- [ ] Typecheck berhasil.
- [ ] Test berhasil.
- [ ] Build berhasil.

---

 ## 19\. Expected Calculation Contract

 Hasil akhir dari calculation helper/service minimal mengikuti contract berikut:

```
type FinancialHealthStatus =
  | "HEALTHY"
  | "ATTENTION"
  | "DEFICIT"
  | "NO_DATA"
  | "NO_INCOME";

type FinancialHealth = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  expenseRatio: number | null;
  status: FinancialHealthStatus;
  emoji: string;
  label: string;
};
```

 Contoh hasil:

 ### Healthy

```
{
  "totalIncome": 10000000,
  "totalExpense": 6500000,
  "netBalance": 3500000,
  "expenseRatio": 65,
  "status": "HEALTHY",
  "emoji": "🟢",
  "label": "Keuangan Sehat"
}
```

 ### Attention

```
{
  "totalIncome": 10000000,
  "totalExpense": 8000000,
  "netBalance": 2000000,
  "expenseRatio": 80,
  "status": "ATTENTION",
  "emoji": "🟡",
  "label": "Perlu Perhatian"
}
```

 ### Deficit

```
{
  "totalIncome": 10000000,
  "totalExpense": 12000000,
  "netBalance": -2000000,
  "expenseRatio": 120,
  "status": "DEFICIT",
  "emoji": "🔴",
  "label": "Defisit"
}
```

 ### No Data

```
{
  "totalIncome": 0,
  "totalExpense": 0,
  "netBalance": 0,
  "expenseRatio": null,
  "status": "NO_DATA",
  "emoji": "⚪",
  "label": "Belum ada data"
}
```

 ### No Income

```
{
  "totalIncome": 0,
  "totalExpense": 2000000,
  "netBalance": -2000000,
  "expenseRatio": null,
  "status": "NO_INCOME",
  "emoji": "🟠",
  "label": "Tidak ada pemasukan"
}
```

---

 ## 20\. Final Implementation Principle

 Implementasikan **Financial Health Indicator sebagai fitur tambahan yang membaca dan menghitung data transaksi yang sudah ada**, tanpa mengubah model transaksi, tanpa membuat data duplikat, dan tanpa mengubah behavior existing.

 Gunakan arsitektur, component library, design system, state management, formatter, dan utility yang sudah tersedia di project.

 Hasil akhirnya harus berupa fitur Dashboard yang:

```
Real Data
   ↓
Existing Period Filter
   ↓
Financial Health Calculation
   ↓
Status + Emoji + Color
   ↓
Financial Health Card
```

 Dengan demikian, perubahan periode Dashboard akan otomatis menghasilkan Financial Health yang sesuai dengan transaksi pada periode tersebut.