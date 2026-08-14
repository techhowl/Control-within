# Excluded Doctors — Removal List

> **Total exclusions**: 74  |  **States**: 9  |  **Cities**: 12
> Source: `Connexi _ Excluded Database (1).xlsx` (sheet 1, rows 2–75)
> Action: remove these SDPIDs from the active doctor database.

---

## Impact on the Current Database

| Metric | Count |
|--------|------:|
| Doctors in current DB (`Doctors_Geocoded.md`) | 177 |
| Exclusions listed here | 74 |
| Exclusions matched in current DB | 74 |
| Exclusions **not found** in current DB | 0 |
| Remaining after removal | 103 |

Every one of the 74 excluded SDPIDs resolves to a record in the current database, so the removal is unambiguous — no orphan IDs.

---

## Exclusion Reason (Inferred)

The source file carries no explicit reason column. The data itself points to one:

| Data gap | Records | Share |
|----------|--------:|------:|
| Telephone missing (stored as `0`) | 73 | 99% |
| Pincode missing | 19 | 26% |
| Address missing | 18 | 24% |

**73 of 74** records have no usable telephone number. The single exception is SDPID 8577 (Dr. Geeta), which carries `080-89898989` — a placeholder pattern — against the address *"FREE LANCE CONSULTANT"*.

> ⚠️ **This is an inference from the data, not a stated rule.** Confirm the exclusion criterion with the data owner before treating it as policy.

---

## ⚠️ Conflicts — Also Present in the August New-Doctor List

4 SDPIDs appear in **both** this exclusion list and `Connexi _ New Doctor Database (Aug).xlsx`. In every case the new file supplies the telephone number this file lacks — these look like **re-instatements with corrected data**, not deletions.

| SDPID | Doctor | City | Phone (excluded) | Phone (new) | Other changes |
|------:|--------|------|------------------|-------------|---------------|
| 7823 | Dr. Tripura Sundari | Hyderabad | — | `7661066656` | none |
| 8671 | Dr. Manjula S Patil | Bengaluru | — | `8095462677` | none |
| 8754 | Dr. Swetha Madhuri | Bengaluru | — | `9885976066` | pincode 560068 → 560114; address revised |
| 8758 | Dr. Pradeepa | Bengaluru | — | `7639371904` | none |

**Recommended handling:** do *not* delete these four. Update the existing records in place with the August values. Applying this file blindly would drop four doctors that the August file is trying to keep.

✅ **Applied.** All four are present in the final database carrying their August values (phone, and for 8754 the revised pincode and address).

---

## Breakdown by State

| State | Exclusions |
|-------|-----------:|
| NCR | 32 |
| WestUP | 17 |
| Karnataka | 9 |
| Telangana | 5 |
| Odisha | 4 |
| Punjab | 3 |
| CH | 2 |
| DL | 1 |
| Jharkhand | 1 |
| **Total** | **74** |

## Breakdown by City

| City | Exclusions |
|------|-----------:|
| Agra | 17 |
| Ghaziabad | 17 |
| Bengaluru | 9 |
| Faridabad | 8 |
| NOIDA | 7 |
| Hyderabad | 5 |
| Bhubaneswar | 4 |
| Ludhiana | 3 |
| Chandigarh | 1 |
| Delhi | 1 |
| Mohali | 1 |
| Ranchi | 1 |

---

## Full Exclusion List

Grouped by state, then city. `⚠️` marks a record that also appears in the August new-doctor list (see Conflicts above).

### CH — 2 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 1 | 8220 | Dr. Sheetal Jindal | Chandigarh | 160020 | — | Jindal IVF , 3050, Dakshin Marg, Behind shri Guru Ravidas Bhawan, Sec. 20 D, Chandigarh |
| 2 | 8283 | Dr. Jaslin Mavi | Mohali | 140101 | — | Mavi Hospital, 149, Near Police station, Chandigarh road, Morinda, Punjab |

### DL — 1 record

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 3 | 6740 | Dr. Neera Agrawal | Delhi | 110092 | — | Max Super Speciality Hospital108 A, Indraprasth Extension, Landmark: Opposite Sanchar Apartments, Delhi 110092 |

### Jharkhand — 1 record

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 4 | 8775 | Dr. Sumedha Gargy | Ranchi | 834001 | — | Amrita Nursing Home & Research Centre |

### Karnataka — 9 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 5 | 7821 | Dr. Aparna Nair | Bengaluru | 560066 | — | Vydehi Institute of Medical Sciences & Research Centre,,  #82, Nallurahalli, Whitefield, Bangalore – 560 066 |
| 6 | 8755 | Dr. Arpitha Seth | Bengaluru | 560003 | — | Indira Manipal Center No.243, Sampige Road, Malleswaram-560003 |
| 7 | 8658 | Dr. Aruna Muralidhar | Bengaluru | 560011 | — | Cloudnine Hospital - Jayanagar \| Best Maternity & Pregnancy Centre, 1st Floor, 1533, 9th Main Rd, Bairasandra Extension, Jaya Nagar 1st Block, Jayanagar 3rd Block, Jayanagar, Bengaluru, Karnataka 560011 |
| 8 | 8577 | Dr. Geeta | Bengaluru | 560028 | 080-89898989 | FREE LANCE CONSULTANT, Bengaluru, Karnataka, 560028 |
| 9 | 8671 ⚠️ | Dr. Manjula S Patil | Bengaluru | 560077 | — | Ovum Hospitals, Hegde Nagar, 2nd Floor, No 33/4, Hennur Main Road, Kothanur, Bengaluru, Karnataka 560077 |
| 10 | 8758 ⚠️ | Dr. Pradeepa | Bengaluru | 560011 | — | Sri Krishna Sevashrama Hospital |
| 11 | 6634 | Dr. S Uma Maheshwari | Bengaluru | — | — | — |
| 12 | 8226 | Dr. Sripada Vinekar | Bengaluru | 560055 | — | Cloudnine Hospital Malleshwaram |
| 13 | 8754 ⚠️ | Dr. Swetha Madhuri | Bengaluru | 560068 | — | Swetha's Gynecare, Ground floor, NO:4, Basaveshwara 2nd Main Rd, near Canara bank, Akshayanagara West, Akshaya Gardens, Akshayanagar, Bengaluru, Karnataka 560068 |

### NCR — 32 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 14 | 7993 | Dr. Anita Kant | Faridabad | 121001 | — | Asian Institute of Medical SciencesBadkal Flyover Road, Faridabad City, Landmark: Near Hotel Express Sarovar Portico & Park Plaza, Faridabad |
| 15 | 8027 | Dr. Deepti Sharma | Faridabad | 121002 | — | Amrita Hospital Mata Amritanandamayi Marg, Sector 88, Faridabad, Haryana |
| 16 | 8028 | Dr. Gargi Agrawal | Faridabad | 121002 | — | Amrita Hospital Mata Amritanandamayi Marg, Sector 88, Faridabad, Haryana |
| 17 | 8031 | Dr. Namrta Seth | Faridabad | 121002 | — | Amrita Hospital Mata Amritanandamayi Marg, Sector 88, Faridabad, Haryana |
| 18 | 8007 | Dr. Niti Kautish | Faridabad | 121001 | — | Fortis Escorts HospitalNeelam Bata Road, AC Nagar, New Industrial Township, Faridabad |
| 19 | 8013 | Dr. Ravinder Kaur Khurana | Faridabad | 121002 | — | Metro Heart Institute with Multispeciality/Pushpawanti Health Care ClinicSector 16 A, Faridabad (Delhi - NCR) - 121002, India/Shop Number 2, Lower Ground Floor, Tigaon Road, Landmark: Near Sai Dham Mandir, Faridabad |
| 20 | 8016 | Dr. Sandhya Nanda | Faridabad | 121007 | — | Nanda Nursing Home12, Landmark: Near Arya Samaj Mandir, Sector - 15, Faridabad, Haryana - 121007, India |
| 21 | 8038 | Dr. Sangeeta Chopra | Faridabad | 121002 | — | Chopra Nursing Home, 5l/145, Near Mother Dairy, Faridabad |
| 22 | 8301 | Dr. Anjana Sabharwal | Ghaziabad | 201014 | — | Prime Hospital, VPU 20, Ground Floor, Shipra Krishna Vista Plaza, Dr Sushila Naiyar Marg, Ahinsa Khand 1, Indirapuram, Ghaziabad, Uttar Pradesh 201014 |
| 23 | 8299 | Dr. Archana Singh | Ghaziabad | 201009 | — | Dev Mangalam Hospital, Sector 12, Teacher Colony, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009 |
| 24 | 8300 | Dr. Archana Verma | Ghaziabad | 201002 | — | Archana Nursing Home, SI 3, Block I, Shastri Nagar, Ghaziabad, Uttar Pradesh 201002 |
| 25 | 6721 | Dr. Gunjan Gulati | Ghaziabad | — | — | Mediwin Hospital 12/73, Block 12, Raj Nagarn Extensation Ghaziyabad |
| 26 | 6703 | Dr. Gunjan Gupta | Ghaziabad | 201014 | — | Gunjan IVF World, 2nd Floor, Jaipuria Sunrise Plaza, above Bikanerwala, Ahinsa Khand 1, Indirapuram, Ghaziabad, Uttar Pradesh 201014 |
| 27 | 6715 | Dr. Kusum Gupta | Ghaziabad | 201005 | — | Sneh Maternity Centre, E 38, E Block, Lajpat Nagar, Block E, Rajendra Nagar, Sahibabad, Ghaziabad, Uttar Pradesh 201005 |
| 28 | 8298 | Dr. Madhuri Verma | Ghaziabad | 201010 | — | Uttam Hospital, E-230, Sector 9-201010 |
| 29 | 9014 | Dr. Maneesha Agrawal | Ghaziabad | — | — | — |
| 30 | 8297 | Dr. Parul Gupta | Ghaziabad | 201009 | — | Dr. Parul Gupta Child Care Clinic, 83/2, Opposite Opulent Mall, West Model Town, Model Town-201009 |
| 31 | 6798 | Dr. Pragya Pandey | Ghaziabad | 201002 | — | Manipal HospitalOPD-4, Manipal Hospital, Hapur Rd, near NH-24, near Landcraft Golflink, G.Z.B, Navyug Market, Pandav Nagar, Ghaziabad, Uttar Pradesh 201002 |
| 32 | 6820 | Dr. Prerna Singhal | Ghaziabad | 201014 | — | Healing Tree HospitalPlot No -30/1, Near One Square Mall, Shakti Khand 3-Indirapuram-201014 (Near One Square Mall) |
| 33 | 8295 | Dr. Rachna Jindal | Ghaziabad | 201003 | — | Dr Rachna Jindal Maternity Centre, National Highway 58, Sector 7, Pocket C, Patel Nagar 3, Patel Nagar, Ghaziabad, Uttar Pradesh 201003 |
| 34 | 7555 | Dr. Rani Ghai | Ghaziabad | 201009 | — | Dr. Rani Ghai Clinic, B- 22 Sector - 9 , New Vijay Nagar Ghaziabad    Pincode- 201009 |
| 35 | 8296 | Dr. Rekha Loiwal | Ghaziabad | 201001 | — | Nagar Hospital, B-1, Near By Hindi Bhawan, Lohia Nagar, Lohia Nagar-201001 |
| 36 | 9009 | Dr. Seema Varsnay | Ghaziabad | 201005 | — | L-216, Lajpat Nagar, Om nagar Mohan Nagar, Rajendra Nagar, Sahibabad, Ghaziabad, Uttar Pradesh 201005 |
| 37 | 8302 | Dr. Shalini Agarwal | Ghaziabad | 201002 | — | Agarwal Nursing Home & Maternity Centre, House Number-R-12/44, Near ALT Centre, Raj Nagar-201002 |
| 38 | 6724 | Dr. Vanipuri | Ghaziabad | 201017 | — | Women Wellness ClinicS-2 Ground Floor,Quantum Residency Raj Nagar Extn. Ghaziyabad pin-201017 |
| 39 | 9012 | Dr. B.S. Akhila | NOIDA | 201308 | — | Vedansh Surya Hospital; 47, Knowledge Park III, Greater Noida, Uttar Pradesh 201308 |
| 40 | 9010 | Dr. Deepika Negi | NOIDA | — | — | — |
| 41 | 9013 | Dr. Komal Singh | NOIDA | — | — | — |
| 42 | 9011 | Dr. Meenakshi Tanwar | NOIDA | — | — | — |
| 43 | 4378 | Dr. Nandita | NOIDA | 201301 | — | kailash hospital , sector 27 noida |
| 44 | 6801 | Dr. Pushpa Singh | NOIDA | 201301 | — | H No. 95, Sector - 15a, Gautam Budh Nagar, , Sector 15-201301 |
| 45 | 9015 | Dr. Vandana C Sharma | NOIDA | — | — | — |

### Odisha — 4 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 46 | 8646 | Dr. Harpreet Kaur | Bhubaneswar | 751030 | — | Manipal Hospital ( Earlier AMRI ) Plot No-1 Besides , Satysai Enclave Rd, Khandagiri, BBSR |
| 47 | 6833 | Dr. Sabri Bhatacharya | Bhubaneswar | 751015 | — | Usthi Hospital Bhuabneswar |
| 48 | 8894 | Dr. Samikshya Nanda | Bhubaneswar | 751002 | — | Cura Neuro & Gyanaecare, Infront Of Amber Show Room, Near Nuagaon Petrol Pump,Lingipur,BBSR |
| 49 | 8870 | Dr. Sunita Mishra | Bhubaneswar | 751032 | — | IMS & SUM -2 , Phulanakhara, BBSR |

### Punjab — 3 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 50 | 8689 | Dr. Ashima Taneja | Ludhiana | 141001 | — | Dayanand Medical College, Civil line Tagore Nagar, Ludhiana, Punjab |
| 51 | 8627 | Dr. Kanupriya Jain | Ludhiana | 141012 | — | Cloudnine Hospital, Firozpur Road, opp. MBD mall, Ludhiana-141012, Ameritus Hospital, B-28, 200 Feet Road, Passi Nagar, Ludhiana, Punjab 141013 |
| 52 | 8217 | Dr. Vidhu Modgil | Ludhiana | 141002 | — | Suman Hospital, 537, Harnam Nagar, Model town, Ludhiana |

### Telangana — 5 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 53 | 8707 | Dr. P M Abhirama Sundari | Hyderabad | 500010 | — | Sundari Maternity And General Hospital; No.1, 8-84, Temple Alwal Rd, Anand Rao Nagar, Temple Alwal, Alwal, Hyderabad, Secunderabad, Telangana 500010 |
| 54 | 8761 | Dr. S Vidyarani | Hyderabad | 500010 | — | Sundari Maternity And General Hospital; No.1, 8-84, Temple Alwal Rd, Anand Rao Nagar, Temple Alwal, Alwal, Hyderabad, Secunderabad, Telangana 500010 |
| 55 | 7823 ⚠️ | Dr. Tripura Sundari | Hyderabad | 500082 | — | KIMS Hospital, Door No. 1-8-31/1, Block 1, 2, 3, Opposite Sai Baba Temple, Krishna Nagar Colony, Main Road, Minister Road, Punjagutta-500082 (Opposite Sai Baba Temple, Krishna Nagar Colony) |
| 56 | 8901 | Dr. Vasundhara Cheepurupalli | Hyderabad | 500003 | — | KIMS hospital, Minister road, Secunderabad, Hyderabad, Telangana |
| 57 | 6479 | Dr. Y Sandhya Rani | Hyderabad | 500048 | — | Sri vijaya hospital, Attapur, Hyderabad |

### WestUP — 17 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Address |
|--:|------:|-------------|------|--------:|-----------|---------|
| 58 | 9016 | Dr. Anu Shree Rawat | Agra | — | — | — |
| 59 | 9030 | Dr. Anupama Tayagi | Agra | — | — | — |
| 60 | 9019 | Dr. Bhawana Singh | Agra | — | — | — |
| 61 | 8252 | Dr. Darsha | Agra | 282007 | — | 113, Paschimpuri, Shastripuram Road, Agra |
| 62 | 9024 | Dr. Eshita Bansal | Agra | — | — | — |
| 63 | 9021 | Dr. Kavita Bhatnagar | Agra | — | — | — |
| 64 | 9029 | Dr. Kaviya Sharma | Agra | — | — | — |
| 65 | 9027 | Dr. Mamta | Agra | — | — | — |
| 66 | 8253 | Dr. Moshmi Singhal | Agra | 282001 | — | 14, Lata Kunj, Mathura Road, Agra |
| 67 | 9026 | Dr. Pushplata | Agra | — | — | — |
| 68 | 8124 | Dr. Sangeeta Chaturvedi | Agra | 282007 | — | Sangeeta Mother & Child Care Center, 106, Tyagi Market, Shastripuram Road, Paschim Puri Chauraha, Sikandra, Agra, Uttar Pradesh 282007 |
| 69 | 9022 | Dr. Sarita Mittal | Agra | — | — | — |
| 70 | 9025 | Dr. Shardha Mishra | Agra | — | — | — |
| 71 | 9028 | Dr. Shushma Gupta | Agra | — | — | — |
| 72 | 9018 | Dr. Somiya Mohaniya | Agra | — | — | — |
| 73 | 8692 | Dr. Urvashi Verma | Agra | 282010 | — | Urvashi Clinic, Shahgunj, Agra - 282010 |
| 74 | 8305 | FPAI Clinic Agra | Agra | 282010 | — | 2 HIG, Friends Colony, Shahganj, Agra - 282010 |

---

## SDPIDs — Plain List

For scripted removal. Copy-paste ready.

```
4378, 6479, 6634, 6703, 6715, 6721, 6724, 6740, 6798, 6801, 6820, 6833, 7555, 7821, 7823, 7993, 8007, 8013, 8016, 8027, 8028, 8031, 8038, 8124, 8217, 8220, 8226, 8252, 8253, 8283, 8295, 8296, 8297, 8298, 8299, 8300, 8301, 8302, 8305, 8577, 8627, 8646, 8658, 8671, 8689, 8692, 8707, 8754, 8755, 8758, 8761, 8775, 8870, 8894, 8901, 9009, 9010, 9011, 9012, 9013, 9014, 9015, 9016, 9018, 9019, 9021, 9022, 9024, 9025, 9026, 9027, 9028, 9029, 9030
```

Excluding the four re-instatement conflicts:

```
4378, 6479, 6634, 6703, 6715, 6721, 6724, 6740, 6798, 6801, 6820, 6833, 7555, 7821, 7993, 8007, 8013, 8016, 8027, 8028, 8031, 8038, 8124, 8217, 8220, 8226, 8252, 8253, 8283, 8295, 8296, 8297, 8298, 8299, 8300, 8301, 8302, 8305, 8577, 8627, 8646, 8658, 8689, 8692, 8707, 8755, 8761, 8775, 8870, 8894, 8901, 9009, 9010, 9011, 9012, 9013, 9014, 9015, 9016, 9018, 9019, 9021, 9022, 9024, 9025, 9026, 9027, 9028, 9029, 9030
```

---

## Source Notes

- Columns A–G: `sdpid`, `State`, `City`, `SDP_name`, `Pincode`, `Telephone`, `address`. Columns H onward are empty.
- 74 contiguous data rows (2–75); no blank rows, no duplicate SDPIDs.
- Stray value `Telangana: Hyderabad` sits in cell **L4** (row for SDPID 6740, Dr. Neera Agrawal) — an orphaned note outside the table. Ignored here; it does not match that row's own state (`DL`).
- `sdpid` and `Pincode` were stored as floats (`8220.0`) and are normalised to integers.
- Telephone `0` is rendered as `—` (not provided).
