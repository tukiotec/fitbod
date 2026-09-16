# 🏋️ Fitbod Pro - AI Workout Planner & Native iOS App

Fitbod Pro là ứng dụng lập kế hoạch thể hình thông minh cá nhân hóa theo chuẩn thuật toán Fitbod & sinh lý học phục hồi cơ bắp:
- **Cơ chế An Toàn Cột Sống (Thoát vị đĩa đệm L4-L5, L5-S1)**: Tự động loại trừ 13 bài nén dọc trục và lực cắt thắt lưng (Squat, Deadlift, Bent Row, OHP...), thay bằng máy Leg Press tựa lưng, Móc đùi sau, Chèo cáp có tựa và Plank tĩnh an toàn.
- **Thời Gian Nghỉ Khoa Học**: Khởi động 30s, Cơ nhỏ 45s, Máy/Cáp 60s, Tạ đòn nặng 90s.
- **Rung Im Lặng (Zero Noise)**: Báo giờ nghỉ qua Taptic Engine rung phần cứng, không phát tiếng ồn phòng tập.
- **Màn Hình Chờ & Dynamic Island**: Đếm ngược thời gian thực trên Lock Screen qua MediaSession & WakeLock.
- **Native iOS Ready**: Tích hợp Capacitor Native Plugins (`@capacitor/haptics`, `@capacitor/local-notifications`) hỗ trợ build file `.ipa` cài trực tiếp qua AltStore / Sideloadly.

## 🚀 Build & Chạy thử
```bash
npm install
npm run dev
npm run build
```

## 📱 Build iOS Native (.ipa)
Quy trình tự động được kích hoạt qua GitHub Actions (`.github/workflows/build-ios.yml`).
