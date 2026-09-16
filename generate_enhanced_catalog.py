import json

# Database of enriched exercises with high quality images and form instructions
base_img = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"

catalog_data = [
  # CHEST
  {
    "id": "barbell_bench_press",
    "name": "Barbell Bench Press",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [{"muscle": "chest", "ratio": 0.70}],
    "secondaryMuscles": [{"muscle": "triceps", "ratio": 0.20}, {"muscle": "shoulders", "ratio": 0.10}],
    "images": [
      base_img + "Barbell_Bench_Press_-_Medium_Grip/0.jpg",
      base_img + "Barbell_Bench_Press_-_Medium_Grip/1.jpg"
    ],
    "videoQuery": "how to barbell bench press form",
    "videoEmbedId": "rT7DgCr-3pg",
    "setup": "Nằm ngửa trên ghế phẳng, mắt ngay dưới thanh đòn. Bàn chân đặt vững trên sàn, ưỡn ngực nhẹ và kéo xương bả vai về sau.",
    "execution": "Tháo đòn tạ, hít sâu gồng bụng, hạ tạ kiểm soát xuống chạm ngực giữa (khuỷu tay tạo góc 45-75 độ với thân người). Đẩy dứt khoát lên và thở ra.",
    "mistakes": "Không để cổ tay bị bẻ quặt ra sau, không nhấc mông khỏi ghế khi đẩy nặng, không để đòn tạ dội nảy trên lồng ngực."
  },
  {
    "id": "incline_dumbbell_press",
    "name": "Incline Dumbbell Press",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [{"muscle": "chest", "ratio": 0.65}, {"muscle": "shoulders", "ratio": 0.20}],
    "secondaryMuscles": [{"muscle": "triceps", "ratio": 0.15}],
    "images": [
      base_img + "Incline_Dumbbell_Press/0.jpg",
      base_img + "Incline_Dumbbell_Press/1.jpg"
    ],
    "videoEmbedId": "8iPEnn-ltC8",
    "setup": "Điều chỉnh ghế dốc khoảng 30 đến 45 độ. Ngồi vào ghế, đặt 2 quả tạ đơn trên đùi, dùng đùi hất tạ lên vào vị trí ngực trên.",
    "execution": "Hạ tạ xuống hai bên ngực cho đến khi cảm nhận ngực trên căng hết cỡ. Đẩy tạ lên theo hình vòng cung hội tụ nhẹ về phía đỉnh đầu.",
    "mistakes": "Ghế quá dốc (>45 độ) sẽ ăn vào cơ vai trước thay vì ngực trên. Không để 2 quả tạ va chạm mạnh vào nhau ở đỉnh."
  },
  {
    "id": "push_ups",
    "name": "Standard Push Up",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "horizontal_push",
    "primaryMuscles": [{"muscle": "chest", "ratio": 0.60}, {"muscle": "triceps", "ratio": 0.25}],
    "secondaryMuscles": [{"muscle": "shoulders", "ratio": 0.15}],
    "images": [
      base_img + "Pushups/0.jpg",
      base_img + "Pushups/1.jpg"
    ],
    "videoEmbedId": "IODxDxX7oi4",
    "setup": "Chống hai tay xuống sàn rộng hơn vai một chút, chân duỗi thẳng, thân người tạo thành một đường thẳng từ gót chân đến đầu.",
    "execution": "Gồng cơ bụng và cơ mông, hạ thân người xuống có kiểm soát cho đến khi ngực cách sàn khoảng 2-3 cm. Đẩy mạnh sàn để trở về vị trí đầu.",
    "mistakes": "Tránh để võng lưng dưới hoặc nhổm mông quá cao. Cùi chỏ không xòe ngang 90 độ vì dễ gây chấn thương khớp vai."
  },
  {
    "id": "chest_dip",
    "name": "Chest Dip (Xà kép)",
    "tier": 2,
    "equipment": "bodyweight",
    "movementPattern": "vertical_push",
    "primaryMuscles": [{"muscle": "chest", "ratio": 0.60}, {"muscle": "triceps", "ratio": 0.30}],
    "secondaryMuscles": [{"muscle": "shoulders", "ratio": 0.10}],
    "images": [
      base_img + "Dips_-_Chest_Version/0.jpg",
      base_img + "Dips_-_Chest_Version/1.jpg"
    ],
    "videoEmbedId": "2z8JmcrW-As",
    "setup": "Nắm thanh xà kép, nhảy lên khóa khớp khuỷu tay nhẹ. Hơi gập gối, chéo chân ra sau và đổ thân người về phía trước khoảng 20-30 độ.",
    "execution": "Hạ người xuống từ từ đến khi bắp tay song song với sàn (hoặc khuỷu tay gập 90 độ), cảm nhận ngực dưới căng giãn rồi đẩy người lên.",
    "mistakes": "Không đổ người về trước sẽ biến bài tập thành Dip cho tay sau. Tránh hạ quá sâu gây áp lực quá tải lên bao khớp vai."
  },

  # BACK / LATS
  {
    "id": "barbell_deadlift",
    "name": "Barbell Conventional Deadlift",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [{"muscle": "lower_back", "ratio": 0.35}, {"muscle": "hamstrings", "ratio": 0.35}, {"muscle": "glutes", "ratio": 0.30}],
    "secondaryMuscles": [{"muscle": "lats", "ratio": 0.10}, {"muscle": "forearms", "ratio": 0.10}],
    "images": [
      base_img + "Barbell_Deadlift/0.jpg",
      base_img + "Barbell_Deadlift/1.jpg"
    ],
    "videoEmbedId": "op9kVnSso6Q",
    "setup": "Đứng mở chân rộng bằng hông, thanh đòn cắt ngang giữa mu bàn chân. Cúi gập hông nắm đòn tạ, kéo ống chân chạm nhẹ vào thanh đòn.",
    "execution": "Hít sâu gồng chặt khoang bụng, kéo thẳng tạ dọc theo ống chân bằng cách đạp chân đẩy sàn xuống. Khi tạ qua gối, đẩy hông về trước để đứng thẳng.",
    "mistakes": "Cấm tuyệt đối cong lưng tôm (cong cột sống). Không giật tạ đột ngột bằng lưng mà phải phát lực từ chân đạp sàn."
  },
  {
    "id": "lat_pulldown",
    "name": "Cable Front Lat Pulldown",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [{"muscle": "lats", "ratio": 0.75}],
    "secondaryMuscles": [{"muscle": "biceps", "ratio": 0.25}, {"muscle": "upper_back", "ratio": 0.10}],
    "images": [
      base_img + "Full_Range-Of-Motion_Lat_Pulldown/0.jpg",
      base_img + "Full_Range-Of-Motion_Lat_Pulldown/1.jpg"
    ],
    "videoEmbedId": "CAwf7n6Luuc",
    "setup": "Ngồi vào máy kéo cáp, điều chỉnh đệm đùi áp sát chân. Nắm thanh đòn rộng hơn vai, lòng bàn tay hướng về phía trước, ngả lưng nhẹ 10-15 độ.",
    "execution": "Kéo thanh đòn xuống chạm phần xương quai xanh (ngực trên), tập trung kéo bằng cùi chỏ và ép chặt cơ lưng xô ở điểm cuối.",
    "mistakes": "Không kéo tạ ra sau gáy (rất nguy hiểm cho khớp vai). Tránh ngả người ra sau quá nhiều để giật tạ theo quán tính."
  },
  {
    "id": "pull_up",
    "name": "Pull Up (Kéo xà đơn)",
    "tier": 1,
    "equipment": "bodyweight",
    "movementPattern": "vertical_pull",
    "primaryMuscles": [{"muscle": "lats", "ratio": 0.70}],
    "secondaryMuscles": [{"muscle": "biceps", "ratio": 0.20}, {"muscle": "upper_back", "ratio": 0.10}],
    "images": [
      base_img + "Pullups/0.jpg",
      base_img + "Pullups/1.jpg"
    ],
    "videoEmbedId": "eGo4IYlbE5g",
    "setup": "Nắm xà đơn với lòng bàn tay hướng ra ngoài, tay mở rộng hơn vai một chút. Treo người tự do, thả lỏng bả vai.",
    "execution": "Chủ động ghì xương bả vai xuống trước, sau đó kéo cùi chỏ về phía hông để nâng thân người lên đến khi cằm vượt qua xà. Hạ chậm có kiểm soát.",
    "mistakes": "Không vung vẩy người hoặc dùng chân lấy đà. Tránh thả rơi tự do ở cuối hiệp tập gây sốc khớp vai."
  },
  {
    "id": "seated_cable_row",
    "name": "Seated Cable Row",
    "tier": 2,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [{"muscle": "upper_back", "ratio": 0.60}, {"muscle": "lats", "ratio": 0.30}],
    "secondaryMuscles": [{"muscle": "biceps", "ratio": 0.10}],
    "images": [
      base_img + "Seated_Cable_Rows/0.jpg",
      base_img + "Seated_Cable_Rows/1.jpg"
    ],
    "videoEmbedId": "GZbfZ033f74",
    "setup": "Ngồi vào máy kéo cáp, đặt chân lên bàn đỡ, đầu gối hơi gập nhẹ. Cầm tay nắm chữ V, ngồi thẳng lưng, vai mở tự nhiên.",
    "execution": "Kéo tay cầm về phía bụng dưới, ép chặt hai xương bả vai vào nhau ở vị trí cuối cùng, giữ lại 1 giây rồi thả chậm ra trước.",
    "mistakes": "Tránh đung đưa người ra sau ra trước lấy đà. Không rụt vai về phía tai."
  },

  # SHOULDERS
  {
    "id": "overhead_press",
    "name": "Standing Barbell Overhead Press (OHP)",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "vertical_push",
    "primaryMuscles": [{"muscle": "shoulders", "ratio": 0.70}],
    "secondaryMuscles": [{"muscle": "triceps", "ratio": 0.20}, {"muscle": "upper_back", "ratio": 0.10}],
    "images": [
      base_img + "Standing_Military_Press/0.jpg",
      base_img + "Standing_Military_Press/1.jpg"
    ],
    "videoEmbedId": "2yjwXTZQDDI",
    "setup": "Đứng mở chân rộng bằng vai, nắm đòn tạ ngang vai trên. Cẳng tay thẳng đứng vuông góc với sàn, siết chặt mông và cơ bụng.",
    "execution": "Nghiêng đầu nhẹ ra sau để đòn tạ đi thẳng lên, đẩy dứt khoát qua đầu. Khi tạ qua đỉnh đầu thì đưa đầu về vị trí trung tính và khóa khớp nhẹ.",
    "mistakes": "Không ưỡn cong lưng dưới quá mức khi tạ nặng (gây đau lưng). Luôn giữ cơ mông và cơ lõi gồng cứng."
  },
  {
    "id": "dumbbell_lateral_raise",
    "name": "Dumbbell Lateral Raise (Bay vai ngang)",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation",
    "primaryMuscles": [{"muscle": "shoulders", "ratio": 1.0}],
    "secondaryMuscles": [{"muscle": "traps", "ratio": 0.10}],
    "images": [
      base_img + "Seated_Side_Lateral_Raise/0.jpg",
      base_img + "Seated_Side_Lateral_Raise/1.jpg"
    ],
    "videoEmbedId": "3VcKaXpzqRo",
    "setup": "Đứng thẳng hoặc ngồi ghế, hai tay cầm tạ đơn buông nhẹ hai bên hông. Hơi gập nhẹ khớp khuỷu tay và nghiêng thân người về trước 5 độ.",
    "execution": "Nâng tạ sang hai bên ngang tầm vai, dẫn động bằng khuỷu tay. Tưởng tượng như đang rót nước từ bình, giữ 0.5s ở đỉnh rồi hạ chậm.",
    "mistakes": "Không nâng tạ quá cao quá mang tai (sẽ ăn vào cơ cầu vai). Tránh nhún nhảy đung đưa thân người để văng tạ."
  },
  {
    "id": "face_pull",
    "name": "Cable Face Pull",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "horizontal_pull",
    "primaryMuscles": [{"muscle": "shoulders", "ratio": 0.50}, {"muscle": "upper_back", "ratio": 0.40}],
    "secondaryMuscles": [{"muscle": "traps", "ratio": 0.10}],
    "images": [
      base_img + "Face_Pull/0.jpg",
      base_img + "Face_Pull/1.jpg"
    ],
    "videoEmbedId": "rep-qVOkqgk",
    "setup": "Gắn tay cầm dây thừng vào chốt cáp ở độ cao ngang trán hoặc mắt. Nắm 2 đầu dây với ngón tay cái hướng ra sau.",
    "execution": "Kéo dây thừng thẳng về phía sống mũi hoặc trán, đồng thời tách 2 đầu dây ra hai bên và xoay ngoài khớp vai để khuỷu tay cao hơn vai.",
    "mistakes": "Không dùng mức tạ quá nặng làm gập cổ hoặc ngửa người ra sau. Tập trung vào việc kích hoạt vai sau và cơ xoay vai."
  },

  # ARMS (BICEPS & TRICEPS)
  {
    "id": "barbell_bicep_curl",
    "name": "Barbell Bicep Curl",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "isolation_curl",
    "primaryMuscles": [{"muscle": "biceps", "ratio": 0.90}],
    "secondaryMuscles": [{"muscle": "forearms", "ratio": 0.20}],
    "images": [
      base_img + "Barbell_Curl/0.jpg",
      base_img + "Barbell_Curl/1.jpg"
    ],
    "videoEmbedId": "kwG2ipFRgfo",
    "setup": "Đứng thẳng, nắm thanh đòn rộng bằng vai, lòng bàn tay hướng lên trên. Ép chặt hai khuỷu tay sát mạn sườn.",
    "execution": "Giữ cố định khuỷu tay, cuộn thanh đòn lên cao và siết chặt cơ bắp tay trước ở đỉnh. Thả tạ từ từ trong 2-3 giây để kéo căng sợi cơ.",
    "mistakes": "Không đẩy khuỷu tay về phía trước khi cuộn tạ. Tuyệt đối không ngả người ra sau đung đưa tạ."
  },
  {
    "id": "dumbbell_hammer_curl",
    "name": "Dumbbell Hammer Curl",
    "tier": 3,
    "equipment": "dumbbell",
    "movementPattern": "isolation_curl",
    "primaryMuscles": [{"muscle": "biceps", "ratio": 0.60}, {"muscle": "forearms", "ratio": 0.40}],
    "secondaryMuscles": [],
    "images": [
      base_img + "Cable_Hammer_Curls_-_Rope_Attachment/0.jpg",
      base_img + "Cable_Hammer_Curls_-_Rope_Attachment/1.jpg"
    ],
    "videoEmbedId": "zC3nLlEvin4",
    "setup": "Cầm tạ đơn ở hai bên hông với lòng bàn tay hướng vào nhau (kiểu cầm búa). Đứng vững, ngực mở rộng.",
    "execution": "Cuộn tạ lên hướng về phía vai trước, giữ nguyên vị trí cổ tay và khuỷu tay cố định. Siết chặt cơ bắp tay ngoài và cơ cẳng tay.",
    "mistakes": "Không xoay cổ tay trong lúc nâng. Tránh để tạ đung đưa theo quán tính bước đi."
  },
  {
    "id": "tricep_rope_pushdown",
    "name": "Cable Tricep Rope Pushdown",
    "tier": 3,
    "equipment": "cable",
    "movementPattern": "isolation_extension",
    "primaryMuscles": [{"muscle": "triceps", "ratio": 1.0}],
    "secondaryMuscles": [],
    "images": [
      base_img + "Triceps_Pushdown_-_Rope_Attachment/0.jpg",
      base_img + "Triceps_Pushdown_-_Rope_Attachment/1.jpg"
    ],
    "videoEmbedId": "vB5OHsJ3EME",
    "setup": "Gắn tay nắm dây thừng vào chốt cáp trên cao. Cầm 2 đầu dây, hơi nghiêng người về trước nhẹ, khuỷu tay ép chặt sát hông.",
    "execution": "Duỗi thẳng cẳng tay xuống dưới hoàn toàn. Ở vị trí đáy, tách hai đầu dây sang hai bên để ép tối đa cơ tay sau (cả đầu trong lẫn đầu ngoài).",
    "mistakes": "Không để khuỷu tay di chuyển lên xuống. Toàn bộ phần cánh tay trên phải được khóa cố định sát thân người."
  },
  {
    "id": "skull_crusher",
    "name": "Barbell Skull Crusher (Lying Triceps Extension)",
    "tier": 3,
    "equipment": "barbell",
    "movementPattern": "isolation_extension",
    "primaryMuscles": [{"muscle": "triceps", "ratio": 1.0}],
    "secondaryMuscles": [],
    "images": [
      base_img + "Decline_Close-Grip_Bench_To_Skull_Crusher/0.jpg",
      base_img + "Decline_Close-Grip_Bench_To_Skull_Crusher/1.jpg"
    ],
    "videoEmbedId": "d_KZxkY_0cM",
    "setup": "Nằm ngửa trên ghế phẳng, cầm thanh đòn EZ hoặc đòn thẳng, giơ hai tay vuông góc với trần nhà.",
    "execution": "Giữ cố định bắp tay trên, từ từ gập khuỷu tay hạ đòn tạ về phía trán hoặc đỉnh đầu. Dùng lực cơ tay sau đẩy đòn tạ trở lại vị trí ban đầu.",
    "mistakes": "Khuỷu tay không được xòe rộng sang hai bên. Hãy kiểm soát tốc độ hạ tạ để tránh va chạm vào đầu."
  },

  # LEGS
  {
    "id": "barbell_squat",
    "name": "Barbell Back Squat",
    "tier": 1,
    "equipment": "barbell",
    "movementPattern": "squat",
    "primaryMuscles": [{"muscle": "quads", "ratio": 0.60}, {"muscle": "glutes", "ratio": 0.30}],
    "secondaryMuscles": [{"muscle": "hamstrings", "ratio": 0.10}, {"muscle": "lower_back", "ratio": 0.10}],
    "images": [
      base_img + "Barbell_Full_Squat/0.jpg",
      base_img + "Barbell_Full_Squat/1.jpg"
    ],
    "videoEmbedId": "bEv6CCg2BC8",
    "setup": "Đặt đòn tạ lên cơ cầu vai (High bar) hoặc gai xương bả vai (Low bar). Chân mở rộng bằng vai, mũi chân xoay nhẹ ra ngoài 15-30 độ.",
    "execution": "Hít sâu gồng chặt khoang bụng, đẩy mông ra sau và hạ đùi xuống đến khi nếp gấp hông thấp hơn đầu gối. Đạp mạnh sàn bằng cả bàn chân để đứng dậy.",
    "mistakes": "Không để đầu gối chụm vào trong (Valgus knee collapse). Không nhấc gót chân khỏi sàn khi ngồi xổm."
  },
  {
    "id": "dumbbell_walking_lunges",
    "name": "Dumbbell Walking Lunges",
    "tier": 2,
    "equipment": "dumbbell",
    "movementPattern": "lunge",
    "primaryMuscles": [{"muscle": "quads", "ratio": 0.50}, {"muscle": "glutes", "ratio": 0.40}],
    "secondaryMuscles": [{"muscle": "calves", "ratio": 0.10}],
    "images": [
      base_img + "Dumbbell_Lunges/0.jpg",
      base_img + "Dumbbell_Lunges/1.jpg"
    ],
    "videoEmbedId": "D7KaRcUTQeE",
    "setup": "Hai tay cầm tạ đơn hai bên hông, đứng thẳng người, ngực mở rộng và mắt nhìn về phía trước.",
    "execution": "Bước dài một chân về phía trước, hạ thân người thẳng đứng xuống cho đến khi đầu gối sau gần chạm sàn (cả hai gối tạo góc 90 độ). Đạp gót chân trước đứng lên bước tiếp.",
    "mistakes": "Không để đầu gối chân trước lao quá xa vượt mũi chân. Tránh đập mạnh đầu gối sau xuống sàn."
  },
  {
    "id": "leg_press",
    "name": "45-Degree Machine Leg Press",
    "tier": 2,
    "equipment": "machine",
    "movementPattern": "squat",
    "primaryMuscles": [{"muscle": "quads", "ratio": 0.65}, {"muscle": "glutes", "ratio": 0.25}],
    "secondaryMuscles": [{"muscle": "hamstrings", "ratio": 0.10}],
    "images": [
      base_img + "Leg_Press/0.jpg",
      base_img + "Leg_Press/1.jpg"
    ],
    "videoEmbedId": "IZxyjW7MPJQ",
    "setup": "Ngồi vào máy, áp sát toàn bộ lưng và mông vào đệm ghế. Đặt hai bàn chân rộng bằng vai ở giữa bàn đạp.",
    "execution": "Mở khóa chốt an toàn, hít sâu hạ bàn đạp xuống chậm rãi đến khi gối tạo góc 90 độ. Đạp mạnh bằng gót và giữa bàn chân để đẩy bàn đạp lên.",
    "mistakes": "TUYỆT ĐỐI KHÔNG KHÓA CỨNG KHỚP GỐI ở vị trí duỗi thẳng (rất dễ gãy khớp). Không nhấc mông khỏi đệm ghế khi hạ tạ sâu."
  },
  {
    "id": "romanian_deadlift",
    "name": "Barbell Romanian Deadlift (RDL)",
    "tier": 2,
    "equipment": "barbell",
    "movementPattern": "hip_hinge",
    "primaryMuscles": [{"muscle": "hamstrings", "ratio": 0.60}, {"muscle": "glutes", "ratio": 0.35}],
    "secondaryMuscles": [{"muscle": "lower_back", "ratio": 0.15}],
    "images": [
      base_img + "Romanian_Deadlift/0.jpg",
      base_img + "Romanian_Deadlift/1.jpg"
    ],
    "videoEmbedId": "JCXUYuzwNrM",
    "setup": "Đứng thẳng người cầm đòn tạ ở độ cao ngang hông. Chân mở hẹp hơn vai, giữ đầu gối hơi chùng nhẹ và cố định góc gối suốt bài tập.",
    "execution": "Đẩy mông tối đa về phía sau, trượt thanh đòn sát dọc theo đùi xuống ống chân cho đến khi cơ đùi sau căng hết cỡ. Dùng cơ mông và đùi sau siết mạnh kéo người đứng thẳng dậy.",
    "mistakes": "Không gập gối biến bài tập thành Squat. Không cong lưng tôm ở cuối biên độ."
  },
  {
    "id": "seated_leg_curl",
    "name": "Machine Seated Leg Curl",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [{"muscle": "hamstrings", "ratio": 1.0}],
    "secondaryMuscles": [{"muscle": "calves", "ratio": 0.10}],
    "images": [
      base_img + "Seated_Leg_Curl/0.jpg",
      base_img + "Seated_Leg_Curl/1.jpg"
    ],
    "videoEmbedId": "ELOCsoDSmrg",
    "setup": "Ngồi vào máy, áp sát lưng vào tựa. Cố định đệm giữ đùi phía trên gối, đệm cuộn tạ đặt ngay phía sau gân gót chân Achilles.",
    "execution": "Cuộn chân gập về phía dưới ghế hết biên độ, giữ lại 1 giây siết chặt cơ đùi sau rồi thả chậm về vị trí ban đầu trong 2-3 giây.",
    "mistakes": "Không nhấc đùi khỏi ghế khi gập tạ. Tránh để tạ rơi tự do không có sự kiểm soát cơ bắp."
  },
  {
    "id": "standing_calf_raise",
    "name": "Standing Calf Raise (Nhón bắp chuối)",
    "tier": 3,
    "equipment": "machine",
    "movementPattern": "isolation",
    "primaryMuscles": [{"muscle": "calves", "ratio": 1.0}],
    "secondaryMuscles": [],
    "images": [
      base_img + "Standing_Calf_Raises/0.jpg",
      base_img + "Standing_Calf_Raises/1.jpg"
    ],
    "videoEmbedId": "-M4-G8p8fmc",
    "setup": "Đứng đặt mũi bàn chân lên mép bục, vai tựa vào đệm tạ máy. Đầu gối giữ thẳng nhưng không khóa khớp.",
    "execution": "Hạ gót chân xuống sâu dưới mép bục để kéo căng tối đa bắp chân, sau đó nhón hết cỡ lên đỉnh bằng phần ức bàn chân, siết chặt 1 giây.",
    "mistakes": "Không nhún nhảy nhanh làm mất hiệu quả tăng cơ bắp chuối. Luôn giữ nhịp dừng ở đỉnh và kéo giãn ở đáy."
  },

  # CORE
  {
    "id": "hanging_leg_raise",
    "name": "Hanging Leg Raise (Treo xà co bụng)",
    "tier": 4,
    "equipment": "bodyweight",
    "movementPattern": "core",
    "primaryMuscles": [{"muscle": "abs", "ratio": 1.0}],
    "secondaryMuscles": [{"muscle": "forearms", "ratio": 0.10}],
    "images": [
      base_img + "Hanging_Leg_Raise/0.jpg",
      base_img + "Hanging_Leg_Raise/1.jpg"
    ],
    "videoEmbedId": "hdng3Nm1x_E",
    "setup": "Treo người tự do trên xà đơn, hai tay nắm rộng hơn vai, chân duỗi thẳng.",
    "execution": "Gồng cơ bụng cuộn xương chậu lên và nâng 2 chân thẳng (hoặc co gối) lên cao qua mức ngang hông. Hạ xuống từ từ không để người bị đung đưa.",
    "mistakes": "Tránh dùng đà văng chân từ phía sau. Nếu chưa đủ khỏe hãy bắt đầu bằng bài co đầu gối (Hanging Knee Raise)."
  },
  {
    "id": "plank",
    "name": "Forearm Plank (Tấm ván)",
    "tier": 4,
    "equipment": "bodyweight",
    "movementPattern": "core",
    "primaryMuscles": [{"muscle": "abs", "ratio": 1.0}],
    "secondaryMuscles": [{"muscle": "shoulders", "ratio": 0.10}],
    "images": [
      base_img + "Plank/0.jpg",
      base_img + "Plank/1.jpg"
    ],
    "videoEmbedId": "ASdvN_XEl_c",
    "setup": "Chống cùi chỏ vuông góc xuống sàn ngay dưới vai. Mũi chân chống sàn, hai chân khép nhẹ.",
    "execution": "Siết chặt cơ mông, cuộn xương chậu nhẹ để gồng cứng cơ bụng, giữ toàn thân thẳng tắp từ đầu đến gót chân. Hít thở sâu và đều đặn.",
    "mistakes": "Tuyệt đối không để võng thắt lưng (sẽ gây đau lưng dưới). Không nhổm mông lên trời."
  }
]

# Write exerciseCatalog.ts
content = '''import { MuscleGroup, MuscleInfo, ExerciseItem } from '../types';

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
  videoEmbedId?: string;
  setup?: string;
  execution?: string;
  mistakes?: string;
})[] = ''' + json.dumps(catalog_data, indent=2, ensure_ascii=False) + ''';
'''

with open('g:/AppGym/src/data/exerciseCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Generated enhanced exerciseCatalog.ts successfully!")
