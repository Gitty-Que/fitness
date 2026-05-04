import { useState, useEffect, useRef } from "react";

const DAYS = [
  {
    day: "Mo", full: "Montag", focus: "Unterer Rücken & Core", icon: "🦴", duration: 30,
    color: "#3b82f6", light: "#eff6ff", border: "#bfdbfe",
    warmup: ["3 Min Rudermaschine (leicht)", "Schulterkreisen 10× vor/zurück", "Hüftkreisen 10× je Seite"],
    exercises: [
      { name: "Katze-Kuh", sets: 3, reps: "10 Wdh", rest: 30, weight: "–" },
      { name: "Bird-Dog", sets: 3, reps: "8 je Seite", rest: 45, weight: "–" },
      { name: "Glute Bridge", sets: 3, reps: "12 Wdh", rest: 45, weight: "–" },
      { name: "Dead Bug", sets: 3, reps: "6 je Seite", rest: 45, weight: "–" },
      { name: "Superman", sets: 3, reps: "10 Wdh", rest: 45, weight: "–" },
      { name: "Seitplanke (mod.)", sets: 2, reps: "20 Sek/Seite", rest: 30, weight: "–" },
    ],
    cooldown: "Hüftbeuger · Piriformis · Kindpose – je 30 Sek"
  },
  {
    day: "Di", full: "Dienstag", focus: "Kardio – Rudermaschine", icon: "🚣", duration: 30,
    color: "#22c55e", light: "#f0fdf4", border: "#bbf7d0",
    warmup: ["5 Min Rudern sehr leicht", "Armkreisen, Oberkörper-Rotation"],
    exercises: [
      { name: "Gleichmäßiges Rudern", sets: 1, reps: "15 Min", rest: 60, weight: "22 Züge/Min" },
      { name: "Intervall: schnell", sets: 3, reps: "1 Min", rest: 60, weight: "Kraftvoll" },
      { name: "Intervall: locker", sets: 3, reps: "1 Min", rest: 0, weight: "18 Züge/Min" },
    ],
    cooldown: "5 Min Gehen · Waden- und Oberschenkeldehnung"
  },
  {
    day: "Mi", full: "Mittwoch", focus: "Kraft – Oberkörper", icon: "💪", duration: 35,
    color: "#a855f7", light: "#faf5ff", border: "#e9d5ff",
    warmup: ["3 Min Rudermaschine (leicht)", "Armkreisen, Schulterrotation"],
    exercises: [
      { name: "Bizeps-Curls", sets: 3, reps: "12 Wdh", rest: 60, weight: "2–5 kg" },
      { name: "Schulterpress", sets: 3, reps: "10 Wdh", rest: 60, weight: "2–5 kg" },
      { name: "Schulter seitlich", sets: 3, reps: "12 Wdh", rest: 60, weight: "1–3 kg" },
      { name: "Trizeps-Kickback", sets: 3, reps: "12 je Arm", rest: 60, weight: "2–4 kg" },
      { name: "Bent-Over Row", sets: 3, reps: "10 Wdh", rest: 60, weight: "3–5 kg" },
      { name: "Chest Press", sets: 3, reps: "12 Wdh", rest: 60, weight: "3–5 kg" },
    ],
    cooldown: "Brust · Schulter · Trizeps – je 30 Sek"
  },
  {
    day: "Do", full: "Donnerstag", focus: "Aktive Erholung & Mobilität", icon: "🧘", duration: 20,
    color: "#eab308", light: "#fefce8", border: "#fef08a",
    warmup: [],
    exercises: [
      { name: "Yoga-Flow", sets: 1, reps: "10 Min", rest: 0, weight: "–" },
      { name: "Hüftbeuger-Dehnung", sets: 2, reps: "45 Sek/Seite", rest: 30, weight: "–" },
      { name: "LWS-Rotation", sets: 1, reps: "10× je Seite", rest: 30, weight: "–" },
      { name: "BWS-Mobilisation", sets: 1, reps: "10 Wdh", rest: 0, weight: "–" },
    ],
    cooldown: "4-7-8 Atemübung · 3 Runden"
  },
  {
    day: "Fr", full: "Freitag", focus: "Kraft – Unterkörper", icon: "🦵", duration: 35,
    color: "#ef4444", light: "#fef2f2", border: "#fecaca",
    warmup: ["3 Min Rudermaschine", "Beinkreisen, Knieheben auf der Stelle"],
    exercises: [
      { name: "Stuhl-Squat", sets: 3, reps: "12 Wdh", rest: 60, weight: "ohne/2–3 kg" },
      { name: "Ausfallschritte", sets: 3, reps: "8 je Seite", rest: 60, weight: "ohne/2–3 kg" },
      { name: "Seitl. Ausfallschritt", sets: 3, reps: "8 je Seite", rest: 60, weight: "ohne/1–2 kg" },
      { name: "Einbeinige Bridge", sets: 3, reps: "10 je Seite", rest: 45, weight: "–" },
      { name: "Wadenheben", sets: 3, reps: "15 Wdh", rest: 45, weight: "ohne/3–5 kg" },
    ],
    cooldown: "Quadrizeps · Hamstring · Wade · Hüfte – je 30 Sek"
  },
  {
    day: "Sa", full: "Samstag", focus: "Kardio + Rücken-Kombi", icon: "🔥", duration: 30,
    color: "#f97316", light: "#fff7ed", border: "#fed7aa",
    warmup: ["5 Min Rudern leicht"],
    exercises: [
      { name: "Rudern Ausdauer", sets: 1, reps: "20 Min", rest: 0, weight: "Technik-Fokus" },
      { name: "Bird-Dog (Pause)", sets: 1, reps: "8 je Seite", rest: 30, weight: "–" },
    ],
    cooldown: "LWS · Piriformis · Oberschenkel – je 30 Sek"
  },
  {
    day: "So", full: "Sonntag", focus: "Ruhetag", icon: "😴", duration: 0,
    color: "#6b7280", light: "#f9fafb", border: "#e5e7eb",
    warmup: [],
    exercises: [{ name: "Optional: Stretching", sets: 1, reps: "10 Min", rest: 0, weight: "–" }],
    cooldown: ""
  },
];

const DETAILS = {
  "Katze-Kuh": { pos: "Vierfüßlerstand: Hände unter Schultern, Knie unter Hüften.", exec: "Einatmen → Bauch sinkt, Kopf & Steißbein heben (Kuh). Ausatmen → Rücken rundet sich nach oben, Kopf fällt (Katze). Fließend wechseln.", cue: "Im Atemrhythmus bewegen – nicht hetzen." },
  "Bird-Dog": { pos: "Vierfüßlerstand, Rücken neutral, Core leicht angespannt.", exec: "Rechten Arm + linkes Bein gleichzeitig strecken, 2 Sek halten. Kontrolliert zurück, Seite wechseln.", cue: "Hüfte bleibt waagerecht – kein Verdrehen!" },
  "Glute Bridge": { pos: "Rückenlage, Knie gebeugt, Füße hüftbreit, Arme neben dem Körper.", exec: "Gesäß anspannen, Becken heben bis Schulter-Hüfte-Knie eine Linie bilden. 2 Sek halten, kontrolliert ablassen.", cue: "Nicht ins Hohlkreuz drücken – Bauch bleibt aktiv." },
  "Dead Bug": { pos: "Rückenlage. Arme senkrecht zur Decke, Beine in 90° angehoben.", exec: "Rechten Arm + linkes Bein langsam strecken – nur so weit, wie LWS am Boden bleibt. Zurück, Seite wechseln.", cue: "Lendenwirbel muss den Boden berühren – das ist der Kontrollpunkt!" },
  "Superman": { pos: "Bauchlage, Arme nach vorne gestreckt, Stirn zum Boden.", exec: "Arme und Beine gleichzeitig 2–3 cm heben. 2–3 Sek halten, ablassen.", cue: "Klein denken – wenige Zentimeter genügen. Kein Überstrecken." },
  "Seitplanke (mod.)": { pos: "Seitlage auf Unterarm, Knie angewinkelt auf Boden.", exec: "Hüfte heben bis Schulter-Hüfte-Knie eine Linie bilden. Halten, ruhig atmen.", cue: "Schulter nicht einknicken. Fortgeschritten: Beine gestreckt." },
  "Bizeps-Curls": { pos: "Stand, Hanteln in den Händen, Ellbogen am Körper.", exec: "Hanteln in 2 Sek nach oben, kurz halten, in 3 Sek ablassen.", cue: "Langsam ablassen – das macht den Muskel stark!" },
  "Schulterpress": { pos: "Stand, Hanteln auf Schulterhöhe, Handflächen nach vorne.", exec: "Hanteln senkrecht nach oben drücken, kontrolliert zurück auf Schulterhöhe.", cue: "Core anspannen – nicht ins Hohlkreuz fallen." },
  "Schulter seitlich": { pos: "Stand, Hanteln neben den Oberschenkeln, Ellbogen minimal gebeugt.", exec: "Arme seitlich bis Schulterhöhe heben, 1 Sek halten, langsam ablassen.", cue: "Schultern entspannt lassen – nicht hochziehen!" },
  "Trizeps-Kickback": { pos: "Oberkörper 45° vorgeneigt, Ellbogen am Körper auf 90° angewinkelt.", exec: "Unterarm nach hinten strecken bis Arm gerade, 1 Sek halten, zurück.", cue: "Nur der Unterarm bewegt sich – Oberarm bleibt still." },
  "Bent-Over Row": { pos: "Füße hüftbreit, Knie leicht gebeugt, Oberkörper ~45° vorgebeugt, Rücken gerade.", exec: "Hanteln nah am Körper nach oben ziehen, Schulterblätter zusammenführen. Langsam ablassen.", cue: "Rücken gerade halten – runder Rücken ist der häufigste Fehler!" },
  "Chest Press": { pos: "Rückenlage, Knie gebeugt, Hanteln auf Brusthöhe, Ellbogen 45° vom Körper.", exec: "Hanteln nach oben drücken, kurz halten, ablassen bis Ellbogen leicht unter Schulterhöhe.", cue: "Schulterblätter in die Matte drücken für Stabilität." },
  "Stuhl-Squat": { pos: "Stand vor Stuhl, Füße schulterbreit, Zehen leicht nach außen.", exec: "Langsam zum Stuhl hinsetzen – Gewicht in den Fersen, Oberkörper aufrecht. Hochdrücken.", cue: "Knie zeigen in Richtung der Zehen – nicht nach innen fallen!" },
  "Ausfallschritte": { pos: "Stand, Hanteln optional seitlich.", exec: "Großer Schritt nach vorne, beide Knie ~90°, hinteres Knie knapp über Boden. Zurückschieben, Seite wechseln.", cue: "Rumpf aufrecht – nicht nach vorne lehnen." },
  "Seitl. Ausfallschritt": { pos: "Stand, Füße zusammen.", exec: "Großer Schritt zur Seite, Hüfte zurück und zur Seite, Knie über Fuß. Standbein gestreckt. Zurückdrücken.", cue: "Gleichgewicht ist die Hauptaufgabe – langsam und kontrolliert." },
  "Einbeinige Bridge": { pos: "Rückenlage wie Glute Bridge, ein Bein gestreckt nach oben.", exec: "Becken mit Standbein heben, gestrecktes Bein in der Luft. 2 Sek halten.", cue: "Hüfte waagerecht halten – nicht zur Seite absinken." },
  "Wadenheben": { pos: "Stand an Wand (leichte Abstützung), Füße hüftbreit.", exec: "Auf Zehenspitzen heben, 1–2 Sek halten, langsam ablassen.", cue: "Langsames Ablassen trainiert mehr als das Heben." },
  "Yoga-Flow": { pos: "Barfuß auf der Matte.", exec: "Kindpose (30 Sek) → Katze-Kuh (5×) → Herabschauender Hund (30 Sek) → Krieger I re (30 Sek) → Krieger I li (30 Sek) → Kindpose.", cue: "Nur so weit gehen wie angenehm – kein Wettkampf." },
  "Hüftbeuger-Dehnung": { pos: "Tiefer Ausfallschritt: ein Knie am Boden, anderer Fuß vorne.", exec: "Oberkörper aufrecht, Becken nach vorne/unten schieben. Spannung im Hüftbeuger spüren.", cue: "Rücken gerade – Arm hochstrecken intensiviert die Dehnung." },
  "LWS-Rotation": { pos: "Rückenlage, Arme seitlich ausgestreckt, Knie angewinkelt.", exec: "Beide Knie zusammen langsam zur Seite legen. Schultern bleiben flach. Zurück, Seite wechseln.", cue: "Kein Schwung – langsam und bewusst." },
  "BWS-Mobilisation": { pos: "Auf zusammengerolltem Handtuch quer zwischen den Schulterblättern.", exec: "Arme hinter den Kopf, Brustwirbelsäule über das Handtuch strecken. Kurz halten, Position verschieben.", cue: "Nur BWS strecken – Lendenwirbel bleibt neutral." },
  "Gleichmäßiges Rudern": { pos: "Auf der Rudermaschine, Füße fixiert, aufrechter Oberkörper.", exec: "Beine drücken → Körper lehnt leicht zurück → Arme ziehen. Umgekehrt: Arme → Körper → Beine.", cue: "Immer Beine zuerst – nie mit dem Rücken reißen!" },
  "Intervall: schnell": { pos: "Auf der Rudermaschine.", exec: "1 Min kraftvolles Rudern, maximale Schlagfrequenz.", cue: "Kurze, explosive Züge – Beine pushen!" },
  "Intervall: locker": { pos: "Auf der Rudermaschine.", exec: "1 Min ruhiges Rudern zur Erholung, 18 Züge/Min.", cue: "Durchatmen, Puls senken." },
  "Rudern Ausdauer": { pos: "Auf der Rudermaschine.", exec: "Gleichmäßiges Tempo, Technik-Fokus: Beine-Körper-Arme Rhythmus.", cue: "Sprechen muss möglich sein – nicht zu intensiv." },
  "Bird-Dog (Pause)": { pos: "Vierfüßlerstand.", exec: "Arm + Gegenbein strecken, 2 Sek halten, Seite wechseln.", cue: "Hüfte waagerecht." },
  "Optional: Stretching": { pos: "Yogamatte.", exec: "Beliebige Dehnübungen, die sich gut anfühlen.", cue: "Nur was angenehm ist – kein Schmerz." },
};

// --- Timer ---
function Timer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running && left > 0) {
      ref.current = setInterval(() => setLeft(l => {
        if (l <= 1) { clearInterval(ref.current); setRunning(false); onDone?.(); return 0; }
        return l - 1;
      }), 1000);
    }
    return () => clearInterval(ref.current);
  }, [running]);
  const pct = ((seconds - left) / seconds) * 100;
  const clr = left > seconds * 0.5 ? "#22c55e" : left > seconds * 0.2 ? "#f97316" : "#ef4444";
  return (
    <div style={{ textAlign: "center", padding: "6px 0" }}>
      <svg width={72} height={72} viewBox="0 0 80 80">
        <circle cx={40} cy={40} r={34} fill="none" stroke="#e5e7eb" strokeWidth={6} />
        <circle cx={40} cy={40} r={34} fill="none" stroke={clr} strokeWidth={6}
          strokeDasharray={`${2 * Math.PI * 34}`}
          strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
          strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.9s" }} />
        <text x={40} y={45} textAnchor="middle" fontSize={17} fontWeight="bold" fill="#1f2937">
          {left < 60 ? `${left}s` : `${Math.ceil(left / 60)}m`}
        </text>
      </svg>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 4 }}>
        <button onClick={() => { if (!running && left > 0) setRunning(true); else { clearInterval(ref.current); setRunning(false); } }}
          style={{ background: running ? "#ef4444" : "#22c55e", color: "#fff", border: "none", borderRadius: 20, padding: "5px 14px", fontWeight: "bold", fontSize: 13, cursor: "pointer" }}>
          {running ? "⏸" : left === 0 ? "✓" : "▶"}
        </button>
        <button onClick={() => { clearInterval(ref.current); setRunning(false); setLeft(seconds); }}
          style={{ background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 13, cursor: "pointer" }}>↺</button>
      </div>
    </div>
  );
}

// --- Workout Screen (guided mode) ---
function WorkoutScreen({ day, onBack }) {
  const [phase, setPhase] = useState("warmup");
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const ex = day.exercises[exIdx];
  const totalEx = day.exercises.length;
  const progress = Math.round(((exIdx + (setIdx / (ex?.sets || 1))) / totalEx) * 100);

  const nextSet = () => {
    setShowDetail(false);
    if (setIdx + 1 < ex.sets) {
      setSetIdx(s => s + 1);
      if (ex.rest > 0) setResting(true);
    } else {
      if (exIdx + 1 < totalEx) {
        setExIdx(i => i + 1);
        setSetIdx(0);
        setResting(false);
      } else {
        setPhase("cooldown");
      }
    }
  };

  if (phase === "done") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 64 }}>🏆</div>
      <div style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937" }}>Einheit abgeschlossen!</div>
      <div style={{ fontSize: 15, color: "#6b7280" }}>{day.full} · {day.focus}</div>
      <button onClick={onBack} style={{ marginTop: 16, background: day.color, color: "#fff", border: "none", borderRadius: 24, padding: "12px 32px", fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>← Zurück</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: day.color, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontSize: 14 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: 15 }}>{day.icon} {day.full} – Geführtes Training</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{day.focus}</div>
        </div>
      </div>
      {phase === "exercise" && (
        <div style={{ height: 4, background: "#e5e7eb", flexShrink: 0 }}>
          <div style={{ height: "100%", background: day.color, width: `${progress}%`, transition: "width 0.3s" }} />
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {phase === "warmup" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#1f2937" }}>🔆 Aufwärmen</div>
            {day.warmup.length === 0
              ? <p style={{ color: "#6b7280" }}>Kein separates Aufwärmen – direkt loslegen.</p>
              : day.warmup.map((w, i) => (
                <div key={i} style={{ background: "#f3f4f6", borderRadius: 10, padding: "10px 14px", marginBottom: 8, fontSize: 14, color: "#374151" }}>• {w}</div>
              ))}
            <button onClick={() => setPhase("exercise")}
              style={{ width: "100%", marginTop: 12, background: day.color, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>
              Übungen starten →
            </button>
          </div>
        )}
        {phase === "exercise" && ex && !resting && (
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Übung {exIdx + 1} / {totalEx}</div>
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#1f2937", marginBottom: 6 }}>{ex.name}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ background: day.light, color: day.color, border: `1px solid ${day.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 13, fontWeight: "bold" }}>Satz {setIdx + 1} / {ex.sets}</span>
              <span style={{ background: "#f3f4f6", color: "#374151", borderRadius: 20, padding: "3px 10px", fontSize: 13 }}>📊 {ex.reps}</span>
              {ex.weight !== "–" && <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "3px 10px", fontSize: 13 }}>⚖️ {ex.weight}</span>}
            </div>
            {DETAILS[ex.name] && (
              <div style={{ marginBottom: 12 }}>
                <button onClick={() => setShowDetail(d => !d)}
                  style={{ background: "none", border: `1px solid ${day.color}`, color: day.color, borderRadius: 20, padding: "5px 14px", fontSize: 13, cursor: "pointer" }}>
                  {showDetail ? "▲ Weniger" : "ℹ️ Ausführung"}
                </button>
                {showDetail && (
                  <div style={{ marginTop: 8, background: "#f9fafb", borderRadius: 12, padding: 12, fontSize: 13, color: "#374151" }}>
                    <div style={{ fontWeight: "bold", color: "#6b7280", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Position</div>
                    <p style={{ margin: "0 0 8px" }}>{DETAILS[ex.name].pos}</p>
                    <div style={{ fontWeight: "bold", color: "#6b7280", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Ausführung</div>
                    <p style={{ margin: "0 0 8px" }}>{DETAILS[ex.name].exec}</p>
                    <div style={{ background: "#fef9c3", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#713f12" }}>💡 {DETAILS[ex.name].cue}</div>
                  </div>
                )}
              </div>
            )}
            <button onClick={nextSet}
              style={{ width: "100%", background: day.color, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 17, fontWeight: "bold", cursor: "pointer", marginTop: 8 }}>
              {setIdx + 1 < ex.sets ? `Satz ${setIdx + 1} erledigt →` : exIdx + 1 < totalEx ? "Nächste Übung →" : "Zum Cooldown →"}
            </button>
          </div>
        )}
        {phase === "exercise" && resting && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}>Pause</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>Weiter: {ex.name} · Satz {setIdx + 1}/{ex.sets}</div>
            <Timer seconds={ex.rest} onDone={() => setResting(false)} />
            <button onClick={() => setResting(false)}
              style={{ marginTop: 12, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 20, padding: "8px 20px", fontSize: 14, cursor: "pointer" }}>
              Überspringen →
            </button>
          </div>
        )}
        {phase === "cooldown" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#1f2937" }}>❄️ Cooldown</div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 14, fontSize: 14, color: "#166534", marginBottom: 16 }}>{day.cooldown || "Ruhig ausatmen, Herzfrequenz senken."}</div>
            <button onClick={() => setPhase("done")}
              style={{ width: "100%", background: "#22c55e", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>
              Fertig! 🏆
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Day Detail Screen ---
function DayDetail({ day, onBack, onStartWorkout }) {
  const [openEx, setOpenEx] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ background: day.color, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 20, padding: "4px 10px", cursor: "pointer", fontSize: 14 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: 16 }}>{day.icon} {day.full}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{day.focus}</div>
        </div>
        {day.duration > 0 && (
          <button onClick={onStartWorkout}
            style={{ background: "rgba(255,255,255,0.25)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 20, padding: "7px 14px", fontWeight: "bold", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            ▶ Start
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {/* Meta */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {day.duration > 0 && <span style={{ background: day.light, color: day.color, border: `1px solid ${day.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: "bold" }}>⏱ {day.duration} Min</span>}
          <span style={{ background: "#f3f4f6", color: "#374151", borderRadius: 20, padding: "4px 12px", fontSize: 13 }}>🏋️ {day.exercises.length} Übungen</span>
        </div>

        {/* Warmup */}
        {day.warmup.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#6b7280", textTransform: "uppercase", marginBottom: 6 }}>🔆 Aufwärmen</div>
            {day.warmup.map((w, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontSize: 13, color: "#374151" }}>• {w}</div>
            ))}
          </div>
        )}

        {/* Exercises – all visible, expandable */}
        <div style={{ fontSize: 13, fontWeight: "bold", color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>🏃 Übungen</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {day.exercises.map((ex, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${openEx === i ? day.color : "#e5e7eb"}`, borderLeft: `4px solid ${day.color}`, borderRadius: 10, overflow: "hidden" }}>
              <button onClick={() => setOpenEx(openEx === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", padding: "11px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 14, color: "#1f2937" }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {ex.sets > 1 ? `${ex.sets} Sätze · ` : ""}{ex.reps}
                    {ex.weight !== "–" ? ` · ⚖️ ${ex.weight}` : ""}
                  </div>
                </div>
                <span style={{ color: day.color, fontSize: 16, marginLeft: 8 }}>{openEx === i ? "▲" : "▼"}</span>
              </button>
              {openEx === i && DETAILS[ex.name] && (
                <div style={{ padding: "0 12px 12px", fontSize: 13, color: "#374151", borderTop: `1px solid ${day.border}` }}>
                  <div style={{ marginTop: 10 }}>
                    <span style={{ fontWeight: "bold", fontSize: 11, color: "#6b7280", textTransform: "uppercase" }}>Ausgangsposition</span>
                    <p style={{ margin: "3px 0 8px" }}>{DETAILS[ex.name].pos}</p>
                    <span style={{ fontWeight: "bold", fontSize: 11, color: "#6b7280", textTransform: "uppercase" }}>Ausführung</span>
                    <p style={{ margin: "3px 0 8px" }}>{DETAILS[ex.name].exec}</p>
                    <div style={{ background: "#fef9c3", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "#713f12" }}>💡 {DETAILS[ex.name].cue}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cooldown */}
        {day.cooldown && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#6b7280", textTransform: "uppercase", marginBottom: 6 }}>❄️ Cooldown</div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#166534" }}>{day.cooldown}</div>
          </div>
        )}

        {/* Start Button bottom */}
        {day.duration > 0 && (
          <button onClick={onStartWorkout}
            style={{ width: "100%", background: day.color, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: "bold", cursor: "pointer", marginTop: 4 }}>
            ▶ Geführtes Training starten
          </button>
        )}
      </div>
    </div>
  );
}

// --- Home Screen ---
function HomeScreen({ onSelectDay }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: "#1f2937", color: "#fff", padding: "16px 16px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>🏋️ Fitness Zuhause</div>
        <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>50+ · Rücken · Kraft · Kardio</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 24px" }}>
        {/* Today Banner */}
        <div style={{ background: DAYS[todayIdx].color, color: "#fff", borderRadius: 16, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Heute · {DAYS[todayIdx].full}</div>
            <div style={{ fontSize: 18, fontWeight: "bold" }}>{DAYS[todayIdx].icon} {DAYS[todayIdx].focus}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{DAYS[todayIdx].duration > 0 ? `${DAYS[todayIdx].duration} Min` : "Ruhetag"}</div>
          </div>
          {DAYS[todayIdx].duration > 0 && (
            <button onClick={() => onSelectDay(todayIdx, "detail")}
              style={{ background: "rgba(255,255,255,0.25)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 20, padding: "10px 16px", fontWeight: "bold", fontSize: 14, cursor: "pointer" }}>
              Ansehen
            </button>
          )}
        </div>

        {/* Day List – expandable */}
        <div style={{ fontSize: 14, fontWeight: "bold", color: "#374151", marginBottom: 8 }}>Wochenplan</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${expandedDay === i ? d.color : d.border}`, borderLeft: `4px solid ${d.color}`, borderRadius: 12, overflow: "hidden" }}>
              {/* Row */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Expand toggle (down arrow) */}
                <button onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                  style={{ flex: 1, background: "none", border: "none", padding: "11px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>{d.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: "bold", fontSize: 14, color: "#1f2937" }}>{d.full}</span>
                      {i === todayIdx && <span style={{ background: d.color, color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: "bold" }}>Heute</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{d.focus}{d.duration > 0 ? ` · ${d.duration} Min` : ""}</div>
                  </div>
                  <span style={{ color: "#9ca3af", fontSize: 14 }}>{expandedDay === i ? "▲" : "▼"}</span>
                </button>
                {/* Start button (right arrow) */}
                {d.duration > 0 && (
                  <button onClick={() => onSelectDay(i, "workout")}
                    style={{ background: d.color, color: "#fff", border: "none", width: 44, alignSelf: "stretch", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>
                    ›
                  </button>
                )}
              </div>

              {/* Expanded exercise list */}
              {expandedDay === i && (
                <div style={{ borderTop: `1px solid ${d.border}`, background: d.light, padding: "10px 12px" }}>
                  {d.warmup.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: "bold", color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>Aufwärmen</div>
                      {d.warmup.map((w, j) => <div key={j} style={{ fontSize: 12, color: "#4b5563", marginBottom: 2 }}>• {w}</div>)}
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: "bold", color: "#6b7280", textTransform: "uppercase", marginBottom: 4 }}>Übungen</div>
                  {d.exercises.map((ex, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 8, padding: "7px 10px", marginBottom: 5, fontSize: 13 }}>
                      <span style={{ color: "#1f2937", fontWeight: "500" }}>{ex.name}</span>
                      <span style={{ color: "#6b7280", fontSize: 12, whiteSpace: "nowrap", marginLeft: 8 }}>{ex.sets > 1 ? `${ex.sets}×` : ""} {ex.reps}</span>
                    </div>
                  ))}
                  <button onClick={() => onSelectDay(i, "detail")}
                    style={{ width: "100%", marginTop: 8, background: d.color, color: "#fff", border: "none", borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
                    Details & Ausführung →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 12, marginTop: 14 }}>
          <div style={{ fontWeight: "bold", fontSize: 13, color: "#92400e", marginBottom: 6 }}>⚡ Wichtig</div>
          {["Bei akutem Hexenschuss pausieren – erst nach Abklingen trainieren.", "Rudermaschine: Immer Beine zuerst, nicht mit dem Rücken reißen.", "Stechender Schmerz → sofort aufhören."].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: "#78350f", marginBottom: 4, paddingLeft: 8, borderLeft: "2px solid #fbbf24" }}>• {t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Root ---
export default function App() {
  const [screen, setScreen] = useState("home");
  const [selDay, setSelDay] = useState(null);

  const handleSelect = (idx, mode) => { setSelDay(idx); setScreen(mode); };

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      {screen === "home" && <HomeScreen onSelectDay={handleSelect} />}
      {screen === "detail" && selDay !== null && (
        <DayDetail day={DAYS[selDay]} onBack={() => setScreen("home")} onStartWorkout={() => setScreen("workout")} />
      )}
      {screen === "workout" && selDay !== null && (
        <WorkoutScreen day={DAYS[selDay]} onBack={() => setScreen("home")} />
      )}
    </div>
  );
}