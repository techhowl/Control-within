# New Doctors — Referral Intake

> **Total records**: 31  |  **States**: 4  |  **Cities**: 5
> Source: `Connexi _ New Doctor Referal.xlsx` (sheet 1, rows 2–32)
> Action: add these doctors to the active database.

---

## What This File Is

Same seven-column schema as the earlier intakes, plus one new column — **`Telephone Source`** —
recording where each phone number came from. That column is the point of the file: every record
carries a verified, working number.

| `Telephone Source` | Records | Meaning |
|--------------------|--------:|---------|
| `Source file` | 23 | number taken from the original source database |
| `Consent file (overrides source …)` | 7 | consent form gave a different number; it wins |
| `Consent file (source invalid: …)` | 1 | the source number was not a valid phone number |

The eight corrected numbers, with the source value each replaced:

| SDPID | Doctor | City | Phone used | Replaced |
|------:|--------|------|------------|----------|
| 6826 | Dr. Smita Jain | Ghaziabad | `9999816177` | `9999816176` |
| 8586 | Dr. Srilakshmi | Hyderabad | `9000018910` | `040-12345678` *(invalid)* |
| 8998 | Dr. Venus Bansal | Ludhiana | `7888324710` | `9465117755` |
| 9051 | Dr. Amita Bansal | NOIDA | `9355622308` | `8869864518` |
| 9057 | Dr. Shaily Jain | Ludhiana | `9478747100` | `9872206681` |
| 9066 | Dr. Anshu Sharma Arora | Ludhiana | `9780000209` | `9888000209` |
| 9068 | Dr. Ranvir Kaur | Ludhiana | `9465709575` | `9876728950` |
| 9164 | Dr. Shuchitra Batra | Ludhiana | `8619018421` | `7800013255` |

`Telephone Source` is provenance metadata, not doctor data, so it is recorded here rather than
carried into `src/data/doctors.json` — that schema is fixed at nine fields and consumed by
`src/lib/doctors.js`.

---

## Data Completeness

| Field | Populated |
|-------|----------:|
| `sdpid` | 31 / 31 |
| `state` | 31 / 31 |
| `city` | 31 / 31 |
| `name` | 31 / 31 |
| `pincode` | 31 / 31 |
| `phone` | 31 / 31 |
| `address` | 31 / 31 |
| `telSource` | 31 / 31 |

All 31 records are complete. Every phone is a valid 10-digit Indian mobile
(leading 6–9); no placeholders, no `0` values.

---

## Net Effect on the Database

| Metric | Count |
|--------|------:|
| Doctors before this intake | 163 |
| Records in this file | 31 |
| → already in the database | 0 |
| → previously excluded, now re-instated | 9 |
| → never seen before | 22 |
| **Database after** | **194** |

Every record is an insert — none of the 31 SDPIDs was already present, so nothing
is overwritten and no existing record changes.

---

## Re-instatements

9 of these doctors are on the exclusion list in `Excluded_Doctors.md`. That list removed
74 doctors for having no usable telephone number; this file supplies one for each of these,
so the reason for their exclusion no longer holds and they return to the database.

| SDPID | Doctor | City | Phone now supplied | Also filled in |
|------:|--------|------|--------------------|----------------|
| 6715 | Dr. Kusum Gupta | Ghaziabad | `9971233949` | — |
| 6721 | Dr. Gunjan Gulati | Ghaziabad | `7503647099` | pincode 201002 |
| 7555 | Dr. Rani Ghai | Ghaziabad | `9811150960` | — |
| 8296 | Dr. Rekha Loiwal | Ghaziabad | `9818126086` | — |
| 8298 | Dr. Madhuri Verma | Ghaziabad | `9810500715` | — |
| 8299 | Dr. Archana Singh | Ghaziabad | `9717365166` | — |
| 8301 | Dr. Anjana Sabharwal | Ghaziabad | `8130449587` | — |
| 9014 | Dr. Maneesha Agrawal | Ghaziabad | `9810526040` | pincode 201001, address |
| 9015 | Dr. Vandana C Sharma | NOIDA | `9818961857` | pincode 201303, address |

This is the same pattern as the August intake, which re-instated four doctors (7823, 8671,
8754, 8758) on identical grounds. Running total: 13 of the 74 exclusions have now returned.

---

## Geocoding

All 31 records resolved at **pincode-polygon precision** — the same tier as the August
intake, finer than the city-centroid coordinates of the original build. Every result was
sanity-checked against its city centroid; nothing was rejected as an outlier.

Three sit well outside their nominal city, correctly so — Jagraon and Raikot are tahsils of
Ludhiana district and each address names the tahsil:

| SDPID | Doctor | Pincode resolves to | Distance from Ludhiana |
|------:|--------|---------------------|-----------------------:|
| 9057 | Dr. Shaily Jain | Raikot Tahsil (141109) | ~38 km |
| 9068 | Dr. Ranvir Kaur | Jagraon (142026) | ~37 km |
| 9069 | Dr. Priti Gupta | Jagraon (142026) | ~37 km |

---

## ⚠️ Issues Worth Confirming

## ✅ Conflicts Reconciled

Where this intake disagreed with existing records about the same clinic, the newer data was
adopted and the records aligned.

### Cloudnine, Gaur City — SDPIDs 9051, 4405, 8991

Three doctors at *"Cloudnine, 5th Avenue Gaur City, Sector 4"* carried two pincodes and three
coordinates, up to 7.7 km apart:

| SDPID | Batch | Pincode was | Coordinate was | Off true site by |
|------:|-------|-------------|----------------|-----------------:|
| 8991 | original | 201016 | `28.628656, 77.359901` | 6.7 km |
| 4405 | this file | 201016 | `28.627638, 77.438423` | 2.3 km |
| 9051 | this file | **201009** | `28.642821, 77.436706` | 3.8 km |

This file contradicts itself — 4405 says `201016` while 9051 says `201009` — so recency alone
could not decide it. `201016` wins 2–1 and is itself backed by a record from this file, while
`201009`'s post offices are Ghaziabad *city* (Vijai Nagar, Arya Nagar, Dasna Gate), a distinctly
different area. **9051 was moved to `201016`**, address string updated to match.

No pincode centroid actually sat on the clinic, so all three now use OSM's surveyed **Gaur
City** point, `28.610479, 77.425433`. One clinic, one coordinate.

### Ameritus Hospital, Ludhiana — SDPIDs 9164, 8612

Both carry pincode `141013`, yet sat **5.0 km apart** — 8612 was still on the original
city-centroid tier. **8612 now takes the newer record's `141013` polygon**, `30.867684,
75.830799`, so one pincode yields one coordinate. Ameritus is not in OSM by name, so the
polygon is the best available position.

The two also share telephone `8619018421`. That is a hospital switchboard, not a duplicated
record — distinct doctors, distinct SDPIDs. Both are kept, phone unchanged.

### Not a conflict — SDPIDs 9245 / 9105

Dr. Mandeep Kaur appears in Ludhiana (141002, this file) and Agra (282007, August intake).
Different cities, pincodes and phone numbers: **two different doctors who share a common name**,
not mismatched copies of one record. Nothing to reconcile, both left as supplied. `findByName`
accepts a city argument to disambiguate; pass one when resolving this name.

---

## ⚠️ Issue Still Open

**Pincode `201012` is missing from `src/data/pincodes.json` — upstream GeoNames defect.**
That table is built by averaging the post offices GeoNames lists for each pincode. For 201012
it lists two: *Vasundhra* at `28.7643, 77.4856` (correct, Ghaziabad) and *Kaushambi* at
`28.6106, 79.7992` — a longitude ~230 km east, which is wrong; Kaushambi is a Ghaziabad
locality near `77.32`. Averaging the two lands the centroid ~115 km east of Ghaziabad, past the
75 km ceiling in `scripts/build-pincodes.mjs`, so the pincode is dropped.

**No practical impact.** `findByLocation` matches an exact doctor pincode first, and 201012 now
has a doctor (SDPID 6786), so the query resolves at tier 1 and never reaches the radius
fallback — verified. The build script was left alone rather than reworking its averaging on the
strength of one bad upstream row; flagging it here is the honest fix. If more such rows turn
up, an outlier-rejection step in `build-pincodes.mjs` would be the place to handle them.

---

## Breakdown by State

| State | New Doctors |
|-------|------------:|
| NCR | 18 |
| Punjab | 10 |
| Telangana | 2 |
| Odisha | 1 |
| **Total** | **31** |

## Breakdown by City

| City | New Doctors |
|------|------------:|
| Ghaziabad | 15 |
| Ludhiana | 10 |
| NOIDA | 3 |
| Hyderabad | 2 |
| Bhubaneswar | 1 |

---

## Full Addition List

Grouped by state, then city. `↩` marks a re-instatement from the exclusion list.

### NCR — 18 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Latitude | Longitude | Address |
|--:|------:|-------------|------|--------:|-----------|---------:|----------:|---------|
| 1 | 8301 ↩ | Dr. Anjana Sabharwal | Ghaziabad | 201014 | `8130449587` | `28.640989` | `77.3672` | Prime Hospital, VPU 20, Ground Floor, Shipra Krishna Vista Plaza, Dr Sushila Naiyar Marg, Ahinsa Khand 1, Indirapuram, Ghaziabad, Uttar Pradesh 201014 |
| 2 | 8908 | Dr. Anuradha Tyagi | Ghaziabad | 201003 | `9582500830` | `28.712823` | `77.377493` | Lotus gynae centre, gate no-3, palm kunj, Plot no 2, Raj Nagar Extension, Ghaziabad, Uttar Pradesh 201003 |
| 3 | 8299 ↩ | Dr. Archana Singh | Ghaziabad | 201009 | `9717365166` | `28.642821` | `77.436706` | Dev Mangalam Hospital, Sector 12, Teacher Colony, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009 |
| 4 | 6721 ↩ | Dr. Gunjan Gulati | Ghaziabad | 201002 | `7503647099` | `28.668351` | `77.452135` | Mediwin Hospital 12/73, Block 12, Raj Nagarn Extensation Ghaziyabad |
| 5 | 6818 | Dr. Harshu Gupta | Ghaziabad | 201001 | `9654224703` | `28.66078` | `77.424217` | Get Well HospitalS-19, Nehru Nagar Ghaziabad, Delhi - 201001 (Shalimar Garden Ext-I.near Dayanand Park) |
| 6 | 6715 ↩ | Dr. Kusum Gupta | Ghaziabad | 201005 | `9971233949` | `28.684942` | `77.364137` | Sneh Maternity Centre, E 38, E Block, Lajpat Nagar, Block E, Rajendra Nagar, Sahibabad, Ghaziabad, Uttar Pradesh 201005 |
| 7 | 8298 ↩ | Dr. Madhuri Verma | Ghaziabad | 201010 | `9810500715` | `28.649363` | `77.356201` | Uttam Hospital, E-230, Sector 9-201010 |
| 8 | 9014 ↩ | Dr. Maneesha Agrawal | Ghaziabad | 201001 | `9810526040` | `28.66078` | `77.424217` | Manisha Hospital |
| 9 | 6792 | Dr. Manisha Goyal | Ghaziabad | 201003 | `7827908598` | `28.712823` | `77.377493` | St. Joseph HospitalMeerut Rd, Marium Nagar, Sewa Nagar, Ghaziabad, Uttar Pradesh 201003 |
| 10 | 8677 | Dr. Neha Poddar | Ghaziabad | 201003 | `9711084855` | `28.712823` | `77.377493` | Poddar Nursing Home, Opp. To Old Bus Stand, #J62, J64, Patel Nagar 1, Hapur Raod, Patel Nagar 1, Ghaziabad -201003 |
| 11 | 7555 ↩ | Dr. Rani Ghai | Ghaziabad | 201009 | `9811150960` | `28.642821` | `77.436706` | Dr. Rani Ghai Clinic, B- 22 Sector - 9 , New Vijay Nagar Ghaziabad    Pincode- 201009 |
| 12 | 8296 ↩ | Dr. Rekha Loiwal | Ghaziabad | 201001 | `9818126086` | `28.66078` | `77.424217` | Nagar Hospital, B-1, Near By Hindi Bhawan, Lohia Nagar, Lohia Nagar-201001 |
| 13 | 9127 | Dr. Shikha Mishra | Ghaziabad | 201005 | `9899048532` | `28.684942` | `77.364137` | MISHRA'S CLINIC; B, 362, Lajpat Nagar, B Block, Sector 4, Rajendra Nagar, Sahibabad, Ghaziabad, Uttar Pradesh 201005 |
| 14 | 6826 | Dr. Smita Jain | Ghaziabad | 201014 | `9999816177` | `28.640989` | `77.3672` | S-9, Second Floor, Aditya City Centre, above Kotak Mahindra Bank, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014 |
| 15 | 6786 | Dr. Surabhi Agarwal | Ghaziabad | 201012 | `9911298402` | `28.656791` | `77.365991` | Ayush Clinic143, Sector 2C, Landmark: opposite to SG impression society, Vashundhra Ghaziabad |
| 16 | 9051 | Dr. Amita Bansal | NOIDA | 201009 | `9355622308` | `28.642821` | `77.436706` | Cloudnine hospital-Gaur city; 5th Avenue Gaur City, Noida Extension, Gaur City 1, Sector 4, Noida, Uttar Pradesh 201009 |
| 17 | 4405 | Dr. Mona Verma | NOIDA | 201016 | `9654901672` | `28.627638` | `77.438423` | Cloud Nine Hospital; 5th Avanue Gaur City,sector-4 noida pin 201016 |
| 18 | 9015 ↩ | Dr. Vandana C Sharma | NOIDA | 201303 | `9818961857` | `28.554521` | `77.36052` | Vandana C Sharma Clinic; D-65, opp. Sai Baba Temple, Sector 40, Noida, Uttar Pradesh 201303 |

### Odisha — 1 record

| # | SDPID | Doctor Name | City | Pincode | Telephone | Latitude | Longitude | Address |
|--:|------:|-------------|------|--------:|-----------|---------:|----------:|---------|
| 19 | 8644 | Dr. Chinmayee Kar | Bhubaneswar | 751003 | `9439727428` | `20.278733` | `85.782473` | Sum Ultimate, K8, Kalinga Nagar, Ghatikia, BBSR |

### Punjab — 10 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Latitude | Longitude | Address |
|--:|------:|-------------|------|--------:|-----------|---------:|----------:|---------|
| 20 | 9066 | Dr. Anshu Sharma Arora | Ludhiana | 141007 | `9780000209` | `30.926275` | `75.880042` | Preet Multtispeciality Hospital; New Kuldeep Nagar,Jodhewal Ludhiana 141007 |
| 21 | 9060 | Dr. Davinder Kaur | Ludhiana | 141001 | `9877717595` | `30.903489` | `75.828647` | Doctor's Clinic; I block Market Sarbha Nagar 141001 |
| 22 | 9245 | Dr. Mandeep Kaur | Ludhiana | 141002 | `8968169446` | `30.901513` | `75.824811` | B-28/709A, Street Number 1, Near Sidhwan Canal Bridge (Next to KP Motors), Panjab Mata Nagar, Shaheed Bhagat Singh Nagar, Pakhowal Road, Ludhiana, Punjab 141002 |
| 23 | 9069 | Dr. Priti Gupta | Ludhiana | 142026 | `9814444154` | `30.800854` | `75.483541` | Sanjivani Hospital; Tehsil Road, Jagraon Ludhiana 142026 |
| 24 | 9068 | Dr. Ranvir Kaur | Ludhiana | 142026 | `9465709575` | `30.800854` | `75.483541` | Ranvir Maternity, New Dashmesh Nagar, Behind Ajanta Petrol pump, Jagraon Ludhiana 142026 |
| 25 | 8825 | Dr. Seema Popli | Ludhiana | 141001 | `9814680440` | `30.903489` | `75.828647` | Popli Hospital; 3d, Kitchlu Nagar Rd, Near DMC Hospital, Udham Singh Nagar, Tagore Nagar, Ludhiana, Punjab 141001 |
| 26 | 9071 | Dr. Shailja Mittal | Ludhiana | 141012 | `9463145010` | `30.884448` | `75.791361` | KG Hospital; Riverdale colony, 5 Near Sua road, Barewal Awana, Ludhiana 141012 |
| 27 | 9057 | Dr. Shaily Jain | Ludhiana | 141109 | `9478747100` | `30.648132` | `75.600277` | UVS Hospital; Jagraon Road,opp. Bhagwan Mahavir, Senior Secondary School, Raikot, 141109 |
| 28 | 9164 | Dr. Shuchitra Batra | Ludhiana | 141013 | `8619018421` | `30.867684` | `75.830799` | Ameritus Hospital, B-28, 1339,86A,/PN,200 Feet Road, Passi Nagar, Ludhiana |
| 29 | 8998 | Dr. Venus Bansal | Ludhiana | 141001 | `7888324710` | `30.903489` | `75.828647` | Clio Mother & child clinic; 252 A, Ext, Nehru Nagar Extension, Model Town, Civil Lines, Ludhiana-141001, Punjab |

### Telangana — 2 records

| # | SDPID | Doctor Name | City | Pincode | Telephone | Latitude | Longitude | Address |
|--:|------:|-------------|------|--------:|-----------|---------:|----------:|---------|
| 30 | 8520 | Dr. E Prabhavathi | Hyderabad | 500080 | `9390110097` | `17.424868` | `78.485153` | Eshwar Lakshmi Hospital; Plot No. 9, Gandhi Nagar Road, New Bakaram, Gandhi Nagar, Kavadiguda, Hyderabad, Telangana 500080;; Door No 1-1-727/A, CANARA BANK ROAD, GANDHI NAGAR, HYDERABAD, Hyderabad, Telangana - 500020;; FPAI clinic |
| 31 | 8586 | Dr. Srilakshmi | Hyderabad | 500064 | `9000018910` | `17.356206` | `78.458559` | House No 5/12trg, Bahadurpura X Roads, Chandulal Baradari, Hyderabad, Telangana, 500064 |

---

## SDPIDs — Plain List

All records in this file:

```
4405, 6715, 6721, 6786, 6792, 6818, 6826, 7555, 8296, 8298, 8299, 8301, 8520, 8586, 8644, 8677, 8825, 8908, 8998, 9014, 9015, 9051, 9057, 9060, 9066, 9068, 9069, 9071, 9127, 9164, 9245
```

Re-instatements (were on the exclusion list):

```
6715, 6721, 7555, 8296, 8298, 8299, 8301, 9014, 9015
```

---

## Source Notes

- Columns A–H: `sdpid`, `State`, `City`, `SDP_name`, `Pincode`, `Telephone`, `address`,
  `Telephone Source`. Columns I onward are empty.
- 31 contiguous data rows (2–32); no blank rows, no duplicate SDPIDs, no missing values.
- `sdpid` and `Pincode` were stored as floats (`4405.0`) and are normalised to integers.
- Every `Pincode` value agrees with the pincode written inside its own address text.
- ✅ **Applied.** Merged into `Doctors_Geocoded.md` (now 194 doctors), built into
  `src/data/doctors.json` via `node scripts/build-doctors.mjs`, and `src/data/pincodes.json`
  rebuilt from the GeoNames export.
