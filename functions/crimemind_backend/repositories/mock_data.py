from datetime import datetime, timedelta

# Mock Users
MOCK_USERS = [
    {
        "rowid": 1,
        "email": "investigator.raj@ksp.gov.in",
        "username": "Inspector Rajkumar",
        "role": "Investigator",
        "police_id": "KSP-2015-BLR-884",
        "created_time": datetime(2026, 1, 10, 10, 0, 0)
    },
    {
        "rowid": 2,
        "email": "supervisor.patil@ksp.gov.in",
        "username": "ACP Patil",
        "role": "Supervisor",
        "police_id": "KSP-2008-MYS-012",
        "created_time": datetime(2026, 1, 10, 10, 0, 0)
    },
    {
        "rowid": 3,
        "email": "analyst.swati@ksp.gov.in",
        "username": "Swati Deshpande",
        "role": "Analyst",
        "police_id": "KSP-2021-ANA-553",
        "created_time": datetime(2026, 1, 10, 10, 0, 0)
    }
]

# Mock FIRs
MOCK_FIRS = [
    {
        "rowid": 1,
        "fir_number": "FIR/2026/BLR/CYB/041",
        "district": "Bengaluru City",
        "police_station": "Cyber Crime PS",
        "date_registered": datetime(2026, 5, 12, 11, 30, 0),
        "status": "Under Investigation",
        "crime_type": "Cybercrime",
        "description": "Victim reported a phising call from an individual claiming to be a bank official from SBI. The victim was convinced to share a OTP code, leading to an unauthorized transaction of INR 4,50,000 transferred to multiple dummy bank accounts.",
        "modus_operandi": "Vishing (voice phishing) targeting senior citizens, impersonating bank managers, immediate fund transfers to multiple shell accounts followed by ATM withdrawals in local hotspots.",
        "location_lat": 12.9716,
        "location_lng": 77.5946,
        "severity_score": 75
    },
    {
        "rowid": 2,
        "fir_number": "FIR/2026/MYS/DEB/102",
        "district": "Mysuru City",
        "police_station": "Devaraja PS",
        "date_registered": datetime(2026, 5, 20, 3, 15, 0),
        "status": "Pending",
        "crime_type": "Robbery",
        "description": "Armed robbery at a jewellery store in Devaraja Mohalla. Two masked men riding a black Bajaj Pulsar motorcycle entered the store, held the cashier at gunpoint, and looted gold ornaments worth INR 18,00,000 before fleeing towards Outer Ring Road.",
        "modus_operandi": "Recce done 2 days prior, entry with helmets on, threats with country-made pistols, escape on Pulsar motorcycle with fake license plates towards the highway.",
        "location_lat": 12.3086,
        "location_lng": 76.6548,
        "severity_score": 85
    },
    {
        "rowid": 3,
        "fir_number": "FIR/2026/HUB/KESH/154",
        "district": "Hubballi-Dharwad",
        "police_station": "Keshwapur PS",
        "date_registered": datetime(2026, 6, 2, 22, 45, 0),
        "status": "Solved",
        "crime_type": "Assault",
        "description": "A physical altercation broke out near Keshwapur Circle between two groups over a property dispute. Two victims sustained severe injuries from blunt weapons. Accused fled the scene in a white Hyundai Creta.",
        "modus_operandi": "Pre-planned ambush related to property dispute, local gang involvement, assault using iron rods and wooden clubs during night hours.",
        "location_lat": 15.3647,
        "location_lng": 75.1242,
        "severity_score": 60
    },
    {
        "rowid": 4,
        "fir_number": "FIR/2026/BLR/MTH/089",
        "district": "Bengaluru City",
        "police_station": "Malleswaram PS",
        "date_registered": datetime(2026, 6, 15, 14, 0, 0),
        "status": "Under Investigation",
        "crime_type": "Robbery",
        "description": "Daylight chain snatching incident in Malleswaram 15th cross. A woman walking back from temple was targeted by two youngsters on a black motorcycle. They snatched her gold chain weighing 40 grams.",
        "modus_operandi": "Chain snatching, targets lone pedestrians, uses black sporty motorcycles (Pulsar/Apache) without plates or with blurred plates, active in afternoon hours.",
        "location_lat": 12.9961,
        "location_lng": 77.5714,
        "severity_score": 50
    },
    {
        "rowid": 5,
        "fir_number": "FIR/2026/MYS/VVN/077",
        "district": "Mysuru City",
        "police_station": "V V Puram PS",
        "date_registered": datetime(2026, 6, 28, 1, 30, 0),
        "status": "Under Investigation",
        "crime_type": "Robbery",
        "description": "Housebreak theft during midnight at a locked residence in V V Puram. Gold and silver items valued at INR 6,50,000 were stolen while the family was out of town.",
        "modus_operandi": "Locks broken using iron crowbars, active in residential areas during holidays, disabling local CCTV cameras, wear gloves to leave no fingerprints.",
        "location_lat": 12.3283,
        "location_lng": 76.6341,
        "severity_score": 68
    },
    {
        "rowid": 6,
        "fir_number": "FIR/2026/BLR/CYB/059",
        "district": "Bengaluru City",
        "police_station": "Cyber Crime PS",
        "date_registered": datetime(2026, 7, 5, 10, 15, 0),
        "status": "Under Investigation",
        "crime_type": "Cybercrime",
        "description": "A high-profile executive was cheated of INR 12,00,000 in an online investment scam. The accused promised 300% returns via a WhatsApp group and a custom mobile application trading dummy stocks.",
        "modus_operandi": "Crypto/Stock trading scams via WhatsApp groups, fake mobile apps hosted on third-party sites, victim forced to add funds to virtual wallets, money immediately laundered to bank accounts.",
        "location_lat": 12.9784,
        "location_lng": 77.6408,
        "severity_score": 80
    }
]

# Mock Accused
MOCK_ACCUSED = [
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
        "history_repeater": False
    },
    {
        "rowid": 5,
        "fir_id": 4,
        "name": "Kiran Kumar (Linked to Pulsar Gang)",
        "age": 24,
        "phone_number": "+91 9774012569", # Same number as Basavaraj - Link!
        "address": "Srirampura, Bengaluru",
        "status": "Suspect",
        "bank_account": "SBI-440129381",
        "vehicle_plate": "KA-02-JH-1192",
        "history_repeater": True
    },
    {
        "rowid": 6,
        "fir_id": 6,
        "name": "Karthik Gowda", # Same name as Accused 1 (Repeat offender!)
        "age": 28,
        "phone_number": "+91 9884562130",
        "address": "2nd Cross, RT Nagar, Bengaluru",
        "status": "Suspect",
        "bank_account": "SBI-3304128490",
        "vehicle_plate": "KA-04-ME-4412",
        "history_repeater": True
    }
]

# Mock Victims
MOCK_VICTIMS = [
    {
        "rowid": 1,
        "fir_id": 1,
        "name": "Ananthayya Subbarao",
        "age": 67,
        "phone_number": "+91 9448021159",
        "address": "Jayanagar 4th Block, Bengaluru",
        "statement": "I received a phone call from SBI customer care manager who said my KYC has expired. He asked for my card number and then the SMS OTP. Within minutes, SBI sent me messages that money has been withdrawn."
    },
    {
        "rowid": 2,
        "fir_id": 2,
        "name": "Devadas Shetty",
        "age": 52,
        "phone_number": "+91 9845012359",
        "address": "Devaraja Mohalla, Mysuru",
        "statement": "I was at the cash counter when two boys with helmets rushed inside. They pointed a gun at my head and broke the display glass using iron rods, stuffing the gold necklaces in their bags."
    },
    {
        "rowid": 3,
        "fir_id": 3,
        "name": "Gurupadappa K",
        "age": 48,
        "phone_number": "+91 8095112480",
        "address": "Keshwapur, Hubballi",
        "statement": "Somesh and his goons attacked me when I was measuring the land boundary. They beat me with clubs."
    }
]

# Mock Witnesses
MOCK_WITNESSES = [
    {
        "rowid": 1,
        "fir_id": 2,
        "name": "Nagesh Rao",
        "phone_number": "+91 9900213045",
        "address": "Next shop vendor, Devaraja Mohalla, Mysuru",
        "statement": "I saw two men park a black Bajaj Pulsar outside the jewellery shop. They left the engine running, walked inside with helmets, and ran out carrying heavy bags after 5 minutes."
    },
    {
        "rowid": 2,
        "fir_id": 4,
        "name": "Ramu Gowda",
        "phone_number": "+91 9844012903",
        "address": "Malleswaram, Bengaluru",
        "statement": "I was washing my car when I heard a woman scream. I saw a black Pulsar speed past. The pillion rider was holding a gold chain."
    }
]

# Mock Evidence
MOCK_EVIDENCE = [
    {
        "rowid": 1,
        "fir_id": 1,
        "name": "Fraud Call Recording",
        "type": "Audio",
        "description": "Recorded audio call file of the vishing call. Voice matches the suspect Karthik Gowda based on speech analysis comparison.",
        "file_store_id": "file_rec_041.mp3",
        "date_found": datetime(2026, 5, 13, 10, 0, 0)
    },
    {
        "rowid": 2,
        "fir_id": 1,
        "name": "SBI Account Statement",
        "type": "Document",
        "description": "Bank statement indicating the transaction to dummy SBI account SBI-3304128490.",
        "file_store_id": "bank_statement_041.pdf",
        "date_found": datetime(2026, 5, 12, 16, 0, 0)
    },
    {
        "rowid": 3,
        "fir_id": 2,
        "name": "CCTV Footage Devaraja shop",
        "type": "Digital",
        "description": "Video file showing the two suspects entering. One suspect has a tattoo on the right wrist matching Basavaraj.",
        "file_store_id": "cctv_robbery_mys.mp4",
        "date_found": datetime(2026, 5, 20, 18, 30, 0)
    },
    {
        "rowid": 4,
        "fir_id": 4,
        "name": "CCTV Malleswaram Street",
        "type": "Digital",
        "description": "Traffic camera footage showing Bajaj Pulsar license plate KA-02-JH-1192 escaping.",
        "file_store_id": "traffic_cam_mth.mp4",
        "date_found": datetime(2026, 6, 16, 9, 15, 0)
    }
]

# Mock Vehicles
MOCK_VEHICLES = [
    {
        "rowid": 1,
        "plate_number": "KA-11-H-8092",
        "model": "Bajaj Pulsar 150",
        "color": "Black",
        "owner_name": "Basavaraj",
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
    }
]

# Mock Phones
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
        "owner_name": "Basavaraj",
        "associated_fir_id": 2
    }
]

# Mock Bank Accounts
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
        "holder_name": "Basavaraj",
        "associated_fir_id": 2
    }
]

# Mock Case Folders
MOCK_CASE_FOLDERS = [
    {
        "rowid": 1,
        "title": "Mysuru Gold Robbery Pulsar Gang",
        "summary": "Investigation into the armed robbery at Devaraja jewellery shop and related chain snatching incidents utilizing a black Pulsar motorcycle. Key suspect Basavaraj is absconding, and his mobile number links him to another active chain-snatching suspect Kiran Kumar.",
        "status": "Active",
        "risk_score": 85,
        "created_time": datetime(2026, 5, 21, 10, 0, 0),
        "court_status": "Charge sheet being prepared. Suspect Basavaraj still at large. Rizwan is in judicial custody.",
        "evidence_confidence": 0.88
    },
    {
        "rowid": 2,
        "title": "RT Nagar Phishing & Online Scams",
        "summary": "Covers vishing fraud cases targeting elder citizens in Bengaluru City, where victims transfer funds to SBI-3304128490 linked to Karthik Gowda, a repeat cyber offender.",
        "status": "Active",
        "risk_score": 78,
        "created_time": datetime(2026, 5, 14, 9, 30, 0),
        "court_status": "FIR registered, bank accounts frozen. Karthik Gowda under surveillance.",
        "evidence_confidence": 0.94
    }
]

# Mapping Case Folder to FIRs (Many-to-Many)
MOCK_CASE_FOLDER_FIR_MAPPINGS = [
    {"rowid": 1, "case_folder_id": 1, "fir_id": 2}, # Devaraja Jewellery Robbery
    {"rowid": 2, "case_folder_id": 1, "fir_id": 4}, # Malleswaram Chain Snatching (same Pulsar gang patterns)
    {"rowid": 3, "case_folder_id": 1, "fir_id": 5}, # V V Puram Housebreak (robbery pattern)
    {"rowid": 4, "case_folder_id": 2, "fir_id": 1}, # Cybercrime SBI OTP scam
    {"rowid": 5, "case_folder_id": 2, "fir_id": 6}  # Cybercrime investment scam (same suspect Karthik Gowda)
]

# Mock Officer Notes
MOCK_OFFICER_NOTES = [
    {
        "rowid": 1,
        "case_folder_id": 1,
        "user_id": 1,
        "note_content": "CCTV footage matches the scar on Basavaraj's hand. Tower dump from nearby cell tower shows suspect's phone +91 9774012569 was active near the jewellery shop at 3:10 PM, just 5 minutes before registration.",
        "created_time": datetime(2026, 5, 22, 14, 20, 0)
    },
    {
        "rowid": 2,
        "case_folder_id": 1,
        "user_id": 1,
        "note_content": "Informed by informant that Basavaraj was spotted near Mandya. Tracking his known associates.",
        "created_time": datetime(2026, 5, 25, 11, 0, 0)
    },
    {
        "rowid": 3,
        "case_folder_id": 2,
        "user_id": 1,
        "note_content": "SBI account has been frozen. Total amount locked is INR 2,80,000. IP log of the transaction links back to a router in RT Nagar.",
        "created_time": datetime(2026, 5, 16, 17, 45, 0)
    }
]

# Mock Tasks for Case Folder
MOCK_TASKS = [
    {"rowid": 1, "case_folder_id": 1, "task": "Arrest absconding suspect Basavaraj", "completed": False},
    {"rowid": 2, "case_folder_id": 1, "task": "Verify engine and chassis numbers of seized Bajaj Pulsar", "completed": True},
    {"rowid": 3, "case_folder_id": 1, "task": "Collect forensic fingerprints from jewellery showcase", "completed": True},
    {"rowid": 4, "case_folder_id": 1, "task": "Submit charge sheet for Rizwan to magistrate", "completed": False},
    {"rowid": 5, "case_folder_id": 2, "task": "Analyze IP addresses of WhatsApp group administrators", "completed": False},
    {"rowid": 6, "case_folder_id": 2, "task": "Verify identities of KYC documents for SBI-3304128490", "completed": True}
]
