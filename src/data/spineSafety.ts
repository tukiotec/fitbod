/**
 * Y KHOA THỂ HÌNH & CHUẨN AN TOÀN CỘT SỐNG (HERNIATED DISC & LUMBAR SPINE SAFETY)
 * Thiết kế chuyên biệt cho người bị:
 * - Thoát vị đĩa đệm cột sống thắt lưng (L4-L5, L5-S1)
 * - Thoái hóa đốt sống, phồng lồi đĩa đệm, đau thắt lưng mạn tính (Lower Back Pain)
 */

export const HERNIATED_DISC_EXCLUDED_IDS = [
  'barbell_squat',          // Gánh đùi sau đòn tạ (Nén dọc trục cột sống thắt lưng)
  'barbell_front_squat',    // Gánh đùi trước đòn tạ
  'deadlift',               // Kéo đòn tạ từ sàn (Lực cắt thắt lưng cực lớn)
  'romanian_deadlift',      // Gập hông kéo đòn tạ RDL
  'dumbbell_rdl',           // Gập hông kéo tạ đơn RDL
  'barbell_row',            // Chèo tạ đòn cúi người không tựa ngực
  'tbar_row',               // Chèo tạ T-Bar không tựa ngực
  'back_extension',         // Gập lưng Hyperextension (Uốn cong & duỗi quá mức thắt lưng)
  'overhead_press',         // Đẩy tạ đòn đứng qua đầu (Nén toàn bộ trục cột sống)
  'barbell_shrug',          // Nhún cầu vai đòn tạ nặng đứng
  'standing_calf_raise',    // Nhún bắp chân đứng đệm vai tì nén cột sống
  'cable_woodchopper',      // Vặn xoắn cột sống có tải trọng cáp (Nguy cơ rách bao xơ)
  'cable_crunch'            // Gập bụng quỳ kéo cáp (Spinal flexion có tải tạ đè)
];

export const SPINE_SAFE_ALTERNATIVES: Record<string, string> = {
  barbell_squat: 'leg_press',                  // Thay bằng Đạp đùi máy khối (Lưng tựa đệm)
  barbell_front_squat: 'leg_press',
  deadlift: 'lying_leg_curl',                  // Thay bằng Nằm móc đùi sau máy (0% áp lực thắt lưng)
  romanian_deadlift: 'seated_leg_curl',        // Thay bằng Ngồi móc đùi sau máy
  dumbbell_rdl: 'seated_leg_curl',
  barbell_row: 'seated_cable_row',             // Thay bằng Ngồi chèo cáp thẳng lưng
  tbar_row: 'seated_cable_row',
  back_extension: 'plank',                     // Thay bằng Plank giữ phẳng cơ lõi tĩnh
  overhead_press: 'dumbbell_lateral_raise',    // Thay bằng Bay vai bên tạ đơn (0 nén cột sống)
  barbell_shrug: 'face_pull',                  // Thay bằng Kéo cáp mặt chỉnh tư thế
  standing_calf_raise: 'seated_calf_raise',    // Thay bằng Máy nhún bắp chân ngồi đệm tì đầu gối
  cable_woodchopper: 'plank',
  cable_crunch: 'plank'
};

export const SPINE_SAFETY_REASONS: Record<string, string> = {
  barbell_squat: 'Đòn tạ đè trên vai tạo lực nén dọc trục cực lớn lên đĩa đệm L4-L5-S1. Đã chuyển sang Đạp đùi máy khối có đệm tựa lưng an toàn.',
  barbell_front_squat: 'Nén dọc trục cột sống. Đã chuyển sang máy Leg Press tựa lưng.',
  deadlift: 'Lực cắt (shear force) thắt lưng khi nhấc tạ từ sàn rất lớn, dễ làm rách bao xơ đĩa đệm. Đã chuyển sang máy Móc đùi sau.',
  romanian_deadlift: 'Tư thế gập hông tự do dồn toàn bộ mô-men uốn vào cột sống thắt lưng. Đã chuyển sang máy móc đùi sau an toàn.',
  dumbbell_rdl: 'Gập hông có tải trọng thắt lưng. Đã chuyển sang máy ngồi móc đùi sau.',
  barbell_row: 'Cúi người 45-70 độ không có điểm tựa ngực khiến đốt sống thắt lưng phải chịu tải tĩnh quá mức. Đã chuyển sang Ngồi chèo cáp.',
  tbar_row: 'Tải uốn cong thắt lưng không có đệm tì ngực. Đã chuyển sang Chèo cáp có tựa chân.',
  back_extension: 'Uốn cong và duỗi quá mức thắt lưng dễ gây chèn ép rễ thần kinh tọa. Đã chuyển sang Plank giữ cơ lõi trung tính.',
  overhead_press: 'Đẩy tạ đứng qua đầu làm võng và nén ép các đốt sống lưng. Đã chuyển sang Bay vai bên tạ đơn an toàn.',
  barbell_shrug: 'Tải trọng nặng kéo xệ và nén ép đốt sống cổ và thắt lưng. Đã chuyển sang Face Pull.',
  standing_calf_raise: 'Đệm máy tì thẳng vào 2 vai dồn nén cột sống. Đã chuyển sang Ngồi nhún bắp chân (tải đè trên đầu gối).',
  cable_woodchopper: 'Xoay vặn cột sống có tải trọng cáp là nguyên nhân hàng đầu gây tái phát thoát vị. Đã thay bằng Plank chống xoay.',
  cable_crunch: 'Gập gù cột sống thắt lưng có tải tạ đè (Spinal flexion). Bác sĩ cột sống cấm tập động tác này khi có thoát vị.'
};

export function isExerciseSpineSafe(exerciseId: string): boolean {
  return !HERNIATED_DISC_EXCLUDED_IDS.includes(exerciseId);
}
