Saya menambahkan server proxy di folder server/ yang meneruskan permintaan chat ke layanan Pateway.ai.

Untuk mengaktifkan client-side, tambahkan snippet ini ke bagian akhir <script type="module"> di index.html (sebelum tag penutup `</script>`):

```javascript
function appendMessage(role, text) {
  const container = document.getElementById("chat-container");
  const wrap = document.createElement("div");
  wrap.className = role === "user" ? "self-end text-right" : "self-start text-left";
  wrap.innerHTML = `
    <div class="inline-block max-w-[80%] ${role === "user" ? "bg-emerald-50 text-slate-800" : "bg-white/90 text-slate-800"} p-3 rounded-xl shadow-sm text-xs">
      ${text}
    </div>
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

document.getElementById("ai-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("ai-input");
  const message = input.value.trim();
  if (!message) return;
  appendMessage("user", message);
  input.value = "";

  const loadingEl = document.createElement("div");
  loadingEl.className = "text-xs text-slate-400";
  loadingEl.innerText = "Menunggu respons...";
  document.getElementById("chat-container").appendChild(loadingEl);
  document.getElementById("chat-container").scrollTop = document.getElementById("chat-container").scrollHeight;

  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await resp.json();
    loadingEl.remove();

    if (resp.ok && data.reply) {
      appendMessage("assistant", data.reply);
    } else {
      appendMessage("assistant", "Error: " + (data.error || JSON.stringify(data)));
    }
  } catch (err) {
    loadingEl.remove();
    appendMessage("assistant", "Terjadi kesalahan: " + err.message);
  }
});
```

Saya sengaja tidak memodifikasi index.html langsung di branch ini — jika Anda ingin, saya bisa membuat perubahan kecil untuk memasukkan snippet di tempat yang tepat. Saat ini saya hanya menambahkan server proxy dan instruksi agar Anda tidak menaruh API key di file publik.
