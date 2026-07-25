from datetime import datetime, timedelta

# ============================================================
# Karnataka State Police (KSP) — Synthetic Seed Dataset
# Based on KSP FIR System ER Diagram & Problem Statement Specifications
# ============================================================

# 1. MOCK USERS (Police Officers across Karnataka Districts)
MOCK_USERS = [
    {
        "rowid": 1,
        "email": "investigator.raj@ksp.gov.in",
        "username": "Inspector Rajkumar",
        "role": "Investigator",
        "police_id": "KSP-2015-BLR-884",
        "created_time": datetime(2024, 1, 15, 9, 0, 0)
    },
    {
        "rowid": 2,
        "email": "supervisor.patil@ksp.gov.in",
        "username": "ACP Patil",
        "role": "Supervisor",
        "police_id": "KSP-2008-MYS-012",
        "created_time": datetime(2024, 1, 15, 9, 0, 0)
    },
    {
        "rowid": 3,
        "email": "analyst.swati@ksp.gov.in",
        "username": "Swati Deshpande",
        "role": "Analyst",
        "police_id": "KSP-2021-ANA-553",
        "created_time": datetime(2024, 1, 15, 9, 0, 0)
    },
    {
        "rowid": 4,
        "email": "admin.ksp@ksp.gov.in",
        "username": "SP Ramesh Kumar",
        "role": "Administrator",
        "police_id": "KSP-2002-HQ-001",
        "created_time": datetime(2024, 1, 15, 9, 0, 0)
    },
    {
        "rowid": 5,
        "email": "investigator.shetty@ksp.gov.in",
        "username": "Inspector Praveen Shetty",
        "role": "Investigator",
        "police_id": "KSP-2017-MNG-402",
        "created_time": datetime(2024, 6, 1, 10, 30, 0)
    }
]

# 2. MOCK FIRS (Spanning 2024, 2025, 2026 across Karnataka Districts)
MOCK_FIRS = [
    # FIR 1 - Cybercrime (Bengaluru)
    {
        "rowid": 1,
        "fir_number": "FIR/2026/BLR/CYB/041",
        "district": "Bengaluru City",
        "police_station": "Cyber Crime PS",
        "date_registered": datetime(2026, 5, 12, 11, 30, 0),
        "status": "Under Investigation",
        "crime_type": "Cybercrime",
        "description": "Victim reported a phishing call from an individual claiming to be an SBI senior branch manager. The victim was convinced to share OTP authentication code, leading to an unauthorized transaction of INR 4,50,000 transferred to a dummy SBI account.",
        "modus_operandi": "Vishing (voice phishing) targeting senior citizens, impersonating bank managers, immediate fund transfers to shell accounts followed by ATM cashouts.",
        "location_lat": 12.9716,
        "location_lng": 77.5946,
        "severity_score": 75
    },
    # FIR 2 - Armed Robbery (Mysuru)
    {
        "rowid": 2,
        "fir_number": "FIR/2026/MYS/DEB/102",
        "district": "Mysuru City",
        "police_station": "Devaraja PS",
        "date_registered": datetime(2026, 5, 20, 15, 15, 0),
        "status": "Under Investigation",
        "crime_type": "Robbery",
        "description": "Armed robbery at a jewellery store in Devaraja Mohalla. Two masked men riding a black Bajaj Pulsar motorcycle entered the store, held the cashier at gunpoint, broke glass displays, and looted gold ornaments worth INR 18,00,000 before fleeing towards Outer Ring Road.",
        "modus_operandi": "Recce done 2 days prior, entry with helmets on, threats with country-made pistols, escape on Pulsar motorcycle with fake license plates towards highway.",
        "location_lat": 12.3086,
        "location_lng": 76.6548,
        "severity_score": 85
    },
    # FIR 3 - Violent Assault & Riot (Hubballi-Dharwad)
    {
        "rowid": 3,
        "fir_number": "FIR/2026/HUB/KESH/154",
        "district": "Hubballi-Dharwad",
        "police_station": "Keshwapur PS",
        "date_registered": datetime(2026, 6, 2, 22, 45, 0),
        "status": "Solved",
        "crime_type": "Assault",
        "description": "A physical altercation broke out near Keshwapur Circle between rival groups over a land encroachment dispute. Two victims sustained severe head injuries from blunt weapons. Accused fled the scene in a white Hyundai Creta.",
        "modus_operandi": "Pre-planned ambush related to land grabbing dispute, local gang involvement, assault using iron rods and wooden clubs during night hours.",
        "location_lat": 15.3647,
        "location_lng": 75.1242,
        "severity_score": 60
    },
    # FIR 4 - Chain Snatching (Bengaluru)
    {
        "rowid": 4,
        "fir_number": "FIR/2026/BLR/MTH/089",
        "district": "Bengaluru City",
        "police_station": "Malleswaram PS",
        "date_registered": datetime(2026, 6, 15, 14, 0, 0),
        "status": "Under Investigation",
        "crime_type": "Robbery",
        "description": "Daylight chain snatching incident in Malleswaram 15th cross. A woman walking back from temple was targeted by two youth riding a sporty black motorcycle. They snatched her gold mangalsutra weighing 40 grams.",
        "modus_operandi": "Chain snatching targeting lone pedestrians, using sporty black bikes without plates or with smeared mud, active in afternoon hours.",
        "location_lat": 12.9961,
        "location_lng": 77.5714,
        "severity_score": 50
    },
    # FIR 5 - Housebreak Theft (Mysuru)
    {
        "rowid": 5,
        "fir_number": "FIR/2026/MYS/VVN/077",
        "district": "Mysuru City",
        "police_station": "V V Puram PS",
        "date_registered": datetime(2026, 6, 28, 1, 30, 0),
        "status": "Under Investigation",
        "crime_type": "Theft",
        "description": "Housebreak theft during midnight at a locked residence in V V Puram. Gold and silver heirloom items valued at INR 6,50,000 were stolen while the family was away on vacation.",
        "modus_operandi": "Pry locks using heavy iron crowbars, target residential locked houses during holidays, disable local CCTV power supply.",
        "location_lat": 12.3283,
        "location_lng": 76.6341,
        "severity_score": 68
    },
    # FIR 6 - Investment Crypto Fraud (Bengaluru)
    {
        "rowid": 6,
        "fir_number": "FIR/2026/BLR/CYB/059",
        "district": "Bengaluru City",
        "police_station": "Cyber Crime PS",
        "date_registered": datetime(2026, 7, 5, 10, 15, 0),
        "status": "Under Investigation",
        "crime_type": "Cybercrime",
        "description": "A IT executive was cheated of INR 12,00,000 in a fraudulent online stock & crypto trading scam. Accused promised 300% guaranteed returns via a VIP WhatsApp group and custom mobile app.",
        "modus_operandi": "Crypto/Stock trading scams via WhatsApp groups, fake web portals, forced virtual wallet additions, rapid laundering to shell bank accounts.",
        "location_lat": 12.9784,
        "location_lng": 77.6408,
        "severity_score": 80
    },
    # FIR 7 - Two-Wheeler Theft Syndicate (Bengaluru)
    {
        "rowid": 7,
        "fir_number": "FIR/2025/BLR/CUB/112",
        "district": "Bengaluru City",
        "police_station": "Cubbon Park PS",
        "date_registered": datetime(2025, 9, 14, 18, 20, 0),
        "status": "Solved",
        "crime_type": "Theft",
        "description": "Theft of a parked high-end motorcycle outside Cubbon Park Metro station. Master key set used to break handle lock within 90 seconds.",
        "modus_operandi": "Use of forged master keys, targeting metro parking lots, transporting stolen bikes across district borders with forged engine numbers.",
        "location_lat": 12.9757,
        "location_lng": 77.6011,
        "severity_score": 55
    },
    # FIR 8 - Coastal Narcotics Smuggling (Mangaluru)
    {
        "rowid": 8,
        "fir_number": "FIR/2025/MNG/KAD/204",
        "district": "Mangaluru City",
        "police_station": "Kadri PS",
        "date_registered": datetime(2025, 11, 8, 23, 10, 0),
        "status": "Under Investigation",
        "crime_type": "Narcotics",
        "description": "Seizure of 15 kg commercial grade MDMA and Hydroponic Weed valued at INR 1.5 Crores near Kadri Hills checkpoint. Two suspects intercepted in a white Creta.",
        "modus_operandi": "Inter-state coastal contraband smuggling via sea routes, hidden in modified vehicular door panels, distributed to college campuses.",
        "location_lat": 12.8702,
        "location_lng": 74.8427,
        "severity_score": 92
    },
    # FIR 9 - Extortion & Land Grabbing Ambush (Belagavi)
    {
        "rowid": 9,
        "fir_number": "FIR/2024/BEL/SHA/130",
        "district": "Belagavi",
        "police_station": "Shahapur PS",
        "date_registered": datetime(2024, 4, 18, 16, 40, 0),
        "status": "Closed",
        "crime_type": "Extortion",
        "description": "Extortion demand of INR 25,00,000 and threat to life issued against a local builder in Shahapur. Armed goons fired warning shots outside developer office.",
        "modus_operandi": "Protection money extortion, extortion pings from VoIP numbers, illegal firearms usage to force land transfer deeds.",
        "location_lat": 15.8497,
        "location_lng": 74.4977,
        "severity_score": 88
    },
    # FIR 10 - Highway Robbery Syndicate (Mysuru-BLR Expressway)
    {
        "rowid": 10,
        "fir_number": "FIR/2025/MYS/NAZ/301",
        "district": "Mysuru City",
        "police_station": "Nazarbad PS",
        "date_registered": datetime(2025, 12, 3, 2, 15, 0),
        "status": "Pending",
        "crime_type": "Robbery",
        "description": "Midnight highway robbery on Mysuru Expressway. A commercial vehicle carrying electronic goods was intercepted by two motorcycles, driver assaulted, and goods worth 14 Lakhs stolen.",
        "modus_operandi": "Spike traps placed on highway bends, intercepting slow-moving cargo trucks at night, armed assault and instant unload into getaway pickup vans.",
        "location_lat": 12.3105,
        "location_lng": 76.6652,
        "severity_score": 84
    },
    # FIR 11 - Loan App Harassment & Cyber Extortion (Mangaluru)
    {
        "rowid": 11,
        "fir_number": "FIR/2025/MNG/PAN/018",
        "district": "Mangaluru City",
        "police_station": "Pandeshwar PS",
        "date_registered": datetime(2025, 3, 22, 11, 0, 0),
        "status": "Under Investigation",
        "crime_type": "Cybercrime",
        "description": "Victim complained of blackmail and morphing of private photos by illegal instant loan app operators after taking a INR 10,000 micro-loan.",
        "modus_operandi": "Malicious Android SDK accessing contacts list, automated extortion messages sent to victim's entire contact list, funds routed via mule accounts.",
        "location_lat": 12.8617,
        "location_lng": 74.8347,
        "severity_score": 78
    },
    # FIR 12 - Land Fraud & Extortion (Udupi)
    {
        "rowid": 12,
        "fir_number": "FIR/2024/UDP/TPS/092",
        "district": "Udupi",
        "police_station": "Udupi Town PS",
        "date_registered": datetime(2024, 8, 11, 15, 30, 0),
        "status": "Solved",
        "crime_type": "Fraud",
        "description": "Forged land title deeds created for ancestral property worth 2.2 Crores in Manipal. Dummy sellers impersonated original non-resident owners.",
        "modus_operandi": "Creation of fake Aadhaar and pan cards, impersonation of NRI property owners at sub-registrar offices, immediate mortgage cashouts.",
        "location_lat": 13.3409,
        "location_lng": 74.7421,
        "severity_score": 70
    }
]

# 3. MOCK ACCUSED (Including Repeat Offenders & Syndicate Links)
MOCK_ACCUSED = [
    # Repeat Offender 1: Karthik Gowda (Cybercrime / Vishing / Scam Ring)
    {
        "rowid": 1,
        "fir_id": 1,
        "name": "Karthik Gowda",
        "age": 28,
        "phone_number": "+91 9884562130",
        "address": "2nd Cross, RT Nagar, Bengaluru",
        "status": "Suspect",
        "bank_account": "SBI-3304128490",
        "vehicle_plate": "KA-04-ME-4412",
        "history_repeater": True
    },
    # Repeat Offender 2: Basavaraj 'Basya' (Pulsar Robbery Syndicate Leader)
    {
        "rowid": 2,
        "fir_id": 2,
        "name": "Basavaraj 'Basya'",
        "age": 34,
        "phone_number": "+91 9774012569",
        "address": "KSRTC Colony, Mandya",
        "status": "Absconding",
        "bank_account": "HDFC-0412004821",
        "vehicle_plate": "KA-11-H-8092",
        "history_repeater": True
    },
    # Accused 3: Mohammad Rizwan (Pulsar Robbery Syndicate Member)
    {
        "rowid": 3,
        "fir_id": 2,
        "name": "Mohammad Rizwan",
        "age": 29,
        "phone_number": "+91 8894120359",
        "address": "Bannimantap, Mysuru",
        "status": "Arrested",
        "bank_account": "ICICI-55410982",
        "vehicle_plate": "KA-09-EF-2015",
        "history_repeater": False
    },
    # Accused 4: Somesh Patil (Deccan Land Mafia / Assault)
    {
        "rowid": 4,
        "fir_id": 3,
        "name": "Somesh Patil",
        "age": 42,
        "phone_number": "+91 9448123048",
        "address": "Vidyanagar, Hubballi",
        "status": "Arrested",
        "bank_account": "Canara-9941038",
        "vehicle_plate": "KA-25-MA-6701",
        "history_repeater": True
    },
    # Accused 5: Kiran Kumar (Pulsar Snatchers - shares phone +91 9774012569 with Basavaraj!)
    {
        "rowid": 5,
        "fir_id": 4,
        "name": "Kiran Kumar (Pulsar Gang)",
        "age": 24,
        "phone_number": "+91 9774012569",  # Cross-link to Basavaraj!
        "address": "Srirampura, Bengaluru",
        "status": "Suspect",
        "bank_account": "SBI-440129381",
        "vehicle_plate": "KA-02-JH-1192",
        "history_repeater": True
    },
    # Repeat Offender 1 Link: Karthik Gowda in FIR 6 (Investment Scam)
    {
        "rowid": 6,
        "fir_id": 6,
        "name": "Karthik Gowda",  # Repeat offender match
        "age": 28,
        "phone_number": "+91 9884562130",
        "address": "2nd Cross, RT Nagar, Bengaluru",
        "status": "Suspect",
        "bank_account": "SBI-3304128490",
        "vehicle_plate": "KA-04-ME-4412",
        "history_repeater": True
    },
    # Repeat Offender 2 Link: Basavaraj 'Basya' in FIR 4 (Malleswaram Snatching)
    {
        "rowid": 7,
        "fir_id": 4,
        "name": "Basavaraj 'Basya'",  # Repeat offender match
        "age": 34,
        "phone_number": "+91 9774012569",
        "address": "KSRTC Colony, Mandya",
        "status": "Absconding",
        "bank_account": "HDFC-0412004821",
        "vehicle_plate": "KA-11-H-8092",
        "history_repeater": True
    },
    # Accused 8: Suresh Poojary 'Don' (Karavali Narcotics Syndicate Leader)
    {
        "rowid": 8,
        "fir_id": 8,
        "name": "Suresh Poojary 'Don'",
        "age": 48,
        "phone_number": "+91 9845012359",
        "address": "Surathkal, Mangaluru",
        "status": "Absconding",
        "bank_account": "Federal-881920391",
        "vehicle_plate": "KA-19-MC-8812",
        "history_repeater": True
    },
    # Accused 9: Abdul Farooq (Coastal Smuggling)
    {
        "rowid": 9,
        "fir_id": 8,
        "name": "Abdul Farooq",
        "age": 31,
        "phone_number": "+91 9900213045",
        "address": "Ullal, Mangaluru",
        "status": "Arrested",
        "bank_account": "Syndicate-11029384",
        "vehicle_plate": "KA-20-B-9901",
        "history_repeater": False
    },
    # Accused 10: Somesh Patil in FIR 9 (Belagavi Extortion)
    {
        "rowid": 10,
        "fir_id": 9,
        "name": "Somesh Patil",  # Repeat offender match
        "age": 42,
        "phone_number": "+91 9448123048",
        "address": "Vidyanagar, Hubballi",
        "status": "Convicted",
        "bank_account": "Canara-9941038",
        "vehicle_plate": "KA-25-MA-6701",
        "history_repeater": True
    },
    # Repeat Offender 2 Link: Basavaraj 'Basya' in FIR 10 (Expressway Highway Robbery)
    {
        "rowid": 11,
        "fir_id": 10,
        "name": "Basavaraj 'Basya'",  # Repeat offender match
        "age": 34,
        "phone_number": "+91 9774012569",
        "address": "KSRTC Colony, Mandya",
        "status": "Absconding",
        "bank_account": "HDFC-0412004821",
        "vehicle_plate": "KA-11-H-8092",
        "history_repeater": True
    },
    # Repeat Offender 1 Link: Karthik Gowda in FIR 11 (Loan App Harassment)
    {
        "rowid": 12,
        "fir_id": 11,
        "name": "Karthik Gowda",  # Repeat offender match
        "age": 28,
        "phone_number": "+91 9884562130",
        "address": "2nd Cross, RT Nagar, Bengaluru",
        "status": "Suspect",
        "bank_account": "SBI-3304128490",
        "vehicle_plate": "KA-04-ME-4412",
        "history_repeater": True
    },
    # Accused 13: Suresh Poojary 'Don' in FIR 12 (Udupi Land Fraud)
    {
        "rowid": 13,
        "fir_id": 12,
        "name": "Suresh Poojary 'Don'",  # Repeat offender match
        "age": 48,
        "phone_number": "+91 9845012359",
        "address": "Surathkal, Mangaluru",
        "status": "Absconding",
        "bank_account": "Federal-881920391",
        "vehicle_plate": "KA-19-MC-8812",
        "history_repeater": True
    }
]

# 4. MOCK VICTIMS
MOCK_VICTIMS = [
    {
        "rowid": 1,
        "fir_id": 1,
        "name": "Ananthayya Subbarao",
        "age": 67,
        "phone_number": "+91 9448021159",
        "address": "Jayanagar 4th Block, Bengaluru",
        "statement": "I received a call from a person claiming to be SBI customer care manager regarding KYC expiry. He asked for my SMS OTP. Within minutes, my lifetime pension savings of 4.5 Lakhs were debited."
    },
    {
        "rowid": 2,
        "fir_id": 2,
        "name": "Devadas Shetty",
        "age": 52,
        "phone_number": "+91 9845012359",
        "address": "Devaraja Mohalla, Mysuru",
        "statement": "I was at the cash counter when two boys with helmets rushed inside. They pointed a pistol at my head and smashed the display glass, taking away gold necklaces."
    },
    {
        "rowid": 3,
        "fir_id": 3,
        "name": "Gurupadappa K",
        "age": 48,
        "phone_number": "+91 8095112480",
        "address": "Keshwapur, Hubballi",
        "statement": "Somesh Patil and his goons attacked me with iron rods when I refused to sign the property transfer document."
    },
    {
        "rowid": 4,
        "fir_id": 4,
        "name": "Sunanda Rao",
        "age": 58,
        "phone_number": "+91 9845192830",
        "address": "Malleswaram 15th Cross, Bengaluru",
        "statement": "Two youths on a black Pulsar bike zoomed past me and snatched my 40-gram gold mangalsutra near the temple gate."
    },
    {
        "rowid": 5,
        "fir_id": 6,
        "name": "Vikram Adiga",
        "age": 36,
        "phone_number": "+91 9900114420",
        "address": "Indiranagar, Bengaluru",
        "statement": "I was lured into a WhatsApp group promising crypto arbitrage profits. I transferred 12 Lakhs to the specified SBI account before the app shut down."
    },
    {
        "rowid": 6,
        "fir_id": 8,
        "name": "State of Karnataka (Narcotics Bureau)",
        "age": 0,
        "phone_number": "+91 8242220000",
        "address": "Kadri PS, Mangaluru",
        "statement": "Public interest seizure of commercial narcotics consignment originating from coastal smuggling network."
    }
]

# 5. MOCK WITNESSES
MOCK_WITNESSES = [
    {
        "rowid": 1,
        "fir_id": 2,
        "name": "Nagesh Rao",
        "phone_number": "+91 9900213045",
        "address": "Devaraja Mohalla, Mysuru",
        "statement": "I saw two men park a black Bajaj Pulsar outside the jewellery shop. They left the engine idling, walked inside with full-face helmets, and ran out carrying heavy sacks after 5 minutes."
    },
    {
        "rowid": 2,
        "fir_id": 4,
        "name": "Ramu Gowda",
        "phone_number": "+91 9844012903",
        "address": "Malleswaram, Bengaluru",
        "statement": "I was washing my car when I heard a lady scream. I saw a black Pulsar speed past. The pillion rider was holding a gold chain."
    },
    {
        "rowid": 3,
        "fir_id": 8,
        "name": "Head Constable Maheshwar",
        "phone_number": "+91 8242401290",
        "address": "Kadri Checkpost, Mangaluru",
        "statement": "Inspected the white Creta at Kadri border checkpoint and uncovered 15 kg MDMA concealed inside the rear seat lining."
    }
]

# 6. MOCK EVIDENCE (Physical, Digital, Forensic)
MOCK_EVIDENCE = [
    {
        "rowid": 1,
        "fir_id": 1,
        "name": "Fraud Call Voice Recording",
        "type": "Audio",
        "description": "Audio recording of the vishing call. Spectral voice analysis matches suspect Karthik Gowda.",
        "file_store_id": "file_rec_041.mp3",
        "date_found": datetime(2026, 5, 13, 10, 0, 0)
    },
    {
        "rowid": 2,
        "fir_id": 1,
        "name": "SBI Account Bank Statement",
        "type": "Document",
        "description": "Bank statement indicating transaction flow to dummy account SBI-3304128490.",
        "file_store_id": "bank_statement_041.pdf",
        "date_found": datetime(2026, 5, 12, 16, 0, 0)
    },
    {
        "rowid": 3,
        "fir_id": 2,
        "name": "CCTV Footage Devaraja Shop",
        "type": "Digital",
        "description": "High-definition video showing suspects entering. Pillion suspect has a distinct wrist tattoo matching Basavaraj.",
        "file_store_id": "cctv_robbery_mys.mp4",
        "date_found": datetime(2026, 5, 20, 18, 30, 0)
    },
    {
        "rowid": 4,
        "fir_id": 4,
        "name": "CCTV Malleswaram Street Cam",
        "type": "Digital",
        "description": "Traffic camera footage showing Bajaj Pulsar license plate KA-02-JH-1192 escaping.",
        "file_store_id": "traffic_cam_mth.mp4",
        "date_found": datetime(2026, 6, 16, 9, 15, 0)
    },
    {
        "rowid": 5,
        "fir_id": 8,
        "name": "Seized MDMA & Hydroponic Weed",
        "type": "Physical",
        "description": "15 kg contraband drug packets sealed and certified by FSL Bengaluru.",
        "file_store_id": "fsl_report_mdma.pdf",
        "date_found": datetime(2025, 11, 9, 2, 0, 0)
    }
]

# 7. MOCK VEHICLES
MOCK_VEHICLES = [
    {
        "rowid": 1,
        "plate_number": "KA-11-H-8092",
        "model": "Bajaj Pulsar 150",
        "color": "Black",
        "owner_name": "Basavaraj 'Basya'",
        "associated_fir_id": 2
    },
    {
        "rowid": 2,
        "plate_number": "KA-02-JH-1192",
        "model": "Bajaj Pulsar 220",
        "color": "Black",
        "owner_name": "Kiran Kumar",
        "associated_fir_id": 4
    },
    {
        "rowid": 3,
        "plate_number": "KA-25-MA-6701",
        "model": "Hyundai Creta",
        "color": "White",
        "owner_name": "Somesh Patil",
        "associated_fir_id": 3
    },
    {
        "rowid": 4,
        "plate_number": "KA-19-MC-8812",
        "model": "Mahindra Thar",
        "color": "Black",
        "owner_name": "Suresh Poojary 'Don'",
        "associated_fir_id": 8
    },
    {
        "rowid": 5,
        "plate_number": "KA-04-ME-4412",
        "model": "Honda City",
        "color": "Silver",
        "owner_name": "Karthik Gowda",
        "associated_fir_id": 1
    }
]

# 8. MOCK PHONES
MOCK_PHONES = [
    {
        "rowid": 1,
        "phone_number": "+91 9884562130",
        "imei": "358941029384012",
        "owner_name": "Karthik Gowda",
        "associated_fir_id": 1
    },
    {
        "rowid": 2,
        "phone_number": "+91 9774012569",
        "imei": "359410294821035",
        "owner_name": "Basavaraj 'Basya'",
        "associated_fir_id": 2
    },
    {
        "rowid": 3,
        "phone_number": "+91 8894120359",
        "imei": "864102938401923",
        "owner_name": "Mohammad Rizwan",
        "associated_fir_id": 2
    },
    {
        "rowid": 4,
        "phone_number": "+91 9845012359",
        "imei": "351029384910293",
        "owner_name": "Suresh Poojary 'Don'",
        "associated_fir_id": 8
    },
    {
        "rowid": 5,
        "phone_number": "+91 9448123048",
        "imei": "869102938410293",
        "owner_name": "Somesh Patil",
        "associated_fir_id": 3
    }
]

# 9. MOCK BANK ACCOUNTS
MOCK_BANK_ACCOUNTS = [
    {
        "rowid": 1,
        "account_number": "SBI-3304128490",
        "bank_name": "State Bank of India",
        "holder_name": "Karthik Gowda",
        "associated_fir_id": 1
    },
    {
        "rowid": 2,
        "account_number": "HDFC-0412004821",
        "bank_name": "HDFC Bank",
        "holder_name": "Basavaraj 'Basya'",
        "associated_fir_id": 2
    },
    {
        "rowid": 3,
        "account_number": "ICICI-55410982",
        "bank_name": "ICICI Bank",
        "holder_name": "Mohammad Rizwan",
        "associated_fir_id": 2
    },
    {
        "rowid": 4,
        "account_number": "Federal-881920391",
        "bank_name": "Federal Bank",
        "holder_name": "Suresh Poojary 'Don'",
        "associated_fir_id": 8
    },
    {
        "rowid": 5,
        "account_number": "Canara-9941038",
        "bank_name": "Canara Bank",
        "holder_name": "Somesh Patil",
        "associated_fir_id": 3
    }
]

# 10. MOCK CASE FOLDERS (Digital Case Folders for Investigation Teams)
MOCK_CASE_FOLDERS = [
    {
        "rowid": 1,
        "title": "Mysuru Gold Robbery & Highway Pulsar Syndicate",
        "summary": "Investigation into the armed robbery at Devaraja jewellery shop and related chain snatching & highway heist incidents utilizing black Pulsar motorcycles. Key suspect Basavaraj is absconding, and his mobile number links him to suspect Kiran Kumar.",
        "status": "Active",
        "risk_score": 88,
        "created_time": datetime(2026, 5, 21, 10, 0, 0),
        "court_status": "Charge sheet being finalized. Suspect Rizwan in judicial custody. Search warrants active for Basavaraj.",
        "evidence_confidence": 0.88
    },
    {
        "rowid": 2,
        "title": "RT Nagar Cybercrime & Banking Vishing Ring",
        "summary": "Covers vishing fraud cases targeting senior citizens and fake crypto investment scams in Bengaluru City, where victims transfer funds to SBI-3304128490 linked to repeat cyber offender Karthik Gowda.",
        "status": "Active",
        "risk_score": 82,
        "created_time": datetime(2026, 5, 14, 9, 30, 0),
        "court_status": "Bank accounts frozen via cyber police orders. Digital forensic report submitted to court.",
        "evidence_confidence": 0.94
    },
    {
        "rowid": 3,
        "title": "Karavali Coastal Narcotics & Smuggling Syndicate",
        "summary": "Multi-district investigation into commercial MDMA and contraband drug distribution operating across Mangaluru and Udupi coastal belt. Controlled by Suresh Poojary 'Don' and Abdul Farooq.",
        "status": "Active",
        "risk_score": 94,
        "created_time": datetime(2025, 11, 10, 14, 0, 0),
        "court_status": "FSL report confirmed 15kg MDMA. Farooq in police custody. Look-out circular issued for Suresh Poojary.",
        "evidence_confidence": 0.91
    },
    {
        "rowid": 4,
        "title": "Deccan Land Grabbing, Extortion & Riot Gang",
        "summary": "Organized crime module operating across Hubballi-Dharwad and Belagavi involved in land encroachments, violent assaults, and extortion threats led by Somesh Patil.",
        "status": "Active",
        "risk_score": 79,
        "created_time": datetime(2026, 6, 3, 11, 15, 0),
        "court_status": "Somesh Patil arrested under KCOCA act. Bail petition rejected by sessions court.",
        "evidence_confidence": 0.85
    },
    {
        "rowid": 5,
        "title": "Bengaluru Commercial Crime & Crypto Fraud Module",
        "summary": "Investigation into fake mobile trading applications and crypto wallet scams operating out of Indiranagar and Koramangala.",
        "status": "Active",
        "risk_score": 75,
        "created_time": datetime(2026, 7, 6, 9, 0, 0),
        "court_status": "IP logs and domain registry data subpoenaed from hosting providers.",
        "evidence_confidence": 0.82
    },
    {
        "rowid": 6,
        "title": "Belagavi-Kalaburagi Inter-District Extortion Network",
        "summary": "Inter-district extortion module targeting builders and sub-registrars using illegal firearms and forged land documents.",
        "status": "Solved",
        "risk_score": 65,
        "created_time": datetime(2024, 4, 20, 16, 0, 0),
        "court_status": "Trial completed. Primary accused convicted under IPC Sections 384 and 506.",
        "evidence_confidence": 0.96
    }
]

# 11. MAPPING CASE FOLDER TO FIRS (Many-to-Many Relationships)
MOCK_CASE_FOLDER_FIR_MAPPINGS = [
    {"rowid": 1, "case_folder_id": 1, "fir_id": 2},   # Devaraja Jewellery Robbery
    {"rowid": 2, "case_folder_id": 1, "fir_id": 4},   # Malleswaram Chain Snatching
    {"rowid": 3, "case_folder_id": 1, "fir_id": 5},   # V V Puram Housebreak
    {"rowid": 4, "case_folder_id": 1, "fir_id": 10},  # Mysuru Expressway Robbery
    {"rowid": 5, "case_folder_id": 2, "fir_id": 1},   # Cybercrime SBI OTP Vishing
    {"rowid": 6, "case_folder_id": 2, "fir_id": 6},   # Cybercrime Crypto Investment Scam
    {"rowid": 7, "case_folder_id": 2, "fir_id": 11},  # Loan App Cyber Extortion
    {"rowid": 8, "case_folder_id": 3, "fir_id": 8},   # Kadri Narcotics Seizure
    {"rowid": 9, "case_folder_id": 3, "fir_id": 12},  # Udupi Land Fraud
    {"rowid": 10, "case_folder_id": 4, "fir_id": 3},  # Hubballi Assault Riot
    {"rowid": 11, "case_folder_id": 4, "fir_id": 9},  # Belagavi Extortion Ambush
    {"rowid": 12, "case_folder_id": 5, "fir_id": 6},  # Crypto Investment Fraud
    {"rowid": 13, "case_folder_id": 5, "fir_id": 7},  # Cubbon Park Bike Theft
    {"rowid": 14, "case_folder_id": 6, "fir_id": 9},  # Belagavi Extortion
    {"rowid": 15, "case_folder_id": 6, "fir_id": 12}  # Udupi Land Deed Forgery
]

# 12. MOCK OFFICER NOTES
MOCK_OFFICER_NOTES = [
    {
        "rowid": 1,
        "case_folder_id": 1,
        "user_id": 1,
        "note_content": "CCTV footage matches the scar on Basavaraj's right wrist. Cell tower pings confirm suspect's phone +91 9774012569 was active near Devaraja Mohalla at 3:10 PM.",
        "created_time": datetime(2026, 5, 22, 14, 20, 0)
    },
    {
        "rowid": 2,
        "case_folder_id": 1,
        "user_id": 1,
        "note_content": "Informant reports Basavaraj was spotted near Mandya toll gate riding a black Pulsar. Alert dispatched to highway patrol units.",
        "created_time": datetime(2026, 5, 25, 11, 0, 0)
    },
    {
        "rowid": 3,
        "case_folder_id": 2,
        "user_id": 3,
        "note_content": "SBI account SBI-3304128490 frozen by Cyber Cell. Total INR 4,50,000 locked. Router IP traces back to RT Nagar 2nd cross location.",
        "created_time": datetime(2026, 5, 16, 17, 45, 0)
    },
    {
        "rowid": 4,
        "case_folder_id": 3,
        "user_id": 5,
        "note_content": "Seized hydro weed samples verified by FSL. Intercepted call logs show direct links to Suresh Poojary 'Don' in Surathkal.",
        "created_time": datetime(2025, 11, 12, 10, 15, 0)
    }
]

# 13. MOCK TASKS FOR CASE FOLDERS
MOCK_TASKS = [
    {"rowid": 1, "case_folder_id": 1, "task": "Arrest absconding suspect Basavaraj 'Basya'", "completed": False},
    {"rowid": 2, "case_folder_id": 1, "task": "Verify engine and chassis numbers of seized Pulsar KA-11-H-8092", "completed": True},
    {"rowid": 3, "case_folder_id": 1, "task": "Collect forensic fingerprints from jewellery showcase glass", "completed": True},
    {"rowid": 4, "case_folder_id": 1, "task": "Submit charge sheet for Rizwan to Mysuru Magistrate", "completed": False},
    {"rowid": 5, "case_folder_id": 2, "task": "Analyze IP addresses of WhatsApp group admins for Karthik Gowda", "completed": False},
    {"rowid": 6, "case_folder_id": 2, "task": "Verify KYC document proofs for SBI-3304128490 at RT Nagar branch", "completed": True},
    {"rowid": 7, "case_folder_id": 3, "task": "Issue Look-Out Circular (LOC) for Suresh Poojary at Mangaluru airport", "completed": False},
    {"rowid": 8, "case_folder_id": 4, "task": "Submit weapon seizure report for white Creta KA-25-MA-6701", "completed": True}
]
