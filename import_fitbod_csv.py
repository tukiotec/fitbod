"""
FITBOD CSV IMPORTER & ANALYZER
Tool tự động phân tích file WorkoutExport.csv từ Fitbod và nạp vào hệ thống AppGym
"""

import os
import sys
import csv
import json
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Any

# Đảm bảo UTF-8 cho Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def calculate_e1rm(weight: float, reps: int) -> float:
    """Công thức Brzycki & Epley để tính Estimated 1RM"""
    if reps <= 0 or weight <= 0:
        return 0.0
    if reps == 1:
        return weight
    elif reps <= 10:
        return round(weight / (1.0278 - (0.0278 * reps)), 1)
    else:
        return round(weight * (1.0 + (reps / 30.0)), 1)

def parse_fitbod_csv(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        return {"error": f"Không tìm thấy file: {file_path}"}

    workouts = defaultdict(lambda: {"date": "", "exercises": defaultdict(list)})
    all_exercises = set()
    personal_records = {} # exercise -> {max_weight, max_volume, estimated_1rm, date}
    total_sets = 0
    total_volume = 0.0

    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        # Xác định cột trọng lượng (kg hoặc lbs)
        headers = reader.fieldnames or []
        weight_col = "Weight(kg)" if "Weight(kg)" in headers else ("Weight(lbs)" if "Weight(lbs)" in headers else "Weight")
        is_metric = "kg" in weight_col.lower()

        for row in reader:
            date_str = row.get("Date", "").strip()
            exercise = row.get("Exercise", "").strip()
            if not date_str or not exercise:
                continue

            try:
                reps = int(float(row.get("Reps", 0)))
            except ValueError:
                reps = 0

            try:
                weight = float(row.get(weight_col, 0))
            except ValueError:
                weight = 0.0

            try:
                multiplier = float(row.get("multiplier", 1.0))
            except ValueError:
                multiplier = 1.0

            is_warmup = row.get("isWarmup", "false").strip().lower() == "true"
            note = row.get("Note", "").strip()

            # Nhóm theo ngày buổi tập (yyyy-mm-dd)
            # Format Fitbod: "2022-01-05 22:06:49 +0000"
            date_key = date_str[:10]
            workouts[date_key]["date"] = date_str
            
            set_data = {
                "reps": reps,
                "weight": weight,
                "multiplier": multiplier,
                "effective_weight": round(weight * multiplier, 2),
                "is_warmup": is_warmup,
                "note": note
            }
            workouts[date_key]["exercises"][exercise].append(set_data)
            all_exercises.add(exercise)
            total_sets += 1

            # Tính volume và 1RM (chỉ tính working sets)
            if not is_warmup and reps > 0 and weight > 0:
                set_volume = weight * multiplier * reps
                total_volume += set_volume
                e1rm = calculate_e1rm(weight * multiplier, reps)

                if exercise not in personal_records:
                    personal_records[exercise] = {
                        "max_weight": weight * multiplier,
                        "max_e1rm": e1rm,
                        "best_set": f"{reps} reps @ {weight * multiplier} {'kg' if is_metric else 'lbs'}",
                        "last_performed": date_key
                    }
                else:
                    if e1rm > personal_records[exercise]["max_e1rm"]:
                        personal_records[exercise]["max_e1rm"] = e1rm
                        personal_records[exercise]["best_set"] = f"{reps} reps @ {weight * multiplier} {'kg' if is_metric else 'lbs'}"
                    if weight * multiplier > personal_records[exercise]["max_weight"]:
                        personal_records[exercise]["max_weight"] = weight * multiplier
                    personal_records[exercise]["last_performed"] = max(personal_records[exercise]["last_performed"], date_key)

    summary = {
        "total_workouts": len(workouts),
        "total_exercises_count": len(all_exercises),
        "total_sets_logged": total_sets,
        "total_volume_kg": round(total_volume, 1) if is_metric else round(total_volume * 0.453592, 1),
        "unit": "kg" if is_metric else "lbs",
        "date_range": {
            "first_workout": min(workouts.keys()) if workouts else None,
            "latest_workout": max(workouts.keys()) if workouts else None
        },
        "top_exercises_by_1rm": sorted(
            [{"exercise": k, **v} for k, v in personal_records.items()],
            key=lambda x: x["max_e1rm"],
            reverse=True
        )[:15],
        "workouts_detail": workouts
    }

    return summary

if __name__ == "__main__":
    csv_file = sys.argv[1] if len(sys.argv) > 1 else "g:/AppGym/sample_fitbod_export.csv"
    if not os.path.exists(csv_file):
        # Tạo file mẫu để test
        print(f"File {csv_file} chưa có, tạo dữ liệu mẫu kiểm thử...")
        sample_csv = """Date,Exercise,Reps,Weight(kg),Duration(s),Distance(m),Incline,Resistance,isWarmup,Note,multiplier
2024-03-01 10:00:00 +0000,Barbell Bench Press,10,60.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-01 10:00:00 +0000,Barbell Bench Press,8,70.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-01 10:00:00 +0000,Barbell Bench Press,6,80.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-01 10:00:00 +0000,Incline Dumbbell Press,10,24.0,0.0,0.0,0.0,0.0,false,,2.0
2024-03-01 10:00:00 +0000,Cable Tricep Pushdown,12,30.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-03 15:30:00 +0000,Barbell Back Squat,5,100.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-03 15:30:00 +0000,Barbell Back Squat,5,110.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-03 15:30:00 +0000,Barbell Back Squat,3,120.0,0.0,0.0,0.0,0.0,false,,1.0
"""
        with open(csv_file, "w", encoding="utf-8") as f:
            f.write(sample_csv)

    result = parse_fitbod_csv(csv_file)
    print("=== KẾT QUẢ PHÂN TÍCH FILE FITBOD WORKOUT EXPORT ===")
    print(f"Tổng số buổi tập: {result['total_workouts']}")
    print(f"Số bài tập khác nhau: {result['total_exercises_count']}")
    print(f"Tổng số sets: {result['total_sets_logged']}")
    print(f"Tổng khối lượng đã đẩy: {result['total_volume_kg']} kg")
    print(f"Khoảng thời gian: Từ {result['date_range']['first_workout']} đến {result['date_range']['latest_workout']}")
    print("\nTop bài tập và Estimated 1RM:")
    for item in result['top_exercises_by_1rm']:
        print(f"  - {item['exercise']}: e1RM = {item['max_e1rm']} {result['unit']} (Kỷ lục: {item['best_set']})")
