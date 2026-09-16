export interface GymMachineItem {
  id: string;
  nameVi: string;
  nameEn: string;
  category: 'lower' | 'upper' | 'cable' | 'cardio';
  imageUrl: string;
  description: string;
  exerciseIds: string[];
}

export const GYM_MACHINES_CATALOG: GymMachineItem[] = [
  // ==========================================
  // NHÓM MÁY TẬP CHÂN & MÔNG (LOWER BODY)
  // ==========================================
  {
    id: 'leg_press_machine',
    nameVi: 'Máy Đạp Đùi Nghiêng 45°',
    nameEn: '45° Leg Press Machine',
    category: 'lower',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg',
    description: 'Máy đạp tạ nghiêng với bàn đạp to, bảo vệ cột sống và tập nặng cho đùi trước, đùi sau & mông.',
    exerciseIds: ['leg_press']
  },
  {
    id: 'leg_extension_machine',
    nameVi: 'Máy Đá Đùi Trước',
    nameEn: 'Leg Extension Machine',
    category: 'lower',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg',
    description: 'Máy ngồi đá đùi với con lăn đệm ống chân, cô lập tối đa cơ đùi trước (Quadriceps).',
    exerciseIds: ['leg_extension']
  },
  {
    id: 'lying_leg_curl_machine',
    nameVi: 'Máy Nằm Móc Đùi Sau',
    nameEn: 'Lying Leg Curl Machine',
    category: 'lower',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg',
    description: 'Băng ghế nằm sấp cuộn chân kéo tạ, tập trung phát triển độ dày cơ đùi sau (Hamstrings).',
    exerciseIds: ['lying_leg_curl']
  },
  {
    id: 'seated_leg_curl_machine',
    nameVi: 'Máy Ngồi Móc Đùi Sau',
    nameEn: 'Seated Leg Curl Machine',
    category: 'lower',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg',
    description: 'Máy ngồi khóa gối cuộn bắp đùi sau xuống gầm ghế, an toàn cho khớp gối và lưng.',
    exerciseIds: ['seated_leg_curl']
  },
  {
    id: 'seated_calf_machine',
    nameVi: 'Máy Nhón Bắp Chân Ngồi',
    nameEn: 'Seated Calf Raise Machine',
    category: 'lower',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg',
    description: 'Máy ngồi kê đệm trên đùi, chuyên phát triển cơ dép sâu (Soleus) của bắp chân.',
    exerciseIds: ['seated_calf_raise']
  },
  {
    id: 'standing_calf_machine',
    nameVi: 'Máy Nhón Bắp Chân Đứng',
    nameEn: 'Standing Calf Raise Machine',
    category: 'lower',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg',
    description: 'Khung máy đệm vai đứng nhón chân, tăng kích thước cơ bụng chân (Gastrocnemius).',
    exerciseIds: ['standing_calf_raise']
  },

  // ==========================================
  // NHÓM MÁY TẬP THÂN TRÊN (UPPER BODY)
  // ==========================================
  {
    id: 'pec_deck_machine',
    nameVi: 'Máy Ép Ngực Bướm (Pec Deck)',
    nameEn: 'Pec Deck / Butterfly Machine',
    category: 'upper',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/0.jpg',
    description: 'Máy ngồi ép ngực 2 cánh tay vào giữa, ép căng khe ngực và cơ ngực trong an toàn.',
    exerciseIds: ['pec_deck_machine']
  },
  {
    id: 'reverse_pec_deck_machine',
    nameVi: 'Máy Ép Vai Sau (Rear Delt Machine)',
    nameEn: 'Reverse Pec Deck Machine',
    category: 'upper',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/0.jpg',
    description: 'Ngồi úp ngực vào đệm, mở tay về sau để cô lập hoàn hảo cơ vai sau (Posterior Deltoid).',
    exerciseIds: ['reverse_pec_deck']
  },
  {
    id: 'chest_press_machine',
    nameVi: 'Máy Đẩy Ngực Ngang (Seated Chest Press)',
    nameEn: 'Seated Chest Press Machine',
    category: 'upper',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/0.jpg',
    description: 'Máy ngồi đẩy ngực có quỹ đạo cố định, an toàn tuyệt đối khi tập nặng không cần người đỡ.',
    exerciseIds: ['chest_press_machine']
  },
  {
    id: 'incline_chest_press_machine',
    nameVi: 'Máy Đẩy Ngực Dốc Lên',
    nameEn: 'Incline Chest Press Machine',
    category: 'upper',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Incline_Chest_Press/0.jpg',
    description: 'Máy đẩy ngực theo góc xiên 30-45°, tập trung phát triển cơ ngực trên dày dặn.',
    exerciseIds: ['incline_chest_press_machine']
  },
  {
    id: 'tbar_row_machine',
    nameVi: 'Máy Chèo Lưng T-Bar Có Đệm',
    nameEn: 'Chest-Supported T-Bar Row',
    category: 'upper',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row_with_Handle/0.jpg',
    description: 'Khung máy úp ngực kéo thanh đòn chữ T, làm dày cơ xô và cơ trám lưng mà không lo mỏi thắt lưng.',
    exerciseIds: ['tbar_row']
  },

  // ==========================================
  // NHÓM DÀN KÉO CÁP (CABLE STATIONS)
  // ==========================================
  {
    id: 'lat_pulldown_station',
    nameVi: 'Trạm Kéo Xô Dọc (Lat Pulldown)',
    nameEn: 'Lat Pulldown Machine',
    category: 'cable',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg',
    description: 'Trạm kéo cáp từ trên cao xuống có đệm khóa đùi, bài tập số 1 tạo độ rộng cho lưng xô chữ V.',
    exerciseIds: ['lat_pulldown', 'close_grip_lat_pulldown', 'straight_arm_pulldown']
  },
  {
    id: 'seated_cable_row_station',
    nameVi: 'Trạm Kéo Cáp Ngồi Thấp (Low Row)',
    nameEn: 'Seated Cable Row Station',
    category: 'cable',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg',
    description: 'Ghế ngồi đạp chân kéo cáp tầm thấp ngang bụng, giúp lưng giữa dày dặn và tư thế thẳng đứng.',
    exerciseIds: ['seated_cable_row']
  },
  {
    id: 'cable_crossover_station',
    nameVi: 'Dàn Cáp Đôi Crossover (Dual Pulley)',
    nameEn: 'Cable Crossover Station',
    category: 'cable',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg',
    description: 'Cặp ròng rọc đôi 2 bên đối xứng, dùng để ép ngực cáp chéo, ép ngực dốc và xoay người kéo bụng.',
    exerciseIds: ['cable_chest_fly', 'incline_cable_fly', 'decline_cable_fly', 'cable_woodchopper']
  },
  {
    id: 'single_cable_station',
    nameVi: 'Cột Kéo Cáp Đơn Đa Năng',
    nameEn: 'Single Cable Column Station',
    category: 'cable',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg',
    description: 'Trạm kéo cáp đơn có thể điều chỉnh độ cao từ chân lên đầu, dùng cho tay sau, tay trước, vai và bụng.',
    exerciseIds: [
      'tricep_rope_pushdown',
      'cable_straight_bar_pushdown',
      'overhead_cable_tricep_extension',
      'cable_bicep_curl',
      'cable_lateral_raise',
      'face_pull',
      'cable_crunch',
      'cable_glute_kickback'
    ]
  },

  // ==========================================
  // NHÓM THIẾT BỊ CARDIO
  // ==========================================
  {
    id: 'cardio_treadmill',
    nameVi: 'Máy Chạy Bộ Điện (Treadmill)',
    nameEn: 'Treadmill',
    category: 'cardio',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/0.jpg',
    description: 'Máy chạy bộ có chế độ chỉnh độ dốc và tốc độ, dùng cho khởi động hoặc hạ nhiệt đốt mỡ.',
    exerciseIds: ['cardio_treadmill']
  },
  {
    id: 'cardio_bike',
    nameVi: 'Xe Đạp Tập Thể Lực (Stationary Bike)',
    nameEn: 'Stationary Exercise Bike',
    category: 'cardio',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg',
    description: 'Xe đạp kháng lực từ tính hoặc xích đĩa, giảm áp lực lên khớp gối và mắt cá chân.',
    exerciseIds: ['cardio_bike']
  },
  {
    id: 'cardio_elliptical',
    nameVi: 'Máy Trượt Tuyết (Elliptical Trainer)',
    nameEn: 'Elliptical Trainer',
    category: 'cardio',
    imageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/0.jpg',
    description: 'Máy tập toàn thân chuyển động elip không xung kích, phối hợp cả tay và chân.',
    exerciseIds: ['cardio_elliptical']
  }
];

export const ALL_MACHINE_IDS = GYM_MACHINES_CATALOG.map(m => m.id);

/**
 * Lấy danh sách các exerciseId bị loại trừ dựa trên danh sách máy tập phòng gym KHÔNG CÓ
 */
export function getExcludedExerciseIds(availableMachineIds: string[]): string[] {
  const availableSet = new Set(availableMachineIds);
  const excluded = new Set<string>();

  GYM_MACHINES_CATALOG.forEach(m => {
    if (!availableSet.has(m.id)) {
      m.exerciseIds.forEach(eid => excluded.add(eid));
    }
  });

  return Array.from(excluded);
}
