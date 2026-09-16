import { MuscleGroup, MuscleInfo, ExerciseItem } from '../types';

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
    "videoEmbedId": "0xRvl4Qv3EY",
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
    "videoEmbedId": "M1N8844oXRQ",
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
    "videoEmbedId": "WEM9yP_Qk_0",
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
    "videoEmbedId": "eGjt4lkGeZ4",
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
    "videoEmbedId": "4kZ2VvO5p-k",
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
    "videoEmbedId": "FWJR5Ve8gkQ",
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
    "videoEmbedId": "ecRF8ERf54k",
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
      }
    ],
    "secondaryMuscles": [
      {
        "muscle": "lats",
        "ratio": 0.3
      },
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
    "videoEmbedId": "l_vRk6g31y4",
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
    "videoEmbedId": "b-ztMQpE0wU",
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
    "videoEmbedId": "2q8fEw3q5b0",
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
    "videoEmbedId": "AsAVbBNbKwg",
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
    "videoEmbedId": "_Gs0t8zK-8A",
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
    "videoQuery": "seated dumbbell overhead triceps extension",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-triceps-extension.mp4",
    "setup": "Ngồi trên ghế thẳng lưng, dùng 2 tay đỡ lòng quả tạ đơn giơ thẳng qua đầu.",
    "execution": "Chỉ gập cùi chỏ hạ tạ ra sau đầu đến khi tay sau căng dãn tối đa. Đẩy tạ thẳng đứng lên trên thở ra.",
    "mistakes": "Không xòe cùi chỏ quá rộng sang hai bên làm giảm áp lực lên đầu dài."
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
    "mistakes": "Không đung đưa hạ cùi chỏ xuống đất làm mất lực cô lập."
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
    "tier": 2,
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
    "videoEmbedId": "MeIiIdhpXTs",
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
    "videoEmbedId": "8PO0YgKjK3A",
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
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-femoral.mp4",
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
    "videoQuery": "barbell hip thrust proper form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-straight-leg-deadlift.mp4",
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
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-lateral-raise.mp4",
    "videoEmbedId": "1T6mJmFj2R0",
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
    "videoQuery": "seated calf raise form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/donkey-calf-raise.mp4",
    "videoEmbedId": "JbyjNymZOt0",
    "setup": "Ngồi vào máy, đệm tỳ trên đầu gối, chân đặt nửa bàn trên bục.",
    "execution": "Nhón gót chân lên cao tối đa, hạ sâu kéo dãn gân gót.",
    "mistakes": "Không bật nảy gót chân."
  },
  {
    "id": "cable_woodchopper",
    "name": "Cable Woodchopper (Kéo cáp chéo chém củi)",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
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
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation",
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
    "videoEmbedId": "2fouro_YQnk",
    "setup": "Quỳ gối trước giàn cáp cao, 2 tay giữ 2 đầu dây thừng bên tai.",
    "execution": "Gập người cuộn tròn cột sống xuống sàn, thở hết hơi siết cơ bụng.",
    "mistakes": "CẤM gập hông biến thành ngồi xổm, hông phải giữ nguyên góc 90 độ."
  },
  {
    "id": "hanging_leg_raise",
    "name": "Hanging Leg Raise (Treo xà nhấc chân)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "isolation",
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
    "tier": 3,
    "equipment": "bodyweight",
    "movementPattern": "isolation",
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
    "videoQuery": "plank form proper",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/burpee.mp4",
    "videoEmbedId": "ASdvN_XEl_c",
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
    "videoQuery": "stationary bike workout form",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/burpee.mp4",
    "videoEmbedId": "v8j-Y8Q3n7E",
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
    "videoQuery": "incline treadmill walking for fat loss",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/burpee.mp4",
    "videoEmbedId": "q8b5L6-8oD8",
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
    "videoQuery": "how to use elliptical machine properly",
    "videoUrl": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/burpee.mp4",
    "videoEmbedId": "kLzN2L5q4Yg",
    "setup": "Đứng vững 2 chân lên bàn đạp, 2 tay nắm tay cầm di động.",
    "execution": "Đạp chân theo quỹ đạo tròn mượt mà kết hợp tay đẩy kéo nhịp nhàng.",
    "mistakes": "Không kiễng gót chân rời khỏi bàn đạp quá nhiều."
  }
];
