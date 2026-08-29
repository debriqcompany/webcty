import { Project, ServiceItem, Partner, PageContent, CompanySettings } from '../src/types';

export const initialCompanySettings: CompanySettings = {
  brandName: 'DEBRIQ',
  legalName: 'CÔNG TY TNHH KỸ THUẬT DEBRIQ',
  foundedYear: '2022',
  activeStatement: {
    vi: 'Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022',
    en: 'DEBRIQ engineering team has been operating since 2022'
  },
  hotline: '0983 147 456',
  zalo: '0983 147 456',
  email: 'contact@debriq.vn',
  address: '71 Quốc Lộ 13, Tổ 2, Khu Phố Bàu Bàng, Xã Bàu Bàng, Thành phố Hồ Chí Minh',
  engineersCount: '5+ Kỹ sư',
  collaboratorsCount: '25+ Cộng tác viên',
  tools: ['AutoCAD', 'Revit', 'KataPro'],
  primaryColor: '#F27D26',
  workingPrinciples: [
    {
      vi: 'Kinh nghiệm phối hợp và triển khai công việc trong hệ thống các tổng thầu lớn.',
      en: 'Extensive coordination and execution experience within tier-1 general contractor systems.'
    },
    {
      vi: 'Khả năng phối hợp hiệu quả với Ban chỉ huy công trường, tổng thầu, nhà thầu liên quan và các bộ phận thiết kế/kỹ thuật trong quá trình xử lý hồ sơ.',
      en: 'Seamless field-level coordination with Site Management, Main Contractors, Subcontractors, and Design/Technical teams.'
    },
    {
      vi: 'Mô hình kết hợp đội ngũ nòng cốt và mạng lưới cộng tác viên chuyên môn, cho phép mở rộng nguồn lực linh hoạt theo quy mô và tiến độ từng dự án.',
      en: 'Agile core-team plus specialized collaborator network model, scalable to urgent project deadlines and massive volumes.'
    }
  ]
};

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    slug: 'structural-shopdrawing',
    title: {
      vi: 'Shopdrawing kết cấu',
      en: 'Structural Shopdrawing'
    },
    subtitle: {
      vi: 'Triển khai bản vẽ Shopdrawing kết cấu bê tông cốt thép phục vụ thi công dựa trên hồ sơ thiết kế được phê duyệt.',
      en: 'Detailed reinforced concrete shopdrawings for construction execution based on approved design documentation.'
    },
    description: {
      vi: 'DEBRIQ thực hiện bóc tách, mô hình hóa chi tiết cốt thép, bê tông, chi tiết nút khung, cấu kiện dầm, cột, sàn, vách, móng và hệ kết cấu phức tạp. Đảm bảo tuân thủ tiêu chuẩn kỹ thuật, tối ưu hóa hao hụt thép và đáp ứng nhịp điệu đổ bê tông tại công trường.',
      en: 'Comprehensive rebar detailing, concrete geometry, beam-column joint schedules, foundation systems, and complex structural elements optimized for zero site clashes and minimal steel scrap rate.'
    },
    deliverables: [
      {
        vi: 'Bản vẽ mặt bằng bố trí cốt thép móng, cột, vách, dầm, sàn các tầng',
        en: 'Rebar layout plans for foundations, columns, shear walls, beams, and floor slabs'
      },
      {
        vi: 'Bản vẽ chi tiết gia công uốn cắt thép (Bar Bending Schedule - BBS)',
        en: 'Detailed Bar Bending Schedules (BBS) and cutting lists'
      },
      {
        vi: 'Bản vẽ chi tiết các vị trí nút khung, dầm chuyển, lỗ mở kỹ thuật đặc biệt',
        en: 'Detail drawings for transfer beams, complex frame joints, and heavy MEP penetrations'
      },
      {
        vi: 'Hồ sơ kiểm soát mạch ngừng thi công và chia đợt đổ bê tông',
        en: 'Construction joint layout and concrete pouring phase documentation'
      }
    ],
    methodologies: [
      {
        vi: 'Phân tích xung đột cốt thép mật độ cao tại các nút dầm - cột - vách',
        en: 'High-density rebar congestion analysis at beam-column-wall intersections'
      },
      {
        vi: 'Tối ưu hóa chiều dài thanh thép theo modun thương phẩm 11.7m',
        en: 'Standard commercial 11.7m rebar length optimization to reduce scrap cut waste'
      },
      {
        vi: 'Phối hợp trực tiếp với Ban chỉ huy để điều chỉnh theo điều kiện cẩu lắp thực tế',
        en: 'Direct coordination with site management matching crane capacity and site constraints'
      }
    ],
    toolsUsed: ['AutoCAD', 'KataPro', 'Revit Structure'],
    visualType: 'structural',
    featured: true,
    sortOrder: 1
  },
  {
    id: 'srv-2',
    slug: 'finishing-shopdrawing',
    title: {
      vi: 'Shopdrawing hoàn thiện',
      en: 'Finishing Shopdrawing'
    },
    subtitle: {
      vi: 'Triển khai Shopdrawing các hạng mục hoàn thiện kiến trúc phục vụ tổ chức thi công chính xác.',
      en: 'Architectural finishing shopdrawings ensuring seamless execution and aesthetic precision.'
    },
    description: {
      vi: 'Hồ sơ Shopdrawing hoàn thiện được DEBRIQ triển khai đồng bộ giữa các lớp vật liệu, cao độ hoàn thiện, phân chia mốc ốp lát, chi tiết giật cấp trần và liên kết phụ kiện, hạn chế tối đa việc đục phá hay sửa chữa trên công trường.',
      en: 'Integrated finishing shopdrawings detailing material layers, finish elevations, tiling grids, ceiling step details, and masonry joints to prevent on-site rework.'
    },
    deliverables: [
      {
        vi: 'Hạng mục Xây & Tô: Mặt bằng định vị tường xây, kích thước cửa, bổ trụ, giằng tường, lanh-tô',
        en: 'Masonry & Plastering: Wall setting-out, lintel schedules, stiffener columns, and bond beams'
      },
      {
        vi: 'Hạng mục Cán nền & Ốp lát: Mặt bằng chia ron, định vị viên mốc gạch/đá, dốc thoát sàn',
        en: 'Floor Screed & Tiling: Grid layout, setting marks, tile pattern, floor slope details'
      },
      {
        vi: 'Hạng mục Trần: Mặt bằng khung xương, tấm trần, chi tiết giật cấp, khe hắt đèn, lỗ thăm trần',
        en: 'Ceiling Systems: Framing plans, cove lighting details, access panels, and fixture integrations'
      },
      {
        vi: 'Hạng mục Sơn & Các chi tiết hoàn thiện: Gờ chỉ nước, len chân tường, khe co giãn hoàn thiện',
        en: 'Painting & Architectural Details: Drip grooves, skirting transitions, and expansion joints'
      }
    ],
    methodologies: [
      {
        vi: 'Đối chiếu cao độ hoàn thiện với hệ thống cơ điện (MEP) và kết cấu',
        en: 'Cross-verification of finish elevations with MEP drops and structural tolerances'
      },
      {
        vi: 'Kiểm soát mối nối tiếp giáp giữa các loại vật liệu hoàn thiện khác nhau',
        en: 'Interface detail control between diverse material finishes'
      }
    ],
    toolsUsed: ['AutoCAD', 'Revit Architecture'],
    visualType: 'finishing',
    featured: true,
    sortOrder: 2
  },
  {
    id: 'srv-3',
    slug: 'bim-revit',
    title: {
      vi: 'BIM / Revit',
      en: 'BIM / Revit Services'
    },
    subtitle: {
      vi: 'Mô hình hóa thông tin công trình, phối hợp không gian 3D và xuất bản vẽ thi công chính xác.',
      en: 'Building Information Modeling, 3D coordination, and high-fidelity documentation extraction.'
    },
    description: {
      vi: 'DEBRIQ ứng dụng quy trình BIM vào việc dựng mô hình 3D từ hồ sơ thiết kế 2D, kiểm tra va chạm xung đột (Clash Detection), phối hợp đa bộ môn và xuất hồ sơ bản vẽ chuẩn xác, hỗ trợ công tác bóc tách khối lượng và quản lý tiến độ.',
      en: 'Transforming 2D designs into coordinated 3D BIM models, running automated clash detection, multi-disciplinary coordination, and extracting production-grade drawings.'
    },
    deliverables: [
      {
        vi: 'Dựng BIM Model (Kiến trúc, Kết cấu) từ hồ sơ thiết kế',
        en: 'Architectural & Structural 3D BIM Modeling from 2D design archives'
      },
      {
        vi: 'BIM Shopdrawing và bóc tách khối lượng tự động',
        en: 'BIM-driven Shopdrawing sheets and automated parameter takeoffs'
      },
      {
        vi: 'Phối hợp và kiểm tra xung đột không gian (Clash Coordination)',
        en: 'Multi-discipline spatial clash detection and resolution matrix'
      },
      {
        vi: 'Xuất hồ sơ bản vẽ chi tiết trực tiếp từ mô hình Revit',
        en: 'Automated documentation extraction directly from Revit database'
      }
    ],
    methodologies: [
      {
        vi: 'Thiết lập chuẩn BEP (BIM Execution Plan) và Family thư viện cấu kiện chuẩn',
        en: 'Standardized BEP compliance and parametric structural family libraries'
      },
      {
        vi: 'Quy trình kiểm soát Model Quality Check trước khi trích xuất bản vẽ',
        en: 'Rigorous QA/QC checks on model geometry and metadata before drawing production'
      }
    ],
    toolsUsed: ['Revit', 'Navisworks', 'AutoCAD'],
    visualType: 'bim',
    featured: true,
    sortOrder: 3
  },
  {
    id: 'srv-4',
    slug: 'construction-method',
    title: {
      vi: 'Biện pháp thi công',
      en: 'Construction Method'
    },
    subtitle: {
      vi: 'Lập hồ sơ bản vẽ biện pháp tổ chức thi công chi tiết, an toàn và tối ưu cho hiện trường.',
      en: 'Engineering construction method statements, site logistics, and specialized execution sequencing.'
    },
    description: {
      vi: 'DEBRIQ đồng hành cùng các Ban chỉ huy lập biện pháp thi công cho phần ngầm phức tạp (Top-down, Semi Top-down, cừ larsen, kingpost), biện pháp cốp pha đà giáo, biện pháp cẩu lắp và mặt bằng tổng thể tổ chức thi công.',
      en: 'Formulating comprehensive method statements for deep basements (Top-down, Semi Top-down, kingpost shoring), formwork & falsework designs, tower crane layouts, and site logistics.'
    },
    deliverables: [
      {
        vi: 'Bản vẽ biện pháp thi công kết cấu & cốp pha đà giáo',
        en: 'Structural execution methods and heavy falsework/formwork drawings'
      },
      {
        vi: 'Biện pháp thi công tầng hầm sâu: Top-down, Semi Top-down, đào mở có giằng văng',
        en: 'Deep basement construction methods: Top-down, Semi Top-down, strutted open-cut'
      },
      {
        vi: 'Biện pháp thi công hoàn thiện & biện pháp hạ tầng ngoài nhà',
        en: 'Finishing execution logistics and external infrastructure installation methods'
      },
      {
        vi: 'Bản vẽ mặt bằng tổng thể tổ chức thi công, định vị cẩu tháp, vận thăng, kho bãi',
        en: 'Site logistics layout plans: Tower cranes, hoists, material staging zones'
      },
      {
        vi: 'Sơ đồ trình tự thi công và các chi tiết kỹ thuật chuyên dụng phục vụ hiện trường',
        en: 'Phased construction sequencing diagrams and critical site technical details'
      }
    ],
    methodologies: [
      {
        vi: 'Tính toán kiểm tra khả năng chịu lực của hệ chống văng và sàn công tác',
        en: 'Structural capacity validation of shoring struts and heavy working platforms'
      },
      {
        vi: 'Phù hợp hóa quy trình thi công theo năng lực thiết bị thực tế của nhà thầu',
        en: 'Customizing execution steps to the contractor’s actual machinery & crane envelopes'
      }
    ],
    toolsUsed: ['AutoCAD', 'Revit', 'SAP2000 / Etabs'],
    visualType: 'method',
    featured: true,
    sortOrder: 4
  }
];

export const initialProjects: Project[] = [
  {
    id: 'prj-01',
    slug: 'san-bay-long-thanh',
    name: {
      vi: 'Sân bay Long Thành',
      en: 'Long Thanh International Airport'
    },
    subtitle: {
      vi: 'Nhà ga hàng hóa số 1 & Công trình phụ trợ — Dự án thành phần 3',
      en: 'Cargo Terminal No. 1 & Auxiliary Facilities — Component Project 3'
    },
    directClient: 'Hancorp',
    projectOwner: 'Tổng công ty Cảng hàng không Việt Nam (ACV)',
    mainContractor: 'Liên danh nhà thầu Hancorp',
    period: '2025–2026',
    services: ['Shopdrawing kết cấu'],
    scope: {
      vi: 'Shopdrawing kết cấu một phần Nhà ga hàng hóa số 1 và các công trình phụ trợ.',
      en: 'Structural shopdrawing for part of Cargo Terminal No. 1 and auxiliary structures.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ kết cấu móng cọc đài lớn, hệ cột bê tông cốt thép chịu tải trọng nặng, dầm sàn vượt nhịp và các khối kỹ thuật phụ trợ phục vụ dây chuyền logistics.',
        en: 'Detailed shopdrawings for massive pile cap foundations, heavy-duty RC columns, long-span beams, and auxiliary logistical technical annexes.'
      }
    },
    scale: {
      vi: 'Nhà ga hàng hóa số 1 thuộc Dự án thành phần 3 của Cảng hàng không quốc tế Long Thành giai đoạn 1; công suất dự kiến khoảng 550.000 tấn hàng hóa/năm.',
      en: 'Cargo Terminal No. 1 belongs to Component Project 3 of Long Thanh International Airport Phase 1; planned capacity of approx. 550,000 tons of cargo/year.'
    },
    scaleMetric: '550.000 tấn hàng hóa/năm',
    highlights: [
      {
        vi: 'Dự án hạ tầng hàng không trọng điểm quốc gia quy mô đặc biệt lớn.',
        en: 'National mega-infrastructure airport project with strict engineering standards.'
      },
      {
        vi: 'Yêu cầu kỹ thuật và kiểm soát chất lượng hồ sơ bản vẽ nghiêm ngặt theo chuẩn quốc tế.',
        en: 'Rigorous technical compliance and multi-tier drawing QA/QC according to international codes.'
      },
      {
        vi: 'Tiến độ triển khai gấp, khối lượng hồ sơ lớn đòi hỏi sự phối hợp liên tục với Ban chỉ huy.',
        en: 'High-velocity delivery schedule requiring seamless daily coordination with Site Management.'
      }
    ],
    technicalOverview: {
      vi: 'DEBRIQ tập trung kiểm soát chi tiết cốt thép tại các nút khung chịu tải lớn, tối ưu hóa các đợt đổ bê tông khối lớn cho kết cấu đài móng và dầm sàn nhà ga, đảm bảo tính liên tục của công tác nghiệm thu thép tại công trường.',
      en: 'DEBRIQ prioritized rebar clash resolution at heavy-load structural joints, optimizing mass concrete pour sequences for pile caps and terminal floor decks for smooth site inspections.'
    },
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'lt-1',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Phối cảnh tổng thể hạ tầng Cảng hàng không quốc tế Long Thành',
          en: 'Aerial context of Long Thanh International Airport development'
        },
        type: 'rendering',
        alt: 'Long Thanh Airport Terminal Overview'
      },
      {
        id: 'lt-2',
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Hiện trường thi công kết cấu bê tông cốt thép khối lượng lớn',
          en: 'Massive reinforced concrete structural execution on site'
        },
        type: 'site',
        alt: 'Concrete pouring and formwork at Long Thanh Airport'
      },
      {
        id: 'lt-3',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Bản vẽ Shopdrawing bố trí cốt thép đài móng và cột chịu lực nhà ga',
          en: 'Shopdrawing layout of rebar arrangement for foundation pile caps and columns'
        },
        type: 'drawing',
        alt: 'Structural Rebar Shopdrawing Layout'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z'
  },
  {
    id: 'prj-02',
    slug: 'san-bay-phu-quoc',
    name: {
      vi: 'Sân bay Phú Quốc',
      en: 'Phu Quoc International Airport'
    },
    subtitle: {
      vi: 'Dự án mở rộng Cảng HKQT Phú Quốc — Hạng mục Pier Nhà ga T2',
      en: 'Phu Quoc Airport Expansion — Terminal T2 Pier Structure'
    },
    directClient: 'Tân Minh Nhân',
    projectOwner: 'ACV / Ban Quản lý Dự án',
    mainContractor: 'Nhà thầu Tân Minh Nhân',
    period: '2026',
    services: ['Shopdrawing kết cấu'],
    scope: {
      vi: 'Shopdrawing kết cấu phần Pier nhà ga của Cảng hàng không quốc tế Phú Quốc.',
      en: 'Structural shopdrawing for the terminal Pier section of Phu Quoc International Airport.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ chi tiết thép khung bê tông cốt thép dầm, sàn, cột cho hành lang dẫn tàu bay (Pier), kết nối hài hòa giữa kết cấu bê tông và hệ mái thép vượt nhịp.',
        en: 'Detailed rebar drawings for RC framing, beams, floor decks, and columns for the aircraft boarding Pier wing connecting with long-span roof framing.'
      }
    },
    scale: {
      vi: 'Dự án mở rộng Cảng hàng không quốc tế Phú Quốc có tổng mức đầu tư khoảng 22.000 tỷ đồng; Nhà ga T2 giai đoạn 1 được đầu tư với công suất khoảng 24 triệu hành khách/năm.',
      en: 'Phu Quoc Airport expansion has a total investment of approx. 22,000 billion VND; Terminal T2 Phase 1 designed for ~24 million passengers/year.'
    },
    scaleMetric: '24 triệu hành khách/năm',
    highlights: [
      {
        vi: 'Công trình giao thông hàng không biển đảo với điều kiện khí hậu duyên hải đòi hỏi kiểm soát chiều dày lớp bê tông bảo vệ.',
        en: 'Island marine climate airport requiring strict concrete cover and corrosion control.'
      },
      {
        vi: 'Hình học hành lang Pier kéo dài với bước cột lớn và yêu cầu dung sai lắp dựng kết cấu chính xác.',
        en: 'Extended linear Pier geometry with large column bays and tight construction tolerances.'
      }
    ],
    technicalOverview: {
      vi: 'Hồ sơ bản vẽ được DEBRIQ kiểm soát kỹ lưỡng về vị trí bu lông neo chờ, chi tiết liên kết giữa kết cấu bê tông cốt thép chịu lực và hệ kết cấu vách kính mặt dựng.',
      en: 'DEBRIQ provided precise embedded anchor bolt layouts and rebar clearance details interfacing RC frames with structural glass facade brackets.'
    },
    heroImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'pq-1',
        url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Phối cảnh cánh Pier nhà ga mở rộng hướng ra đường lăn sân đỗ',
          en: 'Architectural rendering of the extended terminal Pier facing the taxiway'
        },
        type: 'rendering',
        alt: 'Phu Quoc Terminal Pier Rendering'
      },
      {
        id: 'pq-2',
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Chi tiết triển khai hồ sơ cốt thép dầm sàn hành lang Pier',
          en: 'Shopdrawing details for Pier structural framing and slab reinforcement'
        },
        type: 'drawing',
        alt: 'Pier Structural Shopdrawing'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 2,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z'
  },
  {
    id: 'prj-03',
    slug: 'trung-tam-hanh-chinh-thu-thiem',
    name: {
      vi: 'Trung tâm Hành chính Thủ Thiêm',
      en: 'Thu Thiem Administrative Center'
    },
    subtitle: {
      vi: 'Khu trung tâm chính trị – hành chính – văn hóa & công viên hồ trung tâm',
      en: 'Political, Administrative & Cultural Center with Central Lake Park'
    },
    directClient: 'Tân Minh Nhân',
    projectOwner: 'Ban Quản lý Đầu tư Xây dựng Khu đô thị mới Thủ Thiêm',
    mainContractor: 'Tân Minh Nhân',
    period: '2026',
    services: ['Shopdrawing kết cấu'],
    scope: {
      vi: 'Shopdrawing kết cấu phần hầm.',
      en: 'Structural shopdrawing for basement structures.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ Shopdrawing kết cấu đài móng sâu, bản đáy hầm, vách hầm chịu áp lực đất nước và hệ dầm sàn tầng hầm chịu tải trọng giao thông lớn.',
        en: 'Detailed shopdrawings for deep foundation mat, basement retaining walls under water-soil pressure, and heavy traffic basement floor systems.'
      }
    },
    scale: {
      vi: 'Khu trung tâm chính trị – hành chính – văn hóa và công viên hồ trung tâm tại Thủ Thiêm có phạm vi quy hoạch khoảng 33 ha.',
      en: 'The political, administrative, cultural center and central lake park at Thu Thiem spans approx. 33 hectares.'
    },
    scaleMetric: 'Quy hoạch 33 ha',
    highlights: [
      {
        vi: 'Dự án trọng điểm tại Khu đô thị mới Thủ Thiêm, TP. Hồ Chí Minh.',
        en: 'Key civic institutional project in Thu Thiem New Urban Area, Ho Chi Minh City.'
      },
      {
        vi: 'Kết cấu hầm sâu gần khu vực hồ trung tâm yêu cầu xử lý chống thấm mạch ngừng và bố trí thép đặc biệt.',
        en: 'Deep subterranean basement near the central lake requiring advanced waterstop and crack-control detailing.'
      }
    ],
    technicalOverview: {
      vi: 'DEBRIQ xây dựng giải pháp chi tiết cho các vị trí băng cản nước, ống xuyên sàn hầm và phân đợt thi công đổ bê tông sàn đáy hầm chống nứt nhiệt hiệu quả.',
      en: 'DEBRIQ engineered precise waterstop junction details, basement sleeve penetrations, and thermal crack-mitigation pour patterns.'
    },
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'tt-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Không gian quy hoạch kiến trúc Khu trung tâm Thủ Thiêm',
          en: 'Thu Thiem civic urban masterplan context'
        },
        type: 'rendering',
        alt: 'Thu Thiem Masterplan'
      },
      {
        id: 'tt-2',
        url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Thi công cốt thép đài móng và vách hầm công trình',
          en: 'Basement mat foundation and retaining wall rebar installation'
        },
        type: 'site',
        alt: 'Basement Construction Rebar'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 3,
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z'
  },
  {
    id: 'prj-04',
    slug: 'the-global-city',
    name: {
      vi: 'The Global City',
      en: 'The Global City'
    },
    subtitle: {
      vi: 'Đại đô thị phức hợp biểu tượng TP. Thủ Đức — Phân khu CT3, CT4, CT5, CT7',
      en: 'Iconic Master-planned Mixed-use Township — Subdivisions CT3, CT4, CT5, CT7'
    },
    directClient: 'Coteccons',
    projectOwner: 'Masterise Homes',
    mainContractor: 'Coteccons',
    period: '2026',
    services: ['Shopdrawing kết cấu'],
    scope: {
      vi: 'Shopdrawing kết cấu phần hầm và phần thân tại các phân khu: CT3 – CT4 – CT5 – CT7.',
      en: 'Structural shopdrawing for basement and superstructure across subdivisions: CT3 – CT4 – CT5 – CT7.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ kết cấu toàn diện cho phần ngầm (đài móng, dầm sàn hầm) và phần thân cao tầng (cột, vách cứng, dầm sàn dự ứng lực / bê tông cốt thép thường) cho 4 phân khu cao tầng.',
        en: 'Comprehensive structural shopdrawings for substructure and high-rise superstructures (columns, shear walls, transfer structures, floor slabs) across 4 major high-rise sectors.'
      }
    },
    scale: {
      vi: 'The Global City có tổng quy mô khoảng 117,4 ha.',
      en: 'The Global City township spans a total masterplan area of approx. 117.4 hectares.'
    },
    scaleMetric: 'Quy mô 117,4 ha',
    highlights: [
      {
        vi: 'Đại đô thị biểu tượng đẳng cấp quốc tế do Foster + Partners quy hoạch.',
        en: 'International iconic township master-planned by Foster + Partners.'
      },
      {
        vi: 'Khối lượng hồ sơ triển khai đồng thời cực lớn trên 4 phân khu cao tầng CT3, CT4, CT5, CT7.',
        en: 'Massive concurrent drawing output across four simultaneous high-rise packages.'
      },
      {
        vi: 'Hợp tác chặt chẽ theo quy trình kiểm soát hồ sơ kỹ thuật chuyên nghiệp của Coteccons.',
        en: 'Strict integration with Coteccons rigorous technical engineering workflow.'
      }
    ],
    technicalOverview: {
      vi: 'Đội ngũ DEBRIQ phối hợp chặt chẽ với Ban chỉ huy Coteccons để module hóa bản vẽ, đảm bảo tiến độ bàn giao hồ sơ trước mỗi chu kỳ thi công tầng điển hình từ 4–5 ngày/sàn.',
      en: 'DEBRIQ collaborated with Coteccons site engineering teams to modularize drawing releases, supporting fast-track typical floor construction cycles of 4–5 days per slab.'
    },
    heroImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'gc-1',
        url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Toàn cảnh đại đô thị The Global City',
          en: 'Panoramic view of The Global City master development'
        },
        type: 'rendering',
        alt: 'The Global City Masterplan'
      },
      {
        id: 'gc-2',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Thi công ván khuôn và cốt thép phần thân cao tầng',
          en: 'Superstructure high-rise formwork and rebar installation'
        },
        type: 'site',
        alt: 'High-rise concrete construction'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 4,
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-02-22T00:00:00Z'
  },
  {
    id: 'prj-05',
    slug: 'opera-tay-ho-nha-hat-ngoc-trai',
    name: {
      vi: 'Opera Tây Hồ — Nhà hát Ngọc Trai',
      en: 'Tay Ho Opera House — Pearl Theatre'
    },
    subtitle: {
      vi: 'Isola Della Musica — Biểu tượng văn hóa kiến trúc đặc biệt bên bờ Hồ Tây',
      en: 'Isola Della Musica — Landmark cultural theatre on West Lake'
    },
    directClient: 'Coteccons',
    projectOwner: 'Tập đoàn Sun Group',
    mainContractor: 'Coteccons (Tổng thầu chính)',
    period: '2026',
    services: ['Shopdrawing kết cấu'],
    scope: {
      vi: 'Shopdrawing kết cấu phần thân.',
      en: 'Superstructure structural shopdrawing.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ Shopdrawing kết cấu phần thân phức tạp, đặc biệt là hệ thống dầm cong không gian, vách nghiêng và hệ mái bê tông cốt thép toàn khối hình học tự do diện tích 17.000 m².',
        en: 'Detailed shopdrawings for intricate superstructure framing, 3D curved beams, inclined shear walls, and the monolithic freeform reinforced concrete shell roof spanning 17,000 m².'
      }
    },
    scale: {
      vi: 'Nhà hát có tổng diện tích sàn khoảng 40.980 m², với hình thái kết cấu đặc biệt; hệ mái bê tông cốt thép toàn khối có hình học tự do và diện tích khoảng 17.000 m². Coteccons là nhà thầu chính của dự án.',
      en: 'Total gross floor area of approx. 40,980 m² with unique organic structural morphology; monolithic freeform RC shell roof area of ~17,000 m². Coteccons is the main contractor.'
    },
    scaleMetric: '40.980 m² sàn / Mái 17.000 m²',
    highlights: [
      {
        vi: 'Công trình kiến trúc văn hóa mang tính biểu tượng quốc gia do kiến trúc sư huyền thoại Renzo Piano thiết kế.',
        en: 'Iconic national cultural landmark designed by Pritzker laureate Renzo Piano.'
      },
      {
        vi: 'Độ phức tạp kết cấu thuộc nhóm cao nhất tại Việt Nam với hình học tự do không đồng nhất.',
        en: 'Unprecedented geometric complexity with non-uniform freeform spatial curves.'
      },
      {
        vi: 'Đòi hỏi sự phối hợp 3D không gian chính xác tuyệt đối giữa từng thanh cốt thép và đường cong cốp pha.',
        en: 'Demands millimeter-precision 3D spatial rebar routing matched to organic formwork curvature.'
      }
    ],
    technicalOverview: {
      vi: 'DEBRIQ ứng dụng kỹ thuật mô hình hóa 3D để giải mã các tọa độ cong phức tạp của mái vòm vỏ sò, bóc tách chi tiết từng cụm thép gia cường và vị trí nối thép nhằm biến ý tưởng kiến trúc tự do thành bản vẽ thi công khả thi trên thực địa.',
      en: 'DEBRIQ utilized advanced 3D coordinate unrolling to decode complex seashell roof geometry, detailing custom rebar splices and bend radius profiles into executable site shopdrawings.'
    },
    heroImage: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'op-1',
        url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Kiến trúc biểu tượng Nhà hát Ngọc Trai — Isola Della Musica bên Hồ Tây',
          en: 'Architectural vision of the Pearl Theatre — Isola Della Musica on West Lake'
        },
        type: 'rendering',
        alt: 'Tay Ho Opera House Pearl Theatre'
      },
      {
        id: 'op-2',
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Mô phỏng chi tiết cốt thép hệ mái cong bê tông cốt thép tự do 17.000 m²',
          en: '3D rebar detailing for the 17,000 m² freeform curved concrete shell roof'
        },
        type: 'drawing',
        alt: 'Freeform Concrete Rebar Shopdrawing'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 5,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-23T00:00:00Z'
  },
  {
    id: 'prj-06',
    slug: 'k-home-new-city',
    name: {
      vi: 'K-Home New City',
      en: 'K-Home New City'
    },
    subtitle: {
      vi: 'Khu đô thị hiện đại — Triển khai đồng bộ Kết cấu & Hoàn thiện',
      en: 'Modern Township — Integrated Structural & Architectural Finishing'
    },
    directClient: 'Coteccons',
    projectOwner: 'Chủ đầu tư K-Home',
    mainContractor: 'Coteccons',
    period: '2025–2026',
    services: ['Shopdrawing kết cấu', 'Shopdrawing hoàn thiện'],
    scope: {
      vi: 'Kết cấu: triển khai Shopdrawing kết cấu công trình (công trình không có tầng hầm). Hoàn thiện: triển khai các hạng mục xây, tô, cán nền, ốp lát, trần, sơn và các chi tiết hoàn thiện liên quan.',
      en: 'Structural: shopdrawings for non-basement structures. Finishing: masonry, plastering, floor screed, tiling, ceiling, painting, and associated architectural details.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai Shopdrawing kết cấu móng nông, đà kiềng, hệ khung dầm cột và sàn các tầng.',
        en: 'Structural shopdrawings for shallow foundations, grade beams, RC framing, and floor slabs.'
      },
      finishing: {
        vi: 'Hồ sơ bản vẽ chi tiết các hạng mục Xây tường, Tô trát, Cán nền, Ốp lát gạch, Hệ trần thạch cao, Sơn nước và các chi tiết tiếp giáp kiến trúc.',
        en: 'Complete detailed drawings for brickwork, plastering, floor screeds, tiling patterns, drywall ceilings, painting schedules, and architectural junctions.'
      }
    },
    scale: {
      vi: 'K-Home New City có quy mô khoảng 26,69 ha.',
      en: 'K-Home New City covers an area of approx. 26.69 hectares.'
    },
    scaleMetric: 'Quy mô 26,69 ha',
    highlights: [
      {
        vi: 'Dự án khu đô thị quy mô 26,69 ha với tiến độ thi công đồng loạt.',
        en: '26.69-hectare township development with simultaneous block rollouts.'
      },
      {
        vi: 'Triển khai trọn gói cả 2 gói thầu Kết cấu và Hoàn thiện giúp tối ưu hóa giao diện kỹ thuật giữa các đội thợ.',
        en: 'Integrated Structural + Finishing package eliminating coordination gaps between trade crews.'
      }
    ],
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'kh-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Khu đô thị K-Home New City',
          en: 'K-Home New City residential enclave'
        },
        type: 'rendering',
        alt: 'K-Home New City'
      }
    ],
    featured: false,
    published: true,
    sortOrder: 6,
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z'
  },
  {
    id: 'prj-07',
    slug: 'the-one-world-one-era',
    name: {
      vi: 'The One World — ONE ERA',
      en: 'The One World — ONE ERA'
    },
    subtitle: {
      vi: 'Khu đô thị tích hợp đa chức năng — Kết cấu, Hoàn thiện & Hạ tầng kỹ thuật',
      en: 'Integrated Mixed-use Urban Township — Structural, Finishing & Infrastructure'
    },
    directClient: 'Coteccons',
    projectOwner: 'Liên danh Chủ đầu tư',
    mainContractor: 'Coteccons (Đối tác triển khai dự án)',
    period: '2025–2026',
    services: ['Shopdrawing kết cấu', 'Shopdrawing hoàn thiện', 'Shopdrawing hạ tầng'],
    scope: {
      vi: 'Kết cấu: Shopdrawing kết cấu phạm vi được giao (công trình không có tầng hầm). Hoàn thiện: Xây, Tô, Ốp lát, Cán nền, Sơn nước. Hạ tầng: Toàn bộ hệ hố ga, Hệ thống thoát nước thải, Hệ thống thoát nước mưa.',
      en: 'Structural: designated structural packages (non-basement). Finishing: masonry, plastering, tiling, screed, paint. Infrastructure: manhole networks, sewage systems, and stormwater drainage.'
    },
    scopeDetails: {
      structural: {
        vi: 'Bản vẽ Shopdrawing kết cấu móng, khung dầm cột sàn bê tông cốt thép khối nhà.',
        en: 'Shopdrawings for foundations and RC superstructures.'
      },
      finishing: {
        vi: 'Xây, tô, ốp lát gạch đá, cán dốc nền, sơn bả tường trần nội ngoại thất.',
        en: 'Masonry, plastering, stone/tile layout, floor grading, interior/exterior finishes.'
      },
      infrastructure: {
        vi: 'Triển khai chi tiết toàn bộ hệ hố ga kỹ thuật, trắc dọc trắc ngang tuyến cống, hệ thống thoát nước thải sinh hoạt và hệ thống thoát nước mưa toàn khu.',
        en: 'Detailing all technical manholes, pipe longitudinal/cross sections, wastewater drainage, and site-wide stormwater collection network.'
      }
    },
    scale: {
      vi: 'ONE ERA / The One World có quy mô khoảng 50 ha, phát triển theo mô hình khu đô thị tích hợp. Coteccons nằm trong hệ thống đối tác triển khai dự án.',
      en: 'ONE ERA / The One World covers approx. 50 hectares, developed as an integrated township. Coteccons is in the project delivery partner network.'
    },
    scaleMetric: 'Quy mô 50 ha',
    highlights: [
      {
        vi: 'Dự án quy mô 50 ha với sự tích hợp toàn diện 3 bộ môn: Kết cấu, Hoàn thiện, Hạ tầng kỹ thuật.',
        en: '50-hectare integrated master development with full multi-trade scope: Structural, Finishing, Infrastructure.'
      },
      {
        vi: 'Mỗi dự án chỉ có 1 Project Card thống nhất mang đầy đủ các Service Tags chuyên môn.',
        en: 'Unified single-project architecture encompassing all multi-discipline service deliverables.'
      }
    ],
    technicalOverview: {
      vi: 'DEBRIQ đồng bộ tọa độ và cao độ giữa hệ thống hạ tầng thoát nước ngoài nhà và các hộp gen kỹ thuật trong khối nhà, ngăn ngừa hiện tượng xung đột cao độ đáy hố ga trên toàn tuyến 50 ha.',
      en: 'DEBRIQ harmonized elevation coordinates between external stormwater networks and internal building risers across the entire 50-hectare site.'
    },
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'tow-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Phối cảnh tổng thể khu đô thị The One World — ONE ERA',
          en: 'Aerial masterplan rendering of The One World — ONE ERA'
        },
        type: 'rendering',
        alt: 'The One World ONE ERA Masterplan'
      },
      {
        id: 'tow-2',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Bản vẽ Shopdrawing hệ thống hạ tầng hố ga và thoát nước',
          en: 'Shopdrawing layout of civil drainage and manhole infrastructure'
        },
        type: 'drawing',
        alt: 'Infrastructure Drainage Shopdrawing'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 7,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-24T00:00:00Z'
  },
  {
    id: 'prj-08',
    slug: 'eco-retreat',
    name: {
      vi: 'Eco Retreat',
      en: 'Eco Retreat'
    },
    subtitle: {
      vi: 'Đại đô thị sinh thái nghỉ dưỡng 220 ha — Triển khai Kết cấu & Hoàn thiện',
      en: '220-hectare Eco Retreat Township — Structural & Finishing Documentation'
    },
    directClient: 'Lewu',
    projectOwner: 'Tập đoàn Ecopark',
    mainContractor: 'Coteccons / Ricons',
    period: '2025–2026',
    services: ['Shopdrawing kết cấu', 'Shopdrawing hoàn thiện'],
    scope: {
      vi: 'Shopdrawing kết cấu và hoàn thiện toàn bộ phạm vi công việc được giao.',
      en: 'Structural and architectural finishing shopdrawings for the entire contracted package.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ kết cấu móng, khung dầm cột, sàn chịu lực cho các cụm công trình trong phân khu được giao.',
        en: 'Detailed shopdrawings for foundations, structural frames, and floor decks for designated clusters.'
      },
      finishing: {
        vi: 'Triển khai chi tiết hoàn thiện nội ngoại thất cao cấp, đường ron gạch, chi tiết vách ngăn, trần trang trí và mặt dựng.',
        en: 'High-standard finishing detailing: tile layouts, decorative ceilings, partition walls, and facade transitions.'
      }
    },
    scale: {
      vi: 'Eco Retreat có tổng quy mô khoảng 220 ha.',
      en: 'Eco Retreat spans an expansive total area of approx. 220 hectares.'
    },
    scaleMetric: 'Đại đô thị 220 ha',
    highlights: [
      {
        vi: 'Đại dự án đô thị sinh thái nghỉ dưỡng với quy mô cực lớn 220 ha.',
        en: 'Ultra-large 220-hectare ecological retreat township master development.'
      },
      {
        vi: 'Phân định minh bạch vai trò: Chủ đầu tư: Ecopark | Tổng thầu: Coteccons/Ricons | Khách hàng trực tiếp của DEBRIQ: Lewu.',
        en: 'Clear stakeholder attribution: Developer: Ecopark | Main Contractors: Coteccons/Ricons | DEBRIQ Direct Client: Lewu.'
      }
    ],
    technicalOverview: {
      vi: 'DEBRIQ đảm nhận hồ sơ kỹ thuật chính xác cho nhà thầu Lewu, giúp rút ngắn thời gian phê duyệt hồ sơ từ Ban quản lý dự án và Tổng thầu.',
      en: 'DEBRIQ delivered precise shopdrawing packages for contractor Lewu, accelerating review and approval cycles from the Project Management Board and Main Contractors.'
    },
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'er-1',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Không gian kiến trúc sinh thái đại đô thị Eco Retreat 220 ha',
          en: 'Eco Retreat 220-hectare eco-masterplan landscape'
        },
        type: 'rendering',
        alt: 'Eco Retreat Masterplan'
      }
    ],
    featured: true,
    published: true,
    sortOrder: 8,
    createdAt: '2026-02-12T00:00:00Z',
    updatedAt: '2026-02-24T00:00:00Z'
  },
  {
    id: 'prj-09',
    slug: 'spring-ville',
    name: {
      vi: 'Spring Ville',
      en: 'Spring Ville'
    },
    subtitle: {
      vi: 'Khu đô thị tích hợp của Gamuda Land tại Đồng Nai — Shopdrawing phần hầm',
      en: 'Gamuda Land Integrated Township in Dong Nai — Basement Shopdrawing'
    },
    directClient: 'Hudeco',
    projectOwner: 'Gamuda Land',
    mainContractor: 'Hudeco',
    period: '2026',
    services: ['Shopdrawing kết cấu'],
    scope: {
      vi: 'Shopdrawing kết cấu phần hầm.',
      en: 'Structural shopdrawing for basement structures.'
    },
    scopeDetails: {
      structural: {
        vi: 'Triển khai bản vẽ kết cấu móng, tường vây/vách hầm, dầm sàn hầm và các chi tiết ram dốc tầng hầm.',
        en: 'Detailed shopdrawings for basement foundations, retaining walls, floor slabs, and access vehicular ramps.'
      }
    },
    scale: {
      vi: 'Springville là khu đô thị tích hợp của Gamuda Land tại Đồng Nai với quy mô khoảng 18,2 ha.',
      en: 'Springville is an integrated township by Gamuda Land in Dong Nai with a masterplan area of approx. 18.2 hectares.'
    },
    scaleMetric: 'Quy mô 18,2 ha',
    highlights: [
      {
        vi: 'Dự án khu đô thị chuẩn mực quốc tế của tập đoàn bất động sản Gamuda Land.',
        en: 'International standard masterplanned community by Gamuda Land.'
      },
      {
        vi: 'Khách hàng trực tiếp của DEBRIQ: Nhà thầu Hudeco.',
        en: 'Direct client of DEBRIQ: Contractor Hudeco.'
      }
    ],
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80',
    gallery: [
      {
        id: 'sv-1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        caption: {
          vi: 'Phối cảnh khu đô thị Spring Ville — Gamuda Land',
          en: 'Architectural rendering of Spring Ville by Gamuda Land'
        },
        type: 'rendering',
        alt: 'Spring Ville Gamuda Land'
      }
    ],
    featured: false,
    published: true,
    sortOrder: 9,
    createdAt: '2026-02-14T00:00:00Z',
    updatedAt: '2026-02-25T00:00:00Z'
  }
];

export const initialPartners: Partner[] = [
  {
    id: 'ptn-1',
    name: 'Coteccons',
    roleType: 'direct_client',
    roleLabel: {
      vi: 'Tổng thầu xây dựng / Khách hàng trực tiếp',
      en: 'Main Contractor / Direct Client'
    },
    logoText: 'COTECCONS',
    description: {
      vi: 'Hợp tác triển khai Shopdrawing kết cấu, hoàn thiện và hạ tầng tại The Global City, Opera Tây Hồ, The One World — ONE ERA, K-Home New City.',
      en: 'Partnered on structural, finishing, and civil infrastructure shopdrawings across The Global City, Tay Ho Opera, The One World, and K-Home.'
    },
    featured: true,
    sortOrder: 1
  },
  {
    id: 'ptn-2',
    name: 'Hancorp',
    roleType: 'direct_client',
    roleLabel: {
      vi: 'Tổng công ty Xây dựng Hà Nội / Khách hàng trực tiếp',
      en: 'Hanoi Construction Corporation / Direct Client'
    },
    logoText: 'HANCORP',
    description: {
      vi: 'Hợp tác triển khai Shopdrawing kết cấu Nhà ga hàng hóa số 1 và công trình phụ trợ Cảng HKQT Long Thành.',
      en: 'Collaborated on structural shopdrawings for Cargo Terminal No. 1 at Long Thanh International Airport.'
    },
    featured: true,
    sortOrder: 2
  },
  {
    id: 'ptn-3',
    name: 'Tân Minh Nhân',
    roleType: 'direct_client',
    roleLabel: {
      vi: 'Nhà thầu xây dựng / Khách hàng trực tiếp',
      en: 'Contractor / Direct Client'
    },
    logoText: 'TÂN MINH NHÂN',
    description: {
      vi: 'Hợp tác triển khai Shopdrawing kết cấu Sân bay Phú Quốc (Pier Nhà ga T2) và Trung tâm Hành chính Thủ Thiêm.',
      en: 'Engaged for structural shopdrawings on Phu Quoc Airport Pier and Thu Thiem Administrative Center.'
    },
    featured: true,
    sortOrder: 3
  },
  {
    id: 'ptn-4',
    name: 'Lewu',
    roleType: 'direct_client',
    roleLabel: {
      vi: 'Nhà thầu thi công / Khách hàng trực tiếp',
      en: 'Construction Contractor / Direct Client'
    },
    logoText: 'LEWU',
    description: {
      vi: 'Hợp tác triển khai Shopdrawing kết cấu và hoàn thiện tại đại đô thị sinh thái Eco Retreat (220 ha).',
      en: 'Contracted for full-scope structural and finishing shopdrawings at the 220ha Eco Retreat development.'
    },
    featured: true,
    sortOrder: 4
  },
  {
    id: 'ptn-5',
    name: 'Hudeco',
    roleType: 'direct_client',
    roleLabel: {
      vi: 'Nhà thầu xây dựng / Khách hàng trực tiếp',
      en: 'Contractor / Direct Client'
    },
    logoText: 'HUDECO',
    description: {
      vi: 'Hợp tác triển khai Shopdrawing kết cấu tầng hầm dự án Spring Ville (Gamuda Land).',
      en: 'Selected for basement structural shopdrawings at Spring Ville (Gamuda Land).'
    },
    featured: true,
    sortOrder: 5
  },
  {
    id: 'ptn-6',
    name: 'Ricons',
    roleType: 'main_contractor',
    roleLabel: {
      vi: 'Hệ thống Tổng thầu liên quan dự án',
      en: 'Associated Main Contractor Ecosystem'
    },
    logoText: 'RICONS',
    description: {
      vi: 'Tổng thầu thi công trong hệ thống các dự án DEBRIQ tham gia triển khai hồ sơ.',
      en: 'General Contractor associated with major project master delivery pipelines where DEBRIQ provided technical detailing.'
    },
    featured: true,
    sortOrder: 6
  }
];

export const initialPages: Record<string, PageContent> = {
  home: {
    id: 'page-home',
    key: 'home',
    title: {
      vi: 'DEBRIQ — Engineering Behind The Build',
      en: 'DEBRIQ — Engineering Behind The Build'
    },
    metaDescription: {
      vi: 'Đối tác kỹ thuật đồng hành cùng dự án từ hồ sơ thiết kế đến triển khai thực tế tại công trường.',
      en: 'Technical partner for construction projects, from design documentation to field execution.'
    },
    sections: {
      hero: {
        id: 'hero',
        title: {
          vi: 'ENGINEERING BEHIND THE BUILD.',
          en: 'ENGINEERING BEHIND THE BUILD.'
        },
        subtitle: {
          vi: 'ĐỐI TÁC KỸ THUẬT ĐỒNG HÀNH CÙNG DỰ ÁN TỪ THIẾT KẾ ĐẾN TRIỂN KHAI THI CÔNG',
          en: 'TECHNICAL PARTNER FOR PROJECTS FROM DESIGN DOCUMENTATION TO SITE IMPLEMENTATION'
        },
        headline: {
          vi: 'DEBRIQ cung cấp giải pháp Shopdrawing, BIM và hồ sơ biện pháp thi công với đội ngũ kỹ sư cùng mạng lưới cộng tác viên linh hoạt, đáp ứng nhu cầu triển khai hồ sơ cho các dự án xây dựng quy mô lớn.',
          en: 'DEBRIQ delivers production-grade Shopdrawings, BIM modeling, and Construction Method Statements powered by an agile core engineering team and specialist collaborator network for mega construction projects.'
        },
        ctaText: {
          vi: 'GỬI YÊU CẦU BÁO GIÁ',
          en: 'REQUEST A QUOTE'
        },
        ctaLink: '/contact',
        secondaryCtaText: {
          vi: 'GIA NHẬP MẠNG LƯỚI KỸ SƯ',
          en: 'JOIN THE ENGINEER NETWORK'
        },
        secondaryCtaLink: '/join-debriq',
        visible: true
      },
      positioning: {
        id: 'positioning',
        title: {
          vi: 'ĐỊNH VỊ & NĂNG LỰC CỐT LÕI',
          en: 'POSITIONING & CORE COMPETENCIES'
        },
        body: {
          vi: 'Kinh nghiệm phối hợp và triển khai công việc trong hệ thống các tổng thầu lớn. Chúng tôi chứng minh năng lực thông qua tên dự án thật, khách hàng thật, phạm vi thật và chất lượng hồ sơ bản vẽ được kiểm chứng trên công trường.',
          en: 'Extensive coordination and execution experience embedded in tier-1 general contractor systems. We demonstrate capability through real projects, real clients, genuine scopes, and proven field-tested shopdrawings.'
        },
        visible: true
      },
      resources: {
        id: 'resources',
        title: {
          vi: 'NGUỒN LỰC & CÔNG CỤ',
          en: 'RESOURCES & TOOLING'
        },
        body: {
          vi: 'Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022. Mô hình kết hợp 5+ kỹ sư nòng cốt và 25+ cộng tác viên chuyên môn, cho phép mở rộng nguồn lực theo quy mô và tiến độ từng dự án.',
          en: 'The DEBRIQ team has been operating since 2022. Our hybrid structure combines 5+ core engineers with 25+ specialist collaborators, scaling flexibly to project volume and urgency.'
        },
        visible: true
      }
    },
    updatedAt: '2026-02-26T00:00:00Z'
  },
  about: {
    id: 'page-about',
    key: 'about',
    title: {
      vi: 'Về DEBRIQ — Hồ sơ năng lực kỹ thuật',
      en: 'About DEBRIQ — Technical Company Profile'
    },
    metaDescription: {
      vi: 'Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022, cung cấp giải pháp Shopdrawing, BIM và hồ sơ biện pháp thi công.',
      en: 'DEBRIQ engineering team operating since 2022, delivering Shopdrawing, BIM, and Construction Method Statements.'
    },
    sections: {
      intro: {
        id: 'intro',
        title: {
          vi: 'VỀ DEBRIQ',
          en: 'ABOUT DEBRIQ'
        },
        headline: {
          vi: 'Đối tác kỹ thuật đồng hành cùng các đơn vị thi công từ hồ sơ thiết kế đến giai đoạn triển khai thực tế tại công trường.',
          en: 'Technical engineering partner accompanying contractors from design files to physical jobsite execution.'
        },
        body: {
          vi: 'Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022. Chúng tôi thấu hiểu những áp lực về tiến độ, xung đột hồ sơ thiết kế và yêu cầu kiểm soát hao hụt vật tư của các nhà thầu trên công trường xây dựng.',
          en: 'DEBRIQ engineering team has been operating since 2022. We understand contractor pressures regarding deadlines, design clashes, and material optimization on active construction sites.'
        },
        visible: true
      }
    },
    updatedAt: '2026-02-26T00:00:00Z'
  },
  'join-debriq': {
    id: 'page-join',
    key: 'join-debriq',
    title: {
      vi: 'Gia nhập mạng lưới kỹ sư DEBRIQ',
      en: 'Join The DEBRIQ Engineer Network'
    },
    subtitle: {
      vi: 'MẠNG LƯỚI KỸ SƯ CỘNG TÁC CHUYÊN MÔN',
      en: 'SPECIALIST COLLABORATOR NETWORK'
    },
    description: {
      vi: 'DEBRIQ xây dựng mạng lưới cộng tác viên kỹ thuật theo định hướng hợp tác lâu dài, tạo cơ hội để các kỹ sư tham gia những dự án thực tế có quy mô lớn, nâng cao kinh nghiệm triển khai hồ sơ và phát triển chuyên môn.',
      en: 'DEBRIQ builds a technical collaborator network oriented toward long-term partnership, offering engineers opportunities to work on large-scale landmark projects.'
    },
    metaDescription: {
      vi: 'Cơ hội hợp tác lâu dài cho kỹ sư Shopdrawing kết cấu, hoàn thiện và Revit / BIM.',
      en: 'Long-term partnership opportunities for Structural, Finishing, and Revit/BIM Engineers.'
    },
    sections: {
      main: {
        id: 'main',
        title: {
          vi: 'GIA NHẬP MẠNG LƯỚI KỸ SƯ DEBRIQ',
          en: 'JOIN THE DEBRIQ ENGINEER NETWORK'
        },
        headline: {
          vi: 'DEBRIQ xây dựng mạng lưới cộng tác viên kỹ thuật theo định hướng hợp tác lâu dài, tạo cơ hội để các kỹ sư tham gia những dự án thực tế có quy mô lớn, nâng cao kinh nghiệm triển khai hồ sơ và phát triển chuyên môn.',
          en: 'DEBRIQ builds a technical collaborator network oriented toward long-term partnership, offering engineers opportunities to work on large-scale landmark projects, enhance practical detailing experience, and elevate professional expertise.'
        },
        body: {
          vi: 'Các cộng tác viên có năng lực và phù hợp với cách làm việc của DEBRIQ có thể tiếp tục phát triển thành nhân sự hoặc đối tác đồng hành lâu dài.',
          en: 'Collaborators demonstrating capability and alignment with DEBRIQ workflow can advance to permanent core roles or long-term enterprise partners.'
        },
        ctaText: {
          vi: 'ĐĂNG KÝ GIA NHẬP MẠNG LƯỚI',
          en: 'APPLY TO JOIN NETWORK'
        },
        ctaLink: '#register-form',
        visible: true
      }
    },
    updatedAt: '2026-02-26T00:00:00Z'
  },
  'contact': {
    id: 'page-contact',
    key: 'contact',
    title: {
      vi: 'Liên hệ DEBRIQ',
      en: 'Contact DEBRIQ Engineering'
    },
    subtitle: {
      vi: 'KẾT NỐI VÀ HỢP TÁC KỸ THUẬT',
      en: 'GET IN TOUCH & HEADQUARTERS'
    },
    description: {
      vi: 'Đội ngũ kỹ sư DEBRIQ luôn sẵn sàng lắng nghe yêu cầu và đề xuất giải pháp triển khai hồ sơ phù hợp nhất cho dự án của bạn.',
      en: 'DEBRIQ lead engineers are available to review project requirements and coordinate drawings delivery.'
    },
    metaDescription: {
      vi: 'Liên hệ trực tiếp với Ban Điều Hành và đội ngũ Kỹ sư trưởng DEBRIQ để được tư vấn hồ sơ và báo giá nhanh.',
      en: 'Contact DEBRIQ engineering leads directly for project blueprints consultation and fast quotation.'
    },
    sections: {},
    updatedAt: '2026-02-26T00:00:00Z'
  },
  'partners': {
    id: 'page-partners',
    key: 'partners',
    title: {
      vi: 'Đối tác & Khách hàng',
      en: 'Partners & Clients'
    },
    subtitle: {
      vi: 'HỆ THỐNG ĐỐI TÁC VÀ KHÁCH HÀNG',
      en: 'CLIENTS & STRATEGIC PARTNERS'
    },
    description: {
      vi: 'Minh bạch và chuẩn xác trong mối quan hệ hợp tác. DEBRIQ tự hào đồng hành cùng các tổng thầu hàng đầu và các nhà thầu chuyên ngành trên các đại công trình.',
      en: 'Transparent attribution and proven reliability. DEBRIQ collaborates with tier-1 main contractors and specialized engineering firms across landmark builds.'
    },
    metaDescription: {
      vi: 'Đối tác và khách hàng của DEBRIQ: Coteccons, Hancorp, Tân Minh Nhân và các tổng thầu uy tín.',
      en: 'DEBRIQ partners and clients: Coteccons, Hancorp, Tan Minh Nhan, and leading general contractors.'
    },
    sections: {},
    updatedAt: '2026-02-26T00:00:00Z'
  },
  'services': {
    id: 'page-services',
    key: 'services',
    title: {
      vi: 'Dịch vụ Kỹ thuật',
      en: 'Technical Services'
    },
    subtitle: {
      vi: 'NĂNG LỰC DỊCH VỤ CHUYÊN MÔN',
      en: 'SPECIALIZED ENGINEERING CAPABILITIES'
    },
    description: {
      vi: 'Giải pháp Shopdrawing kết cấu, hoàn thiện, mô hình thông tin công trình BIM/Revit và hồ sơ biện pháp thi công. Triển khai chuẩn xác theo tiến độ dự án.',
      en: 'Full-spectrum shopdrawing drafting, BIM modeling, and construction method engineering designed for high-density site execution.'
    },
    metaDescription: {
      vi: 'Giải pháp Shopdrawing kết cấu, hoàn thiện, BIM/Revit và hồ sơ biện pháp thi công cho các công trình quy mô lớn.',
      en: 'Structural and finishing shopdrawing, BIM/Revit coordination, and method statement packages.'
    },
    sections: {},
    updatedAt: '2026-02-26T00:00:00Z'
  }
};
