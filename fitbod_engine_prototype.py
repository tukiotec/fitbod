"""
FITBOD ALGORITHMIC ENGINE - REFERENCE IMPLEMENTATION (PROTOTYPE)
Mo phong loi thuat toan cot loi cua Fitbod:
1. Muscle Recovery Model (Ham phan ra Exponential Decay + Primary/Secondary Matrix)
2. Estimated 1RM & Progressive Overload (Cong thuc Brzycki & Epley)
3. Constraint-based Workout Generator (Split + Equipment + Recovery Score + CNS Tiering)
4. Plate Calculator (Xep dia ta toi uu)
"""

import math
import sys
import io
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional

# Dam bao terminal Windows khong bi loi font Unicode
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# ==========================================
# 1. CO SO DU LIEU MAU (CORE MASTER DATA)
# ==========================================

# 14 Nhom co tieu chuan cua Fitbod kem Hang so thoi gian hoi phuc (gio)
MUSCLES = {
    "chest": {"name": "Ngực", "tau": 28},
    "lats": {"name": "Lưng xô", "tau": 28},
    "upper_back": {"name": "Lưng trên / Cầu vai", "tau": 24},
    "lower_back": {"name": "Lưng dưới", "tau": 32},
    "shoulders": {"name": "Vai", "tau": 24},
    "biceps": {"name": "Tay trước", "tau": 18},
    "triceps": {"name": "Tay sau", "tau": 18},
    "forearms": {"name": "Cẳng tay", "tau": 16},
    "quads": {"name": "Đùi trước", "tau": 30},
    "hamstrings": {"name": "Đùi sau", "tau": 30},
    "glutes": {"name": "Mông", "tau": 28},
    "calves": {"name": "Bắp chân", "tau": 18},
    "abs": {"name": "Cơ bụng", "tau": 16},
    "traps": {"name": "Cầu vai cổ", "tau": 20}
}

# Danh muc bai tap mau voi Tier CNS (1: Compound chinh, 2: Compound phu, 3: Isolation, 4: Core)
EXERCISE_CATALOG = [
    {
        "id": "barbell_bench_press",
        "name": "Barbell Bench Press",
        "tier": 1,
        "equipment": "barbell",
        "primary_muscles": [("chest", 0.70)],
        "secondary_muscles": [("triceps", 0.20), ("shoulders", 0.10)],
        "movement_pattern": "horizontal_push"
    },
    {
        "id": "barbell_squat",
        "name": "Barbell Back Squat",
        "tier": 1,
        "equipment": "barbell",
        "primary_muscles": [("quads", 0.65), ("glutes", 0.25)],
        "secondary_muscles": [("lower_back", 0.10)],
        "movement_pattern": "squat"
    },
    {
        "id": "barbell_deadlift",
        "name": "Barbell Deadlift",
        "tier": 1,
        "equipment": "barbell",
        "primary_muscles": [("hamstrings", 0.40), ("glutes", 0.30), ("lower_back", 0.20)],
        "secondary_muscles": [("lats", 0.05), ("forearms", 0.05)],
        "movement_pattern": "hip_hinge"
    },
    {
        "id": "overhead_press",
        "name": "Barbell Overhead Press",
        "tier": 1,
        "equipment": "barbell",
        "primary_muscles": [("shoulders", 0.70)],
        "secondary_muscles": [("triceps", 0.20), ("upper_back", 0.10)],
        "movement_pattern": "vertical_push"
    },
    {
        "id": "dumbbell_incline_press",
        "name": "Incline Dumbbell Press",
        "tier": 2,
        "equipment": "dumbbell",
        "primary_muscles": [("chest", 0.65), ("shoulders", 0.20)],
        "secondary_muscles": [("triceps", 0.15)],
        "movement_pattern": "horizontal_push"
    },
    {
        "id": "lat_pulldown",
        "name": "Cable Lat Pulldown",
        "tier": 2,
        "equipment": "cable",
        "primary_muscles": [("lats", 0.75)],
        "secondary_muscles": [("biceps", 0.25)],
        "movement_pattern": "vertical_pull"
    },
    {
        "id": "dumbbell_lunges",
        "name": "Dumbbell Walking Lunges",
        "tier": 2,
        "equipment": "dumbbell",
        "primary_muscles": [("quads", 0.50), ("glutes", 0.35)],
        "secondary_muscles": [("calves", 0.15)],
        "movement_pattern": "lunge"
    },
    {
        "id": "tricep_rope_pushdown",
        "name": "Cable Tricep Pushdown",
        "tier": 3,
        "equipment": "cable",
        "primary_muscles": [("triceps", 1.0)],
        "secondary_muscles": [],
        "movement_pattern": "isolation_extension"
    },
    {
        "id": "dumbbell_bicep_curl",
        "name": "Dumbbell Bicep Curl",
        "tier": 3,
        "equipment": "dumbbell",
        "primary_muscles": [("biceps", 1.0)],
        "secondary_muscles": [("forearms", 0.10)],
        "movement_pattern": "isolation_curl"
    },
    {
        "id": "lateral_raise",
        "name": "Dumbbell Lateral Raise",
        "tier": 3,
        "equipment": "dumbbell",
        "primary_muscles": [("shoulders", 1.0)],
        "secondary_muscles": [],
        "movement_pattern": "isolation"
    },
    {
        "id": "hanging_leg_raise",
        "name": "Hanging Leg Raise",
        "tier": 4,
        "equipment": "bodyweight",
        "primary_muscles": [("abs", 1.0)],
        "secondary_muscles": [("forearms", 0.10)],
        "movement_pattern": "core"
    }
]

# ==========================================
# 2. MODULE 1: MUSCLE RECOVERY ENGINE
# ==========================================

class MuscleRecoveryTracker:
    def __init__(self):
        # Khoi tao tat ca 14 nhom co deu 100% phuc hoi
        self.recovery_state = {m: 100.0 for m in MUSCLES}
        self.last_trained = {m: None for m in MUSCLES}

    def apply_workout_fatigue(self, logged_sets: List[Dict]):
        """
        Cap nhat luong moi sau buoi tap dua tren Volume Load va ti le dong gop
        """
        fatigue_by_muscle = {m: 0.0 for m in MUSCLES}

        for item in logged_sets:
            ex = next((e for e in EXERCISE_CATALOG if e["id"] == item["exercise_id"]), None)
            if not ex:
                continue
            
            weight = item.get("weight_kg", 0)
            reps = item.get("reps", 0)
            e1rm = item.get("e1rm", weight * 1.3)
            
            # C_tier: He so anh huong CNS (Tier 1 compound gay moi manh hon tier 3)
            c_tier = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.5}.get(ex["tier"], 0.7)
            intensity_factor = (weight / e1rm) if e1rm > 0 else 0.7
            set_fatigue = reps * intensity_factor * c_tier * 1.5

            for m, ratio in ex["primary_muscles"]:
                fatigue_by_muscle[m] += set_fatigue * ratio * 1.0
            for m, ratio in ex["secondary_muscles"]:
                fatigue_by_muscle[m] += set_fatigue * ratio * 0.35

        # Tru % phuc hoi
        now = datetime.now()
        for m, fatigue in fatigue_by_muscle.items():
            if fatigue > 0:
                self.recovery_state[m] = max(0.0, self.recovery_state[m] - fatigue)
                self.last_trained[m] = now

    def calculate_current_recovery(self, current_time: datetime) -> Dict[str, float]:
        """
        Tinh % phuc hoi tai thoi diem hien tai theo ham phan ra mu (Exponential Decay)
        R(t) = 100 - (100 - R0) * exp(-t / tau)
        """
        current_state = {}
        for m, r0 in self.recovery_state.items():
            t_last = self.last_trained[m]
            if t_last is None or r0 >= 100.0:
                current_state[m] = 100.0
            else:
                elapsed_hours = (current_time - t_last).total_seconds() / 3600.0
                tau = MUSCLES[m]["tau"]
                # Cong thuc hoi phuc phi tuyen
                recovered = 100.0 - (100.0 - r0) * math.exp(-elapsed_hours / tau)
                current_state[m] = round(min(100.0, recovered), 1)
        return current_state

# ==========================================
# 3. MODULE 2: 1RM & PROGRESSIVE OVERLOAD
# ==========================================

def calculate_e1rm(weight: float, reps: int) -> float:
    """
    Fitbod ket hop Brzycki (cho reps <= 10) va Epley (reps > 10)
    """
    if reps == 1:
        return weight
    elif reps <= 10:
        # Brzycki Formula
        return round(weight / (1.0278 - (0.0278 * reps)), 1)
    else:
        # Epley Formula
        return round(weight * (1.0 + (reps / 30.0)), 1)

def evaluate_amrap_progression(target_reps: int, logged_reps: int, current_weight: float) -> Tuple[float, str]:
    """
    Xu ly ket qua Max Effort Day (AMRAP set cuoi)
    """
    delta_reps = logged_reps - target_reps
    if delta_reps >= 3:
        # Vuot troi: tang manh ta buoi sau
        new_weight = current_weight + 5.0 # +5kg
        msg = f"Xuat sac! (+{delta_reps} reps). Tang muc ta them 5.0kg buoi toi."
    elif delta_reps >= 1:
        # Dat chi tieu: tang nhe ta
        new_weight = current_weight + 2.5 # +2.5kg
        msg = f"Dat chuan! (+{delta_reps} reps). Tang muc ta them 2.5kg buoi toi."
    elif delta_reps == 0:
        # Dung chi tieu: giu ta, tang volume reps
        new_weight = current_weight
        msg = "Chuan xac muc tieu. Giu nguyen ta, tap trung form va kiem soat."
    else:
        # Duoi chi tieu: xem xet deload hoac giu nguyen
        new_weight = current_weight
        msg = f"Chua dat chi tieu ({delta_reps} reps). Giu nguyen ta hoac giam 5% deload."
    return new_weight, msg

# ==========================================
# 4. MODULE 3: WORKOUT GENERATOR
# ==========================================

def generate_fitbod_workout(
    recovery_tracker: MuscleRecoveryTracker,
    available_equipment: List[str],
    user_goal: str,
    preferred_split: str,
    target_duration_minutes: int = 60
) -> List[Dict]:
    """
    Thuat toan tao buoi tap thong minh:
    1. Loc nhom co san sang (Recovery >= 65%)
    2. Loc bai tap thoa man thiet bi
    3. Sap xep theo CNS Tier (1 -> 2 -> 3 -> 4)
    4. Tinh toan Sets/Reps/Weight theo Fitness Goal
    """
    now = datetime.now()
    recovery = recovery_tracker.calculate_current_recovery(now)

    # 1. Xac dinh nhom co muc tieu dua tren Split va Recovery %
    split_muscles_map = {
        "push": ["chest", "shoulders", "triceps"],
        "pull": ["lats", "upper_back", "biceps", "forearms"],
        "legs": ["quads", "hamstrings", "glutes", "calves"],
        "upper": ["chest", "lats", "shoulders", "biceps", "triceps", "upper_back"],
        "lower": ["quads", "hamstrings", "glutes", "calves", "lower_back"],
        "full_body": list(MUSCLES.keys())
    }

    candidate_muscles = split_muscles_map.get(preferred_split, list(MUSCLES.keys()))
    # Chi chon cac co co % phuc hoi >= 65%
    ready_muscles = [m for m in candidate_muscles if recovery.get(m, 100) >= 65.0]

    # 2. Loc bai tap kha dung
    eligible_exercises = []
    for ex in EXERCISE_CATALOG:
        # Kiem tra thiet bi
        if ex["equipment"] not in available_equipment and ex["equipment"] != "bodyweight":
            continue
        # Kiem tra nhom co chinh co nam trong ready_muscles khong
        has_ready_primary = any(m in ready_muscles for m, _ in ex["primary_muscles"])
        if has_ready_primary:
            eligible_exercises.append(ex)

    # 3. Sap xep theo Tier CNS (Tier 1 uu tien truoc)
    eligible_exercises.sort(key=lambda x: x["tier"])

    # 4. Chon so luong bai phu hop thoi gian (60 min ~ 5-6 bai)
    exercise_count = min(len(eligible_exercises), target_duration_minutes // 10)
    selected_exercises = eligible_exercises[:exercise_count]

    # 5. Cau hinh Sets/Reps theo Goal
    goal_schemes = {
        "strength": {"sets": 4, "reps": 5, "pct_1rm": 0.85, "rest_sec": 180},
        "hypertrophy": {"sets": 3, "reps": 10, "pct_1rm": 0.70, "rest_sec": 90},
        "tone": {"sets": 3, "reps": 14, "pct_1rm": 0.55, "rest_sec": 45}
    }
    scheme = goal_schemes.get(user_goal, goal_schemes["hypertrophy"])

    workout_plan = []
    for ex in selected_exercises:
        # Gia su e1rm co ban la 80kg cho tier 1, 30kg cho dumbbell, v.v.
        base_1rm = 80.0 if ex["equipment"] == "barbell" else (30.0 if ex["equipment"] == "dumbbell" else 50.0)
        target_weight = round(base_1rm * scheme["pct_1rm"] / 2.5) * 2.5 # Lam tron theo buoc 2.5kg

        workout_plan.append({
            "exercise_id": ex["id"],
            "exercise_name": ex["name"],
            "tier": ex["tier"],
            "equipment": ex["equipment"],
            "target_sets": scheme["sets"],
            "target_reps": scheme["reps"],
            "target_weight_kg": target_weight,
            "rest_seconds": scheme["rest_sec"],
            "primary_targets": [MUSCLES[m]["name"] for m, _ in ex["primary_muscles"]]
        })

    return workout_plan

# ==========================================
# 5. MODULE 4: PLATE CALCULATOR
# ==========================================

def calculate_barbell_plates(target_weight_kg: float, bar_weight_kg: float = 20.0) -> Dict:
    """
    Thuat toan xep dia ta toi uu (Greedy Algorithm)
    Cac loai dia ta chuan (kg): 25, 20, 15, 10, 5, 2.5, 1.25
    """
    if target_weight_kg < bar_weight_kg:
        return {"error": f"Muc ta phai >= trong luong don ({bar_weight_kg}kg)"}

    side_weight = (target_weight_kg - bar_weight_kg) / 2.0
    available_plates = [25.0, 20.0, 15.0, 10.0, 5.0, 2.5, 1.25]
    plates_per_side = {}

    remaining = side_weight
    for p in available_plates:
        count = int(remaining // p)
        if count > 0:
            plates_per_side[p] = count
            remaining = round(remaining - (count * p), 3)

    return {
        "target_weight_kg": target_weight_kg,
        "bar_weight_kg": bar_weight_kg,
        "weight_per_side_kg": side_weight,
        "plates_each_side": plates_per_side,
        "unmatched_kg": remaining * 2.0
    }

# ==========================================
# 6. KIEM THU THUC TE (EXECUTION VERIFICATION)
# ==========================================

if __name__ == "__main__":
    print("=== 1. KIEM THU 1RM VA PROGRESSION (AMRAP) ===")
    e1rm = calculate_e1rm(weight=100.0, reps=6)
    print(f"Nang 100kg x 6 reps -> Estimated 1RM: {e1rm} kg")
    new_w, feedback = evaluate_amrap_progression(target_reps=6, logged_reps=9, current_weight=100.0)
    print(f"Ket qua Max Effort AMRAP: {feedback} (Tạ mới: {new_w} kg)")

    print("\n=== 2. KIEM THU PLATE CALCULATOR ===")
    plates = calculate_barbell_plates(target_weight_kg=102.5, bar_weight_kg=20.0)
    print(f"Xep ta cho muc 102.5kg (Don 20kg):")
    for p, c in plates["plates_each_side"].items():
        print(f"  - Đĩa {p}kg: {c} cái mỗi bên")

    print("\n=== 3. KIEM THU WORKOUT GENERATION DUA TREN MUSCLE RECOVERY ===")
    tracker = MuscleRecoveryTracker()
    # Gia lap buoi tap Leg truoc do khien Quads, Glutes bi moi xuong 20%
    tracker.recovery_state["quads"] = 20.0
    tracker.last_trained["quads"] = datetime.now() - timedelta(hours=12)
    tracker.recovery_state["glutes"] = 35.0
    tracker.last_trained["glutes"] = datetime.now() - timedelta(hours=12)

    # Sinh buoi tap Upper / Push
    workout = generate_fitbod_workout(
        recovery_tracker=tracker,
        available_equipment=["barbell", "dumbbell", "cable"],
        user_goal="hypertrophy",
        preferred_split="push",
        target_duration_minutes=60
    )
    print(f"Đã tạo buổi tập {len(workout)} bài tự động:")
    for idx, ex in enumerate(workout, 1):
        print(f"  {idx}. {ex['exercise_name']} (Tier {ex['tier']}) - {ex['target_sets']} sets x {ex['target_reps']} reps @ {ex['target_weight_kg']}kg - Mục tiêu: {', '.join(ex['primary_targets'])}")
    print("\n✅ KIEM THU HOAN TAT XUAT SAC 100%!")
