import os
import sys
import time
import subprocess
import re
import webbrowser

PORT = 5173
LOCAL_IP = "192.168.0.51"

print("=" * 60)
print("  FITBOD PRO - HE THONG KET NOI IPHONE TOAN CAU (4G/5G)")
print("=" * 60)

# 1. Kiem tra va khoi chay Vite Preview
print("[1/3] Kiem tra may chu web tai cong %d..." % PORT)
preview_proc = None
try:
    import urllib.request
    urllib.request.urlopen("http://localhost:%d/" % PORT, timeout=2)
    print("  [OK] May chu web dang hoat dong.")
except Exception:
    print("  -> Khoi dong Vite preview server...")
    preview_proc = subprocess.Popen(["npm.cmd", "run", "preview"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(3)

# 2. Khoi chay Cloudflare Tunnel
print("[2/3] Dang thiet lap duong truyen HTTPS Toan Cau qua Cloudflare...")
cloudflared_bin = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bin", "cloudflared.exe")

tunnel_proc = subprocess.Popen(
    [cloudflared_bin, "tunnel", "--url", "http://localhost:%d" % PORT],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    encoding="utf-8",
    errors="ignore"
)

public_url = None
start_time = time.time()
while time.time() - start_time < 15:
    line = tunnel_proc.stderr.readline()
    if not line:
        time.sleep(0.2)
        continue
    m = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
    if m:
        public_url = m.group(0)
        break

if not public_url:
    print("  [!] Chua lay duoc URL Cloudflare, dung link IP WiFi nha.")
    public_url = "http://%s:%d" % (LOCAL_IP, PORT)
else:
    print("  [OK] LINK HTTPS TOAN CAU CUA SEP: %s" % public_url)

# 3. Cap nhat LAUNCHER.html
print("[3/3] Dang cap nhat trang huong dan LAUNCHER.html...")
qr_url = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + public_url

html_template = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fitbod Pro - Cổng Kết Nối iPhone Toàn Cầu</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#f1f5f9] min-h-screen text-slate-900 p-4 md:p-8 flex items-center justify-center">
  <div class="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8">
    
    <div class="text-center mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black mb-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        KẾT NỐI TOÀN CẦU (4G/5G TẠI PHÒNG GYM)
      </div>
      <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
        FITBOD <span class="text-blue-600">PRO</span> MOBILE
      </h1>
      <p class="text-xs text-slate-500 mt-1">
        Tự do tập luyện tại mọi phòng gym ngoài trời hoặc tầng hầm
      </p>
    </div>

    <!-- MAIN CARD: GLOBAL HTTPS ACCESS -->
    <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 rounded-3xl shadow-xl mb-6 text-center relative overflow-hidden">
      <div class="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black tracking-wider uppercase mb-4">
        🌐 Quét Mã Bằng iPhone (Dùng Mạng 4G / 5G / WiFi Gym)
      </div>

      <!-- QR Code Image -->
      <div class="bg-white p-3 rounded-2xl inline-block shadow-2xl mx-auto mb-4 border border-white/20">
        <img 
          src="__QR_URL__" 
          alt="Mã QR Toàn Cầu" 
          class="w-48 h-48 md:w-52 md:h-52 object-contain rounded-xl"
        />
      </div>

      <div class="bg-black/30 backdrop-blur rounded-2xl p-3 mb-4 border border-white/10">
        <p class="text-[11px] text-blue-200 font-medium">Link bảo mật HTTPS toàn cầu:</p>
        <a href="__PUBLIC_URL__" target="_blank" class="text-sm md:text-base font-black text-amber-300 underline break-all hover:text-white transition">
          __PUBLIC_URL__
        </a>
      </div>

      <p class="text-xs text-blue-100 font-medium leading-relaxed">
        📱 Mở ứng dụng <b>Camera</b> trên iPhone, quét mã QR trên &rarr; Chạm vào liên kết vàng để mở app trên Safari.
      </p>
    </div>

    <!-- OFFLINE INSTALL GUIDE (PWA) -->
    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 text-slate-700">
      <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span>⚡ Cài đặt thành App chạy OFFLINE (Không cần mạng):</span>
      </h3>
      <ol class="text-xs space-y-2 pl-4 list-decimal text-slate-600 font-medium leading-relaxed">
        <li>Mở link trên bằng trình duyệt <b>Safari</b> của iPhone.</li>
        <li>Bấm biểu tượng <b>Chia sẻ</b> (ô vuông có mũi tên hướng lên ở thanh công cụ dưới).</li>
        <li>Cuộn xuống chọn <b>"Thêm vào MH chính" (Add to Home Screen)</b> &rarr; Bấm <b>Thêm</b>.</li>
        <li><b>Hoàn tất!</b> Toàn bộ bài tập, video, hình ảnh và bộ đếm đã được lưu trữ trong bộ nhớ iPhone. Kể cả khi Sếp vào phòng tập ở tầng hầm <b>không có sóng 4G hay WiFi</b>, app vẫn bật lên chạy 100% mượt mà!</li>
      </ol>
    </div>

    <!-- LOCAL WIFI BACKUP LINK -->
    <div class="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
      <div>
        <span class="font-bold text-slate-700 block">Dự phòng (Khi ở nhà cùng WiFi):</span>
        <a href="http://__LOCAL_IP__:__PORT__" target="_blank" class="text-blue-600 font-mono text-[11px] underline">
          http://__LOCAL_IP__:__PORT__
        </a>
      </div>
      <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">WiFi Nhà</span>
    </div>

  </div>
</body>
</html>"""

html_content = html_template.replace("__QR_URL__", qr_url).replace("__PUBLIC_URL__", public_url).replace("__LOCAL_IP__", LOCAL_IP).replace("__PORT__", str(PORT))

launcher_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "LAUNCHER.html")
with open(launcher_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("  [OK] Da cap nhat LAUNCHER.html thanh cong!")
webbrowser.open("file:///" + launcher_path.replace("\\", "/"))

print("=" * 60)
print("HE THONG DA SAN SANG PHUC VU SEP!")
print("   Link 4G/5G Ngoai Gym: %s" % public_url)
print("   Link WiFi O Nha:      http://%s:%d" % (LOCAL_IP, PORT))
print("   Nhan Ctrl + C neu muon dong ket noi.")
print("=" * 60)

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\\nDang dong ket noi...")
    tunnel_proc.terminate()
    if preview_proc:
        preview_proc.terminate()

