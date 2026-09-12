/**
 * fptuFaculties.ts — SINH TỰ ĐỘNG bởi scripts/academy-gen-faculties.py.
 * Khối ngành ngoài CNTT (Kinh doanh, Truyền thông, Ngôn ngữ, KHMT) cho onboarding
 * /academy: Khối → Ngành chính → Ngành hẹp → khung 9 kỳ RIÊNG (để LỌC đúng môn).
 * Nguồn: FLM CurriculumDetails (khoá mới nhất mỗi chuyên ngành). ĐỪNG sửa tay —
 * chạy lại generator. Khối CNTT dùng FPTU_MAJORS ở fptuCurriculum.ts (có combo riêng).
 */
export interface FacultyCombo { id: string; code: string; nameVi: string; name: string; icon: string; semesters: Record<number, string[]>; }
export interface FacultyMajor { id: string; nameVi: string; name: string; icon: string; combos: FacultyCombo[]; }
export interface Faculty { id: string; nameVi: string; name: string; icon: string; majors: FacultyMajor[]; }

export const EXTRA_FACULTIES: Faculty[] = [
  {
    "id": "business",
    "nameVi": "Quản trị Kinh doanh",
    "name": "Business Administration",
    "icon": "💼",
    "majors": [
      {
        "id": "bba",
        "nameVi": "Quản trị Kinh doanh",
        "name": "Business Administration",
        "icon": "💼",
        "combos": [
          {
            "id": "bba_ba",
            "code": "BBA_BA",
            "nameVi": "Phân tích kinh doanh",
            "name": "Phân tích kinh doanh",
            "icon": "📊",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENM402",
                "FIN202",
                "MMG301",
                "OBE102c"
              ],
              "3": [
                "BCP201",
                "BDT202c",
                "HRM202c",
                "MAS202",
                "OPM301"
              ],
              "4": [
                "CHN113",
                "LDS301",
                "SMG301",
                "SSG105",
                "TBI301c"
              ],
              "5": [
                "BDA201",
                "CHN123",
                "LQM301c",
                "SSN302",
                "STM301"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "REM301"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_bf",
            "code": "BBA_BF",
            "nameVi": "Ngân hàng & Tài chính",
            "name": "Ngân hàng & Tài chính",
            "icon": "🏛️",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "BDF201",
                "ECO121",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "BFT201",
                "FIN301",
                "FIN303",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "CHN113",
                "DTF201c",
                "IBF301",
                "IIP301",
                "RMB301"
              ],
              "5": [
                "BFC301",
                "BFD301",
                "CHN123",
                "FIN406",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "BFL301",
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_bsa",
            "code": "BBA_BSA",
            "nameVi": "Phân tích hệ thống KD",
            "name": "Phân tích hệ thống KD",
            "icon": "📈",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MGT103",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENM402",
                "FIN202",
                "MKT101",
                "OBE102c"
              ],
              "3": [
                "HRM202c",
                "IBA201",
                "MAS202",
                "PBA301",
                "STM301"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "DMD301",
                "DTM301",
                "SSG105"
              ],
              "5": [
                "ABI301c",
                "CHN123",
                "DBD301",
                "IDV301",
                "MLA301"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB302"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_cf",
            "code": "BBA_CF",
            "nameVi": "Tài chính doanh nghiệp",
            "name": "Tài chính doanh nghiệp",
            "icon": "🏦",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "BCP201",
                "ECO121",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "FAC201",
                "FIN201",
                "FIN303",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "ACC302",
                "CHN113",
                "DTF201c",
                "FIN301",
                "RMB302"
              ],
              "5": [
                "ACC305",
                "CHN123",
                "FIM302c",
                "FIN402",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LEI201"
              ],
              "8": [
                "BKG303",
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_cx",
            "code": "BBA_CX",
            "nameVi": "Trải nghiệm khách hàng",
            "name": "Trải nghiệm khách hàng",
            "icon": "🤝",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "EEM201",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "EEP201",
                "EET201",
                "ETM201",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "BDT202c",
                "CDM201",
                "CHN113",
                "GAD201",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "EPO201",
                "ERM301c",
                "ESP201",
                "STE301"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "REM301"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_ec",
            "code": "BBA_EC",
            "nameVi": "Thương mại điện tử",
            "name": "Thương mại điện tử",
            "icon": "🛒",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MGT103",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENM402",
                "FIN202",
                "MKT101",
                "OBE102c"
              ],
              "3": [
                "EDB201",
                "EEC101",
                "HRM202c",
                "MAS202",
                "SCM303"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "EDA301",
                "PSE301",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "EAI201",
                "EDC301",
                "EDE201c",
                "ESM301"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB302"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_ee",
            "code": "BBA_EE",
            "nameVi": "Giải trí & Sự kiện",
            "name": "Giải trí & Sự kiện",
            "icon": "🎉",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "EEM201",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "EEP201",
                "EET201",
                "ETM201",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "BDT202c",
                "CDM201",
                "CHN113",
                "GAD201",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "EPO201",
                "ERM301c",
                "ESP201",
                "STE301"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "REM301"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_fin",
            "code": "BBA_FIN",
            "nameVi": "Tài chính",
            "name": "Tài chính",
            "icon": "💰",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "BCP201",
                "ECO121",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "FAC201",
                "FIN201",
                "FIN303",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "ACC302",
                "CHN113",
                "DTF201c",
                "FIN301",
                "RMB302"
              ],
              "5": [
                "ACC305",
                "CHN123",
                "FIM302c",
                "FIN402",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LEI201"
              ],
              "8": [
                "BKG303",
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_ft",
            "code": "BBA_FT",
            "nameVi": "Công nghệ tài chính (Fintech)",
            "name": "Công nghệ tài chính (Fintech)",
            "icon": "💳",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "BCP201",
                "ECO121",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "BDA201",
                "FIN301",
                "HRM202c",
                "MAS202",
                "MCL201"
              ],
              "4": [
                "BDF201",
                "CHN113",
                "EPT301",
                "ITA203c",
                "RMB302"
              ],
              "5": [
                "CHN123",
                "FIN402",
                "LAW102",
                "PMG201c",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "FRM301"
              ],
              "8": [
                "EXE201",
                "FRE201",
                "IPM301",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_gl",
            "code": "BBA_GL",
            "nameVi": "Logistics & Chuỗi cung ứng",
            "name": "Logistics & Chuỗi cung ứng",
            "icon": "🚚",
            "semesters": {
              "1": [
                "ACC101",
                "ECO102",
                "ENM302",
                "MGT103",
                "SSA101"
              ],
              "2": [
                "ENM402",
                "FIN202",
                "MKT101",
                "OBE102c",
                "SCM202"
              ],
              "3": [
                "GLI202",
                "GLT301",
                "HRM202c",
                "MAS202",
                "SCM302"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "GLA301",
                "GSF301",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "GLC301",
                "GLH301",
                "SAP312",
                "SSB201"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB302"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_hm",
            "code": "BBA_HM",
            "nameVi": "Quản trị khách sạn",
            "name": "Quản trị khách sạn",
            "icon": "🏨",
            "semesters": {
              "1": [
                "ENH301",
                "EVP201",
                "HMO102",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "ACC101",
                "CIH201",
                "ENH401",
                "LOD213",
                "OBE102c"
              ],
              "3": [
                "ECO102",
                "FIN202",
                "HRM202c",
                "IBC201",
                "RES223"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "FBO201",
                "LOD222",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "MKT208c"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "GEM201",
                "HOM301c",
                "MAS202"
              ],
              "8": [
                "EXE201",
                "LAW102",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB301"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_ib",
            "code": "BBA_IB",
            "nameVi": "Kinh doanh quốc tế",
            "name": "Kinh doanh quốc tế",
            "icon": "🌐",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENM402",
                "FIN202",
                "IBI101",
                "OBE102c"
              ],
              "3": [
                "ECO201",
                "HRM202c",
                "IBC201",
                "IOM201",
                "MAS202"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "IBF301",
                "SCM202",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "EEC101",
                "IBS301m",
                "IEI301",
                "MKT205c"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB301"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_if",
            "code": "BBA_IF",
            "nameVi": "Tài chính (Đầu tư)",
            "name": "Tài chính (Đầu tư)",
            "icon": "💱",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "BCP201",
                "ECO121",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "FIN303",
                "FIN305",
                "FLE201",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "ALI301",
                "CHN113",
                "FIN402",
                "ITA203c",
                "RMB302"
              ],
              "5": [
                "BDA201",
                "CHN123",
                "IFI301",
                "PSF201",
                "SSG104"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "FMR301"
              ],
              "8": [
                "AAP301",
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_mc",
            "code": "BBA_MC",
            "nameVi": "Truyền thông Marketing",
            "name": "Truyền thông Marketing",
            "icon": "📢",
            "semesters": {
              "1": [
                "DTG111",
                "MED201",
                "MGT103",
                "MKT101",
                "SSL101c"
              ],
              "2": [
                "ACC101",
                "CMC201c",
                "IPR102",
                "MMP201",
                "SSG104"
              ],
              "3": [
                "IMC301c",
                "PFD201",
                "RMC301",
                "SDP201",
                "WMC201"
              ],
              "4": [
                "CCO201",
                "CHN113",
                "MCO201c",
                "MPL201",
                "VDP301"
              ],
              "5": [
                "CHN123",
                "ENW492c",
                "MCO302",
                "PRE301"
              ],
              "6": [
                "OJB202",
                "PMG201c"
              ],
              "7": [
                "BRA301",
                "EVN301",
                "EXE101"
              ],
              "8": [
                "CCM301",
                "EXE201",
                "MEP301",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_mkt",
            "code": "BBA_MKT",
            "nameVi": "Marketing",
            "name": "Marketing",
            "icon": "📣",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MGT103",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENM402",
                "FIN202",
                "MKT101",
                "OBE102c"
              ],
              "3": [
                "DMS302m",
                "DTG111",
                "MAS202",
                "MKT201",
                "MKT208c"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "MKT202",
                "MKT304",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "DMA302m",
                "EEC101",
                "HRM202c",
                "SAL301"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MKT301",
                "MLN111",
                "MLN122",
                "PMG201c"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_pm",
            "code": "BBA_PM",
            "nameVi": "Quản trị thu mua",
            "name": "Quản trị thu mua",
            "icon": "📦",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MGT103",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENM402",
                "FIN202",
                "MKT101",
                "OBE102c"
              ],
              "3": [
                "HRM202c",
                "MAS202",
                "PCM301",
                "SCM202",
                "TPM301"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "IVM301",
                "SCM201",
                "SSG105"
              ],
              "5": [
                "CHN123",
                "CTM201c",
                "EFP301",
                "PSS301",
                "SSN302"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB302"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_sf",
            "code": "BBA_SF",
            "nameVi": "Tài chính thông minh",
            "name": "Tài chính thông minh",
            "icon": "🤖",
            "semesters": {
              "1": [
                "ACC101",
                "ECO111",
                "ENM302",
                "MKG101",
                "SSA101"
              ],
              "2": [
                "BCP201",
                "ECO121",
                "ENM402",
                "FIN202",
                "OBE102c"
              ],
              "3": [
                "ATA301",
                "FIN303",
                "FLE201",
                "HRM202c",
                "MAS202"
              ],
              "4": [
                "ALI301",
                "CHN113",
                "ITA203c",
                "RMB302",
                "RMI301"
              ],
              "5": [
                "BDA201",
                "CHN123",
                "FIN402",
                "FTP301",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "FMS301"
              ],
              "8": [
                "AAP301",
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bba_tm",
            "code": "BBA_TM",
            "nameVi": "Du lịch & Lữ hành",
            "name": "Du lịch & Lữ hành",
            "icon": "✈️",
            "semesters": {
              "1": [
                "ECO102",
                "ENH301",
                "HMO102",
                "MGT103",
                "SSA101"
              ],
              "2": [
                "ACC101",
                "ENH401",
                "EVP201",
                "OBE102c",
                "VNC104"
              ],
              "3": [
                "FIN202",
                "HRM202c",
                "MKT101",
                "TTG201",
                "TTM201"
              ],
              "4": [
                "BDT202c",
                "CHN113",
                "MAS202",
                "SSG105",
                "TTD202"
              ],
              "5": [
                "CHN123",
                "TTM202",
                "TTM203"
              ],
              "6": [
                "ENW492c",
                "OJB202"
              ],
              "7": [
                "EXE101",
                "LAW102",
                "MKT208c",
                "SSB201"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "PMG201c",
                "RMB301"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "id": "communication",
    "nameVi": "Công nghệ Truyền thông",
    "name": "Communication Technology",
    "icon": "📺",
    "majors": [
      {
        "id": "bct",
        "nameVi": "Công nghệ Truyền thông",
        "name": "Communication Technology",
        "icon": "📺",
        "combos": [
          {
            "id": "bct_bc",
            "code": "BCT_BC",
            "nameVi": "Truyền thông thương hiệu",
            "name": "Truyền thông thương hiệu",
            "icon": "🏷️",
            "semesters": {
              "1": [
                "BDT201c",
                "CHN113",
                "ISM201",
                "MMK101",
                "SSA101"
              ],
              "2": [
                "BRA201",
                "CHN123",
                "DET101c",
                "MKT201",
                "RMC301"
              ],
              "3": [
                "ABA201c",
                "BRA301",
                "CAD301",
                "LAE101",
                "MCO302"
              ],
              "4": [
                "AVP201",
                "DSB301c",
                "MPL201",
                "SCO301",
                "SLN301"
              ],
              "5": [
                "BMO301",
                "BPD301",
                "GPM201c",
                "PRE301",
                "SSG105"
              ],
              "6": [
                "MSM201c",
                "OCT202"
              ],
              "7": [
                "BEX301",
                "EXE101",
                "MEP301"
              ],
              "8": [
                "CRM301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bct_imc",
            "code": "BCT_IMC",
            "nameVi": "Truyền thông Marketing tích hợp",
            "name": "Truyền thông Marketing tích hợp",
            "icon": "📡",
            "semesters": {
              "1": [
                "BDT201c",
                "CHN113",
                "ECO102",
                "MMK101",
                "SSA101"
              ],
              "2": [
                "CHN123",
                "DET101c",
                "IMC201",
                "MKR301",
                "MKT201"
              ],
              "3": [
                "ABA201c",
                "BRA301",
                "CAD301",
                "EPL201",
                "MDA301"
              ],
              "4": [
                "CSB201",
                "IBF201",
                "MCM301",
                "SRM201c",
                "WMC201"
              ],
              "5": [
                "GPM201c",
                "MJC301",
                "OCM301",
                "PRE301",
                "SSG105"
              ],
              "6": [
                "DME201c",
                "OCT202"
              ],
              "7": [
                "CCP301",
                "EVN301",
                "EXE101"
              ],
              "8": [
                "EXE201",
                "IGI301",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bct_mc",
            "code": "BCT_MC",
            "nameVi": "Truyền thông đa phương tiện",
            "name": "Truyền thông đa phương tiện",
            "icon": "🎬",
            "semesters": {
              "1": [
                "BDT201c",
                "CHN113",
                "ISM201",
                "MMK101",
                "SSA101"
              ],
              "2": [
                "CHN123",
                "DET101c",
                "DTG111",
                "MMP201"
              ],
              "3": [
                "ABA201c",
                "AVP201",
                "IMC301",
                "LAE101",
                "MCO302"
              ],
              "4": [
                "CCO201",
                "CSP201m",
                "DPS201c",
                "MPL201",
                "WMC201"
              ],
              "5": [
                "BRA201",
                "GPM201c",
                "PRE301",
                "SSG105",
                "VDP301"
              ],
              "6": [
                "MSM201c",
                "OCT202"
              ],
              "7": [
                "EVN301",
                "EXE101",
                "MEP301"
              ],
              "8": [
                "CRM301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bct_pr",
            "code": "BCT_PR",
            "nameVi": "Quan hệ công chúng",
            "name": "Quan hệ công chúng",
            "icon": "🗣️",
            "semesters": {
              "1": [
                "BDT201c",
                "CHN113",
                "ISM201",
                "MMK101",
                "SSA101"
              ],
              "2": [
                "CHN123",
                "LSC201c",
                "MMP201",
                "WDA201"
              ],
              "3": [
                "ABA201c",
                "CSP202m",
                "IMC301",
                "LAE101",
                "MCO302"
              ],
              "4": [
                "CCO201",
                "DPS201c",
                "MPL201",
                "PRE203",
                "PRW301"
              ],
              "5": [
                "BRA301",
                "GPM201c",
                "MPR201",
                "PRE301",
                "SSG105"
              ],
              "6": [
                "MSM201c",
                "OCT202"
              ],
              "7": [
                "AMM301",
                "EVN205",
                "EXE101"
              ],
              "8": [
                "CRM301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "id": "language",
    "nameVi": "Ngôn ngữ",
    "name": "Languages",
    "icon": "🗣️",
    "majors": [
      {
        "id": "ben",
        "nameVi": "Ngôn ngữ Anh",
        "name": "English Language",
        "icon": "🇬🇧",
        "combos": [
          {
            "id": "ben_be",
            "code": "BEN_BE",
            "nameVi": "Tiếng Anh thương mại",
            "name": "Tiếng Anh thương mại",
            "icon": "💬",
            "semesters": {
              "1": [
                "CHN113",
                "ECR302",
                "ENG303",
                "ENP203",
                "SSA101"
              ],
              "2": [
                "CHN123",
                "EAW301",
                "ECB101",
                "EMC201c",
                "LTG301"
              ],
              "3": [
                "ECO102",
                "EIC301",
                "ERW413",
                "LIT302",
                "SSC302m"
              ],
              "4": [
                "ELG201",
                "ELI302",
                "ELT302",
                "EMK201",
                "OBE102c"
              ],
              "5": [
                "ELI402",
                "ELT402",
                "MKG101",
                "SCM202",
                "SSG105"
              ],
              "6": [
                "EPE301c",
                "OJE202"
              ],
              "7": [
                "BDT201c",
                "ESL301",
                "EXE101"
              ],
              "8": [
                "ELR301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "ben_chn",
            "code": "BEN_CHN",
            "nameVi": "Anh — Tiếng Trung",
            "name": "Anh — Tiếng Trung",
            "icon": "🀄",
            "semesters": {
              "1": [
                "CHI111",
                "CHS111",
                "ENG303",
                "ENP102",
                "SSL101c"
              ],
              "2": [
                "CHI121",
                "CHS121",
                "EAW301",
                "ECR301",
                "SSG104"
              ],
              "3": [
                "CHI311",
                "ERW412",
                "LTG202",
                "SSC302m"
              ],
              "4": [
                "CHI321",
                "CHS211",
                "ECC302c",
                "ERW422",
                "SEM101"
              ],
              "5": [
                "CHI331",
                "ELI302",
                "ELT302",
                "ENB302",
                "ESL101"
              ],
              "6": [
                "EPE301c",
                "OJE202"
              ],
              "7": [
                "ELI402",
                "ELT402",
                "EXE101"
              ],
              "8": [
                "ELR301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "ben_el",
            "code": "BEN_EL",
            "nameVi": "Anh — Giảng dạy",
            "name": "Anh — Giảng dạy",
            "icon": "🎓",
            "semesters": {
              "1": [
                "CHN113",
                "ECR302",
                "ENG303",
                "ENP203",
                "SSA101"
              ],
              "2": [
                "CHN123",
                "EAL202c",
                "EAW301",
                "LTG301",
                "VNC104"
              ],
              "3": [
                "ECB101",
                "EMP301",
                "ERW413",
                "LIT302",
                "SSC302m"
              ],
              "4": [
                "ECC302c",
                "ELI302",
                "ELT302",
                "ERW423",
                "EST301"
              ],
              "5": [
                "ELI402",
                "ELT402",
                "ENB302",
                "SEM301",
                "SSG105"
              ],
              "6": [
                "EPE301c",
                "OJE202"
              ],
              "7": [
                "EPG301",
                "ESL301",
                "EXE101"
              ],
              "8": [
                "ELR301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "ben_eng",
            "code": "BEN_ENG",
            "nameVi": "Ngôn ngữ Anh",
            "name": "Ngôn ngữ Anh",
            "icon": "🇬🇧",
            "semesters": {
              "1": [
                "EAW212",
                "ECR202",
                "ENG303",
                "ENP102",
                "SSL101c"
              ],
              "2": [
                "EAL202c",
                "EAW222",
                "ECB101",
                "LTG202",
                "SSG104"
              ],
              "3": [
                "CHN113",
                "ERW412",
                "LIT301",
                "SEM101",
                "SSC302c"
              ],
              "4": [
                "CHN123",
                "ECC302c",
                "EPC301",
                "ERW422",
                "ESL101"
              ],
              "5": [
                "EBC301c",
                "ELI302",
                "ELT302",
                "ENB302",
                "VNC104"
              ],
              "6": [
                "EPE301c",
                "OJE202"
              ],
              "7": [
                "ELI402",
                "ELT402",
                "EXE101"
              ],
              "8": [
                "ELR301",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      },
      {
        "id": "bjp",
        "nameVi": "Ngôn ngữ Nhật",
        "name": "Japanese Language",
        "icon": "🎌",
        "combos": [
          {
            "id": "bjp_en",
            "code": "BJP_EN",
            "nameVi": "Ngôn ngữ Nhật",
            "name": "Ngôn ngữ Nhật",
            "icon": "🎌",
            "semesters": {
              "1": [
                "JPD116",
                "JPD126",
                "SSA101"
              ],
              "2": [
                "ENP102",
                "JPD216",
                "JPD226"
              ],
              "3": [
                "ECR301",
                "ENG303",
                "JPD316",
                "JPD326"
              ],
              "4": [
                "EAW301",
                "JPD336",
                "JPD346"
              ],
              "5": [
                "JIP301",
                "JSC301m",
                "JST301",
                "SSC302m",
                "SSG104"
              ],
              "6": [
                "ENW492c",
                "OJP202"
              ],
              "7": [
                "EXE101",
                "JJB391",
                "JLR302"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      },
      {
        "id": "bkr",
        "nameVi": "Ngôn ngữ Hàn",
        "name": "Korean Language",
        "icon": "🇰🇷",
        "combos": [
          {
            "id": "bkr_bk",
            "code": "BKR_BK",
            "nameVi": "Ngôn ngữ Hàn",
            "name": "Ngôn ngữ Hàn",
            "icon": "🇰🇷",
            "semesters": {
              "1": [
                "ECO111",
                "KRL112",
                "LAW102",
                "SSA101"
              ],
              "2": [
                "ECO121",
                "ENW492c",
                "KRL122",
                "MKT101"
              ],
              "3": [
                "KRL212",
                "KRL222",
                "SCM202"
              ],
              "4": [
                "KEG301",
                "KRL312",
                "KRL322"
              ],
              "5": [
                "KCC401",
                "KCL401",
                "KRL402",
                "SSG105"
              ],
              "6": [
                "KLR301c",
                "OJK202"
              ],
              "7": [
                "EXE101",
                "KBL401",
                "KRL502"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bkr_en",
            "code": "BKR_EN",
            "nameVi": "Hàn — Song ngữ Anh",
            "name": "Hàn — Song ngữ Anh",
            "icon": "🗨️",
            "semesters": {
              "1": [
                "ENG303",
                "ENP102",
                "KRL112",
                "SSA101"
              ],
              "2": [
                "EAW301",
                "ECR301",
                "KRL122",
                "SSC302m"
              ],
              "3": [
                "KOS301",
                "KRL212",
                "KRL222"
              ],
              "4": [
                "KIL301",
                "KRL312",
                "KRL322"
              ],
              "5": [
                "KAW402",
                "KLP401",
                "KRL402",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJK202"
              ],
              "7": [
                "EXE101",
                "KRL502",
                "KST401"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      },
      {
        "id": "bch",
        "nameVi": "Ngôn ngữ Trung",
        "name": "Chinese Language",
        "icon": "🇨🇳",
        "combos": [
          {
            "id": "bch_bc",
            "code": "BCH_BC",
            "nameVi": "Trung — Thương mại",
            "name": "Trung — Thương mại",
            "icon": "🧧",
            "semesters": {
              "1": [
                "CIC101",
                "CIC102",
                "CLS101",
                "CRW101",
                "SSA101"
              ],
              "2": [
                "CIC301",
                "CIC302",
                "CLS201",
                "CRW201"
              ],
              "3": [
                "CAV301",
                "CIB301",
                "CIC303",
                "CLS301",
                "CRW301"
              ],
              "4": [
                "CAV401",
                "CCT401",
                "CIB401",
                "CIN401",
                "CPL401",
                "EEC101"
              ],
              "5": [
                "CBC401",
                "CCB401",
                "CCS401",
                "CCT402",
                "CHG401",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJT202"
              ],
              "7": [
                "CEM501",
                "CME501",
                "EXE101"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bch_cl",
            "code": "BCH_CL",
            "nameVi": "Ngôn ngữ Trung",
            "name": "Ngôn ngữ Trung",
            "icon": "🇨🇳",
            "semesters": {
              "1": [
                "CIC101",
                "CIC102",
                "CLS101",
                "CRW101",
                "SSA101"
              ],
              "2": [
                "CIC301",
                "CIC302",
                "CLS201",
                "CRW201"
              ],
              "3": [
                "CAV301",
                "CIC303",
                "CLS301",
                "CRW301",
                "LTG201"
              ],
              "4": [
                "CAV401",
                "CBC401",
                "CCT401",
                "CIC401",
                "CPL401"
              ],
              "5": [
                "CCI401",
                "CCL401",
                "CCS401",
                "CCT402",
                "CHG401",
                "SSG105"
              ],
              "6": [
                "ENW492c",
                "OJT202"
              ],
              "7": [
                "CCC501",
                "CCV501",
                "EXE101"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bch_en",
            "code": "BCH_EN",
            "nameVi": "Trung — Song ngữ Anh",
            "name": "Trung — Song ngữ Anh",
            "icon": "💠",
            "semesters": {
              "1": [
                "CHI111",
                "CHI121",
                "CHS111",
                "SSA101"
              ],
              "2": [
                "CHI311",
                "CHS121",
                "ENP102"
              ],
              "3": [
                "CHI321",
                "CHI331",
                "CHS201",
                "ECR301",
                "ENG303"
              ],
              "4": [
                "CHI401",
                "CHS301",
                "CPL401",
                "EAW301"
              ],
              "5": [
                "CHC401",
                "CHG401c",
                "CHS401",
                "CTI401",
                "SSG104"
              ],
              "6": [
                "ENW492c",
                "OJC202"
              ],
              "7": [
                "CRM401",
                "EXE101",
                "SSC302m"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "id": "cs",
    "nameVi": "Khoa học Máy tính",
    "name": "Computer Science",
    "icon": "🧠",
    "majors": [
      {
        "id": "bcs",
        "nameVi": "Khoa học Máy tính",
        "name": "Computer Science",
        "icon": "🧠",
        "combos": [
          {
            "id": "bcs_ad",
            "code": "BCS_AD",
            "nameVi": "AI & Khoa học dữ liệu",
            "name": "AI & Khoa học dữ liệu",
            "icon": "🧠",
            "semesters": {
              "1": [
                "CAL111",
                "ICS102",
                "IPY111",
                "MAD102",
                "PFP191"
              ],
              "2": [
                "CAL121",
                "CSD203",
                "MLT201",
                "PSI221",
                "QTC211"
              ],
              "3": [
                "AIL303m",
                "CVO201",
                "DSI201",
                "IDB201",
                "JPD113"
              ],
              "4": [
                "CVI301",
                "DAM311",
                "DPL302m",
                "JPD123",
                "QTM321"
              ],
              "5": [
                "DAM321",
                "DPY391",
                "ENW493c",
                "NLP401"
              ],
              "6": [
                "ITE303c",
                "OJT202"
              ],
              "7": [
                "AMA401",
                "EXE101",
                "GAI401"
              ],
              "8": [
                "EXE201",
                "MLN111",
                "MLN122",
                "MLO401"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          },
          {
            "id": "bcs_cd",
            "code": "BCS_CD",
            "nameVi": "An ninh mạng & An toàn số",
            "name": "An ninh mạng & An toàn số",
            "icon": "🛡️",
            "semesters": {
              "1": [
                "CAL111",
                "CEA103",
                "ICS101",
                "MAD102",
                "PFP191"
              ],
              "2": [
                "APO202",
                "DBI202",
                "MLT201",
                "NWC204",
                "OSG203"
              ],
              "3": [
                "CSD204",
                "IPY111",
                "JPD113",
                "PRS201",
                "SPF291"
              ],
              "4": [
                "AIS201",
                "CAC301",
                "IAM303",
                "JPD123",
                "PWD301"
              ],
              "5": [
                "CSO301",
                "FRS302",
                "ITE304",
                "MAW301"
              ],
              "6": [
                "LCT301c",
                "OJT202"
              ],
              "7": [
                "CLC301c",
                "EXE101",
                "HOD402",
                "RMC301",
                "SPM401"
              ],
              "8": [
                "DAA401",
                "EXE201",
                "MLN111",
                "MLN122"
              ],
              "9": [
                "HCM202",
                "MLN131",
                "VNR202"
              ]
            }
          }
        ]
      }
    ]
  }
];

