// Wir holen uns die Hooks direkt aus dem globalen React-Objekt
const { useState, useEffect, useRef } = React;

const DAYS = [ 
    { day: "Mo", full: "Montag", focus: "Unterer Rücken & Core", icon: "🦴", duration: 30, color: "#3b82f6", light: "#eff6ff", border: "#bfdbfe", warmup: ["3 Min Rudermaschine (leicht)", "Schulterkreisen 10× vor/zurück", "Hüftkreisen 10× je Seite"], exercises: [ { name: "Katze-Kuh", sets: 3, reps: "10 Wdh", rest: 30, weight: "–" }, { name: "Bird-Dog", sets: 3, reps: "8 je Seite", rest: 45, weight: "–" }, { name: "Glute Bridge", sets: 3, reps: "12 Wdh", rest: 45, weight: "–" }, { name: "Dead Bug", sets: 3, reps: "6 je Seite", rest: 45, weight: "–" }, { name: "Superman", sets: 3, reps: "10 Wdh", rest: 45, weight: "–" }, { name: "Seitplanke (mod.)", sets: 2, reps: "20 Sek/Seite", rest: 30, weight: "–" }, ], cooldown: "Hüftbeuger · Piriformis · Kindpose – je 30 Sek" }, 
    { day: "Di", full: "Dienstag", focus: "Kardio – Rudermaschine", icon: "🚣", duration: 30, color: "#22c55e", light: "#f0fdf4", border: "#bbf7d0", warmup: ["5 Min Rudern sehr leicht", "Armkreisen, Oberkörper-Rotation"], exercises: [ { name: "Gleichmäßiges Rudern", sets: 1, reps: "15 Min", rest: 60, weight: "22 Züge/Min" }, { name: "Intervall: schnell", sets: 3, reps: "1 Min", rest: 60, weight: "Kraftvoll" }, { name: "Intervall: locker", sets: 3, reps: "1 Min", rest: 0, weight: "18 Züge/Min" }, ], cooldown: "5 Min Gehen · Waden- und Oberschenkeldehnung" }, 
    { day: "Mi", full: "Mittwoch", focus: "Kraft – Oberkörper", icon: "💪", duration: 35, color: "#a855f7", light: "#faf5ff", border: "#e9d5ff", warmup: ["3 Min Rudermaschine (leicht)", "Armkreisen, Schulterrotation"], exercises: [ { name: "Bizeps-Curls", sets: 3, reps: "12 Wdh", rest: 60, weight: "2–5 kg" }, { name: "Schulterpress", sets: 3, reps: "10 Wdh", rest: 60, weight: "2–5 kg" }, { name: "Schulter seitlich", sets: 3, reps: "12 Wdh", rest: 60, weight: "1–3 kg" }, { name: "Trizeps-Kickback", sets: 3, reps: "12 je Arm", rest: 60, weight: "2–4 kg" }, { name: "Bent-Over Row", sets: 3, reps: "10 Wdh", rest: 60, weight: "3–5 kg" }, { name: "Chest Press", sets: 3, reps: "12 Wdh", rest: 60, weight: "3–5 kg" }, ], cooldown: "Brust · Schulter · Trizeps – je 30 Sek" }, 
    { day: "Do", full: "Donnerstag", focus: "Aktive Erholung & Mobilität", icon: "🧘", duration: 20, color: "#eab308", light: "#fefce8", border: "#fef08a", warmup: [], exercises: [ { name: "Yoga-Flow", sets: 1, reps: "10 Min", rest: 0, weight: "–" }, { name: "Hüftbeuger-Dehnung", sets: 2, reps: "45 Sek/Seite", rest: 30, weight: "–" }, { name: "LWS-Rotation", sets: 1, reps: "10× je Seite", rest: 30, weight: "–" }, { name: "BWS-Mobilisation", sets: 1, reps: "10 Wdh", rest: 0, weight: "–" }, ], cooldown: "4-7-8 Atemübung · 3 Runden" }, 
    { day: "Fr", full: "Freitag", focus: "Kraft – Unterkörper", icon: "🦵", duration: 35, color: "#ef4444", light: "#fef2f2", border: "#fecaca", warmup: ["3 Min Rudermaschine", "Beinkreisen, Knieheben auf der Stelle"], exercises: [ { name: "Stuhl-Squat", sets: 3, reps: "12 Wdh", rest: 60, weight: "ohne/2–3 kg" }, { name: "Ausfallschritte", sets: 3, reps: "8 je Seite", rest: 60, weight: "ohne/2–3 kg" }, { name: "Seitl. Ausfallschritt", sets: 3, reps: "8 je Seite", rest: 60, weight: "ohne/1–2 kg" }, { name: "Einbeinige Bridge", sets: 3, reps: "10 je Seite", rest: 45, weight: "–" }, { name: "Wadenheben", sets: 3, reps: "15 Wdh", rest: 45, weight: "ohne/3–5 kg" }, ], cooldown: "Quadrizeps · Hamstring · Wade · Hüfte – je 30 Sek" }, 
    { day: "Sa", full: "Samstag", focus: "Kardio + Rücken-Kombi", icon: "🔥", duration: 30, color: "#f97316", light: "#fff7ed", border: "#fed7aa", warmup: ["5 Min Rudern leicht"], exercises: [ { name: "Rudern Ausdauer", sets: 1, reps: "20 Min", rest: 0, weight: "Technik-Fokus" }, { name: "Bird-Dog (Pause)", sets: 1, reps: "8 je Seite", rest: 30, weight: "–" }, ], cooldown: "LWS · Piriformis · Oberschenkel – je 30 Sek" }, 
    { day: "So", full: "Sonntag", focus: "Ruhetag", icon: "😴", duration: 0, color: "#6b7280", light: "#f9fafb", border: "#e5e7eb", warmup: [], exercises: [{ name: "Optional: Stretching", sets: 1, reps: "10 Min", rest: 0, weight: "–" }], cooldown: "" }, 
];

const DETAILS = {
    "Katze-Kuh": { pos: "Vierfüßlerstand: Hände unter Schultern, Knie unter Hüften.", exec: "Einatmen → Bauch sinkt, Kopf & Steißbein heben (Kuh). Ausatmen → Rücken rundet sich nach oben, Kopf fällt (Katze). Fließend wechseln.", cue: "Im Atemrhythmus bewegen – nicht hetzen." },
    "Bird-Dog": { pos: "Vierfüßlerstand, Rücken neutral, Core leicht angespannt.", exec: "Rechten Arm + linkes Bein gleichzeitig strecken, 2 Sek halten. Kontrolliert zurück, Seite wechseln.", cue: "Hüfte bleibt waagerecht – kein Verdrehen!" },
    "Bird-Dog (Pause)": { pos: "Vierfüßlerstand.", exec: "Arm + Gegenbein strecken, 2 Sek halten, Seite wechseln.", cue: "Hüfte waagerecht." },
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
    "Optional: Stretching": { pos: "Yogamatte.", exec: "Beliebige Dehnübungen, die sich gut anfühlen.", cue: "Nur was angenehm ist – kein Schmerz." },
};

// --- Sub-Komponenten ---
function Timer({ seconds, onDone }) {
    const [left, setLeft] = useState(seconds);
    const [running, setRunning] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (running && left > 0) {
            ref.current = setInterval(() => setLeft(l => {
                if (l <= 1) {
                    clearInterval(ref.current);
                    setRunning(false);
                    onDone?.();
                    return 0;
                }
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
                <circle cx={40} cy={40} r={34} fill="none" stroke={clr} strokeWidth={6} strokeDasharray={`${2 * Math.PI * 34}`} strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.9s" }} />
                <text x={40} y={45} textAnchor="middle" fontSize={17} fontWeight="bold" fill="#1f2937">{left < 60 ? `${left}s` : `${Math.ceil(left / 60)}m`}</text>
            </svg>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 4 }}>
                <button onClick={() => setRunning(!running)} style={{ background: running ? "#ef4444" : "#22c55e", color: "#fff", border: "none", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>{running ? "⏸" : "▶"}</button>
                <button onClick={() => { setRunning(false); setLeft(seconds); }} style={{ background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}>↺</button>
            </div>
        </div>
    );
}

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
                setPhase("done");
            }
        }
    };

    if (phase === "done") return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 24 }}>
            <div style={{ fontSize: 64 }}>🏆</div>
            <div style={{ fontSize: 22, fontWeight: "bold" }}>Einheit geschafft!</div>
            <button onClick={onBack} style={{ background: day.color, color: "#fff", border: "none", borderRadius: 24, padding: "12px 32px", fontSize: 16, fontWeight: "bold" }}>← Zurück</button>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ background: day.color, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 20 }}>←</button>
                <div style={{ fontWeight: "bold" }}>{day.icon} {day.full}</div>
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                {phase === "warmup" ? (
                    <div>
                        <h3>🔆 Aufwärmen</h3>
                        {day.warmup.map((w, i) => <p key={i}>• {w}</p>)}
                        <button onClick={() => setPhase("exercise")} style={{ width: "100%", background: day.color, color: "#fff", border: "none", padding: 14, borderRadius: 12, fontWeight: "bold" }}>Starten →</button>
                    </div>
                ) : !resting ? (
                    <div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Übung {exIdx + 1} / {totalEx}</div>
                        <h2 style={{ margin: "8px 0" }}>{ex.name}</h2>
                        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                            <span style={{ background: day.light, color: day.color, padding: "4px 12px", borderRadius: 20, fontWeight: "bold" }}>Satz {setIdx + 1} / {ex.sets}</span>
                            <span style={{ background: "#f3f4f6", padding: "4px 12px", borderRadius: 20 }}>{ex.reps}</span>
                        </div>
                        {DETAILS[ex.name] && (
                            <div style={{ background: "#f9fafb", padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 15 }}>
                                <b>💡 Tipp:</b> {DETAILS[ex.name].cue}
                            </div>
                        )}
                        <button onClick={nextSet} style={{ width: "100%", background: day.color, color: "#fff", border: "none", padding: 16, borderRadius: 14, fontWeight: "bold", fontSize: 18 }}>Satz erledigt</button>
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <h3>Pause</h3>
                        <Timer seconds={ex.rest} onDone={() => setResting(false)} />
                        <button onClick={() => setResting(false)} style={{ marginTop: 20, background: "none", border: "1px solid #ccc", padding: "8px 20px", borderRadius: 20 }}>Überspringen</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function DayDetail({ day, onBack, onStartWorkout }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ background: day.color, color: "#fff", padding: "16px", display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "5px 12px", borderRadius: 20 }}>←</button>
                <div style={{ fontWeight: "bold", fontSize: 18 }}>{day.icon} {day.full}</div>
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                <p style={{ color: "#6b7280", fontWeight: "bold" }}>Fokus: {day.focus}</p>
                <h3>Übungen:</h3>
                {day.exercises.map((ex, i) => (
                    <div key={i} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                        <div style={{ fontWeight: "bold" }}>{ex.name}</div>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>{ex.sets} Sätze · {ex.reps} {ex.weight !== "–" ? `· ${ex.weight}` : ""}</div>
                    </div>
                ))}
                {day.duration > 0 && (
                    <button onClick={onStartWorkout} style={{ width: "100%", background: day.color, color: "#fff", border: "none", padding: 15, borderRadius: 12, fontWeight: "bold", marginTop: 20 }}>Training Starten</button>
                )}
            </div>
        </div>
    );
}

function HomeScreen({ onSelectDay }) {
    const todayIdx = (new Date().getDay() + 6) % 7; 
    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#1f2937", color: "#fff", padding: "20px 16px" }}>
                <h1 style={{ margin: 0, fontSize: 22 }}>🏋️ Fitness 50+</h1>
            </div>
            <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
                {DAYS.map((d, i) => (
                    <div key={i} onClick={() => onSelectDay(i, "detail")} style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: `5px solid ${d.color}`, borderRadius: 12, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: "bold", color: i === todayIdx ? d.color : "#1f2937" }}>{d.full} {i === todayIdx && "(Heute)"}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>{d.icon} {d.focus}</div>
                        </div>
                        <span style={{ color: "#d1d5db" }}>❯</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Haupt-App ---
function App() {
    const [screen, setScreen] = useState("home");
    const [selDay, setSelDay] = useState(null);

    const handleSelect = (idx, mode) => {
        setSelDay(idx);
        setScreen(mode);
    };

    return (
        <div style={{ maxWidth: 450, margin: "0 auto", height: "100vh", background: "#f9fafb", overflow: "hidden" }}>
            {screen === "home" && <HomeScreen onSelectDay={handleSelect} />}
            {screen === "detail" && <DayDetail day={DAYS[selDay]} onBack={() => setScreen("home")} onStartWorkout={() => setScreen("workout")} />}
            {screen === "workout" && <WorkoutScreen day={DAYS[selDay]} onBack={() => setScreen("home")} />}
        </div>
    );
}

// Damit die index.html die Funktion findet
window.App = App;
