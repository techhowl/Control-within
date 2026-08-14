# New Doctors — August Additions

> **Total records**: 60  |  **States**: 9  |  **Cities**: 12
> Source: `Connexi _ New Doctor Database (Aug).xlsx` (sheet 1, rows 2–61)
> Action: add these doctors to the active database.

---

## Data Completeness

| Field | Populated |
|-------|----------:|
| `sdpid` | 60 / 60 |
| `state` | 60 / 60 |
| `city` | 60 / 60 |
| `name` | 60 / 60 |
| `pincode` | 60 / 60 |
| `phone` | 60 / 60 |
| `address` | 60 / 60 |

Every record is complete across all seven fields — including a valid telephone number, which is exactly what the exclusion list is missing.

---

## Net Effect on the Database

| Metric | Count |
|--------|------:|
| Doctors in current DB | 177 |
| Records in this file | 60 |
| → genuinely new SDPIDs | 56 |
| → SDPIDs already in the DB (updates, not additions) | 4 |
| Exclusions to remove | 74 |
| → of which are re-instated by this file | 4 |
| **Projected DB size** | **163** |

Arithmetic: 177 current − 70 net removals + 56 new = **163**.

---

## ⚠️ Overlap with the Exclusion List

4 SDPIDs in this file also appear in `Connexi _ Excluded Database (1).xlsx`. They already exist in the current database. The only consistent reading is that these are **updates that restore a missing telephone number**, so they should be updated in place rather than removed and re-added.

| SDPID | Doctor | City | Change |
|------:|--------|------|--------|
| 7823 | Dr. Tripura Sundari | Hyderabad | phone — → `7661066656` |
| 8671 | Dr. Manjula S Patil | Bengaluru | phone — → `8095462677` |
| 8754 | Dr. Swetha Madhuri | Bengaluru | phone — → `9885976066`; pincode 560068 → 560114; address revised |
| 8758 | Dr. Pradeepa | Bengaluru | phone — → `7639371904` |

---

## Breakdown by State

| State | New Doctors |
|-------|------------:|
| Karnataka | 14 |
| Jharkhand | 10 |
| Punjab | 9 |
| Odisha | 8 |
| NCR | 7 |
| WestUP | 7 |
| CH | 2 |
| Telangana | 2 |
| Haryana | 1 |
| **Total** | **60** |

## Breakdown by City

| City | New Doctors |
|------|------------:|
| Bengaluru | 14 |
| Ranchi | 10 |
| Bhubaneswar | 8 |
| Agra | 7 |
| Ludhiana | 7 |
| Ghaziabad | 4 |
| NOIDA | 3 |
| Hyderabad | 2 |
| Zirakpur | 2 |
| Ambala | 1 |
| Mohali | 1 |
| Panchkula | 1 |

---

## Full Addition List

Grouped by state, then city. `⚠️` marks an SDPID that already exists in the current database (update, not insert).

### CH — 2 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 1 | 8266 | Dr. Nisha Goyal | Mohali | 140603 | `8146756833` | Parvarish Hospital, SCO 5, Adjoining MRF, Old Ambala Road, Dhakoli, Zirakpur, Punjab 140603 |
| 2 | 9221 | Dr. Simran Dhawan | Panchkula | 134109 | `9316135516` | Dhawan Hospital, Plot No.1, Sec.7 Panchkula |

### Haryana — 1 record

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 3 | 8595 | Dr. Satwant Kaur | Ambala | 136135 | `01744 332000` | Adesh Medical College, NH - 1, Near Ambala Cantt., Vill. Mohri, Tehsil. Shahbad (M), District Kurukshetra, Haryana - 136135 |

### Jharkhand — 10 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 4 | 3068 | Dr. Anubha Vidyarthi | Ranchi | 834001 | `7004035243` | Amrita Nursing home; Kali Mandir Rd, Burdwan Compound, l, P&T Colony, Lalpur, Ranchi, Jharkhand 834001 |
| 5 | 8911 | Dr. Basudha Jhaa | Ranchi | 834002 | `6513511433` | Trust Multispeciality Hospital, Harmu Bazar, Imli Chowk, Ranchi-834002, Jharkhand |
| 6 | 3054 | Dr. Beauty Banerjee | Ranchi | 834001 | `9431382368` | KC Roy Memorial hospital; 50, Circular Rd, Ajit Enclave, P&T Colony, Lalpur, Ranchi, Jharkhand 834001; 1St Floor, Bimala Nand Tower, Purulia Rd, beside St. Xavier's College, Ranchi, Jharkhand 834001 |
| 7 | 8650 | Dr. Rajni Kumari | Ranchi | 834001 | `9470931116` | Nakshtara Women & Fertility Clinic, Opposite Prabhat Khabar Gate, H B Road, Kokar, Ranchi-834001 |
| 8 | 8976 | Dr. Rekharani Singh | Ranchi | 834002 | `7488336541` | Vinayak Clinic & Maternity Centre |
| 9 | 6846 | Dr. Sunita Mishra | Ranchi | 834002 | `8092459852` | Astha hospital, Harmu Housing Colony, Nizam Nagar, Hindpiri, Ranchi, Jharkhand |
| 10 | 6858 | Dr. Swati Chaitnya | Ranchi | 834009 | `9065763300` | Suyog Hospital; Near Baragain Talab, Baragain Road, Lem Bargain, Bariyatu, Ranchi, Jharkhand 834009 |
| 11 | 3051 | Dr. Swatilal | Ranchi | 834001 | `9014388549` | KRISHNA NURSING HOME, 53, Circular Road, Lalpur, Ranchi - 834001 |
| 12 | 3070 | Dr. Tripti Prakesh | Ranchi | 834009 | `9123254570` | Prema Hospital; Near Phed Chowk, Booty More Road, Bariatu, Ranchi-834009, Jharkhand |
| 13 | 3053 | Dr. Vandita | Ranchi | 834001 | `7488336541` | VINAYAK HOSPITAL; Road No 1, Kokar, Ranchi - 834001 (Near Imam Kothi H B Road, Santamen Nagar) |

### Karnataka — 14 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 14 | 7905 | Dr. Chaitra Poornima Ramakrishna | Bengaluru | 560079 | `9482089357` | Sucheta Clinic; No175, 8th Main Cross Road, Rajarajeshwari Nagar, BEML Layout, Basaweshwarnagar, Bangalore- 560079 |
| 15 | 6635 | Dr. Chaitra S. Niranthara | Bengaluru | 560013 | `9620039891` | CANS Hospital, #2, GBM & SON’s Layout Byrappa Garden, Near Gangamma Circle, Jalahalli, Ramachandrapura, Bangalore |
| 16 | 8838 | Dr. Chetna N. Aradhya | Bengaluru | 560072 | `9448658577` | Akshama Women's Clinic |
| 17 | 8221 | Dr. Leela Shankar | Bengaluru | 560010 | `9448472854` | Abhaya Clinic Rajajinagar |
| 18 | 8671 ⚠️ | Dr. Manjula S Patil | Bengaluru | 560077 | `8095462677` | Ovum Hospitals, Hegde Nagar, 2nd Floor, No 33/4, Hennur Main Road, Kothanur, Bengaluru, Karnataka 560077 |
| 19 | 9185 | Dr. Manjula Thunti | Bengaluru | 560064 | `9591622912` | Kishore Multispeciality Hospital; MIG, 790, 8th 'A' Cross, Lions Seva Bhavana Road, Sector A, Yelahanka Satellite Town, Yelahanka New Town, Bengaluru, Karnataka 560064 |
| 20 | 8598 | Dr. P Chetana Arvind | Bengaluru | 560079 | `9448369732` | Vatsalya Women and Child Clinic, No 565, Beside Post office, 3rd Stage, 4th Block, Shakthi Ganapathi Nagar, Basaweshwarnagar, Bangalore - 560079 |
| 21 | 8758 ⚠️ | Dr. Pradeepa | Bengaluru | 560011 | `7639371904` | Sri Krishna Sevashrama Hospital |
| 22 | 9187 | Dr. Rizwana Ahamadh | Bengaluru | 560005 | `9844588672` | Aspire Hospital, N0, 92, Mosque Rd, Fraser Town, Bengaluru, Karnataka 560005 |
| 23 | 5095 | Dr. Shilpa Venkatesh | Bengaluru | 560102 | `9845726200` | Swasthya Women Care Clinic |
| 24 | 6620 | Dr. Sowmya H.M. | Bengaluru | 560076 | `9731056979` | Dr Sowmya’s Women Care Clinic, No 1051,Doctors floor,2nd floor,Above ICICI Bank, Bannerghatta Main Rd, Vijaya Bank Layout, Bengaluru, Karnataka 560076 |
| 25 | 8754 ⚠️ | Dr. Swetha Madhuri | Bengaluru | 560114 | `9885976066` | Swetha's Gynecare; Ground floor, NO:4, Basaveshwara 2nd Main Rd, near Canara bank, Akshayanagara West, Akshaya Gardens, Akshayanagar, Bengaluru, Karnataka 560114 |
| 26 | 9194 | Dr. Varalakshmi K | Bengaluru | 560097 | `9845720110` | Aveksha Hospitals, Varadarajaswamy Layout, no 122, M S Palya Road, Sigapura , Bangalore-560097 |
| 27 | 8799 | Dr. Viqat Ara | Bengaluru | 560005 | `8197040850` | AL-Sahha Gynaec Centre; Frazer Town |

### NCR — 7 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 28 | 8883 | Dr. Apeksha Mittal | Ghaziabad | 201201 | `7417481924` | Dhanwantari Ortho & Women Centre, Metro Pillar 1207, Opp, near Raj Chopla, Bank Colony, Modinagar, Uttar Pradesh 201201 |
| 29 | 8882 | Dr. Neelu Khaneja | Ghaziabad | 201001 | `9910726232` | Khaneja Nursing Home; III C / 89, opp. Eectricity office, Block C, Nehru Nagar III, Nehru Nagar, Ghaziabad, Uttar Pradesh 201001 |
| 30 | 6748 | Dr. Richa Gupta | Ghaziabad | 201009 | `9212762953` | Krishna Family Hospital and Infertility centre; G 7, Sector-11, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009 |
| 31 | 9037 | DR. SATAKSHI GARG | Ghaziabad | 201204 | `7056239959` | Vidhyawati Dubey Hospital; Number 2, Bank Colony, Adarsh Nagar-, Modinagar-201204, Uttar Pradesh |
| 32 | 4373 | Dr. Aditi Ghai | NOIDA | 201318 | `7503261399` | Ghai clinic; mahagun mywoods first floor gaur city 2 greater noida 201318 |
| 33 | 8909 | Dr. Rashmi Dey | NOIDA | 201318 | `9625453806` | Rashmi Dey clinic; Shop No 145, First Floor, Mahagun Mywoods, Mart, Ghaziabad, Gaur City 2, Greater Noida-201318, Uttar Pradesh |
| 34 | 7683 | Dr. Swetha Mathur | NOIDA | 201304 | `8130308551` | Srijan Clinic, C Block, Kothi Number 85 (Basement)., Landmark: On CloudNine Hospital Road, Noida |

### Odisha — 8 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 35 | 8604 | Dr. Anamika Mishra | Bhubaneswar | 751009 | `9154940954` | Ankura Hospital; Near Sisubhavan, Unit 1, Bapuji Nagar, Bhubaneswar, Odisha 751009 |
| 36 | 6556 | Dr. Asima Patra | Bhubaneswar | 751014 | `6291389320` | Ananya Nurshing home, Badagada |
| 37 | 6573 | Dr. Jayprakas Pani | Bhubaneswar | 751022 | `8599009063` | Apollo Hospital, Sainik School Road, Bhubaneswar |
| 38 | 3004 | Dr. Mamata Nayak | Bhubaneswar | 753014 | `9776907669` | Sanjukta Clinic, Cda Sector 7, Cuttack - 753014 |
| 39 | 8606 | Dr. Mohini | Bhubaneswar | 751030 | `9154940954` | KIIMS,BBSR, Ankura Hospital, Bhubaneswar, Odisha 751030 |
| 40 | 6593 | Dr. Sanjusmita Tripathy | Bhubaneswar | 751007 | `9437101440` | Deepak Nurshing home, Saheed nagar |
| 41 | 8649 | Dr. Sujata Swain | Bhubaneswar | 751016 | `9078913717` | Srujana Clinic. M-68,Samanta Vihar, Nalco Square,BBSR |
| 42 | 6562 | Dr. Swapnita Hota | Bhubaneswar | 751016 | `8763240943` | Blue wheel Hospital+Sadhna Clinic; INFRONT OF, Plot NO 159, Gujarat Bhawan Ln, Prachi Enclave, District Center, Chandrasekharpur, Bhubaneswar, Odisha 751016 |

### Punjab — 9 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 43 | 8820 | Dr. Amrita Kaur | Ludhiana | 141008 | `9646800209` | New Life Hospital; Shingar Cinema Rd, Fatehganj, Ludhiana, Punjab 141008 |
| 44 | 8829 | Dr. Anurag Jain | Ludhiana | 141001 | `9855503722` | Dr. Zoni Jain Hospital; 133, New Lajpat Nagar, Opp. Hotel Imperial, Pakhowal Road, Ludhiana, Punjab 141001 |
| 45 | 8211 | Dr. Ginny Gupta | Ludhiana | 141001 | `9815195017` | Health Line hospital; 191, Near new DMCH, Block B, Udham Singh Nagar,Tagore Nagar Ludhiana |
| 46 | 8212 | Dr. Gitanjali Kaur | Ludhiana | 141002 | `9815195017` | Pal Hospital, 517, R , Pritam Nagar, Model Town, Ludhiana |
| 47 | 9108 | Dr. Manjot Walia Kakkar | Ludhiana | 142029 | `8837806208` | Kakkar Multispeciality Hospital and Surgical centre; near Indian Oil Petrol Pump, Mansuran, Punjab 142029 |
| 48 | 9208 | Dr. Patwantinder Kaur | Ludhiana | 142026 | `9814367581` | Kalsi Maternity Home; Near Rani Jhansi Chowk, Jagraon, District Ludhiana, Jagraon, Punjab, India, 142026 |
| 49 | 8822 | Dr. Supreeta Kaur | Ludhiana | 141003 | `9888552504` | Raj Hospital; Urban Estate Phase 1, Jamalpur, Ludhiana, Punjab 141003 |
| 50 | 8256 | Dr. Liza Gupta | Zirakpur | 140603 | `9888866665` | VCare Hospital, Plot No – 4, Raksha Enclave, VIP Road, Zirakpur, Punjab – 140603 |
| 51 | 8059 | Dr. Monica Juneja | Zirakpur | 140603 | `7837134233` | Santosh Hospital, SCF-101A, Patiala Rd, Balaji Enclave, Zirakpur, Punjab 140603 |

### Telangana — 2 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 52 | 8774 | Dr. Raghu Tejasvi | Hyderabad | 500081 | `9654125430` | Sravani Hospital, Plot no 91, Cyber hills 94, Guttala_Begumpet, Sarojini Naidu Nagar, Madhapur, Hyderabad, Telangana 500081 |
| 53 | 7823 ⚠️ | Dr. Tripura Sundari | Hyderabad | 500082 | `7661066656` | KIMS Hospital, Door No. 1-8-31/1, Block 1, 2, 3, Opposite Sai Baba Temple, Krishna Nagar Colony, Main Road, Minister Road, Punjagutta-500082 (Opposite Sai Baba Temple, Krishna Nagar Colony) |

### WestUP — 7 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 54 | 8078 | Dr. Bhavna Singh | Agra | 282009 | `7037670224` | Chaudhry Hospital, Chaudhary Charan Singh Hospital, NH21, Jaipur Road, Agra, Uttar Pradesh 282009 |
| 55 | 9105 | Dr. Mandeep Kaur | Agra | 282007 | `9536214465` | Get Well Hospital |
| 56 | 8117 | Dr. Manpreet Sharma | Agra | 282007 | `6366530173` | Rainbow Hospital, Rainbow Hospital, National Highway 2, Bain Bazar, Near Guru Ka Tal, Sikandra, Agra, Uttar Pradesh |
| 57 | 8075 | Dr. Nidhi Dixit | Agra | 282001 | `7505697390` | Dixit Hospital and maternity home; prem nagar, 31/167, ukharra road, Tourist Complex Area, Near Man Singh Palace, Impeypura, Tajganj, Agra, Uttar Pradesh 282001 |
| 58 | 8130 | Dr. Ranjana Gupta | Agra | 282002 | `5624092392` | Sikandara Hospital, Near Bhagwan Talkies, Bye Pass Road, Agra |
| 59 | 8074 | Dr. Renu Sharma | Agra | 282007 | `+91 84451 83677` | Bindra Devi Nursing Home , Bindra Devi Nursing And Maternity Home, Sikandra-Bodla Rd, Sector 1, Bodla, Lohamandi, Agra, Uttar Pradesh 282007 |
| 60 | 8118 | Dr. Shemi Bansal | Agra | 282007 | `9618430699` | Rainbow Hospital, Ujala Cygnus Rainbow Hospital, Sikandra, Agra, Uttar Pradesh 282007 |

---

## SDPIDs — Plain List

All records in this file:

```
3004, 3051, 3053, 3054, 3068, 3070, 4373, 5095, 6556, 6562, 6573, 6593, 6620, 6635, 6748, 6846, 6858, 7683, 7823, 7905, 8059, 8074, 8075, 8078, 8117, 8118, 8130, 8211, 8212, 8221, 8256, 8266, 8595, 8598, 8604, 8606, 8649, 8650, 8671, 8754, 8758, 8774, 8799, 8820, 8822, 8829, 8838, 8882, 8883, 8909, 8911, 8976, 9037, 9105, 9108, 9185, 9187, 9194, 9208, 9221
```

Genuinely new SDPIDs only (safe to INSERT):

```
3004, 3051, 3053, 3054, 3068, 3070, 4373, 5095, 6556, 6562, 6573, 6593, 6620, 6635, 6748, 6846, 6858, 7683, 7905, 8059, 8074, 8075, 8078, 8117, 8118, 8130, 8211, 8212, 8221, 8256, 8266, 8595, 8598, 8604, 8606, 8649, 8650, 8774, 8799, 8820, 8822, 8829, 8838, 8882, 8883, 8909, 8911, 8976, 9037, 9105, 9108, 9185, 9187, 9194, 9208, 9221
```

Existing SDPIDs (apply as UPDATE):

```
7823, 8671, 8754, 8758
```

---

## Source Notes

- Columns A–G: `sdpid`, `State`, `City`, `SDP_name`, `Pincode`, `Telephone`, `address`. Columns H onward are empty. Schema is identical to the exclusion file.
- 60 contiguous data rows (2–61); no blank rows, no duplicate SDPIDs, no missing values.
- `sdpid` and `Pincode` were stored as floats (`3004.0`) and are normalised to integers.
- Telephone numbers are wrapped in backticks to preserve leading digits and prevent numeric coercion.
- ✅ **Applied.** All 60 records were geocoded at pincode-polygon precision and merged into `Doctors_Geocoded.md` (now 163 doctors), then built into `src/data/doctors.json` via `node scripts/build-doctors.mjs`. `src/data/pincodes.json` was rebuilt too, since Ranchi and Hyderabad were absent from the old radius table.
