import { MuscleGroup, MuscleInfo, ExerciseItem } from '../types';
export type { ExercisePreferenceStatus } from '../utils/exercisePreferences';
export { 
  getExercisePreferences, 
  setExercisePreference, 
  isExerciseFavorite, 
  isExerciseExcluded, 
  toggleExerciseFavorite, 
  toggleExerciseExclude, 
  subscribeExercisePreferences 
} from '../utils/exercisePreferences';

export const MUSCLES_INFO: Record<MuscleGroup, MuscleInfo> = {
  chest: { id: 'chest', nameVi: 'Ngực', nameEn: 'Chest', region: 'upper', tau: 28 },
  lats: { id: 'lats', nameVi: 'Lưng xô', nameEn: 'Lats', region: 'upper', tau: 28 },
  upper_back: { id: 'upper_back', nameVi: 'Lưng trên', nameEn: 'Upper Back', region: 'upper', tau: 24 },
  lower_back: { id: 'lower_back', nameVi: 'Lưng dưới', nameEn: 'Lower Back', region: 'upper', tau: 32 },
  shoulders: { id: 'shoulders', nameVi: 'Vai', nameEn: 'Shoulders', region: 'upper', tau: 24 },
  biceps: { id: 'biceps', nameVi: 'Tay trước', nameEn: 'Biceps', region: 'upper', tau: 18 },
  triceps: { id: 'triceps', nameVi: 'Tay sau', nameEn: 'Triceps', region: 'upper', tau: 18 },
  forearms: { id: 'forearms', nameVi: 'Cẳng tay', nameEn: 'Forearms', region: 'upper', tau: 16 },
  quads: { id: 'quads', nameVi: 'Đùi trước', nameEn: 'Quadriceps', region: 'lower', tau: 30 },
  hamstrings: { id: 'hamstrings', nameVi: 'Đùi sau', nameEn: 'Hamstrings', region: 'lower', tau: 30 },
  glutes: { id: 'glutes', nameVi: 'Mông', nameEn: 'Glutes', region: 'lower', tau: 28 },
  calves: { id: 'calves', nameVi: 'Bắp chân', nameEn: 'Calves', region: 'lower', tau: 18 },
  abs: { id: 'abs', nameVi: 'Cơ bụng', nameEn: 'Abs & Core', region: 'core', tau: 16 },
  traps: { id: 'traps', nameVi: 'Cầu vai', nameEn: 'Trapezius', region: 'upper', tau: 20 },
};

export const EXERCISE_CATALOG: (ExerciseItem & {
  images: string[];
  videoUrl?: string;
  videoEmbedId?: string;
  videoQuery?: string;
  setup?: string;
  execution?: string;
  mistakes?: string;
})[] = [
  {
    "id": "barbell_bench_press",
    "name": "Barbell Bench Press",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.2
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Ngực Giữa & Toàn Phần",
      "primaryHeadNameEn": "Mid & Lower Pectoralis",
      "secondaryHeads": [
        "Tay sau (Triceps)",
        "Vai trước (Anterior Delt)"
      ],
      "mindMuscleCue": "Hạ tạ chạm nhẹ ngực giữa. Khi đẩy lên, chủ động ép hai khuỷu tay vào phía trong lồng ngực để vắt cạn cơ ngực.",
      "feelingLocation": "Chính giữa ngực và phần chân ngực dưới",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg"
    ],
    "videoQuery": "how to barbell bench press form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-bench-press.mp4",
    "videoEmbedId": "rT7DgCr-3pg",
    "setup": "Nằm ngửa trên ghế phẳng, mắt ngay dưới thanh đòn. Bàn chân đặt vững trên sàn, ưỡn ngực nhẹ và kéo xương bả vai về sau.",
    "execution": "Tháo đòn tạ, hít sâu gồng bụng, hạ tạ kiểm soát xuống chạm ngực giữa (khuỷu tay tạo góc 45-75 độ với thân người). Đẩy dứt khoát lên và thở ra.",
    "mistakes": "Không để cổ tay bị bẻ quặt ra sau, không nhấc mông khỏi ghế khi đẩy nặng, không để đòn tạ dội nảy trên lồng ngực."
  },
  {
    "id": "incline_barbell_bench_press",
    "name": "Incline Barbell Bench Press",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.2
      },
      {
        "muscle": "triceps",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Ngực Trên (Clavicular Head)",
      "primaryHeadNameEn": "Upper Pectoralis",
      "secondaryHeads": [
        "Vai trước",
        "Tay sau"
      ],
      "mindMuscleCue": "Hạ đòn tạ về sát xương quai xanh. Cảm nhận thớ cơ ngực trên căng tối đa trước khi đẩy dứt khoát lên.",
      "feelingLocation": "Vùng ngực sát dưới cổ và xương quai xanh",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Barbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Barbell_Bench_Press/1.jpg"
    ],
    "videoQuery": "how to incline barbell bench press",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-incline-bench-press.mp4",
    "videoEmbedId": "SrqOu55lrYU",
    "setup": "Ghế dốc 30-45 độ. Cố định bả vai, ưỡn lồng ngực.",
    "execution": "Hạ đòn chạm nhẹ ngực trên, đẩy đòn theo phương thẳng đứng dứt khoát.",
    "mistakes": "Không chỉnh ghế quá dốc (>45 độ sẽ ăn hết vào khớp vai)."
  },
  {
    "id": "incline_dumbbell_press",
    "name": "Incline Dumbbell Press",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.2
      },
      {
        "muscle": "triceps",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Ngực Trên (Clavicular Head)",
      "primaryHeadNameEn": "Upper Pectoralis Major",
      "secondaryHeads": [
        "Vai trước",
        "Tay sau"
      ],
      "mindMuscleCue": "Hạ tạ thật sâu để kéo dãn cơ ngực trên. Đẩy lên theo hình vòng cung nhẹ và siết chặt 2 quả tạ về giữa ngực trên.",
      "feelingLocation": "Phần cơ ngực giáp với xương quai xanh",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/1.jpg"
    ],
    "videoQuery": "how to incline dumbbell press form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-bench-press.mp4",
    "videoEmbedId": "8iPEnn-ltC8",
    "setup": "Chỉnh ghế dốc 30-45 độ. Đặt 2 quả tạ đơn lên đùi, dùng đầu gối hất từng quả lên vị trí ngang vai.",
    "execution": "Hạ tạ kiểm soát trong 2-3 giây cho đến khi cảm thấy ngực trên căng hết cỡ, đẩy dứt khoát lên và siết cơ ngực ở đỉnh.",
    "mistakes": "Không chạm 2 quả tạ vào nhau gây mất áp lực, không hạ khuỷu tay quá vuông góc làm chèn ép bao khớp vai."
  },
  {
    "id": "dumbbell_bench_press",
    "name": "Flat Dumbbell Bench Press",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.2
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Ngực Giữa & Dày Ngực",
      "primaryHeadNameEn": "Mid Pectoralis",
      "secondaryHeads": [
        "Tay sau",
        "Vai trước"
      ],
      "mindMuscleCue": "Biên độ sâu hơn đòn tạ. Mở rộng lồng ngực khi hạ và ép hai bắp tay sát vào sườn khi đẩy lên.",
      "feelingLocation": "Toàn bộ bầu ngực",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/1.jpg"
    ],
    "videoQuery": "dumbbell bench press form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-hammer-press.mp4",
    "videoEmbedId": "VmB1G1K7v94",
    "setup": "Nằm ngửa trên ghế phẳng, cầm 2 tạ đơn ngay trên ngực giữa.",
    "execution": "Hạ tạ chậm rãi sang 2 bên, khuỷu tay 60 độ. Đẩy lên hội tụ về đỉnh.",
    "mistakes": "Không khóa cứng khớp khuỷu tay ở đỉnh."
  },
  {
    "id": "decline_dumbbell_press",
    "name": "Decline Dumbbell Press",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_duoi",
      "primaryHeadNameVi": "Ngực Dưới (Abdominal Head)",
      "primaryHeadNameEn": "Lower Pectoralis",
      "secondaryHeads": [
        "Tay sau"
      ],
      "mindMuscleCue": "Ghế dốc xuống 15-30 độ. Đẩy thẳng lên và tập trung siết chặt đường viền chân ngực dưới.",
      "feelingLocation": "Đường viền chân ngực dưới giáp cơ bụng",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Flyes/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Flyes/1.jpg"
    ],
    "videoQuery": "decline dumbbell press",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/decline-dumbbell-bench-press-45-degree.mp4",
    "videoEmbedId": "1OdTFeN90W4",
    "setup": "Cài chân vào móc ghế dốc xuống, cầm tạ ngang ngực dưới.",
    "execution": "Hạ tạ xuống 2 bên chân ngực dưới, đẩy lên dứt khoát.",
    "mistakes": "Không gập cổ quá mức khi nằm dốc xuống."
  },
  {
    "id": "cable_chest_fly",
    "name": "Cable Chest Fly",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Rãnh Ngực Giữa & Ép Ngực",
      "primaryHeadNameEn": "Inner Sternal Pectoralis",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Giữ khuỷu tay hơi cong cố định, tưởng tượng như đang ôm một thân cây lớn. Ép 2 cổ tay chạm nhau và giữ 1 giây.",
      "feelingLocation": "Rãnh giữa ngực và phần ngực trong",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Ròng rọc đôi 2:1 (Lực kéo = 50% cọc tạ)"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/1.jpg"
    ],
    "videoQuery": "how to cable chest fly form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-lying-fly-flat-bench-cable-fly.mp4",
    "videoEmbedId": "taI4XduLpTk",
    "setup": "Chỉnh ròng rọc ngang ngực. Đứng chân trước chân sau vững chãi, người hơi đổ về trước.",
    "execution": "Ép 2 tay về phía trước ngực, thở ra và siết rãnh ngực trong 1 giây. Mở rộng tay có kiểm soát.",
    "mistakes": "Không dùng đà thân người để giật cáp, không duỗi thẳng đơ khuỷu tay."
  },
  {
    "id": "incline_cable_fly",
    "name": "Low-to-High Incline Cable Fly",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.8
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Ngực Trên & Cầu Vai Trước",
      "primaryHeadNameEn": "Upper Chest Cable Sweep",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Kéo từ nấc thấp nhất lên phía trước trán. Cảm nhận thớ cơ ngực trên co thắt cực đại.",
      "feelingLocation": "Ngực trên sát xương quai xanh",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 10,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/1.jpg"
    ],
    "videoQuery": "low to high cable fly",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-fly-crossover-fly.mp4",
    "videoEmbedId": "ZWa8v57fCZ8",
    "setup": "Cáp đặt ở nấc thấp nhất sát sàn. Đứng giữa giàn cáp.",
    "execution": "Kéo 2 tay từ dưới lên trên chụm trước cằm, siết chặt cơ ngực trên.",
    "mistakes": "Không dùng vai kéo mà hãy tập trung dùng ngực trên co rút."
  },
  {
    "id": "decline_cable_fly",
    "name": "High-to-Low Cable Fly",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_duoi",
      "primaryHeadNameVi": "Ngực Dưới Cắt Nét",
      "primaryHeadNameEn": "Lower Chest Cable Sweep",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Cáp đặt trên cao nhất. Kéo chéo xuống phía trước đùi dưới và siết chặt chân ngực.",
      "feelingLocation": "Đáy ngực dưới",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/1.jpg"
    ],
    "videoQuery": "high to low cable fly",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/band-high-fly.mp4",
    "videoEmbedId": "5SrkaIbDth4",
    "setup": "Cáp đặt nấc cao nhất. Đứng nghiêng người về trước.",
    "execution": "Kéo cáp chúc xuống hai bên hông đùi, siết đáy ngực.",
    "mistakes": "Không để vai bị nhô về trước."
  },
  {
    "id": "pec_deck_machine",
    "name": "Pec Deck Machine Fly",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Ép Ngực & Rãnh Ngực (Máy Khối)",
      "primaryHeadNameEn": "Pectoralis Sternal",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Áp lưng vào đệm. Ép hai cùi chỏ hoặc tay cầm vào nhau, giữ 1 nhịp ở đỉnh siết.",
      "feelingLocation": "Toàn bộ khối ngực và rãnh giữa",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/1.jpg"
    ],
    "videoQuery": "pec deck machine form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-pec-deck-fly.mp4",
    "videoEmbedId": "a9vQ_hwIksU",
    "setup": "Chỉnh chiều cao ghế sao cho tay cầm ngang ngực giữa.",
    "execution": "Ép vào giữ 1 giây, mở ra chậm trong 3 giây.",
    "mistakes": "Không để tạ va đập vào cọc khi mở rộng tay."
  },
  {
    "id": "chest_press_machine",
    "name": "Chest Press Machine",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Đẩy Ngực Bằng Máy Khối",
      "primaryHeadNameEn": "Chest Press Machine",
      "secondaryHeads": [
        "Tay sau"
      ],
      "mindMuscleCue": "Đường di chuyển máy cố định, tập trung gồng ngực đẩy hết biên độ và hạ chậm.",
      "feelingLocation": "Bầu ngực giữa",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/1.jpg"
    ],
    "videoQuery": "machine chest press",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-lying-chest-press.mp4",
    "videoEmbedId": "xUm0BiZCWlQ",
    "setup": "Chỉnh ghế sao cho tay cầm nằm ở 1/3 dưới ngực.",
    "execution": "Đẩy thẳng tay không khóa khớp, hạ kiểm soát.",
    "mistakes": "Không rụt cổ khi đẩy nặng."
  },
  {
    "id": "incline_chest_press_machine",
    "name": "Incline Chest Press Machine",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.2
      },
      {
        "muscle": "triceps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Đẩy Ngực Trên Bằng Máy",
      "primaryHeadNameEn": "Incline Machine Press",
      "secondaryHeads": [
        "Vai trước",
        "Tay sau"
      ],
      "mindMuscleCue": "Quỹ đạo đẩy chếch lên trên. Cảm nhận ngực trên co bóp tối đa.",
      "feelingLocation": "Ngực trên",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Incline_Chest_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Incline_Chest_Press/1.jpg"
    ],
    "videoQuery": "incline chest press machine",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-incline-hammer-chest-press.mp4",
    "videoEmbedId": "VesHgJR14E8",
    "setup": "Ngồi vững trên ghế máy dốc, tay nắm chắc cán đẩy.",
    "execution": "Đẩy dứt khoát theo quỹ đạo máy, thở ra.",
    "mistakes": "Không nhấc lưng khỏi đệm ghế."
  },
  {
    "id": "chest_dip",
    "name": "Chest Dip (Xà kép tập ngực)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_duoi",
      "primaryHeadNameVi": "Ngực Dưới & Cắt Nét Viền Ngực",
      "primaryHeadNameEn": "Lower Pectoralis & Dips",
      "secondaryHeads": [
        "Tay sau (Triceps)",
        "Vai trước"
      ],
      "mindMuscleCue": "Nghiêng thân người về phía trước 30 độ, cằm gập nhẹ vào ngực. Hạ xuống đến khi bắp tay song song với sàn và dùng cơ ngực dưới đẩy người lên.",
      "feelingLocation": "Viền ngực dưới và cơ tay sau",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/1.jpg"
    ],
    "videoQuery": "chest dips proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/chest-dips.mp4",
    "videoEmbedId": "2z8JmcrW-As",
    "setup": "Chống 2 tay lên thanh xà kép, khóa thẳng tay nhưng không khóa khớp, co gối và nghiêng thân trên về phía trước.",
    "execution": "Hạ người xuống chậm rãi, mở rộng khuỷu tay sang 2 bên vừa phải. Khi cánh tay vuông góc 90 độ, gồng ngực đẩy người lên dứt khoát.",
    "mistakes": "Không giữ người thẳng đứng (sẽ ăn hết vào tay sau thay vì ngực), không hạ quá sâu làm tổn thương bao khớp vai."
  },
  {
    "id": "push_up",
    "name": "Standard Push Up (Hít đất)",
    "tier": 3,
    "equipment": "bodyweight",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      },
      {
        "muscle": "abs",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Ngực Giữa & Sức Bền Lõi",
      "primaryHeadNameEn": "Mid Pectoralis & Core",
      "secondaryHeads": [
        "Tay sau",
        "Cơ bụng lõi"
      ],
      "mindMuscleCue": "Thân người thẳng như tấm ván. Siết mông bụng, hạ ngực chạm sàn và đẩy lên ép chặt ngực.",
      "feelingLocation": "Toàn bộ cơ ngực",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/1.jpg"
    ],
    "videoQuery": "how to push up form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/push-ups.mp4",
    "videoEmbedId": "IODxDxX7oi4",
    "setup": "Chống 2 tay rộng bằng vai trên sàn, chân khép, siết chặt cơ bụng và mông.",
    "execution": "Hạ người xuống có kiểm soát cho đến khi ngực cách sàn 2-3cm, thở ra và đẩy mạnh người lên vị trí ban đầu.",
    "mistakes": "Không để võng lưng dưới, không để mông nhô quá cao, không chìa khuỷu tay sang ngang vuông góc 90 độ."
  },
  {
    "id": "deadlift",
    "name": "Barbell Conventional Deadlift",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "lower_back",
        "ratio": 0.35
      },
      {
        "muscle": "hamstrings",
        "ratio": 0.35
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.15
      },
      {
        "muscle": "lats",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_duoi",
      "primaryHeadNameVi": "Lưng Dưới & Toàn Bộ Chuỗi Cơ Sau (Posterior Chain)",
      "primaryHeadNameEn": "Erector Spinae & Hamstrings",
      "secondaryHeads": [
        "Đùi sau",
        "Mông lớn",
        "Lưng xô"
      ],
      "mindMuscleCue": "Đạp sàn bằng gót chân như đẩy sàn nhà ra xa. Khóa lưng thẳng, kéo tạ bám sát cẳng chân và khóa hông dứt khoát ở đỉnh.",
      "feelingLocation": "Cột sống lưng dưới, đùi sau và mông",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/1.jpg"
    ],
    "videoQuery": "how to conventional deadlift form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-straight-leg-deadlift.mp4",
    "videoEmbedId": "op9kVnSso6Q",
    "setup": "Đứng giữa thanh đòn, chân rộng bằng hông, đòn tạ cắt ngang giữa bàn chân. Cúi người nắm thanh đòn sát ngoài cẳng chân.",
    "execution": "Hạ mông, mở ngực, gồng chặt cơ bụng. Đạp mạnh chân xuống sàn, kéo thanh đòn thẳng đứng bám sát cẳng chân lên đến khi đứng thẳng.",
    "mistakes": "Tuyệt đối không cong lưng tôm khi nhấc tạ, không ngửa người quá đà về sau ở đỉnh động tác."
  },
  {
    "id": "barbell_row",
    "name": "Barbell Bent-Over Row",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.5
      },
      {
        "muscle": "lats",
        "ratio": 0.3
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_tren",
      "primaryHeadNameVi": "Độ Dày Lưng Giữa & Xô (Rhomboids & Mid Trap)",
      "primaryHeadNameEn": "Rhomboids, Mid Trapezius & Lats",
      "secondaryHeads": [
        "Tay trước",
        "Lưng xô"
      ],
      "mindMuscleCue": "Gập người 45 độ, kéo đòn tạ chạm nhẹ rốn. Chủ động khép chặt 2 xương bả vai vào nhau như kẹp cây bút chì ở giữa sống lưng.",
      "feelingLocation": "Giữa sống lưng và thớ cơ xô hai bên sườn",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/1.jpg"
    ],
    "videoQuery": "barbell bent over row form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-underhand-bent-over-row.mp4",
    "videoEmbedId": "qXrTDQG1oUQ",
    "setup": "Cầm đòn rộng hơn vai, gập hông giữ lưng thẳng 45 độ.",
    "execution": "Kéo đòn về phía rốn, ép bả vai, thở ra. Hạ từ từ có kiểm soát.",
    "mistakes": "Không giật người dùng quán tính, không cong lưng dưới."
  },
  {
    "id": "dumbbell_row",
    "name": "Single-Arm Dumbbell Row",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.25
      },
      {
        "muscle": "biceps",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Cơ Xô Dày Từng Bên (Latissimus Dorsi)",
      "primaryHeadNameEn": "Latissimus Dorsi",
      "secondaryHeads": [
        "Lưng trên",
        "Tay trước"
      ],
      "mindMuscleCue": "Tựa 1 gối lên ghế phẳng. Kéo tạ theo quỹ đạo vòng cung về phía hông, dẫn đường bằng khuỷu tay chứ không giật bằng bàn tay.",
      "feelingLocation": "Rìa cơ xô bên hông sườn kéo dài xuống thắt lưng",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/1.jpg"
    ],
    "videoQuery": "single arm dumbbell row",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-bent-over-row.mp4",
    "videoEmbedId": "roCP6wCXPqo",
    "setup": "Một tay một gối tựa ghế phẳng, lưng thẳng song song mặt sàn.",
    "execution": "Kéo tạ đơn về sát túi quần sau, siết xô 1 nhịp rồi hạ sâu kéo dãn cơ xô.",
    "mistakes": "Không xoay vặn vai quá mức khi kéo tạ lên."
  },
  {
    "id": "lat_pulldown",
    "name": "Cable Front Lat Pulldown",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.2
      },
      {
        "muscle": "upper_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Độ Rộng Cơ Xô (Lat Width - Cánh Bướm)",
      "primaryHeadNameEn": "Latissimus Dorsi (Outer Sweep)",
      "secondaryHeads": [
        "Tay trước",
        "Lưng trên"
      ],
      "mindMuscleCue": "Ngả người nhẹ 10-15 độ, ưỡn ngực đón thanh đòn. Kéo cùi chỏ cắm thẳng xuống đất về hướng túi quần sau, không kéo bằng ngón tay.",
      "feelingLocation": "Dưới nách và dọc hai bên mạn sườn",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 45,
      "noteVi": "Ròng rọc đơn 1:1 (Lực kéo = 100% cọc tạ)"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/1.jpg"
    ],
    "videoQuery": "how to lat pulldown form properly",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-close-grip-front-lat-pulldown.mp4",
    "videoEmbedId": "CAwf7n6Luuc",
    "setup": "Cố định đệm đùi chặt, cầm thanh đòn rộng gấp 1.5 lần vai.",
    "execution": "Kéo thanh đòn xuống chạm nhẹ xương ức trên, siết xô trong 1 giây, nhả tạ chậm kiểm soát.",
    "mistakes": "Không ngửa người quá sâu ra sau biến thành bài chèo lưng, không kéo thanh đòn ra sau gáy gây chấn thương cổ vai."
  },
  {
    "id": "close_grip_lat_pulldown",
    "name": "Close-Grip Lat Pulldown (Tay hẹp V-bar)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.25
      },
      {
        "muscle": "upper_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Xô Dưới & Tay Trước (Lower Lats)",
      "primaryHeadNameEn": "Lower Latissimus Dorsi",
      "secondaryHeads": [
        "Tay trước",
        "Lưng giữa"
      ],
      "mindMuscleCue": "Dùng tay cầm chữ V. Kéo thẳng xuống chạm giữa ngực, ép chặt cùi chỏ sát vào thân mình.",
      "feelingLocation": "Phần xô dưới gần thắt lưng",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 45,
      "noteVi": "Ròng rọc đơn 1:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/1.jpg"
    ],
    "videoQuery": "v bar lat pulldown",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-seated-high-row-v-bar.mp4",
    "videoEmbedId": "jXRxMJhOCc0",
    "setup": "Lắp tay cầm chữ V vào chốt kéo xô, cố định chân dưới đệm.",
    "execution": "Kéo xuống chạm ngực giữa, ngực ưỡn đón tạ, nhả tay hết biên độ kéo dãn xô.",
    "mistakes": "Không gù lưng khi nhả tạ lên cao."
  },
  {
    "id": "seated_cable_row",
    "name": "Seated Cable Row (Kéo cáp ngồi)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.5
      },
      {
        "muscle": "lats",
        "ratio": 0.45
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_tren",
      "primaryHeadNameVi": "Độ Dày Lưng Giữa & Xô Ngang",
      "primaryHeadNameEn": "Mid Back Rhomboids & Lats",
      "secondaryHeads": [
        "Lưng xô",
        "Tay trước"
      ],
      "mindMuscleCue": "Ngồi thẳng lưng, chân hơi chùng. Kéo tay cầm về phía bụng dưới, ép chặt hai bả vai về sau và giữ 1 nhịp.",
      "feelingLocation": "Chính giữa lưng trên và cơ xô",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 40,
      "noteVi": "Ròng rọc đơn 1:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg"
    ],
    "videoQuery": "seated cable row proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-seated-high-row-v-bar.mp4",
    "videoEmbedId": "GZbfZ033f74",
    "setup": "Ngồi vào máy kéo cáp, đặt chân lên giá đỡ, đầu gối hơi chùng để bảo vệ lưng dưới.",
    "execution": "Kéo tay cầm về rốn, giữ lưng thẳng tuyệt đối. Nhả tay từ từ có kiểm soát, kéo dãn cơ lưng.",
    "mistakes": "Không đung đưa người như chèo thuyền thực tế, không để cong lưng tôm khi duỗi tay."
  },
  {
    "id": "straight_arm_pulldown",
    "name": "Straight-Arm Cable Pulldown (Ép xô tay thẳng)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Cô Lập Xô Không Ăn Tay Trước",
      "primaryHeadNameEn": "Lat Isolation Sweeps",
      "secondaryHeads": [
        "Cơ ngực dưới",
        "Cơ liên sườn"
      ],
      "mindMuscleCue": "Tay giữ thẳng chỉ hơi cong nhẹ cùi chỏ. Dùng cơ xô đè thanh đòn xuống chạm đùi trên.",
      "feelingLocation": "Khối xô kéo dài từ nách xuống sườn",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 25,
      "noteVi": "Ròng rọc đơn 1:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight-Arm_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight-Arm_Pulldown/1.jpg"
    ],
    "videoQuery": "straight arm pulldown form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-lift.mp4",
    "videoEmbedId": "hAMcfubonDc",
    "setup": "Đứng lùi lại 1 bước, người hơi gập 30 độ, cầm thanh đòn ngang vai.",
    "execution": "Đè thanh đòn theo hình vòng cung xuống chạm đùi, thở ra và siết xô cực đại.",
    "mistakes": "Không gập cùi chỏ biến thành bài tricep pushdown."
  },
  {
    "id": "tbar_row",
    "name": "Chest-Supported T-Bar Row",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.25
      },
      {
        "muscle": "biceps",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_tren",
      "primaryHeadNameVi": "Độ Dày Lưng Giữa Không Mỏi Lưng Dưới",
      "primaryHeadNameEn": "Rhomboids & Traps",
      "secondaryHeads": [
        "Tay trước",
        "Lưng xô"
      ],
      "mindMuscleCue": "Áp ngực chặt vào đệm hỗ trợ. Kéo cùi chỏ về sau tối đa để hai xương bả vai ép chặt vào nhau.",
      "feelingLocation": "Giữa hai xương bả vai",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row_with_Handle/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row_with_Handle/1.jpg"
    ],
    "videoQuery": "t bar row chest supported",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-underhand-bent-over-row.mp4",
    "videoEmbedId": "j3Igk5nyZE4",
    "setup": "Chỉnh đệm ngực sao cho đỉnh ngực vượt qua mép đệm một chút.",
    "execution": "Kéo tạ lên ép chặt bả vai, hạ xuống có kiểm soát.",
    "mistakes": "Không nhấc ngực khỏi đệm khi kéo nặng."
  },
  {
    "id": "pull_up",
    "name": "Pull Up (Kéo xà đơn phát triển xô)",
    "tier": 1,
    "equipment": "bodyweight",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.2
      },
      {
        "muscle": "upper_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Xô Rộng & Sức Kéo Toàn Diện",
      "primaryHeadNameEn": "Latissimus Dorsi Peak",
      "secondaryHeads": [
        "Tay trước",
        "Lưng trên"
      ],
      "mindMuscleCue": "Treo người thả lỏng kéo dãn xô. Kéo ngực hướng lên thanh xà, dẫn hướng bằng cùi chỏ cắm xuống đất.",
      "feelingLocation": "Hai bên xô dưới cánh tay",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/1.jpg"
    ],
    "videoQuery": "how to pull up form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/band-assisted-pull-up.mp4",
    "videoEmbedId": "eGo4IYlbE5g",
    "setup": "Nắm thanh xà lòng bàn tay hướng ra ngoài, rộng hơn vai.",
    "execution": "Kéo người lên cho đến khi cằm vượt qua xà hoặc ngực chạm xà, hạ xuống kiểm soát.",
    "mistakes": "Không đung đưa văng người (kipping)."
  },
  {
    "id": "chin_up",
    "name": "Chin Up (Kéo xà ngửa tay)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.55
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.35
      },
      {
        "muscle": "upper_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Xô Dưới & Chuột Tay Trước Cực Đại",
      "primaryHeadNameEn": "Underhand Lats & Biceps",
      "secondaryHeads": [
        "Tay trước",
        "Lưng giữa"
      ],
      "mindMuscleCue": "Lòng bàn tay hướng vào mặt. Kéo cùi chỏ ép chặt vào sườn, siết bắp tay trước và xô ở đỉnh.",
      "feelingLocation": "Bắp tay trước và cơ xô",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chin-Up/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chin-Up/1.jpg"
    ],
    "videoQuery": "chin up proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/chin-ups-narrow-parallel-grip.mp4",
    "videoEmbedId": "Oi3bW9nQmGI",
    "setup": "Cầm xà tay ngửa hẹp bằng vai.",
    "execution": "Kéo cằm vượt qua xà, gồng chuột tay trước ở đỉnh.",
    "mistakes": "Không buông rơi tự do khi hạ xuống."
  },
  {
    "id": "back_extension",
    "name": "Hyperextension (Lưng dưới & Mông)",
    "tier": 3,
    "equipment": "bodyweight",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "lower_back",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.25
      },
      {
        "muscle": "hamstrings",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_duoi",
      "primaryHeadNameVi": "Dựng Sống Lưng Dưới (Erector Spinae)",
      "primaryHeadNameEn": "Erector Spinae Lower Back",
      "secondaryHeads": [
        "Mông",
        "Đùi sau"
      ],
      "mindMuscleCue": "Cúi gập hông tự nhiên, nâng thân người lên thành đường thẳng và siết chặt lưng dưới, không ngửa quá mức.",
      "feelingLocation": "Hai thớ cơ dựng cột sống thắt lưng",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/1.jpg"
    ],
    "videoQuery": "back extension hyperextension form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/45-degree-hyperextension.mp4",
    "videoEmbedId": "ph3pddpKzzw",
    "setup": "Cài gót chân vào đệm, đệm đùi nằm dưới xương hông để hông gập tự do.",
    "execution": "Gập người xuống hít vào, nâng người lên thở ra siết cơ dựng sống.",
    "mistakes": "Không ưỡn ngửa người quá đà gây chèn đốt sống thắt lưng."
  },
  {
    "id": "overhead_press",
    "name": "Barbell Overhead Press (OHP)",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.2
      },
      {
        "muscle": "upper_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_truoc",
      "primaryHeadNameVi": "Vai Trước & Sức Mạnh Thân Trên",
      "primaryHeadNameEn": "Anterior Deltoid & Core",
      "secondaryHeads": [
        "Tay sau",
        "Cầu vai"
      ],
      "mindMuscleCue": "Siết mông và gồng bụng thật chặt. Đẩy thanh đòn theo phương thẳng đứng sát qua cằm và khóa đỉnh đầu ngay dưới tạ.",
      "feelingLocation": "Mặt trước của khớp vai và xương đòn",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/1.jpg"
    ],
    "videoQuery": "barbell overhead press form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-seated-behind-head-military-press.mp4",
    "videoEmbedId": "2yjwXTZQDDI",
    "setup": "Đứng thẳng, chân rộng bằng vai, thanh đòn đặt trên xương đòn và cơ ngực trên.",
    "execution": "Đẩy đòn thẳng lên trời, đầu hơi thụt lùi để tránh đòn, khi tạ qua đỉnh đầu thì đưa đầu về vị trí tự nhiên.",
    "mistakes": "Không cong võng lưng dưới khi đẩy nặng, không nhón chân dùng lực đà."
  },
  {
    "id": "dumbbell_shoulder_press",
    "name": "Seated Dumbbell Shoulder Press",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.2
      },
      {
        "muscle": "traps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_truoc",
      "primaryHeadNameVi": "Vai Trước & Bờ Vai Rộng",
      "primaryHeadNameEn": "Anterior & Lateral Deltoid",
      "secondaryHeads": [
        "Tay sau",
        "Vai giữa"
      ],
      "mindMuscleCue": "Ngồi tựa lưng ghế 75-80 độ. Đẩy tạ lên theo hình vòng cung nhẹ, không chạm tạ vào nhau ở đỉnh.",
      "feelingLocation": "Ụ cơ vai trước và cơ vai giữa",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Press/1.jpg"
    ],
    "videoQuery": "dumbbell shoulder press seated",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-bench-seated-press.mp4",
    "videoEmbedId": "qEwKCR5JCog",
    "setup": "Ghế tựa nghiêng 75-80 độ, 2 tạ đơn đặt ngang tai.",
    "execution": "Đẩy tạ lên dứt khoát thở ra, hạ tạ xuống ngang tai hít vào.",
    "mistakes": "Không hạ tạ quá thấp gây căng xé bao khớp vai."
  },
  {
    "id": "arnold_press",
    "name": "Arnold Dumbbell Press",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_truoc",
      "primaryHeadNameVi": "Toàn Bộ Khối Vai (Xoay Cổ Tay)",
      "primaryHeadNameEn": "Full Deltoid Complex",
      "secondaryHeads": [
        "Vai giữa",
        "Tay sau"
      ],
      "mindMuscleCue": "Bắt đầu với lòng bàn tay hướng vào mặt. Khi đẩy lên, xoay cổ tay 180 độ ra ngoài để kích hoạt cả vai trước lẫn vai giữa.",
      "feelingLocation": "Ụ vai xoay quanh khớp",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/1.jpg"
    ],
    "videoQuery": "arnold press form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-arnold-press.mp4",
    "videoEmbedId": "3ml7BH7mNwQ",
    "setup": "Ngồi tựa lưng, tạ giữ trước cằm lòng bàn tay hướng vào mặt.",
    "execution": "Mở rộng khuỷu tay sang 2 bên đồng thời đẩy tạ lên cao và xoay tay ra trước.",
    "mistakes": "Không xoay tạ giật cục, phải mượt mà trong toàn bộ hành trình."
  },
  {
    "id": "dumbbell_lateral_raise",
    "name": "Dumbbell Lateral Raise (Bay vai ngang)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_giua",
      "primaryHeadNameVi": "Vai Giữa - Tạo Độ Rộng Vai (V-Taper)",
      "primaryHeadNameEn": "Lateral Deltoid (Side Delt)",
      "secondaryHeads": [
        "Cầu vai"
      ],
      "mindMuscleCue": "Hơi đổ người về phía trước một chút. Nâng cùi chỏ lên ngang vai như đang rót nước từ bình, ngón út hơi cao hơn ngón cái một chút.",
      "feelingLocation": "Đỉnh chóp ngoài của cơ vai (bờ vai ngang)",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/1.jpg"
    ],
    "videoQuery": "how to dumbbell lateral raise form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lateral-raise.mp4",
    "videoEmbedId": "3VcKaXpzqRo",
    "setup": "Đứng thẳng, chân rộng bằng vai, 2 quả tạ cầm sát đùi, cùi chỏ hơi cong nhẹ.",
    "execution": "Nâng tạ sang 2 bên cho đến khi cánh tay song song với sàn. Giữ 0.5 giây ở đỉnh rồi hạ chậm rãi trong 2 giây.",
    "mistakes": "Không nhún nhảy đu đưa người dùng đà, không nhún cầu vai lên tai làm ăn hết vào cầu vai."
  },
  {
    "id": "cable_lateral_raise",
    "name": "Cable Lateral Raise (Bay vai cáp)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_giua",
      "primaryHeadNameVi": "Vai Giữa - Áp Lực Liên Tục Bằng Cáp",
      "primaryHeadNameEn": "Lateral Deltoid Cable Sweep",
      "secondaryHeads": [
        "Cầu vai"
      ],
      "mindMuscleCue": "Cáp tạo lực căng ngay từ góc 0 độ ở đùi. Dẫn cùi chỏ nâng sang ngang và hạ chậm cảm nhận cơ vai giữa căng đét.",
      "feelingLocation": "Mặt ngoài của vai",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 7.5,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Lateral_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Lateral_Raise/1.jpg"
    ],
    "videoQuery": "cable lateral raise form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-lateral-raise.mp4",
    "videoEmbedId": "PPrzBWZDOhA",
    "setup": "Cáp đặt ở nấc thấp nhất. Đứng nghiêng người cầm tay nắm bên đối diện.",
    "execution": "Nâng tay sang ngang cao bằng vai, hạ kiểm soát.",
    "mistakes": "Không vặn cổ tay quá mức."
  },
  {
    "id": "face_pull",
    "name": "Cable Face Pull (Kéo cáp vai sau)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.5
      },
      {
        "muscle": "upper_back",
        "ratio": 0.3
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_sau",
      "primaryHeadNameVi": "Vai Sau & Cơ Xoay Khớp Vai (Posterior Delt)",
      "primaryHeadNameEn": "Rear Deltoid & Rotator Cuff",
      "secondaryHeads": [
        "Cầu vai",
        "Lưng trên"
      ],
      "mindMuscleCue": "Kéo dây thừng thẳng về phía sống mũi / mắt. Khi kéo về sát mặt, xoay hai cổ tay ra sau và xòe rộng hai đầu dây thừng sang hai bên tai.",
      "feelingLocation": "Mặt sau của khớp vai và vùng cơ giữa hai bả vai",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Ròng rọc đôi 2:1 (Lực kéo = 50% cọc tạ)"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/1.jpg"
    ],
    "videoQuery": "face pull proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-rear-delt-row-with-rope.mp4",
    "videoEmbedId": "rep-qVOkqgk",
    "setup": "Chỉnh ròng rọc cáp ngang tầm mắt, gắn dây thừng (rope attachment).",
    "execution": "Kéo dây về phía mặt, tách rộng 2 đầu dây sang 2 bên tai, siết chặt vai sau trong 1-2 giây rồi nhả tạ kiểm soát.",
    "mistakes": "Không chọn mức tạ quá nặng làm gập người về phía trước, không kéo dây xuống dưới cổ họng."
  },
  {
    "id": "dumbbell_rear_delt_fly",
    "name": "Dumbbell Rear Delt Fly (Bay vai sau)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.3
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_sau",
      "primaryHeadNameVi": "Cơ Vai Sau Cúi Người",
      "primaryHeadNameEn": "Rear Deltoids",
      "secondaryHeads": [
        "Lưng trên"
      ],
      "mindMuscleCue": "Cúi người gập hông gần như song song sàn. Mở rộng tay sang 2 bên như đôi cánh, dẫn động bằng mặt sau của cùi chỏ.",
      "feelingLocation": "Ụ cơ nhỏ sau bả vai",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Rear_Lateral_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Rear_Lateral_Raise/1.jpg"
    ],
    "videoQuery": "dumbbell rear delt fly form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-rear-lateral-raise.mp4",
    "videoEmbedId": "0GSu6Z-Oj7U",
    "setup": "Ngồi trên mép ghế cúi gập người hoặc đứng gập hông lưng thẳng.",
    "execution": "Vung tạ sang 2 bên cao ngang vai, siết vai sau ở đỉnh.",
    "mistakes": "Không vung tạ dùng đà thắt lưng."
  },
  {
    "id": "reverse_pec_deck",
    "name": "Reverse Pec Deck (Máy ép vai sau)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_sau",
      "primaryHeadNameVi": "Vai Sau Trên Máy Ép Ngược",
      "primaryHeadNameEn": "Rear Delt Machine Fly",
      "secondaryHeads": [
        "Lưng trên"
      ],
      "mindMuscleCue": "Ngồi áp ngực vào đệm máy. Quét tay ra sau và gồng siết chóp vai sau.",
      "feelingLocation": "Mặt sau khớp vai",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/1.jpg"
    ],
    "videoQuery": "reverse pec deck form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-lateral-raise.mp4",
    "videoEmbedId": "7tgx6QHB0-A",
    "setup": "Chỉnh tay cầm máy ở vị trí trong cùng, ngực áp sát đệm ghế.",
    "execution": "Dang tay rộng ra sau ngang vai, siết vai sau.",
    "mistakes": "Không rụt cổ nhún cầu vai."
  },
  {
    "id": "barbell_shrug",
    "name": "Barbell Shrug (Nhún cầu vai tạ đòn)",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "cau_vai",
      "primaryHeadNameVi": "Cầu Vai Cao & Dày (Upper Trapezius)",
      "primaryHeadNameEn": "Upper Traps Peak",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Nhấc hai vai thẳng lên phía lỗ tai. Giữ 1-2 giây ở đỉnh co cơ tối đa rồi hạ xuống sâu kéo dãn cầu vai.",
      "feelingLocation": "Ụ cơ thịt dày 2 bên cổ",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/1.jpg"
    ],
    "videoQuery": "barbell shrug proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-shrug.mp4",
    "videoEmbedId": "NAqCVe2mwzM",
    "setup": "Cầm đòn tạ trước đùi rộng bằng vai, người đứng thẳng vững.",
    "execution": "Nhún vai thẳng đứng lên cao nhất có thể, giữ 1 giây rồi hạ chậm.",
    "mistakes": "CẤM xoay tròn khớp vai khi nhún nặng (dễ rách sụn viền vai)."
  },
  {
    "id": "barbell_curl",
    "name": "Barbell Bicep Curl (Cuốn tạ đòn)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_dai",
      "primaryHeadNameVi": "Toàn Bộ Khối Bắp Tay Trước (Biceps Brachii)",
      "primaryHeadNameEn": "Biceps Brachii Short & Long Head",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Kẹp hai cùi chỏ sát sườn cố định không di chuyển. Cuốn thanh đòn lên và chủ động gồng cứng con chuột tay trước ở đỉnh.",
      "feelingLocation": "Chính giữa bắp tay trước",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/1.jpg"
    ],
    "videoQuery": "barbell bicep curl form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-curl.mp4",
    "videoEmbedId": "kwG2ipFRgfo",
    "setup": "Đứng thẳng, 2 tay nắm đòn tạ rộng bằng vai, lòng bàn tay ngửa.",
    "execution": "Cuốn tạ lên đến ngang ngực, thở ra và siết chuột bắp tay trong 1 giây. Hạ tạ xuống chậm rãi hít vào.",
    "mistakes": "Không đung đưa thân người ra sau lấy đà, không dịch chuyển cùi chỏ ra phía trước làm mất áp lực."
  },
  {
    "id": "dumbbell_incline_curl",
    "name": "Incline Dumbbell Bicep Curl",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_dai",
      "primaryHeadNameVi": "Đầu Dài Tay Trước - Tạo Đỉnh Chuột (Long Head)",
      "primaryHeadNameEn": "Biceps Long Head (Peak)",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Nằm ngửa trên ghế dốc 45-60 độ, cánh tay thả thẳng đứng ra sau. Vị trí này kéo dãn đầu dài tay trước tối đa.",
      "feelingLocation": "Bề ngoài bắp tay trước hướng lên vai",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/1.jpg"
    ],
    "videoQuery": "incline dumbbell curl form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-biceps-curl.mp4",
    "videoEmbedId": "soxrZlIl35U",
    "setup": "Ghế dốc 45-60 độ, nằm ngửa tựa lưng hoàn toàn.",
    "execution": "Cuốn tạ lên đồng thời xoay ngửa cổ tay (supination), hạ tạ chậm duỗi hết biên độ.",
    "mistakes": "Không nhấc bả vai khỏi đệm ghế."
  },
  {
    "id": "dumbbell_hammer_curl",
    "name": "Dumbbell Hammer Curl (Cuốn tạ búa)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.6
      },
      {
        "muscle": "forearms",
        "ratio": 0.4
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_truoc_dai",
      "primaryHeadNameVi": "Cơ Tay Giữa & Độ Dày Bắp Tay (Brachialis)",
      "primaryHeadNameEn": "Brachialis & Brachioradialis",
      "secondaryHeads": [
        "Cẳng tay trên"
      ],
      "mindMuscleCue": "Giữ 2 lòng bàn tay đối diện nhau như đang cầm búa đóng đinh. Cuốn tạ lên dứt khoát giúp đẩy bắp tay trước nổi gồ lên dày dặn.",
      "feelingLocation": "Mặt ngoài của bắp tay giáp giữa tay trước và tay sau",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/1.jpg"
    ],
    "videoQuery": "hammer curl proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-hammer-curl.mp4",
    "videoEmbedId": "zC3nLlEvin4",
    "setup": "Đứng thẳng, cầm 2 tạ đơn hướng ngón tay cái lên trần nhà.",
    "execution": "Cuốn tạ lên đến khi cẳng tay vuông góc hoặc cao hơn một chút, siết chặt cơ cánh tay rồi hạ chậm.",
    "mistakes": "Không xoay vặn cổ tay trong suốt động tác."
  },
  {
    "id": "ez_bar_preacher_curl",
    "name": "EZ-Bar Preacher Curl (Bàn Scott)",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_dai",
      "primaryHeadNameVi": "Đầu Ngắn Tay Trước & Bầu Dưới Chuột",
      "primaryHeadNameEn": "Biceps Short Head",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Kê nách sát mép đệm bàn Scott. Loại bỏ hoàn toàn quán tính của vai, chỉ có khớp khuỷu tay hoạt động.",
      "feelingLocation": "Đáy bắp tay trước giáp khuỷu tay",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/1.jpg"
    ],
    "videoQuery": "preacher curl form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-preacher-curl.mp4",
    "videoEmbedId": "fIWP-FRFNU0",
    "setup": "Kê cánh tay lên đệm bàn Scott, cầm tạ đòn EZ zic-zac.",
    "execution": "Cuốn tạ lên đỉnh siết 1 nhịp, hạ tạ kiểm soát không khóa đơ khớp.",
    "mistakes": "Không thả rơi tự do ở đáy tránh đứt gân tay trước."
  },
  {
    "id": "cable_bicep_curl",
    "name": "Standing Cable Bicep Curl",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_dai",
      "primaryHeadNameVi": "Cuốn Tay Trước Áp Lực Cáp Liên Tục",
      "primaryHeadNameEn": "Cable Biceps Peak",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Cáp duy trì lực căng ngay cả khi lên đỉnh hoặc xuống đáy. Gồng cứng con chuột tay trước.",
      "feelingLocation": "Bụng bắp tay trước",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Preacher_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Preacher_Curl/1.jpg"
    ],
    "videoQuery": "standing cable bicep curl",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-inner-curl.mp4",
    "videoEmbedId": "u9XtfyqeJd4",
    "setup": "Cáp gắn ở nấc thấp nhất, gắn thanh đòn thẳng hoặc lượn sóng.",
    "execution": "Đứng thẳng cuốn tạ lên ngang ngực, siết 1 nhịp rồi hạ chậm.",
    "mistakes": "Không đưa cùi chỏ về trước khi cuốn lên."
  },
  {
    "id": "tricep_rope_pushdown",
    "name": "Cable Tricep Rope Pushdown (Kéo dây thừng tay sau)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Đầu Ngoài Tay Sau - Tạo Khối Móng Ngựa (Lateral Head)",
      "primaryHeadNameEn": "Triceps Lateral & Medial Head",
      "secondaryHeads": [],
      "mindMuscleCue": "Kẹp chặt hai cùi chỏ vào hai bên mạn sườn. Đẩy dây thừng thẳng xuống đất và tẽ mạnh hai đầu dây sang hai bên hông ở điểm cuối để khóa khớp tay sau.",
      "feelingLocation": "Mặt ngoài của cánh tay sau (khối hình móng ngựa)",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 20,
      "noteVi": "Ròng rọc đôi 2:1 (Lực kéo = 50% cọc tạ)"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg"
    ],
    "videoQuery": "cable tricep rope pushdown form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pushdown-rope-attachment.mp4",
    "videoEmbedId": "vB5OHsJ3EME",
    "setup": "Chỉnh ròng rọc cáp lên nấc cao nhất, gắn phụ kiện dây thừng.",
    "execution": "Hơi nghiêng người về trước, giữ cùi chỏ cố định, duỗi thẳng tay xuống dưới và tách dây sang 2 bên đùi. Giữ 1 giây rồi đưa tạ lên góc 90 độ.",
    "mistakes": "Không để cùi chỏ trượt ra trước ra sau làm mất cô lập cơ tay sau, không nhún vai dùng trọng lượng cơ thể đè tạ."
  },
  {
    "id": "cable_straight_bar_pushdown",
    "name": "Cable Straight-Bar Tricep Pushdown",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Đầu Trong & Giữa Tay Sau Nặng",
      "primaryHeadNameEn": "Triceps Medial & Long Head",
      "secondaryHeads": [],
      "mindMuscleCue": "Thanh đòn thẳng cho phép đẩy mức tạ nặng hơn dây thừng. Đè mạnh thanh đòn xuống sát đùi.",
      "feelingLocation": "Toàn bộ bắp tay sau",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 25,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/1.jpg"
    ],
    "videoQuery": "straight bar tricep pushdown",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-triceps-pushdown.mp4",
    "videoEmbedId": "2-LAMcpzODU",
    "setup": "Cáp nấc cao nhất, gắn thanh đòn thẳng ngắn.",
    "execution": "Khóa cùi chỏ cạnh sườn, đẩy tạ thẳng xuống chạm đùi, thở ra.",
    "mistakes": "Không ngửa cổ tay quá đà gây đau cổ tay."
  },
  {
    "id": "overhead_cable_tricep_extension",
    "name": "Overhead Cable Tricep Extension",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Đầu Dài Tay Sau Kéo Dãn (Long Head)",
      "primaryHeadNameEn": "Triceps Long Head",
      "secondaryHeads": [],
      "mindMuscleCue": "Kéo cáp qua đầu. Vị trí giơ tay qua đầu kéo dãn đầu dài tay sau - phần chiếm 60% kích thước bắp tay sau!",
      "feelingLocation": "Thớ cơ tay sau sát nách và bả vai",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/1.jpg"
    ],
    "videoQuery": "cable overhead tricep extension",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-rope-high-pulley-overhead-triceps-extension.mp4",
    "videoEmbedId": "9Ark9S11uXw",
    "setup": "Cáp ngang ngực hoặc nấc cao, đứng quay lưng lại giàn cáp.",
    "execution": "Duỗi tay thẳng ra phía trước đầu, khóa tay sau ở đỉnh.",
    "mistakes": "Không xòe rộng cùi chỏ sang 2 bên."
  },
  {
    "id": "skull_crushers",
    "name": "Barbell Skull Crushers (Nằm duỗi tay sau)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Độ Dày Toàn Phần Tay Sau",
      "primaryHeadNameEn": "Triceps Long & Lateral Head",
      "secondaryHeads": [],
      "mindMuscleCue": "Nằm ngửa ghế phẳng, cầm đòn tạ EZ. Hạ tạ về phía trán hoặc đỉnh đầu rồi duỗi thẳng tay lên.",
      "feelingLocation": "Bắp tay sau căng đét",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Triceps_Extension/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Triceps_Extension/1.jpg"
    ],
    "videoQuery": "skull crushers proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/ez-barbell-lying-triceps-extension.mp4",
    "videoEmbedId": "d_KZxkY_0cM",
    "setup": "Nằm trên ghế phẳng, cầm đòn tạ EZ hẹp bằng vai.",
    "execution": "Chỉ gập cùi chỏ đưa đòn tạ về sát trán, duỗi thẳng tay lên trời.",
    "mistakes": "Không di chuyển cánh tay trên lung tung."
  },
  {
    "id": "close_grip_bench_press",
    "name": "Close-Grip Barbell Bench Press",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.25
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Đẩy Nặng Tăng Khối Lượng Tay Sau",
      "primaryHeadNameEn": "Triceps Compound Mass",
      "secondaryHeads": [
        "Ngực giữa"
      ],
      "mindMuscleCue": "Cầm tay hẹp bằng vai (khoảng 30cm). Kẹp khuỷu tay sát mạn sườn khi hạ đòn để dồn lực vào tay sau.",
      "feelingLocation": "Mặt sau cánh tay",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/1.jpg"
    ],
    "videoQuery": "close grip bench press form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-close-grip-bench-press.mp4",
    "videoEmbedId": "nEF0bv2FW94",
    "setup": "Nằm ngửa ghế phẳng, khoảng cách 2 tay nắm rộng bằng vai.",
    "execution": "Hạ tạ xuống chân ngực dưới, đẩy thẳng lên bằng lực tay sau.",
    "mistakes": "Không cầm quá hẹp (<20cm) gây đau khớp cổ tay."
  },
  {
    "id": "dumbbell_seated_tricep_extension",
    "name": "Seated Dumbbell Overhead Tricep Extension",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_dai",
      "primaryHeadNameVi": "Đầu Dài Tay Sau (Long Head) Tạ Đơn",
      "primaryHeadNameEn": "Triceps Long Head",
      "secondaryHeads": [],
      "mindMuscleCue": "Ngồi thẳng lưng, 2 tay đỡ 1 quả tạ đơn sau gáy. Hạ tạ sâu kéo dãn đầu dài tay sau rồi duỗi thẳng lên trời.",
      "feelingLocation": "Thớ cơ dài mặt sau cánh tay sát nách",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Inner_Biceps_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Inner_Biceps_Curl/1.jpg"
    ],
    "videoQuery": "seated dumbbell overhead tricep extension form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-triceps-extension.mp4",
    "setup": "Ngồi trên ghế thẳng lưng, dùng 2 tay đỡ lòng quả tạ đơn giơ thẳng qua đầu.",
    "execution": "Chỉ gập cùi chỏ hạ tạ ra sau đầu đến khi tay sau căng dãn tối đa. Đẩy tạ thẳng đứng lên trên thở ra.",
    "mistakes": "Không xòe cùi chỏ quá rộng sang hai bên làm giảm áp lực lên đầu dài.",
    "videoEmbedId": "b_r_LW4HEcM"
  },
  {
    "id": "dumbbell_tricep_kickback",
    "name": "Dumbbell Tricep Kickback (Đá tạ đơn tay sau)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Đầu Ngoài Khóa Khớp Tay Sau (Lateral Head)",
      "primaryHeadNameEn": "Triceps Lateral Peak",
      "secondaryHeads": [],
      "mindMuscleCue": "Cúi người song song sàn, khóa cùi chỏ sát sườn. Đá tạ ra phía sau và siết móng ngựa tay sau 1 giây ở điểm cao nhất.",
      "feelingLocation": "Mặt ngoài bắp tay sau",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Kickback/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Kickback/1.jpg"
    ],
    "videoQuery": "dumbbell tricep kickback form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-kickback.mp4",
    "setup": "Một tay tựa lên ghế hoặc đùi, thân người cúi gập song song với sàn.",
    "execution": "Cùi chỏ ép sát sườn ngang ngực, duỗi cẳng tay thẳng ra sau, siết chặt tay sau rồi hạ về góc 90 độ.",
    "mistakes": "Không đung đưa hạ cùi chỏ xuống đất làm mất lực cô lập.",
    "videoEmbedId": "WhBxKbe1-NU"
  },
  {
    "id": "barbell_squat",
    "name": "Barbell Back Squat",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.25
      },
      {
        "muscle": "lower_back",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đùi Trước & Toàn Bộ Thân Dưới (Quads & Core)",
      "primaryHeadNameEn": "Quadriceps Femoris & Core",
      "secondaryHeads": [
        "Mông lớn",
        "Lưng dưới",
        "Đùi sau"
      ],
      "mindMuscleCue": "Mở rộng đầu gối theo hướng mũi chân. Ngồi xổm sâu xuống như ngồi vào chiếc ghế thấp, gồng cứng bụng và đạp sàn bật lên.",
      "feelingLocation": "Bắp đùi trước và cơ mông",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/1.jpg"
    ],
    "videoQuery": "barbell back squat proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/classic-barbell-squat.mp4",
    "videoEmbedId": "ultWZbUMPL8",
    "setup": "Đặt đòn tạ lên cơ cầu vai (High Bar) hoặc dưới gai bả vai (Low Bar). Chân mở rộng bằng vai, mũi chân chĩa ra ngoài 15-30 độ.",
    "execution": "Hít sâu nén hơi vào bụng, đẩy hông về sau và gập gối hạ người xuống cho đến khi đùi song song hoặc sâu hơn mặt sàn. Đạp mạnh chân đứng thẳng dậy.",
    "mistakes": "Không để đầu gối bị sụp vào trong (valgus collapse), không nhón gót chân khỏi sàn khi xuống sâu."
  },
  {
    "id": "barbell_front_squat",
    "name": "Barbell Front Squat",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.15
      },
      {
        "muscle": "glutes",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đùi Trước Cô Lập & Lưng Thẳng Đứng",
      "primaryHeadNameEn": "Quadriceps Dominant Squat",
      "secondaryHeads": [
        "Cơ bụng lõi"
      ],
      "mindMuscleCue": "Thanh đòn đặt trước xương đòn, cùi chỏ nâng cao song song sàn. Thân người thẳng đứng tối đa dồn 80% áp lực vào đùi trước.",
      "feelingLocation": "Mặt trước đùi sát khớp gối",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat/1.jpg"
    ],
    "videoQuery": "front squat form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-front-chest-squat.mp4",
    "videoEmbedId": "v-mQm_droHg",
    "setup": "Đòn tạ gác trên vai trước, nâng cao khuỷu tay song song mặt đất.",
    "execution": "Hạ mông thẳng đứng, giữ cùi chỏ luôn cao, đạp sàn đứng dậy.",
    "mistakes": "Không để cùi chỏ bị chúc xuống làm rơi tạ."
  },
  {
    "id": "leg_press",
    "name": "Leg Press 45° (Máy đạp đùi)",
    "tier": 1,
    "equipment": "machine",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.25
      },
      {
        "muscle": "hamstrings",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Khối Cơ Đùi Trước Tải Nặng An Toàn Lưng",
      "primaryHeadNameEn": "Quadriceps Mass Builder",
      "secondaryHeads": [
        "Mông lớn"
      ],
      "mindMuscleCue": "Đặt chân giữa bàn đạp rộng bằng vai. Hạ mâm tạ sâu xuống góc 90 độ, đạp lên bằng toàn bộ bàn chân mà KHÔNG khóa khớp gối.",
      "feelingLocation": "Toàn bộ bắp đùi trước (4 đầu cơ đùi)",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg"
    ],
    "videoQuery": "how to leg press properly",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/close-feet-leg-press.mp4",
    "videoEmbedId": "IZxyjW7MPJQ",
    "setup": "Ngồi áp chặt lưng và mông vào đệm ghế. Đặt 2 bàn chân ở giữa bàn đạp.",
    "execution": "Mở chốt an toàn, hạ bàn đạp xuống chậm rãi đến khi đùi tạo góc 90 độ với cẳng chân. Đạp mạnh mâm tạ lên.",
    "mistakes": "TUYỆT ĐỐI KHÔNG khóa thẳng đơ khớp gối ở đỉnh (nguy cơ gãy ngược khớp gối), không để mông bị nhấc cuộn khỏi đệm."
  },
  {
    "id": "leg_extension",
    "name": "Leg Extension Machine (Máy đá đùi trước)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đầu Cơ Giọt Nước & Cô Lập Đùi Trước (Vastus Medialis)",
      "primaryHeadNameEn": "Vastus Medialis (Teardrop Muscle)",
      "secondaryHeads": [],
      "mindMuscleCue": "Đá cẳng chân thẳng lên trên, siết chặt cơ đùi trước trong 1 giây ở đỉnh động tác rồi hạ chậm rãi trong 3 giây.",
      "feelingLocation": "Cục cơ giọt nước ngay trên đầu gối trong",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/1.jpg"
    ],
    "videoQuery": "leg extension machine proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-leg-extension.mp4",
    "videoEmbedId": "YyvSfVjQeL0",
    "setup": "Chỉnh lưng ghế áp sát lưng, đệm tròn tỳ lên phần cổ chân (ngay trên mu bàn chân), khớp gối thẳng hàng với trục quay của máy.",
    "execution": "Đá chân lên cao đến khi chân duỗi thẳng, giữ 1 giây siết đùi trước, hạ xuống chậm có kiểm soát.",
    "mistakes": "Không dùng đà giật mạnh làm mâm tạ va đập, không chỉnh đệm tỳ quá cao lên cẳng chân."
  },
  {
    "id": "bulgarian_split_squat",
    "name": "Bulgarian Split Squat (Squat 1 chân tạ đơn)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.5
      },
      {
        "muscle": "glutes",
        "ratio": 0.4
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đùi Trước & Mông Đơn Lập (Khắc Phục Lệch Cơ)",
      "primaryHeadNameEn": "Unilateral Quads & Glute Max",
      "secondaryHeads": [
        "Mông lớn",
        "Đùi sau"
      ],
      "mindMuscleCue": "Kê mu bàn chân sau lên ghế phẳng. Hạ đầu gối sau chúc thẳng xuống sàn, giữ trọng tâm dồn 85% vào gót chân trước.",
      "feelingLocation": "Bắp đùi trước và mông bên chân đứng trước",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Squat/1.jpg"
    ],
    "videoQuery": "bulgarian split squat form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-single-leg-squat.mp4",
    "videoEmbedId": "2C-uNgKwPLE",
    "setup": "Đứng cách ghế 2 bước chân, đặt mu bàn chân sau lên ghế phẳng, 2 tay cầm 2 quả tạ đơn.",
    "execution": "Hạ người xuống cho đến khi đùi trước song song với sàn, đạp mạnh gót chân trước đứng dậy.",
    "mistakes": "Không để đầu gối chân trước trượt quá xa qua mũi chân gây đau gối."
  },
  {
    "id": "goblet_squat",
    "name": "Dumbbell Goblet Squat",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.25
      },
      {
        "muscle": "abs",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Squat Ôm Tạ Trước Ngực",
      "primaryHeadNameEn": "Quads & Core Stability",
      "secondaryHeads": [
        "Mông",
        "Cơ bụng"
      ],
      "mindMuscleCue": "Hai tay ôm quả tạ đơn trước ngực như nâng chiếc cốc (goblet). Giữ lưng thẳng tự nhiên và ngồi xổm giữa 2 chân.",
      "feelingLocation": "Đùi trước và cơ lõi",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/1.jpg"
    ],
    "videoQuery": "goblet squat form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-goblet-squat.mp4",
    "videoEmbedId": "lRYBbchqxtI",
    "setup": "Hai tay ôm 1 đầu tạ đơn sát ngực, chân rộng hơn vai, mũi chân chĩa 30 độ.",
    "execution": "Hạ mông sâu xuống giữa 2 gối, đạp gót chân đứng thẳng dậy.",
    "mistakes": "Không để tạ rời xa khỏi ngực làm mỏi tay thay vì đùi."
  },
  {
    "id": "romanian_deadlift",
    "name": "Barbell Romanian Deadlift (RDL)",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.55
      },
      {
        "muscle": "glutes",
        "ratio": 0.35
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lower_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_sau",
      "primaryHeadNameVi": "Kéo Căng Cơ Đùi Sau & Nở Mông (Hamstring Stretch)",
      "primaryHeadNameEn": "Biceps Femoris & Gluteus Maximus",
      "secondaryHeads": [
        "Mông lớn",
        "Lưng dưới"
      ],
      "mindMuscleCue": "Đầu gối chỉ hơi chùng cố định góc. Đẩy hông ra sau hết cỡ như dùng mông đóng cánh cửa sau lưng cho đến khi đùi sau căng cứng.",
      "feelingLocation": "Dải cơ gân khoeo mặt sau đùi",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg"
    ],
    "videoQuery": "romanian deadlift rdl form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-straight-leg-deadlift.mp4",
    "videoEmbedId": "JCXUYuzwNrM",
    "setup": "Cầm đòn tạ đứng thẳng, chân rộng bằng hông, khóa khớp vai về sau.",
    "execution": "Đẩy mông ra sau, lướt thanh đòn bám sát đùi xuống dưới gối một chút đến khi đùi sau căng cực đại. Siết mông đẩy hông về trước đứng thẳng dậy.",
    "mistakes": "Tuyệt đối không cong lưng dưới, không gập đầu gối quá sâu biến thành bài squat."
  },
  {
    "id": "dumbbell_rdl",
    "name": "Dumbbell Romanian Deadlift",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.55
      },
      {
        "muscle": "glutes",
        "ratio": 0.35
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lower_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_sau",
      "primaryHeadNameVi": "Đùi Sau & Mông Tạ Đơn",
      "primaryHeadNameEn": "Hamstrings & Glutes",
      "secondaryHeads": [
        "Mông",
        "Lưng dưới"
      ],
      "mindMuscleCue": "Cầm 2 tạ đơn trượt dọc mặt trước đùi xuống ống chân. Cảm nhận đùi sau căng như dây đàn.",
      "feelingLocation": "Mặt sau đùi",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Romanian_Deadlift/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Romanian_Deadlift/1.jpg"
    ],
    "videoQuery": "dumbbell rdl form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/single-dumbbell-stiff-leg-deadlift.mp4",
    "videoEmbedId": "hu3jRvTc_po",
    "setup": "Cầm 2 tạ đơn trước đùi, chân rộng bằng hông.",
    "execution": "Đẩy mông ra sau, hạ tạ qua gối rồi siết mông đứng dậy.",
    "mistakes": "Không để tạ văng xa khỏi chân."
  },
  {
    "id": "lying_leg_curl",
    "name": "Lying Leg Curl Machine (Nằm móc đùi sau)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "calves",
        "ratio": 0.05
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_sau",
      "primaryHeadNameVi": "Cô Lập Khối Cơ Gân Khoeo Đùi Sau",
      "primaryHeadNameEn": "Hamstrings Curl",
      "secondaryHeads": [],
      "mindMuscleCue": "Nằm sấp áp sát bụng vào đệm. Móc gót chân về phía mông, siết chặt đùi sau trong 1 giây ở đỉnh rồi nhả tạ chậm rãi.",
      "feelingLocation": "Mặt sau bắp đùi",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/1.jpg"
    ],
    "videoQuery": "lying leg curl machine form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-femoral.mp4",
    "videoEmbedId": "1Tq3QdYUuHs",
    "setup": "Nằm sấp, đệm tròn tỳ dưới bắp chân ngay trên gót chân, giữ chặt tay nắm máy.",
    "execution": "Gập gối móc tạ hết biên độ chạm mông, hạ chân chậm duỗi thẳng có kiểm soát.",
    "mistakes": "Không nhấc mông khỏi đệm khi móc nặng."
  },
  {
    "id": "seated_leg_curl",
    "name": "Seated Leg Curl Machine (Ngồi móc đùi sau)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "dui_sau",
      "primaryHeadNameVi": "Móc Đùi Sau Tư Thế Ngồi Căng Tối Đa",
      "primaryHeadNameEn": "Seated Hamstring Curls",
      "secondaryHeads": [],
      "mindMuscleCue": "Tư thế ngồi giúp đùi sau được kéo dãn ở khớp hông ngay từ đầu. Kéo gót chân xuống dưới gầm ghế.",
      "feelingLocation": "Bụng cơ đùi sau",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/1.jpg"
    ],
    "videoQuery": "seated leg curl machine form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-leg-curl.mp4",
    "videoEmbedId": "Orxowest56U",
    "setup": "Ngồi áp lưng vào ghế, khóa đệm đùi chặt xuống trên đầu gối.",
    "execution": "Gập chân xuống sâu dưới ghế, giữ 1 giây siết đùi sau, nhả chậm.",
    "mistakes": "Không để đệm đùi bị lỏng làm hổng chân."
  },
  {
    "id": "barbell_hip_thrust",
    "name": "Barbell Hip Thrust (Đẩy hông tập mông)",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Cơ Mông Lớn Cực Đại (Gluteus Maximus)",
      "primaryHeadNameEn": "Gluteus Maximus King",
      "secondaryHeads": [
        "Đùi sau"
      ],
      "mindMuscleCue": "Lưng trên tựa ghế phẳng, đòn tạ đặt ngang háng (dùng đệm mút). Đạp gót chân nâng hông lên ngang thân và siết chặt mông 2 giây.",
      "feelingLocation": "Khối cơ mông tròn đầy",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/1.jpg"
    ],
    "videoQuery": "how to barbell hip thrust properly form",
    "videoEmbedId": "SEdqd1n0cvg",
    "setup": "Tựa lưng dưới xương bả vai vào mép ghế tập, đòn tạ có bọc đệm mút đặt trên xương chậu, cẳng chân vuông góc sàn ở đỉnh.",
    "execution": "Đạp mạnh gót chân đẩy hông lên đến khi đùi và thân người tạo thành đường thẳng song song sàn, siết mông 2 giây ở đỉnh rồi hạ chậm.",
    "mistakes": "Không ưỡn cong lưng dưới ở đỉnh (chỉ dùng khớp hông để đẩy), không ngửa cổ nhìn trần nhà (mắt luôn nhìn thẳng về trước)."
  },
  {
    "id": "cable_glute_kickback",
    "name": "Cable Glute Kickback (Đá cáp sau mông)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Vun Cao Cơ Mông Trên & Mông Tròn",
      "primaryHeadNameEn": "Upper Glute Builder",
      "secondaryHeads": [],
      "mindMuscleCue": "Đeo đai cổ chân vào nấc cáp thấp nhất. Đá chân ra sau theo phương chếch 45 độ và siết cứng cơ mông.",
      "feelingLocation": "Phần cơ mông cao",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 10,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Kickback/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Kickback/1.jpg"
    ],
    "videoQuery": "cable glute kickback form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-standing-hip-extension.mp4",
    "videoEmbedId": "l4zReIOfPCQ",
    "setup": "Cáp nấc thấp nhất, gắn quai đeo cổ chân, tay vịn chắc vào cột máy.",
    "execution": "Đá chân thẳng ra sau, gồng siết mông 1 giây rồi thu chân về.",
    "mistakes": "Không võng lưng dưới khi đá chân ra sau."
  },
  {
    "id": "standing_calf_raise",
    "name": "Standing Calf Raise (Nhón bắp chân đứng)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "calves",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "bap_chan",
      "primaryHeadNameVi": "Cơ Bắp Chân Hai Bụng (Gastrocnemius)",
      "primaryHeadNameEn": "Gastrocnemius Muscle",
      "secondaryHeads": [],
      "mindMuscleCue": "Đứng thẳng đầu gối. Hạ gót chân xuống sâu nhất có thể để kéo dãn cơ bắp chuối, nhón gót lên cao hết cỡ trên đầu ngón chân.",
      "feelingLocation": "Khối cơ bắp chuối sau cẳng chân",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/1.jpg"
    ],
    "videoQuery": "standing calf raise form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/band-standing-calf-raise.mp4",
    "videoEmbedId": "-M4-G8p8fmc",
    "setup": "Đệm máy gác trên vai, nửa trước bàn chân đặt trên bục.",
    "execution": "Hạ gót chân xuống dưới mép bục 2 giây, nhón hết cỡ lên đỉnh giữ 1 giây.",
    "mistakes": "Không nhấp nhổm theo quán tính, phải dừng ở điểm dãn và điểm co."
  },
  {
    "id": "seated_calf_raise",
    "name": "Seated Calf Raise (Nhón bắp chân ngồi)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "calves",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "bap_chan",
      "primaryHeadNameVi": "Cơ Dép Bắp Chân Sâu (Soleus)",
      "primaryHeadNameEn": "Soleus Deep Calf Muscle",
      "secondaryHeads": [],
      "mindMuscleCue": "Gối gập 90 độ sẽ tắt cơ bụng chân và bắt cơ dép (soleus) gánh toàn bộ tải, tạo độ dày rộng cho bắp chân.",
      "feelingLocation": "Thớ cơ bắp chân chạy dọc xuống gân gót Achilles",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/1.jpg"
    ],
    "videoQuery": "seated calf raise machine form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-calf-raise.mp4",
    "videoEmbedId": "JbyjNymZOt0",
    "setup": "Ngồi vào máy, đệm tỳ trên đầu gối, chân đặt nửa bàn trên bục.",
    "execution": "Nhón gót chân lên cao tối đa, hạ sâu kéo dãn gân gót.",
    "mistakes": "Không bật nảy gót chân."
  },
  {
    "id": "cable_woodchopper",
    "name": "Cable Woodchopper (Kéo cáp chéo chém củi)",
    "tier": 4,
    "equipment": "cable",
    "movementPattern": "core",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_lien_suon",
      "primaryHeadNameVi": "Cơ Bụng Số 11 & Cơ Liên Sườn Xoay (Obliques)",
      "primaryHeadNameEn": "Internal & External Obliques",
      "secondaryHeads": [
        "Cơ thẳng bụng",
        "Vai"
      ],
      "mindMuscleCue": "Đứng vuông góc với giàn cáp. Giữ tay thẳng, dùng sức mạnh xoay thân người và cơ bụng bên hông để chém cáp chéo xuống hông đối diện.",
      "feelingLocation": "Dải cơ bụng chéo và eo bên hông",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 12.5,
      "noteVi": "Ròng rọc đôi 2:1 (Lực kéo = 50% cọc tạ)"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Cable_Wood_Chop/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Cable_Wood_Chop/1.jpg"
    ],
    "videoQuery": "cable woodchopper proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-lift.mp4",
    "videoEmbedId": "pAplQXk3dkU",
    "setup": "Chỉnh ròng rọc lên nấc ngang vai hoặc cao hơn đầu, gắn tay cầm đơn (D-handle). Đứng chân rộng bằng vai.",
    "execution": "Kéo cáp chéo qua thân người xuống phía hông đối diện, siết chặt cơ bụng bên hông trong 1 giây rồi xoay người trở lại vị trí ban đầu có kiểm soát.",
    "mistakes": "Không dùng cánh tay để kéo cáp mà phải xoay bằng toàn bộ thân người và cơ liên sườn."
  },
  {
    "id": "cable_crunch",
    "name": "Kneeling Cable Crunch (Quỳ kéo cáp gập bụng)",
    "tier": 4,
    "equipment": "cable",
    "movementPattern": "core",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "co_bung",
      "primaryHeadNameVi": "Cơ Bụng 6 Múi Tải Nặng (Rectus Abdominis)",
      "primaryHeadNameEn": "Upper Rectus Abdominis",
      "secondaryHeads": [],
      "mindMuscleCue": "Quỳ gối giữ hông cố định. Cuộn cột sống cong lưng tôm, đưa cùi chỏ chạm vào đầu gối và siết nghẹt cơ bụng.",
      "feelingLocation": "Toàn bộ múi bụng trên và giữa",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 25,
      "noteVi": "Ròng rọc đôi 2:1"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Cable_Crunch/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Cable_Crunch/1.jpg"
    ],
    "videoQuery": "cable crunch kneeling form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-kneeling-crunch.mp4",
    "videoEmbedId": "dkGwcfo9zto",
    "setup": "Quỳ gối trước giàn cáp cao, 2 tay giữ 2 đầu dây thừng bên tai.",
    "execution": "Gập người cuộn tròn cột sống xuống sàn, thở hết hơi siết cơ bụng.",
    "mistakes": "CẤM gập hông biến thành ngồi xổm, hông phải giữ nguyên góc 90 độ."
  },
  {
    "id": "hanging_leg_raise",
    "name": "Hanging Leg Raise (Treo xà nhấc chân)",
    "tier": 4,
    "equipment": "bodyweight",
    "movementPattern": "core",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_bung",
      "primaryHeadNameVi": "Cơ Bụng Dưới Cắt Nét (Lower Abs)",
      "primaryHeadNameEn": "Lower Rectus Abdominis",
      "secondaryHeads": [
        "Cẳng tay",
        "Cơ gập hông"
      ],
      "mindMuscleCue": "Treo người trên xà đơn. Cuộn xương chậu lên về phía ngực chứ không chỉ nhấc chân đơn thuần.",
      "feelingLocation": "Múi bụng dưới rốn",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/1.jpg"
    ],
    "videoQuery": "hanging leg raise form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/hanging-straight-leg-raise.mp4",
    "videoEmbedId": "hdng3Nm1x_E",
    "setup": "Treo 2 tay trên xà đơn, người thẳng tự nhiên.",
    "execution": "Nhấc 2 chân hoặc co gối cuộn xương chậu lên chạm ngực, hạ chậm.",
    "mistakes": "Không đung đưa người lấy đà quán tính."
  },
  {
    "id": "plank",
    "name": "Standard Plank (Giữ tư thế tấm ván)",
    "tier": 4,
    "equipment": "bodyweight",
    "movementPattern": "core",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_bung",
      "primaryHeadNameVi": "Cơ Bụng Lõi & Đai Lưng Sâu (Transverse Abdominis)",
      "primaryHeadNameEn": "Core Stability & TVA",
      "secondaryHeads": [
        "Vai",
        "Lưng dưới"
      ],
      "mindMuscleCue": "Cùi chỏ chống vuông góc sàn. Rút rốn vào sát cột sống, siết cứng mông và đùi như tấm ván thép.",
      "feelingLocation": "Toàn bộ thành bụng sâu bên trong",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/1.jpg"
    ],
    "videoQuery": "how to plank properly form",
    "videoEmbedId": "pSHjTRCQxIw",
    "setup": "Nằm sấp chống 2 cùi chỏ dưới vai, chân duỗi thẳng kiễng mũi chân.",
    "execution": "Nâng người thành đường thẳng từ gót chân đến đầu, hít thở đều đặn.",
    "mistakes": "Không võng lưng dưới, không nhô mông lên cao."
  },
  {
    "id": "cardio_bike",
    "name": "Đạp Xe Thể Lực (Stationary Bike)",
    "tier": 4,
    "equipment": "machine",
    "movementPattern": "cardio",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.5
      },
      {
        "muscle": "calves",
        "ratio": 0.5
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Tim Mạch Bền Bỉ & Đốt Mỡ Zone 2",
      "primaryHeadNameEn": "Cardiovascular Endurance",
      "secondaryHeads": [
        "Bắp chân"
      ],
      "mindMuscleCue": "Giữ nhịp đạp đều đặn 70-85 RPM, nhịp tim ở vùng Zone 2 để oxy hóa chất béo tối ưu.",
      "feelingLocation": "Tim mạch và bắp đùi",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/1.jpg"
    ],
    "videoQuery": "stationary bike workout form setup",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
    "videoEmbedId": "csNeUKYBW0E",
    "setup": "Chỉnh yên xe ngang tầm xương hông khi đứng cạnh xe, chân duỗi gần hết ở đáy bàn đạp.",
    "execution": "Đạp xe duy trì nhịp thở sâu, lưng thẳng, không gù vai.",
    "mistakes": "Không chỉnh yên quá thấp gây đau khớp gối."
  },
  {
    "id": "cardio_treadmill",
    "name": "Đi Bộ Dốc Trên Máy (Incline Treadmill Walk)",
    "tier": 4,
    "equipment": "machine",
    "movementPattern": "cardio",
    "primaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.5
      },
      {
        "muscle": "calves",
        "ratio": 0.5
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Đốt Calo & Săn Chắc Mông Bắp Chân",
      "primaryHeadNameEn": "Incline Walking Fat Burn",
      "secondaryHeads": [
        "Bắp chân"
      ],
      "mindMuscleCue": "Cài độ dốc máy từ 8-12%, tốc độ 4.5-5.5 km/h. Đánh tay tự nhiên, không bám chặt vào tay vịn.",
      "feelingLocation": "Cơ mông và tim phổi",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/1.jpg"
    ],
    "videoQuery": "incline treadmill walking form fat burn",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/running.mp4",
    "videoEmbedId": "HwXYMPGjlUg",
    "setup": "Bật máy đi bộ, chỉnh độ dốc 8-12% và tốc độ vừa phải.",
    "execution": "Bước dài sải chân, đạp mạnh gót chân đẩy người lên dốc.",
    "mistakes": "Tuyệt đối không bám chặt 2 tay vịn ngửa người ra sau (triệt tiêu tác dụng của độ dốc)."
  },
  {
    "id": "cardio_elliptical",
    "name": "Máy Trượt Tuyết (Elliptical Trainer)",
    "tier": 4,
    "equipment": "machine",
    "movementPattern": "cardio",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.5
      },
      {
        "muscle": "glutes",
        "ratio": 0.5
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đốt Mỡ Toàn Thân Không Chấn Thương Khớp",
      "primaryHeadNameEn": "Low Impact Full Body Cardio",
      "secondaryHeads": [
        "Mông",
        "Vai"
      ],
      "mindMuscleCue": "Chuyển động hình elip triệt tiêu 100% phản lực lên khớp gối và cột sống. Vừa đạp chân vừa đẩy kéo tay cầm.",
      "feelingLocation": "Toàn thân và tim phổi",
      "bodyView": "both"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/1.jpg"
    ],
    "videoQuery": "how to use elliptical trainer machine form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/elliptical.mp4",
    "videoEmbedId": "EesEvYohy5o",
    "setup": "Đứng vững 2 chân lên bàn đạp, 2 tay nắm tay cầm di động.",
    "execution": "Đạp chân theo quỹ đạo tròn mượt mà kết hợp tay đẩy kéo nhịp nhàng.",
    "mistakes": "Không kiễng gót chân rời khỏi bàn đạp quá nhiều."
  },
  {
    "id": "dumbbell_incline_fly",
    "name": "Dumbbell Incline Fly (Bay ngực trên tạ đơn)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.8
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Ngực Trên (Clavicular Head)",
      "primaryHeadNameEn": "Upper Pectoralis",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Hạ tạ mở rộng sang hai bên với cùi chỏ hơi cong cố định, cảm nhận lồng ngực trên kéo giãn cực đại rồi ép lại như đang ôm gốc cây.",
      "feelingLocation": "Vùng cơ ngực trên giáp xương quai xanh",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes/1.jpg"
    ],
    "videoEmbedId": "bDaIL_zKbGs",
    "videoQuery": "how to incline dumbbell fly form",
    "setup": "Chỉnh ghế nghiêng 30 độ. Đặt 2 quả tạ trên đùi, ngả lưng dùng đùi đưa tạ lên ngực trên, hai tay duỗi thẳng hơi trùng khuỷu.",
    "execution": "Hít sâu mở rộng hai cánh tay theo hình cánh cung sang hai bên đến khi ngực trên căng hết cỡ. Thở ra và chủ động siết hai ngực ép tạ về vị trí ban đầu.",
    "mistakes": "Không duỗi thẳng cánh tay hoàn toàn làm đau khớp khuỷu, không để tạ rơi quá sâu gây căng rách bao khớp vai."
  },
  {
    "id": "cable_low_to_high_fly",
    "name": "Cable Low-to-High Fly (Kéo cáp dưới lên ngực trên)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Ngực Trên (Clavicular Head)",
      "primaryHeadNameEn": "Upper Pectoralis",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Kéo tay cầm từ dưới hông hướng chéo lên ngang cằm, xoay nhẹ cổ tay hướng lòng bàn tay lên trên để siết trọn rãnh ngực trên.",
      "feelingLocation": "Phần rãnh ngực trên và đầu trong xương quai xanh",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 10,
      "noteVi": "Cáp hạ sát sàn, bước một chân lên trước tạo điểm tựa vững chắc."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/1.jpg"
    ],
    "videoEmbedId": "u5X5x1fw_SA",
    "videoQuery": "cable low to high fly form upper chest",
    "setup": "Hạ 2 ròng rọc cáp xuống vị trí thấp nhất. Cầm hai tay cầm đơn, bước một chân tới trước, thân người hơi đổ về trước 10-15 độ.",
    "execution": "Gồng chặt cơ bụng, kéo hai tay theo hình vòng cung từ dưới lên ngang ngực trên/cằm. Dừng lại 1 giây siết chặt cơ ngực rồi hạ về có kiểm soát.",
    "mistakes": "Không dùng lực quán tính đung đưa người, không nhún vai kéo tải bằng cơ cầu vai."
  },
  {
    "id": "weighted_chest_dip",
    "name": "Weighted Chest Dip (Chống xà kép đeo tạ xích)",
    "tier": 1,
    "equipment": "bodyweight",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_duoi",
      "primaryHeadNameVi": "Chân Ngực & Ngực Dưới",
      "primaryHeadNameEn": "Lower Pectoralis",
      "secondaryHeads": [
        "Tay sau",
        "Vai trước"
      ],
      "mindMuscleCue": "Đổ thân người nghiêng về trước 30 độ, cùi chỏ hơi xòe ra ngoài, cảm nhận viền chân ngực dưới chịu toàn bộ tải trọng tạ.",
      "feelingLocation": "Vùng cơ chân ngực dưới và viền ngực ngoài",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/1.jpg"
    ],
    "videoEmbedId": "2z8JmcrW-As",
    "videoQuery": "weighted chest dips form guide",
    "setup": "Đeo đai tạ xích hoặc kẹp tạ đơn giữa hai đùi. Bật lên thanh xà kép, hơi cong gối chéo chân và nghiêng thân người về phía trước.",
    "execution": "Hạ thân người xuống chậm rãi cho tới khi cánh tay tạo góc 90 độ với cẳng tay. Nhấn mạnh lòng bàn tay đẩy người lên và thở ra dứt khoát.",
    "mistakes": "Không giữ thân người thẳng đứng (sẽ ăn hết vào tay sau), không hạ quá sâu dưới 90 độ nếu khớp vai chưa đủ linh hoạt."
  },
  {
    "id": "machine_incline_chest_press",
    "name": "Machine Incline Press (Máy đẩy ngực trên)",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.2
      },
      {
        "muscle": "triceps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_tren",
      "primaryHeadNameVi": "Ngực Trên (Clavicular Head)",
      "primaryHeadNameEn": "Upper Pectoralis Major",
      "secondaryHeads": [
        "Vai trước",
        "Tay sau"
      ],
      "mindMuscleCue": "Áp chặt lưng vào tựa ghế, tập trung phát lực đẩy hai tay cầm hướng chéo lên và ép hai bắp tay vào nhau.",
      "feelingLocation": "Thớ cơ ngực trên sát cổ",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Incline_Chest_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Incline_Chest_Press/1.jpg"
    ],
    "videoEmbedId": "VesHgJR14E8",
    "videoQuery": "machine incline chest press form",
    "setup": "Chỉnh chiều cao ghế sao cho hai tay cầm ngang tầm xương quai xanh hoặc phần trên ngực. Bàn chân bám chắc sàn.",
    "execution": "Hít sâu gồng bụng, đẩy mạnh tay cầm theo quỹ đạo máy lên phía trên, không khóa chết khớp khuỷu. Hạ từ từ 2-3 giây để kéo giãn cơ ngực.",
    "mistakes": "Không nhấc mông hoặc đẩy vai nhô ra phía trước làm mất điểm tựa bả vai."
  },
  {
    "id": "smith_machine_bench_press",
    "name": "Smith Machine Flat Bench Press (Đẩy ngực phẳng máy Smith)",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.15
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Ngực Giữa & Toàn Phần",
      "primaryHeadNameEn": "Mid Pectoralis",
      "secondaryHeads": [
        "Tay sau",
        "Vai trước"
      ],
      "mindMuscleCue": "Quỹ đạo cố định giúp tập trung 100% tinh thần vào việc ép vắt cơ ngực mà không lo rung lắc thanh đòn.",
      "feelingLocation": "Toàn bộ khoang ngực giữa",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Bench_Press/1.jpg"
    ],
    "videoEmbedId": "gQ3afio08V8",
    "videoQuery": "smith machine bench press proper form",
    "setup": "Kê ghế phẳng ngay dưới ray trượt thanh đòn máy Smith sao cho đòn tạ thẳng hàng với núm ngực giữa.",
    "execution": "Xoay cổ tay mở khóa đòn tạ, hạ tạ kiểm soát xuống chạm nhẹ ngực giữa, sau đó đẩy dứt khoát lên trên.",
    "mistakes": "Không đặt ghế lệch tâm ray trượt, luôn cài chốt an toàn ở độ cao hợp lý."
  },
  {
    "id": "cable_middle_fly",
    "name": "Cable Middle Fly (Ép ngực cáp ngang)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_giua",
      "primaryHeadNameVi": "Ngực Giữa & Rãnh Ngực",
      "primaryHeadNameEn": "Mid Pectoralis & Sternal Cleft",
      "secondaryHeads": [
        "Vai trước"
      ],
      "mindMuscleCue": "Kéo ngang hai tay và siết chặt hai lòng bàn tay về trước ngực, tưởng tượng ép một quả cam nát giữa khe ngực.",
      "feelingLocation": "Rãnh giữa ngực và cơ ngực trong",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 12.5,
      "noteVi": "Chỉnh ròng rọc ngang ngực, bước 1 chân làm trụ."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/1.jpg"
    ],
    "videoEmbedId": "taI4XduLpTk",
    "videoQuery": "cable crossover middle chest fly form",
    "setup": "Chỉnh ròng rọc cáp ngang tầm ngực. Cầm hai tay cầm, đứng giữa khung cáp, bước một chân lên trước.",
    "execution": "Ép hai tay cầm về phía trước ngực với khuỷu tay hơi cong cố định, chạm nhẹ hai nắm tay vào nhau, giữ 1 giây siết ngực rồi mở ra từ từ.",
    "mistakes": "Không để vai giật ngược ra sau đột ngột khi mở tay."
  },
  {
    "id": "decline_barbell_bench_press",
    "name": "Decline Barbell Bench Press (Đẩy ngực dốc xuống tạ đòn)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_duoi",
      "primaryHeadNameVi": "Chân Ngực Dưới (Abdominal Head)",
      "primaryHeadNameEn": "Lower Pectoralis",
      "secondaryHeads": [
        "Tay sau"
      ],
      "mindMuscleCue": "Hạ thanh đòn về phía chân ngực dưới, phát lực đẩy thẳng lên vuông góc với trần nhà.",
      "feelingLocation": "Viền cơ chân ngực dưới sắc nét",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/1.jpg"
    ],
    "videoEmbedId": "LfyQBUKR8SE",
    "videoQuery": "decline barbell bench press proper form",
    "setup": "Móc chân cố định vào đệm giữ của ghế dốc xuống (khoảng 15-30 độ). Nằm ngửa nắm thanh đòn rộng hơn vai.",
    "execution": "Tháo đòn tạ, hít sâu hạ tạ chạm nhẹ phần chân ngực dưới, sau đó đẩy dứt khoát lên và thở ra.",
    "mistakes": "Không hạ tạ quá cao lên cổ, luôn khóa chân chắc chắn vào đệm để tránh trượt người."
  },
  {
    "id": "dumbbell_pullover",
    "name": "Dumbbell Pullover (Vớt tạ đơn dày ngực & xô)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.4
      }
    ],
    "muscleTarget": {
      "primaryHead": "nguc_duoi",
      "primaryHeadNameVi": "Ngực Dưới & Cơ Răng Cưa (Serratus)",
      "primaryHeadNameEn": "Lower Pectoralis & Serratus Anterior",
      "secondaryHeads": [
        "Lưng xô (Lats)"
      ],
      "mindMuscleCue": "Hạ tạ qua đầu thật sâu để lồng ngực mở căng hết cỡ, dùng ngực và cơ răng cưa kéo tạ trở lại trên đỉnh ngực.",
      "feelingLocation": "Hai bên sườn và phần dưới xương ức",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Dumbbell_Pullover/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Dumbbell_Pullover/1.jpg"
    ],
    "videoEmbedId": "ZhPOEQJRzBU",
    "videoQuery": "how to dumbbell pullover form for chest and lats",
    "setup": "Nằm ngang người trên ghế phẳng (chỉ tựa phần lưng trên lên ghế), hai bàn chân bám sàn, hạ hông nhẹ. Hai tay đỡ quả tạ đơn bằng lòng bàn tay đan nhau hình kim cương.",
    "execution": "Hạ tạ từ từ qua đỉnh đầu ra sau theo hình vòng cung, hít sâu căng tràn lồng ngực. Kéo tạ ngược lên lại vị trí trên ngực và thở ra.",
    "mistakes": "Không gập khuỷu tay quá nhiều biến thành bài tay sau, giữ hông ổn định không đẩy mông quá cao."
  },
  {
    "id": "neutral_grip_lat_pulldown",
    "name": "Neutral-Grip Lat Pulldown (Kéo xô tay cầm song song / V-Bar)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Lưng Xô Toàn Phần (Latissimus Dorsi)",
      "primaryHeadNameEn": "Latissimus Dorsi",
      "secondaryHeads": [
        "Tay trước",
        "Lưng giữa"
      ],
      "mindMuscleCue": "Tay cầm song song giúp khuỷu tay khép sát sườn tự nhiên, kéo sâu xuống chạm xương ức để co rút xô tối đa.",
      "feelingLocation": "Dọc hai mép lưng xô xuống tận thắt lưng",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 40,
      "noteVi": "Gắn tay cầm V-Bar hoặc Mag Grip song song."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/1.jpg"
    ],
    "videoEmbedId": "7FeEgk0bv9s",
    "videoQuery": "neutral grip lat pulldown form v bar",
    "setup": "Gắn tay cầm song song lên máy Lat Pulldown. Chỉnh đệm đùi ép chặt đùi giữ người cố định.",
    "execution": "Ưỡn nhẹ lồng ngực, kéo tay cầm xuống chạm nhẹ ức trên bằng cách dìm hai cùi chỏ xuống sườn. Giữ 1 giây rồi nhả từ từ lên trên.",
    "mistakes": "Không ngả người ra sau quá 20 độ, không dùng đà giật tạ."
  },
  {
    "id": "single_arm_lat_pulldown",
    "name": "Single-Arm Lat Pulldown (Kéo xô cáp 1 tay cô lập)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Thân Xô Dưới (Iliac Lat Fibers)",
      "primaryHeadNameEn": "Lower Latissimus Dorsi",
      "secondaryHeads": [
        "Tay trước"
      ],
      "mindMuscleCue": "Tập từng bên cho phép nghiêng người nhẹ theo thớ cơ, kéo khuỷu tay cắm thẳng vào hông cùng bên để siết xô dưới.",
      "feelingLocation": "Cơ xô một bên sát bờ hông",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 20,
      "noteVi": "Gắn tay cầm D-handle đơn, quỳ hoặc ngồi ghế."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Lat_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Lat_Pulldown/1.jpg"
    ],
    "videoEmbedId": "8zA8DjHRaq0",
    "videoQuery": "single arm lat pulldown proper form",
    "setup": "Quỳ gối hoặc ngồi nghiêng nhẹ dưới ròng rọc cáp cao. Tay nắm quai cầm đơn duỗi thẳng lên trên kéo giãn cơ xô.",
    "execution": "Kéo cùi chỏ thẳng xuống hướng về phía túi quần cùng bên, đồng thời hơi nghiêng nhẹ người để co ngắn thớ xô dưới. Nhả tạ chậm rãi.",
    "mistakes": "Không xoay vặn thân người quá đà làm mất lực cô lập xô."
  },
  {
    "id": "cable_seated_high_row",
    "name": "Cable Seated High Row (Kéo cáp ngồi góc cao lưng trên)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.2
      },
      {
        "muscle": "biceps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_tren",
      "primaryHeadNameVi": "Lưng Trên & Cơ Trám (Rhomboids)",
      "primaryHeadNameEn": "Upper Back, Rhomboids & Mid Traps",
      "secondaryHeads": [
        "Lưng xô",
        "Vai sau"
      ],
      "mindMuscleCue": "Kéo từ góc cao chéo xuống ngực trên, mở rộng hai cùi chỏ ra hai bên và ép hai xương bả vai chạm vào nhau.",
      "feelingLocation": "Giữa hai xương bả vai và phần lưng trên",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 35,
      "noteVi": "Gắn tay cầm rộng hoặc hai tay cầm đơn từ ròng rọc cao."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg"
    ],
    "videoEmbedId": "GZbfZ033f74",
    "videoQuery": "seated cable high row upper back form",
    "setup": "Ngồi vào máy kéo cáp, ròng rọc chỉnh cao hơn tầm ngực. Đặt chân lên bàn đạp, thẳng lưng ưỡn ngực.",
    "execution": "Kéo tay cầm về phía xương ức trên, mở khuỷu tay 45-60 độ và siết chặt lưng trên trong 1 giây trước khi trả tạ.",
    "mistakes": "Không gù lưng hoặc ngả người ra sau lấy đà."
  },
  {
    "id": "incline_dumbbell_row",
    "name": "Chest-Supported Incline Dumbbell Row (Kéo tạ đơn tì ngực ghế dốc)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.25
      },
      {
        "muscle": "biceps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_tren",
      "primaryHeadNameVi": "Lưng Trên (Bảo Vệ Cột Sống 100%)",
      "primaryHeadNameEn": "Upper Back & Mid Traps (Spine-Safe)",
      "secondaryHeads": [
        "Lưng xô",
        "Tay trước"
      ],
      "mindMuscleCue": "Ngực tì chắc lên ghế giúp triệt tiêu hoàn toàn áp lực lên đĩa đệm cột sống, thoải mái kéo tạ nặng siết lưng.",
      "feelingLocation": "Lưng trên và bờ trong bả vai",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row/1.jpg"
    ],
    "videoEmbedId": "2ByilQ4NaAs",
    "videoQuery": "chest supported incline dumbbell row form",
    "setup": "Chỉnh ghế dốc 30-45 độ. Nằm úp ngực tì vào tựa ghế, hai tay buông thõng cầm 2 quả tạ đơn.",
    "execution": "Hít sâu, kéo hai cùi chỏ lên cao về phía sau hông, ép chặt hai bả vai vào nhau ở đỉnh. Hạ tạ từ từ kéo giãn lưng.",
    "mistakes": "Không nhấc ngực rời khỏi ghế khi kéo nặng."
  },
  {
    "id": "dumbbell_shrug",
    "name": "Dumbbell Shrug (Nhún cầu vai tạ đơn)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "cau_vai",
      "primaryHeadNameVi": "Cầu Vai Trên (Upper Trapezius)",
      "primaryHeadNameEn": "Upper Trapezius",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Nhún hai vai thẳng đứng hướng về phía hai tai, siết chặt cơ cầu vai ở đỉnh trong 1-2 giây.",
      "feelingLocation": "Hai khối cơ cầu vai dày sát chân cổ",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shrug/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shrug/1.jpg"
    ],
    "videoEmbedId": "rFsSeClGnNA",
    "videoQuery": "how to dumbbell shrug form traps",
    "setup": "Đứng thẳng người, chân rộng bằng vai, hai tay cầm hai quả tạ đơn nặng để sát hai bên đùi.",
    "execution": "Nhấc hai bả vai thẳng đứng lên cao nhất có thể, giữ 1 giây rồi hạ tạ xuống kéo dãn cơ cầu vai hoàn toàn.",
    "mistakes": "Tuyệt đối không xoay tròn khớp vai (gây mòn và chấn thương khớp cùng đòn vai)."
  },
  {
    "id": "landmine_row",
    "name": "Landmine Row (Kéo tạ cối Landmine lưng giữa)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.3
      },
      {
        "muscle": "biceps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Lưng Xô & Lưng Giữa Dày Dặn",
      "primaryHeadNameEn": "Middle Lats & Rhomboids",
      "secondaryHeads": [
        "Lưng trên",
        "Cẳng tay"
      ],
      "mindMuscleCue": "Đứng dạng chân qua thanh đòn, gập hông giữ lưng thẳng, kéo đòn tạ chạm nhẹ ngực dưới để kích hoạt độ dày cơ lưng.",
      "feelingLocation": "Chính giữa lưng và xô",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row_with_Handle/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row_with_Handle/1.jpg"
    ],
    "videoEmbedId": "j3Igk5nyZE4",
    "videoQuery": "landmine row form t bar row",
    "setup": "Gắn một đầu đòn tạ vào khớp Landmine (hoặc góc tường). Luồn tay cầm V-Bar dưới thanh đòn sát bánh tạ.",
    "execution": "Gập hông 45 độ, lưng thẳng tự nhiên. Kéo mạnh tay cầm về bụng dưới, ép chặt bả vai rồi hạ tạ có kiểm soát.",
    "mistakes": "Không cong gập lưng dưới, không giật thân người đứng thẳng dậy khi kéo."
  },
  {
    "id": "rope_straight_arm_pulldown",
    "name": "Rope Straight-Arm Pulldown (Kéo dây thừng thẳng tay ép xô)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_xo",
      "primaryHeadNameVi": "Đuôi Cơ Xô Dưới (Lat Width)",
      "primaryHeadNameEn": "Lower Lat Extension",
      "secondaryHeads": [
        "Cơ tam đầu dài"
      ],
      "mindMuscleCue": "Dùng dây thừng cho phép kéo tách rộng ra sau hai bên hông ở cuối chuyển động, ép sát bờ xô mà thanh đòn thẳng không làm được.",
      "feelingLocation": "Dọc hai dải cơ xô sát sườn",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 20,
      "noteVi": "Dây thừng kéo cáp cao, lùi 1 bước gập người 30 độ."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Straight-Arm_Pulldown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Straight-Arm_Pulldown/1.jpg"
    ],
    "videoEmbedId": "hAMcfubonDc",
    "videoQuery": "rope straight arm pulldown lats form",
    "setup": "Lắp dây thừng vào ròng rọc cáp cao. Lùi ra 1 bước, hơi gập hông 30 độ, hai cánh tay duỗi thẳng giữ khuỷu tay hơi chùng.",
    "execution": "Dùng cơ xô kéo dây thừng từ trên cao xuống đùi, khi chạm đùi tách rộng hai đầu dây thừng ra sau hông để siết xô tối đa.",
    "mistakes": "Không gập khuỷu tay biến thành bài tay sau, giữ cổ tay cố định."
  },
  {
    "id": "wide_grip_seated_row",
    "name": "Wide-Grip Seated Cable Row (Kéo cáp ngồi tay rộng lưng trên)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.15
      },
      {
        "muscle": "biceps",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_tren",
      "primaryHeadNameVi": "Lưng Trên & Cơ Tròn Lớn Nhỏ (Teres Major/Minor)",
      "primaryHeadNameEn": "Upper Back & Teres Major",
      "secondaryHeads": [
        "Cầu vai giữa",
        "Tay trước"
      ],
      "mindMuscleCue": "Cầm tay rộng giúp cô lập lưng trên và cơ trám, kéo thanh đòn về ngang bụng trên với hai cùi chỏ mở ngang.",
      "feelingLocation": "Vùng lưng trên ngay dưới cổ",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "1:1",
      "defaultStackKg": 35,
      "noteVi": "Dùng thanh đòn tay rộng cầm sấp bàn tay."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg"
    ],
    "videoEmbedId": "GZbfZ033f74",
    "videoQuery": "wide grip seated cable row form",
    "setup": "Ngồi vào máy Seated Row, lắp thanh đòn dài, cầm hai tay rộng hơn vai với lòng bàn tay úp xuống.",
    "execution": "Kéo thanh đòn về phía chấn thủy (bụng trên), bẻ cùi chỏ ra hai bên và siết hai bả vai thật chặt trong 1 giây.",
    "mistakes": "Không ngả người ra sau quá mức, giữ lưng thẳng và ngực mở."
  },
  {
    "id": "dumbbell_front_raise",
    "name": "Dumbbell Front Raise (Nâng tạ đơn trước vai)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_truoc",
      "primaryHeadNameVi": "Vai Trước (Anterior Deltoid)",
      "primaryHeadNameEn": "Anterior Deltoid",
      "secondaryHeads": [
        "Ngực trên"
      ],
      "mindMuscleCue": "Nâng tạ thẳng về phía trước lên ngang tầm mắt, kiểm soát không vung vẩy thân người.",
      "feelingLocation": "Khối cơ tròn phía trước vai",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/1.jpg"
    ],
    "videoEmbedId": "-t7fuZ0KhDA",
    "videoQuery": "how to dumbbell front raise properly form",
    "setup": "Đứng thẳng người, chân mở rộng bằng vai, hai tay cầm hai quả tạ đơn đặt phía trước đùi.",
    "execution": "Nâng tạ thẳng lên phía trước mặt cho đến khi cánh tay song song với sàn, giữ 1 giây rồi hạ từ từ xuống.",
    "mistakes": "Không nâng tạ quá cao qua đỉnh đầu làm mất áp lực cơ vai trước."
  },
  {
    "id": "cable_face_pull_high",
    "name": "High Cable Face Pull (Kéo cáp cao ngang trán mặt vai sau)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.2
      },
      {
        "muscle": "upper_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_sau",
      "primaryHeadNameVi": "Vai Sau & Cơ Xoay Khớp Vai (Rotator Cuff)",
      "primaryHeadNameEn": "Posterior Deltoid & External Rotators",
      "secondaryHeads": [
        "Cầu vai",
        "Lưng trên"
      ],
      "mindMuscleCue": "Kéo hai đầu dây thừng về hai bên thái dương, đồng thời xoay ngoài cổ tay để ngón cái chỉ về phía sau.",
      "feelingLocation": "Phía sau bả vai và chóp vai sau",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Chỉnh ròng rọc ngang tầm mắt hoặc cao hơn trán."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear-Delt_Fly/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear-Delt_Fly/1.jpg"
    ],
    "videoEmbedId": "rep-qVOkqgk",
    "videoQuery": "cable face pull form rear delt rotator cuff",
    "setup": "Gắn dây thừng vào ròng rọc ngang mắt hoặc trán. Cầm dây thừng với ngón cái hướng về phía sau người.",
    "execution": "Lùi lại 1 bước, kéo dây thừng về ngang mặt, tách hai đầu dây thừng ra hai bên thái dương và xoay cùi chỏ ra sau.",
    "mistakes": "Không kéo dây thừng xuống cổ hay ngực (sẽ biến thành bài lưng xô)."
  },
  {
    "id": "machine_shoulder_press",
    "name": "Machine Shoulder Press (Máy đẩy vai ngồi)",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_truoc",
      "primaryHeadNameVi": "Vai Trước & Vai Giữa",
      "primaryHeadNameEn": "Anterior & Lateral Deltoids",
      "secondaryHeads": [
        "Tay sau"
      ],
      "mindMuscleCue": "Máy cố định giúp đẩy mức tạ tối đa mà không lo mất thăng bằng, đẩy dứt khoát và hạ kiểm soát 2-3 giây.",
      "feelingLocation": "Toàn bộ vòm cơ vai",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Shoulder_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Shoulder_Press/1.jpg"
    ],
    "videoEmbedId": "WvLMauqrnK8",
    "videoQuery": "machine shoulder press proper form",
    "setup": "Chỉnh độ cao ghế ngồi sao cho tay cầm ngang tầm tai hoặc cằm. Tựa sát lưng vào ghế.",
    "execution": "Hít sâu gồng bụng, đẩy mạnh tay cầm thẳng lên trần nhà, không khóa khớp khuỷu tay. Hạ tạ từ từ xuống ngang tai.",
    "mistakes": "Không cong võng lưng dưới rời khỏi tựa ghế."
  },
  {
    "id": "standing_arnold_press",
    "name": "Standing Dumbbell Arnold Press (Đẩy vai xoay cổ tay tư thế đứng)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.8
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_giua",
      "primaryHeadNameVi": "Vai Giữa & Vai Trước 3D",
      "primaryHeadNameEn": "Lateral & Anterior Deltoid",
      "secondaryHeads": [
        "Tay sau"
      ],
      "mindMuscleCue": "Bắt đầu với lòng bàn tay hướng vào mặt, khi đẩy lên xoay 180 độ ra ngoài để kích hoạt toàn diện 3 đầu cơ vai.",
      "feelingLocation": "Bao phủ toàn bộ chóp vai",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Arnold_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Arnold_Press/1.jpg"
    ],
    "videoEmbedId": "3ml7BH7mNwQ",
    "videoQuery": "standing arnold press form dumbbell",
    "setup": "Đứng thẳng người, cầm 2 quả tạ đơn trước ngực ngang cằm, lòng bàn tay hướng vào trong người.",
    "execution": "Đẩy tạ lên đồng thời xoay cổ tay ra ngoài sao cho khi tạ lên đỉnh đầu, lòng bàn tay hướng về phía trước.",
    "mistakes": "Không dùng tạ quá nặng làm sai lệch chuyển động xoay cổ tay."
  },
  {
    "id": "incline_rear_delt_fly",
    "name": "Incline Bench Rear Delt Fly (Bay vai sau nằm úp ghế dốc)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.8
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "upper_back",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_sau",
      "primaryHeadNameVi": "Cơ Vai Sau (Posterior Deltoid)",
      "primaryHeadNameEn": "Posterior Deltoid",
      "secondaryHeads": [
        "Cơ trám",
        "Lưng trên"
      ],
      "mindMuscleCue": "Nằm úp ngực lên ghế dốc 30 độ, mở hai cánh tay sang hai bên như cánh chim, tập trung nâng tạ bằng cùi chỏ.",
      "feelingLocation": "Góc sau của khớp vai",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_Rear_Delt_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_Rear_Delt_Raise/1.jpg"
    ],
    "videoEmbedId": "0GSu6Z-Oj7U",
    "videoQuery": "incline bench rear delt fly dumbbell form",
    "setup": "Chỉnh ghế dốc 30 độ. Nằm úp ngực tì chắc vào ghế, cầm 2 quả tạ đơn buông thõng hai bên, cùi chỏ hơi cong nhẹ.",
    "execution": "Thở ra, nâng hai quả tạ sang hai bên ngang vai, giữ 1 giây siết chặt cơ vai sau rồi hạ xuống chậm rãi.",
    "mistakes": "Không dùng cơ lưng trên giật bả vai quá nhiều, hãy tưởng tượng đẩy tạ ra xa sang hai bức tường."
  },
  {
    "id": "cable_single_arm_lateral_raise",
    "name": "Cable Single-Arm Lateral Raise (Bay vai ngang cáp 1 tay)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.05
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_giua",
      "primaryHeadNameVi": "Cơ Vai Giữa (Căng Kháng Lực Liên Tục)",
      "primaryHeadNameEn": "Lateral Deltoid Continuous Tension",
      "secondaryHeads": [
        "Cầu vai"
      ],
      "mindMuscleCue": "Dây cáp giữ lực căng ngay từ vị trí bắt đầu dưới đáy, giúp vai giữa nở to tròn như quả dừa.",
      "feelingLocation": "Mặt ngoài của vai",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 5,
      "noteVi": "Chỉnh cáp ở vị trí thấp nhất hoặc ngang đầu gối."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/1.jpg"
    ],
    "videoEmbedId": "PPrzBWZDOhA",
    "videoQuery": "cable single arm lateral raise form",
    "setup": "Hạ ròng rọc cáp xuống vị trí thấp. Đứng nghiêng người so với trụ cáp, tay xa cột cáp nắm quai cầm.",
    "execution": "Nâng cánh tay sang ngang cho tới khi tay song song với sàn nhà, cùi chỏ dẫn đường. Giữ 1 giây rồi hạ từ từ.",
    "mistakes": "Không nhún cầu vai lên, giữ vai hạ thấp trong suốt động tác."
  },
  {
    "id": "barbell_upright_row",
    "name": "Barbell Upright Row (Kéo tạ đòn thẳng đứng lên cằm)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "traps",
        "ratio": 0.4
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_giua",
      "primaryHeadNameVi": "Vai Giữa & Cầu Vai Trên",
      "primaryHeadNameEn": "Lateral Delts & Upper Traps",
      "secondaryHeads": [
        "Cầu vai",
        "Cẳng tay"
      ],
      "mindMuscleCue": "Cầm tay rộng bằng vai, kéo cùi chỏ hướng lên trần nhà như cánh chim, tạ trượt sát thân người.",
      "feelingLocation": "Đỉnh vai giữa và cơ cầu vai",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/1.jpg"
    ],
    "videoEmbedId": "amCU-ziHITM",
    "videoQuery": "barbell upright row proper form wide grip",
    "setup": "Đứng thẳng người, cầm thanh đòn với khoảng cách hai tay rộng bằng vai (tránh cầm quá hẹp gây kẹt khớp vai).",
    "execution": "Kéo thanh đòn dọc theo thân người lên ngang ngực trên, hai cùi chỏ luôn cao hơn cổ tay. Hạ xuống kiểm soát.",
    "mistakes": "Tuyệt đối không cầm tay quá hẹp sát nhau vì sẽ gây chèn ép gân cơ trên gai (Impingement)."
  },
  {
    "id": "smith_machine_overhead_press",
    "name": "Smith Machine Overhead Press (Đẩy vai máy Smith)",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "shoulders",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "vai_truoc",
      "primaryHeadNameVi": "Vai Trước & Vai Giữa Ổn Định",
      "primaryHeadNameEn": "Anterior Deltoid & Overhead Strength",
      "secondaryHeads": [
        "Tay sau"
      ],
      "mindMuscleCue": "Quỹ đạo cố định giúp tập trung toàn lực đẩy mức tạ lớn an toàn, không lo mất thăng bằng.",
      "feelingLocation": "Khối vai trước và vai giữa",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Overhead_Shoulder_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Overhead_Shoulder_Press/1.jpg"
    ],
    "videoEmbedId": "2yjwXTZQDDI",
    "videoQuery": "smith machine overhead shoulder press form",
    "setup": "Kê ghế tựa lưng 75-80 độ dưới đòn máy Smith. Cầm thanh đòn rộng hơn vai một chút.",
    "execution": "Mở khóa đòn tạ, hạ tạ kiểm soát xuống ngang cằm/xương đòn, đẩy dứt khoát lên trên đỉnh đầu.",
    "mistakes": "Không khóa cứng khớp cùi chỏ ở đỉnh."
  },
  {
    "id": "incline_dumbbell_hammer_curl",
    "name": "Incline Dumbbell Hammer Curl (Cuốn tạ búa ghế nghiêng)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.35
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_canh_tay",
      "primaryHeadNameVi": "Cơ Cánh Tay (Brachialis) & Dày Bắp Tay",
      "primaryHeadNameEn": "Brachialis & Biceps Long Head",
      "secondaryHeads": [
        "Cẳng tay (Brachioradialis)"
      ],
      "mindMuscleCue": "Ghế nghiêng giúp đầu dài cơ tay trước căng hết cỡ từ dưới đáy, lòng bàn tay hướng vào nhau kích hoạt Brachialis đẩy bắp tay dày cộm.",
      "feelingLocation": "Mặt ngoài bắp tay và cẳng tay",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Hammer_Curls/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Hammer_Curls/1.jpg"
    ],
    "videoEmbedId": "zC3nLlEvin4",
    "videoQuery": "incline dumbbell hammer curl form",
    "setup": "Chỉnh ghế dốc 45-60 độ. Ngồi tựa lưng hoàn toàn, hai tay cầm 2 quả tạ đơn buông thõng, lòng bàn tay đối diện nhau.",
    "execution": "Cố định bắp tay trên, cuốn tạ lên bằng cách gập cùi chỏ, giữ nguyên cổ tay hướng vào nhau. Siết cơ ở đỉnh rồi hạ từ từ.",
    "mistakes": "Không đưa cùi chỏ về phía trước khi cuốn tạ."
  },
  {
    "id": "cable_rope_hammer_curl",
    "name": "Cable Rope Hammer Curl (Cuốn dây thừng cáp tạ búa)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.35
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_canh_tay",
      "primaryHeadNameVi": "Cơ Cánh Tay & Cơ Cẳng Tay",
      "primaryHeadNameEn": "Brachialis & Forearms",
      "secondaryHeads": [
        "Tay trước"
      ],
      "mindMuscleCue": "Kéo dây thừng từ cáp thấp lên ngang ngực, tách hai đầu dây thừng ở đỉnh để bóp nghẹt cơ cánh tay.",
      "feelingLocation": "Mặt ngoài của bắp tay trước và mu cẳng tay",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Lắp dây thừng vào ròng rọc cáp thấp nhất."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Hammer_Curls_-_Rope_Attachment/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Hammer_Curls_-_Rope_Attachment/1.jpg"
    ],
    "videoEmbedId": "kwG2ipFRgfo",
    "videoQuery": "cable rope hammer curl form",
    "setup": "Hạ cáp xuống sát sàn, lắp dây thừng. Đứng thẳng, nắm dây thừng với lòng bàn tay hướng vào nhau, khuỷu tay áp sát sườn.",
    "execution": "Cuốn tạ lên hướng về vai, khi lên đỉnh hơi tách nhẹ hai đầu dây thừng ra hai bên, giữ 1 giây siết cơ rồi hạ xuống.",
    "mistakes": "Không vung vẩy hông lấy đà."
  },
  {
    "id": "spider_curl",
    "name": "Spider Curl (Cuốn tạ đòn tì ngực ghế dốc Spider)",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_ngan",
      "primaryHeadNameVi": "Đầu Ngắn Tay Trước (Biceps Short Head)",
      "primaryHeadNameEn": "Biceps Short Head (Inner Peak)",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Cánh tay buông thẳng vuông góc với sàn triệt tiêu hoàn toàn sự trợ lực từ vai, ép bắp tay trước căng phồng cực đại.",
      "feelingLocation": "Bụng trong của bắp tay trước",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Spider_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Spider_Curl/1.jpg"
    ],
    "videoEmbedId": "ivS3G35bapw",
    "videoQuery": "spider curl form dumbbell ez bar",
    "setup": "Nằm úp ngực lên phần dốc đứng của ghế tập (khoảng 45 độ). Hai cánh tay buông thõng vuông góc với sàn, cầm đòn tạ EZ.",
    "execution": "Cố định cùi chỏ, cuốn tạ lên phía cằm, siết chặt bắp tay trước ở đỉnh trong 1-2 giây rồi hạ từ từ.",
    "mistakes": "Không đung đưa cùi chỏ ra sau khi cuốn."
  },
  {
    "id": "dumbbell_concentration_curl",
    "name": "Concentration Curl (Cuốn tạ đơn cô lập một tay)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_dai",
      "primaryHeadNameVi": "Đỉnh Bắp Tay Trước (Biceps Peak)",
      "primaryHeadNameEn": "Biceps Long Head Peak",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Tì cùi chỏ vào mặt trong đùi để khóa chặt chuyển động, ngửa cổ tay xoay ngón út lên cao để bóp vắt đỉnh bắp tay.",
      "feelingLocation": "Chóp nhọn của bắp tay trước",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curls/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curls/1.jpg"
    ],
    "videoEmbedId": "Jvj2wV0vOYU",
    "videoQuery": "how to concentration curl properly form",
    "setup": "Ngồi trên ghế phẳng, hai chân mở rộng. Tì phần sau của bắp tay trên vào mặt trong đùi cùng bên, tay kia chống lên gối đối diện.",
    "execution": "Cuốn tạ đơn lên hướng về mặt, đồng thời hơi xoay ngửa cổ tay (supinate), siết chặt đỉnh bắp tay rồi hạ xuống hoàn toàn.",
    "mistakes": "Không dùng người giật tạ lên, giữ thân trên bất động."
  },
  {
    "id": "reverse_barbell_curl",
    "name": "Reverse Grip Barbell Curl (Cuốn tạ đòn sấp bàn tay)",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.4
      }
    ],
    "muscleTarget": {
      "primaryHead": "cang_tay",
      "primaryHeadNameVi": "Cơ Cánh Tay Quay & Mu Cẳng Tay",
      "primaryHeadNameEn": "Brachioradialis & Forearms",
      "secondaryHeads": [
        "Cơ cánh tay (Brachialis)"
      ],
      "mindMuscleCue": "Cầm sấp bàn tay giúp chuyển toàn bộ áp lực vào cơ cánh tay quay (Brachioradialis) tạo cẳng tay rắn chắc như thép.",
      "feelingLocation": "Mặt trên cẳng tay từ cùi chỏ tới cổ tay",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Barbell_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Barbell_Curl/1.jpg"
    ],
    "videoEmbedId": "nRgxYX2Ve9w",
    "videoQuery": "reverse grip barbell curl form forearms",
    "setup": "Đứng thẳng người, cầm thanh đòn EZ hoặc đòn thẳng với lòng bàn tay úp xuống (sấp tay), tay rộng bằng vai.",
    "execution": "Giữ cùi chỏ áp sát sườn, cuốn tạ lên trên, giữ cổ tay thẳng không để bị bẻ gập. Hạ tạ từ từ.",
    "mistakes": "Không để cổ tay bị bẻ cong quặp xuống dưới khi tạ nặng."
  },
  {
    "id": "dumbbell_preacher_curl",
    "name": "One-Arm Dumbbell Preacher Curl (Cuốn tạ đơn 1 tay trên bàn Scott)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [
      {
        "muscle": "biceps",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_truoc_ngan",
      "primaryHeadNameVi": "Đầu Ngắn Tay Trước (Biceps Short Head)",
      "primaryHeadNameEn": "Biceps Short Head Isolation",
      "secondaryHeads": [
        "Cẳng tay"
      ],
      "mindMuscleCue": "Tựa nách sát mép đệm bàn Scott, cô lập từng bên tay để khắc phục hoàn toàn tình trạng lệch cơ giữa hai tay.",
      "feelingLocation": "Thân trong của cơ bắp tay trước",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Dumbbell_Preacher_Curl/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Dumbbell_Preacher_Curl/1.jpg"
    ],
    "videoEmbedId": "fIWP-FRFNU0",
    "videoQuery": "one arm dumbbell preacher curl form",
    "setup": "Ngồi vào bàn Scott (Preacher Bench), tựa phần sau bắp tay chắc chắn lên mặt đệm nghiêng, cầm quả tạ đơn bằng 1 tay.",
    "execution": "Hạ tạ xuống kiểm soát đến khi tay gần thẳng (không khóa khớp khuỷu), cuốn mạnh tạ lên và siết chặt ở đỉnh.",
    "mistakes": "Không nhấc nách hoặc vai rời khỏi mặt đệm."
  },
  {
    "id": "barbell_wrist_curl",
    "name": "Barbell Wrist Curl (Cuốn cổ tay tạ đòn phát triển cẳng tay)",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "cang_tay",
      "primaryHeadNameVi": "Cơ Gập Cổ Tay (Forearm Flexors)",
      "primaryHeadNameEn": "Forearm Flexor Muscle Group",
      "secondaryHeads": [],
      "mindMuscleCue": "Tì cẳng tay lên ghế hoặc đùi, để đòn tạ lăn nhẹ xuống các đầu ngón tay rồi cuộn chặt cổ tay lên trên.",
      "feelingLocation": "Mặt dưới cẳng tay căng cứng",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Up_Barbell_Wrist_Curl_Over_A_Bench/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Up_Barbell_Wrist_Curl_Over_A_Bench/1.jpg"
    ],
    "videoEmbedId": "IG8dV1Ii1nY",
    "videoQuery": "barbell wrist curl forearms form",
    "setup": "Quỳ trước ghế phẳng, đặt hai cẳng tay lên mặt ghế sao cho cổ tay nhô ra ngoài mép ghế, lòng bàn tay ngửa lên cầm thanh đòn.",
    "execution": "Hạ cổ tay cho thanh đòn lăn nhẹ xuống ngón tay, sau đó cuộn các ngón tay và gập mạnh cổ tay lên cao nhất có thể.",
    "mistakes": "Không nhấc cùi chỏ rời khỏi mặt ghế."
  },
  {
    "id": "cable_single_arm_tricep_extension",
    "name": "Cable Single Arm Tricep Extension (Kéo cáp 1 tay duỗi tay sau)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Đầu Ngoài Tay Sau (Triceps Lateral Head)",
      "primaryHeadNameEn": "Triceps Lateral Head",
      "secondaryHeads": [
        "Đầu giữa"
      ],
      "mindMuscleCue": "Tập từng bên tay với dây cáp không gắn quai cầm (cầm trực tiếp vào quả cầu cáp), duỗi thẳng tay ép cơ tay sau khóa lại.",
      "feelingLocation": "Mặt ngoài của cơ bắp tay sau hình móng ngựa",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 10,
      "noteVi": "Chỉnh ròng rọc cáp cao, cầm trực tiếp vào đầu bọc cao su cáp."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_One_Arm_Tricep_Extension/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_One_Arm_Tricep_Extension/1.jpg"
    ],
    "videoEmbedId": "7lYeoKRXO-0",
    "videoQuery": "single arm cable tricep extension form",
    "setup": "Đứng bên cạnh khung cáp, ròng rọc ở vị trí cao nhất. Nắm quả cầu cáp hoặc quai cầm đơn, cùi chỏ áp sát sườn.",
    "execution": "Giữ bắp tay trên bất động, duỗi cẳng tay thẳng xuống dưới và hơi chéo ra ngoài, siết cứng cơ tay sau 1 giây rồi nhả lên.",
    "mistakes": "Không để cùi chỏ di chuyển ra trước hoặc ra sau."
  },
  {
    "id": "tate_press",
    "name": "Dumbbell Tate Press (Nằm duỗi tạ đơn khuỷu mở ngang)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.95
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.05
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_sau_giua",
      "primaryHeadNameVi": "Đầu Giữa & Khối Tay Sau (Medial Head)",
      "primaryHeadNameEn": "Triceps Medial & Lateral Head",
      "secondaryHeads": [
        "Ngực"
      ],
      "mindMuscleCue": "Hạ hai quả tạ hướng vào giữa lồng ngực với khuỷu tay mở rộng sang hai bên, sau đó duỗi thẳng cánh tay lên bằng lực tay sau.",
      "feelingLocation": "Khối thịt cơ tay sau ngay phía trên cùi chỏ",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tate_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tate_Press/1.jpg"
    ],
    "videoEmbedId": "cZJ-4Ll3uAo",
    "videoQuery": "how to tate press dumbbell form triceps",
    "setup": "Nằm ngửa trên ghế phẳng, cầm 2 quả tạ đơn duỗi thẳng phía trên ngực, hai quả tạ chạm nhẹ vào nhau.",
    "execution": "Gập cùi chỏ mở rộng sang hai bên, hạ đầu trong của 2 quả tạ xuống chạm nhẹ ngực giữa. Dùng lực tay sau duỗi tạ thẳng lên lại.",
    "mistakes": "Không để tạ rơi tự do đập vào xương ức."
  },
  {
    "id": "smith_close_grip_bench_press",
    "name": "Smith Close Grip Bench Press (Đẩy ngực tay hẹp máy Smith ăn tay sau)",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.7
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.2
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Tay Sau Toàn Phần & Đẩy Nặng",
      "primaryHeadNameEn": "Triceps Overload",
      "secondaryHeads": [
        "Ngực",
        "Vai trước"
      ],
      "mindMuscleCue": "Cầm tay rộng bằng vai trên thanh máy Smith, ép hai cùi chỏ sát mạn sườn để dồn 100% lực đẩy vào bắp tay sau.",
      "feelingLocation": "Toàn bộ cơ bắp tay sau",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Close-Grip_Bench_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Close-Grip_Bench_Press/1.jpg"
    ],
    "videoEmbedId": "nEF0bv2FW94",
    "videoQuery": "smith machine close grip bench press form",
    "setup": "Đặt ghế phẳng dưới máy Smith, cầm thanh đòn với khoảng cách hai tay cách nhau khoảng 30cm (rộng bằng vai).",
    "execution": "Mở khóa đòn tạ, hạ đòn chạm nhẹ ngực dưới, giữ khuỷu tay khép sát thân người. Đẩy dứt khoát lên trên bằng tay sau.",
    "mistakes": "Không cầm tay quá sát (<15cm) vì sẽ gây đau cổ tay nghiêm trọng."
  },
  {
    "id": "diamond_push_up",
    "name": "Diamond Push Up (Hít đất tay kim cương phát lực tay sau)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.25
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_sau_ngoai",
      "primaryHeadNameVi": "Tay Sau & Ngực Trong",
      "primaryHeadNameEn": "Triceps & Inner Chest",
      "secondaryHeads": [
        "Ngực giữa",
        "Vai trước"
      ],
      "mindMuscleCue": "Hai bàn tay chụm lại thành hình kim cương ngay dưới ngực, nhấn lòng bàn tay đẩy sàn để khóa cơ tay sau.",
      "feelingLocation": "Bắp tay sau và rãnh ngực",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/1.jpg"
    ],
    "videoEmbedId": "PPTj-MW2tcs",
    "videoQuery": "how to diamond push up properly form",
    "setup": "Tư thế hít đất tiêu chuẩn, hai bàn tay đặt sát nhau sao cho ngón cái và ngón trỏ tạo thành hình kim cương ngay dưới ngực.",
    "execution": "Gồng chặt cơ bụng mông, hạ ngực xuống sát bàn tay có kiểm soát, sau đó nhấn mạnh lòng bàn tay đẩy thẳng người lên.",
    "mistakes": "Không để võng lưng hoặc nhổm mông quá cao."
  },
  {
    "id": "tricep_dip",
    "name": "Parallel Bar Tricep Dip (Chống xà kép thân thẳng cô lập tay sau)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "chest",
        "ratio": 0.15
      },
      {
        "muscle": "shoulders",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "tay_sau_dai",
      "primaryHeadNameVi": "Đầu Dài Cơ Tam Đầu (Triceps Long Head)",
      "primaryHeadNameEn": "Triceps Long Head",
      "secondaryHeads": [
        "Chân ngực",
        "Vai trước"
      ],
      "mindMuscleCue": "Giữ thân người thẳng đứng vuông góc với sàn, ép cùi chỏ ra sau sát sườn để cô lập trọn vẹn tay sau.",
      "feelingLocation": "Mặt sau bắp tay chịu toàn bộ tải trọng",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/1.jpg"
    ],
    "videoEmbedId": "2z8JmcrW-As",
    "videoQuery": "parallel bar tricep dips proper form",
    "setup": "Nhảy lên hai thanh xà kép song song, khóa nhẹ khuỷu tay, giữ thân người thẳng đứng không nghiêng về trước.",
    "execution": "Hạ người xuống bằng cách gập khuỷu tay ra phía sau cho đến khi cẳng tay tạo góc 90 độ. Đẩy mạnh người lên vị trí ban đầu.",
    "mistakes": "Không chồm người về phía trước (sẽ ăn vào ngực thay vì tay sau)."
  },
  {
    "id": "cable_reverse_pushdown",
    "name": "Cable Reverse Grip Pushdown (Kéo cáp ngửa tay duỗi tay sau)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "vertical_push",
    "primaryMuscles": [
      {
        "muscle": "triceps",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "tay_sau_giua",
      "primaryHeadNameVi": "Đầu Giữa Cơ Tay Sau (Triceps Medial Head)",
      "primaryHeadNameEn": "Triceps Medial Head",
      "secondaryHeads": [],
      "mindMuscleCue": "Cầm ngửa bàn tay kéo cáp thẳng xuống dưới giúp cô lập đầu giữa tay sau mà không gây đau cổ tay.",
      "feelingLocation": "Phần cơ tay sau sát khuỷu tay",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Dùng thanh đòn thẳng hoặc EZ bar, cầm ngửa bàn tay."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Grip_Triceps_Pushdown/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Grip_Triceps_Pushdown/1.jpg"
    ],
    "videoEmbedId": "2-LAMcpzODU",
    "videoQuery": "reverse grip cable tricep pushdown form",
    "setup": "Lắp thanh đòn thẳng vào ròng rọc cáp cao. Cầm thanh đòn với lòng bàn tay hướng lên trên (ngửa tay), ép khuỷu tay vào sườn.",
    "execution": "Nhấn thanh đòn thẳng xuống dưới cho đến khi cánh tay duỗi thẳng hoàn toàn. Giữ 1 giây rồi nhả từ từ lên ngang ngực.",
    "mistakes": "Không để cùi chỏ bị nhấc lên theo thanh đòn."
  },
  {
    "id": "sumo_leg_press",
    "name": "Sumo Leg Press (Đạp đùi rộng chân mũi chân mở 45 độ)",
    "tier": 1,
    "equipment": "machine",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.45
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.35
      },
      {
        "muscle": "hamstrings",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Cơ Mông & Đùi Trong (Glutes & Adductors)",
      "primaryHeadNameEn": "Gluteus Maximus & Adductors",
      "secondaryHeads": [
        "Đùi trước",
        "Đùi sau"
      ],
      "mindMuscleCue": "Đặt hai bàn chân rộng sát mép bàn đạp, mũi chân xoay ngoài 45 độ. Hạ sâu để cơ mông và đùi trong căng hết cỡ trước khi đạp mạnh bằng gót.",
      "feelingLocation": "Cơ mông lớn và toàn bộ mặt trong của đùi",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg"
    ],
    "videoEmbedId": "IZxyjW7MPJQ",
    "videoQuery": "sumo wide stance leg press form glutes",
    "setup": "Ngồi vào máy đạp đùi 45 độ, đặt hai bàn chân ở phần trên cùng của bàn đạp, dang rộng chân và mở mũi chân ra ngoài 45 độ.",
    "execution": "Mở khóa bàn đạp, hạ bàn đạp xuống sâu về phía ngực, mở gối hướng theo mũi chân. Đạp mạnh bằng gót chân đẩy bàn đạp lên.",
    "mistakes": "Không khóa cứng khớp gối ở đỉnh, không để mông bị nhấc bổng khỏi ghế khi hạ tạ sâu."
  },
  {
    "id": "dumbbell_walking_lunges",
    "name": "Dumbbell Walking Lunges (Bước chùng chân bước đi cầm tạ đơn)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "lunge",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.5
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.4
      },
      {
        "muscle": "hamstrings",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Cơ Mông & Đùi Trước Đốt Mỡ",
      "primaryHeadNameEn": "Glutes & Quads Dynamic Hypertrophy",
      "secondaryHeads": [
        "Đùi sau",
        "Bắp chân"
      ],
      "mindMuscleCue": "Bước dài về phía trước, hạ gối sau gần chạm sàn, nhấn mạnh gót chân trước để đẩy thân người bước tiếp.",
      "feelingLocation": "Mông căng tròn và đùi trước rực lửa",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/1.jpg"
    ],
    "videoEmbedId": "L8fvypPrzzs",
    "videoQuery": "dumbbell walking lunges proper form",
    "setup": "Đứng thẳng người, hai tay cầm hai quả tạ đơn nặng vừa phải buông thõng hai bên người.",
    "execution": "Bước một chân dài về trước, hạ hông xuống cho cả hai đầu gối gập 90 độ (gối sau cách sàn 2cm). Nhấn gót trước bước tiếp chân sau lên.",
    "mistakes": "Không để đầu gối trước vượt quá xa mũi chân hoặc đổ nghiêng người mất thăng bằng."
  },
  {
    "id": "cable_pull_through",
    "name": "Cable Pull Through (Kéo cáp luồn háng tập mông đùi sau)",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.4
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Cơ Mông Lớn (Gluteus Maximus)",
      "primaryHeadNameEn": "Gluteus Maximus Hip Extension",
      "secondaryHeads": [
        "Đùi sau",
        "Lưng dưới"
      ],
      "mindMuscleCue": "Đẩy hông ra sau như bản lề cửa cho đùi sau căng dãn, sau đó đẩy hông dứt khoát về trước và siết chặt mông cứng như đá.",
      "feelingLocation": "Trung tâm cơ mông và gân khoeo đùi sau",
      "bodyView": "back"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 25,
      "noteVi": "Chỉnh ròng rọc cáp thấp nhất, lắp dây thừng."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Good_Morning_(Pull_Through)/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Good_Morning_(Pull_Through)/1.jpg"
    ],
    "videoEmbedId": "v_L0e-SntSU",
    "videoQuery": "cable pull through form for glutes",
    "setup": "Lắp dây thừng vào ròng rọc thấp. Đứng quay lưng lại cột cáp, chân rộng bằng vai, luồn hai đầu dây thừng qua giữa hai chân.",
    "execution": "Gập hông đẩy mông ra sau trong khi lưng giữ thẳng. Khi cơ đùi sau căng hết cỡ, đẩy mạnh hông về trước và khóa cơ mông ở đỉnh.",
    "mistakes": "Tuyệt đối không dùng tay kéo tạ, tay chỉ đóng vai trò giữ dây thừng."
  },
  {
    "id": "hip_abduction_machine",
    "name": "Hip Abduction Machine (Máy banh đùi ngồi phát triển mông nhỡ)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Mông Nhỡ & Mông Bé (Gluteus Medius)",
      "primaryHeadNameEn": "Gluteus Medius & Minimus",
      "secondaryHeads": [],
      "mindMuscleCue": "Hơi nhổm mông đổ người về trước 20 độ, mở rộng hai đùi ra hai bên hết biên độ máy để làm đầy hõm mông hai bên.",
      "feelingLocation": "Phần mông trên và hai bên hõm mông",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Thigh_Abductor/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Thigh_Abductor/1.jpg"
    ],
    "videoEmbedId": "tu4o4quPv2k",
    "videoQuery": "seated hip abduction machine form glutes",
    "setup": "Ngồi vào máy banh đùi, đặt hai đầu gối vào phía trong của hai đệm tì. Bàn chân đặt trên giá đỡ.",
    "execution": "Dùng cơ mông mở rộng hai đùi ra ngoài tối đa, giữ lại 1-2 giây ở vị trí mở rộng nhất rồi khép lại từ từ có kiểm soát.",
    "mistakes": "Không để tạ đập mạnh vào nhau khi khép đùi, luôn giữ áp lực liên tục."
  },
  {
    "id": "hip_adduction_machine",
    "name": "Hip Adduction Machine (Máy khép đùi ngồi phát triển đùi trong)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.4
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_sau",
      "primaryHeadNameVi": "Cơ Khép Đùi Trong (Adductor Muscles)",
      "primaryHeadNameEn": "Hip Adductor Group",
      "secondaryHeads": [
        "Đùi trước"
      ],
      "mindMuscleCue": "Dùng sức mạnh của các nhóm cơ khép đùi trong ép hai đệm máy chạm vào nhau, giữ 1 giây siết cơ.",
      "feelingLocation": "Toàn bộ dải cơ dọc mặt trong đùi",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Thigh_Adductor/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Thigh_Adductor/1.jpg"
    ],
    "videoEmbedId": "BmMmt-c9aNM",
    "videoQuery": "seated hip adduction machine inner thigh form",
    "setup": "Ngồi vào máy khép đùi, điều chỉnh chốt mở hai chân rộng ra hai bên. Đặt mặt trong gối vào hai miếng đệm.",
    "execution": "Gồng cơ đùi trong, khép hai chân lại về giữa cho đến khi hai đệm chạm nhẹ vào nhau. Nhả từ từ ra ngoài.",
    "mistakes": "Không giật tạ đột ngột làm căng giật cơ khép háng."
  },
  {
    "id": "smith_machine_squat",
    "name": "Smith Machine Squat (Squat gánh tạ máy Smith an toàn lưng)",
    "tier": 1,
    "equipment": "machine",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.6
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.3
      },
      {
        "muscle": "hamstrings",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đùi Trước & Cơ Mông Lớn",
      "primaryHeadNameEn": "Quadriceps & Gluteus Maximus",
      "secondaryHeads": [
        "Đùi sau"
      ],
      "mindMuscleCue": "Đặt bàn chân hơi tiến về trước 15-20cm so với thanh đòn giúp giữ thân người thẳng đứng, giảm tải triệt để cho lưng dưới.",
      "feelingLocation": "Mặt trước cơ đùi và cơ mông",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Squat/1.jpg"
    ],
    "videoEmbedId": "ultWZbUMPL8",
    "videoQuery": "smith machine squat proper form quads",
    "setup": "Chỉnh đòn tạ máy Smith ngang tầm ngực trên. Đặt đòn lên cơ cầu vai, bước hai bàn chân về phía trước thanh đòn khoảng một gang tay.",
    "execution": "Mở khóa đòn tạ, hít sâu gồng bụng hạ người xuống cho đến khi đùi song song với sàn. Đạp mạnh sàn đứng thẳng dậy và thở ra.",
    "mistakes": "Không đặt chân quá sâu ra sau làm gối chịu tải quá mức."
  },
  {
    "id": "hack_squat_machine",
    "name": "Hack Squat Machine (Máy Hack Squat cô lập đùi trước)",
    "tier": 1,
    "equipment": "machine",
    "movementPattern": "squat",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.75
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.25
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_truoc",
      "primaryHeadNameVi": "Đùi Trước Khối Teardrop (Vastus Medialis)",
      "primaryHeadNameEn": "Quadriceps Isolation & Teardrop",
      "secondaryHeads": [
        "Cơ mông"
      ],
      "mindMuscleCue": "Lưng tựa chắc vào đệm máy nghiêng 45 độ, đạp thẳng đùi trước tạo khối cơ giọt nước sắc nét quanh đầu gối.",
      "feelingLocation": "Khối cơ đùi trước ngay phía trên khớp gối",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hack_Squat/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hack_Squat/1.jpg"
    ],
    "videoEmbedId": "0tn5K9NlCfo",
    "videoQuery": "hack squat machine form quads workout",
    "setup": "Tựa lưng và vai vào đệm máy Hack Squat. Đặt hai bàn chân ở giữa bàn đạp, rộng bằng vai.",
    "execution": "Mở chốt hãm tạ, hạ người xuống từ từ đến góc 90 độ của đầu gối. Đạp mạnh bằng toàn bộ bàn chân đẩy xe tạ lên.",
    "mistakes": "Không nhấc gót chân rời khỏi bàn đạp khi xuống sâu."
  },
  {
    "id": "barbell_step_ups",
    "name": "Barbell Step-Ups (Bước lên bục gánh tạ đòn)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "lunge",
    "primaryMuscles": [
      {
        "muscle": "quads",
        "ratio": 0.5
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.5
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_mong",
      "primaryHeadNameVi": "Cơ Mông & Đùi Trước Từng Bên",
      "primaryHeadNameEn": "Gluteus Maximus & Unilateral Quads",
      "secondaryHeads": [
        "Bắp chân"
      ],
      "mindMuscleCue": "Đặt trọn vẹn bàn chân lên bục cao, chỉ phát lực bằng chân trên bục để nâng thân người lên, không nhún chân dưới sàn.",
      "feelingLocation": "Cơ mông chân trên bục căng cứng",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Step_Ups/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Step_Ups/1.jpg"
    ],
    "videoEmbedId": "dQqApCGd5Ss",
    "videoQuery": "barbell step ups form for glutes and quads",
    "setup": "Gánh đòn tạ lên vai như tư thế squat. Đứng trước một bục gỗ hoặc ghế tập có chiều cao ngang đầu gối.",
    "execution": "Đặt một chân vững chắc lên bục, nhấn gót chân đẩy người đứng thẳng lên bục. Hạ chân sau xuống đất có kiểm soát.",
    "mistakes": "Không dùng chân dưới sàn bật nhảy đẩy người lên."
  },
  {
    "id": "dumbbell_stiff_leg_deadlift",
    "name": "Dumbbell Stiff-Leg Deadlift (Deadlift chân thẳng tạ đơn kéo giãn đùi sau)",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [
      {
        "muscle": "hamstrings",
        "ratio": 0.65
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.25
      },
      {
        "muscle": "lower_back",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "dui_sau",
      "primaryHeadNameVi": "Gân Khoeo Đùi Sau (Hamstrings Length)",
      "primaryHeadNameEn": "Hamstrings Hypertrophy in Lengthened State",
      "secondaryHeads": [
        "Cơ mông",
        "Lưng dưới"
      ],
      "mindMuscleCue": "Đầu gối chỉ hơi chùng nhẹ và cố định góc, đẩy hông ra xa về sau cho đến khi cảm thấy toàn bộ đùi sau căng tức như dây đàn.",
      "feelingLocation": "Dọc bắp đùi sau từ mông tới gối",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Dumbbell_Deadlift/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Dumbbell_Deadlift/1.jpg"
    ],
    "videoEmbedId": "JCXUYuzwNrM",
    "videoQuery": "dumbbell stiff leg deadlift form hamstrings",
    "setup": "Đứng thẳng người, hai tay cầm hai quả tạ đơn đặt trước đùi, chân rộng bằng hông, gối hơi chùng nhẹ.",
    "execution": "Đẩy hông ra sau và cúi gập thân người xuống có kiểm soát, tạ trượt sát cẳng chân cho đến khi đùi sau căng tối đa. Đẩy hông đứng thẳng dậy.",
    "mistakes": "Không được cong lưng tôm, luôn giữ cột sống thẳng tự nhiên."
  },
  {
    "id": "donkey_calf_raise",
    "name": "Donkey Calf Raise (Nhón bắp chân tư thế Donkey)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [
      {
        "muscle": "calves",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "bap_chan",
      "primaryHeadNameVi": "Cơ Bụng Chân (Gastrocnemius)",
      "primaryHeadNameEn": "Gastrocnemius Full Stretch",
      "secondaryHeads": [],
      "mindMuscleCue": "Gập hông 90 độ giúp kéo căng cơ bụng chân tối đa, nhón gót lên cao nhất có thể và giữ 2 giây ở đỉnh.",
      "feelingLocation": "Bụng bắp chân sau căng tức",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Donkey_Calf_Raises/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Donkey_Calf_Raises/1.jpg"
    ],
    "videoEmbedId": "-M4-G8p8fmc",
    "videoQuery": "donkey calf raise machine form",
    "setup": "Đứng mũi chân lên bục nhón, gập thân người vuông góc về phía trước, tựa cùi chỏ hoặc đệm tạ đè lên hông dưới.",
    "execution": "Hạ gót chân xuống sâu dưới mép bục để kéo căng bắp chân, sau đó nhón mạnh gót chân lên cao nhất có thể và siết cơ 2 giây.",
    "mistakes": "Không gập gối nhấp nhả làm mất tác động cô lập bắp chân."
  },
  {
    "id": "hanging_knee_raise",
    "name": "Hanging Knee Raise (Treo xà gập gối nâng đùi bụng dưới)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "flexion",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.9
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "forearms",
        "ratio": 0.1
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_bung",
      "primaryHeadNameVi": "Cơ Bụng Dưới (Lower Abs)",
      "primaryHeadNameEn": "Lower Rectus Abdominis",
      "secondaryHeads": [
        "Cơ gập hông"
      ],
      "mindMuscleCue": "Treo người trên xà, cuộn xương chậu hướng về phía ngực khi nâng đầu gối lên, không chỉ đơn thuần là nhấc đùi.",
      "feelingLocation": "Vùng bụng dưới rốn",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/1.jpg"
    ],
    "videoEmbedId": "hdng3Nm1x_E",
    "videoQuery": "hanging knee raise proper form lower abs",
    "setup": "Hai tay nắm thanh xà đơn rộng bằng vai, treo người tự nhiên, hai chân khép chặt.",
    "execution": "Thở ra, dùng cơ bụng cuộn hông kéo hai đầu gối lên sát ngực, dừng 1 giây siết chặt cơ bụng rồi hạ xuống từ từ.",
    "mistakes": "Không đung đưa người lấy đà như con lắc."
  },
  {
    "id": "ab_wheel_rollout",
    "name": "Ab Wheel Rollout (Lăn con lăn bụng kháng lực tối đa)",
    "tier": 1,
    "equipment": "bodyweight",
    "movementPattern": "isometric",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.85
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.15
      }
    ],
    "muscleTarget": {
      "primaryHead": "co_bung",
      "primaryHeadNameVi": "Cơ Lõi Toàn Diện & Bụng 6 Múi",
      "primaryHeadNameEn": "Deep Core & Rectus Abdominis",
      "secondaryHeads": [
        "Lưng xô",
        "Cơ liên sườn"
      ],
      "mindMuscleCue": "Gồng chặt cơ bụng cuộn nhẹ xương chậu, lăn con lăn về trước đến khi thân người song song mặt sàn rồi dùng bụng cuộn người lại.",
      "feelingLocation": "Toàn bộ múi bụng căng cứng như bức tường thép",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Roller/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Roller/1.jpg"
    ],
    "videoEmbedId": "MinlHnG7j4k",
    "videoQuery": "how to ab wheel rollout properly form",
    "setup": "Quỳ hai đầu gối trên thảm, hai tay nắm hai đầu của con lăn bụng đặt ngay phía trước đầu gối.",
    "execution": "Hít sâu gồng chặt bụng, từ từ lăn con lăn về phía trước cho đến khi thân người duỗi thẳng gần chạm sàn. Dùng cơ bụng cuộn kéo người về lại.",
    "mistakes": "Tuyệt đối không để võng lưng dưới (gây đau cột sống), luôn giữ lưng hơi cong nhẹ gồng bụng."
  },
  {
    "id": "russian_twist",
    "name": "Russian Twist (Xoay người kiểu Nga siết cơ liên sườn)",
    "tier": 3,
    "equipment": "bodyweight",
    "movementPattern": "rotational",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "co_lien_suon",
      "primaryHeadNameVi": "Cơ Liên Sườn & Cơ Chéo Bụng (Obliques)",
      "primaryHeadNameEn": "Internal & External Obliques",
      "secondaryHeads": [
        "Cơ bụng giữa"
      ],
      "mindMuscleCue": "Ngả lưng 45 độ nhấc chân khỏi sàn, xoay vai và ngực sang hai bên để vắt cạn phần eo liên sườn.",
      "feelingLocation": "Hai bên sườn eo",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Russian_Twists/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Russian_Twists/1.jpg"
    ],
    "videoEmbedId": "wkD8rjkodUI",
    "videoQuery": "russian twist proper form obliques",
    "setup": "Ngồi trên thảm, gập đầu gối, nhấc nhẹ gót chân khỏi sàn và ngả thân trên ra sau tạo góc 45 độ hình chữ V.",
    "execution": "Hai tay chắp trước ngực (hoặc cầm đĩa tạ), xoay toàn bộ thân trên sang phải chạm nhẹ xuống sàn, sau đó xoay dứt khoát sang trái.",
    "mistakes": "Không chỉ cử động hai cánh tay mà phải xoay toàn bộ lồng ngực."
  },
  {
    "id": "deadbug",
    "name": "Deadbug (Tư thế Deadbug siết lõi bảo vệ cột sống)",
    "tier": 3,
    "equipment": "bodyweight",
    "movementPattern": "isometric",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "co_bung",
      "primaryHeadNameVi": "Cơ Bụng Ngang (Transverse Abdominis) Ổn Định Cột Sống",
      "primaryHeadNameEn": "Transverse Abdominis & Deep Core",
      "secondaryHeads": [],
      "mindMuscleCue": "Ấn chặt lưng dưới dính sát vào sàn không để hở một kẽ tay, duỗi tay chân đối bên nhịp nhàng trong khi bụng vẫn gồng chặt.",
      "feelingLocation": "Lớp cơ bụng sâu bên trong",
      "bodyView": "front"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/1.jpg"
    ],
    "videoEmbedId": "4XLEnwUr1d8",
    "videoQuery": "how to do deadbug exercise core stability",
    "setup": "Nằm ngửa trên thảm, giơ hai tay thẳng đứng lên trần nhà, nâng đùi vuông góc với hông và gập gối 90 độ.",
    "execution": "Thở ra ép chặt lưng dưới xuống sàn. Từ từ hạ tay phải qua đầu và duỗi chân trái ra xa song song với sàn. Thu về và đổi bên đối diện.",
    "mistakes": "Tuyệt đối không để lưng dưới bị cong nhấc khỏi mặt sàn."
  },
  {
    "id": "bird_dog",
    "name": "Bird Dog (Tư thế Bird Dog cân bằng lưng & cơ lõi)",
    "tier": 3,
    "equipment": "bodyweight",
    "movementPattern": "isometric",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 0.5
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "glutes",
        "ratio": 0.3
      },
      {
        "muscle": "lower_back",
        "ratio": 0.2
      }
    ],
    "muscleTarget": {
      "primaryHead": "lung_duoi",
      "primaryHeadNameVi": "Cơ Dựng Sống & Cơ Lõi Cân Bằng",
      "primaryHeadNameEn": "Erector Spinae & Core Stability",
      "secondaryHeads": [
        "Cơ mông",
        "Cơ bụng"
      ],
      "mindMuscleCue": "Chống bốn điểm vuông góc, vươn tay và chân đối diện tạo thành một đường thẳng song song với sàn, giữ hông thăng bằng hoàn toàn.",
      "feelingLocation": "Dọc sống lưng và mông",
      "bodyView": "back"
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Superman/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Superman/1.jpg"
    ],
    "videoEmbedId": "wiFNA3sqjCA",
    "videoQuery": "bird dog exercise proper form spine safe",
    "setup": "Quỳ chống hai tay và hai đầu gối vuông góc với sàn nhà (tư thế bò bàn bốn chân), mắt nhìn xuống sàn.",
    "execution": "Vươn tay phải thẳng về trước và đạp chân trái thẳng ra sau cho đến khi song song với mặt đất. Giữ 2-3 giây rồi hạ xuống đổi bên.",
    "mistakes": "Không để võng lưng hoặc nghiêng vẹo hông sang một bên."
  },
  {
    "id": "cable_side_bend",
    "name": "Cable Side Bend (Nghiêng người kéo cáp siết eo)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "lateral_flexion",
    "primaryMuscles": [
      {
        "muscle": "abs",
        "ratio": 1.0
      }
    ],
    "secondaryMuscles": [],
    "muscleTarget": {
      "primaryHead": "co_lien_suon",
      "primaryHeadNameVi": "Cơ Liên Sườn & Cơ Vuông Thắt Lưng",
      "primaryHeadNameEn": "Obliques & Quadratus Lumborum",
      "secondaryHeads": [],
      "mindMuscleCue": "Cầm quai cáp bên hông, nghiêng thân người sang một bên rồi dùng cơ liên sườn đối diện siết thẳng đứng người dậy.",
      "feelingLocation": "Dọc hai bờ eo liên sườn",
      "bodyView": "front"
    },
    "cableConfig": {
      "pulleyRatio": "2:1",
      "defaultStackKg": 15,
      "noteVi": "Chỉnh ròng rọc cáp thấp nhất hoặc cầm quai đơn."
    },
    "images": [
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_High-Pulley_Cable_Side_Bends/0.jpg",
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_High-Pulley_Cable_Side_Bends/1.jpg"
    ],
    "videoEmbedId": "pAplQXk3dkU",
    "videoQuery": "cable side bend form obliques",
    "setup": "Đứng nghiêng bên cạnh trụ cáp thấp. Tay gần cột cáp cầm quai cầm, tay kia đặt sau gáy hoặc chống eo.",
    "execution": "Nghiêng người về phía cột cáp để cơ liên sườn phía đối diện kéo căng, sau đó dùng cơ eo gập người thẳng dậy và siết chặt.",
    "mistakes": "Không xoay vặn thân người, chỉ di chuyển hoàn toàn trên mặt phẳng nghiêng bên."
  }
];
